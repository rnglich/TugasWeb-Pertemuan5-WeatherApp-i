/* ==========================================================================
   ATMOS — app.js (ES6+ Module) | Tugas Rutin 5
   --------------------------------------------------------------------------
   Dipisah dari cuaca-app.html agar debugging JS lebih mudah:
   - Buka DevTools > Sources > app.js, pasang breakpoint per fungsi
   - Peta fungsi:
       §1 Konstanta & state        §5 Tema hero imersif
       §2 Util suhu/waktu          §6 Render (current/forecast/trend)
       §3 Loading & error          §7 Fetch async/await
       §4 Riwayat LocalStorage     §8 Toggle satuan & tema + init
   - index.html memuat: <script type="module" src="./app.js"></script>
   ========================================================================== */

// ==================== §1 Konstanta & state ====================
const API_BASE = 'https://api.openweathermap.org/data/2.5';
const LS_KEY_HISTORY = 'atmos_history_v1';   // riwayat 5 kota
const LS_KEY_UNIT = 'atmos_unit_v1';         // 'metric' | 'imperial'
const LS_KEY_THEME = 'atmos_theme_v1';       // 'light' | 'dark'

// API key: tempel langsung di sini.
// Gratis di openweathermap.org/api
const OPENWEATHER_API_KEY = '16c7728f06b8f1a1a6aa22de9ef8788f';

// Helper: ambil elemen by id (arrow function)
const $ = (id) => document.getElementById(id);

// State global — gunakan let karena nilainya berubah-ubah
let state = {
  city: 'Jakarta',
  unit: localStorage.getItem(LS_KEY_UNIT) || 'metric', // metric=°C, imperial=°F
  current: null,
  forecast: null,
};

// ==================== §2 Util suhu & waktu ====================
const isMetric = () => state.unit === 'metric';
const unitSymbol = () => (isMetric() ? '°C' : '°F');
const toDisplay = (celsius) => (isMetric() ? celsius : (celsius * 9) / 5 + 32);
const fmtTemp = (celsius, digits = 0) => `${toDisplay(celsius).toFixed(digits)}${unitSymbol()}`;
const fmtHour = (dtTxt) => dtTxt.slice(11, 16); // "2026-09-18 12:00:00" → "12:00"
const fmtDay = (epochSec) =>
  new Date(epochSec * 1000).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });

// API key dibaca dari konstanta di atas (satu-satunya sumber)
const getApiKey = () => OPENWEATHER_API_KEY;

// ==================== §3 Loading & error (elegan, tak merusak UI) ====================
const setLoading = (on) => {
  $('topLoader').style.opacity = on ? '1' : '0';
  $('searchBtn').disabled = on;
  $('searchBtn').style.opacity = on ? '.4' : '1';
  $('heroStatus').textContent = on ? 'Menghubungi OpenWeatherMap…' : '';
  $('heroStatus').classList.toggle('pulse-soft', on);
};

const showError = (msg) => {
  $('errorBox').hidden = false;
  $('errorMsg').textContent = msg;
};
const clearError = () => {
  $('errorBox').hidden = true;
  $('errorMsg').textContent = '';
};

// ==================== §4 Riwayat: LocalStorage maks 5 ====================
const getHistory = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY_HISTORY)) || []; }
  catch { return []; }
};

const saveToHistory = (city) => {
  const clean = city.trim();
  if (!clean) return;
  // .filter() untuk dedupe case-insensitive, lalu unshift + slice(0,5)
  const rest = getHistory().filter((c) => c.toLowerCase() !== clean.toLowerCase());
  const next = [clean, ...rest].slice(0, 5);
  localStorage.setItem(LS_KEY_HISTORY, JSON.stringify(next));
  renderHistory();
};

const renderHistory = () => {
  const list = getHistory();
  // Semantik: <ul>#historyList > <li> + <button>, bukan tombol telanjang
  // .map() untuk membangun daftar teks inline yang bisa diklik
  $('historyList').innerHTML = list.length
    ? list.map((c, i) => `
        <li class="flex items-baseline gap-2">
          <button type="button" data-city="${c}" class="history-item hover:opacity-60 underline underline-offset-4 decoration-current/40">${c}</button>${i < list.length - 1 ? '<span class="opacity-30" aria-hidden="true">·</span>' : ''}
        </li>`
      ).join('')
    : '<li class="opacity-40 italic">belum ada — cari kota untuk memulai</li>';
};

