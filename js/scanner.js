/**
 * Eurogrip TYRE+ | Scanner & Digital Passport Module
 * Handles camera video streams, Web Audio sound synthesis,
 * QR/barcode decoding, dynamic tyre dossier rendering & digital passport.
 */

var activeCameraStream = null;
var cameraScanInterval = null;

// Audio Feedback Synthesizer (Scanner Confirmation Beep)
function playScanBeep() {
  try {
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    var ctx = new AudioCtx();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12); // A6

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.16);

    // Haptic feedback on supported mobile devices
    if (navigator.vibrate) {
      navigator.vibrate([40, 60, 40]);
    }
  } catch (e) {
    // Audio context may require prior user interaction
  }
}

function startCameraScanner() {
  var tabQR = document.querySelector("[data-t='qr']");
  if (tabQR) tabQR.click();
  location.href = '#solution';

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } }
    })
      .then(function(stream) {
        activeCameraStream = stream;
        S.step = 0;
        S.cameraActive = true;
        phone();
        setTimeout(function() {
          var v = $("#scannerVideo");
          if (v) {
            v.srcObject = stream;
            v.play();
            initLiveVideoDecoder(v);
          }
        }, 120);
        toast("Camera active! Point at tyre sidewall barcode or QR tag.");
      })
      .catch(function(err) {
        toast("Camera permission unavailable. Using interactive scanner.");
        S.cameraActive = false;
        phone();
      });
  } else {
    toast("Camera API not supported on this browser.");
  }
}

function stopCameraScanner() {
  if (cameraScanInterval) {
    clearInterval(cameraScanInterval);
    cameraScanInterval = null;
  }
  if (activeCameraStream) {
    activeCameraStream.getTracks().forEach(function(t) { t.stop(); });
    activeCameraStream = null;
  }
  S.cameraActive = false;
  phone();
}

// Real-Time Frame Decoder using BarcodeDetector or jsQR
function initLiveVideoDecoder(videoElement) {
  if (cameraScanInterval) clearInterval(cameraScanInterval);

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d", { willReadFrequently: true });

  var barcodeDetector = null;
  if ("BarcodeDetector" in window) {
    try {
      barcodeDetector = new BarcodeDetector({ formats: ["qr_code", "data_matrix", "code_128", "ean_13"] });
    } catch(e) {}
  }

  cameraScanInterval = setInterval(function() {
    if (!S.cameraActive || videoElement.readyState !== videoElement.HAVE_ENOUGH_DATA) return;

    canvas.width = videoElement.videoWidth || 320;
    canvas.height = videoElement.videoHeight || 240;
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    if (barcodeDetector) {
      barcodeDetector.detect(videoElement)
        .then(function(barcodes) {
          if (barcodes && barcodes.length > 0) {
            var rawValue = barcodes[0].rawValue;
            handleDetectedCode(rawValue);
          }
        })
        .catch(function() {});
    } else if (window.jsQR) {
      try {
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var code = window.jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          handleDetectedCode(code.data);
        }
      } catch (err) {}
    }
  }, 280);
}

function handleDetectedCode(detectedValue) {
  stopCameraScanner();
  playScanBeep();
  identifyAndDisplayTyre(detectedValue);
  S.step = 1;
  phone();
  toast("Tag Detected: " + (S.activeTyre ? S.activeTyre.model : detectedValue));
}

