// Carga index.html en un iframe oculto y arma los datos por territorio (18 plataformas + 11 parroquias rurales).
(function(){
var N=function(s){return String(s||'').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim();};
var CHICAS={de:1,del:1,la:1,las:1,los:1,el:1,y:1,e:1,en:1,a:1,al:1,para:1,por:1,con:1,o:1,u:1};
window.tCase=function(s){s=String(s||'').trim();if(s!==s.toUpperCase())return s;return s.toLowerCase().split(/(\s+)/).map(function(w,i){if(/^\s+$/.test(w))return w;if(i>0&&CHICAS[w])return w;if(/^(i|ii|iii|iv|v|vi|gadm|gadmr|upc|ecu)$/i.test(w.replace(/[^a-z]/gi,'')))return w.toUpperCase();return w.charAt(0).toUpperCase()+w.slice(1);}).join('');};
window.money=function(v){v=+v||0;if(v>=1e6)return '$'+(v/1e6).toFixed(2).replace('.',',')+' M';if(v>=1e3)return '$'+Math.round(v/1e3).toLocaleString('es-EC')+' mil';return '$'+Math.round(v).toLocaleString('es-EC');};
window.cut=function(s,n){s=String(s||'');if(s.length<=n)return s;s=s.slice(0,n);var i=s.lastIndexOf(' ');return (i>n*0.6?s.slice(0,i):s).replace(/[\s,.;:–-]+$/,'')+'…';};
window.kmf=function(v){return (+v||0).toFixed(2).replace('.',',');};
window.plat=function(n){return String(n||'').replace(/^PLATAFORMA\s+/i,'Plataforma ').replace(/Ñ[^\sA-Za-z]*|Ã‘|\uFFFD+/g,'Ñ');};
window.slug=function(s){return N(String(s).replace(/Ñ/g,'NN')).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');};

function js(src){return new Promise(function(r,j){var s=document.createElement('script');s.src=src;s.onload=r;s.onerror=function(){j(new Error('No cargó '+src));};document.head.appendChild(s);});}
function utm(E,Nn){var k0=0.9996,a=6378137,e=0.0818191908,e1sq=0.00673949674,x=E-500000,y=Nn-10000000,M=y/k0,mu=M/(a*(1-e*e/4-3*Math.pow(e,4)/64-5*Math.pow(e,6)/256)),e1=(1-Math.sqrt(1-e*e))/(1+Math.sqrt(1-e*e));
 var p=mu+(3*e1/2-27*Math.pow(e1,3)/32)*Math.sin(2*mu)+(21*e1*e1/16-55*Math.pow(e1,4)/32)*Math.sin(4*mu)+(151*Math.pow(e1,3)/96)*Math.sin(6*mu)+(1097*Math.pow(e1,4)/512)*Math.sin(8*mu);
 var N1=a/Math.sqrt(1-e*e*Math.pow(Math.sin(p),2)),T1=Math.pow(Math.tan(p),2),C1=e1sq*Math.pow(Math.cos(p),2),R1=a*(1-e*e)/Math.pow(1-e*e*Math.pow(Math.sin(p),2),1.5),D=x/(N1*k0);
 var lat=p-(N1*Math.tan(p)/R1)*(D*D/2-(5+3*T1+10*C1-4*C1*C1-9*e1sq)*Math.pow(D,4)/24+(61+90*T1+298*C1+45*T1*T1-252*e1sq-3*C1*C1)*Math.pow(D,6)/720);
 var lon=(D-(1+2*T1+C1)*Math.pow(D,3)/6+(5-2*C1+28*T1-3*C1*C1+8*e1sq+24*T1*T1)*Math.pow(D,5)/120)/Math.cos(p);return [lat*180/Math.PI,-81+lon*180/Math.PI];}
function num(s){var v=String(s||'').replace(/[^0-9.,]/g,'');var nc=(v.match(/,/g)||[]).length;if(nc>=2){var pa=v.split(',');if(pa.slice(1).every(function(p){return p.length===3;}))v=v.replace(/,/g,'');else{var li=v.lastIndexOf(',');v=v.substring(0,li).replace(/,/g,'')+'.'+v.substring(li+1);}}else if(nc===1){if(/,\d{1,2}$/.test(v))v=v.replace(/\./g,'').replace(',','.');else v=v.replace(/,/g,'');}var r=parseFloat(v)||0;if(r>5e7)r=r/1000;return r;}
function leerCSV(csv){var nm=function(s){return String(s||'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'_').replace(/__+/g,'_').replace(/^_|_$/g,'');};
 var res=Papa.parse(csv,{header:true,skipEmptyLines:true});var F=res.meta.fields||[],nf=F.map(nm);var col=function(){for(var i=0;i<arguments.length;i++){var k=nf.indexOf(nm(arguments[i]));if(k>=0)return F[k];}return null;};
 var fN=col('nombre','obra','proyecto'),fC=col('codigo','cod','contrato'),fP=col('procedimiento'),fPr=col('presupuesto','monto','valor'),fAv=col('avance','porcentaje'),fOb=col('observaciones','obs'),fSt=col('estado'),fE=col('utm_este','este'),fNo=col('utm_norte','norte'),fLa=col('lat'),fLn=col('lng','lon');
 var g=function(r,f){return f&&r[f]!=null?String(r[f]).trim():'';};var vistos={};
 return res.data.map(function(r){var n=g(r,fN);if(!n)return null;var o={nombre:n,codigo:g(r,fC),proc:g(r,fP),presupuesto:num(g(r,fPr)),avance:Math.min(100,Math.max(0,parseInt(g(r,fAv))||0)),observaciones:g(r,fOb),estado:g(r,fSt)};
  var la=parseFloat(g(r,fLa)),ln=parseFloat(g(r,fLn));if(!isNaN(la)&&!isNaN(ln)){o.lat=la;o.lng=ln;}else{var E=parseFloat(g(r,fE).replace(/,/g,'.')),No=parseFloat(g(r,fNo).replace(/,/g,'.'));if(E>100000&&No>100000){var ll=utm(E,No);if(ll[0]>-5&&ll[0]<2){o.lat=ll[0];o.lng=ll[1];}}}
  var k=o.codigo.toUpperCase()||N(o.nombre);if(vistos[k])return null;vistos[k]=1;return o;}).filter(Boolean);}
function fotos(list){var M=function(s){return String(s||'').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Z0-9 ]/g,' ').replace(/\s+/g,' ').trim();};var F=window.FOTOS_OBRAS||{};var keys=Object.keys(F).map(function(k){return [M(k),F[k]];});
 list.forEach(function(o){var n=M(o.nombre);if(!n)return;var hit=keys.find(function(k){return k[0]===n;})||keys.find(function(k){var a=k[0].slice(0,55),b=n.slice(0,55);return a.length>25&&(n.indexOf(a)===0||k[0].indexOf(b)===0);})||keys.find(function(k){return k[0].length>30&&n.indexOf(k[0].slice(0,50))>=0;});if(hit)o.fotos=hit[1];});}
function adjudicados(arr){var ya=new Set(arr.map(function(o){return N(o.nombre);}));var cods=new Set(arr.map(function(o){return String(o.codigo||'').trim().toUpperCase();}).filter(Boolean));var pref=arr.map(function(o){return N(o.nombre).slice(0,45);});
 var PC=window.PROYECTOS_CONTRATACION||[];PC.forEach(function(p){var c=p.sercop&&p.sercop.codigo?p.sercop.codigo.toUpperCase():'';var k=N(p.proyecto);var fp=(k.match(/(FASE|ETAPA)\s+[IVX0-9]+/)||[''])[0];var pi=pref.indexOf(k.slice(0,45));var ok=pi>=0&&((N(arr[pi].nombre).match(/(FASE|ETAPA)\s+[IVX0-9]+/)||[''])[0]===fp);if((c&&cods.has(c))||ya.has(k)||ok)p.duplicado=true;});
 PC.filter(function(p){return p.etapa==='Adjudicado'&&!p.duplicado&&!ya.has(N(p.proyecto));}).forEach(function(p){var s=(p.sitios||[])[0]||{};arr.push({nombre:p.proyecto,codigo:p.sercop?p.sercop.codigo:'',presupuesto:p.monto,avance:0,parroquia:p.parroquia,lat:s.lat!=null?s.lat:undefined,lng:s.lng!=null?s.lng:undefined,adjudicado:true});});
 for(var i=arr.length-1;i>=0;i--){var o=arr[i];if(!o.adjudicado&&(/^\W*ADQUISI/.test(N(o.nombre))||/^SIE-/i.test(String(o.codigo||''))||/SUBASTA INVERSA/.test(N(o.proc)))){window.ADQ_T=(window.ADQ_T||[]);window.ADQ_T.push(o);arr.splice(i,1);}}
 return arr;}
function cargarIndex(){
 var base=['https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js','plataformas-data.js','geo-riobamba.js','proyectos-contratacion.js','fotos-obras.js','bacheo-data.js','bacheo2025-data.js','vias-data.js'];
 return base.reduce(function(p,s){return p.then(function(){return js(s);});},Promise.resolve()).then(function(){
  var id='16GQpyB2XkH74mHwodCg2_qYkeqedjWXWKQie1TU5exU';
  var urls=['https://docs.google.com/spreadsheets/d/'+id+'/gviz/tq?tqx=out:csv&gid=0','https://docs.google.com/spreadsheets/d/'+id+'/export?format=csv','https://docs.google.com/spreadsheets/d/e/2PACX-1vTV83-UsGHPOwArKNJu2TOsjLKmg1m5hlWc_iaADtw1wqRwetBSebeRCBa1HNrdVeDqh5B_8XcksQdB/pub?output=csv'];
  var i=0;function next(){if(i>=urls.length)return Promise.reject(new Error('No se pudo leer la matriz de obras'));return fetch(urls[i++]+'&t='+Date.now()).then(function(r){return r.text();}).then(function(t){if(!t.trim()||t.trim().charAt(0)==='<')throw 0;var L=leerCSV(t);if(!L.length)throw 0;return L;}).catch(next);}
  return next();
 }).then(function(L){fotos(L);adjudicados(L);window.OBRAS_PUB=L;return window;});
}
function armar(w){
  var fP=function(la,ln){try{var r=w.findPlataforma(la,ln);return r?(typeof r==='string'?r:r.name):null;}catch(e){return null;}};
  var fQ=function(la,ln){try{var r=w.findParroquiaGeo(la,ln);return r?(typeof r==='string'?r:r.name):null;}catch(e){return null;}};
  var T=[];
  w.PLATAFORMAS_GEO.slice().sort(function(a,b){return a.name.localeCompare(b.name,'es');}).forEach(function(p){T.push({id:slug(plat(p.name)),tipo:'plataforma',nombre:plat(p.name),key:p.name,rings:p.rings});});
  w.PARROQUIAS_GEO.filter(function(p){return N(p.name)!=='RIOBAMBA';}).sort(function(a,b){return a.name.localeCompare(b.name,'es');}).forEach(function(p){T.push({id:slug(p.name),tipo:'parroquia',nombre:p.name,key:p.name,rings:p.rings});});
  var porNombre=function(t,txt){return t.tipo==='parroquia'&&N(txt).indexOf(N(t.key))>=0;};
  var en=function(t,la,ln,txt){if(la!=null&&ln!=null){return t.tipo==='plataforma'?fP(la,ln)===t.key:fQ(la,ln)===t.key;}return porNombre(t,txt);};
  var mid=function(c){var p=c[Math.floor(c.length/2)];return p;};
  var feats=function(fc){return (fc&&fc.features)||[];};
  var vias=[];
  [['Reasfaltado',w.VIAS_REASF],['Adoquinado',w.VIAS_ADQ],['Adoquinado en ejecución',w.VIAS_PROX]].forEach(function(x){feats(x[1]).forEach(function(f){var g=f.geometry;if(!g)return;var cs=g.type==='LineString'?g.coordinates:g.type==='MultiLineString'?g.coordinates.flat():null;if(!cs||!cs.length)return;var m=mid(cs);vias.push({t:x[0],km:+f.properties.longitud||0,lat:m[1],lng:m[0],c:cs.map(function(p){return [p[1],p[0]];})});});});
  (w.BACHEO_2025||[]).forEach(function(b){var cs=(b.c||[]).flat();if(!cs.length)return;var m=mid(cs);vias.push({t:'Bacheo 2025',km:(b.m||0)/1000,lat:m[0],lng:m[1],c:cs});});
  vias.forEach(function(v){v.p=fP(v.lat,v.lng);v.q=fQ(v.lat,v.lng);});
  var obras=w.OBRAS_PUB||[];
  var prep=(w.PROYECTOS_CONTRATACION||[]).filter(function(p){return (parseFloat(p.monto)||0)>0&&p.etapa!=='Adjudicado'&&p.tipo!=='Adquisición'&&!p.duplicado&&!(p.sercop&&/Suspend|Desiert/i.test(p.sercop.estado||''));});
  T.forEach(function(t){
    var O=obras.filter(function(o){var la=o.lat!=null&&o.lat!==''?+o.lat:null,ln=o.lng!=null&&o.lng!==''?+o.lng:null;if(la!=null&&!isNaN(la))return t.tipo==='plataforma'?(o.plataforma?(typeof o.plataforma==='string'?o.plataforma:o.plataforma.name)===t.key:fP(la,ln)===t.key):(o.parroquia_geo?o.parroquia_geo===t.key:fQ(la,ln)===t.key);return porNombre(t,o.nombre);});
    t.terminadas=O.filter(function(o){return (parseFloat(o.avance)||0)>=100;}).sort(function(a,b){return (b.fotos?1:0)-(a.fotos?1:0)||(+b.presupuesto||0)-(+a.presupuesto||0);});
    t.ejecucion=O.filter(function(o){return (parseFloat(o.avance)||0)<100;}).sort(function(a,b){return (+b.presupuesto||0)-(+a.presupuesto||0);});
    t.vienen=prep.filter(function(p){var s=(p.sitios||[]).find(function(s){return s.lat!=null;});if(s)return en(t,s.lat,s.lng,p.proyecto);if(t.tipo==='parroquia')return N(p.parroquia)===N(t.key)||porNombre(t,p.proyecto);return false;}).sort(function(a,b){return (+b.monto||0)-(+a.monto||0);});
    t.puntos=[];
    O.forEach(function(o){if(o.lat!=null&&o.lat!==''&&!isNaN(+o.lat))t.puntos.push({lat:+o.lat,lng:+o.lng,k:(parseFloat(o.avance)||0)>=100?'t':'e'});});
    t.vienen.forEach(function(p){(p.sitios||[]).forEach(function(s){if(s.lat!=null)t.puntos.push({lat:s.lat,lng:s.lng,k:'v'});});});
    var V=vias.filter(function(v){return t.tipo==='plataforma'?v.p===t.key:v.q===t.key;});
    t.viasGeo=V;
    var km={};V.forEach(function(v){km[v.t]=(km[v.t]||0)+v.km;});
    if(t.tipo==='plataforma'){var b=(w.BACHEO||[]).find(function(b){return N(b.plat)===N(t.key);});if(b&&b.km)km['Bacheo 2026']=(km['Bacheo 2026']||0)+b.km;}
    t.km=km;t.kmTotal=Object.keys(km).reduce(function(s,k){return s+km[k];},0);
    t.invTerm=t.terminadas.reduce(function(s,o){return s+(+o.presupuesto||0);},0);
    t.invEjec=t.ejecucion.reduce(function(s,o){return s+(+o.presupuesto||0);},0);
    t.invVienen=t.vienen.reduce(function(s,p){return s+(+p.monto||0);},0);
    t.inv=t.invTerm+t.invEjec+t.invVienen;
    t.adq=(window.ADQ_T||[]).filter(function(o){var la=o.lat!=null&&o.lat!==''?+o.lat:null,ln=o.lng!=null&&o.lng!==''?+o.lng:null;if(la!=null&&!isNaN(la))return t.tipo==='plataforma'?fP(la,ln)===t.key:fQ(la,ln)===t.key;return porNombre(t,o.nombre);});
    t.conFoto=t.terminadas.filter(function(o){return o.fotos&&o.fotos.length;});
  });
  return T;
}
window.cargarTerritorios=function(){if(window._terrP)return window._terrP;window._terrP=cargarIndex().then(armar);return window._terrP;};

// Mapa SVG del territorio
window.mapaSVG=function(t,o){o=o||{};var W=o.w||800,H=o.h||800,pad=o.pad||30;var all=[];t.rings.forEach(function(r){all=all.concat(r);});
  var la=all.map(function(p){return p[0];}),ln=all.map(function(p){return p[1];});
  var a0=Math.min.apply(0,la),a1=Math.max.apply(0,la),b0=Math.min.apply(0,ln),b1=Math.max.apply(0,ln);
  var kx=Math.cos((a0+a1)/2*Math.PI/180);var sx=(b1-b0)*kx,sy=a1-a0;var s=Math.min((W-2*pad)/sx,(H-2*pad)/sy);
  var ox=(W-sx*s)/2,oy=(H-sy*s)/2;var P=function(p){return [(ox+(p[1]-b0)*kx*s).toFixed(1),(oy+(a1-p[0])*s).toFixed(1)];};
  var poly=t.rings.map(function(r){return 'M'+r.map(function(p){return P(p).join(',');}).join('L')+'Z';}).join('');
  var col={'Reasfaltado':o.cRe||'#3A3128','Adoquinado':o.cAd||'#B85E1A','Adoquinado en ejecución':o.cAd||'#B85E1A','Bacheo 2025':o.cRe||'#3A3128'};
  var vias=(t.viasGeo||[]).map(function(v){return '<path d="M'+v.c.map(function(p){return P(p).join(',');}).join('L')+'" stroke="'+col[v.t]+'" stroke-width="'+(o.vw||3)+'" fill="none" stroke-linecap="round" opacity=".8"></path>';}).join('');
  var r=o.r||11;var pts=t.puntos.map(function(p){var q=P([p.lat,p.lng]);var f=p.k==='t'?(o.cT||'#1E1A16'):p.k==='e'?(o.cE||'#B85E1A'):(o.cV||'#F9DD4F');return '<circle cx="'+q[0]+'" cy="'+q[1]+'" r="'+r+'" fill="'+f+'" stroke="'+(o.st||'#fff')+'" stroke-width="3"></circle>';}).join('');
  var cid='cp'+Math.random().toString(36).slice(2,8);return '<svg viewBox="0 0 '+W+' '+H+'" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="'+cid+'"><path d="'+poly+'"></path></clipPath></defs><path d="'+poly+'" fill="'+(o.fill||'#EFE6CF')+'" stroke="none"></path><g clip-path="url(#'+cid+')">'+vias+'</g><path d="'+poly+'" fill="none" stroke="'+(o.stroke||'#1E1A16')+'" stroke-width="'+(o.sw||3)+'" stroke-linejoin="round"></path>'+pts+'</svg>';
};
})();
