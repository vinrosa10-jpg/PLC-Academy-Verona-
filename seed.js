/// <reference path="../pb_data/types.d.ts" />

// Seed admin user and default courses on first run
onAfterBootstrap((e) => {
const app = e.app;

// Create admin user if not exists
try {
const existing = app.dao().findAuthRecordByEmail(“users”, “admin@plcveronaacademy.it”);
} catch {
const usersCol = app.dao().findCollectionByNameOrId(“users”);
const admin = new Record(usersCol, {
email: “admin@plcveronaacademy.it”,
password: “Admin1234!”,
passwordConfirm: “Admin1234!”,
full_name: “Admin Academy”,
role: “admin”,
profile_type: “Admin”,
emailVisibility: true,
verified: true,
});
app.dao().saveRecord(admin);
console.log(“✅ Admin user created: admin@plcveronaacademy.it / Admin1234!”);
}

// Seed default courses if empty
try {
const existing = app.dao().findFirstRecordByFilter(“courses”, “id != ‘’”);
} catch {
const coursesCol = app.dao().findCollectionByNameOrId(“courses”);

```
const defaultCourses = [
  {
    title: "PLC Base — Siemens S7",
    description: "Parti da zero e impara a programmare PLC Siemens S7-1200/S7-1500 con Ladder, FBD e SCL. Hardware reale in aula.",
    icon: "⚙️", level: "base", status: "disponibile", color: "blue",
    lessons: JSON.stringify([
      {title:"Introduzione ai PLC", dur:"45 min", yt:"dQw4w9WgXcQ"},
      {title:"Hardware S7-1200", dur:"38 min", yt:"dQw4w9WgXcQ"},
      {title:"TIA Portal — Prima apertura", dur:"52 min", yt:"dQw4w9WgXcQ"},
      {title:"Ladder: contatti e bobine", dur:"60 min", yt:"dQw4w9WgXcQ"},
      {title:"Blocchi funzione FBD", dur:"50 min", yt:"dQw4w9WgXcQ"},
      {title:"Temporizzatori TON/TOF", dur:"44 min", yt:"dQw4w9WgXcQ"},
    ]),
    materials: JSON.stringify([
      {name:"Manuale S7-1200.pdf", size:"4.2 MB", url:"#", type:"pdf"},
      {name:"Esercizi Ladder.pdf", size:"1.8 MB", url:"#", type:"pdf"},
      {name:"Schema elettrico base.pdf", size:"2.1 MB", url:"#", type:"pdf"},
    ]),
    quiz: JSON.stringify([
      {q:"Quale linguaggio usa simboli grafici a contatti?", opts:["Ladder (LAD)","SCL","FBD","SFC"], correct:0},
      {q:"Il blocco TON è un:", opts:["Temporizzatore ritardato","Contatore","Comparatore","Timer immediato"], correct:0},
      {q:"Il CPU S7-1200 viene programmato con:", opts:["TIA Portal","Step 5","STEP 7 Classic","CoDeSys"], correct:0},
    ]),
  },
  {
    title: "SCADA / HMI WinCC",
    description: "Progetta interfacce operatore professionali con WinCC e TIA Portal HMI. Allarmi, ricette, trend storici e supervisione impianti.",
    icon: "🖥️", level: "intermedio", status: "disponibile", color: "teal",
    lessons: JSON.stringify([
      {title:"Introduzione a SCADA e HMI", dur:"40 min", yt:"dQw4w9WgXcQ"},
      {title:"WinCC — Primo progetto", dur:"55 min", yt:"dQw4w9WgXcQ"},
      {title:"Creazione schermate operatore", dur:"48 min", yt:"dQw4w9WgXcQ"},
      {title:"Gestione allarmi", dur:"42 min", yt:"dQw4w9WgXcQ"},
    ]),
    materials: JSON.stringify([
      {name:"WinCC Guida rapida.pdf", size:"3.5 MB", url:"#", type:"pdf"},
      {name:"Template schermate HMI.pdf", size:"2.0 MB", url:"#", type:"pdf"},
    ]),
    quiz: JSON.stringify([
      {q:"SCADA sta per:", opts:["Supervisory Control And Data Acquisition","Software Control And Data Access","System Control Automation Digital Acquisition","None"], correct:0},
      {q:"WinCC è un prodotto di:", opts:["Siemens","ABB","Rockwell","Schneider"], correct:0},
    ]),
  },
  {
    title: "Automazione + AI",
    description: "Integra intelligenza artificiale e Machine Learning nei sistemi PLC. IIoT, Industry 4.0 e analisi predittiva.",
    icon: "🤖", level: "avanzato", status: "prossimamente", color: "navy",
    lessons: JSON.stringify([
      {title:"Industry 4.0 e IIoT", dur:"50 min", yt:"dQw4w9WgXcQ"},
      {title:"OPC-UA e comunicazione dati", dur:"45 min", yt:"dQw4w9WgXcQ"},
    ]),
    materials: JSON.stringify([
      {name:"Industry 4.0 Overview.pdf", size:"5.1 MB", url:"#", type:"pdf"},
    ]),
    quiz: JSON.stringify([
      {q:"IIoT significa:", opts:["Industrial Internet of Things","Intelligent Industrial Operations Technology","Integrated Industrial Online Tools","None"], correct:0},
    ]),
  },
];

defaultCourses.forEach(data => {
  const record = new Record(coursesCol, data);
  app.dao().saveRecord(record);
});
console.log("✅ Default courses seeded!");
```

}
});