// ==================== §5 Tema hero imersif berdasar kondisi ====================
const applyWeatherTheme = (main = 'Clouds', icon = '01d') => {
  const night = icon.endsWith('n');
  const hero = $('heroPanel');
  const fx = $('weatherFx');
  const key = main.toLowerCase();

  // Peta gradient per kondisi × siang/malam — DEBUG: ubah warna di sini
  const themes = {
    clear_day: 'linear-gradient(180deg,#0f4aa8 0%,#3d8bdc 45%,#a8cdf0 70%,#ffd9a0 100%)',
    clear_night: 'linear-gradient(180deg,#02040c 0%,#0a1930 55%,#1b3358 100%)',
    clouds_day: 'linear-gradient(180deg,#2b3a4a 0%,#5b7186 55%,#b9c6d2 100%)',
    clouds_night: 'linear-gradient(180deg,#070b14 0%,#1a2434 60%,#3a4a60 100%)',
    rain: 'linear-gradient(180deg,#0a1526 0%,#1e3a5a 60%,#3f6386 100%)',
    storm: 'linear-gradient(180deg,#05070d 0%,#141c2e 60%,#2c3a55 100%)',
    snow: 'linear-gradient(180deg,#5a6e86 0%,#9db2c6 55%,#e8eef4 100%)',
    mist: 'linear-gradient(180deg,#3a3a36 0%,#7a786f 55%,#c9c5b8 100%)',
  };

  let bg = themes.clouds_day, html = '';
  if (key.includes('clear')) {
    bg = night ? themes.clear_night : themes.clear_day;
    html = night
      ? '<div class="stars absolute inset-0"></div>'
      : '<div class="sun-glow"></div>';
  } else if (key.includes('cloud')) {
    bg = night ? themes.clouds_night : themes.clouds_day;
    html = `<div class="cloud-blob" style="width:60vmax;height:16vmax;top:12%;left:-10%"></div>
            <div class="cloud-blob" style="width:50vmax;height:13vmax;top:30%;right:-12%;animation-delay:-6s"></div>`;
    if (night) html += '<div class="stars absolute inset-0 opacity-60"></div>';
  } else if (['rain', 'drizzle'].some((w) => key.includes(w))) {
    bg = themes.rain;
    html = '<div class="rain"></div><div class="cloud-blob" style="width:70vmax;height:15vmax;top:6%;left:-15%"></div>';
  } else if (key.includes('thunder')) {
    bg = themes.storm;
    html = '<div class="rain"></div><div class="flash"></div>';
  } else if (key.includes('snow')) {
    bg = themes.snow;
    html = '<div class="snow"></div>';
  } else { // mist, smoke, haze, dust, fog, ash, squall, tornado
    bg = themes.mist;
    html = `<div class="fog-band" style="top:22%"></div>
            <div class="fog-band" style="top:48%;animation-delay:-4s"></div>
            <div class="fog-band" style="top:70%;animation-delay:-8s"></div>`;
  }
  hero.style.background = bg;
  fx.innerHTML = html;
};

// ==================== §6 Render ====================
const renderCurrent = (d) => {
  const [w] = d.weather; // destructuring cuaca utama
  $('cityName').textContent = `${d.name}, ${d.sys.country}`;
  $('bigTemp').textContent = `${toDisplay(d.main.temp).toFixed(0)}`;
  $('bigUnit').textContent = unitSymbol();
  $('mainCond').textContent = w.main;
  $('descText').textContent = w.description;
  $('heroStatus').textContent = '';

  // Ikon resmi OpenWeatherMap
  const iconEl = $('weatherIcon');
  iconEl.src = `https://openweathermap.org/img/wn/${w.icon}@2x.png`;
  iconEl.alt = w.description;
  iconEl.classList.remove('hidden');

  // Sinkronkan <data> suhu untuk mesin pencari / AT
  $('bigTemp').setAttribute('value', `${d.main.temp}`);

  // Meta bawah hero
  $('metaFeels').textContent = fmtTemp(d.main.feels_like);
  $('metaHum').textContent = `${d.main.humidity}%`;
  $('metaWind').textContent = `${d.wind.speed} m/s`;
  $('metaCoord').textContent = `${d.coord.lat.toFixed(1)}, ${d.coord.lon.toFixed(1)}`;

  // Detail kanan: baris + hairline (tanpa card)
  const rows = [
    ['Deskripsi', `${w.main} — ${w.description}`],
    ['Suhu', `${fmtTemp(d.main.temp, 1)} (min ${fmtTemp(d.main.temp_min, 0)} · max ${fmtTemp(d.main.temp_max, 0)})`],
    ['Terasa seperti', fmtTemp(d.main.feels_like, 1)],
    ['Kelembaban', `${d.main.humidity}%`],
    ['Tekanan', `${d.main.pressure} hPa`],
    ['Angin', `${d.wind.speed} m/s · ${d.wind.deg ?? 0}°`],
    ['Jarak pandang', `${((d.visibility ?? 0) / 1000).toFixed(1)} km`],
    ['Matahari', `↑ ${new Date(d.sys.sunrise * 1000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} · ↓ ${new Date(d.sys.sunset * 1000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`],
  ];
  // .map() untuk membangun daftar detail
  $('detailList').innerHTML = rows
    .map(([k, v]) => `
      <div class="flex items-baseline justify-between gap-6 py-3 hairline-b" style="border-color: currentColor; border-opacity:.1">
        <dt class="text-[11px] tracking-[0.25em] uppercase opacity-50 shrink-0">${k}</dt>
        <dd class="text-right capitalize">${v}</dd>
      </div>`)
    .join('');

  applyWeatherTheme(w.main, w.icon);
};

