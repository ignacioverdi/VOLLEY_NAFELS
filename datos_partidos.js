// datos_partidos.js — Nafels NLA 2025/26 — DEFINITIVO 03/06/2026
const PARTIDOS_GENERADO = "03/06/2026";
const PARTIDOS_TOTAL = 26;
const PARTIDOS_META = [
  {
    "nombre": "LAUSANNE",
    "rival": "LAUSANNE",
    "fecha": "19/10/2025",
    "torneo": "NLA Suiza",
    "condicion": "VISITANTE",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "1",
    "parciales": [
      "35-33",
      "25-19",
      "21-25",
      "25-23"
    ]
  },
  {
    "nombre": "ST GALLEN",
    "rival": "ST GALLEN",
    "fecha": "25/10/2025",
    "torneo": "NLA Suiza",
    "condicion": "VISITANTE",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0",
    "parciales": [
      "25-15",
      "25-21",
      "25-20"
    ]
  },
  {
    "nombre": "COLOMBIER",
    "rival": "COLOMBIER",
    "fecha": "01/11/2025",
    "torneo": "NLA Suiza",
    "condicion": "LOCAL",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0",
    "parciales": [
      "25-15",
      "25-21",
      "25-21"
    ]
  },
  {
    "nombre": "JONA",
    "rival": "JONA",
    "fecha": "05/11/2025",
    "torneo": "NLA Suiza",
    "condicion": "LOCAL",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "1",
    "parciales": [
      "26-28",
      "25-19",
      "25-17",
      "25-21"
    ]
  },
  {
    "nombre": "AMRISWIL",
    "rival": "AMRISWIL",
    "fecha": "08/11/2025",
    "torneo": "NLA Suiza",
    "condicion": "VISITANTE",
    "resultado": "D",
    "sets_nafels": "0",
    "sets_rival": "3",
    "parciales": [
      "20-25",
      "21-25",
      "21-25"
    ]
  },
  {
    "nombre": "SCHONENWERD",
    "rival": "SCHONENWERD",
    "fecha": "15/11/2025",
    "torneo": "NLA Suiza",
    "condicion": "LOCAL",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "1",
    "parciales": [
      "31-29",
      "25-23",
      "23-25",
      "25-17"
    ]
  },
  {
    "nombre": "CHENOIS",
    "rival": "CHENOIS",
    "fecha": "22/11/2025",
    "torneo": "NLA Suiza",
    "condicion": "LOCAL",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0",
    "parciales": [
      "29-27",
      "25-20",
      "25-21"
    ]
  },
  {
    "nombre": "JONA",
    "rival": "JONA",
    "fecha": "29/11/2025",
    "torneo": "NLA Suiza",
    "condicion": "VISITANTE",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "2",
    "parciales": [
      "20-25",
      "25-17",
      "18-25",
      "25-22",
      "15-9"
    ]
  },
  {
    "nombre": "LAUSANNE",
    "rival": "LAUSANNE",
    "fecha": "07/12/2025",
    "torneo": "NLA Suiza",
    "condicion": "LOCAL",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "2",
    "parciales": [
      "21-25",
      "25-20",
      "21-25",
      "27-25",
      "17-15"
    ]
  },
  {
    "nombre": "ST GALLEN",
    "rival": "ST GALLEN",
    "fecha": "13/12/2025",
    "torneo": "NLA Suiza",
    "condicion": "LOCAL",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0",
    "parciales": [
      "25-19",
      "25-11",
      "25-16"
    ]
  },
  {
    "nombre": "COLOMBIER",
    "rival": "COLOMBIER",
    "fecha": "20/12/2025",
    "torneo": "NLA Suiza",
    "condicion": "VISITANTE",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "1",
    "parciales": [
      "17-25",
      "25-20",
      "25-21",
      "25-17"
    ]
  },
  {
    "nombre": "AMRISWIL",
    "rival": "AMRISWIL",
    "fecha": "03/01/2026",
    "torneo": "NLA Suiza",
    "condicion": "LOCAL",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "1",
    "parciales": [
      "19-25",
      "25-19",
      "25-23",
      "25-21"
    ]
  },
  {
    "nombre": "SURSEE",
    "rival": "SURSEE",
    "fecha": "11/01/2026",
    "torneo": "NLA Suiza",
    "condicion": "VISITANTE",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0",
    "parciales": [
      "25-11",
      "25-21",
      "25-17"
    ]
  },
  {
    "nombre": "SCHONENWERD",
    "rival": "SCHONENWERD",
    "fecha": "17/01/2026",
    "torneo": "NLA Suiza",
    "condicion": "VISITANTE",
    "resultado": "D",
    "sets_nafels": "1",
    "sets_rival": "3",
    "parciales": [
      "25-22",
      "19-25",
      "21-25",
      "25-27"
    ]
  },
  {
    "nombre": "CHENOIS",
    "rival": "CHENOIS",
    "fecha": "31/01/2026",
    "torneo": "NLA Suiza",
    "condicion": "VISITANTE",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "2",
    "parciales": [
      "21-25",
      "26-24",
      "25-27",
      "25-23",
      "15-11"
    ]
  },
  {
    "nombre": "JONA",
    "rival": "JONA",
    "fecha": "08/02/2026",
    "torneo": "NLA Suiza",
    "condicion": "LOCAL",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0",
    "parciales": [
      "25-17",
      "25-23",
      "25-21"
    ]
  },
  {
    "nombre": "COLOMBIER",
    "rival": "COLOMBIER",
    "fecha": "14/02/2026",
    "torneo": "NLA Suiza",
    "condicion": "LOCAL",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0",
    "parciales": [
      "25-10",
      "25-22",
      "25-19"
    ]
  },
  {
    "nombre": "COLOMBIER",
    "rival": "COLOMBIER",
    "fecha": "21/02/2026",
    "torneo": "NLA Suiza",
    "condicion": "VISITANTE",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0",
    "parciales": [
      "26-24",
      "25-15",
      "25-22"
    ]
  },
  {
    "nombre": "COLOMBIER",
    "rival": "COLOMBIER",
    "fecha": "25/02/2026",
    "torneo": "NLA Suiza",
    "condicion": "LOCAL",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0",
    "parciales": [
      "25-17",
      "25-15",
      "25-12"
    ]
  },
  {
    "nombre": "CHENOIS",
    "rival": "CHENOIS",
    "fecha": "07/03/2026",
    "torneo": "NLA Suiza",
    "condicion": "LOCAL",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0",
    "parciales": [
      "25-22",
      "25-21",
      "25-23"
    ]
  },
  {
    "nombre": "CHENOIS",
    "rival": "CHENOIS",
    "fecha": "14/03/2026",
    "torneo": "NLA Suiza",
    "condicion": "VISITANTE",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0",
    "parciales": [
      "25-15",
      "25-20",
      "25-20"
    ]
  },
  {
    "nombre": "CHENOIS",
    "rival": "CHENOIS",
    "fecha": "17/03/2026",
    "torneo": "NLA Suiza",
    "condicion": "LOCAL",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "1",
    "parciales": [
      "25-23",
      "25-16",
      "21-25",
      "25-22"
    ]
  },
  {
    "nombre": "AMRISWIL",
    "rival": "AMRISWIL",
    "fecha": "28/03/2026",
    "torneo": "NLA Suiza",
    "condicion": "VISITANTE",
    "resultado": "D",
    "sets_nafels": "1",
    "sets_rival": "3",
    "parciales": [
      "17-25",
      "25-21",
      "18-25",
      "20-25"
    ]
  },
  {
    "nombre": "AMRISWIL",
    "rival": "AMRISWIL",
    "fecha": "04/04/2026",
    "torneo": "NLA Suiza",
    "condicion": "LOCAL",
    "resultado": "D",
    "sets_nafels": "0",
    "sets_rival": "3",
    "parciales": [
      "14-25",
      "22-25",
      "15-25"
    ]
  },
  {
    "nombre": "AMRISWIL",
    "rival": "AMRISWIL",
    "fecha": "09/04/2026",
    "torneo": "NLA Suiza",
    "condicion": "VISITANTE",
    "resultado": "D",
    "sets_nafels": "0",
    "sets_rival": "3",
    "parciales": [
      "21-25",
      "20-25",
      "19-25"
    ]
  },
  {
    "nombre": "AMRISWIL",
    "rival": "AMRISWIL",
    "fecha": "12/04/2026",
    "torneo": "NLA Suiza",
    "condicion": "LOCAL",
    "resultado": "D",
    "sets_nafels": "2",
    "sets_rival": "3",
    "parciales": [
      "25-20",
      "18-25",
      "17-25",
      "33-31",
      "12-15"
    ]
  }
];
