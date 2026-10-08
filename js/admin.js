/**
 * Eurogrip TYRE+ | Admin Operations Portal
 * Simple, streamlined, picture-free management dashboard for
 * warranties, serial minting, partner garages, and database exports.
 */

var S_ADMIN = {
  activeTab: "ledger", // "ledger", "minting", "garages"
  filterQuery: "",
  statusFilter: "all",
  mintedBatches: []
};

function renderAdminPortal(container, user) {
  var warranties = getWarrantiesDatabase();
  var users = getUsersDatabase();
  var tyresCount = Object.keys(TYRE_DATABASE).length;
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
    '<div class="admin-console-wrap simple-admin">' +

      '<!-- SIMPLE CLEAN HEADER -->' +
      '<div class="admin-top-bar" style="border-bottom:1px solid var(--panel-border);padding-bottom:16px">' +
        '<div>' +
          '<div style="font-size:0.8rem;color:var(--amber);font-weight:700;text-transform:uppercase;letter-spacing:0.04em">Operations Management</div>' +
          '<h2 style="margin:2px 0;font-size:2rem;color:#FFF">Eurogrip Admin Portal</h2>' +
          '<div style="font-size:0.88rem;color:var(--mute)">Logged in as <strong>' + esc(user.name) + '</strong> (' + esc(user.phone || "Administrator") + ')</div>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">' +
          '<button class="btn sm ghost" onclick="switchPortalRole(\'user\')" style="color:var(--cyan);border-color:rgba(0,210,255,0.4)">🏍️ Switch to Rider View</button>' +
          '<button class="btn sm" onclick="exportWarrantiesCsv()">📥 Export CSV</button>' +
          '<button class="btn sm ghost" onclick="exportDatabaseJson()">💾 Backup JSON</button>' +
          '<button class="btn sm ghost" onclick="logoutUser()">Sign Out</button>' +
        '</div>' +
      '</div>' +

      '<!-- 4 CLEAN STATS SUMMARY CARDS (NO PICTURES) -->' +
      '<div class="grid g4" style="margin:20px 0 24px">' +
        '<div class="box" style="padding:14px;background:#121820;border:1px solid var(--panel-border)">' +
          '<span style="font-size:0.8rem;color:var(--mute);text-transform:uppercase;font-weight:700">Total Warranties</span>' +
          '<div style="font-size:1.9rem;font-weight:800;color:var(--cyan);margin-top:2px">' + warranties.length + '</div>' +
          '<small style="color:#94A3B8">Active in database</small>' +
        '</div>' +
        '<div class="box" style="padding:14px;background:#121820;border:1px solid var(--panel-border)">' +
          '<span style="font-size:0.8rem;color:var(--mute);text-transform:uppercase;font-weight:700">Registered Riders</span>' +
          '<div style="font-size:1.9rem;font-weight:800;color:var(--amber);margin-top:2px">' + users.filter(function(u){ return u.role !== "admin"; }).length + '</div>' +
          '<small style="color:#94A3B8">Phone registered accounts</small>' +
        '</div>' +
        '<div class="box" style="padding:14px;background:#121820;border:1px solid var(--panel-border)">' +
          '<span style="font-size:0.8rem;color:var(--mute);text-transform:uppercase;font-weight:700">Tyre Formulations</span>' +
          '<div style="font-size:1.9rem;font-weight:800;color:var(--success);margin-top:2px">' + tyresCount + '</div>' +
          '<small style="color:#94A3B8">Verified models</small>' +
        '</div>' +
        '<div class="box" style="padding:14px;background:#121820;border:1px solid var(--panel-border)">' +
          '<span style="font-size:0.8rem;color:var(--mute);text-transform:uppercase;font-weight:700">Partner Garages</span>' +
          '<div style="font-size:1.9rem;font-weight:800;color:#FFF;margin-top:2px">' + garagesCount + '</div>' +
          '<small style="color:#94A3B8">Inspection centres</small>' +
        '</div>' +
      '</div>' +

      '<!-- SIMPLE TAB BUTTONS -->' +
      '<div style="display:flex;gap:8px;margin-bottom:18px;border-bottom:1px solid var(--panel-border);padding-bottom:10px">' +
        '<button class="btn sm ' + (S_ADMIN.activeTab === "ledger" ? "" : "ghost") + '" onclick="setAdminTab(\'ledger\')">📋 Warranties Ledger (' + warranties.length + ')</button>' +
        '<button class="btn sm ' + (S_ADMIN.activeTab === "minting" ? "" : "ghost") + '" onclick="setAdminTab(\'minting\')">⚡ Generate QR Serials</button>' +
        '<button class="btn sm ' + (S_ADMIN.activeTab === "garages" ? "" : "ghost") + '" onclick="setAdminTab(\'garages\')">📍 Partner Garages (' + garagesCount + ')</button>' +
      '</div>';

  // 1. SIMPLE WARRANTIES LEDGER
  if (S_ADMIN.activeTab === "ledger") {
    html +=
      '<div class="box" style="background:#11161F;border:1px solid var(--panel-border)">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px">' +
          '<div style="flex:1;min-width:240px">' +
            '<input type="text" placeholder="Search by customer name, phone, bike, or serial..." value="' + esc(S_ADMIN.filterQuery) + '" oninput="setAdminFilter(this.value)" style="width:100%;padding:8px 12px;background:#0A0E14;border:1px solid var(--panel-border);color:#FFF;border-radius:6px">' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px">' +
            '<label style="margin:0;font-size:0.85rem;color:var(--mute)">Status:</label>' +
            '<select onchange="setAdminStatusFilter(this.value)" style="padding:8px 12px;background:#0A0E14;border:1px solid var(--panel-border);color:#FFF;border-radius:6px">' +
              '<option value="all" ' + (S_ADMIN.statusFilter === "all" ? "selected" : "") + '>All Records (' + warranties.length + ')</option>' +
              '<option value="Verified Active" ' + (S_ADMIN.statusFilter === "Verified Active" ? "selected" : "") + '>Verified Active</option>' +
              '<option value="Inspection Due" ' + (S_ADMIN.statusFilter === "Inspection Due" ? "selected" : "") + '>Inspection Due</option>' +
            '</select>' +
          '</div>' +
        '</div>' +

        '<div class="scroll">' +
          '<table style="font-size:0.88rem;width:100%">' +
            '<thead>' +
              '<tr style="border-bottom:1px solid var(--panel-border)">' +
                '<th>Warranty ID</th>' +
                '<th>Rider Name</th>' +
                '<th>Phone</th>' +
                '<th>Motorcycle</th>' +
                '<th>Tyre Model / Serial</th>' +
                '<th>Status</th>' +
                '<th class="r">Action</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              (filteredWarranties.length === 0
                ? '<tr><td colspan="7" style="text-align:center;padding:20px;color:var(--mute)">No records match your search.</td></tr>'
                : filteredWarranties.map(function(w) {
                    var isAct = (w.status === "Verified Active");
                    return '<tr style="border-bottom:1px solid rgba(255,255,255,0.04)">' +
                      '<td><strong style="color:var(--amber)">' + esc(w.id) + '</strong></td>' +
                      '<td><strong>' + esc(w.riderName) + '</strong></td>' +
                      '<td>' + esc(w.riderPhone) + '</td>' +
                      '<td>' + esc(w.bike) + '</td>' +
                      '<td>' + esc(w.model) + ' <br><small style="color:var(--mute)">' + esc(w.tyreId) + '</small></td>' +
                      '<td><span class="tag sm ' + (isAct ? "success" : "amber") + '">' + esc(w.status) + '</span></td>' +
                      '<td class="r">' +
                        '<button class="btn sm ghost" style="padding:4px 8px;font-size:0.75rem;margin-right:4px" onclick="toggleWarrantyStatus(\'' + w.id + '\')">' + (isAct ? "Flag Due" : "Verify") + '</button>' +
                        '<button class="btn sm ghost" style="padding:4px 8px;font-size:0.75rem;color:var(--danger);border-color:rgba(239,68,68,0.3)" onclick="deleteWarrantyRecord(\'' + w.id + '\')">✕</button>' +
                      '</td>' +
                    '</tr>';
                  }).join("")) +
            '</tbody>' +
          '</table>' +
        '</div>' +
      '</div>';
  }

  // 2. SIMPLE QR SERIAL GENERATOR
  else if (S_ADMIN.activeTab === "minting") {
    html +=
      '<div class="grid g2">' +
        '<div class="box" style="background:#11161F;border:1px solid var(--panel-border)">' +
          '<h3 style="margin:0 0 10px;font-size:1.2rem">⚡ Generate New QR Serials</h3>' +
          '<p style="color:var(--mute);font-size:0.85rem;margin:0 0 16px">Create serial numbers for new factory tyre runs:</p>' +
          '<form onsubmit="handleBatchMintSubmit(event)">' +
            '<label>Plant Location:</label>' +
            '<select id="mintPlant" style="margin-bottom:12px;width:100%;padding:8px;background:#0A0E14;border:1px solid var(--panel-border);color:#FFF;border-radius:6px">' +
              '<option value="MDU">Madurai Plant (MDU)</option>' +
              '<option value="PNR">Pantnagar Plant (PNR)</option>' +
            '</select>' +
            '<label>Tyre Tread Series:</label>' +
            '<select id="mintSeries" style="margin-bottom:12px;width:100%;padding:8px;background:#0A0E14;border:1px solid var(--panel-border);color:#FFF;border-radius:6px">' +
              '<option value="PROTORQ">ProTorq Extreme Radial</option>' +
              '<option value="BEE">Bee Connect Urban</option>' +
              '<option value="TRAIL">Trail Hound Dual-Sport</option>' +
              '<option value="CLIMBER">Climber Enduro Cross</option>' +
            '</select>' +
            '<label>Quantity to Generate:</label>' +
            '<input type="number" id="mintQty" min="5" max="50" value="10" style="margin-bottom:16px;width:100%;padding:8px;background:#0A0E14;border:1px solid var(--panel-border);color:#FFF;border-radius:6px">' +
            '<button type="submit" class="btn" style="width:100%">Generate Serials</button>' +
          '</form>' +
        '</div>' +

        '<div class="box" style="background:#11161F;border:1px solid var(--panel-border)">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
            '<h3 style="margin:0;font-size:1.2rem">Generated Serial List</h3>' +
            (S_ADMIN.mintedBatches && S_ADMIN.mintedBatches.length > 0
              ? '<button class="btn sm ghost" onclick="downloadMintedSerials()">💾 Download (.txt)</button>'
              : '') +
          '</div>' +
          '<div style="background:#0A0E14;border:1px solid var(--panel-border);border-radius:6px;padding:12px;font-family:monospace;font-size:0.82rem;color:var(--cyan);max-height:240px;overflow-y:auto;white-space:pre-wrap">' +
            (S_ADMIN.mintedBatches && S_ADMIN.mintedBatches.length > 0
              ? S_ADMIN.mintedBatches.join('\n')
              : 'Click "Generate Serials" on the left to create and download new tags.') +
          '</div>' +
        '</div>' +
      '</div>';
  }

  // 3. SIMPLE PARTNER GARAGES DIRECTORY
  else if (S_ADMIN.activeTab === "garages") {
    html +=
      '<div class="box" style="background:#11161F;border:1px solid var(--panel-border)">' +
        '<h3 style="margin:0 0 14px;font-size:1.2rem">📍 Authorized Eurogrip Service Garages</h3>' +
        '<div class="scroll">' +
          '<table style="font-size:0.88rem;width:100%">' +
            '<thead>' +
              '<tr style="border-bottom:1px solid var(--panel-border)">' +
                '<th>Garage Name</th>' +
                '<th>Area & City</th>' +
                '<th>Head Mechanic</th>' +
                '<th>Contact Number</th>' +
                '<th>Rating</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              ((typeof PARTNER_GARAGES_DB !== "undefined" ? PARTNER_GARAGES_DB : []).map(function(g) {
                return '<tr style="border-bottom:1px solid rgba(255,255,255,0.04)">' +
                  '<td><strong>' + esc(g.name) + '</strong></td>' +
                  '<td>' + esc(g.area) + ', ' + esc(g.city) + '</td>' +
                  '<td>' + esc(g.headMechanic) + '</td>' +
                  '<td><a href="tel:' + esc(g.phone) + '" style="color:var(--cyan)">' + esc(g.phone) + '</a></td>' +
                  '<td><span style="color:var(--amber);font-weight:700">⭐ ' + g.rating + '</span></td>' +
                '</tr>';
              }).join("")) +
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
  toast("Created " + qty + " new serial tags!");
  var content = $("#portalContent");
  if (content && S.currentUser && S.currentUser.role === "admin") {
    renderAdminPortal(content, S.currentUser);
  }
}

