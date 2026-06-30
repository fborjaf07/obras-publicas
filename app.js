// ═══════════════════════════════════════════════════════════════════
// Datos demo: 8 obras realistas de Riobamba + lógica del dashboard
// ═══════════════════════════════════════════════════════════════════

const PHASES = {
  1: { name:'Preparatoria',  desc:'Estudios y diseños iniciales',    color:'#1A5FA0', bg:'#E6F0FA', short:'Estudios' },
  2: { name:'Precontractual', desc:'Licitación pública y ofertas',    color:'#1B7B4E', bg:'#E8F5EF', short:'Licitación' },
  3: { name:'Suscripción',    desc:'Adjudicación y firma de contrato', color:'#7A4A0A', bg:'#FDF3E3', short:'Contrato' },
  4: { name:'Contractual',    desc:'Ejecución de la obra en campo',    color:'#2E6B1A', bg:'#EBF5E6', short:'Ejecución' },
  5: { name:'Evaluación',     desc:'Cierre y evaluación ex post',      color:'#4A2E8A', bg:'#EDE8FA', short:'Cierre' },
};

const STEPS = {
  1:[{d:true,t:'Aprobación del PAC 2025',s:'Plan Anual de Contratación'},
     {d:true,t:'Estudios técnicos y presupuesto referencial',s:'Memoria técnica firmada'},
     {d:false,t:'Elaboración de pliegos',s:'Modelo SERCOP'},
     {d:false,t:'Análisis de precios unitarios (APUs)',s:'Base de cálculo presupuestal'},
     {d:false,t:'Resolución de inicio del proceso',s:'Cierra fase preparatoria'}],
  2:[{d:true,t:'Publicación en portal COMPRASPÚBLICAS',s:'Convocatoria oficial'},
     {d:true,t:'Preguntas y respuestas a oferentes',s:'Aclaraciones públicas'},
     {d:false,t:'Apertura de ofertas en acto público',s:'Una hora después del cierre'},
     {d:false,t:'Evaluación técnica y económica',s:'Cumple / No Cumple + puntaje'},
     {d:false,t:'Resolución de adjudicación',s:'O declaratoria desierta'}],
  3:[{d:true,t:'Notificación al adjudicatario',s:'Todos los oferentes'},
     {d:true,t:'Presentación de garantías',s:'Fiel cumplimiento y anticipo'},
     {d:false,t:'Verificación de documentos habilitantes',s:'RUP, certificados'},
     {d:false,t:'Suscripción del contrato',s:'Firma electrónica SERCOP'}],
  4:[{d:true,t:'Entrega del anticipo',s:'Según condiciones contractuales'},
     {d:true,t:'Acta de inicio y entrega del sitio',s:'Inicia plazo contractual'},
     {d:false,t:'Planillas de avance y pagos',s:'Aprobadas por fiscalización'},
     {d:false,t:'Fiscalización técnica permanente',s:'Control continuo'},
     {d:false,t:'Acta de recepción provisional',s:'Inicia garantía técnica'}],
  5:[{d:true,t:'Período de garantía técnica',s:'Mínimo 13 meses'},
     {d:false,t:'Liquidación económica final',s:'Cierre de cuentas'},
     {d:false,t:'Evaluación ex post',s:'Autoridades competentes'},
     {d:false,t:'Cierre del expediente público',s:'Portal COMPRASPÚBLICAS'}],
};

const TIPO = {
  vial:           { icon:'🛣️', label:'Vialidad',      color:'#185FA5', bg:'#E6F1FB' },
  alcantarillado: { icon:'💧', label:'Alcantarillado', color:'#0F6E56', bg:'#E0F2EC' },
  equipamiento:   { icon:'🏛️', label:'Equipamiento',  color:'#854F0B', bg:'#FAEEDA' },
  espacio:        { icon:'🌳', label:'Espacio público',color:'#2E6B1A', bg:'#EBF5E6' },
  movilidad:      { icon:'🚦', label:'Movilidad',      color:'#4A2E8A', bg:'#EDE8FA' },
  agua:           { icon:'🚰', label:'Agua potable',   color:'#1867A0', bg:'#DCEDF8' },
};

