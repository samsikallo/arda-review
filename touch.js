// Touch support for the Arda Archive: translates gestures into the mouse/wheel
// events each pan/zoom engine already handles; adds responsive layout for phones.
(function(){
const targets=["mv","sv","tl","bmap","tax","chart"].map(id=>document.getElementById(id)).filter(Boolean);
function fireMouse(el,type,x,y){el.dispatchEvent(new MouseEvent(type,{clientX:x,clientY:y,bubbles:true}));}
targets.forEach(el=>{
el.style.touchAction="none";
let mode=null,lx=0,ly=0,ld=0;
el.addEventListener("touchstart",e=>{
if(e.touches.length===1){mode="pan";lx=e.touches[0].clientX;ly=e.touches[0].clientY;
fireMouse(el,"mousedown",lx,ly);}
else if(e.touches.length===2){mode="pinch";
if(lx)fireMouse(window,"mouseup",lx,ly);
ld=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);}
e.preventDefault();},{passive:false});
el.addEventListener("touchmove",e=>{
if(mode==="pan"&&e.touches.length===1){
lx=e.touches[0].clientX;ly=e.touches[0].clientY;
window.dispatchEvent(new MouseEvent("mousemove",{clientX:lx,clientY:ly,bubbles:true}));}
else if(mode==="pinch"&&e.touches.length===2){
const d=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);
const cx=(e.touches[0].clientX+e.touches[1].clientX)/2,cy=(e.touches[0].clientY+e.touches[1].clientY)/2;
if(Math.abs(d-ld)>6){
el.dispatchEvent(new WheelEvent("wheel",{clientX:cx,clientY:cy,deltaY:d>ld?-53:53,bubbles:true,cancelable:true}));
ld=d;}}
e.preventDefault();},{passive:false});
const end=e=>{if(mode){window.dispatchEvent(new MouseEvent("mouseup",{bubbles:true}));mode=null;}};
el.addEventListener("touchend",end);el.addEventListener("touchcancel",end);
});
// tap = click for hover-dependent pins: taps already produce click events natively.
// responsive layout for phone widths
const css=`@media(max-width:760px){
#body{flex-direction:column!important}
#panel{width:auto!important;max-height:38vh;border-left:none!important;border-top:2px solid #b0a58e;box-shadow:0 -4px 14px rgba(60,40,10,.2)!important}
#hdr h1{font-size:16px!important}
#hdr{gap:8px!important;padding:8px 12px 6px!important}
#hdr .sub{display:none}
#bar{font-size:11px}
#eralab{min-width:0!important;font-size:11px!important}
.wrap{padding:12px 10px 40px!important}
.grid2{grid-template-columns:1fr!important}
#qdbtn{right:10px;bottom:10px}
}`;
const st=document.createElement("style");st.textContent=css;document.head.appendChild(st);
})();
