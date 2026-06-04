// datos_partidos.js — 04/06/2026 04:08
const PARTIDOS_GENERADO = "04/06/2026 04:08";
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
    "num": 3,
    "nombre": "3 Schwitter",
    "pos": "PUNTA",
    "color": "#22c55e",
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
        ]
      },
      {
        "cod": "X8",
        "orig": 9,
        "destinos": [
          {
            "z": 7,
            "pct": 100
          }
        ]
      }
    ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
      }
    ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
      }
    ]
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
        ]
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
        ]
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
        ]
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
        ]
      },
      {
        "cod": "VP",
        "orig": 8,
        "destinos": [
          {
            "z": 1,
            "pct": 100
          }
        ]
      }
    ]
  },
  {
    "num": 10,
    "nombre": "10 Bogdanovski",
    "pos": "CENTRAL",
    "color": "#f97316",
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
        ]
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
        ]
      }
    ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
    "num": 14,
    "nombre": "14 Figueiredo",
    "pos": "OPUESTO",
    "color": "#818cf8",
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
      },
      {
        "cod": "PR",
        "orig": 3,
        "destinos": []
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
        ]
      }
    ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
      },
      {
        "cod": "PR",
        "orig": 3,
        "destinos": [
          {
            "z": 1,
            "pct": 100
          }
        ]
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
        ]
      }
    ]
  }
];
