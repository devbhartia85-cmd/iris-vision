// LocalStorage Backend
const DB = {
  get: (key) => JSON.parse(localStorage.getItem('iris_' + key) || '[]'),
  set: (key, val) => localStorage.setItem('iris_' + key, JSON.stringify(val)),
};

// Initialize default data
if (!localStorage.getItem('iris_initialized')) {
  DB.set('uploads', []);
  DB.set('settings', {
    mode: 'heat',
    intensity: 2,
    alerts: true,
    autoProcess: false
  });
  localStorage.setItem('iris_initialized', 'true');
}

// Navigation Active State
document.querySelectorAll('.nav-item').forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add('active');
  }
});

// Upload Handler
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');

if (uploadZone && fileInput) {
  uploadZone.addEventListener('click', () => fileInput.click());
  
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });
  
  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
  });
  
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });
  
  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
  });
}

function handleFiles(files) {
  if (!files.length) return;
  
  const file = files[0];
  const upload = {
    id: Date.now(),
    name: file.name,
    size: (file.size / 1024).toFixed(1) + ' KB',
    date: new Date().toLocaleString(),
    status: 'pending',
    type: file.type,
    temp: 45
  };
  
  const uploads = DB.get('uploads');
  uploads.unshift(upload);
  DB.set('uploads', uploads);
  
  // Simulate processing
  setTimeout(() => startProcessing(upload.id), 1000);
  
  alert('File uploaded successfully! Processing started.');
  window.location.href = 'history.html';
}

function startProcessing(id) {
  const uploads = DB.get('uploads');
  const item = uploads.find(u => u.id === id);
  if (!item) return;
  
  item.status = 'processing';
  DB.set('uploads', uploads);
  
  // Simulate completion after 3 seconds
  setTimeout(() => {
    const updated = DB.get('uploads');
    const target = updated.find(u => u.id === id);
    if (target) {
      target.status = 'completed';
      target.psnr = (26 + Math.random() * 8).toFixed(2);
      target.ssim = (0.72 + Math.random() * 0.2).toFixed(3);
      target.fid = (20 + Math.random() * 35).toFixed(2);
      target.temp = (40 + Math.random() * 60).toFixed(1);
      DB.set('uploads', updated);
    }
  }, 3000);
}

// Render History
function renderHistory() {
  const tbody = document.getElementById('historyBody');
  if (!tbody) return;
  
  const uploads = DB.get('uploads');
  
  if (uploads.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:2rem;">No analyses yet. Upload an infrared image to begin.</td></tr>';
    return;
  }
  
  tbody.innerHTML = uploads.map(u => `
    <tr>
      <td>${u.name}</td>
      <td>${u.date}</td>
      <td><span class="status-badge status-${u.status}">${u.status}</span></td>
      <td>${u.psnr || '--'}</td>
      <td>${u.ssim || '--'}</td>
      <td>${u.temp || '--'}°C</td>
    </tr>
  `).join('');
}

renderHistory();

// Render Dashboard Stats
function renderStats() {
  const uploads = DB.get('uploads');
  const completed = uploads.filter(u => u.status === 'completed');
  
  const totalEl = document.getElementById('statTotal');
  const psnrEl = document.getElementById('statPsnr');
  const ssimEl = document.getElementById('statSsim');
  const pendingEl = document.getElementById('statPending');
  
  if (totalEl) totalEl.textContent = uploads.length;
  if (pendingEl) pendingEl.textContent = uploads.filter(u => u.status === 'processing').length;
  
  if (completed.length && psnrEl) {
    const avgPsnr = (completed.reduce((a,b) => a + parseFloat(b.psnr || 0), 0) / completed.length).toFixed(1);
    psnrEl.textContent = avgPsnr;
  }
  
  if (completed.length && ssimEl) {
    const avgSsim = (completed.reduce((a,b) => a + parseFloat(b.ssim || 0), 0) / completed.length).toFixed(3);
    ssimEl.textContent = avgSsim;
  }
}

renderStats();

// Settings
function initSettings() {
  const settings = DB.get('settings');
  
  const modeSelect = document.getElementById('settingMode');
  const intensityInput = document.getElementById('settingIntensity');
  const alertsToggle = document.getElementById('toggleAlerts');
  
  if (modeSelect) modeSelect.value = settings.mode;
  if (intensityInput) intensityInput.value = settings.intensity;
  
  if (alertsToggle) {
    if (settings.alerts) alertsToggle.classList.add('active');
    alertsToggle.addEventListener('click', () => {
      alertsToggle.classList.toggle('active');
      settings.alerts = alertsToggle.classList.contains('active');
      DB.set('settings', settings);
    });
  }
  
  if (modeSelect) {
    modeSelect.addEventListener('change', () => {
      settings.mode = modeSelect.value;
      DB.set('settings', settings);
    });
  }
  
  if (intensityInput) {
    intensityInput.addEventListener('input', () => {
      settings.intensity = parseInt(intensityInput.value);
      DB.set('settings', settings);
    });
  }
}

initSettings();