// Prakiraan 5 hari: tabel teks bersih (via .map + .filter)
const renderForecast = (f) => {
  // Ambil 1 titik per hari (jam 12 siang); fallback tiap 8 slot bila tak cukup
  let daily = f.list.filter((e) => e.dt_txt.includes('12:00:00')).slice(0, 5);
  if (daily.length < 5) daily = f.list.filter((_, i) => i % 8 === 0).slice(0, 5);

  $('forecastBody').innerHTML = daily
    .map((e) => {
      const [w] = e.weather;
      return `
        <tr class="hairline-b" style="border-color: currentColor;">
          <th scope="row" class="py-2.5 pr-4 whitespace-nowrap font-normal text-left">${fmtDay(e.dt)}</th>
          <td class="py-2.5 pr-4 capitalize opacity-80">${w.description}</td>
          <td class="py-2.5 pr-4 text-right opacity-70">${toDisplay(e.main.temp_min).toFixed(0)}°</td>
          <td class="py-2.5 pr-4 text-right font-medium">${toDisplay(e.main.temp_max).toFixed(0)}°</td>
          <td class="py-2.5 text-right opacity-70">${e.main.humidity}%</td>
        </tr>`;
    })
    .join('');

  renderTrend(f.list.slice(0, 8)); // 8 slot × 3 jam = 24 jam
};

