// datos_partidos.js — 04/06/2026 11:00
const PARTIDOS_GENERADO = "04/06/2026 11:00";
const PARTIDOS_TOTAL = 26;
const PARTIDOS_META = [
  {
    "nombre": "Lausanne",
    "rival": "Lausanne",
    "fecha": "19/10/2025",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "1"
  },
  {
    "nombre": "St Gallen",
    "rival": "St Gallen",
    "fecha": "25/10/2025",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0"
  },
  {
    "nombre": "Colombier",
    "rival": "Colombier",
    "fecha": "01/11/2025",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0"
  },
  {
    "nombre": "Jona",
    "rival": "Jona",
    "fecha": "05/11/2025",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "1"
  },
  {
    "nombre": "Amriswil",
    "rival": "Amriswil",
    "fecha": "08/11/2025",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "D",
    "sets_nafels": "0",
    "sets_rival": "3"
  },
  {
    "nombre": "Schonenwerd",
    "rival": "Schonenwerd",
    "fecha": "15/11/2025",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "1"
  },
  {
    "nombre": "Chenois",
    "rival": "Chenois",
    "fecha": "22/11/2025",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0"
  },
  {
    "nombre": "Jona",
    "rival": "Jona",
    "fecha": "29/11/2025",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "2"
  },
  {
    "nombre": "Lausanne",
    "rival": "Lausanne",
    "fecha": "07/12/2025",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "2"
  },
  {
    "nombre": "St Gallen",
    "rival": "St Gallen",
    "fecha": "13/12/2025",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0"
  },
  {
    "nombre": "Colombier",
    "rival": "Colombier",
    "fecha": "20/12/2025",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "1"
  },
  {
    "nombre": "Amriswil",
    "rival": "Amriswil",
    "fecha": "03/01/2026",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "1"
  },
  {
    "nombre": "Sursee",
    "rival": "Sursee",
    "fecha": "11/01/2026",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0"
  },
  {
    "nombre": "Schonenwerd",
    "rival": "Schonenwerd",
    "fecha": "17/01/2026",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "D",
    "sets_nafels": "1",
    "sets_rival": "3"
  },
  {
    "nombre": "Chenois",
    "rival": "Chenois",
    "fecha": "31/01/2026",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "2"
  },
  {
    "nombre": "Jona",
    "rival": "Jona",
    "fecha": "08/02/2026",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0"
  },
  {
    "nombre": "Colombier",
    "rival": "Colombier",
    "fecha": "14/02/2026",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0"
  },
  {
    "nombre": "Colombier",
    "rival": "Colombier",
    "fecha": "21/02/2026",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0"
  },
  {
    "nombre": "Colombier",
    "rival": "Colombier",
    "fecha": "25/02/2026",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0"
  },
  {
    "nombre": "Chenois",
    "rival": "Chenois",
    "fecha": "07/03/2026",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0"
  },
  {
    "nombre": "Chenois",
    "rival": "Chenois",
    "fecha": "14/03/2026",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "0"
  },
  {
    "nombre": "Chenois",
    "rival": "Chenois",
    "fecha": "17/03/2026",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "1"
  },
  {
    "nombre": "Amriswil",
    "rival": "Amriswil",
    "fecha": "28/03/2026",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "D",
    "sets_nafels": "1",
    "sets_rival": "3"
  },
  {
    "nombre": "Amriswil",
    "rival": "Amriswil",
    "fecha": "04/04/2026",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "D",
    "sets_nafels": "0",
    "sets_rival": "3"
  },
  {
    "nombre": "Amriswil",
    "rival": "Amriswil",
    "fecha": "09/04/2026",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "D",
    "sets_nafels": "0",
    "sets_rival": "3"
  },
  {
    "nombre": "Amriswil",
    "rival": "Amriswil",
    "fecha": "12/04/2026",
    "torneo": "NLA Suiza 2025/26",
    "resultado": "D",
    "sets_nafels": "2",
    "sets_rival": "3"
  }
];
const PARTIDOS_JUGADORES = [
  {
    "num": 1,
    "nombre": "1 Deecke",
    "pos": "ARMADOR",
    "color": "#f59e0b",
    "info": {},
    "ataques": [
      {
        "cod": "PP",
        "orig": 3,
        "destinos": [
          {
            "z": 6,
            "pct": 25
          },
          {
            "z": 8,
            "pct": 25
          },
          {
            "z": 9,
            "pct": 25
          },
          {
            "z": 5,
            "pct": 25
          }
        ],
        "tot": 4,
        "eff": 25,
        "pts": 1,
        "pts_pct": 25,
        "err": 0,
        "slash": 0,
        "pos": 1,
        "exc": 0,
        "minus": 2
      }
    ],
    "saques": [
      {
        "cod": "SM",
        "orig": 1,
        "destinos": [
          {
            "z": 6,
            "pct": 37
          },
          {
            "z": 8,
            "pct": 23
          },
          {
            "z": 7,
            "pct": 20
          },
          {
            "z": 9,
            "pct": 9
          },
          {
            "z": 1,
            "pct": 6
          },
          {
            "z": 5,
            "pct": 3
          },
          {
            "z": 2,
            "pct": 3
          }
        ],
        "tot": 35,
        "eff": 11,
        "pts": 1,
        "pts_pct": 3,
        "err": 0,
        "slash": 3,
        "pos": 6,
        "exc": 7,
        "minus": 18
      }
    ],
    "recepciones": []
  },
  {
    "num": 3,
    "nombre": "3 Schwitter",
    "pos": "OPUESTO",
    "color": "#818cf8",
    "info": {},
    "ataques": [
      {
        "cod": "X6",
        "orig": 2,
        "destinos": [
          {
            "z": 5,
            "pct": 75
          },
          {
            "z": 7,
            "pct": 25
          }
        ],
        "tot": 4,
        "eff": 25,
        "pts": 1,
        "pts_pct": 25,
        "err": 0,
        "slash": 0,
        "pos": 2,
        "exc": 0,
        "minus": 1
      },
      {
        "cod": "X8",
        "orig": 9,
        "destinos": [
          {
            "z": 7,
            "pct": 100
          }
        ],
        "tot": 2,
        "eff": -50,
        "pts": 0,
        "pts_pct": 0,
        "err": 0,
        "slash": 1,
        "pos": 0,
        "exc": 0,
        "minus": 1
      }
    ],
    "saques": [
      {
        "cod": "SM",
        "orig": 1,
        "destinos": [
          {
            "z": 9,
            "pct": 50
          },
          {
            "z": 7,
            "pct": 50
          }
        ],
        "tot": 4,
        "eff": 6,
        "pts": 0,
        "pts_pct": 0,
        "err": 0,
        "slash": 0,
        "pos": 1,
        "exc": 1,
        "minus": 2
      }
    ],
    "recepciones": []
  },
  {
    "num": 4,
    "nombre": "4 Vazquez",
    "pos": "ARMADOR",
    "color": "#f59e0b",
    "info": {},
    "ataques": [
      {
        "cod": "PP",
        "orig": 3,
        "destinos": [
          {
            "z": 6,
            "pct": 29
          },
          {
            "z": 4,
            "pct": 23
          },
          {
            "z": 3,
            "pct": 15
          },
          {
            "z": 8,
            "pct": 6
          },
          {
            "z": 7,
            "pct": 6
          },
          {
            "z": 9,
            "pct": 6
          },
          {
            "z": 5,
            "pct": 6
          },
          {
            "z": 1,
            "pct": 4
          },
          {
            "z": 2,
            "pct": 4
          }
        ],
        "tot": 50,
        "eff": 26,
        "pts": 19,
        "pts_pct": 38,
        "err": 1,
        "slash": 5,
        "pos": 4,
        "exc": 0,
        "minus": 21
      },
      {
        "cod": "V6",
        "orig": 2,
        "destinos": [
          {
            "z": 5,
            "pct": 43
          },
          {
            "z": 3,
            "pct": 29
          },
          {
            "z": 7,
            "pct": 29
          }
        ],
        "tot": 7,
        "eff": 43,
        "pts": 3,
        "pts_pct": 43,
        "err": 0,
        "slash": 0,
        "pos": 0,
        "exc": 0,
        "minus": 4
      },
      {
        "cod": "PR",
        "orig": 3,
        "destinos": [
          {
            "z": 8,
            "pct": 50
          },
          {
            "z": 2,
            "pct": 50
          }
        ],
        "tot": 2,
        "eff": -50,
        "pts": 0,
        "pts_pct": 0,
        "err": 0,
        "slash": 1,
        "pos": 0,
        "exc": 0,
        "minus": 1
      }
    ],
    "saques": [
      {
        "cod": "SM",
        "orig": 7,
        "destinos": [
          {
            "z": 7,
            "pct": 24
          },
          {
            "z": 9,
            "pct": 19
          },
          {
            "z": 6,
            "pct": 17
          },
          {
            "z": 8,
            "pct": 15
          },
          {
            "z": 5,
            "pct": 11
          },
          {
            "z": 1,
            "pct": 11
          },
          {
            "z": 3,
            "pct": 2
          },
          {
            "z": 2,
            "pct": 1
          },
          {
            "z": 4,
            "pct": 1
          }
        ],
        "tot": 415,
        "eff": 4,
        "pts": 15,
        "pts_pct": 4,
        "err": 15,
        "slash": 8,
        "pos": 49,
        "exc": 82,
        "minus": 246
      },
      {
        "cod": "SQ",
        "orig": 5,
        "destinos": [
          {
            "z": 6,
            "pct": 32
          },
          {
            "z": 9,
            "pct": 20
          },
          {
            "z": 7,
            "pct": 20
          },
          {
            "z": 1,
            "pct": 16
          },
          {
            "z": 5,
            "pct": 8
          },
          {
            "z": 8,
            "pct": 4
          }
        ],
        "tot": 25,
        "eff": 12,
        "pts": 2,
        "pts_pct": 8,
        "err": 0,
        "slash": 0,
        "pos": 4,
        "exc": 6,
        "minus": 13
      }
    ],
    "recepciones": [
      {
        "cod": "RM",
        "orig": 5,
        "destinos": [
          {
            "z": 9,
            "pct": 33
          },
          {
            "z": 3,
            "pct": 33
          },
          {
            "z": 2,
            "pct": 33
          }
        ],
        "tot": 3,
        "eff": -17,
        "pts": 0,
        "pts_pct": 0,
        "err": 1,
        "slash": 0,
        "pos": 1,
        "exc": 0,
        "minus": 1
      },
      {
        "cod": "RQ",
        "orig": 6,
        "destinos": [
          {
            "z": 8,
            "pct": 50
          },
          {
            "z": 4,
            "pct": 50
          }
        ],
        "tot": 2,
        "eff": -50,
        "pts": 0,
        "pts_pct": 0,
        "err": 1,
        "slash": 0,
        "pos": 0,
        "exc": 1,
        "minus": 0
      }
    ]
  },
  {
    "num": 5,
    "nombre": "5 Hesselholt",
    "pos": "CENTRAL",
    "color": "#f97316",
    "info": {},
    "ataques": [
      {
        "cod": "X7",
        "orig": 3,
        "destinos": [
          {
            "z": 9,
            "pct": 42
          },
          {
            "z": 8,
            "pct": 29
          },
          {
            "z": 1,
            "pct": 8
          },
          {
            "z": 6,
            "pct": 7
          },
          {
            "z": 7,
            "pct": 4
          },
          {
            "z": 2,
            "pct": 3
          },
          {
            "z": 4,
            "pct": 3
          },
          {
            "z": 3,
            "pct": 2
          },
          {
            "z": 5,
            "pct": 2
          }
        ],
        "tot": 100,
        "eff": 30,
        "pts": 45,
        "pts_pct": 45,
        "err": 8,
        "slash": 7,
        "pos": 17,
        "exc": 2,
        "minus": 21
      },
      {
        "cod": "X1",
        "orig": 3,
        "destinos": [
          {
            "z": 8,
            "pct": 47
          },
          {
            "z": 7,
            "pct": 20
          },
          {
            "z": 1,
            "pct": 10
          },
          {
            "z": 6,
            "pct": 10
          },
          {
            "z": 9,
            "pct": 6
          },
          {
            "z": 3,
            "pct": 6
          },
          {
            "z": 4,
            "pct": 2
          }
        ],
        "tot": 52,
        "eff": 48,
        "pts": 32,
        "pts_pct": 62,
        "err": 3,
        "slash": 4,
        "pos": 2,
        "exc": 1,
        "minus": 10
      },
      {
        "cod": "XM",
        "orig": 3,
        "destinos": [
          {
            "z": 9,
            "pct": 52
          },
          {
            "z": 8,
            "pct": 24
          },
          {
            "z": 3,
            "pct": 14
          },
          {
            "z": 7,
            "pct": 7
          },
          {
            "z": 6,
            "pct": 3
          }
        ],
        "tot": 29,
        "eff": 52,
        "pts": 17,
        "pts_pct": 59,
        "err": 1,
        "slash": 1,
        "pos": 5,
        "exc": 0,
        "minus": 5
      },
      {
        "cod": "X2",
        "orig": 3,
        "destinos": [
          {
            "z": 9,
            "pct": 33
          },
          {
            "z": 1,
            "pct": 33
          },
          {
            "z": 7,
            "pct": 17
          },
          {
            "z": 8,
            "pct": 17
          }
        ],
        "tot": 6,
        "eff": 17,
        "pts": 2,
        "pts_pct": 33,
        "err": 1,
        "slash": 0,
        "pos": 0,
        "exc": 0,
        "minus": 3
      },
      {
        "cod": "X5",
        "orig": 4,
        "destinos": [
          {
            "z": 9,
            "pct": 50
          },
          {
            "z": 8,
            "pct": 25
          },
          {
            "z": 5,
            "pct": 25
          }
        ],
        "tot": 4,
        "eff": 50,
        "pts": 2,
        "pts_pct": 50,
        "err": 0,
        "slash": 0,
        "pos": 0,
        "exc": 0,
        "minus": 2
      },
      {
        "cod": "X9",
        "orig": 4,
        "destinos": [
          {
            "z": 6,
            "pct": 50
          },
          {
            "z": 1,
            "pct": 25
          },
          {
            "z": 7,
            "pct": 25
          }
        ],
        "tot": 4,
        "eff": 0,
        "pts": 1,
        "pts_pct": 25,
        "err": 0,
        "slash": 1,
        "pos": 1,
        "exc": 0,
        "minus": 1
      },
      {
        "cod": "X3",
        "orig": 2,
        "destinos": [
          {
            "z": 5,
            "pct": 67
          },
          {
            "z": 1,
            "pct": 33
          }
        ],
        "tot": 3,
        "eff": 33,
        "pts": 1,
        "pts_pct": 33,
        "err": 0,
        "slash": 0,
        "pos": 2,
        "exc": 0,
        "minus": 0
      }
    ],
    "saques": [
      {
        "cod": "SM",
        "orig": 1,
        "destinos": [
          {
            "z": 9,
            "pct": 25
          },
          {
            "z": 6,
            "pct": 19
          },
          {
            "z": 1,
            "pct": 15
          },
          {
            "z": 8,
            "pct": 15
          },
          {
            "z": 7,
            "pct": 10
          },
          {
            "z": 5,
            "pct": 7
          },
          {
            "z": 3,
            "pct": 5
          },
          {
            "z": 4,
            "pct": 4
          },
          {
            "z": 2,
            "pct": 1
          }
        ],
        "tot": 236,
        "eff": -7,
        "pts": 3,
        "pts_pct": 1,
        "err": 34,
        "slash": 12,
        "pos": 38,
        "exc": 57,
        "minus": 92
      }
    ],
    "recepciones": [
      {
        "cod": "RQ",
        "orig": 6,
        "destinos": [
          {
            "z": 7,
            "pct": 40
          },
          {
            "z": 9,
            "pct": 27
          },
          {
            "z": 4,
            "pct": 20
          },
          {
            "z": 8,
            "pct": 13
          }
        ],
        "tot": 15,
        "eff": 30,
        "pts": 4,
        "pts_pct": 27,
        "err": 2,
        "slash": 0,
        "pos": 5,
        "exc": 2,
        "minus": 2
      },
      {
        "cod": "RM",
        "orig": 6,
        "destinos": [
          {
            "z": 4,
            "pct": 33
          },
          {
            "z": 3,
            "pct": 17
          },
          {
            "z": 9,
            "pct": 17
          },
          {
            "z": 7,
            "pct": 17
          },
          {
            "z": 8,
            "pct": 8
          },
          {
            "z": 5,
            "pct": 8
          }
        ],
        "tot": 12,
        "eff": 38,
        "pts": 2,
        "pts_pct": 17,
        "err": 0,
        "slash": 0,
        "pos": 5,
        "exc": 3,
        "minus": 2
      }
    ],
    "recepcion": {
      "flotado": {
        "desde_z1": {
          "p1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p5": {
            "tot": 1,
            "eff": 50,
            "pos": 1,
            "neg": 0,
            "err": 0,
            "perf": 0
          }
        },
        "desde_z6": {
          "p1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p5": {
            "tot": 3,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          }
        },
        "desde_z5": {
          "p1": {
            "tot": 2,
            "eff": 100,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 2
          },
          "p6": {
            "tot": 2,
            "eff": 50,
            "pos": 2,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p5": {
            "tot": 3,
            "eff": 33,
            "pos": 2,
            "neg": 0,
            "err": 0,
            "perf": 0
          }
        }
      },
      "potencia": {
        "desde_z1": {
          "p1": {
            "tot": 2,
            "eff": 50,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 1
          },
          "p6": {
            "tot": 1,
            "eff": 50,
            "pos": 1,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p5": {
            "tot": 6,
            "eff": -17,
            "pos": 0,
            "neg": 0,
            "err": 2,
            "perf": 1
          }
        },
        "desde_z6": {
          "p1": {
            "tot": 2,
            "eff": 75,
            "pos": 1,
            "neg": 0,
            "err": 0,
            "perf": 1
          },
          "p6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p5": {
            "tot": 1,
            "eff": 100,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 1
          }
        },
        "desde_z5": {
          "p1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 1,
            "eff": 50,
            "pos": 1,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p5": {
            "tot": 2,
            "eff": 50,
            "pos": 2,
            "neg": 0,
            "err": 0,
            "perf": 0
          }
        }
      }
    }
  },
  {
    "num": 6,
    "nombre": "6 Denis Cabanas",
    "pos": "OPUESTO",
    "color": "#818cf8",
    "info": {},
    "ataques": [
      {
        "cod": "X8",
        "orig": 9,
        "destinos": [
          {
            "z": 7,
            "pct": 36
          },
          {
            "z": 1,
            "pct": 16
          },
          {
            "z": 5,
            "pct": 13
          },
          {
            "z": 9,
            "pct": 13
          },
          {
            "z": 8,
            "pct": 9
          },
          {
            "z": 6,
            "pct": 9
          },
          {
            "z": 4,
            "pct": 2
          },
          {
            "z": 3,
            "pct": 1
          },
          {
            "z": 2,
            "pct": 1
          }
        ],
        "tot": 302,
        "eff": 38,
        "pts": 164,
        "pts_pct": 54,
        "err": 33,
        "slash": 17,
        "pos": 28,
        "exc": 0,
        "minus": 60
      },
      {
        "cod": "X6",
        "orig": 2,
        "destinos": [
          {
            "z": 5,
            "pct": 37
          },
          {
            "z": 6,
            "pct": 18
          },
          {
            "z": 9,
            "pct": 14
          },
          {
            "z": 1,
            "pct": 12
          },
          {
            "z": 7,
            "pct": 7
          },
          {
            "z": 8,
            "pct": 5
          },
          {
            "z": 4,
            "pct": 4
          },
          {
            "z": 3,
            "pct": 2
          },
          {
            "z": 2,
            "pct": 1
          }
        ],
        "tot": 269,
        "eff": 38,
        "pts": 146,
        "pts_pct": 54,
        "err": 24,
        "slash": 21,
        "pos": 24,
        "exc": 1,
        "minus": 53
      },
      {
        "cod": "V6",
        "orig": 2,
        "destinos": [
          {
            "z": 5,
            "pct": 39
          },
          {
            "z": 6,
            "pct": 13
          },
          {
            "z": 8,
            "pct": 13
          },
          {
            "z": 9,
            "pct": 13
          },
          {
            "z": 1,
            "pct": 7
          },
          {
            "z": 7,
            "pct": 6
          },
          {
            "z": 2,
            "pct": 4
          },
          {
            "z": 3,
            "pct": 3
          },
          {
            "z": 4,
            "pct": 2
          }
        ],
        "tot": 163,
        "eff": 25,
        "pts": 66,
        "pts_pct": 40,
        "err": 12,
        "slash": 13,
        "pos": 23,
        "exc": 0,
        "minus": 49
      },
      {
        "cod": "X5",
        "orig": 4,
        "destinos": [
          {
            "z": 1,
            "pct": 35
          },
          {
            "z": 6,
            "pct": 27
          },
          {
            "z": 9,
            "pct": 9
          },
          {
            "z": 5,
            "pct": 8
          },
          {
            "z": 8,
            "pct": 7
          },
          {
            "z": 7,
            "pct": 6
          },
          {
            "z": 2,
            "pct": 5
          },
          {
            "z": 4,
            "pct": 3
          }
        ],
        "tot": 130,
        "eff": 54,
        "pts": 81,
        "pts_pct": 62,
        "err": 4,
        "slash": 7,
        "pos": 12,
        "exc": 0,
        "minus": 26
      },
      {
        "cod": "V8",
        "orig": 9,
        "destinos": [
          {
            "z": 7,
            "pct": 38
          },
          {
            "z": 9,
            "pct": 15
          },
          {
            "z": 8,
            "pct": 13
          },
          {
            "z": 5,
            "pct": 9
          },
          {
            "z": 1,
            "pct": 8
          },
          {
            "z": 2,
            "pct": 6
          },
          {
            "z": 6,
            "pct": 6
          },
          {
            "z": 3,
            "pct": 4
          },
          {
            "z": 4,
            "pct": 1
          }
        ],
        "tot": 108,
        "eff": 19,
        "pts": 47,
        "pts_pct": 44,
        "err": 16,
        "slash": 11,
        "pos": 7,
        "exc": 0,
        "minus": 27
      },
      {
        "cod": "V5",
        "orig": 4,
        "destinos": [
          {
            "z": 1,
            "pct": 43
          },
          {
            "z": 6,
            "pct": 19
          },
          {
            "z": 5,
            "pct": 13
          },
          {
            "z": 2,
            "pct": 6
          },
          {
            "z": 9,
            "pct": 6
          },
          {
            "z": 8,
            "pct": 6
          },
          {
            "z": 7,
            "pct": 2
          },
          {
            "z": 4,
            "pct": 2
          },
          {
            "z": 3,
            "pct": 2
          }
        ],
        "tot": 47,
        "eff": 32,
        "pts": 20,
        "pts_pct": 43,
        "err": 4,
        "slash": 1,
        "pos": 7,
        "exc": 0,
        "minus": 15
      },
      {
        "cod": "X4",
        "orig": 4,
        "destinos": [
          {
            "z": 6,
            "pct": 30
          },
          {
            "z": 8,
            "pct": 30
          },
          {
            "z": 1,
            "pct": 10
          },
          {
            "z": 9,
            "pct": 10
          },
          {
            "z": 5,
            "pct": 10
          },
          {
            "z": 7,
            "pct": 10
          }
        ],
        "tot": 10,
        "eff": 40,
        "pts": 6,
        "pts_pct": 60,
        "err": 1,
        "slash": 1,
        "pos": 0,
        "exc": 0,
        "minus": 2
      },
      {
        "cod": "VB",
        "orig": 8,
        "destinos": [
          {
            "z": 9,
            "pct": 33
          },
          {
            "z": 6,
            "pct": 33
          },
          {
            "z": 1,
            "pct": 33
          }
        ],
        "tot": 3,
        "eff": -33,
        "pts": 0,
        "pts_pct": 0,
        "err": 1,
        "slash": 0,
        "pos": 0,
        "exc": 0,
        "minus": 2
      }
    ],
    "saques": [
      {
        "cod": "SQ",
        "orig": 9,
        "destinos": [
          {
            "z": 6,
            "pct": 34
          },
          {
            "z": 1,
            "pct": 20
          },
          {
            "z": 5,
            "pct": 16
          },
          {
            "z": 3,
            "pct": 8
          },
          {
            "z": 7,
            "pct": 6
          },
          {
            "z": 9,
            "pct": 5
          },
          {
            "z": 8,
            "pct": 5
          },
          {
            "z": 2,
            "pct": 4
          },
          {
            "z": 4,
            "pct": 1
          }
        ],
        "tot": 260,
        "eff": -16,
        "pts": 22,
        "pts_pct": 8,
        "err": 81,
        "slash": 13,
        "pos": 42,
        "exc": 41,
        "minus": 61
      },
      {
        "cod": "SM",
        "orig": 7,
        "destinos": [
          {
            "z": 7,
            "pct": 34
          },
          {
            "z": 1,
            "pct": 22
          },
          {
            "z": 6,
            "pct": 22
          },
          {
            "z": 5,
            "pct": 10
          },
          {
            "z": 9,
            "pct": 6
          },
          {
            "z": 3,
            "pct": 3
          },
          {
            "z": 4,
            "pct": 1
          },
          {
            "z": 8,
            "pct": 1
          }
        ],
        "tot": 86,
        "eff": 8,
        "pts": 8,
        "pts_pct": 9,
        "err": 7,
        "slash": 5,
        "pos": 15,
        "exc": 13,
        "minus": 38
      },
      {
        "cod": "SO",
        "orig": 9,
        "destinos": [
          {
            "z": 6,
            "pct": 50
          },
          {
            "z": 5,
            "pct": 33
          },
          {
            "z": 1,
            "pct": 17
          }
        ],
        "tot": 6,
        "eff": 12,
        "pts": 2,
        "pts_pct": 33,
        "err": 2,
        "slash": 1,
        "pos": 1,
        "exc": 0,
        "minus": 0
      }
    ],
    "recepciones": [
      {
        "cod": "RQ",
        "orig": 1,
        "destinos": [
          {
            "z": 1,
            "pct": 57
          },
          {
            "z": 7,
            "pct": 29
          },
          {
            "z": 9,
            "pct": 14
          }
        ],
        "tot": 7,
        "eff": 21,
        "pts": 1,
        "pts_pct": 14,
        "err": 1,
        "slash": 0,
        "pos": 3,
        "exc": 0,
        "minus": 2
      },
      {
        "cod": "RM",
        "orig": 5,
        "destinos": [
          {
            "z": 2,
            "pct": 33
          },
          {
            "z": 9,
            "pct": 33
          },
          {
            "z": 1,
            "pct": 33
          }
        ],
        "tot": 6,
        "eff": -25,
        "pts": 0,
        "pts_pct": 0,
        "err": 2,
        "slash": 1,
        "pos": 2,
        "exc": 1,
        "minus": 0
      }
    ]
  },
  {
    "num": 7,
    "nombre": "7 Schmid",
    "pos": "CENTRAL",
    "color": "#f97316",
    "info": {},
    "ataques": [
      {
        "cod": "X1",
        "orig": 3,
        "destinos": [
          {
            "z": 8,
            "pct": 47
          },
          {
            "z": 7,
            "pct": 20
          },
          {
            "z": 4,
            "pct": 7
          },
          {
            "z": 6,
            "pct": 7
          },
          {
            "z": 9,
            "pct": 7
          },
          {
            "z": 5,
            "pct": 7
          },
          {
            "z": 1,
            "pct": 7
          }
        ],
        "tot": 15,
        "eff": 40,
        "pts": 6,
        "pts_pct": 40,
        "err": 0,
        "slash": 0,
        "pos": 2,
        "exc": 0,
        "minus": 7
      },
      {
        "cod": "X7",
        "orig": 3,
        "destinos": [
          {
            "z": 5,
            "pct": 33
          },
          {
            "z": 8,
            "pct": 33
          },
          {
            "z": 1,
            "pct": 33
          }
        ],
        "tot": 3,
        "eff": -33,
        "pts": 0,
        "pts_pct": 0,
        "err": 1,
        "slash": 0,
        "pos": 0,
        "exc": 0,
        "minus": 2
      }
    ],
    "saques": [
      {
        "cod": "SM",
        "orig": 5,
        "destinos": [
          {
            "z": 6,
            "pct": 20
          },
          {
            "z": 5,
            "pct": 18
          },
          {
            "z": 1,
            "pct": 16
          },
          {
            "z": 7,
            "pct": 13
          },
          {
            "z": 8,
            "pct": 11
          },
          {
            "z": 3,
            "pct": 10
          },
          {
            "z": 9,
            "pct": 7
          },
          {
            "z": 2,
            "pct": 3
          },
          {
            "z": 4,
            "pct": 1
          }
        ],
        "tot": 87,
        "eff": -12,
        "pts": 6,
        "pts_pct": 7,
        "err": 21,
        "slash": 4,
        "pos": 9,
        "exc": 13,
        "minus": 34
      },
      {
        "cod": "SQ",
        "orig": 5,
        "destinos": [
          {
            "z": 3,
            "pct": 40
          },
          {
            "z": 6,
            "pct": 20
          },
          {
            "z": 8,
            "pct": 20
          },
          {
            "z": 5,
            "pct": 20
          }
        ],
        "tot": 5,
        "eff": -35,
        "pts": 0,
        "pts_pct": 0,
        "err": 2,
        "slash": 0,
        "pos": 1,
        "exc": 0,
        "minus": 2
      }
    ],
    "recepciones": [
      {
        "cod": "RQ",
        "orig": 1,
        "destinos": [
          {
            "z": 4,
            "pct": 50
          },
          {
            "z": 8,
            "pct": 50
          }
        ],
        "tot": 2,
        "eff": 25,
        "pts": 0,
        "pts_pct": 0,
        "err": 0,
        "slash": 0,
        "pos": 1,
        "exc": 0,
        "minus": 1
      }
    ]
  },
  {
    "num": 8,
    "nombre": "8 Peter",
    "pos": "LIBERO",
    "color": "#06b6d4",
    "info": {},
    "ataques": [],
    "saques": [],
    "recepciones": [
      {
        "cod": "RQ",
        "orig": 5,
        "destinos": [
          {
            "z": 6,
            "pct": 58
          },
          {
            "z": 1,
            "pct": 17
          },
          {
            "z": 8,
            "pct": 12
          },
          {
            "z": 5,
            "pct": 7
          },
          {
            "z": 9,
            "pct": 4
          },
          {
            "z": 7,
            "pct": 1
          }
        ],
        "tot": 261,
        "eff": 20,
        "pts": 44,
        "pts_pct": 17,
        "err": 32,
        "slash": 7,
        "pos": 87,
        "exc": 48,
        "minus": 43
      },
      {
        "cod": "RM",
        "orig": 5,
        "destinos": [
          {
            "z": 6,
            "pct": 29
          },
          {
            "z": 8,
            "pct": 21
          },
          {
            "z": 1,
            "pct": 20
          },
          {
            "z": 9,
            "pct": 20
          },
          {
            "z": 5,
            "pct": 6
          },
          {
            "z": 7,
            "pct": 4
          }
        ],
        "tot": 213,
        "eff": 33,
        "pts": 37,
        "pts_pct": 17,
        "err": 7,
        "slash": 5,
        "pos": 86,
        "exc": 41,
        "minus": 37
      },
      {
        "cod": "RO",
        "orig": 5,
        "destinos": [
          {
            "z": 6,
            "pct": 67
          },
          {
            "z": 5,
            "pct": 33
          }
        ],
        "tot": 3,
        "eff": 50,
        "pts": 1,
        "pts_pct": 33,
        "err": 0,
        "slash": 0,
        "pos": 1,
        "exc": 0,
        "minus": 1
      }
    ],
    "recepcion": {
      "flotado": {
        "desde_z1": {
          "p1": {
            "tot": 25,
            "eff": 34,
            "pos": 11,
            "neg": 0,
            "err": 2,
            "perf": 5
          },
          "p6": {
            "tot": 26,
            "eff": 31,
            "pos": 12,
            "neg": 2,
            "err": 0,
            "perf": 3
          },
          "p5": {
            "tot": 9,
            "eff": 0,
            "pos": 3,
            "neg": 1,
            "err": 1,
            "perf": 0
          }
        },
        "desde_z6": {
          "p1": {
            "tot": 2,
            "eff": 25,
            "pos": 1,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 7,
            "eff": 50,
            "pos": 3,
            "neg": 0,
            "err": 0,
            "perf": 2
          },
          "p5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          }
        },
        "desde_z5": {
          "p1": {
            "tot": 57,
            "eff": 25,
            "pos": 18,
            "neg": 1,
            "err": 2,
            "perf": 8
          },
          "p6": {
            "tot": 74,
            "eff": 39,
            "pos": 31,
            "neg": 1,
            "err": 2,
            "perf": 16
          },
          "p5": {
            "tot": 13,
            "eff": 50,
            "pos": 7,
            "neg": 0,
            "err": 0,
            "perf": 3
          }
        }
      },
      "potencia": {
        "desde_z1": {
          "p1": {
            "tot": 42,
            "eff": 1,
            "pos": 10,
            "neg": 3,
            "err": 9,
            "perf": 6
          },
          "p6": {
            "tot": 140,
            "eff": 29,
            "pos": 46,
            "neg": 2,
            "err": 13,
            "perf": 31
          },
          "p5": {
            "tot": 13,
            "eff": 12,
            "pos": 5,
            "neg": 0,
            "err": 3,
            "perf": 2
          }
        },
        "desde_z6": {
          "p1": {
            "tot": 7,
            "eff": -7,
            "pos": 1,
            "neg": 0,
            "err": 1,
            "perf": 0
          },
          "p6": {
            "tot": 19,
            "eff": 13,
            "pos": 6,
            "neg": 1,
            "err": 2,
            "perf": 2
          },
          "p5": {
            "tot": 3,
            "eff": 33,
            "pos": 1,
            "neg": 1,
            "err": 0,
            "perf": 1
          }
        },
        "desde_z5": {
          "p1": {
            "tot": 6,
            "eff": 17,
            "pos": 2,
            "neg": 0,
            "err": 1,
            "perf": 1
          },
          "p6": {
            "tot": 25,
            "eff": 32,
            "pos": 14,
            "neg": 0,
            "err": 1,
            "perf": 2
          },
          "p5": {
            "tot": 6,
            "eff": 17,
            "pos": 2,
            "neg": 0,
            "err": 1,
            "perf": 1
          }
        }
      }
    }
  },
  {
    "num": 9,
    "nombre": "9 Broch",
    "pos": "PUNTA",
    "color": "#22c55e",
    "info": {},
    "ataques": [
      {
        "cod": "X5",
        "orig": 4,
        "destinos": [
          {
            "z": 1,
            "pct": 50
          },
          {
            "z": 6,
            "pct": 14
          },
          {
            "z": 5,
            "pct": 10
          },
          {
            "z": 9,
            "pct": 7
          },
          {
            "z": 7,
            "pct": 6
          },
          {
            "z": 4,
            "pct": 6
          },
          {
            "z": 2,
            "pct": 5
          },
          {
            "z": 8,
            "pct": 2
          }
        ],
        "tot": 177,
        "eff": 19,
        "pts": 71,
        "pts_pct": 40,
        "err": 21,
        "slash": 17,
        "pos": 34,
        "exc": 0,
        "minus": 34
      },
      {
        "cod": "V5",
        "orig": 4,
        "destinos": [
          {
            "z": 1,
            "pct": 48
          },
          {
            "z": 6,
            "pct": 21
          },
          {
            "z": 9,
            "pct": 12
          },
          {
            "z": 7,
            "pct": 7
          },
          {
            "z": 4,
            "pct": 7
          },
          {
            "z": 2,
            "pct": 3
          },
          {
            "z": 8,
            "pct": 1
          },
          {
            "z": 5,
            "pct": 1
          }
        ],
        "tot": 74,
        "eff": 9,
        "pts": 19,
        "pts_pct": 26,
        "err": 5,
        "slash": 7,
        "pos": 14,
        "exc": 0,
        "minus": 29
      },
      {
        "cod": "X9",
        "orig": 4,
        "destinos": [
          {
            "z": 6,
            "pct": 33
          },
          {
            "z": 9,
            "pct": 33
          },
          {
            "z": 1,
            "pct": 33
          }
        ],
        "tot": 3,
        "eff": 33,
        "pts": 1,
        "pts_pct": 33,
        "err": 0,
        "slash": 0,
        "pos": 1,
        "exc": 0,
        "minus": 1
      },
      {
        "cod": "X8",
        "orig": 9,
        "destinos": [
          {
            "z": 5,
            "pct": 50
          },
          {
            "z": 7,
            "pct": 50
          }
        ],
        "tot": 2,
        "eff": 0,
        "pts": 1,
        "pts_pct": 50,
        "err": 0,
        "slash": 1,
        "pos": 0,
        "exc": 0,
        "minus": 0
      },
      {
        "cod": "VP",
        "orig": 8,
        "destinos": [
          {
            "z": 1,
            "pct": 100
          }
        ],
        "tot": 2,
        "eff": 0,
        "pts": 0,
        "pts_pct": 0,
        "err": 0,
        "slash": 0,
        "pos": 0,
        "exc": 0,
        "minus": 2
      }
    ],
    "saques": [
      {
        "cod": "SM",
        "orig": 1,
        "destinos": [
          {
            "z": 7,
            "pct": 23
          },
          {
            "z": 8,
            "pct": 16
          },
          {
            "z": 9,
            "pct": 15
          },
          {
            "z": 5,
            "pct": 14
          },
          {
            "z": 6,
            "pct": 14
          },
          {
            "z": 1,
            "pct": 14
          },
          {
            "z": 3,
            "pct": 2
          },
          {
            "z": 4,
            "pct": 2
          },
          {
            "z": 2,
            "pct": 2
          }
        ],
        "tot": 252,
        "eff": 2,
        "pts": 6,
        "pts_pct": 2,
        "err": 12,
        "slash": 5,
        "pos": 31,
        "exc": 49,
        "minus": 149
      }
    ],
    "recepciones": [
      {
        "cod": "RM",
        "orig": 5,
        "destinos": [
          {
            "z": 5,
            "pct": 40
          },
          {
            "z": 7,
            "pct": 27
          },
          {
            "z": 6,
            "pct": 12
          },
          {
            "z": 1,
            "pct": 8
          },
          {
            "z": 8,
            "pct": 7
          },
          {
            "z": 9,
            "pct": 5
          }
        ],
        "tot": 248,
        "eff": 28,
        "pts": 45,
        "pts_pct": 18,
        "err": 9,
        "slash": 15,
        "pos": 84,
        "exc": 46,
        "minus": 49
      },
      {
        "cod": "RQ",
        "orig": 1,
        "destinos": [
          {
            "z": 5,
            "pct": 39
          },
          {
            "z": 7,
            "pct": 20
          },
          {
            "z": 6,
            "pct": 17
          },
          {
            "z": 1,
            "pct": 15
          },
          {
            "z": 9,
            "pct": 4
          },
          {
            "z": 8,
            "pct": 4
          }
        ],
        "tot": 166,
        "eff": 23,
        "pts": 25,
        "pts_pct": 15,
        "err": 20,
        "slash": 3,
        "pos": 68,
        "exc": 29,
        "minus": 21
      },
      {
        "cod": "RO",
        "orig": 5,
        "destinos": [
          {
            "z": 5,
            "pct": 100
          }
        ],
        "tot": 3,
        "eff": 17,
        "pts": 0,
        "pts_pct": 0,
        "err": 0,
        "slash": 0,
        "pos": 1,
        "exc": 0,
        "minus": 2
      }
    ],
    "recepcion": {
      "flotado": {
        "desde_z1": {
          "p1": {
            "tot": 12,
            "eff": 38,
            "pos": 2,
            "neg": 1,
            "err": 0,
            "perf": 4
          },
          "p6": {
            "tot": 9,
            "eff": 22,
            "pos": 3,
            "neg": 1,
            "err": 0,
            "perf": 1
          },
          "p5": {
            "tot": 41,
            "eff": 38,
            "pos": 15,
            "neg": 2,
            "err": 1,
            "perf": 10
          }
        },
        "desde_z6": {
          "p1": {
            "tot": 5,
            "eff": 60,
            "pos": 2,
            "neg": 0,
            "err": 0,
            "perf": 2
          },
          "p6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p5": {
            "tot": 6,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          }
        },
        "desde_z5": {
          "p1": {
            "tot": 15,
            "eff": -3,
            "pos": 3,
            "neg": 0,
            "err": 2,
            "perf": 0
          },
          "p6": {
            "tot": 40,
            "eff": 30,
            "pos": 12,
            "neg": 4,
            "err": 0,
            "perf": 8
          },
          "p5": {
            "tot": 120,
            "eff": 28,
            "pos": 47,
            "neg": 7,
            "err": 6,
            "perf": 20
          }
        }
      },
      "potencia": {
        "desde_z1": {
          "p1": {
            "tot": 19,
            "eff": 21,
            "pos": 11,
            "neg": 1,
            "err": 2,
            "perf": 1
          },
          "p6": {
            "tot": 24,
            "eff": 31,
            "pos": 9,
            "neg": 0,
            "err": 3,
            "perf": 6
          },
          "p5": {
            "tot": 80,
            "eff": 24,
            "pos": 32,
            "neg": 2,
            "err": 11,
            "perf": 15
          }
        },
        "desde_z6": {
          "p1": {
            "tot": 7,
            "eff": -14,
            "pos": 2,
            "neg": 0,
            "err": 2,
            "perf": 0
          },
          "p6": {
            "tot": 9,
            "eff": 28,
            "pos": 3,
            "neg": 0,
            "err": 0,
            "perf": 1
          },
          "p5": {
            "tot": 8,
            "eff": 6,
            "pos": 3,
            "neg": 0,
            "err": 2,
            "perf": 1
          }
        },
        "desde_z5": {
          "p1": {
            "tot": 6,
            "eff": 33,
            "pos": 4,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 2,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p5": {
            "tot": 14,
            "eff": 25,
            "pos": 5,
            "neg": 0,
            "err": 0,
            "perf": 1
          }
        }
      }
    }
  },
  {
    "num": 10,
    "nombre": "10 Bogdanovski",
    "pos": "PUNTA",
    "color": "#22c55e",
    "info": {},
    "ataques": [
      {
        "cod": "V5",
        "orig": 4,
        "destinos": [
          {
            "z": 6,
            "pct": 38
          },
          {
            "z": 1,
            "pct": 25
          },
          {
            "z": 8,
            "pct": 12
          },
          {
            "z": 9,
            "pct": 12
          },
          {
            "z": 2,
            "pct": 12
          }
        ],
        "tot": 16,
        "eff": 25,
        "pts": 6,
        "pts_pct": 38,
        "err": 0,
        "slash": 2,
        "pos": 2,
        "exc": 0,
        "minus": 6
      },
      {
        "cod": "X5",
        "orig": 4,
        "destinos": [
          {
            "z": 1,
            "pct": 33
          },
          {
            "z": 6,
            "pct": 27
          },
          {
            "z": 7,
            "pct": 13
          },
          {
            "z": 8,
            "pct": 13
          },
          {
            "z": 2,
            "pct": 7
          },
          {
            "z": 9,
            "pct": 7
          }
        ],
        "tot": 15,
        "eff": 33,
        "pts": 7,
        "pts_pct": 47,
        "err": 0,
        "slash": 2,
        "pos": 0,
        "exc": 0,
        "minus": 6
      }
    ],
    "saques": [
      {
        "cod": "SM",
        "orig": 1,
        "destinos": [
          {
            "z": 6,
            "pct": 31
          },
          {
            "z": 7,
            "pct": 26
          },
          {
            "z": 8,
            "pct": 18
          },
          {
            "z": 5,
            "pct": 10
          },
          {
            "z": 1,
            "pct": 10
          },
          {
            "z": 3,
            "pct": 3
          },
          {
            "z": 2,
            "pct": 3
          }
        ],
        "tot": 39,
        "eff": -2,
        "pts": 1,
        "pts_pct": 3,
        "err": 3,
        "slash": 1,
        "pos": 3,
        "exc": 7,
        "minus": 24
      }
    ],
    "recepciones": [
      {
        "cod": "RM",
        "orig": 1,
        "destinos": [
          {
            "z": 5,
            "pct": 36
          },
          {
            "z": 7,
            "pct": 26
          },
          {
            "z": 6,
            "pct": 13
          },
          {
            "z": 1,
            "pct": 11
          },
          {
            "z": 8,
            "pct": 9
          },
          {
            "z": 9,
            "pct": 6
          }
        ],
        "tot": 47,
        "eff": 17,
        "pts": 6,
        "pts_pct": 13,
        "err": 3,
        "slash": 1,
        "pos": 11,
        "exc": 8,
        "minus": 18
      },
      {
        "cod": "RQ",
        "orig": 1,
        "destinos": [
          {
            "z": 5,
            "pct": 40
          },
          {
            "z": 6,
            "pct": 30
          },
          {
            "z": 7,
            "pct": 10
          },
          {
            "z": 9,
            "pct": 10
          },
          {
            "z": 8,
            "pct": 10
          }
        ],
        "tot": 10,
        "eff": -5,
        "pts": 1,
        "pts_pct": 10,
        "err": 1,
        "slash": 1,
        "pos": 0,
        "exc": 5,
        "minus": 2
      }
    ],
    "recepcion": {
      "flotado": {
        "desde_z1": {
          "p1": {
            "tot": 7,
            "eff": 29,
            "pos": 4,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 4,
            "eff": 12,
            "pos": 1,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p5": {
            "tot": 15,
            "eff": 20,
            "pos": 4,
            "neg": 0,
            "err": 1,
            "perf": 2
          }
        },
        "desde_z6": {
          "p1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p5": {
            "tot": 2,
            "eff": 50,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 1
          }
        },
        "desde_z5": {
          "p1": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 6,
            "eff": 8,
            "pos": 1,
            "neg": 0,
            "err": 1,
            "perf": 1
          },
          "p5": {
            "tot": 12,
            "eff": 8,
            "pos": 1,
            "neg": 1,
            "err": 1,
            "perf": 2
          }
        }
      },
      "potencia": {
        "desde_z1": {
          "p1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 4,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 1,
            "perf": 1
          },
          "p5": {
            "tot": 3,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          }
        },
        "desde_z6": {
          "p1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p5": {
            "tot": 1,
            "eff": -50,
            "pos": 0,
            "neg": 1,
            "err": 0,
            "perf": 0
          }
        },
        "desde_z5": {
          "p1": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p5": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          }
        }
      }
    }
  },
  {
    "num": 11,
    "nombre": "11 Bartholet",
    "pos": "PUNTA",
    "color": "#22c55e",
    "info": {},
    "ataques": [
      {
        "cod": "X5",
        "orig": 4,
        "destinos": [
          {
            "z": 1,
            "pct": 38
          },
          {
            "z": 6,
            "pct": 31
          },
          {
            "z": 9,
            "pct": 8
          },
          {
            "z": 7,
            "pct": 7
          },
          {
            "z": 8,
            "pct": 7
          },
          {
            "z": 5,
            "pct": 3
          },
          {
            "z": 2,
            "pct": 3
          },
          {
            "z": 4,
            "pct": 2
          },
          {
            "z": 3,
            "pct": 1
          }
        ],
        "tot": 122,
        "eff": 30,
        "pts": 49,
        "pts_pct": 40,
        "err": 8,
        "slash": 4,
        "pos": 24,
        "exc": 0,
        "minus": 37
      },
      {
        "cod": "V5",
        "orig": 4,
        "destinos": [
          {
            "z": 1,
            "pct": 32
          },
          {
            "z": 6,
            "pct": 29
          },
          {
            "z": 9,
            "pct": 13
          },
          {
            "z": 8,
            "pct": 10
          },
          {
            "z": 2,
            "pct": 6
          },
          {
            "z": 5,
            "pct": 5
          },
          {
            "z": 7,
            "pct": 3
          },
          {
            "z": 3,
            "pct": 3
          }
        ],
        "tot": 63,
        "eff": 10,
        "pts": 14,
        "pts_pct": 22,
        "err": 2,
        "slash": 6,
        "pos": 11,
        "exc": 0,
        "minus": 30
      },
      {
        "cod": "X6",
        "orig": 2,
        "destinos": [
          {
            "z": 6,
            "pct": 50
          },
          {
            "z": 4,
            "pct": 25
          },
          {
            "z": 9,
            "pct": 25
          }
        ],
        "tot": 4,
        "eff": 50,
        "pts": 2,
        "pts_pct": 50,
        "err": 0,
        "slash": 0,
        "pos": 1,
        "exc": 0,
        "minus": 1
      },
      {
        "cod": "XP",
        "orig": 8,
        "destinos": [
          {
            "z": 8,
            "pct": 67
          },
          {
            "z": 7,
            "pct": 33
          }
        ],
        "tot": 3,
        "eff": 67,
        "pts": 2,
        "pts_pct": 67,
        "err": 0,
        "slash": 0,
        "pos": 0,
        "exc": 0,
        "minus": 1
      },
      {
        "cod": "XR",
        "orig": 8,
        "destinos": [
          {
            "z": 8,
            "pct": 67
          },
          {
            "z": 1,
            "pct": 33
          }
        ],
        "tot": 3,
        "eff": -67,
        "pts": 0,
        "pts_pct": 0,
        "err": 0,
        "slash": 2,
        "pos": 0,
        "exc": 0,
        "minus": 1
      },
      {
        "cod": "VB",
        "orig": 8,
        "destinos": [
          {
            "z": 8,
            "pct": 67
          },
          {
            "z": 9,
            "pct": 33
          }
        ],
        "tot": 3,
        "eff": 33,
        "pts": 1,
        "pts_pct": 33,
        "err": 0,
        "slash": 0,
        "pos": 0,
        "exc": 0,
        "minus": 2
      }
    ],
    "saques": [
      {
        "cod": "SQ",
        "orig": 9,
        "destinos": [
          {
            "z": 6,
            "pct": 28
          },
          {
            "z": 7,
            "pct": 23
          },
          {
            "z": 5,
            "pct": 22
          },
          {
            "z": 1,
            "pct": 8
          },
          {
            "z": 3,
            "pct": 7
          },
          {
            "z": 8,
            "pct": 6
          },
          {
            "z": 9,
            "pct": 4
          },
          {
            "z": 4,
            "pct": 2
          },
          {
            "z": 2,
            "pct": 1
          }
        ],
        "tot": 101,
        "eff": -1,
        "pts": 9,
        "pts_pct": 9,
        "err": 16,
        "slash": 2,
        "pos": 18,
        "exc": 5,
        "minus": 51
      },
      {
        "cod": "SM",
        "orig": 9,
        "destinos": [
          {
            "z": 8,
            "pct": 27
          },
          {
            "z": 7,
            "pct": 23
          },
          {
            "z": 5,
            "pct": 18
          },
          {
            "z": 6,
            "pct": 18
          },
          {
            "z": 3,
            "pct": 7
          },
          {
            "z": 4,
            "pct": 5
          },
          {
            "z": 1,
            "pct": 2
          }
        ],
        "tot": 44,
        "eff": 16,
        "pts": 6,
        "pts_pct": 14,
        "err": 3,
        "slash": 5,
        "pos": 6,
        "exc": 5,
        "minus": 19
      }
    ],
    "recepciones": [
      {
        "cod": "RM",
        "orig": 5,
        "destinos": [
          {
            "z": 7,
            "pct": 37
          },
          {
            "z": 5,
            "pct": 20
          },
          {
            "z": 9,
            "pct": 13
          },
          {
            "z": 6,
            "pct": 11
          },
          {
            "z": 8,
            "pct": 11
          },
          {
            "z": 1,
            "pct": 8
          },
          {
            "z": 4,
            "pct": 1
          }
        ],
        "tot": 132,
        "eff": 21,
        "pts": 19,
        "pts_pct": 14,
        "err": 6,
        "slash": 4,
        "pos": 34,
        "exc": 27,
        "minus": 42
      },
      {
        "cod": "RQ",
        "orig": 1,
        "destinos": [
          {
            "z": 5,
            "pct": 38
          },
          {
            "z": 7,
            "pct": 23
          },
          {
            "z": 1,
            "pct": 14
          },
          {
            "z": 6,
            "pct": 10
          },
          {
            "z": 9,
            "pct": 9
          },
          {
            "z": 8,
            "pct": 6
          }
        ],
        "tot": 89,
        "eff": 10,
        "pts": 6,
        "pts_pct": 7,
        "err": 9,
        "slash": 3,
        "pos": 26,
        "exc": 18,
        "minus": 27
      }
    ],
    "recepcion": {
      "flotado": {
        "desde_z1": {
          "p1": {
            "tot": 13,
            "eff": 8,
            "pos": 1,
            "neg": 1,
            "err": 0,
            "perf": 1
          },
          "p6": {
            "tot": 9,
            "eff": 17,
            "pos": 3,
            "neg": 0,
            "err": 1,
            "perf": 1
          },
          "p5": {
            "tot": 24,
            "eff": 33,
            "pos": 6,
            "neg": 0,
            "err": 1,
            "perf": 6
          }
        },
        "desde_z6": {
          "p1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 1,
            "eff": 50,
            "pos": 1,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p5": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          }
        },
        "desde_z5": {
          "p1": {
            "tot": 14,
            "eff": 25,
            "pos": 3,
            "neg": 0,
            "err": 0,
            "perf": 2
          },
          "p6": {
            "tot": 19,
            "eff": 32,
            "pos": 6,
            "neg": 0,
            "err": 1,
            "perf": 4
          },
          "p5": {
            "tot": 51,
            "eff": 15,
            "pos": 14,
            "neg": 3,
            "err": 3,
            "perf": 5
          }
        }
      },
      "potencia": {
        "desde_z1": {
          "p1": {
            "tot": 15,
            "eff": 20,
            "pos": 4,
            "neg": 0,
            "err": 0,
            "perf": 1
          },
          "p6": {
            "tot": 11,
            "eff": 23,
            "pos": 3,
            "neg": 0,
            "err": 1,
            "perf": 2
          },
          "p5": {
            "tot": 35,
            "eff": 3,
            "pos": 12,
            "neg": 2,
            "err": 4,
            "perf": 0
          }
        },
        "desde_z6": {
          "p1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 1,
            "eff": 50,
            "pos": 1,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p5": {
            "tot": 4,
            "eff": 0,
            "pos": 2,
            "neg": 0,
            "err": 1,
            "perf": 0
          }
        },
        "desde_z5": {
          "p1": {
            "tot": 5,
            "eff": 30,
            "pos": 1,
            "neg": 0,
            "err": 0,
            "perf": 1
          },
          "p6": {
            "tot": 2,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p5": {
            "tot": 14,
            "eff": 7,
            "pos": 3,
            "neg": 1,
            "err": 2,
            "perf": 2
          }
        }
      }
    }
  },
  {
    "num": 14,
    "nombre": "14 Figueiredo",
    "pos": "PUNTA",
    "color": "#22c55e",
    "info": {},
    "ataques": [
      {
        "cod": "X5",
        "orig": 4,
        "destinos": [
          {
            "z": 1,
            "pct": 44
          },
          {
            "z": 6,
            "pct": 22
          },
          {
            "z": 7,
            "pct": 10
          },
          {
            "z": 5,
            "pct": 8
          },
          {
            "z": 4,
            "pct": 6
          },
          {
            "z": 9,
            "pct": 4
          },
          {
            "z": 2,
            "pct": 4
          },
          {
            "z": 8,
            "pct": 2
          }
        ],
        "tot": 295,
        "eff": 37,
        "pts": 151,
        "pts_pct": 51,
        "err": 18,
        "slash": 24,
        "pos": 44,
        "exc": 0,
        "minus": 58
      },
      {
        "cod": "V5",
        "orig": 4,
        "destinos": [
          {
            "z": 1,
            "pct": 46
          },
          {
            "z": 6,
            "pct": 17
          },
          {
            "z": 5,
            "pct": 12
          },
          {
            "z": 9,
            "pct": 7
          },
          {
            "z": 7,
            "pct": 6
          },
          {
            "z": 8,
            "pct": 5
          },
          {
            "z": 2,
            "pct": 4
          },
          {
            "z": 3,
            "pct": 2
          },
          {
            "z": 4,
            "pct": 1
          }
        ],
        "tot": 136,
        "eff": 11,
        "pts": 47,
        "pts_pct": 35,
        "err": 12,
        "slash": 20,
        "pos": 20,
        "exc": 0,
        "minus": 37
      },
      {
        "cod": "XP",
        "orig": 8,
        "destinos": [
          {
            "z": 8,
            "pct": 19
          },
          {
            "z": 5,
            "pct": 16
          },
          {
            "z": 6,
            "pct": 14
          },
          {
            "z": 7,
            "pct": 11
          },
          {
            "z": 9,
            "pct": 11
          },
          {
            "z": 1,
            "pct": 10
          },
          {
            "z": 3,
            "pct": 10
          },
          {
            "z": 2,
            "pct": 6
          },
          {
            "z": 4,
            "pct": 3
          }
        ],
        "tot": 63,
        "eff": 46,
        "pts": 39,
        "pts_pct": 62,
        "err": 7,
        "slash": 3,
        "pos": 4,
        "exc": 0,
        "minus": 10
      },
      {
        "cod": "X6",
        "orig": 2,
        "destinos": [
          {
            "z": 5,
            "pct": 33
          },
          {
            "z": 6,
            "pct": 19
          },
          {
            "z": 1,
            "pct": 12
          },
          {
            "z": 9,
            "pct": 9
          },
          {
            "z": 7,
            "pct": 9
          },
          {
            "z": 8,
            "pct": 7
          },
          {
            "z": 2,
            "pct": 5
          },
          {
            "z": 4,
            "pct": 4
          },
          {
            "z": 3,
            "pct": 2
          }
        ],
        "tot": 57,
        "eff": 23,
        "pts": 25,
        "pts_pct": 44,
        "err": 10,
        "slash": 2,
        "pos": 8,
        "exc": 0,
        "minus": 12
      },
      {
        "cod": "XR",
        "orig": 8,
        "destinos": [
          {
            "z": 9,
            "pct": 30
          },
          {
            "z": 6,
            "pct": 22
          },
          {
            "z": 1,
            "pct": 19
          },
          {
            "z": 8,
            "pct": 11
          },
          {
            "z": 7,
            "pct": 7
          },
          {
            "z": 3,
            "pct": 4
          },
          {
            "z": 2,
            "pct": 4
          },
          {
            "z": 4,
            "pct": 4
          }
        ],
        "tot": 27,
        "eff": 48,
        "pts": 16,
        "pts_pct": 59,
        "err": 2,
        "slash": 1,
        "pos": 6,
        "exc": 0,
        "minus": 2
      },
      {
        "cod": "V6",
        "orig": 2,
        "destinos": [
          {
            "z": 5,
            "pct": 35
          },
          {
            "z": 6,
            "pct": 17
          },
          {
            "z": 9,
            "pct": 17
          },
          {
            "z": 1,
            "pct": 13
          },
          {
            "z": 4,
            "pct": 9
          },
          {
            "z": 3,
            "pct": 4
          },
          {
            "z": 8,
            "pct": 4
          }
        ],
        "tot": 23,
        "eff": 13,
        "pts": 9,
        "pts_pct": 39,
        "err": 4,
        "slash": 2,
        "pos": 1,
        "exc": 0,
        "minus": 7
      },
      {
        "cod": "X9",
        "orig": 4,
        "destinos": [
          {
            "z": 6,
            "pct": 25
          },
          {
            "z": 1,
            "pct": 25
          },
          {
            "z": 7,
            "pct": 25
          },
          {
            "z": 8,
            "pct": 25
          }
        ],
        "tot": 4,
        "eff": 25,
        "pts": 2,
        "pts_pct": 50,
        "err": 0,
        "slash": 1,
        "pos": 0,
        "exc": 0,
        "minus": 1
      },
      {
        "cod": "XB",
        "orig": 8,
        "destinos": [
          {
            "z": 3,
            "pct": 25
          },
          {
            "z": 9,
            "pct": 25
          },
          {
            "z": 1,
            "pct": 25
          },
          {
            "z": 5,
            "pct": 25
          }
        ],
        "tot": 4,
        "eff": 50,
        "pts": 2,
        "pts_pct": 50,
        "err": 0,
        "slash": 0,
        "pos": 1,
        "exc": 0,
        "minus": 1
      },
      {
        "cod": "X1",
        "orig": 3,
        "destinos": [
          {
            "z": 8,
            "pct": 33
          },
          {
            "z": 2,
            "pct": 33
          },
          {
            "z": 1,
            "pct": 33
          }
        ],
        "tot": 3,
        "eff": 100,
        "pts": 3,
        "pts_pct": 100,
        "err": 0,
        "slash": 0,
        "pos": 0,
        "exc": 0,
        "minus": 0
      },
      {
        "cod": "VR",
        "orig": 8,
        "destinos": [
          {
            "z": 6,
            "pct": 50
          },
          {
            "z": 5,
            "pct": 50
          }
        ],
        "tot": 2,
        "eff": 0,
        "pts": 0,
        "pts_pct": 0,
        "err": 0,
        "slash": 0,
        "pos": 0,
        "exc": 0,
        "minus": 2
      },
      {
        "cod": "X8",
        "orig": 9,
        "destinos": [
          {
            "z": 6,
            "pct": 50
          },
          {
            "z": 4,
            "pct": 50
          }
        ],
        "tot": 2,
        "eff": 50,
        "pts": 1,
        "pts_pct": 50,
        "err": 0,
        "slash": 0,
        "pos": 0,
        "exc": 0,
        "minus": 1
      },
      {
        "cod": "PR",
        "orig": 3,
        "destinos": [],
        "tot": 2,
        "eff": 100,
        "pts": 2,
        "pts_pct": 100,
        "err": 0,
        "slash": 0,
        "pos": 0,
        "exc": 0,
        "minus": 0
      },
      {
        "cod": "PP",
        "orig": 4,
        "destinos": [
          {
            "z": 5,
            "pct": 50
          },
          {
            "z": 1,
            "pct": 50
          }
        ],
        "tot": 2,
        "eff": 100,
        "pts": 2,
        "pts_pct": 100,
        "err": 0,
        "slash": 0,
        "pos": 0,
        "exc": 0,
        "minus": 0
      }
    ],
    "saques": [
      {
        "cod": "SQ",
        "orig": 7,
        "destinos": [
          {
            "z": 5,
            "pct": 23
          },
          {
            "z": 6,
            "pct": 22
          },
          {
            "z": 7,
            "pct": 16
          },
          {
            "z": 1,
            "pct": 13
          },
          {
            "z": 8,
            "pct": 12
          },
          {
            "z": 3,
            "pct": 4
          },
          {
            "z": 9,
            "pct": 4
          },
          {
            "z": 2,
            "pct": 4
          },
          {
            "z": 4,
            "pct": 3
          }
        ],
        "tot": 394,
        "eff": -5,
        "pts": 26,
        "pts_pct": 7,
        "err": 66,
        "slash": 12,
        "pos": 50,
        "exc": 66,
        "minus": 174
      },
      {
        "cod": "SM",
        "orig": 6,
        "destinos": [
          {
            "z": 5,
            "pct": 33
          },
          {
            "z": 8,
            "pct": 33
          },
          {
            "z": 6,
            "pct": 33
          }
        ],
        "tot": 3,
        "eff": 0,
        "pts": 0,
        "pts_pct": 0,
        "err": 0,
        "slash": 0,
        "pos": 0,
        "exc": 1,
        "minus": 2
      }
    ],
    "recepciones": [
      {
        "cod": "RM",
        "orig": 1,
        "destinos": [
          {
            "z": 7,
            "pct": 25
          },
          {
            "z": 8,
            "pct": 19
          },
          {
            "z": 9,
            "pct": 17
          },
          {
            "z": 6,
            "pct": 16
          },
          {
            "z": 5,
            "pct": 13
          },
          {
            "z": 1,
            "pct": 10
          },
          {
            "z": 3,
            "pct": 1
          }
        ],
        "tot": 261,
        "eff": 42,
        "pts": 66,
        "pts_pct": 25,
        "err": 5,
        "slash": 6,
        "pos": 103,
        "exc": 36,
        "minus": 45
      },
      {
        "cod": "RQ",
        "orig": 6,
        "destinos": [
          {
            "z": 6,
            "pct": 32
          },
          {
            "z": 5,
            "pct": 23
          },
          {
            "z": 7,
            "pct": 16
          },
          {
            "z": 1,
            "pct": 14
          },
          {
            "z": 8,
            "pct": 9
          },
          {
            "z": 9,
            "pct": 7
          }
        ],
        "tot": 258,
        "eff": 22,
        "pts": 37,
        "pts_pct": 14,
        "err": 23,
        "slash": 8,
        "pos": 91,
        "exc": 55,
        "minus": 44
      },
      {
        "cod": "RO",
        "orig": 1,
        "destinos": [
          {
            "z": 6,
            "pct": 100
          }
        ],
        "tot": 3,
        "eff": 33,
        "pts": 1,
        "pts_pct": 33,
        "err": 0,
        "slash": 0,
        "pos": 0,
        "exc": 0,
        "minus": 2
      },
      {
        "cod": "RH",
        "orig": 1,
        "destinos": [
          {
            "z": 6,
            "pct": 50
          },
          {
            "z": 8,
            "pct": 50
          }
        ],
        "tot": 2,
        "eff": 25,
        "pts": 0,
        "pts_pct": 0,
        "err": 0,
        "slash": 0,
        "pos": 1,
        "exc": 0,
        "minus": 1
      }
    ],
    "recepcion": {
      "flotado": {
        "desde_z1": {
          "p1": {
            "tot": 11,
            "eff": 27,
            "pos": 2,
            "neg": 0,
            "err": 0,
            "perf": 2
          },
          "p6": {
            "tot": 30,
            "eff": 43,
            "pos": 8,
            "neg": 0,
            "err": 0,
            "perf": 9
          },
          "p5": {
            "tot": 29,
            "eff": 47,
            "pos": 15,
            "neg": 2,
            "err": 0,
            "perf": 7
          }
        },
        "desde_z6": {
          "p1": {
            "tot": 3,
            "eff": 17,
            "pos": 1,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 4,
            "eff": 100,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 4
          },
          "p5": {
            "tot": 8,
            "eff": 56,
            "pos": 5,
            "neg": 0,
            "err": 0,
            "perf": 2
          }
        },
        "desde_z5": {
          "p1": {
            "tot": 55,
            "eff": 39,
            "pos": 21,
            "neg": 2,
            "err": 2,
            "perf": 14
          },
          "p6": {
            "tot": 59,
            "eff": 37,
            "pos": 26,
            "neg": 2,
            "err": 1,
            "perf": 11
          },
          "p5": {
            "tot": 60,
            "eff": 47,
            "pos": 24,
            "neg": 0,
            "err": 1,
            "perf": 17
          }
        }
      },
      "potencia": {
        "desde_z1": {
          "p1": {
            "tot": 28,
            "eff": 7,
            "pos": 12,
            "neg": 0,
            "err": 5,
            "perf": 1
          },
          "p6": {
            "tot": 72,
            "eff": 23,
            "pos": 29,
            "neg": 4,
            "err": 4,
            "perf": 8
          },
          "p5": {
            "tot": 70,
            "eff": 23,
            "pos": 26,
            "neg": 0,
            "err": 9,
            "perf": 12
          }
        },
        "desde_z6": {
          "p1": {
            "tot": 14,
            "eff": 0,
            "pos": 3,
            "neg": 1,
            "err": 1,
            "perf": 0
          },
          "p6": {
            "tot": 20,
            "eff": 5,
            "pos": 5,
            "neg": 1,
            "err": 3,
            "perf": 2
          },
          "p5": {
            "tot": 16,
            "eff": 38,
            "pos": 4,
            "neg": 0,
            "err": 0,
            "perf": 4
          }
        },
        "desde_z5": {
          "p1": {
            "tot": 11,
            "eff": 41,
            "pos": 2,
            "neg": 1,
            "err": 0,
            "perf": 4
          },
          "p6": {
            "tot": 19,
            "eff": 50,
            "pos": 9,
            "neg": 0,
            "err": 0,
            "perf": 5
          },
          "p5": {
            "tot": 13,
            "eff": 12,
            "pos": 2,
            "neg": 1,
            "err": 1,
            "perf": 2
          }
        }
      }
    }
  },
  {
    "num": 15,
    "nombre": "15 Nikolov",
    "pos": "CENTRAL",
    "color": "#f97316",
    "info": {},
    "ataques": [
      {
        "cod": "X1",
        "orig": 3,
        "destinos": [
          {
            "z": 8,
            "pct": 30
          },
          {
            "z": 7,
            "pct": 26
          },
          {
            "z": 5,
            "pct": 14
          },
          {
            "z": 9,
            "pct": 11
          },
          {
            "z": 3,
            "pct": 6
          },
          {
            "z": 6,
            "pct": 6
          },
          {
            "z": 1,
            "pct": 5
          },
          {
            "z": 4,
            "pct": 2
          }
        ],
        "tot": 116,
        "eff": 31,
        "pts": 56,
        "pts_pct": 48,
        "err": 14,
        "slash": 6,
        "pos": 13,
        "exc": 0,
        "minus": 27
      },
      {
        "cod": "X7",
        "orig": 3,
        "destinos": [
          {
            "z": 8,
            "pct": 22
          },
          {
            "z": 9,
            "pct": 20
          },
          {
            "z": 7,
            "pct": 14
          },
          {
            "z": 5,
            "pct": 12
          },
          {
            "z": 1,
            "pct": 10
          },
          {
            "z": 3,
            "pct": 8
          },
          {
            "z": 2,
            "pct": 4
          },
          {
            "z": 4,
            "pct": 4
          },
          {
            "z": 6,
            "pct": 4
          }
        ],
        "tot": 50,
        "eff": 36,
        "pts": 23,
        "pts_pct": 46,
        "err": 5,
        "slash": 0,
        "pos": 9,
        "exc": 0,
        "minus": 13
      },
      {
        "cod": "XM",
        "orig": 3,
        "destinos": [
          {
            "z": 8,
            "pct": 52
          },
          {
            "z": 7,
            "pct": 21
          },
          {
            "z": 5,
            "pct": 10
          },
          {
            "z": 1,
            "pct": 7
          },
          {
            "z": 3,
            "pct": 7
          },
          {
            "z": 6,
            "pct": 3
          }
        ],
        "tot": 29,
        "eff": 52,
        "pts": 18,
        "pts_pct": 62,
        "err": 3,
        "slash": 0,
        "pos": 2,
        "exc": 0,
        "minus": 6
      },
      {
        "cod": "X2",
        "orig": 3,
        "destinos": [
          {
            "z": 8,
            "pct": 50
          },
          {
            "z": 6,
            "pct": 17
          },
          {
            "z": 1,
            "pct": 17
          },
          {
            "z": 9,
            "pct": 17
          }
        ],
        "tot": 6,
        "eff": 0,
        "pts": 2,
        "pts_pct": 33,
        "err": 1,
        "slash": 1,
        "pos": 0,
        "exc": 0,
        "minus": 2
      },
      {
        "cod": "X3",
        "orig": 2,
        "destinos": [
          {
            "z": 8,
            "pct": 40
          },
          {
            "z": 1,
            "pct": 20
          },
          {
            "z": 7,
            "pct": 20
          },
          {
            "z": 5,
            "pct": 20
          }
        ],
        "tot": 5,
        "eff": 100,
        "pts": 5,
        "pts_pct": 100,
        "err": 0,
        "slash": 0,
        "pos": 0,
        "exc": 0,
        "minus": 0
      },
      {
        "cod": "XL",
        "orig": 2,
        "destinos": [
          {
            "z": 8,
            "pct": 60
          },
          {
            "z": 7,
            "pct": 20
          },
          {
            "z": 4,
            "pct": 20
          }
        ],
        "tot": 5,
        "eff": 60,
        "pts": 4,
        "pts_pct": 80,
        "err": 1,
        "slash": 0,
        "pos": 0,
        "exc": 0,
        "minus": 0
      },
      {
        "cod": "X5",
        "orig": 4,
        "destinos": [
          {
            "z": 6,
            "pct": 67
          },
          {
            "z": 1,
            "pct": 33
          }
        ],
        "tot": 3,
        "eff": 100,
        "pts": 3,
        "pts_pct": 100,
        "err": 0,
        "slash": 0,
        "pos": 0,
        "exc": 0,
        "minus": 0
      },
      {
        "cod": "PR",
        "orig": 3,
        "destinos": [
          {
            "z": 1,
            "pct": 100
          }
        ],
        "tot": 2,
        "eff": 100,
        "pts": 2,
        "pts_pct": 100,
        "err": 0,
        "slash": 0,
        "pos": 0,
        "exc": 0,
        "minus": 0
      },
      {
        "cod": "XD",
        "orig": 3,
        "destinos": [
          {
            "z": 5,
            "pct": 50
          },
          {
            "z": 1,
            "pct": 50
          }
        ],
        "tot": 2,
        "eff": 100,
        "pts": 2,
        "pts_pct": 100,
        "err": 0,
        "slash": 0,
        "pos": 0,
        "exc": 0,
        "minus": 0
      }
    ],
    "saques": [
      {
        "cod": "SM",
        "orig": 5,
        "destinos": [
          {
            "z": 7,
            "pct": 22
          },
          {
            "z": 6,
            "pct": 17
          },
          {
            "z": 8,
            "pct": 15
          },
          {
            "z": 5,
            "pct": 15
          },
          {
            "z": 9,
            "pct": 14
          },
          {
            "z": 1,
            "pct": 12
          },
          {
            "z": 4,
            "pct": 2
          },
          {
            "z": 3,
            "pct": 2
          },
          {
            "z": 2,
            "pct": 1
          }
        ],
        "tot": 331,
        "eff": 0,
        "pts": 9,
        "pts_pct": 3,
        "err": 30,
        "slash": 9,
        "pos": 60,
        "exc": 52,
        "minus": 171
      },
      {
        "cod": "SQ",
        "orig": 9,
        "destinos": [
          {
            "z": 1,
            "pct": 50
          },
          {
            "z": 6,
            "pct": 50
          }
        ],
        "tot": 4,
        "eff": 6,
        "pts": 0,
        "pts_pct": 0,
        "err": 0,
        "slash": 0,
        "pos": 1,
        "exc": 1,
        "minus": 2
      }
    ],
    "recepciones": [
      {
        "cod": "RQ",
        "orig": 1,
        "destinos": [
          {
            "z": 8,
            "pct": 44
          },
          {
            "z": 3,
            "pct": 22
          },
          {
            "z": 4,
            "pct": 22
          },
          {
            "z": 9,
            "pct": 11
          }
        ],
        "tot": 9,
        "eff": 17,
        "pts": 2,
        "pts_pct": 22,
        "err": 1,
        "slash": 0,
        "pos": 1,
        "exc": 2,
        "minus": 3
      },
      {
        "cod": "RM",
        "orig": 1,
        "destinos": [
          {
            "z": 9,
            "pct": 44
          },
          {
            "z": 7,
            "pct": 22
          },
          {
            "z": 5,
            "pct": 11
          },
          {
            "z": 1,
            "pct": 11
          },
          {
            "z": 3,
            "pct": 11
          }
        ],
        "tot": 9,
        "eff": 28,
        "pts": 1,
        "pts_pct": 11,
        "err": 0,
        "slash": 0,
        "pos": 3,
        "exc": 3,
        "minus": 2
      }
    ],
    "recepcion": {
      "flotado": {
        "desde_z1": {
          "p1": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p5": {
            "tot": 3,
            "eff": 33,
            "pos": 2,
            "neg": 0,
            "err": 0,
            "perf": 0
          }
        },
        "desde_z6": {
          "p1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          }
        },
        "desde_z5": {
          "p1": {
            "tot": 4,
            "eff": 12,
            "pos": 1,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 1,
            "eff": 100,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 1
          },
          "p5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          }
        }
      },
      "potencia": {
        "desde_z1": {
          "p1": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 5,
            "eff": 20,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 1
          },
          "p5": {
            "tot": 2,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 1,
            "perf": 1
          }
        },
        "desde_z6": {
          "p1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 1,
            "eff": 50,
            "pos": 1,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          }
        },
        "desde_z5": {
          "p1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          },
          "p5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "err": 0,
            "perf": 0
          }
        }
      }
    }
  }
];
var Nafels_JUGADORES = PARTIDOS_JUGADORES;
try{window.Nafels_JUGADORES=PARTIDOS_JUGADORES;window.PARTIDOS_JUGADORES=PARTIDOS_JUGADORES;}catch(e){}
