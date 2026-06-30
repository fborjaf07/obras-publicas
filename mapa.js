// ═══════════ LÓGICA VISTA MAPA CIUDADANO (Leaflet + OSM) ═══════════

const PHASES_M = {
  1: { name:'Preparatoria',   color:'#1A5FA0', bg:'#E6F0FA', short:'Estudios' },
  2: { name:'Precontractual', color:'#1B7B4E', bg:'#E8F5EF', short:'Licitación' },
  3: { name:'Suscripción',    color:'#7A4A0A', bg:'#FDF3E3', short:'Contrato' },
  4: { name:'Contractual',    color:'#2E6B1A', bg:'#EBF5E6', short:'En ejecución' },
  5: { name:'Evaluación',     color:'#4A2E8A', bg:'#EDE8FA', short:'Cierre' },
};

const TIPO_M = {
  vial:           { icon:'🛣️', label:'Vialidad',       color:'#185FA5', bg:'#E6F1FB' },
  alcantarillado: { icon:'💧', label:'Alcantarillado', color:'#0F6E56', bg:'#E0F2EC' },
  equipamiento:   { icon:'🏛️', label:'Equipamiento',  color:'#854F0B', bg:'#FAEEDA' },
  espacio:        { icon:'🌳', label:'Espacio público',color:'#2E6B1A', bg:'#EBF5E6' },
  movilidad:      { icon:'🚦', label:'Movilidad',       color:'#4A2E8A', bg:'#EDE8FA' },
  agua:           { icon:'🚰', label:'Agua potable',    color:'#1867A0', bg:'#DCEDF8' },
};

// Coordenadas geográficas reales (lat, lng) — centro y barrios de Riobamba
const OBRAS_MAPA = [
  { nombre:'Regeneración integral de la Av. Daniel León Borja',
    codigo:'LICO-GADMR-2026-014', tipo:'vial', parroquia:'Lizarzaburu',
    proc:'Licitación', presupuesto:3840000, fase:4, avance:62, estado:'normal',
    director:'Ing. Juan Diego Remache', fiscal:'Arq. Lorena Carrión',
    inicio:'08/01/2026', fin:'15/11/2026',
    utm_zona:'17M', utm_e:'762130', utm_n:'9815120',
    obs:'Pavimentación rígida entre Carabobo y Miguel Ángel León al 80%. Reapertura parcial del tránsito en mayo.',
    lat:-1.6680, lng:-78.6555 },

  { nombre:'Colector Bosque Tubasec · Alcantarillado Pluvial',
    codigo:'LICO-GADMR-2025-001', tipo:'alcantarillado', parroquia:'Velasco',
    proc:'Licitación', presupuesto:2540734, fase:3, avance:5, estado:'alerta',
    director:'Ing. Juan Diego Remache', fiscal:'Ing. César Gutiérrez',
    inicio:'—', fin:'—', utm_zona:'17M', utm_e:'763832', utm_n:'9812601',
    obs:'Alerta por demora en garantías del adjudicatario.',
    lat:-1.6595, lng:-78.6490 },

  { nombre:'Readecuación Mercado Juan Bernardo Dávalos',
    codigo:'LICO-GADMR-2025-003', tipo:'equipamiento', parroquia:'Maldonado',
    proc:'Licitación', presupuesto:1432857, fase:4, avance:38, estado:'normal',
    director:'Ing. Juan Diego Remache', fiscal:'Arq. Paúl Torres',
    inicio:'12/02/2026', fin:'30/10/2026',
    utm_zona:'17M', utm_e:'760521', utm_n:'9814188',
    obs:'Estructura metálica de cubierta en montaje. Comerciantes reubicados temporalmente.',
    lat:-1.6720, lng:-78.6620 },

  { nombre:'Bóvedas · Cementerio General de Riobamba',
    codigo:'LICO-GADMR-2025-002', tipo:'equipamiento', parroquia:'Velasco',
    proc:'Licitación', presupuesto:279417, fase:4, avance:72, estado:'normal',
    director:'Ing. Juan Diego Remache', fiscal:'Arq. Lorena Carrión',
    inicio:'08/12/2025', fin:'15/05/2026',
    utm_zona:'17M', utm_e:'760980', utm_n:'9814560',
    obs:'Bloques A, B y C fundidos. Falta instalación de placas y acabados.',
    lat:-1.6635, lng:-78.6578 },

  { nombre:'Repavimentación Anillo Vial · San Luis',
    codigo:'LICO-GADMR-2026-008', tipo:'vial', parroquia:'San Luis',
    proc:'Licitación', presupuesto:895600, fase:2, avance:0, estado:'normal',
    director:'Ing. Juan Diego Remache', fiscal:'Ing. Carlos Llamuca',
    inicio:'—', fin:'—', utm_zona:'17M', utm_e:'765400', utm_n:'9811200',
    obs:'Apertura de ofertas el 02 de mayo de 2026.',
    lat:-1.6880, lng:-78.6320 },

  { nombre:'Parque Infantil La Condamine · Áreas verdes',
    codigo:'CDIR-GADMR-2026-021', tipo:'espacio', parroquia:'Lizarzaburu',
    proc:'Ínfima cuantía', presupuesto:48350, fase:4, avance:85, estado:'normal',
    director:'Arq. María Fernanda Vaca', fiscal:'Arq. Paúl Torres',
    inicio:'05/03/2026', fin:'05/05/2026',
    utm_zona:'17M', utm_e:'761400', utm_n:'9815800',
    obs:'Juegos instalados. Siembra de quishuar y yagual.',
    lat:-1.6615, lng:-78.6595 },

  { nombre:'Semaforización inteligente · Centro Histórico',
    codigo:'MENO-GADMR-2026-003', tipo:'movilidad', parroquia:'Veloz',
    proc:'Menor cuantía', presupuesto:412800, fase:1, avance:0, estado:'normal',
    director:'Ing. Diego Montenegro', fiscal:'—',
    inicio:'—', fin:'—', utm_zona:'17M', utm_e:'761850', utm_n:'9814300',
    obs:'Estudios de tráfico en revisión. 12 intersecciones priorizadas.',
    lat:-1.6690, lng:-78.6540 },

  { nombre:'Redes de agua potable · Barrio Bellavista',
    codigo:'LICO-GADMR-2025-019', tipo:'agua', parroquia:'Yaruquíes',
    proc:'Licitación', presupuesto:687200, fase:5, avance:100, estado:'normal',
    director:'Ing. Paulina Aguirre', fiscal:'Ing. César Gutiérrez',
    inicio:'10/06/2025', fin:'28/02/2026',
    utm_zona:'17M', utm_e:'758200', utm_n:'9813200',
    obs:'Obra entregada. Beneficia a 1.240 familias con servicio continuo.',
    lat:-1.6810, lng:-78.6720 },
];