// Obras demo realistas en Riobamba · abril 2026
const OBRAS = [
  { nombre:'Regeneración integral de la Avenida Daniel León Borja',
    codigo:'LICO-GADMR-2026-014', tipo:'vial', parroquia:'Lizarzaburu',
    proc:'Licitación', presupuesto:3840000, fase:4, avance:62, estado:'normal',
    director:'Ing. Juan Diego Remache', fiscal:'Arq. Lorena Carrión',
    inicio:'08/01/2026', fin:'15/11/2026',
    obs:'Ejecución en plazo. Avance físico concentrado en pavimentación rígida entre Carabobo y Miguel Ángel León. Paso peatonal accesible completado al 80%.'},

  { nombre:'Construcción del Colector Bosque Tubasec · Alcantarillado Pluvial',
    codigo:'LICO-GADMR-2025-001', tipo:'alcantarillado', parroquia:'Velasco',
    proc:'Licitación', presupuesto:2540734, fase:3, avance:5, estado:'alerta',
    director:'Ing. Juan Diego Remache', fiscal:'Ing. César Gutiérrez',
    inicio:'—', fin:'—',
    obs:'Contrato suscrito, pendiente formalización de garantías. Alerta por demora en presentación de pólizas del adjudicatario.'},

  { nombre:'Readecuación del Mercado General Juan Bernardo Dávalos',
    codigo:'LICO-GADMR-2025-003', tipo:'equipamiento', parroquia:'Maldonado',
    proc:'Licitación', presupuesto:1432857, fase:4, avance:38, estado:'normal',
    director:'Ing. Juan Diego Remache', fiscal:'Arq. Paúl Torres',
    inicio:'12/02/2026', fin:'30/10/2026',
    obs:'Demolición parcial concluida. Iniciada estructura metálica de cubierta. Comerciantes reubicados temporalmente en el Mercado Oriental.'},

  { nombre:'Construcción de bóvedas en el Cementerio General de Riobamba',
    codigo:'LICO-GADMR-2025-002', tipo:'equipamiento', parroquia:'Velasco',
    proc:'Licitación', presupuesto:279417, fase:4, avance:72, estado:'normal',
    director:'Ing. Juan Diego Remache', fiscal:'Arq. Lorena Carrión',
    inicio:'08/12/2025', fin:'15/05/2026',
    obs:'Avance en plazo. Fundición de bloques A, B y C completada. Falta instalación de placas y acabados finales.'},

  { nombre:'Repavimentación de la Parroquia San Luis · Anillo Vial',
    codigo:'LICO-GADMR-2026-008', tipo:'vial', parroquia:'San Luis',
    proc:'Licitación', presupuesto:895600, fase:2, avance:0, estado:'normal',
    director:'Ing. Juan Diego Remache', fiscal:'Ing. Carlos Llamuca',
    inicio:'—', fin:'—',
    obs:'En período de preguntas y respuestas. Apertura de ofertas programada para el 02 de mayo de 2026.'},

  { nombre:'Renovación de áreas verdes del Parque Infantil La Condamine',
    codigo:'CDIR-GADMR-2026-021', tipo:'espacio', parroquia:'Lizarzaburu',
    proc:'Ínfima cuantía', presupuesto:48350, fase:4, avance:85, estado:'normal',
    director:'Arq. María Fernanda Vaca', fiscal:'Arq. Paúl Torres',
    inicio:'05/03/2026', fin:'05/05/2026',
    obs:'Juegos infantiles instalados. Siembra de especies nativas (quishuar, yagual) en proceso. Recepción provisional prevista primera semana de mayo.'},

  { nombre:'Semaforización inteligente del Centro Histórico · 12 intersecciones',
    codigo:'MENO-GADMR-2026-003', tipo:'movilidad', parroquia:'Veloz',
    proc:'Menor cuantía', presupuesto:412800, fase:1, avance:0, estado:'normal',
    director:'Ing. Diego Montenegro', fiscal:'—',
    inicio:'—', fin:'—',
    obs:'Estudios de tráfico en revisión. Pliego en elaboración. Prevé publicación en el segundo trimestre.'},

  { nombre:'Ampliación de redes de agua potable · Barrio Bellavista',
    codigo:'LICO-GADMR-2025-019', tipo:'agua', parroquia:'Yaruquíes',
    proc:'Licitación', presupuesto:687200, fase:5, avance:100, estado:'normal',
    director:'Ing. Paulina Aguirre', fiscal:'Ing. César Gutiérrez',
    inicio:'10/06/2025', fin:'28/02/2026',
    obs:'Obra entregada. En período de garantía técnica (hasta marzo 2027). Beneficia a 1.240 familias con servicio continuo.'},
];