// Line chart minimalis tanpa bingkai (SVG murni)
const renderTrend = (slots) => {
  // .map() untuk ekstrak suhu + jam
  const pts = slots.map((e) => ({ t: fmtHour(e.dt_txt), v: e.main.temp }));
  const vals = pts.map((p) => p.v);
  const min = Math.min(...vals), max = Math.max(...vals);
  const W = 320, H = 90, P = 8;
  const X = (i) => P + (i * (W - P * 2)) / Math.max(pts.length - 1, 1);
  const Y = (v) => H - P - ((v - min) / Math.max(max - min, 0.5)) * (H - P * 2);

  const line = pts.map((p, i) => `${X(i).toFixed(1)},${Y(p.v).toFixed(1)}`).join(' ');
  const dots = pts.map((p, i) => `<circle cx="${X(i)}" cy="${Y(p.v)}" r="2.2" fill="currentColor"/>`).join('');

  $('trendChart').innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" fill="none" aria-hidden="true">
      <polyline points="${line}" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round" opacity="0.9"/>
      ${dots}
    </svg>`;
  $('trendLabels').innerHTML = `
    <span>${pts[0]?.t ?? ''}</span>
    <span class="opacity-70">${pts[Math.floor(pts.length / 2)]?.t ?? ''}</span>
    <span>${pts[pts.length - 1]?.t ?? ''}</span>`;
  $('trendRange').textContent = `${fmtTemp(min, 0)} – ${fmtTemp(max, 0)}`;
};

// ==================== §7 Fetch utama: async/await + Fetch API ====================
const fetchWeather = async (city) => {
  const q = (city || '').trim();
  if (!q) { showError('Tulis nama kota terlebih dahulu, misalnya “Bandung”.'); return; }
  if (getApiKey() === 'GANTI_DENGAN_API_KEY_ANDA' || !getApiKey()) {
    showError('API key belum diisi. Buka app.js lalu tempel key OpenWeatherMap pada OPENWEATHER_API_KEY.');
    return;
  }
  setLoading(true); clearError();
  try {
    const key = getApiKey();
    const query = `q=${encodeURIComponent(q)}&appid=${key}&units=metric&lang=id`;
    // Dua request paralel: cuaca kini + prakiraan
    const [resNow, resFc] = await Promise.all([
      fetch(`${API_BASE}/weather?${query}`),
      fetch(`${API_BASE}/forecast?${query}`),
    ]);

    // Penanganan 404: kota tidak ditemukan
    if (resNow.status === 404 || resFc.status === 404) {
      throw { code: 404, message: `Kota “${q}” tidak ditemukan. Periksa ejaan atau coba kota terdekat.` };
    }
    if (!resNow.ok || !resFc.ok) throw { code: resNow.status, message: 'Layanan cuaca sibuk. Coba lagi sesaat lagi.' };

    const [now, fc] = await Promise.all([resNow.json(), resFc.json()]);
    state.city = now.name; state.current = now; state.forecast = fc;

    renderCurrent(now);
    renderForecast(fc);
    saveToHistory(now.name); // simpan nama resmi dari API
  } catch (err) {
    // Error jaringan (offline/DNS/CORS) vs error API — pesan elegan, UI tetap utuh
    if (err?.code === 404) showError(err.message);
    else if (err instanceof TypeError) showError('Jaringan terputus atau diblokir. Periksa koneksi internet, lalu coba lagi.');
    else showError(err?.message || 'Terjadi kendala tak terduga. Silakan coba lagi.');
  } finally {
    setLoading(false);
  }
};

// ==================== §8 Toggle satuan, tema, events, init ====================
const setUnit = (u) => {
  state.unit = u;
  localStorage.setItem(LS_KEY_UNIT, u);
  const cOn = u === 'metric';
  $('btnC').className = cOn ? 'underline underline-offset-4 font-semibold' : 'opacity-50 hover:opacity-100';
  $('btnF').className = !cOn ? 'underline underline-offset-4 font-semibold' : 'opacity-50 hover:opacity-100';
  // Semantik ARIA: tandai tombol aktif untuk screen reader
  $('btnC').setAttribute('aria-pressed', `${cOn}`);
  $('btnF').setAttribute('aria-pressed', `${!cOn}`);
  if (state.current) renderCurrent(state.current);   // render ulang dari data tersimpan
  if (state.forecast) renderForecast(state.forecast);
};

const setTheme = (t) => {
  const panel = $('panelCuaca'); // <aside> semantik, bukan div dalam
  panel.dataset.theme = t;
  localStorage.setItem(LS_KEY_THEME, t);
  const dark = t === 'dark';
  panel.className = panel.className.replace(/bg-\[[^\]]+\]|text-neutral-900|text-\[[^\]]+\]|bg-neutral-900/g, '').trim();
  panel.classList.add(...(dark ? ['bg-[#0E0E0C]', 'text-[#EDECE8]'] : ['bg-[#FAFAF7]', 'text-neutral-900']));
  $('themeToggle').textContent = dark ? 'Terang' : 'Gelap';
};

const tickClock = () => {
  const now = new Date();
  const clock = $('heroClock'), date = $('heroDate');
  clock.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  date.textContent = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  // Semantik <time>: sertakan datetime agar terbaca mesin
  clock.setAttribute('datetime', now.toTimeString().slice(0, 5));
  date.setAttribute('datetime', now.toISOString().slice(0, 10));
};

// ---------- Events (DEBUG: breakpoint di sini untuk alur klik) ----------
// Semantik: form search menangani submit (klik + Enter) dalam satu jalur
$('searchForm').addEventListener('submit', (e) => {
  e.preventDefault();
  fetchWeather($('searchInput').value);
});
$('historyList').addEventListener('click', (e) => {
  const btn = e.target.closest('[data-city]');
  if (btn) { $('searchInput').value = btn.dataset.city; fetchWeather(btn.dataset.city); }
});
$('btnC').addEventListener('click', () => setUnit('metric'));
$('btnF').addEventListener('click', () => setUnit('imperial'));
$('themeToggle').addEventListener('click', () =>
  setTheme($('panelCuaca').dataset.theme === 'dark' ? 'light' : 'dark'));

// ---------- Init ----------
const init = () => {
  renderHistory();
  setUnit(state.unit);
  setTheme(localStorage.getItem(LS_KEY_THEME) || 'light');
  tickClock(); setInterval(tickClock, 10000);
  fetchWeather('Jakarta'); // kota awal
};
init();
