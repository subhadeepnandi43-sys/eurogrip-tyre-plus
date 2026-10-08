/**
 * Eurogrip TYRE+ | Rider Virtual Cockpit & Digital Garage
 * High-octane motorcycle companion featuring live cold pressure telemetry,
 * 32-motorcycle switcher, radial tread wear dial, holographic warranty pass,
 * certified garage booking, and 24x7 roadside emergency assistance.
 */

var S_RIDER = {
  pressureMode: "solo", // solo, pillion, monsoon, touring
  selectedGarageId: "GAR-BLR-01",
  viewMode: "cockpit" // "cockpit" (responsive wide) or "simulator" (smartphone frame)
};

// Device Detection Utility
function isMobileDevice() {
  var ua = navigator.userAgent || "";
  var isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  var isSmallScreen = window.innerWidth <= 768;
  return isMobileUA || isSmallScreen;
}

function setRiderViewMode(mode) {
  S_RIDER.viewMode = mode;
  var content = $("#portalContent");
  if (content && S.currentUser && S.currentUser.role !== "admin") {
    renderUserPortal(content, S.currentUser);
  }
}

function copyMobilePortalLink() {
  var url = window.location.href;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url);
    toast("Copied URL to clipboard! Open on your smartphone.");
  } else {
    toast("Mobile Link: " + url);
  }
}

