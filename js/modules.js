/**
 * Eurogrip TYRE+ | Interactive Prototype Demo Modules
 * Contains phone simulator steps (A), reminder calculator (B),
 * mechanic garage log (C), rider rewards (D) & trust loop (E).
 */

// Module A: Phone Prototype Shell Steps
function phone() {
  var p = $("#phone");
  if (!p) return;

  var tyre = S.activeTyre || TYRE_DATABASE[DEFAULT_TYRE_ID];

  var h = '<div class="phone-notch"></div><div class="steps">';
  for (var i = 0; i < 4; i++) {
    h += '<span class="' + (i <= S.step ? "on" : "") + '"></span>';
  }
  h += "</div>";

  if (S.step === 0) {
    if (S.cameraActive) {
      h += '<b style="font-size:1.15rem">Live Camera Scanner</b>' +
           '<small>Point device camera at any tyre barcode or QR tag.</small>' +
           '<div class="camera-view-container">' +
             '<video id="scannerVideo" class="camera-video" playsinline autoplay muted></video>' +
             '<div class="camera-reticle"></div>' +
             '<div class="qr-scan-line"></div>' +
           '</div>' +
           '<button class="btn" id="camCapture">📸 Capture & Verify QR Tag</button>' +
           '<button class="btn ghost" id="camCancel" style="margin-top:6px">✕ Cancel Camera</button>';
    } else {
      h += '<b style="font-size:1.15rem">Scan Tyre Sidewall</b>' +
           '<small>Serialized tag vulcanized on Eurogrip bead.</small>' +
           '<div class="scanbox">' +
             '<div style="text-align:center">' +
               '<div style="background:#FFF;padding:6px;border-radius:8px;display:inline-block;margin-bottom:6px">' +
                 '<img src="./images/eurogrip-qr-sample.png" style="width:72px;height:72px;display:block">' +
               '</div>' +
               '<div style="font-size:0.8rem;color:#FFB020;font-weight:700">' + tyre.id + '</div>' +
               '<span style="font-size:0.75rem;color:#94A3B8">' + tyre.model + '</span>' +
             '</div>' +
           '</div>' +
           '<button class="btn" id="n0">⚡ Simulate Instant Scan</button>' +
           '<button class="btn ghost" id="camLaunch" style="margin-top:6px">📷 Launch Live Device Camera</button>';
    }
  } else if (S.step === 1) {
    h += '<b style="font-size:1.15rem">Identify & Register Tyre</b>' +
         '<div style="background:#151C24;border:1px solid var(--panel-border);border-radius:10px;padding:10px;margin:8px 0">' +
           '<div style="font-weight:700;color:var(--amber);font-size:0.95rem">' + tyre.model + '</div>' +
           '<div style="font-size:0.82rem;color:#CBD5E1">' + tyre.size + ' · ' + tyre.id + '</div>' +
           '<div style="font-size:0.78rem;color:var(--success);margin-top:4px">✓ Authenticated Factory Bead Tag</div>' +
         '</div>' +
         '<label style="color:#94A3B8;margin-top:6px">Mobile number (for warranty OTP)</label>' +
         '<input id="ph" value="98300 12345" style="background:#151C24;color:#F1F5F9;border-color:#283442;padding:8px 12px">' +
         '<label style="color:#94A3B8;margin-top:6px">Fitment Date</label>' +
         '<input id="pd" type="date" value="2026-10-08" style="background:#151C24;color:#F1F5F9;border-color:#283442;padding:8px 12px">' +
         '<button class="btn" id="n1" style="margin-top:12px">Continue to Bike Link →</button>';
  } else if (S.step === 2) {
    h += '<b style="font-size:1.15rem">Confirm Motorcycle</b><small>Recommended for ' + tyre.model + ':</small>';
    var bikeList = tyre.compatibleBikes || Object.keys(BIKES);
    bikeList.forEach(function(k) {
      h += '<button class="opt" data-b="' + k + '" aria-pressed="' + (S.bike === k) + '">🏍️ ' + k + '</button>';
    });
    h += '<button class="btn" id="n2" style="margin-top:6px">Generate Tyre Passport →</button>';
  } else {
    var due = new Date();
    due.setMonth(due.getMonth() + 3);
    h += '<div style="display:flex;align-items:center;justify-content:space-between"><b>Eurogrip Digital Passport</b><span class="tag sm" style="font-size:0.7rem">Active</span></div>';
    [
      ["Model", tyre.model],
      ["Vehicle", S.bike || tyre.recommendedBike],
      ["Fitment", tyre.size + " (" + tyre.position + ")"],
      ["Recommended PSI", tyre.soloPsi + " PSI Solo / " + tyre.pillionPsi + " Pillion"],
      ["Tread Depth", tyre.treadDepth],
      ["Warranty", tyre.warranty],
      ["Next Check", due.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })],
      ["Reward Status", "🎉 +100 Points Awarded!"]
    ].forEach(function(r) {
      h += '<div class="kv"><span>' + r[0] + '</span><span style="font-weight:600;color:#F1F5F9">' + r[1] + '</span></div>';
    });
    h += '<div style="display:flex;gap:8px;margin-top:10px">' +
           '<button class="btn" id="viewPassCard" style="flex:1">📱 Open Passport</button>' +
           '<button class="btn ghost" id="n3" style="flex:1">↺ Scan Again</button>' +
         '</div>';
  }

  p.innerHTML = h;

  var q = function(id, f) {
    var e = $(id);
    if (e) e.onclick = f;
  };
  q("#n0", function() {
    playScanBeep();
    identifyAndDisplayTyre(S.activeTyre.id);
    S.step = 1;
    phone();
    toast("QR Code Scanned & Tyre Identified!");
  });
  q("#camLaunch", function() { startCameraScanner(); });
  q("#camCancel", function() { stopCameraScanner(); });
  q("#camCapture", function() {
    stopCameraScanner();
    playScanBeep();
    identifyAndDisplayTyre(S.activeTyre.id);
    S.step = 1;
    phone();
    toast("Camera Tag captured: " + S.activeTyre.model);
  });
  q("#viewPassCard", function() { openPassportModal(); });
  q("#n1", function() { S.step = 2; phone(); });
  q("#n2", function() {
    if (!S.bike) { toast("Please pick your bike first"); return; }
    S.step = 3;
    if (!S.done.reg) {
      S.done.reg = 1;
      S.rider += 100;
      rUpd();
      toast("Tyre Registered! +100 Loyalty Points credited");
    }
    phone();
  });
  q("#n3", function() { S.step = 0; phone(); });
  p.querySelectorAll(".opt").forEach(function(o) {
    o.onclick = function() {
      S.bike = o.dataset.b;
      phone();
    };
  });
}