// ═══════════════════════════════════════════════════════════════════
// STATE
// ═══════════════════════════════════════════════════════════════════
let selectedPhase = 4;
let filtroFase = 0;
let filtroTexto = '';
let expandedIdx = -1;
let chartAvance = null, chartFases = null;

// ═══════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const fmtMoney = (v) => {
  if (v >= 1_000_000) return (v/1_000_000).toFixed(2).replace(/\.?0+$/,'') + ' M';
  if (v >= 1_000)     return Math.round(v/1000) + ' K';
  return v.toLocaleString('es-EC');
};
const fmtMoneyFull = (v) => '$' + (v||0).toLocaleString('es-EC', {minimumFractionDigits:2, maximumFractionDigits:2});

const statusLabel = { normal:'En plazo', alerta:'Con alerta', retraso:'Retrasado' };

// ═══════════════════════════════════════════════════════════════════
// RENDERIZADO
// ═══════════════════════════════════════════════════════════════════
function renderDate() {
  const d = new Date();
  const opts = { day:'numeric', month:'long', year:'numeric' };
  const str = d.toLocaleDateString('es-EC', opts);
  $('#today').textContent = str.charAt(0).toUpperCase() + str.slice(1);
}

function renderKPIs() {
  const tot  = OBRAS.length;
  const p1   = OBRAS.filter(o=>o.fase===1).length;
  const p23  = OBRAS.filter(o=>o.fase===2||o.fase===3).length;
  const p4   = OBRAS.filter(o=>o.fase===4).length;
  const p5   = OBRAS.filter(o=>o.fase===5).length;
  const pres = OBRAS.reduce((s,o)=>s+o.presupuesto,0);
  const prom = Math.round(OBRAS.filter(o=>o.fase===4).reduce((s,o,_,a)=>s+o.avance/a.length,0));
  const benef = OBRAS.length * 8400; // estimación de beneficiarios demo

  $('#k-total').textContent = tot;
  $('#k-p1').textContent = p1;
  $('#k-p23').textContent = p23;
  $('#k-p4').textContent = p4;
  $('#k-p5').textContent = p5;
  $('#hero-active').innerHTML = `${p4} <small>en obra</small>`;
  $('#hero-invest').innerHTML = `$${fmtMoney(pres)} <small>USD</small>`;
  $('#hero-avg').innerHTML = `${prom}<small>%</small>`;
  $('#hero-benef').innerHTML = `${(benef/1000).toFixed(1)} <small>mil</small>`;
}

function renderPipeline() {
  const el = $('#pipeline');
  el.innerHTML = Object.entries(PHASES).map(([k,p])=>{
    const count = OBRAS.filter(o=>o.fase===+k).length;
    const active = selectedPhase === +k;
    return `<div class="phase ${active?'active':''}" style="--ph-color:${p.color};--ph-bg:${p.bg}" onclick="selectPhase(${k})">
      <div class="phase-num">Fase ${k}</div>
      <div class="phase-name">${p.name}</div>
      <div class="phase-desc">${p.desc}</div>
      <div class="phase-count">${count} obra${count!==1?'s':''}</div>
    </div>`;
  }).join('');
}

function getFiltered() {
  const q = filtroTexto.toLowerCase();
  return OBRAS.filter(o => {
    const mf = filtroFase === 0 || o.fase === filtroFase;
    const mt = !q || o.nombre.toLowerCase().includes(q) || o.parroquia.toLowerCase().includes(q) || o.codigo.toLowerCase().includes(q);
    return mf && mt;
  });
}