function renderUserPortal(container, user) {
  var userBike = user.bike || S.bike || "Royal Enfield Classic 350";
  var bikeMeta = (typeof MOTORCYCLES_CATALOG !== "undefined" && MOTORCYCLES_CATALOG[userBike])
    ? MOTORCYCLES_CATALOG[userBike]
    : {
        category: "Cruisers & Modern Classics",
        engine: "349 cc SOHC",
        frontSize: "100/90-19",
        rearSize: "120/80-18",
        recommendedTyre: "Eurogrip ProTorq Extreme",
        soloFrontPsi: 28,
        soloRearPsi: 32,
        pillionFrontPsi: 30,
        pillionRearPsi: 36,
        weightKg: 195,
        icon: "👑"
      };

  var tyre = S.activeTyre || TYRE_DATABASE[DEFAULT_TYRE_ID];

  // Calculate dynamic Cold Pressure based on Mode
  var calcFrontPsi = bikeMeta.soloFrontPsi;
  var calcRearPsi = bikeMeta.soloRearPsi;
  var modeAdvice = "Baseline city commute pressure for balanced fuel economy and ride comfort.";

  if (S_RIDER.pressureMode === "pillion") {
    calcFrontPsi = bikeMeta.pillionFrontPsi;
    calcRearPsi = bikeMeta.pillionRearPsi;
    modeAdvice = "Increased rear pressure to handle pillion load, prevent rim bottoming & protect bead.";
  } else if (S_RIDER.pressureMode === "monsoon") {
    calcFrontPsi = Math.max(22, bikeMeta.soloFrontPsi - 2);
    calcRearPsi = Math.max(26, bikeMeta.soloRearPsi - 2);
    modeAdvice = "2 PSI lower to widen tyre footprint & activate interlocking silica sipes on wet asphalt.";
  } else if (S_RIDER.pressureMode === "touring") {
    calcFrontPsi = bikeMeta.soloFrontPsi + 2;
    calcRearPsi = bikeMeta.soloRearPsi + 3;
    modeAdvice = "Stiffened carcass prevents excessive heat buildup during continuous 90+ km/h highway runs.";
  }

  // Generate Motorcycle Selector Options across 32 models
  var bikeOptionsHtml = "";
  if (typeof MOTORCYCLES_CATALOG !== "undefined") {
    var groups = {};
    for (var b in MOTORCYCLES_CATALOG) {
      var cat = MOTORCYCLES_CATALOG[b].category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(b);
    }
    for (var grp in groups) {
      bikeOptionsHtml += '<optgroup label="' + grp + '">';
      groups[grp].forEach(function(bName) {
        bikeOptionsHtml += '<option value="' + bName + '" ' + (bName === userBike ? "selected" : "") + '>' + bName + '</option>';
      });
      bikeOptionsHtml += '</optgroup>';
    }
  }

  var html =
    '<div class="rider-garage-wrap">' +
      '<!-- RIDER COCKPIT HEADER WITH SWITCHERS -->' +
      '<div class="rider-top-bar">' +
        '<div>' +
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;flex-wrap:wrap">' +
            '<span class="tag cyan sm">🏍️ Connected Rider Virtual Cockpit</span>' +
            '<span style="color:var(--success);font-weight:700;font-size:0.85rem">● 5-Yr Security Shield Active</span>' +
          '</div>' +
          '<h2 style="margin:2px 0;font-size:2.4rem;color:#FFF">Welcome back, ' + esc(user.name) + '!</h2>' +
          '<p style="margin:0;color:var(--mute);font-size:0.92rem">' +
            'Primary Phone: <strong style="color:var(--cyan)">' + esc(user.phone) + '</strong> · Garage City: <strong>' + esc(user.city || "Bengaluru") + '</strong>' +
          '</p>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
          '<div class="rider-view-mode-bar">' +
            '<button class="rider-view-mode-btn ' + (S_RIDER.viewMode === "cockpit" ? "active" : "") + '" onclick="setRiderViewMode(\'cockpit\')">🖥️ Wide Cockpit</button>' +
            '<button class="rider-view-mode-btn ' + (S_RIDER.viewMode === "simulator" ? "active" : "") + '" onclick="setRiderViewMode(\'simulator\')">📱 Phone Frame</button>' +
          '</div>' +
          '<button class="rider-role-switch-btn" onclick="switchPortalRole(\'admin\')" title="Switch to Admin Console">👑 Switch to Admin Console</button>' +
          '<button class="btn sm" onclick="openPassportModal()">📱 Digital Passport</button>' +
          '<button class="btn sm ghost" onclick="logoutUser()">Sign Out</button>' +
        '</div>' +
      '</div>' +

      '<!-- 1. MY MACHINE HERO CARD & ACTIVE BIKE SWITCHER -->' +
      '<div class="rider-machine-hero">' +
        '<div class="machine-header-row">' +
          '<div>' +
            '<span class="tag sm ' + (bikeMeta.category.includes("Sports") ? "amber" : "cyan") + '">' + esc(bikeMeta.category) + '</span>' +
            '<h3 class="machine-name-title" style="margin-top:6px">' +
              '<span>' + (bikeMeta.icon || "🏍️") + '</span> ' + esc(userBike) +
            '</h3>' +
            '<div style="color:var(--mute);font-size:0.88rem;margin-top:4px">' +
              'Engine: <strong>' + esc(bikeMeta.engine) + '</strong> · Curb Weight: <strong>' + (bikeMeta.weightKg ? bikeMeta.weightKg + " kg" : "195 kg") + '</strong>' +
            '</div>' +
          '</div>' +
          '<div style="min-width:260px">' +
            '<label style="font-size:0.78rem;color:var(--mute);margin:0 0 4px;display:block">Switch Active Motorcycle (32 Models):</label>' +
            '<select onchange="changeRiderBike(this.value)" style="padding:9px 12px;font-size:0.88rem;background:#0A0F1D;border:1px solid rgba(0,229,255,0.3);color:#FFF;border-radius:6px;width:100%">' +
              bikeOptionsHtml +
            '</select>' +
          '</div>' +
        '</div>' +

        '<div class="spec-badges-grid" style="margin:16px 0 0">' +
          '<div class="spec-badge-item">' +
            '<span class="spec-badge-label">Fitted Tyre Model</span>' +
            '<span class="spec-badge-val" style="font-size:1rem;color:var(--amber)">' + tyre.model + '</span>' +
          '</div>' +
          '<div class="spec-badge-item">' +
            '<span class="spec-badge-label">Front Wheel Spec</span>' +
            '<span class="spec-badge-val" style="font-size:0.95rem;color:var(--cyan)">' + (bikeMeta.frontSize || "100/90-19") + '</span>' +
          '</div>' +
          '<div class="spec-badge-item">' +
            '<span class="spec-badge-label">Rear Wheel Spec</span>' +
            '<span class="spec-badge-val" style="font-size:0.95rem;color:var(--amber)">' + (bikeMeta.rearSize || tyre.size) + '</span>' +
          '</div>' +
          '<div class="spec-badge-item">' +
            '<span class="spec-badge-label">Loyalty Balance</span>' +
            '<span class="spec-badge-val" style="font-size:1.1rem;color:var(--success)">' + (user.points || S.rider) + ' pts</span>' +
          '</div>' +
        '</div>' +

        '<!-- RADIAL TREAD DEPTH & TYRE WEAR DIAL -->' +
        '<div class="tread-dial-container">' +
          '<div class="tread-dial-svg-box">' +
            '<svg viewBox="0 0 36 36" style="width:100%;height:100%">' +
              '<path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3.5" />' +
              '<path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10B981" stroke-width="3.5" stroke-dasharray="88, 100" stroke-linecap="round" />' +
            '</svg>' +
            '<div class="tread-dial-text">88%</div>' +
          '</div>' +
          '<div>' +
            '<strong style="color:#FFF;font-size:1.05rem">Tread Life: Prime Condition (88% Remaining)</strong>' +
            '<div style="color:var(--mute);font-size:0.85rem;margin-top:2px">' +
              'Virgin Tread: <strong>' + tyre.treadDepth + '</strong> · Estimated Life: <strong>' + (tyre.lifeEstimate || "32,000 km") + '</strong> · Next Inspection: <strong style="color:var(--amber)">In 90 Days</strong>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<!-- 2. TWO COLUMN COCKPIT: PRESSURE CALCULATOR & HOLOGRAPHIC PASS -->' +
      '<div class="grid g2" style="margin-top:24px">' +

        '<!-- REAL-TIME COLD PRESSURE CALCULATOR -->' +
        '<div class="pressure-calculator-box">' +
          '<div style="display:flex;justify-content:space-between;align-items:center">' +
            '<h3 style="margin:0;color:var(--cyan)">⚡ Cold Pressure Telemetry</h3>' +
            '<span class="tag sm cyan">Live Calibration</span>' +
          '</div>' +
          '<p style="color:var(--mute);font-size:0.88rem;margin:6px 0 12px">Select your ride mode to calculate optimal tyre inflation:</p>' +

          '<div class="pressure-modes-bar">' +
            '<button type="button" class="pressure-mode-btn ' + (S_RIDER.pressureMode === "solo" ? "active" : "") + '" onclick="setRiderPressureMode(\'solo\')">🏍️ Solo City</button>' +
            '<button type="button" class="pressure-mode-btn ' + (S_RIDER.pressureMode === "pillion" ? "active" : "") + '" onclick="setRiderPressureMode(\'pillion\')">👥 With Pillion</button>' +
            '<button type="button" class="pressure-mode-btn ' + (S_RIDER.pressureMode === "monsoon" ? "active" : "") + '" onclick="setRiderPressureMode(\'monsoon\')">🌧️ Monsoon Rain</button>' +
            '<button type="button" class="pressure-mode-btn ' + (S_RIDER.pressureMode === "touring" ? "active" : "") + '" onclick="setRiderPressureMode(\'touring\')">🛣️ Highway Tour</button>' +
          '</div>' +

          '<div class="gauges-display-grid">' +
            '<div class="digital-gauge-box">' +
              '<div class="digital-gauge-label">Target Front Wheel</div>' +
              '<div class="digital-gauge-value">' + calcFrontPsi + '<span style="font-size:1.1rem"> PSI</span></div>' +
              '<small style="color:var(--mute)">' + (bikeMeta.frontSize || "Front Wheel") + '</small>' +
            '</div>' +
            '<div class="digital-gauge-box rear">' +
              '<div class="digital-gauge-label">Target Rear Wheel</div>' +
              '<div class="digital-gauge-value">' + calcRearPsi + '<span style="font-size:1.1rem"> PSI</span></div>' +
              '<small style="color:var(--mute)">' + (bikeMeta.rearSize || "Rear Wheel") + '</small>' +
            '</div>' +
          '</div>' +

          '<div class="callout" style="margin-top:16px;font-size:0.86rem;background:rgba(0,229,255,0.06);border-color:rgba(0,229,255,0.2)">' +
            '<span>💡</span> <div><strong>Mode Dynamics:</strong> ' + modeAdvice + '</div>' +
          '</div>' +

          '<button class="btn sm ghost" style="margin-top:14px;width:100%" onclick="toast(\'Logged \' + calcFrontPsi + \'/\' + calcRearPsi + \' PSI check! +15 loyalty points added to wallet\')">✓ Log Current Tyre Pressure Check (+15 pts)</button>' +
        '</div>' +

        '<!-- HOLOGRAPHIC DIGITAL WARRANTY PASS -->' +
        '<div class="hologram-warranty-pass">' +
          '<div class="hologram-seal">5-YR<br>GENUINE</div>' +
          '<div>' +
            '<span class="tag sm" style="font-size:0.75rem;background:rgba(255,179,0,0.15);color:var(--amber);border-color:rgba(255,179,0,0.3)">Eurogrip Official Security Shield</span>' +
            '<h3 style="font-size:1.55rem;margin:8px 0 2px;color:#FFF">Digital Tyre Ownership Certificate</h3>' +
            '<p style="color:var(--amber);font-weight:700;margin:0 0 12px;font-size:0.9rem">Serial ID: ' + tyre.id + '</p>' +

            '<div style="background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px;margin-bottom:14px">' +
              '<div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:6px">' +
                '<span style="color:var(--mute)">Registered Owner:</span><strong>' + esc(user.name) + '</strong>' +
              '</div>' +
              '<div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:6px">' +
                '<span style="color:var(--mute)">Verified Mobile:</span><strong style="color:var(--cyan)">' + esc(user.phone) + '</strong>' +
              '</div>' +
              '<div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:6px">' +
                '<span style="color:var(--mute)">Motorcycle:</span><strong>' + esc(userBike) + '</strong>' +
              '</div>' +
              '<div style="display:flex;justify-content:space-between;font-size:0.85rem">' +
                '<span style="color:var(--mute)">Warranty Coverage:</span><strong style="color:var(--success)">5-Year Official Active</strong>' +
              '</div>' +
            '</div>' +

            '<div style="font-size:0.82rem;color:var(--mute)">' +
              'Anti-Counterfeit Tag: <strong style="color:var(--success)">Verified Authentic</strong> · Bead Laser ID: <strong>AIS-140 OK</strong>' +
            '</div>' +
          '</div>' +

          '<div style="display:flex;gap:10px;margin-top:16px">' +
            '<button class="btn sm" style="flex:1" onclick="savePassportWallet()">📲 Add to Wallet</button>' +
            '<button class="btn sm ghost" style="flex:1" onclick="openPassportModal()">🔍 View Full Pass</button>' +
          '</div>' +
        '</div>' +

      '</div>' +

      '<!-- 3. APPOINTMENT BOOKING WITH NEARBY CERTIFIED GARAGES -->' +
      '<div class="box" style="margin-top:24px;background:#0C121D;border:1px solid rgba(0,229,255,0.2)">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px">' +
          '<div>' +
            '<h3 style="margin:0;color:var(--cyan)">📍 Book Verified Inspection at Partner Garages</h3>' +
            '<p style="margin:0;color:var(--mute);font-size:0.88rem">Authorized mechanics near ' + esc(user.city || "Bengaluru") + ' offering free nitrogen checkups for Eurogrip riders.</p>' +
          '</div>' +
          '<span class="tag sm cyan">Complimentary Inspection Included</span>' +
        '</div>' +

        '<div class="grid g3">' +
          ((typeof PARTNER_GARAGES_DB !== "undefined" ? PARTNER_GARAGES_DB.slice(0, 3) : []).map(function(g) {
            return '<div class="garage-select-item ' + (S_RIDER.selectedGarageId === g.id ? "selected" : "") + '" onclick="selectRiderGarage(\'\' + g.id + \'\')">' +
              '<div>' +
                '<strong>' + esc(g.name) + '</strong><br>' +
                '<small style="color:var(--mute)">' + esc(g.area) + ' · ⭐ ' + g.rating + '</small>' +
              '</div>' +
              '<button class="btn sm ghost" style="padding:4px 8px;font-size:0.75rem" onclick="event.stopPropagation(); bookGarageAppointment(\'\' + g.name + \'\')">Book Free Slot</button>' +
            '</div>';
          }).join("")) +
        '</div>' +
      '</div>' +

      '<!-- 4. RIDER REWARDS GEAR VAULT & REFERRAL ENGINE -->' +
      '<div class="box" style="margin-top:24px;background:#0C121D;border:1px solid rgba(255,179,0,0.2)">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
          '<div>' +
            '<h3 style="margin:0;color:var(--amber)">🎁 Rider Rewards Vault</h3>' +
            '<small style="color:var(--mute)">Earn redeemable points for routine tyre inspections, reviews & referrals.</small>' +
          '</div>' +
          '<div style="text-align:right">' +
            '<strong style="font-size:1.4rem;color:var(--amber)">' + (user.points || S.rider) + ' Points</strong>' +
          '</div>' +
        '</div>' +
        '<div style="margin:12px 0">' +
          '<div style="display:flex;justify-content:space-between;font-size:0.82rem;margin-bottom:4px">' +
            '<span>Next Reward: Digital Valve Pressure Gauge Kit (300 pts)</span>' +
            '<strong>' + Math.min(100, Math.round(((user.points || S.rider) / 300) * 100)) + '% Complete</strong>' +
          '</div>' +
          '<div style="height:10px;background:rgba(255,255,255,0.06);border-radius:5px;overflow:hidden">' +
            '<div style="width:' + Math.min(100, Math.round(((user.points || S.rider) / 300) * 100)) + '%;height:100%;background:linear-gradient(90deg,var(--cyan),var(--amber))"></div>' +
          '</div>' +
        '</div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">' +
          '<button class="btn sm ghost" onclick="document.querySelector(\'[data-t=\\\\\'rew\\\\\']\').click(); location.href=\'#solution\';">View All 4 Reward Tiers →</button>' +
          '<button class="btn sm ghost" onclick="toast(\'Referral link copied! Share with fellow riders to earn +150 pts\')">👥 Refer a Rider Friend (+150 pts)</button>' +
        '</div>' +
      '</div>' +

      '<!-- 5. 24x7 EMERGENCY ROADSIDE TYRE ASSISTANCE (RSA) -->' +
      '<div class="rsa-emergency-card" style="margin-top:24px">' +
        '<div>' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">' +
            '<span class="tag sm rose" style="background:rgba(239,68,68,0.2);color:#EF4444;border-color:rgba(239,68,68,0.4)">🆘 24x7 Roadside Assistance</span>' +
            '<span style="font-size:0.8rem;color:var(--mute)">Free for Eurogrip Registered Riders</span>' +
          '</div>' +
          '<h3 style="margin:2px 0;font-size:1.3rem;color:#FFF">Puncture or Bead Leak on Highway?</h3>' +
          '<p style="margin:0;font-size:0.85rem;color:var(--mute)">Call verified national emergency helpline for mobile nitrogen and tyre patching dispatch.</p>' +
        '</div>' +
        '<div style="display:flex;gap:10px">' +
          '<button class="btn sm" style="background:#EF4444;color:#FFF;box-shadow:0 4px 18px rgba(239,68,68,0.4)" onclick="toast(\'Dialing 24x7 Eurogrip RSA: 1800-425-3876. Stand by for SMS tracking link.\')">📞 Call 1800-425-3876</button>' +
          '<button class="btn sm ghost" onclick="toast(\'GPS SOS ping transmitted to 3 nearest certified garages\')">📍 Transmit GPS SOS</button>' +
        '</div>' +
      '</div>' +

    '</div>';

  if (S_RIDER.viewMode === "simulator") {
    container.innerHTML =
      '<div class="desktop-phone-simulator-wrap">' +
        '<div class="simulator-control-bar">' +
          '<span>📱 <strong>Smartphone Simulation Mode</strong> (Active)</span>' +
          '<button class="btn sm ghost" style="padding:4px 8px;font-size:0.75rem" onclick="setRiderViewMode(\'cockpit\')">✕ Exit to Wide View</button>' +
        '</div>' +
        '<div class="desktop-phone-frame">' +
          '<div class="phone-frame-notch-bar">' +
            '<span>9:41</span>' +
            '<div class="phone-frame-island"></div>' +
            '<span>5G · 100% 🔋</span>' +
          '</div>' +
          '<div class="phone-frame-screen-content">' +
            html +
          '</div>' +
          '<div class="phone-frame-home-pill"></div>' +
        '</div>' +
      '</div>';
  } else {
    container.innerHTML = html;
  }
}

