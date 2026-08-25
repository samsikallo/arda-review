// glossary.js — 12#, the hover glossary. Loaded by every hall; adds a box and changes nothing else.
//
// THE DESIGN CAME FROM A MEASUREMENT, NOT FROM THE PLAN. 6c# settled the Eldarin taxonomy, so the
// obvious box would say WHAT KIND OF NAME this is. map/classify_names.py then classified all 165
// by-names the archive holds and only 18 carry an Eldarin kind: 89% belong to Men, Hobbits, the
// Half-elven and the Ainur, whose naming custom Tolkien never set down. A box built around `kind`
// would have read "unknown" nine times in ten while the archive held the answer to a better
// question.
//
// SO THE SUBJECT IS WHO GAVE THE NAME -- with the tongue, the meaning and the citation, which the
// archive has for ALL 165 -- and the Eldarin kind is a line it adds for the 18 where it applies.
//
// IT IS ADDITIVE BY CONSTRUCTION. It marks names already in the page's text and attaches a box; if
// the fetch fails, nothing is marked and the page is exactly what it was. It never rewrites prose,
// never reflows, and touches no element that carries a listener -- see WALK below.
(function(){
 "use strict";
 if(window.__ardaGlossary) return; window.__ardaGlossary=true;
 var BASE=(document.querySelector('script[data-base]')||{}).dataset;
 var PRE=(BASE&&BASE.base)||"";

 // NEVER INSIDE THESE. Marking a name inside a <script> or a <style> would corrupt code; inside an
 // <a> it would nest interactive elements, which is invalid and breaks keyboard order; inside an
 // existing .gl it would recurse. `contenteditable` is excluded because the archive's forge lets a
 // reader type, and rewriting text under a cursor loses their place.
 var SKIP=/^(SCRIPT|STYLE|TEXTAREA|INPUT|SELECT|OPTION|CODE|PRE|A|BUTTON|SVG|CANVAS)$/;

 function esc(s){return String(s).replace(/[&<>"]/g,function(c){
   return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]});}

 function card(rows){
  // ONE NAME CAN HAVE SEVERAL RECORDS -- Sauron is Annatar to the Elves of Eregion and Lord of the
  // Earth in Numenor, both self-given. The box shows every one rather than picking, because
  // picking would be the archive deciding which giver mattered.
  var h=rows.map(function(r){
   var line='<div class="gl-r">';
   line+='<div class="gl-w">'+esc(r.name)+'</div>';
   var bits=[];
   if(r.person_name) bits.push('of <b>'+esc(r.person_name)+'</b>');
   if(r.tongue) bits.push(esc(r.tongue));
   if(bits.length) line+='<div class="gl-s">'+bits.join(" &middot; ")+'</div>';
   if(r.meaning) line+='<div class="gl-m">'+esc(r.meaning)+'</div>';
   line+='<div class="gl-b"><span class="gl-k">given by</span> '+esc(r.by_whom||"—")+'</div>';
   if(r.kind_label) line+='<div class="gl-b"><span class="gl-k">kind</span> '+esc(r.kind_label)+'</div>';
   else if(r.why) line+='<div class="gl-n">'+esc(r.why)+'</div>';
   if(r.cite) line+='<div class="gl-c">'+esc(r.cite)+'</div>';
   return line+'</div>';
  }).join("");
  return h;
 }

 fetch(PRE+"arda_name_kinds.json").then(function(r){return r.json()}).then(function(D){
  var KINDS={"father-name":"the father-name — a true name, public",
             "chosen-name":"the chosen name, taken at the Essecilmë — a true name, private",
             "mother-name-insight":"a mother-name of insight — a true name when solemnly given",
             "anessi-other":"a given name, and NOT a true name unless its bearer adopted it",
             "epesse":"an after-name, given by others — not a true name"};
  var BY={};
  D.names.forEach(function(r){
   if(!r.name) return;
   r.kind_label=r.kind?KINDS[r.kind]:null;
   (BY[r.name]=BY[r.name]||[]).push(r);
  });
  // LONGEST FIRST, so "Agarwaen son of Úmarth" is matched before "Agarwaen" and the box describes
  // the fuller name the page actually shows.
  var NAMES=Object.keys(BY).sort(function(a,b){return b.length-a.length});
  if(!NAMES.length) return;
  var RX=new RegExp("\\b("+NAMES.map(function(n){
    return n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}).join("|")+")\\b");

  var box=document.createElement("div");
  box.id="gl-box"; box.setAttribute("role","dialog");
  box.setAttribute("aria-label","what this name is"); box.hidden=true;
  document.body.appendChild(box);

  function show(el,rows){
   box.innerHTML=card(rows); box.hidden=false;
   var r=el.getBoundingClientRect();
   var top=r.bottom+window.scrollY+6, left=r.left+window.scrollX;
   box.style.top=top+"px";
   box.style.left=Math.max(6,Math.min(left,document.documentElement.clientWidth-320))+"px";
  }
  function hide(){box.hidden=true}

  // WALK THE TEXT NODES, NOT innerHTML. Rewriting a container's innerHTML destroys every event
  // listener inside it -- the map's feature handlers, the forge's inputs, the index's search. This
  // replaces one TEXT NODE at a time and leaves every element identity intact.
  var n=0,MAX=400;
  function walk(root){
   var it=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(t){
     if(n>=MAX) return NodeFilter.FILTER_REJECT;
     var p=t.parentNode;
     while(p&&p!==root){
       // AN SVG IS SKIPPED BY ITS NAMESPACE, NOT BY ITS NAME, AND THE NAME COULD NEVER MATCH.
       //
       // THE FAULT, reported by the owner on 01 Aug: "Galadriel's name doesn't show up on her panel
       // in the family trees." Her node held
       //     <text x="11" y="14.5"><span class="gl" ...>Galadriel</span></text>
       // and an HTML <span> INSIDE AN SVG <text> RENDERS NOTHING -- SVG wants <tspan>. So this
       // glossary was not decorating her name, it was DELETING it.
       //
       // `SKIP` has carried "SVG" since the day it was written and it never fired. `nodeName` is
       // upper-cased for HTML elements and left ALONE for SVG ones, because SVG is XML: an <svg>
       // reports "svg", and /^(...|SVG|...)$/ is case-sensitive. The guard was there, it was
       // spelled correctly for the wrong document type, and it silently did nothing.
       //
       // That is the third instance today of a string test that reads correctly and cannot match --
       // after `"transparent".rstrip("!important")` and a lower-case grep against an upper-case
       // file. THE NAMESPACE IS THE THING ITSELF; the tag name is a spelling of it.
       if(p.namespaceURI==="http://www.w3.org/2000/svg") return NodeFilter.FILTER_REJECT;
       if(p.nodeType===1&&(SKIP.test((p.nodeName||"").toUpperCase())||p.isContentEditable||p.classList.contains("gl")))
         return NodeFilter.FILTER_REJECT;
       p=p.parentNode;
     }
     return t.nodeValue&&t.nodeValue.length>2?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
   }});
   var todo=[],t;
   while((t=it.nextNode())) todo.push(t);
   todo.forEach(function(node){
    if(n>=MAX) return;
    var m=RX.exec(node.nodeValue);
    if(!m) return;
    var after=node.splitText(m.index);
    after.nodeValue=after.nodeValue.slice(m[0].length);
    var mark=document.createElement("span");
    mark.className="gl"; mark.tabIndex=0; mark.textContent=m[0];
    mark.setAttribute("aria-describedby","gl-box");
    node.parentNode.insertBefore(mark,after);
    n++;
    mark.addEventListener("mouseenter",function(){show(mark,BY[m[0]])});
    mark.addEventListener("focus",function(){show(mark,BY[m[0]])});
    mark.addEventListener("mouseleave",hide);
    mark.addEventListener("blur",hide);
   });
  }
  try{ walk(document.querySelector('[role="main"]')||document.body); }
  catch(e){ /* a glossary that throws must not take the page with it */ }
  document.addEventListener("keydown",function(e){if(e.key==="Escape")hide()});
 }).catch(function(){ /* no glossary; the page is exactly what it was */ });
})();