function downloadMintedSerials() {
  if (!S_ADMIN.mintedBatches || S_ADMIN.mintedBatches.length === 0) return;
  var text = S_ADMIN.mintedBatches.join('\n');
  var blob = new Blob([text], { type: "text/plain" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "eurogrip-serials-" + Date.now() + ".txt";
  a.click();
  URL.revokeObjectURL(url);
  toast("Downloaded " + S_ADMIN.mintedBatches.length + " serial tags.");
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

  var csvContent = [headers.join(",")].concat(rows).join('\n');
  var blob = new Blob([csvContent], { type: "text/csv" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "eurogrip-warranties-" + Date.now() + ".csv";
  a.click();
  URL.revokeObjectURL(url);
  toast("Exported warranties to CSV!");
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
    toast("Status updated to: " + item.status);
  }
}

function deleteWarrantyRecord(id) {
  if (!confirm("Delete warranty record " + id + "?")) return;
  var warranties = getWarrantiesDatabase();
  var filtered = warranties.filter(function(w) { return w.id !== id; });
  saveWarrantiesDatabase(filtered);
  var content = $("#portalContent");
  if (content && S.currentUser && S.currentUser.role === "admin") {
    renderAdminPortal(content, S.currentUser);
  }
  toast("Removed warranty " + id);
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
  a.download = "eurogrip-backup-" + Date.now() + ".json";
  a.click();
  URL.revokeObjectURL(url);
  toast("Downloaded database backup JSON!");
}

function switchPortalRole(targetRole) {
  var users = getUsersDatabase();
  var targetUser = users.find(function(u) { return u.role === targetRole; });
  if (targetUser) {
    S.currentUser = targetUser;
    saveSessionUser(targetUser);
    renderNavbarAuth();
    renderPortalDashboard();
    toast("Switched view to " + (targetRole === "admin" ? "Admin Portal" : "Rider View"));
  }
}
