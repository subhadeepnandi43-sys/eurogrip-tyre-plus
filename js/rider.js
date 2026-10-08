/**
 * Eurogrip TYRE+ | Rider Portal
 * Clean, intuitive, easy-to-use motorcycle companion for riders.
 * Features 1-tap bike selection, clear tyre pressure recommendations,
 * 5-year digital warranty card, free garage inspection booking, and 24x7 SOS.
 */

var S_RIDER = {
  pressureMode: "solo", // solo, pillion, monsoon, touring
  selectedGarageId: "GAR-BLR-01"
};

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

  // Dynamic cold pressure recommendations
  var calcFrontPsi = bikeMeta.soloFrontPsi;
  var calcRearPsi = bikeMeta.soloRearPsi;
  var modeTitle = "Daily Solo Ride";
  var modeTip = "Best balance of fuel efficiency, smooth handling, and tyre tread longevity for daily commutes.";

  if (S_RIDER.pressureMode === "pillion") {
    calcFrontPsi = bikeMeta.pillionFrontPsi;
    calcRearPsi = bikeMeta.pillionRearPsi;
    modeTitle = "Riding with Passenger (Pillion)";
    modeTip = "Higher rear pressure supports extra weight, protects the wheel rim from potholes, and maintains stability.";
  } else if (S_RIDER.pressureMode === "monsoon") {
    calcFrontPsi = Math.max(22, bikeMeta.soloFrontPsi - 2);
    calcRearPsi = Math.max(26, bikeMeta.soloRearPsi - 2);
    modeTitle = "Rain & Wet Roads";
    modeTip = "Slightly lower pressure widens the contact patch to channel water away through the tread sipes.";
  } else if (S_RIDER.pressureMode === "touring") {
    calcFrontPsi = bikeMeta.soloFrontPsi + 2;
    calcRearPsi = bikeMeta.soloRearPsi + 3;
    modeTitle = "Highway & Long Trips";
    modeTip = "Prevents tyre overheating during high-speed highway cruising and keeps tyre carcass stable.";
  }

  // 32 Motorcycle options grouped by category
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
    '<div class="easy-rider-wrap">' +

      '<!-- 1. GENTLE, FRIENDLY HEADER -->' +
      '<div class="rider-header-card">' +
        '<div class="rider-header-left">' +
          '<div class="rider-welcome-pill">👋 Welcome to your Eurogrip Garage</div>' +
          '<h2 class="rider-greeting-title">Hi, ' + esc(user.name) + '!</h2>' +
          '<div class="rider-contact-meta">' +
            '<span>📱 ' + esc(user.phone) + '</span>' +
            '<span class="meta-dot">·</span>' +
            '<span>📍 ' + esc(user.city || "Bengaluru") + '</span>' +
            '<span class="meta-dot">·</span>' +
            '<span class="rider-shield-badge">🛡️ 5-Year Warranty Active</span>' +
          '</div>' +
        '</div>' +
        '<div class="rider-header-actions">' +
          '<button class="btn sm ghost" onclick="switchPortalRole(\'admin\')" title="Switch to Admin Console">👑 Switch to Admin</button>' +
          '<button class="btn sm ghost" onclick="logoutUser()">Sign Out</button>' +
        '</div>' +
      '</div>' +

      '<!-- 2. BIKE SELECTION CARD (SUPER EASY) -->' +
      '<div class="rider-section-card bike-card">' +
        '<div class="rider-card-header">' +
          '<div>' +
            '<span class="step-badge">Step 1</span>' +
            '<h3 class="rider-card-title">Your Motorcycle</h3>' +
            '<p class="rider-card-subtitle">Choose your bike model to get the exact tyre recommendations and correct air pressure.</p>' +
          '</div>' +
        '</div>' +

        '<div class="bike-selector-box">' +
          '<label for="riderBikeSelect" class="easy-label">Select Motorcycle (32 Models Available):</label>' +
          '<select id="riderBikeSelect" class="easy-select" onchange="changeRiderBike(this.value)">' +
            bikeOptionsHtml +
          '</select>' +
        '</div>' +

        '<div class="bike-summary-badges">' +
          '<div class="bike-badge-item">' +
            '<span class="badge-lbl">Selected Bike</span>' +
            '<strong class="badge-val">' + (bikeMeta.icon || "🏍️") + ' ' + esc(userBike) + '</strong>' +
          '</div>' +
          '<div class="bike-badge-item">' +
            '<span class="badge-lbl">Front Tyre Size</span>' +
            '<strong class="badge-val cyan">' + (bikeMeta.frontSize || "100/90-19") + '</strong>' +
          '</div>' +
          '<div class="bike-badge-item">' +
            '<span class="badge-lbl">Rear Tyre Size</span>' +
            '<strong class="badge-val amber">' + (bikeMeta.rearSize || tyre.size) + '</strong>' +
          '</div>' +
          '<div class="bike-badge-item">' +
            '<span class="badge-lbl">Fitted Tyre</span>' +
            '<strong class="badge-val">' + tyre.model + '</strong>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<!-- 3. TYRE AIR PRESSURE CARD (BOLD, CLEAR & 1-TAP) -->' +
      '<div class="rider-section-card pressure-card">' +
        '<div class="rider-card-header">' +
          '<div>' +
            '<span class="step-badge cyan">Step 2</span>' +
            '<h3 class="rider-card-title">Correct Tyre Air Pressure</h3>' +
            '<p class="rider-card-subtitle">Tap how you are riding today to see the ideal cold inflation pressure.</p>' +
          '</div>' +
        '</div>' +

        '<!-- 4 BIG 1-TAP RIDE MODES -->' +
        '<div class="easy-mode-buttons">' +
          '<button type="button" class="easy-mode-btn ' + (S_RIDER.pressureMode === "solo" ? "active" : "") + '" onclick="setRiderPressureMode(\'solo\')">' +
            '<span class="mode-icon">🏍️</span>' +
            '<span class="mode-text">Daily Solo</span>' +
          '</button>' +
          '<button type="button" class="easy-mode-btn ' + (S_RIDER.pressureMode === "pillion" ? "active" : "") + '" onclick="setRiderPressureMode(\'pillion\')">' +
            '<span class="mode-icon">👥</span>' +
            '<span class="mode-text">With Passenger</span>' +
          '</button>' +
          '<button type="button" class="easy-mode-btn ' + (S_RIDER.pressureMode === "monsoon" ? "active" : "") + '" onclick="setRiderPressureMode(\'monsoon\')">' +
            '<span class="mode-icon">🌧️</span>' +
            '<span class="mode-text">Wet / Monsoon</span>' +
          '</button>' +
          '<button type="button" class="easy-mode-btn ' + (S_RIDER.pressureMode === "touring" ? "active" : "") + '" onclick="setRiderPressureMode(\'touring\')">' +
            '<span class="mode-icon">🛣️</span>' +
            '<span class="mode-text">Highway Tour</span>' +
          '</button>' +
        '</div>' +

        '<!-- HUGE, CLEAR PSI GAUGES -->' +
        '<div class="easy-gauges-row">' +
          '<div class="easy-gauge front">' +
            '<span class="gauge-title">FRONT WHEEL</span>' +
            '<div class="gauge-number">' + calcFrontPsi + '<span class="gauge-unit"> PSI</span></div>' +
            '<span class="gauge-hint">' + (bikeMeta.frontSize || "Front Wheel") + '</span>' +
          '</div>' +
          '<div class="easy-gauge rear">' +
            '<span class="gauge-title">REAR WHEEL</span>' +
            '<div class="gauge-number">' + calcRearPsi + '<span class="gauge-unit"> PSI</span></div>' +
            '<span class="gauge-hint">' + (bikeMeta.rearSize || "Rear Wheel") + '</span>' +
          '</div>' +
        '</div>' +

        '<!-- PLAIN ENGLISH ADVICE -->' +
        '<div class="easy-advice-box">' +
          '<strong>💡 ' + modeTitle + ':</strong> ' + modeTip +
        '</div>' +

        '<button type="button" class="easy-check-btn" onclick="toast(\'Checked \' + calcFrontPsi + \'/\' + calcRearPsi + \' PSI! Added +15 points to your wallet.\')">' +
          '✓ I checked my tyre pressure today (+15 Loyalty Points)' +
        '</button>' +
      '</div>' +

      '<!-- 4. OFFICIAL 5-YEAR WARRANTY CARD -->' +
      '<div class="rider-section-card warranty-card">' +
        '<div class="rider-card-header">' +
          '<div>' +
            '<span class="step-badge amber">Step 3</span>' +
            '<h3 class="rider-card-title">Your 5-Year Tyre Warranty Certificate</h3>' +
            '<p class="rider-card-subtitle">Official coverage against manufacturing defects, punctures & bead issues.</p>' +
          '</div>' +
        '</div>' +

        '<div class="warranty-card-body">' +
          '<div class="warranty-badge-active">● COVERAGE STATUS: ACTIVE (5 YEARS)</div>' +
          '<div class="warranty-details-grid">' +
            '<div class="warranty-detail-item">' +
              '<span class="item-label">Tyre Serial Number</span>' +
              '<strong class="item-value amber">' + tyre.id + '</strong>' +
            '</div>' +
            '<div class="warranty-detail-item">' +
              '<span class="item-label">Tyre Model</span>' +
              '<strong class="item-value">' + tyre.model + '</strong>' +
            '</div>' +
            '<div class="warranty-detail-item">' +
              '<span class="item-label">Registered Owner</span>' +
              '<strong class="item-value">' + esc(user.name) + '</strong>' +
            '</div>' +
            '<div class="warranty-detail-item">' +
              '<span class="item-label">Registered Phone</span>' +
              '<strong class="item-value cyan">' + esc(user.phone) + '</strong>' +
            '</div>' +
            '<div class="warranty-detail-item">' +
              '<span class="item-label">Motorcycle</span>' +
              '<strong class="item-value">' + esc(userBike) + '</strong>' +
            '</div>' +
            '<div class="warranty-detail-item">' +
              '<span class="item-label">Anti-Counterfeit Check</span>' +
              '<strong class="item-value success">✓ Verified Genuine Eurogrip</strong>' +
            '</div>' +
          '</div>' +

          '<div class="warranty-action-buttons">' +
            '<button class="btn" onclick="savePassportWallet()">📲 Add to Phone Wallet</button>' +
            '<button class="btn ghost" onclick="openPassportModal()">🔍 View Certificate</button>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<!-- 5. FREE GARAGE INSPECTION BOOKING -->' +
      '<div class="rider-section-card garage-card">' +
        '<div class="rider-card-header">' +
          '<div>' +
            '<span class="step-badge">Step 4</span>' +
            '<h3 class="rider-card-title">Book Free Checkup at Partner Garages</h3>' +
            '<p class="rider-card-subtitle">Enjoy complimentary tyre inspection, nitrogen top-up, and tread depth checkup near ' + esc(user.city || "Bengaluru") + '.</p>' +
          '</div>' +
        '</div>' +

        '<div class="garages-list-grid">' +
          ((typeof PARTNER_GARAGES_DB !== "undefined" ? PARTNER_GARAGES_DB.slice(0, 3) : []).map(function(g) {
            return '<div class="easy-garage-card">' +
              '<div class="garage-info">' +
                '<strong class="garage-name">' + esc(g.name) + '</strong>' +
                '<div class="garage-meta">' + esc(g.area) + ' · ⭐ ' + g.rating + ' Rating</div>' +
                '<div class="garage-mechanic">Head Mechanic: ' + esc(g.headMechanic) + '</div>' +
              '</div>' +
              '<div class="garage-actions">' +
                '<button class="btn sm" onclick="bookGarageAppointment(\'' + esc(g.name) + '\')">Book Free Slot</button>' +
                '<a href="tel:' + esc(g.phone) + '" class="btn sm ghost">📞 Call</a>' +
              '</div>' +
            '</div>';
          }).join("")) +
        '</div>' +
      '</div>' +

      '<!-- 6. 24x7 EMERGENCY ROADSIDE ASSISTANCE (SOS) -->' +
      '<div class="rider-sos-card">' +
        '<div class="sos-content">' +
          '<div class="sos-tag">🆘 24x7 Emergency Assistance</div>' +
          '<h3 class="sos-title">Puncture or Tyre Trouble on the Road?</h3>' +
          '<p class="sos-desc">Free emergency assistance for registered Eurogrip riders across India.</p>' +
        '</div>' +
        '<div class="sos-actions">' +
          '<a href="tel:18004253876" class="btn easy-sos-call-btn" onclick="toast(\'Dialing 24x7 Eurogrip RSA: 1800-425-3876\')">' +
            '📞 Call 1800-425-3876' +
          '</a>' +
          '<button class="btn ghost easy-sos-gps-btn" onclick="toast(\'GPS SOS alert sent! Our team will contact you shortly.\')">' +
            '📍 Send Emergency SOS' +
          '</button>' +
        '</div>' +
      '</div>' +

    '</div>';

  container.innerHTML = html;
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

  // Auto-match recommended tyre in catalog if available
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
  toast("Updated motorcycle to " + newBike);
}

function bookGarageAppointment(shopName) {
  var u = S.currentUser;
  toast("Appointment booked at " + shopName + " for " + (u ? u.name : "Rider") + "! Free checkup voucher sent via SMS.");
}
