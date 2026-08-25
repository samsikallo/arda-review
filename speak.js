(function(){try{
  if(document.getElementById("i-audio"))return;
  var s=document.createElementNS("http://www.w3.org/2000/svg","svg");
  s.setAttribute("style","display:none");s.setAttribute("aria-hidden","true");
  s.innerHTML='<symbol id="i-audio" viewBox="0 0 16 16"><path d="M3 6.2h2.4L8 3.8v8.4L5.4 9.8H3Z M10.6 6.2a3 3 0 0 1 0 3.6 M12.6 4.6a5.6 5.6 0 0 1 0 6.8"/></symbol>';
  document.addEventListener("DOMContentLoaded",function(){document.body.appendChild(s);});
  if(document.body)document.body.appendChild(s);
}catch(e){}})();
// Spoken Arda — pronunciation via the browser's speech synthesis, driven by App E's rules.
// Returns a respelling + the list of App E rules applied, so the sound is explainable.
(function(){
const RULES=[
[/c/g,"k","c is always k (App E: 'Celeborn' = Keleborn)"],
[/ch/g,"kh","ch as in Scottish loch, never as in church"],
[/th/g,"th","voiceless th as in thin"],
[/dh/g,"th","dh = the voiced th of these (nearest English)"],
[/qu/g,"kw","qu = kw"],
[/x/g,"ks","x = ks"],
[/y(?=[aeiouáéíóú])/g,"y","consonantal y as in you"],
[/au/g,"ow","au as in loud, how"],
[/ai|ae/g,"eye","ai/ae as in aisle (approx.)"],
[/ei/g,"ay","ei as in grey"],
[/ui/g,"ooy","ui as in ruin"],
[/á|â/g,"aa","long a, held"],
[/é|ê/g,"ay","long e (pure, no glide — approx.)"],
[/í|î/g,"ee","long i"],
[/ó|ô/g,"oh","long o"],
[/ú|û/g,"oo","long u"],
[/ë/g,"eh","the diaeresis: the vowel is sounded, never silent"],
];
function respell(name){
let s=name.normalize("NFC").toLowerCase().replace(/[^a-zûúáéíóýêîôâëäöüìò\- ']/g,"");
const applied=[];
// order matters: digraphs before single c
const seq=[[/ch/g,"kh","ch as in Scottish loch, never church"],[/dh/g,"th","dh = voiced th of these (nearest English)"],
[/th/g,"th","voiceless th as in thin"],[/qu/g,"kw","qu = kw"],[/c/g,"k","c is always k — 'Keleborn'"],
[/au/g,"ow","au as in loud"],[/ae|ai/g,"y","ai/ae as in aisle"],[/ei/g,"ay","ei as in grey"],
[/á|â/g,"ah","long a"],[/é|ê/g,"eh","long e, pure"],[/í|î/g,"ee","long i"],[/ó|ô/g,"aw","long o"],[/ú|û/g,"oo","long u"],
[/ë/g,"e","final e is sounded (diaeresis)"],[/ä/g,"a","the diaeresis marks a sounded vowel (Eärendil)"],[/ö/g,"o","sounded vowel"],[/ý/g,"ee","y-vowel"]];
for(const[re,to,note]of seq){if(re.test(s)){applied.push(note);s=s.replace(re,to);}}
// final e must sound: e at word end -> "eh"
if(/e\b/.test(s)){s=s.replace(/e\b/g,"eh");if(!applied.some(a=>a.includes("sounded")))applied.push("final e is sounded, never silent");}
applied.push("r is trilled in all positions (as the synthesis allows)");
applied.push("stress: first syllable in short words; else the heavy second-from-last (App E's rule)");
return {say:s,rules:applied};}
window.ardaRespell=respell;
window.speakArda=function(name){
const r=respell(name);
try{
const u=new SpeechSynthesisUtterance(r.say);
u.rate=0.78;u.pitch=0.95;
const vs=speechSynthesis.getVoices();
const v=vs.find(v=>/it|es|fi|cy/i.test(v.lang))||vs.find(v=>/en-GB/i.test(v.lang))||vs[0];
if(v)u.voice=v; // a Romance/Finnish voice trills r and keeps vowels pure
speechSynthesis.cancel();speechSynthesis.speak(u);
}catch(e){}
return r;};
// helper: turn any element into a speak-button target
window.ardaSpeakBtn=function(name){
return `<span onclick="event.stopPropagation();speakArda('${name.replace(/'/g,"\\'")}')" title="hear it (App E rules)" style="cursor:pointer;user-select:none"><svg class=ai aria-hidden=true><use href=#i-audio /></svg></span>`;};
})();
