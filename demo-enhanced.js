
(() => {
  const input = document.querySelector("#demoInput");
  const send = document.querySelector("#demoSend");
  const messages = document.querySelector("#demoMessages");
  if (!input || !send || !messages) return;

  const freshInput = input.cloneNode(true);
  const freshSend = send.cloneNode(true);
  input.replaceWith(freshInput);
  send.replaceWith(freshSend);
  document.querySelectorAll("#demo [data-prompt]").forEach(b => {
    const n=b.cloneNode(true); b.replaceWith(n);
  });

  const demo=document.querySelector("#demo");
  const leftCard=demo.querySelector(".demoGrid > div:first-child");
  if(leftCard && !demo.querySelector(".cora-live-context")){
    const box=document.createElement("div");
    box.className="card cora-live-context"; box.style.marginTop="14px";
    box.innerHTML="<span class='num'>LIVE-KONTEXT</span><h3 id='coraCtxTitle'>Noch kein Unternehmen erkannt</h3><p id='coraCtxText'>Cora baut den Kontext während des Gesprächs auf und passt die nächsten Fragen daran an.</p><div class='cora-mini-grid'><div><small>Branche</small><b id='coraCtxIndustry'>Noch offen</b></div><div><small>Ziel</small><b id='coraCtxGoal'>Noch offen</b></div><div><small>Absicht</small><b id='coraCtxIntent'>Orientierung</b></div><div><small>Fortschritt</small><b id='coraCtxProgress'>0 / 5</b></div></div><div class='cora-progress'><i id='coraProgressBar'></i></div>";
    leftCard.appendChild(box);
  }

  const chat=demo.querySelector(".demoBox");
  if(chat && !chat.querySelector(".cora-action-row")){
    const row=document.createElement("div");
    row.className="cora-action-row";
    row.innerHTML="<button type='button' data-cora-action='lead'>Lead-Anfrage</button><button type='button' data-cora-action='value'>Wirtschaftlicher Nutzen</button><button type='button' data-cora-action='integration'>Integration</button><button type='button' data-cora-action='reset'>Neu starten</button>";
    chat.insertBefore(row,chat.querySelector(".demoForm"));
  }

  const style=document.createElement("style");
  style.textContent=".cora-live-context{overflow:hidden}.cora-mini-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}.cora-mini-grid div{border:1px solid #ffffff0c;background:#080b10;border-radius:10px;padding:9px}.cora-mini-grid small{display:block;color:#70798a;font-size:10px;text-transform:uppercase;letter-spacing:.08em}.cora-mini-grid b{display:block;color:#fff;font-size:12px;margin-top:2px}.cora-progress{height:4px;background:#ffffff0b;border-radius:99px;margin-top:12px;overflow:hidden}.cora-progress i{display:block;width:0;height:100%;background:linear-gradient(90deg,#7aa7ff,#a98bff,#70e1b0);transition:width .35s}.cora-action-row{display:flex;gap:7px;flex-wrap:wrap;padding:0 13px 13px}.cora-action-row button{border:1px solid #ffffff16;background:#ffffff06;color:#cbd1db;padding:7px 9px;border-radius:999px;font-size:11px}.cora-action-row button:hover{background:#ffffff0d}.cora-typing{display:inline-flex;align-items:center;gap:4px;color:#8b95a6}.cora-typing i{width:5px;height:5px;border-radius:50%;background:#a98bff;animation:coraDot 1s infinite}.cora-typing i:nth-child(2){animation-delay:.15s}.cora-typing i:nth-child(3){animation-delay:.3s}@keyframes coraDot{50%{opacity:.25;transform:translateY(-2px)}}.cora-lead-card{border:1px solid #70e1b033;background:#70e1b008;border-radius:14px;padding:13px;margin-top:9px}.cora-lead-card strong{display:block;margin-bottom:8px}.cora-lead-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px;font-size:11px}.cora-lead-grid span{border:1px solid #ffffff0c;border-radius:8px;padding:7px;background:#080b10}.cora-lead-grid b{display:block;color:#fff;font-size:9px;text-transform:uppercase;letter-spacing:.06em}@media(max-width:560px){.cora-mini-grid,.cora-lead-grid{grid-template-columns:1fr}}";
  document.head.appendChild(style);

  const state={industry:null,goal:null,intent:"Orientierung",turns:0};
  const industries=[
    ["Fitnessstudio",["fitnessstudio","fitness","gym","probetraining","mitgliedschaft"],["Probetraining","Mitgliedschaft","Kurse"]],
    ["Restaurant / Café",["restaurant","gastronomie","cafe","café","reservierung","speisekarte","tisch"],["Reservierung","Öffnungszeiten","Speisekarte"]],
    ["Handwerk / SHK / Bau",["handwerk","elektriker","sanitär","sanitaer","heizung","shk","dachdecker","maler","bauunternehmen","schreiner"],["Leistung","Problem","Standort"]],
    ["Immobilien",["immobilien","makler","hausverwaltung","wohnung","grundstück","grundstueck","besichtigung","expose","exposé"],["Objekt","Budget","Besichtigung"]],
    ["Kanzlei / Rechtsberatung",["kanzlei","rechtsanwalt","anwalt","rechtsberatung","mandat"],["Anliegen","Themenbereich","Dringlichkeit"]],
    ["Steuerberatung",["steuerberater","steuerberatung","steuerkanzlei"],["Anliegen","Unternehmen","Zeitraum"]],
    ["Software / IT / SaaS",["software","saas","it dienstleister","softwareunternehmen","b2b"],["Use Case","Unternehmensgröße","Bedarf"]],
    ["Zahnarztpraxis",["zahnarzt","zahnmedizin","zahnarztpraxis"],["Leistung","Termin","Dringlichkeit"]],
    ["Physiotherapie",["physio","physiotherapie","therapie"],["Leistung","Termin","Beschwerden"]],
    ["Beauty / Kosmetik",["kosmetik","beauty","nagelstudio","wimpernstudio"],["Behandlung","Termin","Wunsch"]],
    ["Friseur / Barbershop",["friseur","barbershop","haarschnitt"],["Leistung","Termin","Wunsch"]],
    ["Autohaus / Kfz",["autohaus","autowerkstatt","kfz","probefahrt","leasing","fahrzeug"],["Fahrzeug","Service","Budget"]],
    ["Agentur / Beratung",["agentur","marketingagentur","werbeagentur","consulting","beratung"],["Leistung","Ziel","Projektumfang"]],
    ["E-Commerce",["ecommerce","onlineshop","webshop","onlinehandel"],["Produkt","Ziel","Volumen"]]
  ];
  const norm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ß/g,"ss");
  function detect(text){const x=norm(text);let best=null,score=0;for(const item of industries){const points=item[1].reduce((n,t)=>n+(x.includes(norm(t))?(t.length>6?3:2):0),0);if(points>score){score=points;best={label:item[0],fields:item[2]}}}return best}
  function goal(text){const x=norm(text);if(/mehr kunden|mehr leads|neukunden|anfragen|probetraining|umsatz|auslastung/.test(x))return"Mehr qualifizierte Anfragen";if(/termin|buchung|reservier|besichtigung|probefahrt/.test(x))return"Termine & Anfragen";if(/fragen|faq|standard|kundenservice|support/.test(x))return"Weniger Standardfragen";if(/24.?7|erreichbar|ausserhalb/.test(x))return"24/7-Erreichbarkeit";return null}
  function add(role,html){const e=document.createElement("div");e.className="msg"+(role==="user"?" user":"");e.innerHTML=html;messages.appendChild(e);messages.scrollTop=messages.scrollHeight}
  function leadCard(){const industry=state.industry?state.industry.label:"Nicht angegeben";const target=state.goal||"Beratung / Erstkontakt";return"<div class='cora-lead-card'><strong>So könnte Cora die Anfrage strukturieren</strong><div class='cora-lead-grid'><span><b>Branche</b>"+industry+"</span><span><b>Ziel</b>"+target+"</span><span><b>Anliegen</b>Konkreter Bedarf des Besuchers</span><span><b>Kontakt</b>Name · Unternehmen · E-Mail · Telefon</span></div></div>"}
  function updateContext(){const q=Math.min(5,(state.industry?1:0)+(state.goal?1:0)+Math.min(3,Math.floor(state.turns/2)));const ids=["coraCtxIndustry","coraCtxGoal","coraCtxIntent","coraCtxProgress"];const vals=[state.industry?state.industry.label:"Noch offen",state.goal||"Noch offen",state.intent,q+" / 5"];ids.forEach((id,i)=>{const el=document.getElementById(id);if(el)el.textContent=vals[i]});const title=document.getElementById("coraCtxTitle"),txt=document.getElementById("coraCtxText"),bar=document.getElementById("coraProgressBar");if(title)title.textContent=state.industry?state.industry.label:"Noch kein Unternehmen erkannt";if(txt)txt.textContent=state.industry?"Branchenkontext aktiv. Cora kann jetzt passende Rückfragen statt einer allgemeinen Standardantwort stellen.":"Cora baut den Kontext während des Gesprächs auf.";if(bar)bar.style.width=(q/5*100)+"%"}
  function answer(text){
    const x=norm(text),found=detect(text);if(found)state.industry=found;const g=goal(text);if(g)state.goal=g;state.turns++;
    if(/preis|kosten|monat|setup|895|1495/.test(x)){state.intent="Kaufinteresse";return"Cora Basic: <b>895 €</b> Einrichtung + <b>495 €/Monat</b>. Cora Pro: <b>1.495 €</b> Einrichtung + <b>895 €/Monat</b>. Enterprise: individuell. Der konkrete Umfang wird vor Umsetzung abgestimmt."}
    if(/dsgvo|datenschutz|speicher|datenverarbeitung/.test(x)){state.intent="Datenschutz";return"Datenschutz hängt vom konkreten Setup ab. Relevant sind Datenarten, Anbieter, Speicherorte, Auftragsverarbeitung und Übergaben. Für eine produktive Installation müssen diese Punkte projektbezogen geprüft werden."}
    if(/integration|crm|kalender|api|n8n|webhook|automatis/.test(x)){state.intent="Integration";return"Je nach Prozess kann Cora an Formulare, E-Mail, CRM, Kalender oder Automatisierungen angebunden werden. Entscheidend ist, was nach einer qualifizierten Anfrage passieren soll: speichern, benachrichtigen, Termin buchen oder an einen Menschen übergeben."}
    if(/wie sieht.*anfrage|anfrage aus|lead.*aus|welche daten|was wird.*abgefragt/.test(x)){state.intent="Lead-Struktur";return"Eine mögliche Anfrage sieht so aus:"+leadCard()+"<br>Die Angaben werden schrittweise abgefragt, statt dem Besucher direkt ein langes Formular vorzusetzen."}
    if(/wie zahlt|lohnt|wirtschaft|roi|rendite|auszahlen|geld|umsatz/.test(x)){state.intent="Wirtschaftlicher Nutzen";const i=state.industry?state.industry.label:"Ihrem Unternehmen";return"Der wirtschaftliche Hebel entsteht nicht automatisch durch KI, sondern wenn Cora Reibung im Website-Prozess reduziert. Für <b>"+i+"</b> lässt sich z. B. rechnen: Besucher → Anfragequote → Abschlussquote → Auftragswert.<br><br><b>Beispiel:</b> 5.000 Besucher × +1 Prozentpunkt Anfragequote = 50 zusätzliche Anfragen. Bei 20 % Abschlussquote und 1.500 € Auftragswert wären das rechnerisch 15.000 € zusätzlicher Monatsumsatz. Das ist eine Modellrechnung, keine Garantie."}
    if(/wie funktioniert|was kann cora|wie kann cora|helfen|nutzen/.test(x)){state.intent="Use Case";if(!state.industry)return"Nennen Sie mir kurz Ihre Branche, z. B. „Ich habe eine Kanzlei“. Danach passe ich die Beispiele daran an.";const f=state.industry.fields.slice(0,3).join(", ");return"Verstanden: <b>"+state.industry.label+"</b>. Cora kann Besucher zuerst zu "+f+" orientieren und anschließend nur die Angaben abfragen, die für Ihren nächsten Schritt relevant sind.<br><br>Bei konkretem Interesse kann daraus eine strukturierte Anfrage entstehen."}
    if(!state.industry)return"Ich kann den Anwendungsfall direkt durchspielen. Schreiben Sie z. B. „Ich habe eine Kanzlei. Wie kann Cora mir helfen?“ oder „Wie sieht die Anfrage aus?“.";
    if(state.goal){state.intent="Ziel erkannt";return"Verstanden: <b>"+state.industry.label+"</b> und das Ziel <b>"+state.goal+"</b>. Ich würde jetzt 1–2 branchenspezifische Fragen stellen und danach entscheiden, ob genug Kontext für eine Anfrage vorhanden ist.<br><br>Welche konkrete Anfrage möchten Sie zuerst erfassen?"}
    if(/ja|ok|genau|interessant|weiter|anfrage|kontakt/.test(x)){state.intent="Kontaktabsicht";return"Alles klar. Der nächste Schritt wäre: Anliegen konkretisieren → relevante Angaben erfassen → Anfrage zusammenfassen → an Ihren definierten Prozess übergeben."+leadCard()}
    return"Ich habe <b>"+state.industry.label+"</b> erkannt. Sie können mich jetzt zu Nutzen, Preisen, Datenschutz, Integrationen oder zum konkreten Anfrageprozess fragen. Ich behalte den Branchenkontext."
  }
  function reset(){state.industry=null;state.goal=null;state.intent="Orientierung";state.turns=0;messages.innerHTML="<div class='msg'>Hallo. Ich bin Cora. Nennen Sie mir Ihr Unternehmen oder stellen Sie direkt eine Frage. Ich behalte den Gesprächskontext für die nächsten Schritte.</div>";updateContext();freshInput.focus()}
  function sendMessage(text){text=String(text||"").trim();if(!text)return;add("user",text);freshInput.value="";freshSend.disabled=true;const loading=document.createElement("div");loading.className="msg";loading.innerHTML="<span class='cora-typing'><i></i><i></i><i></i> Cora analysiert den Gesprächskontext …</span>";messages.appendChild(loading);messages.scrollTop=messages.scrollHeight;const reply=answer(text);updateContext();setTimeout(()=>{loading.remove();add("ai",reply);freshSend.disabled=false;freshInput.focus()},360)}
  freshSend.addEventListener("click",()=>sendMessage(freshInput.value));
  freshInput.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();sendMessage(freshInput.value)}});
  document.querySelectorAll("#demo [data-prompt]").forEach(b=>b.addEventListener("click",()=>sendMessage(b.dataset.prompt)));
  document.querySelectorAll("[data-cora-action]").forEach(b=>b.addEventListener("click",()=>{const a=b.dataset.coraAction;if(a==="reset")reset();if(a==="lead")sendMessage("Wie sieht die Anfrage aus?");if(a==="value")sendMessage("Wie zahlt sich das denn für mich aus?");if(a==="integration")sendMessage("Kann Cora an CRM, Kalender oder n8n angebunden werden?")}));
  updateContext();
})();
