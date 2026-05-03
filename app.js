'use strict';

const API = 'http://localhost:5000/api';

let STATE = { vehicles:[], records:[], sites:[], docTypes:[], loaded:false };

async function loadAllData() {
  try {
    const res  = await fetch(`${API}/data`);
    const data = await res.json();
    STATE.vehicles = data.vehicles || [];
    STATE.records  = data.records  || [];
    STATE.sites    = data.sites    || [];
    STATE.docTypes = data.docTypes || [];
    STATE.loaded   = true;
  } catch (err) {
    
    STATE.loaded = true;
    showServerError();
  }
}

async function saveToServer(section, data) {
  try {
    const res = await fetch(`${API}/${section}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data)
    });
    return res.ok;
  } catch (err) {
    alert('⚠ Could not save.\n\nMake sure:\n1. START_SERVER.bat is running (Windows)\n   or ./start_server.sh (Linux)\n2. You opened the app via http://localhost:5000\n   NOT by double-clicking index.html');
    return false;
  }
}

function showServerError() {
  
  const homeEl = document.getElementById('page-home');
  if (homeEl) {
    homeEl.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;
                  justify-content:center;min-height:60vh;
                  gap:16px;font-family:Segoe UI,Arial;color:#1B5E20;
                  text-align:center;padding:32px">
        <div style="font-size:48px">⚠️</div>
        <div style="font-size:22px;font-weight:700;color:#1B5E20">Server Not Running</div>
        <div style="font-size:13px;color:#444;max-width:460px;line-height:1.9;
                    background:#F1F8F1;border:1px solid #C8D8C8;
                    border-radius:8px;padding:20px 24px;text-align:left">
          <strong>Step 1</strong> — Start the server:<br>
          &nbsp;&nbsp;• Windows: double-click <code>START_SERVER.bat</code><br>
          &nbsp;&nbsp;• Linux: run <code>./start_server.sh</code><br><br>
          <strong>Step 2</strong> — Open the app in your browser:<br>
          &nbsp;&nbsp;• Go to <code style="background:#fff;padding:2px 8px;
            border-radius:4px;border:1px solid #C8D8C8">http://localhost:5000</code><br><br>
          <strong style="color:#C62828">⚠ Do not open index.html by double-clicking it.<br>
          &nbsp;&nbsp;Always use http://localhost:5000</strong>
        </div>
        <button onclick="location.reload()"
          style="background:#2E7D32;color:#fff;border:none;padding:10px 28px;
                 border-radius:6px;font-size:13px;font-weight:700;
                 cursor:pointer;margin-top:4px">
          🔄 RETRY
        </button>
      </div>`;
  }
}

function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const pageEl = document.getElementById('page-' + page);
  const navBtn = document.querySelector(`[data-page="${page}"]`);
  if (pageEl) pageEl.classList.remove('hidden');
  if (navBtn) navBtn.classList.add('active');

  if (page === 'vehicles')      renderVehicles();
  if (page === 'configuration') renderConfig();
  if (page === 'records')       renderRecords();
  if (page === 'dashboard')     initDashboard();
  if (page === 'reports')       renderReportPlaceholder();
}

function openModal(id) {
  document.getElementById('modalOverlay').classList.remove('hidden');
  document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
  document.getElementById('modalOverlay').classList.add('hidden');
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
}

let editingVehicleIdx = -1;

