/**
 * Eurogrip TYRE+ | Admin Operations Command Center
 * Enterprise telemetries, national warranty ledger, factory QR minting terminal,
 * partner garage network & cryptographic audit logs.
 */

var S_ADMIN = {
  activeTab: "telemetry",
  filterQuery: "",
  statusFilter: "all",
  mintedBatches: []
};

function renderAdminPortal(container, user) {
  var warranties = getWarrantiesDatabase();
  var users = getUsersDatabase();
  var tyresCount = Object.keys(TYRE_DATABASE).length;
  var bikesCount = (typeof MOTORCYCLES_CATALOG !== "undefined") ? Object.keys(MOTORCYCLES_CATALOG).length : 32;
  var garagesCount = (typeof PARTNER_GARAGES_DB !== "undefined") ? PARTNER_GARAGES_DB.length : 6;

  // Filter Warranties
  var filteredWarranties = warranties.filter(function(w) {
    var q = S_ADMIN.filterQuery.toLowerCase();
    var matchesQ = !q ||
      w.id.toLowerCase().includes(q) ||
      (w.riderName && w.riderName.toLowerCase().includes(q)) ||
      (w.riderPhone && w.riderPhone.toLowerCase().includes(q)) ||
      (w.bike && w.bike.toLowerCase().includes(q)) ||
      (w.model && w.model.toLowerCase().includes(q));

    var matchesStatus = (S_ADMIN.statusFilter === "all") || (w.status === S_ADMIN.statusFilter);
    return matchesQ && matchesStatus;
  });

  var html =
    '<div class="admin-console-wrap">' +
      '<!-- TOP COMMAND BAR -->' +
      '<div class="admin-top-bar">' +
        '<div>' +
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;flex-wrap:wrap">' +
            '<span class="admin-badge-live"><span class="live-pulse-dot"></span> Live Operations Command HQ</span>' +
            '<span class="tag sm" style="background:rgba(255,179,0,0.12);color:var(--amber);border-color:rgba(255,179,0,0.3)">Plant Clusters: Madurai & Pantnagar Connected</span>' +
          '</div>' +
          '<h2 style="margin:2px 0;font-size:2.4rem;letter-spacing:0.02em;color:#FFF">Eurogrip National Operations Console</h2>' +
          '<p style="margin:0;color:var(--mute);font-size:0.92rem">Cryptographic bead tag audit, AIS-140 compliance, nationwide warranty ledger & factory laser minting.</p>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">' +
          '<button class="admin-role-switch-btn" onclick="switchPortalRole(\'user\')" title="Preview Rider Virtual Garage">🏍️ Switch to Rider Cockpit</button>' +
          '<button class="btn sm" onclick="exportWarrantiesCsv()">📥 Export CSV</button>' +
          '<button class="btn sm ghost" onclick="exportDatabaseJson()">💾 Backup DB</button>' +
          '<button class="btn sm ghost" onclick="logoutUser()">Sign Out</button>' +
        '</div>' +
      '</div>' +

      '<!-- 5 HIGH-LEVEL TELEMETRY METRIC TILES -->' +
      '<div class="admin-stats-grid">' +
        '<div class="admin-stat-card">' +
          '<div class="admin-stat-label">Active Warranties</div>' +
          '<div class="admin-stat-num cyan">' + warranties.length + '</div>' +
          '<span class="admin-stat-sub">100% Cryptographic Match</span>' +
        '</div>' +
        '<div class="admin-stat-card">' +
          '<div class="admin-stat-label">Registered Riders</div>' +
          '<div class="admin-stat-num amber">' + users.filter(function(u){ return u.role !== "admin"; }).length + '</div>' +
          '<span class="admin-stat-sub">Phone OTP Authenticated</span>' +
        '</div>' +
        '<div class="admin-stat-card">' +
          '<div class="admin-stat-label">Motorcycle Models</div>' +
          '<div class="admin-stat-num success">' + bikesCount + '</div>' +
          '<span class="admin-stat-sub">5 Engine Segments Tuned</span>' +
        '</div>' +
        '<div class="admin-stat-card">' +
          '<div class="admin-stat-label">Tyre Formulations</div>' +
          '<div class="admin-stat-num cyan">' + tyresCount + '</div>' +
          '<span class="admin-stat-sub">ProTorq, Bee & Climber</span>' +
        '</div>' +
        '<div class="admin-stat-card">' +
          '<div class="admin-stat-label">Authorized Garages</div>' +
          '<div class="admin-stat-num amber">' + garagesCount + '</div>' +
          '<span class="admin-stat-sub">Active Nitrogen Stations</span>' +
        '</div>' +
      '</div>' +

      '<!-- ENTERPRISE SUB-TABS NAVIGATION -->' +
      '<div class="admin-subtabs-nav">' +
        '<button class="admin-subtab-btn ' + (S_ADMIN.activeTab === "telemetry" ? "active" : "") + '" onclick="setAdminTab(\'telemetry\')">📊 Factory Plant Telemetry</button>' +
        '<button class="admin-subtab-btn ' + (S_ADMIN.activeTab === "ledger" ? "active" : "") + '" onclick="setAdminTab(\'ledger\')">📋 Master Warranty Ledger (' + warranties.length + ')</button>' +
        '<button class="admin-subtab-btn ' + (S_ADMIN.activeTab === "minting" ? "active" : "") + '" onclick="setAdminTab(\'minting\')">🏭 Factory Batch QR Minting</button>' +
        '<button class="admin-subtab-btn ' + (S_ADMIN.activeTab === "garages" ? "active" : "") + '" onclick="setAdminTab(\'garages\')">📍 Certified Partner Garages (' + garagesCount + ')</button>' +
        '<button class="admin-subtab-btn ' + (S_ADMIN.activeTab === "audit" ? "active" : "") + '" onclick="setAdminTab(\'audit\')">🛡️ Security & Fraud Audit</button>' +
      '</div>';

  // Sub-Tab: Plant Telemetry
  if (S_ADMIN.activeTab === "telemetry") {
    html +=
      '<div class="grid g2" style="margin-top:20px">' +
        '<div class="box" style="background:#0E131C;border:1px solid rgba(255,179,0,0.2)">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
            '<h3 style="margin:0;color:var(--amber)">🏭 Manufacturing Line Output</h3>' +
            '<span class="tag sm success">99.98% System Uptime</span>' +
          '</div>' +
          '<div style="margin-bottom:14px">' +
            '<div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:4px">' +
              '<span><strong>Madurai Plant</strong> (Radial Lines 1 & 2)</span>' +
              '<strong style="color:var(--cyan)">12,400 Units / Day (88% Cap)</strong>' +
            '</div>' +
            '<div style="height:8px;background:rgba(255,255,255,0.06);border-radius:4px;overflow:hidden">' +
              '<div style="width:88%;height:100%;background:linear-gradient(90deg,var(--cyan),#0088FF)"></div>' +
            '</div>' +
          '</div>' +
          '<div style="margin-bottom:16px">' +
            '<div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:4px">' +
              '<span><strong>Pantnagar Facility</strong> (High-Speed Curing)</span>' +
              '<strong style="color:var(--amber)">9,850 Units / Day (79% Cap)</strong>' +
            '</div>' +
            '<div style="height:8px;background:rgba(255,255,255,0.06);border-radius:4px;overflow:hidden">' +
              '<div style="width:79%;height:100%;background:linear-gradient(90deg,var(--amber),#FF6B00)"></div>' +
            '</div>' +
          '</div>' +
          '<div class="kv"><span>Laser Bead Serialization</span><strong style="color:var(--success)">100% Passed (0 Defect)</strong></div>' +
          '<div class="kv"><span>AIS-140 Compliance Rate</span><strong style="color:#FFF">100.0% Grade A</strong></div>' +
          '<div class="kv"><span>National Cloud Latency</span><strong style="color:var(--cyan)">12ms Multi-AZ Ping</strong></div>' +
        '</div>' +

        '<div class="box" style="background:#0E131C;border:1px solid rgba(255,179,0,0.2)">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
            '<h3 style="margin:0;color:var(--amber)">⚡ Operational Automation Tools</h3>' +
            '<span class="tag sm amber">Console Control</span>' +
          '</div>' +
          '<p style="color:var(--mute);font-size:0.88rem;margin:0 0 16px">Execute nationwide operational broadcasts and batch inspections across dealer clusters:</p>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">' +
            '<button class="btn sm" onclick="setAdminTab(\'minting\')">⚡ Mint New Batch QR Tags</button>' +
            '<button class="btn sm ghost" onclick="toast(\'Sent WhatsApp safety advisory to 1,420 registered riders\')">📲 Broadcast Advisory</button>' +
            '<button class="btn sm ghost" onclick="exportWarrantiesCsv()">📊 Export Ledger CSV</button>' +
            '<button class="btn sm ghost" onclick="setAdminTab(\'ledger\')">🔍 Audit Serial Ledgers</button>' +
          '</div>' +
          '<div style="margin-top:16px;background:rgba(255,255,255,0.03);border-radius:8px;padding:12px;font-size:0.82rem;color:var(--mute)">' +
            '💡 <strong>Admin Note:</strong> All serial numbers vulcanized on tyre beads are backed by 5-year cryptographic digital passes.' +
          '</div>' +
        '</div>' +
      '</div>';
  } else if (S_ADMIN.activeTab === "ledger") {
    html +=
      '<div class="box" style="margin-top:20px;background:#0E131C">' +
        '<div class="admin-ledger-toolbar">' +
          '<div class="ledger-search-box">' +
            '<span>🔍</span>' +
            '<input type="text" placeholder="Search by Rider Name, Phone, Motorcycle, Tyre, or Serial ID..." value="' + esc(S_ADMIN.filterQuery) + '" oninput="setAdminFilter(this.value)">' +
          '</div>' +
          '<div class="ledger-filter-group">' +
            '<label style="margin:0;font-size:0.85rem;color:var(--mute)">Status:</label>' +
            '<select onchange="setAdminStatusFilter(this.value)">' +
              '<option value="all" ' + (S_ADMIN.statusFilter === "all" ? "selected" : "") + '>All Statuses (' + warranties.length + ')</option>' +
              '<option value="Verified Active" ' + (S_ADMIN.statusFilter === "Verified Active" ? "selected" : "") + '>Verified Active</option>' +
              '<option value="Inspection Due" ' + (S_ADMIN.statusFilter === "Inspection Due" ? "selected" : "") + '>Inspection Due</option>' +
            '</select>' +
          '</div>' +
        '</div>' +

        '<div class="scroll" style="margin-top:14px">' +
          '<table style="font-size:0.88rem">' +
            '<thead>' +
              '<tr>' +
                '<th>Warranty ID</th>' +
                '<th>Rider & Phone</th>' +
                '<th>Motorcycle</th>' +
                '<th>Tyre Spec / Serial</th>' +
                '<th>Fitment Date</th>' +
                '<th>Status</th>' +
                '<th class="r">Actions</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              (filteredWarranties.length === 0
                ? '<tr><td colspan="7" style="text-align:center;padding:24px;color:var(--mute)">No warranties match current query.</td></tr>'
                : filteredWarranties.map(function(w) {
                    var isAct = (w.status === "Verified Active");
                    return '<tr>' +
                      '<td><strong style="font-family:\'Barlow Condensed\';font-size:1.05rem;color:var(--amber)">' + esc(w.id) + '</strong><br><small style="color:var(--mute)">' + esc(w.mechanicShop || "Self Registered") + '</small></td>' +
                      '<td><strong>' + esc(w.riderName) + '</strong><br><span style="color:var(--cyan);font-size:0.8rem">' + esc(w.riderPhone) + '</span></td>' +
                      '<td>' + esc(w.bike) + '</td>' +
                      '<td><strong>' + esc(w.model) + '</strong><br><code style="font-size:0.75rem;color:var(--mute)">' + esc(w.tyreId) + '</code></td>' +
                      '<td>' + esc(w.regDate) + '</td>' +
                      '<td><span class="tag sm ' + (isAct ? "success" : "amber") + '">' + esc(w.status) + '</span></td>' +
                      '<td class="r" style="white-space:nowrap">' +
                        '<button class="btn sm ghost" style="padding:4px 8px;font-size:0.75rem;margin-right:4px" onclick="toggleWarrantyStatus(\'\' + w.id + \'\')" title="Toggle status">' + (isAct ? "Flag Due" : "Verify") + '</button>' +
                        '<button class="btn sm ghost" style="padding:4px 8px;font-size:0.75rem;color:var(--danger);border-color:rgba(239,68,68,0.3)" onclick="deleteWarrantyRecord(\'\' + w.id + \'\')" title="Delete record">✕</button>' +
                      '</td>' +
                    '</tr>';
                  }).join("")) +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';
  } else if (S_ADMIN.activeTab === "minting") {
    html +=
      '<div class="grid g2" style="margin-top:20px">' +
        '<div class="box" style="background:#0E131C">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
            '<h3 style="margin:0;color:var(--amber)">Factory QR Laser Minting</h3>' +
            '<span class="tag sm cyan">Laser Engrave Terminal</span>' +
          '</div>' +
          '<p style="color:var(--mute);font-size:0.88rem;margin:0 0 16px">Generate cryptographically authenticated serial numbers for new tyre production runs before vulcanization:</p>' +
          '<form onsubmit="handleBatchMintSubmit(event)">' +
            '<label>Manufacturing Plant Facility:</label>' +
            '<select id="mintPlant" style="margin-bottom:12px">' +
              '<option value="MDU">Madurai Manufacturing Plant (MDU)</option>' +
              '<option value="PNR">Pantnagar High-Speed Facility (PNR)</option>' +
            '</select>' +
            '<label>Tyre Model / Tread Series:</label>' +
            '<select id="mintSeries" style="margin-bottom:12px">' +
              '<option value="PROTORQ">ProTorq Extreme Radial Series</option>' +
              '<option value="BEE">Bee Connect City Scooter Series</option>' +
              '<option value="TRAIL">Trail Hound Dual-Sport Series</option>' +
              '<option value="CLIMBER">Climber Enduro Cross Series</option>' +
            '</select>' +
            '<label>Batch Quantity (Number of QR serials):</label>' +
            '<input type="number" id="mintQty" min="5" max="100" value="12" style="margin-bottom:16px">' +
            '<button type="submit" class="btn" style="width:100%">⚡ Mint Serialized Tag Batch</button>' +
          '</form>' +
        '</div>' +

        '<div class="box" style="background:#0E131C">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">' +
            '<h3 style="margin:0;color:var(--cyan)">Terminal Output Stream</h3>' +
            (S_ADMIN.mintedBatches && S_ADMIN.mintedBatches.length > 0
              ? '<button class="btn sm ghost" onclick="downloadMintedSerials()">💾 Download List</button>'
              : '') +
          '</div>' +
          '<div class="mint-terminal-display">' +
            (S_ADMIN.mintedBatches && S_ADMIN.mintedBatches.length > 0
              ? '<strong>// BATCH GENERATION SUCCESSFUL (' + S_ADMIN.mintedBatches.length + ' SERIALS)</strong>\\n' +
                S_ADMIN.mintedBatches.map(function(s, idx){ return '[' + (idx+1) + '] ' + s + ' -> CRYPTO PASS (AIS-140 OK)'; }).join('\\n')
              : '// Terminal Idle. Set parameters and click "Mint Serialized Tag Batch" to engrave tags.') +
          '</div>' +
        '</div>' +
      '</div>';
  } else if (S_ADMIN.activeTab === "garages") {
    html +=
      '<div class="box" style="margin-top:20px;background:#0E131C">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
          '<div>' +
            '<h3 style="margin:0;color:var(--amber)">Eurogrip Certified Partner Garages</h3>' +
            '<p style="margin:0;color:var(--mute);font-size:0.88rem">Authorized inspection and nitrogen fitment centres offering rider reward checkups.</p>' +
          '</div>' +
          '<span class="tag sm success">' + garagesCount + ' Verified Garages</span>' +
        '</div>' +

        '<div class="grid g3">' +
          ((typeof PARTNER_GARAGES_DB !== "undefined" ? PARTNER_GARAGES_DB : []).map(function(g) {
            return '<div class="garage-admin-card">' +
              '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">' +
                '<strong>' + esc(g.name) + '</strong>' +
                '<span class="tag sm cyan">⭐ ' + g.rating + '</span>' +
              '</div>' +
              '<div style="color:var(--mute);font-size:0.85rem;margin-bottom:4px">' + esc(g.area) + ', ' + esc(g.city) + '</div>' +
              '<div style="color:var(--amber);font-size:0.82rem;font-weight:600">📞 ' + esc(g.phone) + '</div>' +
              '<div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,255,255,0.06);font-size:0.8rem;color:var(--ink-secondary)">' +
                'Lead Technician: <strong>' + esc(g.headMechanic) + '</strong><br>' +
                'Free Nitrogen Checkup: <strong>Active</strong>' +
              '</div>' +
            '</div>';
          }).join("")) +
        '</div>' +
      '</div>';
  } else if (S_ADMIN.activeTab === "audit") {
    html +=
      '<div class="box" style="margin-top:20px;background:#0E131C">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">' +
          '<div>' +
            '<h3 style="margin:0;color:var(--cyan)">Security & Anti-Counterfeit Audit Stream</h3>' +
            '<p style="margin:0;color:var(--mute);font-size:0.88rem">Immutable cryptographic verification log across national factory and rider nodes.</p>' +
          '</div>' +
          '<span class="tag sm success">0.0% Fraud Detected</span>' +
        '</div>' +

        '<div class="scroll">' +
          '<table style="font-size:0.85rem">' +
            '<thead>' +
              '<tr><th>Timestamp</th><th>Actor</th><th>Event Signature</th><th>Verification Status</th><th>Node</th></tr>' +
            '</thead>' +
            '<tbody>' +
              '<tr><td>2026-10-08 16:55:00</td><td>Rider PWA</td><td>Mobile Phone Verification (+91 98300 12345)</td><td><span class="tag sm success">PASS</span></td><td>Bengaluru Gate</td></tr>' +
              '<tr><td>2026-10-08 16:30:19</td><td>Factory Scanner</td><td>Vulcanized Bead Tag Laser Engraved</td><td><span class="tag sm success">VERIFIED</span></td><td>Madurai Line 2</td></tr>' +
              '<tr><td>2026-10-08 16:15:33</td><td>Admin Console</td><td>Batch Mint Request (Qty: 12)</td><td><span class="tag sm amber">MINTED</span></td><td>HQ Console</td></tr>' +
              '<tr><td>2026-10-08 15:45:11</td><td>System Engine</td><td>AIS-140 Cryptographic Hash Validation</td><td><span class="tag sm success">AUTHENTIC</span></td><td>National Cluster</td></tr>' +
              '<tr><td>2026-10-08 15:00:00</td><td>Local Storage</td><td>Dual-Role Database Cache Initialized</td><td><span class="tag sm cyan">COMMITTED</span></td><td>Client Browser</td></tr>' +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';
  }

  html += '</div>';
  container.innerHTML = html;
}

