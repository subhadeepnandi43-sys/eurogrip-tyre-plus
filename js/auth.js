/**
 * Eurogrip TYRE+ | Authentication & User Access Management
 * Supports phone number login (10-digit), registration with automatic 5-year warranty,
 * dual-role modal (Admin / Rider) and session state synchronization.
 */

var activeAuthTab = "user";

function openAuthModal(defaultRole) {
  var m = $("#authModal");
  if (!m) return;
  if (defaultRole) setAuthTab(defaultRole);
  m.classList.add("open");
}

function closeAuthModal() {
  var m = $("#authModal");
  if (m) m.classList.remove("open");
}

function setAuthTab(tab) {
  activeAuthTab = tab;
  document.querySelectorAll(".auth-role-tab").forEach(function(btn) {
    btn.classList.toggle("active", btn.dataset.authTab === tab);
  });

  var loginForm = $("#authLoginForm");
  var regForm = $("#authRegisterForm");
  var submitBtn = $("#authSubmitBtn");
  var emailInput = $("#authEmail");

  var notice = $("#authDeviceNotice");
  if (notice) {
    if (tab === "admin") {
      notice.innerHTML = '<span>🖥️</span> <span><strong>Enterprise Console:</strong> Admin operations are enabled for Desktop & Tablet systems.</span>';
      notice.style.borderColor = "rgba(255,179,0,0.3)";
      notice.style.color = "var(--amber)";
      notice.style.background = "rgba(255,179,0,0.08)";
    } else {
      notice.innerHTML = '<span>📱</span> <span><strong>Mobile-Exclusive Access:</strong> Rider accounts are engineered for smartphones (desktop simulator available).</span>';
      notice.style.borderColor = "rgba(0,210,255,0.2)";
      notice.style.color = "var(--cyan)";
      notice.style.background = "rgba(0,210,255,0.08)";
    }
  }

  if (tab === "register") {
    if (loginForm) loginForm.style.display = "none";
    if (regForm) regForm.style.display = "block";
  } else {
    if (loginForm) loginForm.style.display = "block";
    if (regForm) regForm.style.display = "none";

    if (tab === "admin") {
      if (submitBtn) submitBtn.innerHTML = "🛡️ Sign In to Admin Console";
      if (emailInput && !emailInput.value) emailInput.placeholder = "9840000001 or admin@eurogrip.com";
    } else {
      if (submitBtn) submitBtn.innerHTML = "🔐 Sign In as Rider (Mobile Portal)";
      if (emailInput && !emailInput.value) emailInput.placeholder = "98300 12345 or rider@eurogrip.com";
    }
  }
}

function switchToRegister() {
  setAuthTab("register");
}

function switchToLogin() {
  setAuthTab("user");
}

function quickFillAccount(role) {
  setAuthTab(role);
  var emailInput = $("#authEmail");
  var passInput = $("#authPassword");
  if (role === "admin") {
    if (emailInput) emailInput.value = "9840000001";
    if (passInput) passInput.value = "admin123";
    toast("Filled Demo Admin credentials (Mobile: 98400 00001)");
  } else {
    if (emailInput) emailInput.value = "9830012345";
    if (passInput) passInput.value = "user123";
    toast("Filled Demo Rider credentials (Mobile: 98300 12345)");
  }
}

function handleAuthSubmit(e) {
  if (e) e.preventDefault();

  var identifier = $("#authEmail").value.trim();
  var passVal = $("#authPassword").value.trim();
  var users = getUsersDatabase();
  var cleanId = cleanPhone(identifier);

  var found = users.find(function(u) {
    var phoneMatch = cleanId.length >= 7 && cleanPhone(u.phone) === cleanId;
    var emailMatch = u.email && u.email.toLowerCase() === identifier.toLowerCase();
    var userMatch = u.username && u.username.toLowerCase() === identifier.toLowerCase();
    return (phoneMatch || emailMatch || userMatch) && u.password === passVal;
  });

  if (!found) {
    toast("Invalid credentials! Sign in with your 10-digit mobile number (e.g. 9830012345) or email.");
    return;
  }

  // Set session user
  S.currentUser = found;
  saveSessionUser(found);

  // If user has a fitted tyre in DB, auto-select it
  if (found.fittedTyreId && TYRE_DATABASE[found.fittedTyreId]) {
    identifyAndDisplayTyre(found.fittedTyreId);
  }
  if (found.bike) {
    S.bike = found.bike;
  }
  if (found.points) {
    S.rider = found.points;
    rUpd();
  }

  closeAuthModal();
  renderNavbarAuth();
  renderPortalDashboard();
  playScanBeep();

  toast("Welcome back, " + found.name + "! Logged in via " + (cleanId.length >= 7 ? "Mobile Number" : "Account ID") + ".");

  // Scroll smoothly to portal dashboard
  setTimeout(function() {
    var sec = $("#portal");
    if (sec) sec.scrollIntoView({ behavior: "smooth" });
  }, 200);
}

