// Logo "Juntos Vamos" (línea gráfica JohnVi). Uso: jvLogo(svgElement)
(function(){
var Y='#FFD21F',O='#E8731A',K='#111',W='#fff';
function word(t,o){var s=o.s,a='x="'+o.x+'" y="'+o.y+'" text-anchor="middle" font-family="Lilita One" font-size="'+s+'" textLength="'+o.len+'" lengthAdjust="spacingAndGlyphs" stroke-linejoin="round" paint-order="stroke"',d=s*0.05;
 return '<text '+a+' fill="'+W+'" stroke="'+W+'" stroke-width="'+s*0.26+'" transform="translate('+d*.4+','+d*.9+')">'+t+'</text>'+
  '<text '+a+' fill="'+K+'" stroke="'+K+'" stroke-width="'+s*0.14+'" transform="translate('+d*.6+','+d*1.3+')">'+t+'</text>'+
  '<text '+a+' fill="'+O+'" stroke="'+K+'" stroke-width="'+s*0.07+'" transform="translate('+d*.3+','+d*.7+')">'+t+'</text>'+
  '<text '+a+' fill="'+Y+'" stroke="'+K+'" stroke-width="'+s*0.045+'"><tspan fill="'+O+'">'+t.charAt(0)+'</tspan>'+t.slice(1)+'</text>';}
function rays(sc){return '<g transform="scale('+sc+')" fill="'+Y+'" stroke="'+K+'" stroke-width="9" stroke-linejoin="round"><path d="M0 0 L95 50 L80 70 Z"></path><path d="M-10 95 L100 98 L96 124 Z"></path><path d="M20 175 L105 140 L116 164 Z"></path></g>';}
function fit(sv){var t=[].slice.call(sv.querySelectorAll('text'));var top=t[3],bot=t.slice(4,8);
 try{var x1=top.getStartPositionOfChar(1).x;bot.forEach(function(n){n.setAttribute('x',x1+280);});}catch(e){}
 sv.setAttribute('viewBox','0 0 1000 1000');var m=sv.getScreenCTM();if(!m)return;
 var bb=function(el){var r=el.getBoundingClientRect();return {x:(r.left-m.e)/m.a,y:(r.top-m.f)/m.d,w:r.width/m.a,h:r.height/m.d};};
 var J=bb(sv.querySelector('.wJ')),V=bb(sv.querySelector('.wV')),s=.85,gap=14;
 sv.querySelector('.r1').setAttribute('transform','translate('+(J.x-gap-116*s)+','+(J.y+J.h*.5-87*s)+') rotate(-7)');
 sv.querySelector('.r2').setAttribute('transform','translate('+(V.x+V.w+gap+116*s)+','+(V.y+V.h*.5-87*s)+') rotate(-7) scale(-1,1)');
 var A=bb(sv.querySelector('.todo')),p=20;sv.setAttribute('viewBox',(A.x-p)+' '+(A.y-p)+' '+(A.w+2*p)+' '+(A.h+2*p));}
window.jvLogo=function(sv){
 sv.setAttribute('viewBox','0 0 1000 1000');
 sv.innerHTML='<g class="todo"><g class="r1">'+rays(1)+'</g><g class="r2">'+rays(1)+'</g><g transform="rotate(-7 500 500)"><g transform="skewX(-10) translate(70,0)"><g class="wJ">'+word('Juntos',{x:400,y:470,s:230,len:560})+'</g><g class="wV">'+word('Vamos',{x:600,y:720,s:230,len:560})+'</g></g></g></g>';
 var go=function(){fit(sv);};return (document.fonts?document.fonts.load('230px "Lilita One"').then(function(){return document.fonts.ready;}):Promise.resolve()).then(function(){go();setTimeout(go,250);});
};
})();
