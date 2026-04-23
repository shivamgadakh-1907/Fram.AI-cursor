// ============================================
// FARM AI BUILDER — Main Application Logic v2.0
// ============================================

(function() {
  'use strict';

  // ── State ──
  let currentPage = 'dashboard';
  let selectedState = null;
  let selectedSeason = null;
  let selectedCategory = 'all';
  let searchQuery = '';
  let pricePage = 0;
  const PRICE_PER_PAGE = 10;
  let mapViewMode = 'map';
  let userLocation = null;
  let nearbyMarkets = [];
  let selectedNearbyMarket = null;
  let leafletMap = null;
  let leafletMarkers = [];

  // ── DOM Helpers ──
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ── DOM Elements ──
  const navTabs = $$('.nav-tab');
  const navIndicator = $('#navIndicator');
  const pages = $$('.page');
  const themeToggle = $('#themeToggle');
  const searchInput = $('#searchInput');
  const statesGrid = $('#statesGrid');
  const stateDetail = $('#stateDetail');
  const detailGrid = $('#detailGrid');
  const detailStateName = $('#detailStateName');
  const detailClose = $('#detailClose');
  const priceTableBody = $('#priceTableBody');
  const mandiGrid = $('#mandiGrid');
  const chatMessages = $('#chatMessages');
  const chatInput = $('#chatInput');
  const chatSend = $('#chatSend');
  const chatClear = $('#chatClear');
  const uploadZone = $('#uploadZone');
  const fileInput = $('#fileInput');
  const uploadPreview = $('#uploadPreview');
  const previewImage = $('#previewImage');
  const analyzeBtn = $('#analyzeBtn');
  const diseaseResult = $('#diseaseResult');
  const priceCount = $('#priceCount');
  const pricePrev = $('#pricePrev');
  const priceNext = $('#priceNext');
  const headerTime = $('#headerTime');
  const stateCount = $('#stateCount');
  const viewMapBtn = $('#viewMapBtn');
  const viewListBtn = $('#viewListBtn');
  const detectLocationBtn = $('#detectLocationBtn');
  const locationStatus = $('#locationStatus');
  const manualLocationPanel = $('#manualLocationPanel');
  const manualLat = $('#manualLat');
  const manualLng = $('#manualLng');
  const applyManualLocationBtn = $('#applyManualLocationBtn');
  const nearbyMapContainer = $('#nearbyMapContainer');
  const nearbyListContainer = $('#nearbyListContainer');
  const livePriceTableBody = $('#livePriceTableBody');

  // ═══════════════════════════════════════
  //  PARTICLE SYSTEM
  // ═══════════════════════════════════════
  function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 40;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.3 + 0.05;
        this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.fadeDirection * 0.003;
        if (this.opacity > 0.35) this.fadeDirection = -1;
        if (this.opacity < 0.03) this.fadeDirection = 1;
        if (this.x < -10 || this.x > canvas.width + 10 || this.y < -10 || this.y > canvas.height + 10) {
          this.reset();
        }
      }
      draw() {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(74, 222, 128, ${this.opacity})`
          : `rgba(16, 185, 129, ${this.opacity * 0.5})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ═══════════════════════════════════════
  //  INITIALIZE
  // ═══════════════════════════════════════
  function init() {
    initParticles();
    renderStatesGrid();
    renderPriceTable();
    renderMandiGrid();
    bindEvents();
    animateStats();
    updateNavIndicator();
    updateTime();
    setInterval(updateTime, 60000);
    setupScrollEffects();
    initNearbyMarketsModule();

    // Set current year
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // ── Time Display ──
  function updateTime() {
    if (!headerTime) return;
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    headerTime.textContent = now.toLocaleTimeString('en-IN', options);
  }

  // ── Scroll Effects ──
  function setupScrollEffects() {
    const header = $('#appHeader');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (window.scrollY > 20) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    });

    // Intersection Observer for reveal animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ── Navigation Indicator ──
  function updateNavIndicator() {
    if (!navIndicator) return;
    const activeTab = document.querySelector('.nav-tab.active');
    if (activeTab) {
      const tabRect = activeTab.getBoundingClientRect();
      const navRect = activeTab.parentElement.getBoundingClientRect();
      navIndicator.style.left = (activeTab.offsetLeft) + 'px';
      navIndicator.style.width = tabRect.width + 'px';
      navIndicator.style.top = '4px';
    }
  }

  // ── Navigation ──
  function switchPage(pageName) {
    currentPage = pageName;
    navTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.page === pageName));
    pages.forEach(page => {
      page.classList.remove('active');
      if (page.id === `page-${pageName}`) {
        page.classList.add('active');
      }
    });
    updateNavIndicator();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Theme Toggle ──
  function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');

    const icon = themeToggle.querySelector('.theme-icon');
    icon.style.transform = 'rotate(360deg) scale(0)';
    setTimeout(() => {
      icon.textContent = isDark ? '☀️' : '🌙';
      icon.style.transform = 'rotate(0deg) scale(1)';
    }, 250);

    showToast(isDark ? '☀️ Light mode activated' : '🌙 Dark mode activated');
  }

  // ── Toast Notification ──
  function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
  }

  // ── Animated Stats ──
  function animateStats() {
    const statesCnt = Object.keys(STATES_DATA).length;
    let mandiCnt = 0;
    Object.values(STATES_DATA).forEach(s => mandiCnt += s.mandis.length);
    animateNumber('statStates', statesCnt);
    animateNumber('statCrops', 50, '+');
    animateNumber('statMandis', mandiCnt, '+');
    animateNumber('statPrices', MARKET_PRICES.length);
  }

  function animateNumber(id, target, suffix = '') {
    const el = document.getElementById(id);
    if (!el) return;
    let current = 0;
    const step = Math.ceil(target / 35);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = current + suffix;
    }, 28);
  }

  // ═══════════════════════════════════════
  //  RENDER STATES GRID
  // ═══════════════════════════════════════
  function renderStatesGrid() {
    const states = Object.keys(STATES_DATA).sort();
    const query = searchQuery.toLowerCase();
    let found = 0;

    statesGrid.innerHTML = '';

    states.forEach((stateName, index) => {
      const data = STATES_DATA[stateName];

      // Search filter
      if (query) {
        const matchState = stateName.toLowerCase().includes(query);
        const matchRegion = data.region.toLowerCase().includes(query);
        const matchCrop = Object.values(data.crops).flat().some(c => c.toLowerCase().includes(query));
        const matchMandi = data.mandis.some(m => m.name.toLowerCase().includes(query) || m.location.toLowerCase().includes(query));
        if (!matchState && !matchRegion && !matchCrop && !matchMandi) return;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const categoryCrops = data.crops[selectedCategory];
        if (!categoryCrops || categoryCrops.length === 0) return;
      }

      found++;
      const card = document.createElement('div');
      card.className = `state-card${selectedState === stateName ? ' active' : ''}`;
      card.style.animationDelay = `${Math.min(index * 0.03, 0.6)}s`;
      card.innerHTML = `
        <div class="state-name">${stateName}</div>
        <div class="state-region">
          <span class="region-dot ${data.region.toLowerCase()}"></span>
          ${data.region} India
        </div>
      `;
      card.addEventListener('click', () => selectState(stateName));
      statesGrid.appendChild(card);
    });

    if (found === 0) {
      statesGrid.innerHTML = '<div class="no-results">🔍 No states match your search. Try different keywords.</div>';
    }

    // Update state count badge
    if (stateCount) {
      stateCount.textContent = `${found} state${found !== 1 ? 's' : ''}`;
    }
  }

  // ═══════════════════════════════════════
  //  SELECT STATE
  // ═══════════════════════════════════════
  function selectState(stateName) {
    selectedState = stateName;
    const data = STATES_DATA[stateName];

    // Update grid highlighting
    $$('.state-card').forEach(card => {
      card.classList.toggle('active', card.querySelector('.state-name').textContent === stateName);
    });

    // Build detail view
    detailStateName.innerHTML = `📍 ${stateName}`;

    let seasonHTML = '';
    Object.entries(data.seasons).forEach(([key, crops]) => {
      const seasonInfo = SEASONS[key];
      const filteredCrops = selectedSeason && selectedSeason !== key ? [] : crops;
      if (filteredCrops.length === 0 && selectedSeason) return;
      seasonHTML += `
        <div class="detail-card">
          <h4>${seasonInfo.icon} ${seasonInfo.name} Season (${seasonInfo.period})</h4>
          <div class="crop-tags">
            ${(selectedSeason ? filteredCrops : crops).map(c => `<span class="crop-tag">${c}</span>`).join('')}
          </div>
        </div>
      `;
    });

    let cropsHTML = '';
    Object.entries(data.crops).forEach(([cat, crops]) => {
      if (selectedCategory !== 'all' && selectedCategory !== cat) return;
      if (crops.length === 0) return;
      const catInfo = CROP_CATEGORIES[cat];
      cropsHTML += `
        <div class="detail-card">
          <h4>${catInfo.icon} ${catInfo.name}</h4>
          <div class="crop-tags">
            ${crops.map(c => `<span class="crop-tag ${cat}">${c}</span>`).join('')}
          </div>
        </div>
      `;
    });

    detailGrid.innerHTML = `
      <div class="detail-card">
        <h4>🌡️ Climate</h4>
        <p>${data.climate}</p>
        <div style="margin-top: 14px; display: flex; gap: 20px;">
          <div>
            <div class="stat" style="font-size:1.1rem">${data.avgTemp}</div>
            <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px">Avg Temperature</div>
          </div>
          <div>
            <div class="stat" style="font-size:1.1rem">${data.rainfall}</div>
            <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px">Annual Rainfall</div>
          </div>
        </div>
      </div>
      <div class="detail-card">
        <h4>🗺️ Region & Capital</h4>
        <p><strong>Region:</strong> ${data.region} India</p>
        <p><strong>Capital:</strong> ${data.capital}</p>
        <p style="margin-top:8px"><strong>Mandis:</strong> ${data.mandis.length} markets listed</p>
      </div>
      ${seasonHTML}
      ${cropsHTML}
    `;

    stateDetail.classList.add('visible');
    stateDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Update mandis
    renderMandiGrid();
  }

  // ═══════════════════════════════════════
  //  RENDER PRICE TABLE
  // ═══════════════════════════════════════
  function renderPriceTable() {
    let filtered = [...MARKET_PRICES];

    // Season filter
    if (selectedSeason) {
      filtered = filtered.filter(p => p.season === selectedSeason);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p => p.crop.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    const total = filtered.length;
    const start = pricePage * PRICE_PER_PAGE;
    const pageItems = filtered.slice(start, start + PRICE_PER_PAGE);

    priceTableBody.innerHTML = '';

    if (pageItems.length === 0) {
      priceTableBody.innerHTML = `<tr><td colspan="5" class="no-results">No prices match current filters</td></tr>`;
    } else {
      pageItems.forEach((item, i) => {
        const trendIcon = item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '●';
        const tr = document.createElement('tr');
        tr.style.animationDelay = `${i * 0.04}s`;
        tr.innerHTML = `
          <td><strong>${item.crop}</strong></td>
          <td><span class="category-badge ${item.category}">${CROP_CATEGORIES[item.category].icon} ${CROP_CATEGORIES[item.category].name}</span></td>
          <td class="price-column">₹${item.price.toLocaleString('en-IN')}</td>
          <td><span class="trend-badge ${item.trend}">${trendIcon} ${item.trend.charAt(0).toUpperCase() + item.trend.slice(1)}</span></td>
          <td class="price-column"><span class="trend-badge ${item.trend}">${item.change}</span></td>
        `;
        priceTableBody.appendChild(tr);
      });
    }

    // Update pagination
    const endItem = Math.min(start + PRICE_PER_PAGE, total);
    priceCount.textContent = total > 0 ? `Showing ${start + 1}–${endItem} of ${total}` : 'No results';
    pricePrev.disabled = pricePage === 0;
    priceNext.disabled = start + PRICE_PER_PAGE >= total;
  }

  // ═══════════════════════════════════════
  //  RENDER MANDI GRID
  // ═══════════════════════════════════════
  function renderMandiGrid() {
    mandiGrid.innerHTML = '';
    let allMandis = [];

    Object.entries(STATES_DATA).forEach(([stateName, data]) => {
      // If a state is selected, show only that state's mandis
      if (selectedState && selectedState !== stateName) return;

      data.mandis.forEach(m => {
        allMandis.push({ ...m, state: stateName, region: data.region });
      });
    });

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      allMandis = allMandis.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q) ||
        m.state.toLowerCase().includes(q) ||
        m.speciality.toLowerCase().includes(q)
      );
    }

    // Limit display
    const displayMandis = allMandis.slice(0, 24);

    if (displayMandis.length === 0) {
      mandiGrid.innerHTML = '<div class="no-results">🔍 No marketplaces match your search.</div>';
      return;
    }

    displayMandis.forEach((m, i) => {
      const card = document.createElement('div');
      card.className = 'mandi-card';
      card.style.animationDelay = `${i * 0.04}s`;
      card.innerHTML = `
        <div class="mandi-name">🏪 ${m.name}</div>
        <div class="mandi-location">📍 ${m.location}, ${m.state}</div>
        <div class="mandi-speciality">🏷️ ${m.speciality}</div>
      `;
      mandiGrid.appendChild(card);
    });

    if (allMandis.length > 24) {
      const more = document.createElement('div');
      more.className = 'no-results';
      more.textContent = `Showing 24 of ${allMandis.length} marketplaces. Select a state or use search to narrow results.`;
      mandiGrid.appendChild(more);
    }
  }

  // ═══════════════════════════════════════
  //  NEARBY MARKETS + MAP
  // ═══════════════════════════════════════
  async function apiGet(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  }

  async function initNearbyMarketsModule() {
    if (!detectLocationBtn || !nearbyListContainer) return;
    bindNearbyEvents();
  }

  function bindNearbyEvents() {
    viewMapBtn.addEventListener('click', () => setNearbyViewMode('map'));
    viewListBtn.addEventListener('click', () => setNearbyViewMode('list'));
    detectLocationBtn.addEventListener('click', requestUserLocation);
    applyManualLocationBtn.addEventListener('click', applyManualLocation);
  }

  function setNearbyViewMode(mode) {
    mapViewMode = mode;
    viewMapBtn.classList.toggle('active', mode === 'map');
    viewListBtn.classList.toggle('active', mode === 'list');
    nearbyMapContainer.classList.toggle('hidden', mode !== 'map');
    nearbyListContainer.classList.toggle('hidden', mode !== 'list');
    if (mode === 'map' && leafletMap) {
      setTimeout(() => leafletMap.invalidateSize(), 100);
    }
  }

  async function requestUserLocation() {
    if (!navigator.geolocation) {
      showToast('⚠️ Geolocation is not supported by this browser');
      manualLocationPanel.classList.remove('hidden');
      return;
    }

    locationStatus.textContent = 'Detecting your location...';
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        manualLocationPanel.classList.add('hidden');
        await updateUserLocationAndMarkets(latitude, longitude, false);
      },
      () => {
        locationStatus.textContent = 'Location permission denied. Please enter manual location.';
        manualLocationPanel.classList.remove('hidden');
        showToast('📍 Location denied, switched to manual location input');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  async function applyManualLocation() {
    const manualCityBtn = document.getElementById('applyManualLocationBtn');
    const manualCityInput = document.getElementById('manualCity');
    const city = manualCityInput ? manualCityInput.value.trim() : '';

    if (!city) {
      showToast('⚠️ Please enter a valid city name');
      return;
    }
    
    manualCityBtn.disabled = true;
    manualCityBtn.textContent = 'Searching...';

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
         const lat = Number(data[0].lat);
         const lng = Number(data[0].lon);
         await updateUserLocationAndMarkets(lat, lng, true);
      } else {
         showToast('⚠️ City not found. Please try another.');
      }
    } catch (e) {
      showToast('⚠️ Error connecting to geocoding service');
    } finally {
      manualCityBtn.disabled = false;
      manualCityBtn.textContent = 'Apply Location';
    }
  }

  async function updateUserLocationAndMarkets(lat, lng, isManual) {
    userLocation = { lat, lng };
    locationStatus.textContent = `Location: ${lat.toFixed(4)}, ${lng.toFixed(4)} ${isManual ? '(manual)' : ''}`;
    showToast('📍 Location updated. Fetching nearby marketplaces...');
    await fetchNearbyMarkets();
  }

  async function fetchNearbyMarkets() {
    if (!userLocation) return;
    try {
      const response = await apiGet(`/markets?lat=${userLocation.lat}&lng=${userLocation.lng}&radiusKm=50`);
      nearbyMarkets = response.markets || [];
      renderNearbyMarketsList();
      renderLeafletMap();
      if (nearbyMarkets.length > 0) {
        selectNearbyMarket(nearbyMarkets[0]);
      } else {
        livePriceTableBody.innerHTML = '<tr><td colspan="4" class="no-results">No marketplaces found within 50 km radius.</td></tr>';
      }
    } catch (error) {
      showToast('⚠️ Failed to fetch nearby marketplaces');
      locationStatus.textContent = 'Could not load nearby marketplaces right now.';
    }
  }

  function renderNearbyMarketsList() {
    if (!nearbyMarkets.length) {
      nearbyListContainer.innerHTML = '<div class="no-results">No nearby marketplaces in 100 km radius.</div>';
      return;
    }
    nearbyListContainer.innerHTML = nearbyMarkets.map((market) => `
      <div class="nearby-market-card">
        <h4>🏪 ${market.name}</h4>
        <p>📍 ${market.address}</p>
        <p>📞 ${market.phone || 'Not available'}</p>
        <p>📏 ${market.distanceKm} km away</p>
        <p>🌾 ${market.cropsTraded.join(', ')}</p>
      </div>
    `).join('');
  }

  function buildInfoCardHtml(market) {
    return `
      <div style="max-width:260px;padding:4px 2px;">
        <h4 style="margin:0 0 8px 0;">${market.name}</h4>
        <p style="margin:0 0 4px 0;">📍 ${market.address}</p>
        <p style="margin:0 0 4px 0;">📞 ${market.phone || 'Not available'}</p>
        <p style="margin:0 0 4px 0;">📏 ${market.distanceKm} km</p>
        <p style="margin:0;">🌾 ${market.cropsTraded.join(', ')}</p>
      </div>
    `;
  }

  let markerClusterGroup = null;

  function renderLeafletMap() {
    if (!window.L) {
      nearbyMapContainer.innerHTML = '<div class="no-results" style="padding:18px">Leaflet failed to load. Check internet connection.</div>';
      return;
    }

    if (!leafletMap) {
      leafletMap = L.map(nearbyMapContainer).setView(
        userLocation ? [userLocation.lat, userLocation.lng] : [20.5937, 78.9629],
        userLocation ? 9 : 5
      );
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(leafletMap);
    } else {
      leafletMap.setView([userLocation.lat, userLocation.lng], 9);
    }

    leafletMarkers.forEach((marker) => marker.remove());
    leafletMarkers = [];
    if (markerClusterGroup) {
      leafletMap.removeLayer(markerClusterGroup);
    }
    
    if (L.markerClusterGroup) {
      markerClusterGroup = L.markerClusterGroup();
    }

    if (userLocation) {
      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: L.icon({ iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34] }) })
        .bindPopup('<strong>Your Location</strong>');
      if (markerClusterGroup) leafletMap.addLayer(userMarker);
      else userMarker.addTo(leafletMap);
      leafletMarkers.push(userMarker);
    }

    nearbyMarkets.forEach((market) => {
      const marker = L.marker([market.lat, market.lng]);
      marker.bindPopup(buildInfoCardHtml(market));
      marker.on('click', () => selectNearbyMarket(market));
      if (markerClusterGroup) markerClusterGroup.addLayer(marker);
      else marker.addTo(leafletMap);
      leafletMarkers.push(marker);
    });
    
    if (markerClusterGroup) {
      leafletMap.addLayer(markerClusterGroup);
    }
  }

  async function selectNearbyMarket(market) {
    selectedNearbyMarket = market;
    await fetchLivePrices(market.id);
  }

  async function fetchLivePrices(marketId) {
    try {
      const response = await apiGet(`/prices?marketId=${encodeURIComponent(marketId)}`);
      const prices = response.prices || [];
      if (!prices.length) {
        livePriceTableBody.innerHTML = '<tr><td colspan="4" class="no-results">No live prices found for this marketplace.</td></tr>';
        return;
      }
      livePriceTableBody.innerHTML = prices.map((item) => `
        <tr>
          <td><strong>${item.crop}</strong></td>
          <td class="price-column">₹${Number(item.price || 0).toLocaleString('en-IN')}</td>
          <td>${response.marketName || selectedNearbyMarket?.name || 'Unknown market'}</td>
          <td>${new Date(item.updatedAt).toLocaleString('en-IN')}</td>
        </tr>
      `).join('');
    } catch (error) {
      livePriceTableBody.innerHTML = '<tr><td colspan="4" class="no-results">Failed to load live prices. Try again.</td></tr>';
    }
  }

  // ═══════════════════════════════════════
  //  CHAT SYSTEM
  // ═══════════════════════════════════════
  window.attachedImageBase64 = null;
  window.attachedImageMimeType = null;

  function sendChatMessage(text) {
    if (!text.trim()) return;

    // Add user message
    addMessage('user', text);
    chatInput.value = '';

    // Show typing indicator
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-message ai';
    typingEl.innerHTML = `
      <div class="msg-avatar ai">🌱</div>
      <div class="msg-bubble">
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    chatMessages.appendChild(typingEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    fetch('/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: text, imageBase64: window.attachedImageBase64, imageMimeType: window.attachedImageMimeType })
    })
    .then(r => r.json())
    .then(data => {
      typingEl.remove();
      addMessage('ai', data.response || "Sorry, I couldn't process that.");
      // Clear attachment after sending
      const removeBtn = document.getElementById('chatRemoveImage');
      if (removeBtn) removeBtn.click();
    })
    .catch(err => {
      typingEl.remove();
      addMessage('ai', "Error connecting to AI service.");
      console.error(err);
    });
  }

  function addMessage(type, content) {
    const msg = document.createElement('div');
    msg.className = `chat-message ${type}`;

    const avatar = type === 'ai' ? '🌱' : '👤';

    // Parse markdown-like formatting
    let html = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');

    msg.innerHTML = `
      <div class="msg-avatar ${type}">${avatar}</div>
      <div class="msg-bubble">${html}</div>
    `;

    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function clearChat() {
    chatMessages.innerHTML = '';
    // Re-add welcome message
    const welcome = document.createElement('div');
    welcome.className = 'chat-message ai';
    welcome.innerHTML = `
      <div class="msg-avatar ai">🌱</div>
      <div class="msg-bubble">
        <strong>Namaste! 🙏</strong><br><br>
        I'm your <strong>Farm AI Assistant</strong>. I can help you with:<br><br>
        🌾 Crop recommendations<br>
        🐛 Pest & disease management<br>
        🧪 Fertilizer advice<br>
        🌦️ Weather advisory<br>
        💧 Irrigation planning<br>
        🏛️ Government schemes<br><br>
        Ask me anything about farming!
      </div>
    `;
    chatMessages.appendChild(welcome);
    showToast('🧹 Chat cleared');
  }

  // ═══════════════════════════════════════
  //  IMAGE UPLOAD & ANALYSIS
  // ═══════════════════════════════════════
  function handleImageUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('⚠️ Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      uploadPreview.classList.add('visible');
      uploadZone.style.display = 'none';
      diseaseResult.classList.remove('visible');
      analyzeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
  }

  function analyzeImage() {
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div> Analyzing...';

    setTimeout(() => {
      const result = getRandomDisease();
      displayDiseaseResult(result);
      analyzeBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8v6M8 11h6"/>
        </svg>
        Analyze Crop Image
      `;
      analyzeBtn.disabled = false;
    }, 1500 + Math.random() * 1500);
  }

  function displayDiseaseResult(result) {
    const confidenceNum = parseInt(result.confidence);

    diseaseResult.innerHTML = `
      <div class="result-card">
        <h4>🔬 Disease Detected</h4>
        <div class="result-value">${result.disease}</div>
        <p>Crop: ${result.crop}</p>
        <p style="margin-top: 6px">${result.description}</p>
        <div style="display: flex; gap: 12px; margin-top: 12px; align-items: center; flex-wrap: wrap">
          <span class="severity-badge ${result.severity.toLowerCase().includes('high') ? 'high' : result.severity.toLowerCase().includes('low') ? 'low' : 'moderate'}">
            Severity: ${result.severity}
          </span>
          <span style="font-size: 0.82rem; color: var(--text-muted)">Confidence: ${result.confidence}</span>
        </div>
        <div class="confidence-bar">
          <div class="confidence-fill" style="width: 0%"></div>
        </div>
      </div>

      <div class="result-card">
        <h4>🧪 Suggested Fertilizer</h4>
        <p>${result.fertilizer}</p>
      </div>

      <div class="result-card">
        <h4>💊 Recommended Treatment</h4>
        <p>${result.pesticide}</p>
      </div>

      <div class="result-card">
        <h4>💡 Expert Advice</h4>
        <p>${result.advice.replace(/\n/g, '<br>')}</p>
      </div>
    `;

    diseaseResult.classList.add('visible');

    // Animate confidence bar
    setTimeout(() => {
      const fill = diseaseResult.querySelector('.confidence-fill');
      if (fill) fill.style.width = confidenceNum + '%';
    }, 150);
  }

  // ═══════════════════════════════════════
  //  EVENT BINDINGS
  // ═══════════════════════════════════════
  function bindEvents() {
    // Navigation
    navTabs.forEach(tab => {
      tab.addEventListener('click', () => switchPage(tab.dataset.page));
    });

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Season cards
    $$('.season-card').forEach(card => {
      card.addEventListener('click', () => {
        const season = card.dataset.season;
        if (selectedSeason === season) {
          selectedSeason = null;
          card.classList.remove('active');
        } else {
          selectedSeason = season;
          $$('.season-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        }
        pricePage = 0;
        renderStatesGrid();
        renderPriceTable();
        if (selectedState) selectState(selectedState);
      });
    });

    // Category filter buttons
    $$('[data-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedCategory = btn.dataset.category;
        $$('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        pricePage = 0;
        renderStatesGrid();
        renderPriceTable();
        if (selectedState) selectState(selectedState);
      });
    });

    // Search
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchQuery = e.target.value;
        pricePage = 0;
        renderStatesGrid();
        renderPriceTable();
        renderMandiGrid();
      }, 200);
    });

    // Close state detail
    detailClose.addEventListener('click', () => {
      stateDetail.classList.remove('visible');
      selectedState = null;
      $$('.state-card').forEach(c => c.classList.remove('active'));
      renderMandiGrid();
    });

    // Price pagination
    pricePrev.addEventListener('click', () => {
      if (pricePage > 0) { pricePage--; renderPriceTable(); }
    });
    priceNext.addEventListener('click', () => {
      pricePage++;
      renderPriceTable();
    });

    // Chat
    chatSend.addEventListener('click', () => sendChatMessage(chatInput.value));
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChatMessage(chatInput.value);
    });

    // Chat clear
    if (chatClear) {
      chatClear.addEventListener('click', clearChat);
    }

    // Quick action chips
    $$('.quick-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        sendChatMessage(chip.dataset.query);
      });
    });

    // Image upload
    uploadZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      if (e.target.files[0]) handleImageUpload(e.target.files[0]);
    });
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
      if (e.dataTransfer.files[0]) handleImageUpload(e.dataTransfer.files[0]);
    });

    // Analyze button
    analyzeBtn.addEventListener('click', analyzeImage);

    // Reset upload (click preview to re-upload)
    previewImage.addEventListener('click', () => {
      uploadPreview.classList.remove('visible');
      uploadZone.style.display = '';
      diseaseResult.classList.remove('visible');
      fileInput.value = '';
    });

    // Keyboard shortcut: Ctrl+K to focus search
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (currentPage === 'dashboard') {
          searchInput.focus();
        } else {
          chatInput.focus();
        }
      }
      // Escape to close detail
      if (e.key === 'Escape') {
        if (stateDetail.classList.contains('visible')) {
          stateDetail.classList.remove('visible');
          selectedState = null;
          $$('.state-card').forEach(c => c.classList.remove('active'));
          renderMandiGrid();
        }
      }
    });

    // Window resize — update nav indicator
    window.addEventListener('resize', () => updateNavIndicator());
  }

  // ═══════════════════════════════════════
  //  MOCK API ENDPOINTS
  // ═══════════════════════════════════════
  window.FarmAPI = {
    // GET /prices
    getPrices: (params = {}) => {
      return new Promise(resolve => {
        setTimeout(() => {
          let data = [...MARKET_PRICES];
          if (params.category) data = data.filter(p => p.category === params.category);
          if (params.season) data = data.filter(p => p.season === params.season);
          if (params.search) data = data.filter(p => p.crop.toLowerCase().includes(params.search.toLowerCase()));
          resolve({
            status: 'ok',
            endpoint: '/prices',
            data,
            total: data.length,
            timestamp: new Date().toISOString()
          });
        }, 300);
      });
    },

    // GET /recommend
    getRecommendation: (params = {}) => {
      return new Promise(resolve => {
        setTimeout(() => {
          const state = params.state && STATES_DATA[params.state];
          if (!state) {
            resolve({ status: 'error', message: 'State not found' });
            return;
          }
          const season = params.season || 'kharif';
          resolve({
            status: 'ok',
            endpoint: '/recommend',
            state: params.state,
            season: season,
            recommended_crops: state.seasons[season] || [],
            climate: state.climate,
            nearest_mandis: state.mandis,
            timestamp: new Date().toISOString()
          });
        }, 300);
      });
    },

    // GET /states
    getStates: () => {
      return new Promise(resolve => {
        setTimeout(() => {
          const states = Object.keys(STATES_DATA).sort().map(name => ({
            name,
            region: STATES_DATA[name].region,
            capital: STATES_DATA[name].capital,
            mandis: STATES_DATA[name].mandis.length
          }));
          resolve({
            status: 'ok',
            endpoint: '/states',
            data: states,
            total: states.length,
            timestamp: new Date().toISOString()
          });
        }, 200);
      });
    },

    // POST /analyze
    analyzeDisease: (imageFile) => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            status: 'ok',
            endpoint: '/analyze',
            data: getRandomDisease(),
            timestamp: new Date().toISOString()
          });
        }, 1500);
      });
    }
  };

  // Market Insights Render
  function renderMarketInsights() {
     let container = document.getElementById('insightsGrid');
     if (!container) return;
     let stateFilter = document.getElementById('insightsStateFilter').value;
     
     let html = '';
     Object.keys(STATES_DATA).forEach(state => {
         if (stateFilter !== 'all' && stateFilter !== state) return;
         let mandisCount = STATES_DATA[state].mandis.length;
         let topMandis = STATES_DATA[state].mandis.slice(0,3).map(m=>m.name).join(', ') || 'N/A';
         html += `
           <div class="insight-card">
              <div class="state-name">${state}</div>
              <div class="market-count">${mandisCount} Markets</div>
              <div class="top-markets"><strong>Top:</strong> ${topMandis}</div>
           </div>
         `;
     });
     container.innerHTML = html;
  }

  // ── Boot ──
  document.addEventListener('DOMContentLoaded', () => {
    init();

    // Bind AI Image Attachment Tool
    let chatUploadBtn = document.getElementById('chatUploadBtn');
    let chatFileInput = document.getElementById('chatFileInput');
    if (chatUploadBtn) {
      chatUploadBtn.addEventListener('click', () => chatFileInput.click());
      chatFileInput.addEventListener('change', (e) => {
        let file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
          let reader = new FileReader();
          reader.onload = (ev) => {
             window.attachedImageBase64 = ev.target.result;
             window.attachedImageMimeType = file.type;
             document.getElementById('chatAttachedImage').src = ev.target.result;
             document.getElementById('attachedMediaPreview').classList.remove('hidden');
          };
          reader.readAsDataURL(file);
        }
      });
      let chatRemoveImage = document.getElementById('chatRemoveImage');
      if(chatRemoveImage) {
          chatRemoveImage.addEventListener('click', () => {
              window.attachedImageBase64 = null;
              window.attachedImageMimeType = null;
              chatFileInput.value = '';
              document.getElementById('attachedMediaPreview').classList.add('hidden');
          });
      }
    }

    if (document.getElementById('insightsStateFilter')) {
        let f = document.getElementById('insightsStateFilter');
        Object.keys(STATES_DATA).sort().forEach(st => {
            let opt = document.createElement('option');
            opt.value = st; opt.textContent = st;
            f.appendChild(opt);
        });
        f.addEventListener('change', renderMarketInsights);
        renderMarketInsights();
    }
  });

})();