function renderObras() {
  const list = getFiltered();
  const el = $('#obras-list');
  $('#obras-count').innerHTML = `<strong>${list.length}</strong> de ${OBRAS.length} obras`;
  if (!list.length) {
    el.innerHTML = `<div style="text-align:center;color:var(--ink-4);padding:40px 20px;font-size:13px">No se encontraron obras con ese filtro.</div>`;
    return;
  }
  el.innerHTML = list.map(o => {
    const idx = OBRAS.indexOf(o);
    const ph = PHASES[o.fase];
    const tp = TIPO[o.tipo];
    const exp = expandedIdx === idx;
    return `<div class="obra status-${o.estado} ${exp?'expanded':''}"
                style="--ph-color:${ph.color};--tipo-color:${tp.color};--tipo-bg:${tp.bg}"
                onclick="toggleObra(${idx})">
      <div class="thumb">${tp.icon}</div>
      <div class="main">
        <div class="name">${o.nombre}</div>
        <div class="meta-row">
          <span class="tag">${tp.label}</span>
          <span>📍 ${o.parroquia}</span>
          <span class="dot">·</span>
          <span>Fase ${o.fase} — ${ph.name}</span>
          <span class="dot">·</span>
          <span>${o.codigo}</span>
        </div>
        <div class="progress">
          <div class="bar"><div class="bar-fill" style="width:${o.avance}%"></div></div>
          <div class="pct">${o.avance}%</div>
        </div>
      </div>
      <div class="right-col">
        <div class="budget"><span class="dollar">USD</span>${fmtMoney(o.presupuesto)}</div>
        <div class="status">${statusLabel[o.estado]}</div>
      </div>
      ${exp ? `<div class="obra-detail">
        <div class="field"><div class="label">Procedimiento</div><div class="val">${o.proc}</div></div>
        <div class="field"><div class="label">Director</div><div class="val">${o.director}</div></div>
        <div class="field"><div class="label">Fiscalizador</div><div class="val">${o.fiscal}</div></div>
        <div class="field"><div class="label">Presupuesto</div><div class="val">${fmtMoneyFull(o.presupuesto)}</div></div>
        <div class="field"><div class="label">Inicio</div><div class="val">${o.inicio}</div></div>
        <div class="field"><div class="label">Fin previsto</div><div class="val">${o.fin}</div></div>
        <div class="field"><div class="label">Parroquia</div><div class="val">${o.parroquia}</div></div>
        <div class="field"><div class="label">Código SERCOP</div><div class="val">${o.codigo}</div></div>
        <div class="obs">${o.obs}</div>
      </div>` : ''}
    </div>`;
  }).join('');
}

function toggleObra(i) {
  expandedIdx = (expandedIdx === i) ? -1 : i;
  renderObras();
}

function setFase(f, el) {
  filtroFase = f;
  $$('.chip').forEach(c=>c.classList.remove('active'));
  if (el) el.classList.add('active');
  renderObras();
}

function selectPhase(k) {
  selectedPhase = +k;
  renderPipeline();
  renderSteps();
}

function renderSteps() {
  const ph = PHASES[selectedPhase];
  $('#steps-title').textContent = `Fase ${selectedPhase} · ${ph.name}`;
  $('#steps-caption').textContent = ph.desc;
  const steps = STEPS[selectedPhase] || [];
  $('#steps-list').innerHTML = steps.map(s => `
    <div class="step ${s.d?'done':''}" style="--ph-color:${ph.color}">
      <div class="check">${s.d?'✓':''}</div>
      <div>
        <div class="text">${s.t}</div>
        <div class="sub">${s.s}</div>
      </div>
    </div>`).join('');
}