// Polígonos aproximados de las 5 parroquias urbanas + Yaruquíes (rural adyacente)
// en coordenadas geográficas (lat/lng). Son aproximaciones visuales, no catastrales.
const PARROQUIAS = [
  { id:'lizarzaburu', name:'Lizarzaburu', color:'#1A5FA0',
    coords:[[-1.6545,-78.6660],[-1.6545,-78.6490],[-1.6635,-78.6490],[-1.6680,-78.6580],[-1.6650,-78.6680]] },
  { id:'velasco', name:'Velasco', color:'#1B7B4E',
    coords:[[-1.6545,-78.6490],[-1.6545,-78.6380],[-1.6650,-78.6380],[-1.6650,-78.6445],[-1.6635,-78.6490]] },
  { id:'maldonado', name:'Maldonado', color:'#7A4A0A',
    coords:[[-1.6680,-78.6580],[-1.6635,-78.6490],[-1.6650,-78.6445],[-1.6760,-78.6460],[-1.6750,-78.6600]] },
  { id:'veloz', name:'Veloz', color:'#2E6B1A',
    coords:[[-1.6650,-78.6445],[-1.6650,-78.6380],[-1.6780,-78.6380],[-1.6780,-78.6460],[-1.6760,-78.6460]] },
  { id:'yaruquies', name:'Yaruquíes', color:'#4A2E8A',
    coords:[[-1.6750,-78.6850],[-1.6750,-78.6600],[-1.6900,-78.6600],[-1.6900,-78.6850]] },
  { id:'sanluis', name:'San Luis', color:'#854F0B',
    coords:[[-1.6780,-78.6460],[-1.6780,-78.6280],[-1.6950,-78.6280],[-1.6950,-78.6460]] },
];