// Module B: Health & Reminders Demo
function remUpd() {
  var kmEl = $("#km");
  var moEl = $("#mo");
  if (!kmEl || !moEl) return;

  var km = +kmEl.value;
  var mo = +moEl.value;
  var kmVal = $("#kmVal");
  var moVal = $("#moVal");
  if (kmVal) kmVal.textContent = km.toLocaleString() + " km";
  if (moVal) moVal.textContent = mo + (mo === 1 ? " month" : " months");

  var pk = Math.min(100, (km / 3000) * 100);
  var pm = Math.min(100, (mo / 3) * 100);
  var pc = Math.max(pk, pm);
  var due = pc >= 100;
  var soon = pc >= 70;
  var col = due ? "#EF4444" : soon ? "#FFB300" : "#10B981";

  var remPhone = $("#remphone");
  if (!remPhone) return;

  var activeModel = S.activeTyre ? S.activeTyre.model : "Eurogrip ProTorq Extreme";

  remPhone.innerHTML =
    '<div class="phone-notch"></div>' +
    '<div style="display:flex;align-items:center;justify-content:space-between"><b>Tyre Telemetry</b><span class="tag sm" style="background:rgba(255,255,255,0.1);color:#FFF">Live</span></div>' +
    '<small>' + activeModel + ' · ' + (S.bike || "Royal Enfield Classic 350") + '</small>' +
    '<div style="background:#202934;height:12px;border-radius:6px;margin:12px 0;overflow:hidden">' +
      '<div style="height:12px;border-radius:6px;width:' + Math.min(100, pc) + '%;background:' + col + ';transition:width 0.3s ease, background 0.3s ease"></div>' +
    '</div>' +
    '<div class="kv"><span>Distance Logged</span><span style="font-weight:700">' + km.toLocaleString() + ' km</span></div>' +
    '<div class="kv"><span>Time Since Last Inspection</span><span style="font-weight:700">' + mo + ' mo</span></div>' +
    '<div class="kv"><span>Estimated Tread Remaining</span><span style="font-weight:700;color:' + col + '">' + Math.max(15, Math.round(100 - (km/120))) + '%</span></div>' +
    '<div style="background:#151C24;border:1px solid ' + col + ';border-radius:12px;padding:14px;margin-top:10px">' +
      (due
        ? '<b style="color:#EF4444;font-size:1rem">⚠️ Tyre Inspection Overdue!</b><br><small style="color:#CBD5E1">Visit your verified Eurogrip mechanic for a complimentary pressure & tread alignment check. Earn 50 points.</small>'
        : soon
        ? '<b style="color:#FFB300;font-size:1rem">🔔 Check Window Approaching</b><br><small style="color:#CBD5E1">You are approaching recommended check interval. Plan a quick visit this month.</small>'
        : '<b style="color:#10B981;font-size:1rem">✅ Tyres in Prime Condition</b><br><small style="color:#CBD5E1">All parameters healthy. Automated WhatsApp reminder will alert you when service is due.</small>') +
    '</div>' +
    (due ? '<button class="btn" id="fm" style="margin-top:10px">📍 Find Nearest Eurogrip Mechanic (+50 pts)</button>' : '');

  var f = $("#fm");
  if (f) {
    f.onclick = function() {
      toast("Opening GPS Mechanic Locator: 4 garages found within 3 km");
    };
  }
}