function renderCharts() {
  if (chartAvance) chartAvance.destroy();
  if (chartFases) chartFases.destroy();

  // Bar: avance por obra (solo fases 2-5)
  const visibles = OBRAS.filter(o=>o.fase>=2).sort((a,b)=>b.avance-a.avance);
  const labels = visibles.map(o => {
    const n = o.nombre.length > 34 ? o.nombre.slice(0,34)+'…' : o.nombre;
    return n;
  });
  const colors = visibles.map(o => PHASES[o.fase].color);

  chartAvance = new Chart($('#chart-avance'), {
    type: 'bar',
    data: { labels, datasets: [{ label:'% de avance', data: visibles.map(o=>o.avance), backgroundColor: colors, borderRadius: 4, borderSkipped: false, barThickness: 14 }] },
    options: {
      responsive: true, maintainAspectRatio: false, indexAxis: 'y',
      scales: {
        x: { beginAtZero:true, max:100, grid:{color:'#EEF0F4'}, ticks:{font:{size:10, family:'Inter'}, color:'#7A819A', callback:(v)=>v+'%'} },
        y: { grid:{display:false}, ticks:{font:{size:11, family:'Inter'}, color:'#2A344D'} }
      },
      plugins: { legend:{display:false}, tooltip:{callbacks:{label:(c)=>c.parsed.x+'% de avance'}} }
    }
  });

  // Doughnut: distribución por fase
  const counts = [1,2,3,4,5].map(f => OBRAS.filter(o=>o.fase===f).length);
  const phaseColors = [1,2,3,4,5].map(f => PHASES[f].color);
  chartFases = new Chart($('#chart-fases'), {
    type: 'doughnut',
    data: { labels: Object.values(PHASES).map(p=>p.name),
            datasets: [{ data: counts, backgroundColor: phaseColors, borderWidth: 3, borderColor:'#fff', hoverOffset: 6 }] },
    options: {
      responsive: true, maintainAspectRatio: false, cutout:'62%',
      plugins: {
        legend:{position:'bottom', labels:{boxWidth:10, boxHeight:10, padding:14, font:{size:11, family:'Inter'}, color:'#2A344D'}},
        tooltip:{callbacks:{label:(c)=>c.label+': '+c.parsed+' obra'+(c.parsed!==1?'s':'')}}
      }
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
// BÚSQUEDA
// ═══════════════════════════════════════════════════════════════════
function onSearch(v) {
  filtroTexto = v;
  renderObras();
}

// ═══════════════════════════════════════════════════════════════════
// TWEAKS: cambiar color dominante (azul ↔ rojo)
// ═══════════════════════════════════════════════════════════════════
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dominantColor": "azul"
}/*EDITMODE-END*/;

let tweaks = { ...TWEAK_DEFAULTS };

function applyTweaks() {
  document.body.classList.toggle('theme-red', tweaks.dominantColor === 'rojo');
}

function initTweaks() {
  const panel = document.createElement('div');
  panel.id = 'tweaks-panel';
  panel.style.cssText = `position:fixed;bottom:20px;right:20px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px 18px;box-shadow:0 10px 30px rgba(0,0,0,0.15);z-index:200;min-width:260px;display:none;font-family:var(--sans)`;
  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <div style="font-family:var(--serif);font-size:16px">Tweaks</div>
      <button id="tw-close" style="background:transparent;border:none;font-size:18px;color:var(--ink-4);cursor:pointer">×</button>
    </div>
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:var(--ink-4);margin-bottom:6px;font-weight:600">Color dominante</div>
    <div style="display:flex;gap:6px">
      <button data-color="azul" style="flex:1;padding:8px 10px;border:1.5px solid var(--line);border-radius:8px;background:#0F2D6E;color:#fff;font-weight:600;font-size:12px">Azul institucional</button>
      <button data-color="rojo" style="flex:1;padding:8px 10px;border:1.5px solid var(--line);border-radius:8px;background:#C0392B;color:#fff;font-weight:600;font-size:12px">Rojo institucional</button>
    </div>
    <div style="margin-top:10px;font-size:11px;color:var(--ink-4);line-height:1.4">Alterna el color principal del header y acentos, manteniendo la identidad institucional.</div>
  `;
  document.body.appendChild(panel);

  const syncButtons = () => {
    panel.querySelectorAll('[data-color]').forEach(b => {
      b.style.outline = b.dataset.color === tweaks.dominantColor ? '3px solid var(--gold-500)' : 'none';
      b.style.outlineOffset = '1px';
    });
  };
  syncButtons();

  panel.querySelectorAll('[data-color]').forEach(b => {
    b.addEventListener('click', () => {
      tweaks.dominantColor = b.dataset.color;
      applyTweaks();
      syncButtons();
      try { window.parent.postMessage({type:'__edit_mode_set_keys', edits:{ dominantColor: tweaks.dominantColor }}, '*'); } catch(e) {}
    });
  });
  panel.querySelector('#tw-close').addEventListener('click', () => {
    panel.style.display = 'none';
    try { window.parent.postMessage({type:'__edit_mode_dismissed'}, '*'); } catch(e) {}
  });

  window.addEventListener('message', (e) => {
    const t = e.data && e.data.type;
    if (t === '__activate_edit_mode') panel.style.display = 'block';
    if (t === '__deactivate_edit_mode') panel.style.display = 'none';
  });
  try { window.parent.postMessage({type:'__edit_mode_available'}, '*'); } catch(e) {}
}

// ═══════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  renderDate();
  renderKPIs();
  renderPipeline();
  renderObras();
  renderSteps();
  renderCharts();
  applyTweaks();
  initTweaks();

  $('#search-main').addEventListener('input', (e) => onSearch(e.target.value));
});

// Exportar handlers globalmente (onclick inline)
Object.assign(window, { toggleObra, setFase, selectPhase });
