// The Canon Drawer — the Professor's words, one click away. Loads arda_quotes.json.
(function(){
const btn=document.createElement("div");
btn.id="qdbtn";btn.innerHTML="❝";btn.title="The Canon Drawer — the corpus's own words";
btn.style.cssText="position:fixed;right:18px;bottom:18px;width:46px;height:46px;border-radius:50%;background:linear-gradient(#2a2218,#191512);color:#e2cf96;border:1.5px solid #8a7444;font:26px Georgia,serif;text-align:center;line-height:44px;cursor:pointer;z-index:50;box-shadow:0 4px 14px rgba(0,0,0,.4)";
document.body.appendChild(btn);
const pnl=document.createElement("div");
pnl.style.cssText="display:none;position:fixed;right:18px;bottom:74px;width:min(430px,92vw);max-height:70vh;background:linear-gradient(#fdfaf2,#f6efdc);border:1.5px solid #8a7444;border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.45);z-index:50;overflow:hidden;display:none;flex-direction:column;font:13.5px/1.5 Georgia,serif;color:#3a3226";
pnl.innerHTML=`<div style="padding:10px 16px 8px;background:linear-gradient(#221c15,#191512);color:#e2cf96;font-variant:small-caps;letter-spacing:.1em;display:flex;align-items:center">❝ The Canon Drawer<span style="flex:1"></span><span id="qdx" style="cursor:pointer;font-size:16px">✕</span></div>
<div style="padding:8px 14px 4px"><input id="qdq" placeholder="search the Professor's words…" style="width:100%;box-sizing:border-box;padding:6px 12px;font:12.5px Georgia,serif;border:1px solid #b0a58e;border-radius:14px;background:#fffdf6"></div>
<div id="qdl" style="overflow-y:auto;padding:4px 14px 14px"></div>`;
document.body.appendChild(pnl);
let Q=null;
function draw(f){
const l=document.getElementById("qdl");
const q=f?f.toLowerCase():"";
const hits=Q.filter(x=>!q||x.q.toLowerCase().includes(q)||x.t.toLowerCase().includes(q)||x.src.toLowerCase().includes(q));
l.innerHTML=hits.map(x=>`<div style="margin:10px 0;padding-left:10px;border-left:3px solid #c9a227">
<div style="font-style:italic">“${x.q}”</div>
<div style="font-size:11px;color:#7a6a50;margin-top:2px">— ${x.src} · ${x.t}${x.l?` · <a href="${x.l}" style="color:#7a4a12">go there ↦</a>`:""}</div></div>`).join("")||
'<div style="padding:14px;color:#7a6a50;font-style:italic">The drawer holds no such words — the corpus may say it otherwise.</div>';}
btn.onclick=()=>{
const open=pnl.style.display!="flex";
pnl.style.display=open?"flex":"none";
if(open&&!Q)fetch("arda_quotes.json").then(r=>r.json()).then(d=>{Q=d;draw("")});
else if(open)draw(document.getElementById("qdq").value);};
pnl.addEventListener("input",e=>{if(e.target.id=="qdq")draw(e.target.value)});
pnl.addEventListener("click",e=>{if(e.target.id=="qdx")pnl.style.display="none"});
})();