function setRiderPressureMode(mode) {
  S_RIDER.pressureMode = mode;
  var content = $("#portalContent");
  if (content && S.currentUser && S.currentUser.role !== "admin") {
    renderUserPortal(content, S.currentUser);
  }
}

function selectRiderGarage(garageId) {
  S_RIDER.selectedGarageId = garageId;
  var content = $("#portalContent");
  if (content && S.currentUser && S.currentUser.role !== "admin") {
    renderUserPortal(content, S.currentUser);
  }
}

function changeRiderBike(newBike) {
  if (!S.currentUser) return;
  S.currentUser.bike = newBike;
  S.bike = newBike;

  // Update in Users DB
  var users = getUsersDatabase();
  var u = users.find(function(x) { return x.id === S.currentUser.id; });
  if (u) {
    u.bike = newBike;
    saveUsersDatabase(users);
  }
  saveSessionUser(S.currentUser);

  // If bike has a recommended tyre in catalog, match it
  if (typeof MOTORCYCLES_CATALOG !== "undefined" && MOTORCYCLES_CATALOG[newBike]) {
    var recId = MOTORCYCLES_CATALOG[newBike].recommendedTyreId;
    if (recId && TYRE_DATABASE[recId]) {
      identifyAndDisplayTyre(recId);
    }
  }

  var content = $("#portalContent");
  if (content) {
    renderUserPortal(content, S.currentUser);
  }
  toast("Active motorcycle updated to " + newBike);
}

function bookGarageAppointment(shopName) {
  var u = S.currentUser;
  toast("Appointment confirmed at " + shopName + " for " + (u ? u.name : "Rider") + "! SMS alert sent with free nitrogen checkup voucher.");
}