function renderVehicles() {
  const tbody = document.getElementById('vehiclesTbody');
  if (!STATE.vehicles.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:24px;color:#8A9A8A">No vehicles yet. Click + ADD VEHICLE.</td></tr>';
    return;
  }
  tbody.innerHTML = '';
  STATE.vehicles.forEach((v, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${v.plate}</strong></td>
      <td>${v.name}</td>
      <td>${v.driver}</td>
      <td>${v.tripAlert  || '—'} km</td>
      <td>${v.maxLiters  || '—'} L</td>
      <td>${v.alertKmL   || '—'} km/L</td>
      <td>&#8369;${v.alertCost || '—'}/km</td>
      <td>
        <button class="action-btn" onclick="editVehicle(${i})">EDIT</button>
        <button class="action-btn del" onclick="deleteVehicle(${i})">DELETE</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

function openAddVehicle() {
  editingVehicleIdx = -1;
  ['vPlate','vName','vDriver','vTripAlert','vMaxGal','vAlertMpg','vAlertCost']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('vehicleFormTitle').textContent = 'ADD VEHICLE';
  document.getElementById('vehicleForm').classList.remove('hidden');
}

function editVehicle(i) {
  editingVehicleIdx = i;
  const v = STATE.vehicles[i];
  document.getElementById('vPlate').value     = v.plate;
  document.getElementById('vName').value      = v.name;
  document.getElementById('vDriver').value    = v.driver;
  document.getElementById('vTripAlert').value = v.tripAlert  || '';
  document.getElementById('vMaxGal').value    = v.maxLiters  || '';
  document.getElementById('vAlertMpg').value  = v.alertKmL   || '';
  document.getElementById('vAlertCost').value = v.alertCost  || '';
  document.getElementById('vehicleFormTitle').textContent = 'EDIT VEHICLE';
  document.getElementById('vehicleForm').classList.remove('hidden');
  document.getElementById('vehicleForm').scrollIntoView({ behavior: 'smooth' });
}

function deleteVehicle(i) {
  if (!confirm('Delete this vehicle?')) return;
  STATE.vehicles.splice(i, 1);
  saveToServer('vehicles', STATE.vehicles);
  renderVehicles();
}

function cancelVehicleForm() {
  document.getElementById('vehicleForm').classList.add('hidden');
  editingVehicleIdx = -1;
}

async function saveVehicle() {
  const plate  = document.getElementById('vPlate').value.trim().toUpperCase();
  const name   = document.getElementById('vName').value.trim().toUpperCase();
  const driver = document.getElementById('vDriver').value.trim().toUpperCase();
  if (!plate || !name || !driver) {
    alert('Plate, Vehicle Name, and Driver are required.');
    return;
  }
  const entry = {
    plate, name, driver,
    tripAlert: +document.getElementById('vTripAlert').value || 0,
    maxLiters: +document.getElementById('vMaxGal').value    || 0,
    alertKmL:  +document.getElementById('vAlertMpg').value  || 0,
    alertCost: +document.getElementById('vAlertCost').value || 0,
  };
  if (editingVehicleIdx >= 0) {
    STATE.vehicles[editingVehicleIdx] = entry;
  } else {
    if (STATE.vehicles.find(v => v.plate === plate)) {
      alert('A vehicle with this plate already exists.');
      return;
    }
    STATE.vehicles.push(entry);
  }
  await saveToServer('vehicles', STATE.vehicles);
  cancelVehicleForm();
  renderVehicles();
}

function renderConfig() {
  renderConfigList('sitesList',    STATE.sites,    'sites');
  renderConfigList('docTypesList', STATE.docTypes, 'doctypes');
}

function renderConfigList(elId, items, key) {
  const ul = document.getElementById(elId);
  ul.innerHTML = '';
  items.forEach((item, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${item}</span>
      <button class="action-btn del" onclick="deleteConfigItem('${key}',${i})">X</button>`;
    ul.appendChild(li);
  });
}

async function addConfigItem(key) {
  const label = key === 'sites' ? 'location' : 'document type';
  const val = prompt('Add new ' + label + ':');
  if (!val || !val.trim()) return;
  if (key === 'sites') {
    STATE.sites.push(val.trim().toUpperCase());
    await saveToServer('sites', STATE.sites);
  } else {
    STATE.docTypes.push(val.trim().toUpperCase());
    await saveToServer('doctypes', STATE.docTypes);
  }
  renderConfig();
}

async function deleteConfigItem(key, i) {
  if (!confirm('Remove this item?')) return;
  if (key === 'sites') {
    STATE.sites.splice(i, 1);
    await saveToServer('sites', STATE.sites);
  } else {
    STATE.docTypes.splice(i, 1);
    await saveToServer('doctypes', STATE.docTypes);
  }
  renderConfig();
}

let editingRecordIdx = -1;

function renderRecords() {
  const tbody = document.getElementById('recordsTbody');
  if (!STATE.records.length) {
    tbody.innerHTML = '<tr><td colspan="16" style="text-align:center;padding:24px;color:#8A9A8A">No records yet. Click + REGISTER to add the first entry.</td></tr>';
    return;
  }
  tbody.innerHTML = '';
  STATE.records.forEach((r, i) => {
    const tr = document.createElement('tr');
    tr.title   = 'Click to edit';
    tr.onclick = () => openRecordForm('edit', i);
    tr.innerHTML = `
      <td>${r.date}</td>
      <td><strong>${r.plate}</strong></td>
      <td>${r.vehicle}</td>
      <td>${r.driver}</td>
      <td>${r.start   || '-'}</td>
      <td>${r.end     || '-'}</td>
      <td>${fmt(r.startMile)}</td>
      <td>${fmt(r.endMile)}</td>
      <td>${fmt(r.distance)} km</td>
      <td>${fmt(r.gallon, 2)} L</td>
      <td>&#8369;${fmt(r.cost, 2)}</td>
      <td>${fmt(r.distGal, 3)}</td>
      <td>&#8369;${fmt(r.costMile, 4)}</td>
      <td>${r.docType  || '-'}</td>
      <td>${r.docNum   || '-'}</td>
      <td>${r.comment  || '-'}</td>`;
    tbody.appendChild(tr);
  });
}

function fmt(v, dec) {
  dec = dec || 0;
  if (v === undefined || v === null || v === '') return '-';
  return Number(v).toLocaleString('en-PH', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec
  });
}

function openRecordForm(mode, idx) {
  editingRecordIdx = mode === 'edit' ? idx : -1;

  
  const cboPlate = document.getElementById('fPlate');
  cboPlate.innerHTML = '<option value="">- Select Vehicle -</option>';
  STATE.vehicles.forEach(function(v) {
    const o = document.createElement('option');
    o.value = v.plate;
    o.textContent = v.plate + ' - ' + v.name;
    cboPlate.appendChild(o);
  });

  
  ['fStart','fEnd'].forEach(function(id) {
    const el = document.getElementById(id);
    el.innerHTML = '<option value="">- Select -</option>';
    STATE.sites.forEach(function(s) {
      const o = document.createElement('option');
      o.value = s; o.textContent = s;
      el.appendChild(o);
    });
  });

  
  const dtEl = document.getElementById('fDocType');
  dtEl.innerHTML = '<option value="">- Select -</option>';
  STATE.docTypes.forEach(function(d) {
    const o = document.createElement('option');
    o.value = d; o.textContent = d;
    dtEl.appendChild(o);
  });

  
  ['fEndMile','fGallon','fCost','fDistGal','fCostMile']
    .forEach(function(id) { document.getElementById(id).classList.remove('alert-red'); });
  document.getElementById('alertBanner').classList.add('hidden');

  if (mode === 'new') {
    document.getElementById('fDate').value = new Date().toISOString().slice(0,10);
    ['fPlate','fStart','fEnd','fDocType','fDocNum','fComment']
      .forEach(function(id) { document.getElementById(id).value = ''; });
    document.getElementById('fVehicle').value    = '';
    document.getElementById('fDriver').innerHTML = '<option value="">- Select -</option>';
    ['fStartMile','fEndMile','fDistance','fGallon','fCost','fDistGal','fCostMile']
      .forEach(function(id) { document.getElementById(id).value = ''; });
    document.getElementById('btnSaveRecord').textContent = 'SAVE';
  } else {
    const r = STATE.records[idx];
    document.getElementById('fDate').value      = r.date;
    document.getElementById('fPlate').value     = r.plate;
    onPlateChange(r.driver);
    document.getElementById('fVehicle').value   = r.vehicle;
    document.getElementById('fStart').value     = r.start   || '';
    document.getElementById('fEnd').value       = r.end     || '';
    document.getElementById('fStartMile').value = r.startMile;
    document.getElementById('fEndMile').value   = r.endMile;
    document.getElementById('fGallon').value    = r.gallon;
    document.getElementById('fCost').value      = r.cost;
    document.getElementById('fDocType').value   = r.docType || '';
    document.getElementById('fDocNum').value    = r.docNum  || '';
    document.getElementById('fComment').value   = r.comment || '';
    calcFields();
    document.getElementById('btnSaveRecord').textContent = 'UPDATE';
  }
  openModal('modalRecord');
}

function onPlateChange(overrideDriver) {
  const plate = document.getElementById('fPlate').value;
  const v = STATE.vehicles.find(function(v) { return v.plate === plate; });
  if (!v) return;

  document.getElementById('fVehicle').value = v.name;

  const dEl = document.getElementById('fDriver');
  dEl.innerHTML = '';
  const allDrivers = [];
  STATE.vehicles.forEach(function(vv) {
    if (allDrivers.indexOf(vv.driver) === -1) allDrivers.push(vv.driver);
  });
  allDrivers.sort().forEach(function(d) {
    const o = document.createElement('option');
    o.value = d; o.textContent = d;
    dEl.appendChild(o);
  });
  dEl.value = overrideDriver || v.driver;

  const lastOdo = getLastOdometer(plate);
  if (lastOdo > 0 && editingRecordIdx < 0) {
    document.getElementById('fStartMile').value = lastOdo;
  }
}

function getLastOdometer(plate) {
  const recs = STATE.records.filter(function(r) { return r.plate === plate; });
  if (!recs.length) return 0;
  return Math.max.apply(null, recs.map(function(r) { return r.endMile || 0; }));
}

function calcFields() {
  const startOdo = +document.getElementById('fStartMile').value || 0;
  const endOdo   = +document.getElementById('fEndMile').value   || 0;
  const liters   = +document.getElementById('fGallon').value    || 0;
  const cost     = +document.getElementById('fCost').value      || 0;
  const plate    =  document.getElementById('fPlate').value;

  const dist   = endOdo - startOdo;
  const kmL    = (liters > 0 && dist > 0) ? dist  / liters : 0;
  const costKm = (dist   > 0 && cost > 0) ? cost  / dist   : 0;

  document.getElementById('fDistance').value = dist   > 0 ? dist              : 0;
  document.getElementById('fDistGal').value  = kmL    > 0 ? kmL.toFixed(3)    : '';
  document.getElementById('fCostMile').value = costKm > 0 ? costKm.toFixed(4) : '';

  if (!plate) return;

  const thr = STATE.vehicles.find(function(v) { return v.plate === plate; }) || {};
  const alerts = [];

  function check(elId, condition, msg) {
    const el = document.getElementById(elId);
    if (condition) { el.classList.add('alert-red'); alerts.push(msg); }
    else el.classList.remove('alert-red');
  }

  check('fEndMile',
    thr.tripAlert > 0 && dist   > thr.tripAlert,
    'Distance ' + dist + ' km exceeds trip alert of ' + thr.tripAlert + ' km');
  check('fGallon',
    thr.maxLiters > 0 && liters > thr.maxLiters,
    liters + ' L exceeds max tank capacity of ' + thr.maxLiters + ' L');
  check('fDistGal',
    thr.alertKmL  > 0 && liters > 0 && kmL < thr.alertKmL,
    'KM/L ' + kmL.toFixed(2) + ' is below the minimum of ' + thr.alertKmL);
  check('fCostMile',
    thr.alertCost > 0 && dist   > 0 && costKm > thr.alertCost,
    'Cost/KM ' + costKm.toFixed(2) + ' exceeds the maximum of ' + thr.alertCost);

  const banner = document.getElementById('alertBanner');
  if (alerts.length) {
    banner.textContent = 'WARNING: ' + alerts.join(' | ');
    banner.classList.remove('hidden');
  } else {
    banner.classList.add('hidden');
  }
}

async function saveRecord() {
  const date   = document.getElementById('fDate').value;
  const plate  = document.getElementById('fPlate').value;
  const endOdo = +document.getElementById('fEndMile').value;
  const liters = +document.getElementById('fGallon').value;
  const cost   = +document.getElementById('fCost').value;

  if (!date || !plate || !endOdo || !liters || !cost) {
    alert('Please fill all required fields: Date, Plate, End Odometer, Liters, and Cost.');
    return;
  }

  const startOdo = +document.getElementById('fStartMile').value || 0;
  const dist     = endOdo - startOdo;
  const kmL      = liters > 0 ? dist / liters : 0;
  const costKm   = dist   > 0 ? cost / dist   : 0;

  const entry = {
    date:      date,
    plate:     plate,
    vehicle:   document.getElementById('fVehicle').value,
    driver:    document.getElementById('fDriver').value,
    start:     document.getElementById('fStart').value,
    end:       document.getElementById('fEnd').value,
    startMile: startOdo,
    endMile:   endOdo,
    distance:  dist,
    gallon:    liters,
    cost:      cost,
    distGal:   kmL,
    costMile:  costKm,
    docType:   document.getElementById('fDocType').value,
    docNum:    document.getElementById('fDocNum').value,
    comment:   document.getElementById('fComment').value,
  };

  if (editingRecordIdx >= 0) {
    STATE.records[editingRecordIdx] = entry;
  } else {
    STATE.records.push(entry);
  }

  await saveToServer('records', STATE.records);
  closeModal('modalRecord');
  renderRecords();
}

let charts = {};

function initDashboard() {
  const plateSet  = new Set();
  const driverSet = new Set();

  STATE.vehicles.forEach(function(v) {
    plateSet.add(v.plate);
    driverSet.add(v.driver);
  });
  STATE.records.forEach(function(r) {
    if (r.plate)  plateSet.add(r.plate);
    if (r.driver) driverSet.add(r.driver);
  });

  const plates  = Array.from(plateSet).sort();
  const drivers = Array.from(driverSet).sort();

  document.getElementById('dPlates').innerHTML =
    plates.map(function(p) { return '<option value="' + p + '">' + p + '</option>'; }).join('');
  document.getElementById('dDrivers').innerHTML =
    drivers.map(function(d) { return '<option value="' + d + '">' + d + '</option>'; }).join('');

  renderDashboard();
}

function clearDashFilters() {
  document.getElementById('dStartDate').value = '';
  document.getElementById('dEndDate').value   = '';
  ['dPlates','dDrivers'].forEach(function(id) {
    const el = document.getElementById(id);
    for (let i = 0; i < el.options.length; i++) el.options[i].selected = false;
  });
  renderDashboard();
}

function getSelected(id) {
  const el  = document.getElementById(id);
  const sel = [];
  for (let i = 0; i < el.options.length; i++) {
    if (el.options[i].selected) sel.push(el.options[i].value);
  }
  return sel.length ? sel : null;
}

function renderDashboard() {
  const sd  = document.getElementById('dStartDate').value;
  const ed  = document.getElementById('dEndDate').value;
  const sp  = getSelected('dPlates');
  const sdr = getSelected('dDrivers');

  const filtered = STATE.records.filter(function(r) {
    if (sd  && r.date < sd)              return false;
    if (ed  && r.date > ed)              return false;
    if (sp  && sp.indexOf(r.plate) < 0)  return false;
    if (sdr && sdr.indexOf(r.driver) < 0) return false;
    return true;
  });

  let totL = 0, totC = 0, totD = 0;
  filtered.forEach(function(r) {
    totL += r.gallon   || 0;
    totC += r.cost     || 0;
    totD += r.distance || 0;
  });
  const avgKmL = totL > 0 ? totD / totL : 0;

  document.getElementById('kpiGallons').textContent = fmt(totL,   2) + ' L';
  document.getElementById('kpiMpg').textContent     = fmt(avgKmL, 2) + ' km/L';
  document.getElementById('kpiCost').textContent    = '\u20B1' + fmt(totC, 2);
  document.getElementById('kpiDist').textContent    = fmt(totD,   0) + ' km';

  
  const mm = {};
  filtered.forEach(function(r) {
    if (!r.date) return;
    const d   = new Date(r.date);
    const key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0');
    const lbl = d.toLocaleString('en-PH', { month:'short' }) + ' ' + d.getFullYear();
    if (!mm[key]) mm[key] = { lbl:lbl, L:0, C:0, D:0 };
    mm[key].L += r.gallon   || 0;
    mm[key].C += r.cost     || 0;
    mm[key].D += r.distance || 0;
  });

  const keys    = Object.keys(mm).sort();
  const labels  = keys.map(function(k) { return mm[k].lbl; });
  const liters  = keys.map(function(k) { return +mm[k].L.toFixed(2); });
  const costs   = keys.map(function(k) { return +mm[k].C.toFixed(2); });
  const dists   = keys.map(function(k) { return +mm[k].D.toFixed(0); });
  const kmls    = keys.map(function(k) {
    return mm[k].L > 0 ? +(mm[k].D / mm[k].L).toFixed(2) : 0;
  });

  buildChart('chartGallons', labels, liters, 'Liters',    '#2E7D32');
  buildChart('chartMpg',     labels, kmls,   'KM/Liter',  '#1565C0');
  buildChart('chartCost',    labels, costs,  'Cost',      '#E65100');
  buildChart('chartDist',    labels, dists,  'Distance',  '#4A148C');
}

function buildChart(canvasId, labels, data, label, color) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  if (charts[canvasId]) charts[canvasId].destroy();
  charts[canvasId] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label:           label,
        data:            data,
        backgroundColor: color + 'BB',
        borderColor:     color,
        borderWidth:     1,
        borderRadius:    3
      }]
    },
    options: {
      responsive:          true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 10 }, maxRotation: 45 } },
        y: { grid: { color: '#E8F5E9' }, ticks: { font: { size: 10 } }, beginAtZero: true }
      }
    }
  });
}

let reportMode = 'driver';

function openReportDialog() {
  setReportMode('driver');
  document.getElementById('rStartDate').value = '';
  document.getElementById('rEndDate').value   = '';
  openModal('modalReports');
}

function setReportMode(mode) {
  reportMode = mode;
  document.getElementById('togDriver').classList.toggle('active',  mode === 'driver');
  document.getElementById('togVehicle').classList.toggle('active', mode === 'vehicle');
  document.getElementById('rSelectorLabel').textContent = mode === 'driver' ? 'DRIVER' : 'PLATE';

  const sel = document.getElementById('rSelector');
  sel.innerHTML = '<option value="">- All -</option>';
  if (mode === 'driver') {
    const drivers = [];
    STATE.vehicles.forEach(function(v) {
      if (drivers.indexOf(v.driver) === -1) drivers.push(v.driver);
    });
    drivers.sort().forEach(function(d) {
      const o = document.createElement('option');
      o.value = d; o.textContent = d; sel.appendChild(o);
    });
  } else {
    STATE.vehicles.forEach(function(v) {
      const o = document.createElement('option');
      o.value = v.plate; o.textContent = v.plate; sel.appendChild(o);
    });
  }
}

function generateReport() {
  const sd  = document.getElementById('rStartDate').value;
  const ed  = document.getElementById('rEndDate').value;
  const sel = document.getElementById('rSelector').value;
  closeModal('modalReports');

  const filtered = STATE.records.filter(function(r) {
    if (sd && r.date < sd) return false;
    if (ed && r.date > ed) return false;
    if (reportMode === 'driver'  && sel && r.driver !== sel) return false;
    if (reportMode === 'vehicle' && sel && r.plate  !== sel) return false;
    return true;
  });
  filtered.sort(function(a,b) { return a.date.localeCompare(b.date); });

  let totD = 0, totL = 0, totC = 0, maxOdo = 0;
  filtered.forEach(function(r) {
    totD += r.distance || 0;
    totL += r.gallon   || 0;
    totC += r.cost     || 0;
    if ((r.endMile || 0) > maxOdo) maxOdo = r.endMile || 0;
  });
  const avgKmL = totL > 0 ? totD / totL : 0;
  const isD    = reportMode === 'driver';

  document.getElementById('reportTitle').textContent =
    isD ? 'REPORT BY DRIVER' : 'REPORT BY VEHICLE';

  document.getElementById('reportMeta').innerHTML =
    '<span><strong>PERIOD:</strong> ' + (sd || 'All') + ' to ' + (ed || 'All') + '</span>' +
    '<span><strong>' + (isD ? 'DRIVER' : 'VEHICLE') + ':</strong> ' + (sel || 'All') + '</span>' +
    '<span><strong>RECORDS:</strong> ' + filtered.length + '</span>';

  document.getElementById('reportKpis').innerHTML =
    '<div class="kpi-card"><div class="kpi-label">TOTAL DISTANCE</div><div class="kpi-value">' + fmt(totD,0) + ' km</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">TOTAL LITERS</div><div class="kpi-value">' + fmt(totL,2) + ' L</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">TOTAL COST</div><div class="kpi-value">\u20B1' + fmt(totC,2) + '</div></div>' +
    '<div class="kpi-card"><div class="kpi-label">AVG KM/LITER</div><div class="kpi-value">' + fmt(avgKmL,2) + '</div></div>' +
    (!isD ? '<div class="kpi-card"><div class="kpi-label">CURRENT ODOMETER</div><div class="kpi-value">' + fmt(maxOdo,0) + ' km</div></div>' : '');

  const thead = document.getElementById('reportTableHead');
  const tbody = document.getElementById('reportTableBody');

  if (isD) {
    thead.innerHTML =
      '<tr><th>DATE</th><th>PLATE</th><th>VEHICLE</th>' +
      '<th>DISTANCE (KM)</th><th>LITERS</th><th>COST (\u20B1)</th>' +
      '<th>KM/LITER</th><th>\u20B1/KM</th></tr>';
    tbody.innerHTML = filtered.map(function(r,i) {
      return '<tr style="background:' + (i%2===0?'var(--green-stripe)':'#fff') + '">' +
        '<td>' + r.date + '</td><td>' + r.plate + '</td><td>' + r.vehicle + '</td>' +
        '<td>' + fmt(r.distance,0) + ' km</td>' +
        '<td>' + fmt(r.gallon,2)   + ' L</td>' +
        '<td>\u20B1' + fmt(r.cost,2)    + '</td>' +
        '<td>' + fmt(r.distGal,3)  + '</td>' +
        '<td>\u20B1' + fmt(r.costMile,4) + '</td></tr>';
    }).join('');
  } else {
    thead.innerHTML =
      '<tr><th>DATE</th><th>DRIVER</th>' +
      '<th>DISTANCE (KM)</th><th>LITERS</th><th>COST (\u20B1)</th>' +
      '<th>KM/LITER</th><th>\u20B1/KM</th></tr>';
    tbody.innerHTML = filtered.map(function(r,i) {
      return '<tr style="background:' + (i%2===0?'var(--green-stripe)':'#fff') + '">' +
        '<td>' + r.date + '</td><td>' + r.driver + '</td>' +
        '<td>' + fmt(r.distance,0) + ' km</td>' +
        '<td>' + fmt(r.gallon,2)   + ' L</td>' +
        '<td>\u20B1' + fmt(r.cost,2)    + '</td>' +
        '<td>' + fmt(r.distGal,3)  + '</td>' +
        '<td>\u20B1' + fmt(r.costMile,4) + '</td></tr>';
    }).join('');
  }

  document.getElementById('reportOutput').classList.remove('hidden');
  document.getElementById('reportPlaceholder').classList.add('hidden');
}

function renderReportPlaceholder() {
  document.getElementById('reportOutput').classList.add('hidden');
  document.getElementById('reportPlaceholder').classList.remove('hidden');
}

function printReport() { window.print(); }

document.addEventListener('DOMContentLoaded', async function() {
  await loadAllData();
  navigate('home');
});