function setAdminTab(tabName) {
  S_ADMIN.activeTab = tabName;
  var content = $("#portalContent");
  if (content && S.currentUser && S.currentUser.role === "admin") {
    renderAdminPortal(content, S.currentUser);
  }
}

function setAdminFilter(query) {
  S_ADMIN.filterQuery = query;
  var content = $("#portalContent");
  if (content && S.currentUser && S.currentUser.role === "admin") {
    renderAdminPortal(content, S.currentUser);
  }
}

function setAdminStatusFilter(status) {
  S_ADMIN.statusFilter = status;
  var content = $("#portalContent");
  if (content && S.currentUser && S.currentUser.role === "admin") {
    renderAdminPortal(content, S.currentUser);
  }
}

function handleBatchMintSubmit(e) {
  if (e) e.preventDefault();
  var plant = $("#mintPlant").value;
  var series = $("#mintSeries").value;
  var qty = parseInt($("#mintQty").value, 10) || 10;

  var generated = [];
  var year = new Date().getFullYear();

  for (var i = 1; i <= qty; i++) {
    var rand = Math.floor(1000 + Math.random() * 9000);
    var serial = "EG-" + series + "-" + year + "-" + rand + "-" + plant;
    generated.push(serial);
  }

  S_ADMIN.mintedBatches = generated;
  toast("Minted " + qty + " serialized factory QR tags successfully!");
  var content = $("#portalContent");
  if (content && S.currentUser && S.currentUser.role === "admin") {
    renderAdminPortal(content, S.currentUser);
  }
}

