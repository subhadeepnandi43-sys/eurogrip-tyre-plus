/**
 * Eurogrip TYRE+ | Main Application Entrypoint & Orchestrator
 * Connects data, scanner, demo modules, authentication, admin console & rider cockpit.
 */

// Utility Selectors & Toast Notifications
var $ = function(s) { return document.querySelector(s); };
var toastT;

function toast(m) {
  var t = $("#toast");
  if (!t) return;
  t.innerHTML = "<span>🔔</span> " + m;
  t.classList.add("show");
  clearTimeout(toastT);
  toastT = setTimeout(function() {
    t.classList.remove("show");
  }, 2400);
}

// Dark / Light Theme Toggle
var themeBtn = $("#themeToggle");
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeBtn) {
    themeBtn.textContent = theme === "dark" ? "🌙" : "☀️";
  }
  try { localStorage.setItem("eurogrip_theme", theme); } catch(e){}
}

var savedTheme = "dark";
try { savedTheme = localStorage.getItem("eurogrip_theme") || "dark"; } catch(e){}
setTheme(savedTheme);

if (themeBtn) {
  themeBtn.addEventListener("click", function() {
    var current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "light" : "dark");
    toast("Switched to " + (current === "dark" ? "Light" : "Dark") + " mode");
  });
}

// Tab Navigation
var tabs = document.querySelectorAll(".tab");
tabs.forEach(function(b) {
  b.addEventListener("click", function() {
    tabs.forEach(function(x) { x.setAttribute("aria-selected", x === b); });
    ["qr", "rem", "mech", "rew"].forEach(function(k) {
      var panel = $("#p-" + k);
      if (panel) panel.hidden = (k !== b.dataset.t);
    });
  });
});

// Shared Prototype State
var S = {
  rider: 100,
  mech: 65,
  step: 0,
  activeTyre: (typeof TYRE_DATABASE !== "undefined" && TYRE_DATABASE[DEFAULT_TYRE_ID])
    ? TYRE_DATABASE[DEFAULT_TYRE_ID]
    : null,
  bike: "Royal Enfield Classic 350",
  done: {},
  cameraActive: false,
  currentUser: null
};

function level(p) {
  return p >= 600 ? "Platinum" : p >= 300 ? "Gold" : p >= 100 ? "Silver" : "Bronze";
}

// Deep-Link & URL Handler
function checkUrlPassport() {
  if (window.location.hash.indexOf('passport') !== -1 || window.location.search.indexOf('id=') !== -1) {
    var tabQR = document.querySelector("[data-t='qr']");
    if (tabQR) tabQR.click();

    var params = new URLSearchParams(window.location.search);
    var tyreId = params.get("id") || "EG-8841-27A-BLR";
    identifyAndDisplayTyre(tyreId);

    S.step = 3;
    if (typeof phone === "function") phone();
    if (typeof openPassportModal === "function") openPassportModal();
  }
}

// Portal Dashboard View Router
function renderPortalDashboard() {
  var sec = $("#portal");
  var content = $("#portalContent");
  if (!sec || !content) return;

  var u = S.currentUser;
  if (!u) {
    sec.style.display = "none";
    content.innerHTML = "";
    return;
  }

  sec.style.display = "block";

  if (u.role === "admin") {
    renderAdminPortal(content, u);
  } else {
    renderUserPortal(content, u);
  }
}

// Application Initialization
document.addEventListener("DOMContentLoaded", function() {
  // Initialize default active tyre and dossier
  identifyAndDisplayTyre(DEFAULT_TYRE_ID);

  // Preset Chips Listener
  var presetChipsContainer = $("#presetChips");
  if (presetChipsContainer) {
    presetChipsContainer.onclick = function(e) {
      var btn = e.target.closest(".preset-chip");
      if (!btn) return;
      var tyreKey = btn.dataset.tyre;
      playScanBeep();
      identifyAndDisplayTyre(tyreKey);
      toast("Switched to " + S.activeTyre.model);
    };
  }

  // QR File Upload Listener
  var fileInput = $("#qrFileInput");
  if (fileInput) {
    fileInput.onchange = function(e) {
      if (e.target.files && e.target.files[0]) {
        handleUploadedImageFile(e.target.files[0]);
      }
    };
  }

  // Init Telemetry Sliders
  var kmInput = $("#km");
  var moInput = $("#mo");
  if (kmInput) kmInput.oninput = remUpd;
  if (moInput) moInput.oninput = remUpd;
  remUpd();

  // Init Mechanic UI
  updateMechanicUI();
  var mgo = $("#mgo");
  if (mgo) {
    mgo.onclick = function() {
      var nInput = $("#cn");
      var aInput = $("#ca");
      var n = nInput ? nInput.value.trim() : "";
      var a = aInput ? aInput.value : "reg";
      if (a !== "trn" && !n) {
        toast("Please enter the customer name");
        if (nInput) nInput.focus();
        return;
      }
      var dup = rows.some(function(r) { return r.n === n && r.a === a && a !== "trn"; });
      if (dup) {
        toast("Duplicate entry flagged: Customer already recorded for this action today");
        return;
      }
      var pointVal = PT[a] || 20;
      S.mech += pointVal;
      rows.unshift({ n: a === "trn" ? "Self (Mechanic)" : n, a: a, p: pointVal });
      updateMechanicUI();
      toast("Service saved! +" + pointVal + " points credited to mechanic balance.");
      if (nInput) nInput.value = "";
    };
  }

  // Init Rewards Table
  var rt = $("#rt");
  if (rt) {
    rt.innerHTML = ACT.map(function(a) {
      return '<tr><td><strong>' + a[1] + '</strong></td><td class="r" style="color:var(--amber);font-weight:700">+' + a[2] + '</td><td class="r"><button class="btn sm ghost" data-a="' + a[0] + '">Claim</button></td></tr>';
    }).join("");

    rt.onclick = function(e) {
      var b = e.target.closest("button");
      if (!b) return;
      var a = ACT.filter(function(x) { return x[0] === b.dataset.a; })[0];
      if (a) {
        S.rider += a[2];
        rUpd();
        toast("Earned +" + a[2] + " points: " + a[1]);
      }
    };
  }

  // Init Rewards Milestones
  rUpd();

  // Init Trust Loop
  var loopNodes = $("#loop-nodes");
  if (loopNodes) {
    loopNodes.innerHTML = LOOP.map(function(l, i) {
      return '<button class="node" data-i="' + i + '" aria-pressed="' + (i === 0) + '"><i>' + (i + 1) + '</i>' + l[0].replace(/^\d+\.\s*/, '') + '</button>' +
             (i < LOOP.length - 1 ? '<div class="arrow" aria-hidden="true">▼</div>' : '');
    }).join("");

    loopNodes.onclick = function(e) {
      var b = e.target.closest(".node");
      if (b) pick(+b.dataset.i);
    };
  }
  pick(0);

  // Check initial URL
  checkUrlPassport();

  // Initialize Auth & Portal Dashboards
  initAuthAndPortals();
});

window.addEventListener("load", checkUrlPassport);
window.addEventListener("hashchange", checkUrlPassport);