// Decode Uploaded Image File
function handleUploadedImageFile(file) {
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      var matched = false;
      if (window.jsQR) {
        try {
          var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          var qrCode = window.jsQR(imgData.data, imgData.width, imgData.height);
          if (qrCode && qrCode.data) {
            identifyAndDisplayTyre(qrCode.data);
            matched = true;
          }
        } catch(err) {}
      }

      if (!matched) {
        // Fallback: match by file name or choose next catalog model
        identifyAndDisplayTyre(file.name);
      }
      playScanBeep();
      S.step = 1;
      phone();
      toast("Image Tag analyzed: " + S.activeTyre.model);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Tyre Identification & Dossier Rendering Engine
function identifyAndDisplayTyre(payload) {
  var tyre = findTyreByPayload(payload);
  if (!tyre) tyre = TYRE_DATABASE[DEFAULT_TYRE_ID];

  S.activeTyre = tyre;
  S.bike = tyre.recommendedBike || S.bike;

  // Update preset chip highlights
  document.querySelectorAll(".preset-chip").forEach(function(chip) {
    chip.classList.toggle("active", chip.dataset.tyre === tyre.id);
  });

  // Update scanner card title
  var cardTitle = $("#scannerCardTitle");
  if (cardTitle) {
    cardTitle.textContent = "Active Tag: " + tyre.model;
  }

  // Render Full Technical Dossier Card
  renderTyreDossier(tyre);

  // Synchronize Phone Simulator
  if (typeof phone === "function") phone();

  // Synchronize Passport Modal
  syncPassportModal(tyre);
}

function renderTyreDossier(tyre) {
  var container = $("#scannedTyreDossier");
  if (!container) return;

  var bikesHtml = tyre.compatibleBikes.map(function(b) {
    var isCurrent = (b === S.bike);
    return '<span class="bike-tag-chip" style="' + (isCurrent ? 'border-color:var(--amber);color:var(--amber);font-weight:700' : '') + '">' +
           '🏍️ ' + b + (isCurrent ? ' (Selected)' : '') +
           '</span>';
  }).join("");

  container.innerHTML =
    '<div class="tyre-dossier-card">' +
      '<div class="tyre-dossier-header">' +
        '<div>' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">' +
            '<span class="tag ' + (tyre.tagColor || 'amber') + '">' + tyre.tagIcon + ' ' + tyre.category + '</span>' +
            '<span class="tag sm" style="font-size:0.75rem;background:rgba(16,185,129,0.15);color:var(--success);border-color:rgba(16,185,129,0.3)">✓ Verified Factory Serialization</span>' +
          '</div>' +
          '<h3 class="tyre-dossier-title">' + tyre.model + '</h3>' +
          '<div class="tyre-dossier-subtitle">' +
            '<span>Size: ' + tyre.size + '</span>' +
            '<span>·</span>' +
            '<span>Position: ' + tyre.position + '</span>' +
            '<span>·</span>' +
            '<span style="color:var(--ink-secondary)">Serial: ' + tyre.id + '</span>' +
          '</div>' +
        '</div>' +
        '<div style="text-align:right">' +
          '<button class="btn sm" onclick="openPassportModal()">📱 Open Digital Passport</button>' +
        '</div>' +
      '</div>' +

      '<!-- 4 KEY METRIC BADGES -->' +
      '<div class="spec-badges-grid">' +
        '<div class="spec-badge-item">' +
          '<span class="spec-badge-label">Solo Pressure</span>' +
          '<span class="spec-badge-val" style="color:var(--cyan)">' + tyre.soloPsi + ' PSI</span>' +
        '</div>' +
        '<div class="spec-badge-item">' +
          '<span class="spec-badge-label">Pillion Pressure</span>' +
          '<span class="spec-badge-val" style="color:var(--amber)">' + tyre.pillionPsi + ' PSI</span>' +
        '</div>' +
        '<div class="spec-badge-item">' +
          '<span class="spec-badge-label">Virgin Tread Depth</span>' +
          '<span class="spec-badge-val" style="color:var(--success)">' + tyre.treadDepth + '</span>' +
        '</div>' +
        '<div class="spec-badge-item">' +
          '<span class="spec-badge-label">Estimated Lifespan</span>' +
          '<span class="spec-badge-val">' + tyre.lifeEstimate + '</span>' +
        '</div>' +
      '</div>' +

      '<!-- RADAR / CAPABILITY METERS -->' +
      '<div class="spec-metrics-bars">' +
        '<div>' +
          '<div class="metric-row"><span>Dry Road Cornering Grip</span><span style="color:var(--amber)">' + tyre.dryGrip + '%</span></div>' +
          '<div class="metric-progress-bg"><div class="metric-progress-fill" style="width:' + tyre.dryGrip + '%;background:var(--amber)"></div></div>' +
        '</div>' +
        '<div>' +
          '<div class="metric-row"><span>Wet Monsoon Safety & Sipes</span><span style="color:var(--cyan)">' + tyre.wetGrip + '%</span></div>' +
          '<div class="metric-progress-bg"><div class="metric-progress-fill" style="width:' + tyre.wetGrip + '%;background:var(--cyan)"></div></div>' +
        '</div>' +
        '<div>' +
          '<div class="metric-row"><span>Tread Wear Longevity</span><span style="color:var(--success)">' + tyre.mileageRating + '%</span></div>' +
          '<div class="metric-progress-bg"><div class="metric-progress-fill" style="width:' + tyre.mileageRating + '%;background:var(--success)"></div></div>' +
        '</div>' +
        '<div>' +
          '<div class="metric-row"><span>Rough Terrain / Off-Road Stability</span><span style="color:#FFA726">' + tyre.offRoadRating + '%</span></div>' +
          '<div class="metric-progress-bg"><div class="metric-progress-fill" style="width:' + tyre.offRoadRating + '%;background:#FFA726"></div></div>' +
        '</div>' +
      '</div>' +

      '<!-- DETAILED SPECIFICATIONS TABLE -->' +
      '<div class="scroll" style="margin-top:16px">' +
        '<table style="font-size:0.9rem">' +
          '<tbody>' +
            '<tr><td style="color:var(--mute);width:30%"><strong>Compound Formulation</strong></td><td>' + tyre.compound + '</td></tr>' +
            '<tr><td style="color:var(--mute)"><strong>Construction & Ply</strong></td><td>' + tyre.construction + '</td></tr>' +
            '<tr><td style="color:var(--mute)"><strong>Speed & Load Capacity</strong></td><td>' + tyre.speedRating + ' / ' + tyre.loadIndex + '</td></tr>' +
            '<tr><td style="color:var(--mute)"><strong>Manufacturing Batch</strong></td><td>' + tyre.batch + ' (' + tyre.manufactureDate + ')</td></tr>' +
            '<tr><td style="color:var(--mute)"><strong>Engineering Highlight</strong></td><td>' + tyre.highlightFeature + '</td></tr>' +
            '<tr><td style="color:var(--mute)"><strong>Factory Warranty Shield</strong></td><td style="color:var(--success);font-weight:700">● ' + tyre.warranty + '</td></tr>' +
          '</tbody>' +
        '</table>' +
      '</div>' +

      '<!-- COMPATIBLE MOTORCYCLES -->' +
      '<div class="compatible-bikes-box">' +
        '<span class="compatible-bikes-title">Recommended Motorcycle Fitment Matrix:</span>' +
        '<div class="bike-tag-chips">' + bikesHtml + '</div>' +
      '</div>' +
    '</div>';
}

function syncPassportModal(tyre) {
  var m = $("#passportModal");
  if (!m) return;

  var t = tyre || S.activeTyre || TYRE_DATABASE[DEFAULT_TYRE_ID];
  var card = m.querySelector(".passport-card");
  if (!card) return;

  var due = new Date();
  due.setMonth(due.getMonth() + 3);

  card.innerHTML =
    '<button class="passport-close" onclick="closePassportModal()" aria-label="Close modal">✕</button>' +
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">' +
      '<div style="width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg,var(--amber),#FF6B00);display:grid;place-items:center;font-weight:900;color:#000;font-size:1.3rem">E</div>' +
      '<div>' +
        '<h3 style="font-size:1.4rem;line-height:1.1;color:#FFF">EUROGRIP TYRE+</h3>' +
        '<span style="font-size:0.8rem;color:var(--amber);font-weight:700">Official Digital Tyre Passport</span>' +
      '</div>' +
    '</div>' +

    '<div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:14px;margin-bottom:14px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
        '<span class="tag sm" style="font-size:0.75rem">Serial Verified</span>' +
        '<span style="color:#10B981;font-weight:700;font-size:0.85rem">● ' + t.warranty + '</span>' +
      '</div>' +
      '<div style="font-size:1.45rem;font-weight:800;font-family:\'Barlow Condensed\',sans-serif;color:#FFF">' + t.model + '</div>' +
      '<div style="color:var(--mute);font-size:0.88rem">Fitment: ' + t.size + ' · ' + t.position + '</div>' +
      '<div style="font-size:0.82rem;color:var(--amber);margin-top:4px">Serial ID: ' + t.id + ' (' + t.batch + ')</div>' +
    '</div>' +

    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">' +
      '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:10px">' +
        '<small style="color:var(--mute);display:block">Solo Pressure</small>' +
        '<strong style="color:#FFF;font-size:1.1rem">' + t.soloPsi + ' PSI</strong>' +
      '</div>' +
      '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:10px">' +
        '<small style="color:var(--mute);display:block">Pillion Pressure</small>' +
        '<strong style="color:#FFF;font-size:1.1rem">' + t.pillionPsi + ' PSI</strong>' +
      '</div>' +
      '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:10px">' +
        '<small style="color:var(--mute);display:block">Virgin Tread Depth</small>' +
        '<strong style="color:#10B981;font-size:1.1rem">' + t.treadDepth + '</strong>' +
      '</div>' +
      '<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:10px">' +
        '<small style="color:var(--mute);display:block">Next Check-In</small>' +
        '<strong style="color:var(--amber);font-size:1.1rem">In 90 Days</strong>' +
      '</div>' +
    '</div>' +

    '<div style="display:flex;gap:10px;flex-direction:column">' +
      '<button class="btn" style="width:100%" onclick="savePassportWallet()">📲 Add to Apple / Google Wallet</button>' +
      '<button class="btn ghost" style="width:100%" onclick="closePassportModal(); document.querySelector(\'[data-t=\\\'rem\\\']\').click(); location.href=\'#solution\';">⏱️ Schedule Tyre Inspection</button>' +
    '</div>';
}

function openPassportModal() {
  var m = $("#passportModal");
  if (m) {
    syncPassportModal(S.activeTyre);
    m.classList.add("open");
  }
}

function closePassportModal() {
  var m = $("#passportModal");
  if (m) m.classList.remove("open");
}

function savePassportWallet() {
  toast("Added to Digital Wallet! Eurogrip warranty registered.");
  setTimeout(closePassportModal, 1400);
}