// Module C: Mechanic Dashboard
var rows = typeof INITIAL_MECHANIC_ROWS !== "undefined"
  ? INITIAL_MECHANIC_ROWS.slice()
  : [
      { n: "Karan Verma", a: "reg", p: 20 },
      { n: "Sunil Roy", a: "chk", p: 30 },
      { n: "Self", a: "trn", p: 15 }
    ];

function updateMechanicUI() {
  var mp = $("#mp");
  var ml = $("#ml");
  var mlog = $("#mlog");
  if (mp) mp.textContent = S.mech;
  if (ml) ml.textContent = level(S.mech);
  if (mlog) {
    mlog.innerHTML = rows.slice(0, 6).map(function(r) {
      return "<tr><td><strong>" + esc(r.n) + "</strong></td><td>" + (NM[r.a] || r.a) + "</td><td class='r' style='color:var(--amber);font-weight:700'>+" + r.p + "</td></tr>";
    }).join("");
  }
}

function esc(s) {
  return String(s || "").replace(/[&<>"']/g, function(c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}

// Module D: Rewards Engine
function rUpd() {
  var rp = $("#rp");
  var rn = $("#rn");
  var cat = $("#cat");
  if (rp) rp.textContent = S.rider;
  var nx = CAT.filter(function(c) { return c[0] > S.rider; })[0];
  if (rn) rn.textContent = nx ? (nx[0] - S.rider) + " pts away" : "🎉 All Tiers Unlocked";
  if (cat) {
    cat.innerHTML = CAT.map(function(c) {
      var ok = S.rider >= c[0];
      return '<div class="kv" style="padding:10px 0;border-color:var(--panel-border)"><span style="color:var(--ink);font-weight:500">' + c[1] + '</span><span style="color:' + (ok ? "var(--success)" : "var(--mute)") + ';font-weight:700;display:inline-flex;align-items:center;gap:4px">' + (ok ? "✓ Unlocked" : c[0] + " pts") + '</span></div>';
    }).join("");
  }
}

// Strategic Trust Loop Navigator
function pick(i) {
  document.querySelectorAll(".node").forEach(function(n) {
    n.setAttribute("aria-pressed", n.dataset.i == i);
  });
  var info = $("#loop-info");
  if (!info) return;

  info.innerHTML =
    '<span class="tag" style="margin-bottom:12px">Stage ' + (i + 1) + ' of ' + LOOP.length + '</span>' +
    '<h3 style="font-size:1.75rem;color:var(--amber);margin:8px 0 12px">' + LOOP[i][0] + '</h3>' +
    '<p style="font-size:1.05rem;line-height:1.6;color:var(--ink-secondary)">' + LOOP[i][1] + '</p>' +
    '<div style="margin-top:24px;display:flex;gap:12px">' +
      '<button class="btn sm" onclick="pick(' + ((i + 1) % LOOP.length) + ')">Next Step →</button>' +
      (i > 0 ? '<button class="btn sm ghost" onclick="pick(' + (i - 1) + ')">← Previous</button>' : '') +
    '</div>';
}