function handleRegisterSubmit(e) {
  if (e) e.preventDefault();

  var name = $("#regName").value.trim();
  var rawPhone = $("#regPhone").value.trim();
  var phone = cleanPhone(rawPhone);
  var rawEmail = $("#regEmail").value.trim();
  var role = $("#regRole").value;
  var bike = $("#regBike").value;
  var pass = $("#regPassword").value;

  if (phone.length < 10) {
    toast("Please enter a valid 10-digit mobile number!");
    return;
  }

  // Fallback email if left empty
  var email = rawEmail ? rawEmail.toLowerCase() : (phone + "@rider.eurogrip.com");

  var users = getUsersDatabase();
  var phoneExists = users.some(function(u) { return cleanPhone(u.phone) === phone; });
  if (phoneExists) {
    toast("An account with mobile number +91 " + phone + " already exists! Sign in instead.");
    switchToLogin();
    var authInput = $("#authEmail");
    if (authInput) authInput.value = phone;
    return;
  }

  // Lookup bike specs from catalog
  var bikeMeta = (typeof MOTORCYCLES_CATALOG !== "undefined" && MOTORCYCLES_CATALOG[bike]) ? MOTORCYCLES_CATALOG[bike] : null;
  var fittedTyreId = bikeMeta ? bikeMeta.recommendedTyreId : (S.activeTyre ? S.activeTyre.id : DEFAULT_TYRE_ID);
  var fittedTyreModel = bikeMeta ? bikeMeta.recommendedTyre : (S.activeTyre ? S.activeTyre.model : "Eurogrip ProTorq Extreme");

  var formattedPhone = "+91 " + phone.substring(0, 5) + " " + phone.substring(5);

  var newUser = {
    id: "usr_" + Date.now(),
    name: name,
    email: email,
    username: phone,
    password: pass,
    role: role,
    phone: formattedPhone,
    bike: bike,
    badge: role === "admin" ? "Operations Command Administrator" : role === "mechanic" ? "Certified Mechanic" : "Verified Eurogrip Rider",
    avatar: role === "admin" ? "👑" : role === "mechanic" ? "🔧" : "🏍️",
    city: "Bengaluru",
    joinedDate: new Date().toISOString().split("T")[0],
    fittedTyreId: fittedTyreId,
    points: 100
  };

  users.push(newUser);
  saveUsersDatabase(users);

  // Automatically register a serialized warranty in the database
  var warranties = getWarrantiesDatabase();
  var warrantyId = "WRN-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);
  warranties.unshift({
    id: warrantyId,
    tyreId: fittedTyreId,
    model: fittedTyreModel,
    riderName: newUser.name,
    riderPhone: newUser.phone,
    bike: newUser.bike,
    regDate: newUser.joinedDate,
    status: "Verified Active",
    warrantyYears: 5,
    mechanicShop: "Self-Registered via Eurogrip Mobile PWA"
  });
  saveWarrantiesDatabase(warranties);

  // Set session user
  S.currentUser = newUser;
  S.bike = newUser.bike;
  saveSessionUser(newUser);

  if (TYRE_DATABASE[fittedTyreId]) {
    identifyAndDisplayTyre(fittedTyreId);
  }

  closeAuthModal();
  renderNavbarAuth();
  renderPortalDashboard();
  playScanBeep();

  toast("Registered successfully with phone " + formattedPhone + "! Welcome, " + newUser.name);

  setTimeout(function() {
    var sec = $("#portal");
    if (sec) sec.scrollIntoView({ behavior: "smooth" });
  }, 200);
}

function logoutUser() {
  saveSessionUser(null);
  S.currentUser = null;
  renderNavbarAuth();
  renderPortalDashboard();
  toast("You have logged out.");
}

function renderNavbarAuth() {
  var slot = $("#navAuthSlot");
  var portalLink = $("#navPortalLink");
  if (!slot) return;

  var u = S.currentUser;
  if (!u) {
    slot.innerHTML = '<button class="btn sm ghost" onclick="openAuthModal()" id="navLoginBtn">🔑 Sign In</button>';
    if (portalLink) portalLink.style.display = "none";
  } else {
    var isAdm = (u.role === "admin");
    slot.innerHTML =
      '<div class="user-pill ' + (isAdm ? 'admin-pill' : 'rider-pill') + '" onclick="openAuthModal()">' +
        '<span class="user-role-badge">' + (isAdm ? '👑 Admin' : '🏍️ Rider') + '</span>' +
        '<span>' + esc(u.name) + '</span>' +
        (!isAdm ? '<span style="color:var(--amber);font-size:0.75rem;font-weight:700">' + (u.points || S.rider) + ' pts</span>' : '') +
        '<button class="user-logout-btn" onclick="event.stopPropagation(); logoutUser();" title="Sign Out">✕</button>' +
      '</div>';

    if (portalLink) {
      portalLink.style.display = "inline-block";
      portalLink.textContent = isAdm ? "🛡️ Operations Console" : "⚡ Virtual Garage";
    }
  }
}

function initAuthAndPortals() {
  S.currentUser = getSessionUser();
  renderNavbarAuth();
  renderPortalDashboard();

  // Auth Modal Role Tabs Listener
  var tabsContainer = document.querySelector(".auth-role-tabs");
  if (tabsContainer) {
    tabsContainer.onclick = function(e) {
      var tabBtn = e.target.closest(".auth-role-tab");
      if (!tabBtn) return;
      var role = tabBtn.dataset.authTab;
      setAuthTab(role);
    };
  }

  // Window resize listener to dynamically adapt between mobile gate and simulator
  window.addEventListener("resize", function() {
    if (S.currentUser && S.currentUser.role !== "admin") {
      renderPortalDashboard();
    }
  });
}