let mapTipo = '';
let mapSelected = -1;
let mapBasemap = 'claro';
let leafletMap = null;
let tileLayer = null;
let pinsLayer = null;
let parroquiasLayer = null;
const pinMarkers = [];

const TILE_URLS = {
  claro: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attr: '© OpenStreetMap · © CARTO' },
  esquematico: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attr: '© OpenStreetMap · © CARTO' },
  satelite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attr: '© Esri · Maxar · Earthstar Geographics' },
};

function initMap() {
  leafletMap = L.map('leaflet-map', {
    center: [-1.6720, -78.6540],
    zoom: 14,
    zoomControl: true,
    scrollWheelZoom: true,
  });
  setBasemapLayer('claro');
  drawParroquias();
  pinsLayer = L.layerGroup().addTo(leafletMap);
  renderPins();
  renderSidebar();
  updateMapMeta();
  renderMapHeroStats();
}

function setBasemapLayer(k) {
  if (tileLayer) leafletMap.removeLayer(tileLayer);
  const t = TILE_URLS[k];
  tileLayer = L.tileLayer(t.url, { attribution: t.attr, maxZoom: 19 }).addTo(leafletMap);
  mapBasemap = k;
}

function drawParroquias() {
  if (parroquiasLayer) leafletMap.removeLayer(parroquiasLayer);
  parroquiasLayer = L.layerGroup().addTo(leafletMap);
  PARROQUIAS.forEach(p => {
    const poly = L.polygon(p.coords, {
      color: p.color,
      weight: 1.5,
      opacity: 0.9,
      dashArray: '5 4',
      fillColor: p.color,
      fillOpacity: 0.07,
      interactive: false,
    }).addTo(parroquiasLayer);
    // Label en centroide
    const lats = p.coords.map(c=>c[0]), lngs = p.coords.map(c=>c[1]);
    const cLat = lats.reduce((a,b)=>a+b,0)/lats.length;
    const cLng = lngs.reduce((a,b)=>a+b,0)/lngs.length;
    L.marker([cLat,cLng], {
      icon: L.divIcon({
        className: 'parr-label-icon',
        html: `<div class="parr-label" style="color:${p.color}">${p.name}</div>`,
        iconSize: [120, 20],
        iconAnchor: [60, 10],
      }),
      interactive: false,
    }).addTo(parroquiasLayer);
  });
}

function renderMapHeroStats() {
  document.getElementById('mh-total').innerHTML = OBRAS_MAPA.length;
  document.getElementById('mh-parr').innerHTML = new Set(OBRAS_MAPA.map(o=>o.parroquia)).size;
}

function renderPins() {
  pinsLayer.clearLayers();
  pinMarkers.length = 0;
  const filtered = mapTipo ? OBRAS_MAPA.filter(o=>o.tipo===mapTipo) : OBRAS_MAPA;
  filtered.forEach(o => {
    const idx = OBRAS_MAPA.indexOf(o);
    const ph = PHASES_M[o.fase];
    const tp = TIPO_M[o.tipo];
    const sel = mapSelected === idx ? 'is-sel' : '';
    const html = `<div class="leaflet-pin ${sel}" style="--pin-color:${ph.color}">
      <div class="pin-body"><span class="pin-ic">${tp.icon}</span></div>
      <div class="pin-badge">${o.avance}%</div>
    </div>`;
    const marker = L.marker([o.lat, o.lng], {
      icon: L.divIcon({
        className: 'leaflet-pin-wrap',
        html, iconSize: [34, 34], iconAnchor: [17, 34],
      })
    }).addTo(pinsLayer);
    marker.on('click', () => selectMap(idx));
    pinMarkers.push(marker);
  });
}

