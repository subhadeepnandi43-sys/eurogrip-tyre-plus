/**
 * Eurogrip TYRE+ | Rider Virtual Cockpit & Digital Garage
 * Mobile-exclusive application experience featuring cold pressure telemetry calculator,
 * active motorcycle switcher across 32 models, holographic warranty pass, and garage bookings.
 */

var S_RIDER = {
  pressureMode: "solo", // solo, pillion, monsoon, touring
  selectedGarageId: "GAR-BLR-01",
  forceMobileSimulator: false
};

// Device Detection Utility: checks user agent and screen dimensions
function isMobileDevice() {
  var ua = navigator.userAgent || "";
  var isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  var isSmallScreen = window.innerWidth <= 768;
  return isMobileUA || isSmallScreen;
}

function toggleMobileSimulator(enable) {
  S_RIDER.forceMobileSimulator = !!enable;
  var content = $("#portalContent");
  if (content && S.currentUser && S.currentUser.role !== "admin") {
    renderUserPortal(content, S.currentUser);
  }
  toast(enable ? "📱 Mobile Device Simulator Enabled" : "Exited Mobile Simulator");
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
  // Mobile Access Enforcement: Rider portal is restricted to mobile devices (or interactive simulator on desktop)
  if (!isMobileDevice() && !S_RIDER.forceMobileSimulator) {
    container.innerHTML =
      '<div class="mobile-only-gate-card">' +
        '<span class="gate-device-badge">📱 Mobile Exclusive Portal</span>' +
        '<h2 style="font-size:2.3rem;margin:6px 0 2px">Smartphone Access Required</h2>' +
        '<p class="lead" style="font-size:1rem;color:var(--mute);max-width:540px;margin:10px auto 16px">' +
          'Eurogrip TYRE+ Rider Cockpit is engineered exclusively for mobile riders on the road. Scan with your smartphone camera to access your digital tyre garage, real-time cold pressure telemetry & 5-year warranty passes.' +
        '</p>' +
        '<div class="gate-qr-preview-box">' +
          '<img src="./images/eurogrip-qr-sample.png" alt="Scan to open on smartphone">' +
          '<div style="font-size:0.75rem;color:#000;font-weight:700;margin-top:6px">Point Smartphone Camera to Open</div>' +
        '</div>' +
        '<div style="margin:8px 0 20px;font-size:0.86rem;color:var(--mute)">' +
          'Testing or evaluating on a computer? Launch the interactive smartphone frame simulator:' +
        '</div>' +
        '<div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap">' +
          '<button class="btn" onclick="toggleMobileSimulator(true)">📱 Launch Mobile Cockpit Simulator</button>' +
          '<button class="btn ghost" onclick="copyMobilePortalLink()">📋 Copy Mobile Link</button>' +
          '<button class="btn ghost" onclick="logoutUser()">Sign Out</button>' +
        '</div>' +
      '</div>';
    return;
  }

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
        icon: "👑"
      };

  var tyre = S.activeTyre || TYRE_DATABASE[DEFAULT_TYRE_ID];
  var warranties = getWarrantiesDatabase();

  // Find warranties linked to this rider by clean phone or name
  var userCleanPhone = cleanPhone(user.phone);
  var myWarranties = warranties.filter(function(w) {
    var phoneMatch = userCleanPhone && cleanPhone(w.riderPhone) === userCleanPhone;
    var nameMatch = w.riderName && w.riderName.toLowerCase() === user.name.toLowerCase();
    return phoneMatch || nameMatch;
  });

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

  // Generate Motorcycle Selector Options
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
      '<!-- RIDER COCKPIT HEADER -->' +
      '<div class="rider-top-bar">' +
        '<div>' +
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">' +
            '<span class="tag cyan sm">🏍️ Connected Rider Cockpit</span>' +
            '<span style="color:var(--success);font-weight:700;font-size:0.85rem">● Warranty Shield Active</span>' +
          '</div>' +
          '<h2 style="margin:2px 0;font-size:2.4rem">Welcome back, ' + esc(user.name) + '!</h2>' +
          '<p style="margin:0;color:var(--mute);font-size:0.92rem">' +
            'Primary Credential: <strong>' + esc(user.phone) + '</strong> · City: <strong>' + esc(user.city || "Bengaluru") + '</strong>' +
          '</p>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:10px">' +
          '<button class="btn sm" onclick="openPassportModal()">📱 Digital Tyre Pass</button>' +
          '<button class="btn sm ghost" onclick="logoutUser()">Sign Out</button>' +
        '</div>' +
      '</div>' +

      '<!-- HERO MACHINE CARD WITH ACTIVE MOTORCYCLE SWITCHER -->' +
      '<div class="rider-machine-hero">' +
        '<div class="machine-header-row">' +
          '<div>' +
            '<span class="tag sm ' + (bikeMeta.category.includes("Sports") ? "amber" : "cyan") + '">' + esc(bikeMeta.category) + '</span>' +
            '<h3 class="machine-name-title" style="margin-top:6px">' +
              '<span>' + (bikeMeta.icon || "🏍️") + '</span> ' + esc(userBike) +
            '</h3>' +
            '<div style="color:var(--mute);font-size:0.88rem;margin-top:4px">' +
              'Engine: <strong>' + esc(bikeMeta.engine) + '</strong> · Curb Weight: <strong>' + (bikeMeta.weightKg ? bikeMeta.weightKg + " kg" : "180 kg") + '</strong>' +
            '</div>' +
          '</div>' +
          '<div style="min-width:240px">' +
            '<label style="font-size:0.78rem;color:var(--mute);margin:0 0 4px;display:block">Change Active Motorcycle:</label>' +
            '<select onchange="changeRiderBike(this.value)" style="padding:8px 12px;font-size:0.85rem;background:#0E1318">' +
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
            '<span class="spec-badge-label">Front Tyre Spec</span>' +
            '<span class="spec-badge-val" style="font-size:0.95rem;color:var(--cyan)">' + (bikeMeta.frontSize || "100/90-19") + '</span>' +
          '</div>' +
          '<div class="spec-badge-item">' +
            '<span class="spec-badge-label">Rear Tyre Spec</span>' +
            '<span class="spec-badge-val" style="font-size:0.95rem;color:var(--amber)">' + (bikeMeta.rearSize || tyre.size) + '</span>' +
          '</div>' +
          '<div class="spec-badge-item">' +
            '<span class="spec-badge-label">Loyalty Points</span>' +
            '<span class="spec-badge-val" style="font-size:1.1rem;color:var(--success)">' + (user.points || S.rider) + ' pts</span>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<!-- TWO COLUMN COCKPIT: PRESSURE CALCULATOR & DIGITAL WARRANTY PASS -->' +
      '<div class="grid g2" style="margin-top:24px">' +

        '<!-- REAL-TIME COLD PRESSURE CALCULATOR -->' +
        '<div class="box" style="display:flex;flex-direction:column;justify-content:space-between">' +
          '<div>' +
            '<div style="display:flex;justify-content:space-between;align-items:center">' +
              '<h3 style="margin:0">⚡ Cold Tyre Pressure Telemetry</h3>' +
              '<span class="tag sm cyan">Live Calibration</span>' +
            '</div>' +
            '<p style="color:var(--mute);font-size:0.88rem;margin:6px 0 12px">Select your current ride mode to calculate optimal tyre inflation:</p>' +

            '<div class="pressure-modes-bar">' +
              '<button type="button" class="pressure-mode-btn ' + (S_RIDER.pressureMode === "solo" ? "active" : "") + '" onclick="setRiderPressureMode(\'solo\')">🏍️ Solo City</button>' +
              '<button type="button" class="pressure-mode-btn ' + (S_RIDER.pressureMode === "pillion" ? "active" : "") + '" onclick="setRiderPressureMode(\'pillion\')">👥 With Pillion</button>' +
              '<button type="button" class="pressure-mode-btn ' + (S_RIDER.pressureMode === "monsoon" ? "active" : "") + '" onclick="setRiderPressureMode(\'monsoon\')">🌧️ Monsoon Rain</button>' +
              '<button type="button" class="pressure-mode-btn ' + (S_RIDER.pressureMode === "touring" ? "active" : "") + '" onclick="setRiderPressureMode(\'touring\')">🛣️ Highway Tour</button>' +
            '</div>' +

            '<div class="gauges-display-grid">' +
              '<div class="digital-gauge-box">' +
                '<div class="digital-gauge-label">Target Front Pressure</div>' +
                '<div class="digital-gauge-value">' + calcFrontPsi + '<span style="font-size:1.1rem"> PSI</span></div>' +
                '<small style="color:var(--mute)">' + (bikeMeta.frontSize || "Front Wheel") + '</small>' +
              '</div>' +
              '<div class="digital-gauge-box">' +
                '<div class="digital-gauge-label">Target Rear Pressure</div>' +
                '<div class="digital-gauge-value amber">' + calcRearPsi + '<span style="font-size:1.1rem"> PSI</span></div>' +
                '<small style="color:var(--mute)">' + (bikeMeta.rearSize || "Rear Wheel") + '</small>' +
              '</div>' +
            '</div>' +

            '<div class="callout" style="margin-top:16px;font-size:0.86rem">' +
              '<span>💡</span> <div><strong>Mode Dynamics:</strong> ' + modeAdvice + '</div>' +
            '</div>' +
          '</div>' +

          '<button class="btn sm ghost" style="margin-top:14px;width:100%" onclick="toast(\'Logged ' + calcFrontPsi + '/' + calcRearPsi + ' PSI check to your digital service history\')">✓ Log Current Tyre Pressure Check (+15 pts)</button>' +
        '</div>' +

        '<!-- HOLOGRAPHIC DIGITAL WARRANTY PASS -->' +
        '<div class="hologram-warranty-pass" style="display:flex;flex-direction:column;justify-content:space-between">' +
          '<div class="hologram-seal">5-YR<br>GENUINE</div>' +
          '<div>' +
            '<span class="tag sm" style="font-size:0.75rem">Eurogrip Official Security Shield</span>' +
            '<h3 style="font-size:1.55rem;margin:8px 0 2px;color:#FFF">Digital Tyre Ownership Certificate</h3>' +
            '<p style="color:var(--amber);font-weight:700;margin:0 0 12px;font-size:0.9rem">Serial ID: ' + tyre.id + '</p>' +

            '<div style="background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px;margin-bottom:14px">' +
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
                '<span style="color:var(--mute)">Warranty Status:</span><strong style="color:var(--success)">5-Year Official Active</strong>' +
              '</div>' +
            '</div>' +

            '<div style="font-size:0.82rem;color:var(--mute)">' +
              'Tread Life Estimate: <strong>' + (tyre.lifeEstimate || "32,000 km") + '</strong> · Anti-Counterfeit Tag: <strong>Verified Authentic</strong>' +
            '</div>' +
          '</div>' +

          '<div style="display:flex;gap:10px;margin-top:16px">' +
            '<button class="btn sm" style="flex:1" onclick="savePassportWallet()">📲 Add to Wallet</button>' +
            '<button class="btn sm ghost" style="flex:1" onclick="openPassportModal()">🔍 View Full Pass</button>' +
          '</div>' +
        '</div>' +

      '</div>' +

      '<!-- APPOINTMENT BOOKING WITH NEARBY CERTIFIED GARAGES -->' +
      '<div class="box" style="margin-top:24px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px">' +
          '<div>' +
            '<h3 style="margin:0">📍 Book Verified Inspection at Partner Garages</h3>' +
            '<p style="margin:0;color:var(--mute);font-size:0.88rem">Authorized mechanics near ' + esc(user.city || "Bengaluru") + ' offering free nitrogen checkups for Eurogrip riders.</p>' +
          '</div>' +
          '<span class="tag sm cyan">Complimentary Inspection Included</span>' +
        '</div>' +

        '<div class="grid g3">' +
          ((typeof PARTNER_GARAGES_DB !== "undefined" ? PARTNER_GARAGES_DB.slice(0, 3) : []).map(function(g) {
            return '<div class="garage-select-item ' + (S_RIDER.selectedGarageId === g.id ? "selected" : "") + '" onclick="selectRiderGarage(\'' + g.id + '\')">' +
              '<div>' +
                '<strong>' + esc(g.name) + '</strong><br>' +
                '<small style="color:var(--mute)">' + esc(g.area) + ' · ⭐ ' + g.rating + '</small>' +
              '</div>' +
              '<button class="btn sm ghost" style="padding:4px 8px;font-size:0.75rem" onclick="event.stopPropagation(); bookGarageAppointment(\'' + g.name + '\')">Book</button>' +
            '</div>';
          }).join("")) +
        '</div>' +
      '</div>' +

      '<!-- RIDER REWARDS GEAR UNLOCK PROGRESS -->' +
      '<div class="box" style="margin-top:24px">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
          '<div>' +
            '<h3 style="margin:0">🎁 Rider Rewards Vault</h3>' +
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
          '<button class="btn sm ghost" onclick="document.querySelector(\'[data-t=\\\'rew\\\']\').click(); location.href=\'#solution\';">View All 4 Reward Tiers →</button>' +
          '<button class="btn sm ghost" onclick="toast(\'Referral link copied! Share with fellow riders to earn +150 pts\')">👥 Refer a Rider Friend (+150 pts)</button>' +
        '</div>' +
      '</div>' +

    '</div>';

  if (!isMobileDevice() && S_RIDER.forceMobileSimulator) {
    container.innerHTML =
      '<div class="desktop-phone-simulator-wrap">' +
        '<div class="simulator-control-bar">' +
          '<span>📱 <strong>Smartphone Simulation Mode</strong> (Active)</span>' +
          '<button class="btn sm ghost" style="padding:4px 8px;font-size:0.75rem" onclick="toggleMobileSimulator(false)">✕ Exit Simulator</button>' +
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
  toast("Appointment confirmed at " + shopName + " for " + (u ? u.name : "Rider") + "! SMS alert sent.");
}