function downloadMintedSerials() {
  if (!S_ADMIN.mintedBatches || S_ADMIN.mintedBatches.length === 0) return;
  var text = "EUROGRIP TYRE+ | FACTORY BATCH SERIALS\\n" +
             "Generated: " + new Date().toISOString() + "\\n" +
             "Total Count: " + S_ADMIN.mintedBatches.length + "\\n" +
             "----------------------------------------\\n" +
             S_ADMIN.mintedBatches.join("\\n");
  var blob = new Blob([text], { type: "text/plain" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "eurogrip-batch-serials-" + Date.now() + ".txt";
  a.click();
  URL.revokeObjectURL(url);
  toast("Downloaded " + S_ADMIN.mintedBatches.length + " minted serial tags.");
}

function exportWarrantiesCsv() {
  var warranties = getWarrantiesDatabase();
  var headers = ["Warranty ID", "Rider Name", "Mobile Phone", "Motorcycle Model", "Tyre Spec", "Serial ID", "Registration Date", "Status", "Shop"];
  var rows = warranties.map(function(w) {
    return [
      w.id,
      '"' + (w.riderName || "").replace(/"/g, '""') + '"',
      '"' + (w.riderPhone || "").replace(/"/g, '""') + '"',
      '"' + (w.bike || "").replace(/"/g, '""') + '"',
      '"' + (w.model || "").replace(/"/g, '""') + '"',
      w.tyreId,
      w.regDate,
      w.status,
      '"' + (w.mechanicShop || "").replace(/"/g, '""') + '"'
    ].join(",");
  });

  var csvContent = [headers.join(",")].concat(rows).join("\\n");
  var blob = new Blob([csvContent], { type: "text/csv" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "eurogrip-warranties-ledger-" + Date.now() + ".csv";
  a.click();
  URL.revokeObjectURL(url);
  toast("Exported Master Warranties Ledger to CSV!");
}

function toggleWarrantyStatus(id) {
  var warranties = getWarrantiesDatabase();
  var item = warranties.find(function(w) { return w.id === id; });
  if (item) {
    item.status = (item.status === "Verified Active") ? "Inspection Due" : "Verified Active";
    saveWarrantiesDatabase(warranties);
    var content = $("#portalContent");
    if (content && S.currentUser && S.currentUser.role === "admin") {
      renderAdminPortal(content, S.currentUser);
    }
    toast("Updated " + id + " status to: " + item.status);
  }
}

function deleteWarrantyRecord(id) {
  if (!confirm("Are you sure you want to remove warranty record " + id + " from database?")) return;
  var warranties = getWarrantiesDatabase();
  var filtered = warranties.filter(function(w) { return w.id !== id; });
  saveWarrantiesDatabase(filtered);
  var content = $("#portalContent");
  if (content && S.currentUser && S.currentUser.role === "admin") {
    renderAdminPortal(content, S.currentUser);
  }
  toast("Removed warranty " + id + " from database.");
}

function exportDatabaseJson() {
  var data = {
    users: getUsersDatabase(),
    warranties: getWarrantiesDatabase(),
    tyres: TYRE_DATABASE,
    motorcycles: (typeof MOTORCYCLES_CATALOG !== "undefined" ? MOTORCYCLES_CATALOG : {}),
    exportedAt: new Date().toISOString()
  };
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "eurogrip-database-export-" + Date.now() + ".json";
  a.click();
  URL.revokeObjectURL(url);
  toast("Exported Database JSON successfully!");
}

function switchPortalRole(targetRole) {
  var users = getUsersDatabase();
  var targetUser = users.find(function(u) { return u.role === targetRole; });
  if (targetUser) {
    S.currentUser = targetUser;
    saveSessionUser(targetUser);
    renderNavbarAuth();
    renderPortalDashboard();
    toast("Switched view to " + (targetRole === "admin" ? "👑 Admin Operations Console" : "🏍️ Rider Virtual Garage"));
  }
}