function renderSidebar() {
  const panel = document.getElementById('map-panel');
  if (mapSelected < 0) {
    const filtered = mapTipo ? OBRAS_MAPA.filter(o=>o.tipo===mapTipo) : OBRAS_MAPA;
    panel.innerHTML = `
      <div style="padding:16px 20px 10px;border-bottom:1px solid var(--line)">
        <div style="font-family:var(--serif);font-size:16px">Obras en el mapa</div>
        <div style="font-size:11.5px;color:var(--ink-3);margin-top:2px">Toca un pin o una fila para ver detalle.</div>
      </div>
      <div class="obras-mini">
        ${filtered.map(o=>{
          const idx = OBRAS_MAPA.indexOf(o);
          const tp = TIPO_M[o.tipo], ph = PHASES_M[o.fase];
          return `<div class="obra-mini" onclick="selectMap(${idx})"
                       style="--tipo-color:${tp.color};--tipo-bg:${tp.bg};--ph-color:${ph.color}">
            <div class="tb">${tp.icon}</div>
            <div>
              <div class="nm">${o.nombre}</div>
              <div class="parr">📍 ${o.parroquia} · ${ph.short}</div>
            </div>
            <div class="av">${o.avance}%</div>
          </div>`;
        }).join('')}
      </div>
    `;
    return;
  }
  const o = OBRAS_MAPA[mapSelected];
  const ph = PHASES_M[o.fase];
  const tp = TIPO_M[o.tipo];
  const statusLbl = { normal:'En plazo', alerta:'Con alerta', retraso:'Retrasado' }[o.estado];
  panel.innerHTML = `
    <div class="mp-head" style="--detail-bg:${ph.color}">
      <button class="close-x" onclick="selectMap(-1)">×</button>
      <span class="tipo-tag">${tp.icon} ${tp.label}</span>
      <h4>${o.nombre}</h4>
      <div class="subname">${o.codigo} · ${o.proc}</div>
    </div>
    <div class="mp-body" style="--ph-color:${ph.color};--ph-bg:${ph.bg}">
      <span class="mp-phase-tag">Fase ${o.fase} · ${ph.name}</span>
      <div class="mp-progress">
        <div class="pr-label"><strong>${o.avance}%</strong><span>${statusLbl}</span></div>
        <div class="pr-bar"><div class="pr-fill" style="width:${o.avance}%"></div></div>
        <div class="pr-caption">Avance físico reportado</div>
      </div>
      <div class="mp-fields">
        <div class="field"><div class="lbl">Parroquia</div><div class="val">${o.parroquia}</div></div>
        <div class="field"><div class="lbl">Presupuesto</div><div class="val">$${(o.presupuesto/1000).toFixed(0)} K</div></div>
        <div class="field"><div class="lbl">Inicio</div><div class="val">${o.inicio}</div></div>
        <div class="field"><div class="lbl">Fin previsto</div><div class="val">${o.fin}</div></div>
        <div class="field"><div class="lbl">Director</div><div class="val">${o.director}</div></div>
        <div class="field"><div class="lbl">Fiscalizador</div><div class="val">${o.fiscal}</div></div>
        <div class="field full"><div class="lbl">Coordenadas UTM</div><div class="val">Zona ${o.utm_zona} · E ${o.utm_e} · N ${o.utm_n}</div></div>
      </div>
      <div class="mp-obs">${o.obs}</div>
      <div class="mp-actions">
        <button>Ver ficha completa</button>
        <button class="ghost" onclick="flyToObra(${mapSelected})">Centrar en mapa</button>
      </div>
    </div>
  `;
}

function selectMap(i) {
  mapSelected = i;
  renderPins();
  renderSidebar();
  if (i >= 0 && leafletMap) {
    const o = OBRAS_MAPA[i];
    leafletMap.flyTo([o.lat, o.lng], 16, { duration: 0.8 });
  }
}
function flyToObra(i) {
  if (i < 0) return;
  const o = OBRAS_MAPA[i];
  leafletMap.flyTo([o.lat, o.lng], 17, { duration: 0.8 });
}

function setMapTipo(t, el) {
  mapTipo = t;
  document.querySelectorAll('.map-filters .chip').forEach(c=>c.classList.remove('active'));
  if (el) el.classList.add('active');
  mapSelected = -1;
  renderPins();
  renderSidebar();
  updateMapMeta();
}

function setBasemap(k, el) {
  document.querySelectorAll('.layer-toggle button').forEach(b=>b.classList.remove('active'));
  if (el) el.classList.add('active');
  setBasemapLayer(k);
}

function updateMapMeta() {
  const filtered = mapTipo ? OBRAS_MAPA.filter(o=>o.tipo===mapTipo) : OBRAS_MAPA;
  document.getElementById('map-count').innerHTML = `<strong>${filtered.length}</strong> obra${filtered.length!==1?'s':''} georreferenciada${filtered.length!==1?'s':''}`;
}

document.addEventListener('DOMContentLoaded', initMap);
Object.assign(window, { selectMap, setMapTipo, setBasemap, flyToObra });
