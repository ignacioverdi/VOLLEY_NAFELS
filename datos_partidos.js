// datos_partidos.js — 08/06/2026, 00:22:24
const PARTIDOS_GENERADO = "08/06/2026, 00:22:24";
const PARTIDOS_TOTAL = 7;
const PARTIDOS_META = [
  {
    "nombre": "Untref",
    "rival": "Untref",
    "fecha": "01/05/2026",
    "torneo": "NLA Suiza 2026",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "1"
  },
  {
    "nombre": "Ciudad",
    "rival": "Ciudad",
    "fecha": "05/05/2026",
    "torneo": "NLA Suiza 2026",
    "resultado": "D",
    "sets_nafels": "0",
    "sets_rival": "3"
  },
  {
    "nombre": "Ferro",
    "rival": "Ferro",
    "fecha": "08/05/2026",
    "torneo": "NLA Suiza 2026",
    "resultado": "D",
    "sets_nafels": "1",
    "sets_rival": "3"
  },
  {
    "nombre": "Hacoaj",
    "rival": "Hacoaj",
    "fecha": "16/05/2026",
    "torneo": "NLA Suiza 2026",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "1"
  },
  {
    "nombre": "Velez",
    "rival": "Velez",
    "fecha": "22/05/2026",
    "torneo": "NLA Suiza 2026",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "2"
  },
  {
    "nombre": "Defensores",
    "rival": "Defensores",
    "fecha": "26/05/2026",
    "torneo": "NLA Suiza 2026",
    "resultado": "D",
    "sets_nafels": "2",
    "sets_rival": "3"
  },
  {
    "nombre": "Lomas",
    "rival": "Lomas",
    "fecha": "30/05/2026",
    "torneo": "NLA Suiza 2026",
    "resultado": "V",
    "sets_nafels": "3",
    "sets_rival": "2"
  }
];
const PARTIDOS_JUGADORES = [
  {
    "num": 1,
    "nombre": "1 Salazar Imanol",
    "pos": "CENTRAL",
    "color": "#22c55e",
    "info": {},
    "ataques": [
      {
        "cod": "X7",
        "tipo": "",
        "orig": 3,
        "destinos": [
          {
            "z": 3,
            "pct": 33
          },
          {
            "z": 1,
            "pct": 17
          },
          {
            "z": 6,
            "pct": 17
          },
          {
            "z": 8,
            "pct": 8
          }
        ],
        "eff": 31,
        "tot": 13,
        "pts": 7,
        "slash": 2,
        "err": 1,
        "video": null,
        "pts_pct": 54
      },
      {
        "cod": "XM",
        "tipo": "",
        "orig": 3,
        "destinos": [
          {
            "z": 1,
            "pct": 33
          },
          {
            "z": 9,
            "pct": 25
          },
          {
            "z": 6,
            "pct": 17
          },
          {
            "z": 2,
            "pct": 8
          }
        ],
        "eff": 67,
        "tot": 12,
        "pts": 8,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 67
      },
      {
        "cod": "X1",
        "tipo": "",
        "orig": 3,
        "destinos": [
          {
            "z": 5,
            "pct": 50
          },
          {
            "z": 3,
            "pct": 50
          }
        ],
        "eff": 0,
        "tot": 2,
        "pts": 1,
        "slash": 0,
        "err": 1,
        "video": null,
        "pts_pct": 50
      },
      {
        "cod": "PR",
        "tipo": "",
        "orig": 8,
        "destinos": [
          {
            "z": 3,
            "pct": 100
          }
        ],
        "eff": 0,
        "tot": 1,
        "pts": 0,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 0
      },
      {
        "cod": "X6",
        "tipo": "",
        "orig": 2,
        "destinos": [
          {
            "z": 3,
            "pct": 100
          }
        ],
        "eff": 0,
        "tot": 1,
        "pts": 0,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 0
      },
      {
        "cod": "X2",
        "tipo": "",
        "orig": 3,
        "destinos": [
          {
            "z": 7,
            "pct": 100
          }
        ],
        "eff": 0,
        "tot": 1,
        "pts": 0,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 0
      }
    ],
    "saques": [
      {
        "cod": "SM",
        "tipo": "FLOTADO",
        "orig": 6,
        "destinos": [
          {
            "z": 1,
            "pct": 29
          },
          {
            "z": 7,
            "pct": 24
          },
          {
            "z": 6,
            "pct": 19
          },
          {
            "z": 8,
            "pct": 14
          },
          {
            "z": 5,
            "pct": 10
          },
          {
            "z": 3,
            "pct": 5
          }
        ],
        "eff": -5,
        "tot": 21,
        "pts": 0,
        "plus": 0,
        "slash": 0,
        "err": 1,
        "video": null,
        "pts_pct": 0
      },
      {
        "cod": "SQ",
        "tipo": "POTENCIA",
        "orig": 6,
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
        "eff": -100,
        "tot": 2,
        "pts": 0,
        "plus": 0,
        "slash": 0,
        "err": 2,
        "video": null,
        "pts_pct": 0
      }
    ],
    "recepciones": [],
    "recepcion": {
      "flotado": {
        "desde_z1": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 1,
            "eff": 100,
            "pos": 100,
            "neg": 0,
            "pt": 1,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 1,
            "eff": 100,
            "pos": 100,
            "neg": 0,
            "pt": 1,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        }
      },
      "potencia": {
        "desde_z1": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 1,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 1,
            "eff": 100,
            "pos": 100,
            "neg": 0,
            "pt": 1,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 2,
            "eff": 50,
            "pos": 50,
            "neg": 0,
            "pt": 1,
            "mas": 0,
            "neu": 0,
            "med": 1,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        }
      }
    },
    "objetivos": {
      "sq": -11,
      "rec": 67,
      "bqpos": 50,
      "bqpt": 29,
      "atk": 40,
      "atqq": 43,
      "atqhb": null,
      "atqx": null,
      "atqrp": 60,
      "atqri": 0,
      "atqrm": null,
      "atqtr": 27
    },
    "tot_saques": 23,
    "tot_recep": 3,
    "tot_ataques": 28
  },
  {
    "num": 2,
    "nombre": "2 Ojuez Agustin",
    "pos": "CENTRAL",
    "color": "#22c55e",
    "info": {},
    "ataques": [
      {
        "cod": "X1",
        "tipo": "",
        "orig": 3,
        "destinos": [
          {
            "z": 5,
            "pct": 33
          },
          {
            "z": 6,
            "pct": 30
          },
          {
            "z": 3,
            "pct": 15
          },
          {
            "z": 7,
            "pct": 12
          }
        ],
        "eff": 52,
        "tot": 33,
        "pts": 20,
        "slash": 1,
        "err": 2,
        "video": null,
        "pts_pct": 61
      },
      {
        "cod": "XM",
        "tipo": "",
        "orig": 3,
        "destinos": [
          {
            "z": 1,
            "pct": 36
          },
          {
            "z": 6,
            "pct": 27
          },
          {
            "z": 3,
            "pct": 14
          },
          {
            "z": 9,
            "pct": 9
          }
        ],
        "eff": 50,
        "tot": 22,
        "pts": 13,
        "slash": 1,
        "err": 1,
        "video": null,
        "pts_pct": 59
      },
      {
        "cod": "X7",
        "tipo": "",
        "orig": 3,
        "destinos": [
          {
            "z": 6,
            "pct": 31
          },
          {
            "z": 7,
            "pct": 15
          },
          {
            "z": 1,
            "pct": 15
          },
          {
            "z": 8,
            "pct": 15
          }
        ],
        "eff": 62,
        "tot": 13,
        "pts": 8,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 62
      },
      {
        "cod": "X2",
        "tipo": "",
        "orig": 3,
        "destinos": [
          {
            "z": 9,
            "pct": 50
          },
          {
            "z": 6,
            "pct": 25
          },
          {
            "z": 1,
            "pct": 25
          }
        ],
        "eff": 75,
        "tot": 4,
        "pts": 3,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 75
      },
      {
        "cod": "PR",
        "tipo": "",
        "orig": 8,
        "destinos": [
          {
            "z": 3,
            "pct": 100
          }
        ],
        "eff": 100,
        "tot": 2,
        "pts": 2,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 100
      },
      {
        "cod": "X6",
        "tipo": "",
        "orig": 2,
        "destinos": [
          {
            "z": 4,
            "pct": 100
          }
        ],
        "eff": -100,
        "tot": 1,
        "pts": 0,
        "slash": 1,
        "err": 0,
        "video": null,
        "pts_pct": 0
      },
      {
        "cod": "P2",
        "tipo": "",
        "orig": 8,
        "destinos": [],
        "eff": -100,
        "tot": 1,
        "pts": 0,
        "slash": 0,
        "err": 1,
        "video": null,
        "pts_pct": 0
      }
    ],
    "saques": [
      {
        "cod": "SM",
        "tipo": "FLOTADO",
        "orig": 6,
        "destinos": [
          {
            "z": 6,
            "pct": 31
          },
          {
            "z": 5,
            "pct": 24
          },
          {
            "z": 7,
            "pct": 18
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
            "pct": 7
          }
        ],
        "eff": -13,
        "tot": 45,
        "pts": 0,
        "plus": 0,
        "slash": 0,
        "err": 6,
        "video": null,
        "pts_pct": 0
      }
    ],
    "recepciones": [],
    "recepcion": {
      "flotado": {
        "desde_z1": {
          "P5": {
            "tot": 2,
            "eff": 25,
            "pos": 50,
            "neg": 50,
            "pt": 1,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 1,
            "err": 0
          },
          "P6": {
            "tot": 2,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 1,
            "med": 1,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 4,
            "eff": 12,
            "pos": 25,
            "neg": 25,
            "pt": 1,
            "mas": 0,
            "neu": 1,
            "med": 1,
            "ovp": 1,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 1,
            "eff": 50,
            "pos": 100,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 1,
            "eff": 50,
            "pos": 100,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        }
      },
      "potencia": {
        "desde_z1": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        }
      }
    },
    "objetivos": {
      "sq": -11,
      "rec": 20,
      "bqpos": 64,
      "bqpt": 34,
      "atk": 51,
      "atqq": 55,
      "atqhb": null,
      "atqx": -100,
      "atqrp": 50,
      "atqri": 71,
      "atqrm": 67,
      "atqtr": 44
    },
    "tot_saques": 45,
    "tot_recep": 5,
    "tot_ataques": 72
  },
  {
    "num": 3,
    "nombre": "3 Romeo Winer Agustin",
    "pos": "LIBERO",
    "color": "#f59e0b",
    "info": {},
    "ataques": [],
    "saques": [
      {
        "cod": "SM",
        "tipo": "FLOTADO",
        "orig": 6,
        "destinos": [
          {
            "z": 9,
            "pct": 50
          },
          {
            "z": 7,
            "pct": 33
          },
          {
            "z": 6,
            "pct": 17
          }
        ],
        "eff": -17,
        "tot": 6,
        "pts": 0,
        "plus": 0,
        "slash": 0,
        "err": 1,
        "video": null,
        "pts_pct": 0
      }
    ],
    "recepciones": [],
    "recepcion": {
      "flotado": {
        "desde_z1": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 9,
            "eff": 28,
            "pos": 56,
            "neg": 22,
            "pt": 2,
            "mas": 3,
            "neu": 2,
            "med": 0,
            "ovp": 2,
            "err": 0
          },
          "P1": {
            "tot": 3,
            "eff": 17,
            "pos": 33,
            "neg": 33,
            "pt": 1,
            "mas": 0,
            "neu": 0,
            "med": 1,
            "ovp": 1,
            "err": 0
          },
          "total": {
            "tot": 12,
            "eff": 25,
            "pos": 50,
            "neg": 25,
            "pt": 3,
            "mas": 3,
            "neu": 2,
            "med": 1,
            "ovp": 3,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 7,
            "eff": -36,
            "pos": 14,
            "neg": 43,
            "pt": 0,
            "mas": 1,
            "neu": 2,
            "med": 1,
            "ovp": 0,
            "err": 3
          },
          "P1": {
            "tot": 1,
            "eff": 50,
            "pos": 100,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 8,
            "eff": -25,
            "pos": 25,
            "neg": 38,
            "pt": 0,
            "mas": 2,
            "neu": 2,
            "med": 1,
            "ovp": 0,
            "err": 3
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 9,
            "eff": 22,
            "pos": 33,
            "neg": 0,
            "pt": 1,
            "mas": 2,
            "neu": 1,
            "med": 5,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 1,
            "eff": 50,
            "pos": 100,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 1,
            "eff": 50,
            "pos": 100,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        }
      },
      "potencia": {
        "desde_z1": {
          "P5": {
            "tot": 1,
            "eff": -50,
            "pos": 0,
            "neg": 100,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 1,
            "err": 0
          },
          "P6": {
            "tot": 6,
            "eff": 25,
            "pos": 50,
            "neg": 0,
            "pt": 0,
            "mas": 3,
            "neu": 2,
            "med": 1,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 7,
            "eff": 14,
            "pos": 43,
            "neg": 14,
            "pt": 0,
            "mas": 3,
            "neu": 2,
            "med": 1,
            "ovp": 1,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 2,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 2,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 1,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 3,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 1,
            "med": 2,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 1,
            "eff": 100,
            "pos": 100,
            "neg": 0,
            "pt": 1,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 2,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 2,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 3,
            "eff": 33,
            "pos": 33,
            "neg": 0,
            "pt": 1,
            "mas": 0,
            "neu": 2,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        }
      }
    },
    "objetivos": {
      "sq": -17,
      "rec": 13,
      "bqpos": null,
      "bqpt": null,
      "atk": null,
      "atqq": null,
      "atqhb": null,
      "atqx": null,
      "atqrp": null,
      "atqri": null,
      "atqrm": null,
      "atqtr": null
    },
    "tot_saques": 6,
    "tot_recep": 67,
    "tot_ataques": 0
  },
  {
    "num": 4,
    "nombre": "4 Vazquez Ezequiel",
    "pos": "ARMADOR",
    "color": "#a855f7",
    "info": {},
    "ataques": [
      {
        "cod": "P2",
        "tipo": "",
        "orig": 8,
        "destinos": [
          {
            "z": 4,
            "pct": 44
          },
          {
            "z": 3,
            "pct": 33
          },
          {
            "z": 2,
            "pct": 11
          },
          {
            "z": 8,
            "pct": 11
          }
        ],
        "eff": 11,
        "tot": 9,
        "pts": 3,
        "slash": 2,
        "err": 0,
        "video": null,
        "pts_pct": 33
      },
      {
        "cod": "XM",
        "tipo": "",
        "orig": 3,
        "destinos": [
          {
            "z": 8,
            "pct": 25
          },
          {
            "z": 9,
            "pct": 25
          },
          {
            "z": 4,
            "pct": 25
          },
          {
            "z": 7,
            "pct": 25
          }
        ],
        "eff": 50,
        "tot": 4,
        "pts": 2,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 50
      },
      {
        "cod": "V6",
        "tipo": "",
        "orig": 2,
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
        "eff": 0,
        "tot": 2,
        "pts": 0,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 0
      },
      {
        "cod": "V8",
        "tipo": "",
        "orig": 9,
        "destinos": [
          {
            "z": 5,
            "pct": 100
          }
        ],
        "eff": 0,
        "tot": 1,
        "pts": 0,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 0
      },
      {
        "cod": "X6",
        "tipo": "",
        "orig": 2,
        "destinos": [
          {
            "z": 6,
            "pct": 100
          }
        ],
        "eff": 100,
        "tot": 1,
        "pts": 1,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 100
      }
    ],
    "saques": [
      {
        "cod": "SM",
        "tipo": "FLOTADO",
        "orig": 6,
        "destinos": [
          {
            "z": 6,
            "pct": 38
          },
          {
            "z": 1,
            "pct": 24
          },
          {
            "z": 9,
            "pct": 12
          },
          {
            "z": 5,
            "pct": 9
          },
          {
            "z": 8,
            "pct": 9
          },
          {
            "z": 7,
            "pct": 7
          }
        ],
        "eff": 2,
        "tot": 96,
        "pts": 6,
        "plus": 0,
        "slash": 0,
        "err": 4,
        "video": null,
        "pts_pct": 6
      }
    ],
    "recepciones": [],
    "recepcion": {
      "flotado": {
        "desde_z1": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        }
      },
      "potencia": {
        "desde_z1": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 2,
            "eff": -50,
            "pos": 0,
            "neg": 50,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 1,
            "ovp": 0,
            "err": 1
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 2,
            "eff": -50,
            "pos": 0,
            "neg": 50,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 1,
            "ovp": 0,
            "err": 1
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 1,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 1,
            "ovp": 0,
            "err": 0
          }
        }
      }
    },
    "objetivos": {
      "sq": 7,
      "rec": -33,
      "bqpos": 50,
      "bqpt": 9,
      "atk": 24,
      "atqq": null,
      "atqhb": 0,
      "atqx": null,
      "atqrp": 0,
      "atqri": 0,
      "atqrm": 0,
      "atqtr": 33
    },
    "tot_saques": 96,
    "tot_recep": 3,
    "tot_ataques": 3
  },
  {
    "num": 5,
    "nombre": "5 Ramos Iaki",
    "pos": "OPUESTO",
    "color": "#ef4444",
    "info": {},
    "ataques": [
      {
        "cod": "X6",
        "tipo": "",
        "orig": 2,
        "destinos": [
          {
            "z": 4,
            "pct": 27
          },
          {
            "z": 1,
            "pct": 25
          },
          {
            "z": 6,
            "pct": 21
          },
          {
            "z": 9,
            "pct": 8
          }
        ],
        "eff": 29,
        "tot": 52,
        "pts": 21,
        "slash": 2,
        "err": 4,
        "video": null,
        "pts_pct": 40
      },
      {
        "cod": "V6",
        "tipo": "",
        "orig": 2,
        "destinos": [
          {
            "z": 4,
            "pct": 34
          },
          {
            "z": 1,
            "pct": 32
          },
          {
            "z": 6,
            "pct": 16
          },
          {
            "z": 5,
            "pct": 8
          }
        ],
        "eff": 20,
        "tot": 41,
        "pts": 17,
        "slash": 5,
        "err": 4,
        "video": null,
        "pts_pct": 41
      },
      {
        "cod": "X8",
        "tipo": "",
        "orig": 9,
        "destinos": [
          {
            "z": 5,
            "pct": 42
          },
          {
            "z": 4,
            "pct": 24
          },
          {
            "z": 1,
            "pct": 21
          },
          {
            "z": 6,
            "pct": 9
          }
        ],
        "eff": 20,
        "tot": 35,
        "pts": 17,
        "slash": 5,
        "err": 5,
        "video": null,
        "pts_pct": 49
      },
      {
        "cod": "V8",
        "tipo": "",
        "orig": 9,
        "destinos": [
          {
            "z": 1,
            "pct": 32
          },
          {
            "z": 4,
            "pct": 32
          },
          {
            "z": 5,
            "pct": 16
          },
          {
            "z": 6,
            "pct": 11
          }
        ],
        "eff": 47,
        "tot": 19,
        "pts": 11,
        "slash": 2,
        "err": 0,
        "video": null,
        "pts_pct": 58
      },
      {
        "cod": "PR",
        "tipo": "",
        "orig": 8,
        "destinos": [],
        "eff": 100,
        "tot": 2,
        "pts": 2,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 100
      },
      {
        "cod": "X5",
        "tipo": "",
        "orig": 4,
        "destinos": [
          {
            "z": 8,
            "pct": 100
          }
        ],
        "eff": 100,
        "tot": 1,
        "pts": 1,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 100
      },
      {
        "cod": "V5",
        "tipo": "",
        "orig": 4,
        "destinos": [
          {
            "z": 2,
            "pct": 100
          }
        ],
        "eff": 0,
        "tot": 1,
        "pts": 0,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 0
      }
    ],
    "saques": [
      {
        "cod": "SQ",
        "tipo": "POTENCIA",
        "orig": 6,
        "destinos": [
          {
            "z": 5,
            "pct": 39
          },
          {
            "z": 6,
            "pct": 31
          },
          {
            "z": 1,
            "pct": 24
          },
          {
            "z": 9,
            "pct": 4
          },
          {
            "z": 7,
            "pct": 2
          }
        ],
        "eff": -35,
        "tot": 55,
        "pts": 4,
        "plus": 0,
        "slash": 0,
        "err": 23,
        "video": null,
        "pts_pct": 7
      },
      {
        "cod": "SM",
        "tipo": "FLOTADO",
        "orig": 6,
        "destinos": [
          {
            "z": 6,
            "pct": 100
          }
        ],
        "eff": -50,
        "tot": 2,
        "pts": 0,
        "plus": 0,
        "slash": 0,
        "err": 1,
        "video": null,
        "pts_pct": 0
      }
    ],
    "recepciones": [],
    "recepcion": {
      "flotado": {
        "desde_z1": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 1,
            "eff": 50,
            "pos": 100,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 1,
            "eff": 50,
            "pos": 100,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 1,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 1,
            "ovp": 0,
            "err": 0
          }
        }
      },
      "potencia": {
        "desde_z1": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        }
      }
    },
    "objetivos": {
      "sq": -30,
      "rec": 25,
      "bqpos": 37,
      "bqpt": 17,
      "atk": 28,
      "atqq": null,
      "atqhb": 28,
      "atqx": 26,
      "atqrp": 32,
      "atqri": 15,
      "atqrm": 21,
      "atqtr": 32
    },
    "tot_saques": 57,
    "tot_recep": 2,
    "tot_ataques": 148
  },
  {
    "num": 6,
    "nombre": "6 Villarruel Juan Simon",
    "pos": "PUNTA",
    "color": "#3b82f6",
    "info": {},
    "ataques": [
      {
        "cod": "X5",
        "tipo": "",
        "orig": 4,
        "destinos": [
          {
            "z": 2,
            "pct": 43
          },
          {
            "z": 1,
            "pct": 29
          },
          {
            "z": 3,
            "pct": 14
          },
          {
            "z": 6,
            "pct": 14
          }
        ],
        "eff": -29,
        "tot": 7,
        "pts": 1,
        "slash": 2,
        "err": 1,
        "video": null,
        "pts_pct": 14
      }
    ],
    "saques": [
      {
        "cod": "SQ",
        "tipo": "POTENCIA",
        "orig": 6,
        "destinos": [
          {
            "z": 6,
            "pct": 71
          },
          {
            "z": 3,
            "pct": 14
          },
          {
            "z": 5,
            "pct": 14
          }
        ],
        "eff": -29,
        "tot": 7,
        "pts": 0,
        "plus": 0,
        "slash": 0,
        "err": 2,
        "video": null,
        "pts_pct": 0
      }
    ],
    "recepciones": [],
    "recepcion": {
      "flotado": {
        "desde_z1": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 2,
            "eff": 25,
            "pos": 50,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 1,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 2,
            "eff": 25,
            "pos": 50,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 1,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        }
      },
      "potencia": {
        "desde_z1": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 1,
            "eff": 50,
            "pos": 100,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 1,
            "eff": 50,
            "pos": 100,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 1,
            "eff": 100,
            "pos": 100,
            "neg": 0,
            "pt": 1,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 1,
            "eff": 100,
            "pos": 100,
            "neg": 0,
            "pt": 1,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 1,
            "eff": 100,
            "pos": 100,
            "neg": 0,
            "pt": 1,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 1,
            "eff": 100,
            "pos": 100,
            "neg": 0,
            "pt": 1,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        }
      }
    },
    "objetivos": {
      "sq": -25,
      "rec": 60,
      "bqpos": 100,
      "bqpt": 0,
      "atk": -29,
      "atqq": null,
      "atqhb": null,
      "atqx": -29,
      "atqrp": 0,
      "atqri": 0,
      "atqrm": null,
      "atqtr": -50
    },
    "tot_saques": 7,
    "tot_recep": 5,
    "tot_ataques": 7
  },
  {
    "num": 9,
    "nombre": "9 Godoy Martin",
    "pos": "ARMADOR",
    "color": "#a855f7",
    "info": {},
    "ataques": [
      {
        "cod": "P2",
        "tipo": "",
        "orig": 8,
        "destinos": [
          {
            "z": 4,
            "pct": 100
          }
        ],
        "eff": 0,
        "tot": 3,
        "pts": 1,
        "slash": 1,
        "err": 0,
        "video": null,
        "pts_pct": 33
      },
      {
        "cod": "PR",
        "tipo": "",
        "orig": 8,
        "destinos": [
          {
            "z": 6,
            "pct": 50
          },
          {
            "z": 3,
            "pct": 50
          }
        ],
        "eff": 0,
        "tot": 2,
        "pts": 1,
        "slash": 0,
        "err": 1,
        "video": null,
        "pts_pct": 50
      }
    ],
    "saques": [
      {
        "cod": "SM",
        "tipo": "FLOTADO",
        "orig": 6,
        "destinos": [
          {
            "z": 6,
            "pct": 27
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
            "z": 8,
            "pct": 14
          },
          {
            "z": 9,
            "pct": 12
          },
          {
            "z": 3,
            "pct": 4
          }
        ],
        "eff": -2,
        "tot": 51,
        "pts": 2,
        "plus": 0,
        "slash": 0,
        "err": 3,
        "video": null,
        "pts_pct": 4
      }
    ],
    "recepciones": [],
    "recepcion": {
      "flotado": {
        "desde_z1": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 1,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 1,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 2,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 2,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 2,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 2,
            "ovp": 0,
            "err": 0
          }
        }
      },
      "potencia": {
        "desde_z1": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 1,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 1,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        }
      }
    },
    "objetivos": {
      "sq": 2,
      "rec": 0,
      "bqpos": 42,
      "bqpt": 8,
      "atk": 0,
      "atqq": null,
      "atqhb": null,
      "atqx": null,
      "atqrp": 100,
      "atqri": -100,
      "atqrm": null,
      "atqtr": 0
    },
    "tot_saques": 51,
    "tot_recep": 4,
    "tot_ataques": 0
  },
  {
    "num": 11,
    "nombre": "11 Durdos Valentin",
    "pos": "PUNTA",
    "color": "#3b82f6",
    "info": {},
    "ataques": [
      {
        "cod": "X5",
        "tipo": "",
        "orig": 4,
        "destinos": [
          {
            "z": 2,
            "pct": 32
          },
          {
            "z": 7,
            "pct": 16
          },
          {
            "z": 6,
            "pct": 14
          },
          {
            "z": 1,
            "pct": 11
          }
        ],
        "eff": 32,
        "tot": 114,
        "pts": 53,
        "slash": 5,
        "err": 11,
        "video": null,
        "pts_pct": 46
      },
      {
        "cod": "V5",
        "tipo": "",
        "orig": 4,
        "destinos": [
          {
            "z": 2,
            "pct": 44
          },
          {
            "z": 1,
            "pct": 17
          },
          {
            "z": 6,
            "pct": 9
          },
          {
            "z": 5,
            "pct": 8
          }
        ],
        "eff": 11,
        "tot": 65,
        "pts": 21,
        "slash": 6,
        "err": 8,
        "video": null,
        "pts_pct": 32
      },
      {
        "cod": "XP",
        "tipo": "",
        "orig": 8,
        "destinos": [
          {
            "z": 1,
            "pct": 31
          },
          {
            "z": 6,
            "pct": 25
          },
          {
            "z": 3,
            "pct": 25
          },
          {
            "z": 5,
            "pct": 12
          }
        ],
        "eff": 20,
        "tot": 20,
        "pts": 9,
        "slash": 0,
        "err": 5,
        "video": null,
        "pts_pct": 45
      },
      {
        "cod": "PR",
        "tipo": "",
        "orig": 8,
        "destinos": [
          {
            "z": 3,
            "pct": 33
          },
          {
            "z": 2,
            "pct": 33
          },
          {
            "z": 7,
            "pct": 33
          }
        ],
        "eff": 71,
        "tot": 7,
        "pts": 5,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 71
      },
      {
        "cod": "VP",
        "tipo": "",
        "orig": 8,
        "destinos": [
          {
            "z": 5,
            "pct": 33
          },
          {
            "z": 4,
            "pct": 33
          },
          {
            "z": 7,
            "pct": 33
          }
        ],
        "eff": 0,
        "tot": 4,
        "pts": 1,
        "slash": 0,
        "err": 1,
        "video": null,
        "pts_pct": 25
      },
      {
        "cod": "X6",
        "tipo": "",
        "orig": 2,
        "destinos": [
          {
            "z": 2,
            "pct": 100
          }
        ],
        "eff": 0,
        "tot": 2,
        "pts": 1,
        "slash": 0,
        "err": 1,
        "video": null,
        "pts_pct": 50
      }
    ],
    "saques": [
      {
        "cod": "SM",
        "tipo": "FLOTADO",
        "orig": 6,
        "destinos": [
          {
            "z": 5,
            "pct": 22
          },
          {
            "z": 7,
            "pct": 20
          },
          {
            "z": 6,
            "pct": 18
          },
          {
            "z": 1,
            "pct": 18
          },
          {
            "z": 9,
            "pct": 16
          },
          {
            "z": 8,
            "pct": 8
          }
        ],
        "eff": -10,
        "tot": 51,
        "pts": 0,
        "plus": 0,
        "slash": 0,
        "err": 5,
        "video": null,
        "pts_pct": 0
      },
      {
        "cod": "SQ",
        "tipo": "POTENCIA",
        "orig": 6,
        "destinos": [
          {
            "z": 5,
            "pct": 42
          },
          {
            "z": 6,
            "pct": 35
          },
          {
            "z": 1,
            "pct": 15
          },
          {
            "z": 8,
            "pct": 5
          },
          {
            "z": 3,
            "pct": 2
          }
        ],
        "eff": -32,
        "tot": 40,
        "pts": 4,
        "plus": 0,
        "slash": 0,
        "err": 17,
        "video": null,
        "pts_pct": 10
      }
    ],
    "recepciones": [],
    "recepcion": {
      "flotado": {
        "desde_z1": {
          "P5": {
            "tot": 15,
            "eff": 47,
            "pos": 87,
            "neg": 7,
            "pt": 2,
            "mas": 11,
            "neu": 1,
            "med": 0,
            "ovp": 1,
            "err": 0
          },
          "P6": {
            "tot": 17,
            "eff": 44,
            "pos": 65,
            "neg": 6,
            "pt": 6,
            "mas": 5,
            "neu": 4,
            "med": 1,
            "ovp": 0,
            "err": 1
          },
          "P1": {
            "tot": 3,
            "eff": 67,
            "pos": 100,
            "neg": 0,
            "pt": 1,
            "mas": 2,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 35,
            "eff": 47,
            "pos": 77,
            "neg": 6,
            "pt": 9,
            "mas": 18,
            "neu": 5,
            "med": 1,
            "ovp": 1,
            "err": 1
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 7,
            "eff": 29,
            "pos": 43,
            "neg": 0,
            "pt": 1,
            "mas": 2,
            "neu": 3,
            "med": 1,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 9,
            "eff": 50,
            "pos": 67,
            "neg": 0,
            "pt": 3,
            "mas": 3,
            "neu": 2,
            "med": 1,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 3,
            "eff": 33,
            "pos": 33,
            "neg": 0,
            "pt": 1,
            "mas": 0,
            "neu": 1,
            "med": 1,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 19,
            "eff": 39,
            "pos": 53,
            "neg": 0,
            "pt": 5,
            "mas": 5,
            "neu": 6,
            "med": 3,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 17,
            "eff": 50,
            "pos": 71,
            "neg": 0,
            "pt": 5,
            "mas": 7,
            "neu": 1,
            "med": 4,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 19,
            "eff": 50,
            "pos": 74,
            "neg": 5,
            "pt": 6,
            "mas": 8,
            "neu": 3,
            "med": 1,
            "ovp": 1,
            "err": 0
          },
          "P1": {
            "tot": 2,
            "eff": 25,
            "pos": 50,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 1,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 38,
            "eff": 49,
            "pos": 71,
            "neg": 3,
            "pt": 11,
            "mas": 16,
            "neu": 5,
            "med": 5,
            "ovp": 1,
            "err": 0
          }
        }
      },
      "potencia": {
        "desde_z1": {
          "P5": {
            "tot": 12,
            "eff": 0,
            "pos": 33,
            "neg": 33,
            "pt": 3,
            "mas": 1,
            "neu": 1,
            "med": 3,
            "ovp": 1,
            "err": 3
          },
          "P6": {
            "tot": 10,
            "eff": 20,
            "pos": 40,
            "neg": 10,
            "pt": 2,
            "mas": 2,
            "neu": 3,
            "med": 2,
            "ovp": 0,
            "err": 1
          },
          "P1": {
            "tot": 2,
            "eff": 25,
            "pos": 50,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 1,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 24,
            "eff": 10,
            "pos": 38,
            "neg": 21,
            "pt": 5,
            "mas": 4,
            "neu": 5,
            "med": 5,
            "ovp": 1,
            "err": 4
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 7,
            "eff": 36,
            "pos": 57,
            "neg": 14,
            "pt": 2,
            "mas": 2,
            "neu": 1,
            "med": 1,
            "ovp": 1,
            "err": 0
          },
          "P6": {
            "tot": 11,
            "eff": 36,
            "pos": 64,
            "neg": 18,
            "pt": 4,
            "mas": 3,
            "neu": 1,
            "med": 1,
            "ovp": 1,
            "err": 1
          },
          "P1": {
            "tot": 1,
            "eff": 50,
            "pos": 100,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 19,
            "eff": 37,
            "pos": 63,
            "neg": 16,
            "pt": 6,
            "mas": 6,
            "neu": 2,
            "med": 2,
            "ovp": 2,
            "err": 1
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 8,
            "eff": 25,
            "pos": 38,
            "neg": 12,
            "pt": 2,
            "mas": 1,
            "neu": 4,
            "med": 0,
            "ovp": 1,
            "err": 0
          },
          "P6": {
            "tot": 7,
            "eff": 29,
            "pos": 57,
            "neg": 14,
            "pt": 1,
            "mas": 3,
            "neu": 1,
            "med": 1,
            "ovp": 1,
            "err": 0
          },
          "P1": {
            "tot": 2,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 1,
            "med": 1,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 17,
            "eff": 24,
            "pos": 41,
            "neg": 12,
            "pt": 3,
            "mas": 4,
            "neu": 6,
            "med": 2,
            "ovp": 2,
            "err": 0
          }
        }
      }
    },
    "objetivos": {
      "sq": -16,
      "rec": 37,
      "bqpos": 37,
      "bqpt": 13,
      "atk": 25,
      "atqq": null,
      "atqhb": 10,
      "atqx": 32,
      "atqrp": 36,
      "atqri": 71,
      "atqrm": 5,
      "atqtr": 14
    },
    "tot_saques": 91,
    "tot_recep": 152,
    "tot_ataques": 186
  },
  {
    "num": 12,
    "nombre": "12 Zanotti Juan Cruz",
    "pos": "LIBERO",
    "color": "#f59e0b",
    "info": {},
    "ataques": [],
    "saques": [],
    "recepciones": [],
    "recepcion": {
      "flotado": {
        "desde_z1": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 15,
            "eff": 57,
            "pos": 80,
            "neg": 7,
            "pt": 6,
            "mas": 6,
            "neu": 1,
            "med": 1,
            "ovp": 1,
            "err": 0
          },
          "P1": {
            "tot": 16,
            "eff": 56,
            "pos": 81,
            "neg": 0,
            "pt": 5,
            "mas": 8,
            "neu": 1,
            "med": 2,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 31,
            "eff": 56,
            "pos": 81,
            "neg": 3,
            "pt": 11,
            "mas": 14,
            "neu": 2,
            "med": 3,
            "ovp": 1,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 2,
            "eff": 50,
            "pos": 100,
            "neg": 0,
            "pt": 0,
            "mas": 2,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 11,
            "eff": 36,
            "pos": 55,
            "neg": 9,
            "pt": 4,
            "mas": 2,
            "neu": 4,
            "med": 0,
            "ovp": 0,
            "err": 1
          },
          "P1": {
            "tot": 6,
            "eff": 75,
            "pos": 100,
            "neg": 0,
            "pt": 3,
            "mas": 3,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 19,
            "eff": 50,
            "pos": 74,
            "neg": 5,
            "pt": 7,
            "mas": 7,
            "neu": 4,
            "med": 0,
            "ovp": 0,
            "err": 1
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 4,
            "eff": 25,
            "pos": 50,
            "neg": 0,
            "pt": 0,
            "mas": 2,
            "neu": 1,
            "med": 1,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 17,
            "eff": 56,
            "pos": 71,
            "neg": 6,
            "pt": 8,
            "mas": 4,
            "neu": 3,
            "med": 1,
            "ovp": 1,
            "err": 0
          },
          "P1": {
            "tot": 22,
            "eff": 45,
            "pos": 68,
            "neg": 9,
            "pt": 9,
            "mas": 6,
            "neu": 2,
            "med": 3,
            "ovp": 0,
            "err": 2
          },
          "total": {
            "tot": 43,
            "eff": 48,
            "pos": 67,
            "neg": 7,
            "pt": 17,
            "mas": 12,
            "neu": 6,
            "med": 5,
            "ovp": 1,
            "err": 2
          }
        }
      },
      "potencia": {
        "desde_z1": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 14,
            "eff": 7,
            "pos": 21,
            "neg": 7,
            "pt": 0,
            "mas": 3,
            "neu": 8,
            "med": 2,
            "ovp": 1,
            "err": 0
          },
          "P1": {
            "tot": 13,
            "eff": 8,
            "pos": 23,
            "neg": 15,
            "pt": 2,
            "mas": 1,
            "neu": 5,
            "med": 3,
            "ovp": 1,
            "err": 1
          },
          "total": {
            "tot": 27,
            "eff": 7,
            "pos": 22,
            "neg": 11,
            "pt": 2,
            "mas": 4,
            "neu": 13,
            "med": 5,
            "ovp": 2,
            "err": 1
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 3,
            "eff": 0,
            "pos": 33,
            "neg": 33,
            "pt": 1,
            "mas": 0,
            "neu": 1,
            "med": 0,
            "ovp": 0,
            "err": 1
          },
          "P1": {
            "tot": 9,
            "eff": -17,
            "pos": 11,
            "neg": 22,
            "pt": 0,
            "mas": 1,
            "neu": 1,
            "med": 5,
            "ovp": 0,
            "err": 2
          },
          "total": {
            "tot": 12,
            "eff": -12,
            "pos": 17,
            "neg": 25,
            "pt": 1,
            "mas": 1,
            "neu": 2,
            "med": 5,
            "ovp": 0,
            "err": 3
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 2,
            "eff": 75,
            "pos": 100,
            "neg": 0,
            "pt": 1,
            "mas": 1,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 5,
            "eff": -40,
            "pos": 0,
            "neg": 40,
            "pt": 0,
            "mas": 0,
            "neu": 1,
            "med": 2,
            "ovp": 0,
            "err": 2
          },
          "total": {
            "tot": 7,
            "eff": -7,
            "pos": 29,
            "neg": 29,
            "pt": 1,
            "mas": 1,
            "neu": 1,
            "med": 2,
            "ovp": 0,
            "err": 2
          }
        }
      }
    },
    "objetivos": {
      "sq": null,
      "rec": 34,
      "bqpos": null,
      "bqpt": null,
      "atk": null,
      "atqq": null,
      "atqhb": null,
      "atqx": null,
      "atqrp": null,
      "atqri": null,
      "atqrm": null,
      "atqtr": null
    },
    "tot_saques": 0,
    "tot_recep": 139,
    "tot_ataques": 0
  },
  {
    "num": 13,
    "nombre": "13 Rojas Caruso Mauro",
    "pos": "PUNTA",
    "color": "#3b82f6",
    "info": {},
    "ataques": [],
    "saques": [
      {
        "cod": "SM",
        "tipo": "FLOTADO",
        "orig": 6,
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
        "eff": -25,
        "tot": 4,
        "pts": 0,
        "plus": 0,
        "slash": 0,
        "err": 1,
        "video": null,
        "pts_pct": 0
      }
    ],
    "recepciones": [],
    "recepcion": {
      "flotado": {
        "desde_z1": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 2,
            "eff": 25,
            "pos": 50,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 1,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 1,
            "eff": 100,
            "pos": 100,
            "neg": 0,
            "pt": 1,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 3,
            "eff": 50,
            "pos": 67,
            "neg": 0,
            "pt": 1,
            "mas": 1,
            "neu": 1,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 1,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 1,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        }
      },
      "potencia": {
        "desde_z1": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        }
      }
    },
    "objetivos": {
      "sq": -25,
      "rec": 38,
      "bqpos": null,
      "bqpt": null,
      "atk": null,
      "atqq": null,
      "atqhb": null,
      "atqx": null,
      "atqrp": null,
      "atqri": null,
      "atqrm": null,
      "atqtr": null
    },
    "tot_saques": 4,
    "tot_recep": 4,
    "tot_ataques": 0
  },
  {
    "num": 14,
    "nombre": "14 Nielson Ramiro",
    "pos": "PUNTA",
    "color": "#3b82f6",
    "info": {},
    "ataques": [
      {
        "cod": "X5",
        "tipo": "",
        "orig": 4,
        "destinos": [
          {
            "z": 2,
            "pct": 42
          },
          {
            "z": 1,
            "pct": 22
          },
          {
            "z": 7,
            "pct": 13
          },
          {
            "z": 6,
            "pct": 7
          }
        ],
        "eff": 31,
        "tot": 120,
        "pts": 51,
        "slash": 7,
        "err": 7,
        "video": null,
        "pts_pct": 42
      },
      {
        "cod": "V5",
        "tipo": "",
        "orig": 4,
        "destinos": [
          {
            "z": 2,
            "pct": 31
          },
          {
            "z": 1,
            "pct": 30
          },
          {
            "z": 5,
            "pct": 11
          },
          {
            "z": 4,
            "pct": 9
          }
        ],
        "eff": 18,
        "tot": 77,
        "pts": 24,
        "slash": 4,
        "err": 6,
        "video": null,
        "pts_pct": 31
      },
      {
        "cod": "VP",
        "tipo": "",
        "orig": 8,
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
        "eff": 0,
        "tot": 3,
        "pts": 1,
        "slash": 0,
        "err": 1,
        "video": null,
        "pts_pct": 33
      },
      {
        "cod": "X6",
        "tipo": "",
        "orig": 2,
        "destinos": [
          {
            "z": 4,
            "pct": 100
          }
        ],
        "eff": 33,
        "tot": 3,
        "pts": 1,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 33
      },
      {
        "cod": "V6",
        "tipo": "",
        "orig": 2,
        "destinos": [
          {
            "z": 4,
            "pct": 50
          },
          {
            "z": 2,
            "pct": 50
          }
        ],
        "eff": -50,
        "tot": 2,
        "pts": 0,
        "slash": 0,
        "err": 1,
        "video": null,
        "pts_pct": 0
      },
      {
        "cod": "PR",
        "tipo": "",
        "orig": 8,
        "destinos": [],
        "eff": 100,
        "tot": 1,
        "pts": 1,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 100
      },
      {
        "cod": "XP",
        "tipo": "",
        "orig": 8,
        "destinos": [],
        "eff": -100,
        "tot": 1,
        "pts": 0,
        "slash": 0,
        "err": 1,
        "video": null,
        "pts_pct": 0
      }
    ],
    "saques": [
      {
        "cod": "SQ",
        "tipo": "POTENCIA",
        "orig": 6,
        "destinos": [
          {
            "z": 6,
            "pct": 53
          },
          {
            "z": 1,
            "pct": 33
          },
          {
            "z": 5,
            "pct": 10
          },
          {
            "z": 7,
            "pct": 2
          },
          {
            "z": 2,
            "pct": 1
          },
          {
            "z": 3,
            "pct": 1
          }
        ],
        "eff": -3,
        "tot": 100,
        "pts": 4,
        "plus": 0,
        "slash": 0,
        "err": 7,
        "video": null,
        "pts_pct": 4
      },
      {
        "cod": "SM",
        "tipo": "FLOTADO",
        "orig": 6,
        "destinos": [
          {
            "z": 6,
            "pct": 37
          },
          {
            "z": 7,
            "pct": 20
          },
          {
            "z": 5,
            "pct": 20
          },
          {
            "z": 9,
            "pct": 10
          },
          {
            "z": 8,
            "pct": 7
          },
          {
            "z": 1,
            "pct": 7
          }
        ],
        "eff": -3,
        "tot": 30,
        "pts": 0,
        "plus": 0,
        "slash": 0,
        "err": 1,
        "video": null,
        "pts_pct": 0
      }
    ],
    "recepciones": [],
    "recepcion": {
      "flotado": {
        "desde_z1": {
          "P5": {
            "tot": 21,
            "eff": 60,
            "pos": 76,
            "neg": 0,
            "pt": 9,
            "mas": 7,
            "neu": 5,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 17,
            "eff": 44,
            "pos": 65,
            "neg": 6,
            "pt": 5,
            "mas": 6,
            "neu": 5,
            "med": 0,
            "ovp": 1,
            "err": 0
          },
          "P1": {
            "tot": 5,
            "eff": 50,
            "pos": 80,
            "neg": 0,
            "pt": 1,
            "mas": 3,
            "neu": 1,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 43,
            "eff": 52,
            "pos": 72,
            "neg": 2,
            "pt": 15,
            "mas": 16,
            "neu": 11,
            "med": 0,
            "ovp": 1,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 5,
            "eff": 70,
            "pos": 100,
            "neg": 0,
            "pt": 2,
            "mas": 3,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 8,
            "eff": 56,
            "pos": 75,
            "neg": 0,
            "pt": 3,
            "mas": 3,
            "neu": 1,
            "med": 1,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 13,
            "eff": 62,
            "pos": 85,
            "neg": 0,
            "pt": 5,
            "mas": 6,
            "neu": 1,
            "med": 1,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 1,
            "eff": 50,
            "pos": 100,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 19,
            "eff": 53,
            "pos": 79,
            "neg": 5,
            "pt": 6,
            "mas": 9,
            "neu": 2,
            "med": 1,
            "ovp": 1,
            "err": 0
          },
          "P1": {
            "tot": 8,
            "eff": 50,
            "pos": 62,
            "neg": 0,
            "pt": 3,
            "mas": 2,
            "neu": 3,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 1,
            "eff": 50,
            "pos": 100,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        }
      },
      "potencia": {
        "desde_z1": {
          "P5": {
            "tot": 9,
            "eff": -22,
            "pos": 22,
            "neg": 44,
            "pt": 1,
            "mas": 1,
            "neu": 1,
            "med": 2,
            "ovp": 1,
            "err": 3
          },
          "P6": {
            "tot": 12,
            "eff": 33,
            "pos": 50,
            "neg": 8,
            "pt": 4,
            "mas": 2,
            "neu": 3,
            "med": 2,
            "ovp": 0,
            "err": 1
          },
          "P1": {
            "tot": 3,
            "eff": -33,
            "pos": 0,
            "neg": 33,
            "pt": 0,
            "mas": 0,
            "neu": 1,
            "med": 1,
            "ovp": 0,
            "err": 1
          },
          "total": {
            "tot": 24,
            "eff": 4,
            "pos": 33,
            "neg": 25,
            "pt": 5,
            "mas": 3,
            "neu": 5,
            "med": 5,
            "ovp": 1,
            "err": 5
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 4,
            "eff": 0,
            "pos": 50,
            "neg": 25,
            "pt": 0,
            "mas": 2,
            "neu": 0,
            "med": 1,
            "ovp": 0,
            "err": 1
          },
          "P6": {
            "tot": 15,
            "eff": 37,
            "pos": 60,
            "neg": 7,
            "pt": 4,
            "mas": 5,
            "neu": 2,
            "med": 3,
            "ovp": 0,
            "err": 1
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 19,
            "eff": 29,
            "pos": 58,
            "neg": 11,
            "pt": 4,
            "mas": 7,
            "neu": 2,
            "med": 4,
            "ovp": 0,
            "err": 2
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 2,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 2,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 4,
            "eff": 25,
            "pos": 50,
            "neg": 0,
            "pt": 0,
            "mas": 2,
            "neu": 0,
            "med": 2,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 4,
            "eff": 12,
            "pos": 25,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 3,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 10,
            "eff": 15,
            "pos": 30,
            "neg": 0,
            "pt": 0,
            "mas": 3,
            "neu": 5,
            "med": 2,
            "ovp": 0,
            "err": 0
          }
        }
      }
    },
    "objetivos": {
      "sq": 2,
      "rec": 40,
      "bqpos": 42,
      "bqpt": 15,
      "atk": 25,
      "atqq": null,
      "atqhb": 16,
      "atqx": 31,
      "atqrp": 25,
      "atqri": 48,
      "atqrm": 13,
      "atqtr": 23
    },
    "tot_saques": 130,
    "tot_recep": 154,
    "tot_ataques": 205
  },
  {
    "num": 15,
    "nombre": "15 Rotezzi Ramiro Lucio",
    "pos": "CENTRAL",
    "color": "#22c55e",
    "info": {},
    "ataques": [
      {
        "cod": "X1",
        "tipo": "",
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
            "pct": 22
          },
          {
            "z": 3,
            "pct": 11
          }
        ],
        "eff": 44,
        "tot": 9,
        "pts": 5,
        "slash": 0,
        "err": 1,
        "video": null,
        "pts_pct": 56
      },
      {
        "cod": "XM",
        "tipo": "",
        "orig": 3,
        "destinos": [
          {
            "z": 3,
            "pct": 44
          },
          {
            "z": 6,
            "pct": 22
          },
          {
            "z": 1,
            "pct": 22
          },
          {
            "z": 9,
            "pct": 11
          }
        ],
        "eff": 56,
        "tot": 9,
        "pts": 5,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 56
      },
      {
        "cod": "PR",
        "tipo": "",
        "orig": 8,
        "destinos": [
          {
            "z": 3,
            "pct": 100
          }
        ],
        "eff": 50,
        "tot": 2,
        "pts": 1,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 50
      }
    ],
    "saques": [
      {
        "cod": "SM",
        "tipo": "FLOTADO",
        "orig": 6,
        "destinos": [
          {
            "z": 6,
            "pct": 40
          },
          {
            "z": 1,
            "pct": 24
          },
          {
            "z": 9,
            "pct": 24
          },
          {
            "z": 3,
            "pct": 4
          },
          {
            "z": 5,
            "pct": 4
          },
          {
            "z": 8,
            "pct": 4
          }
        ],
        "eff": 0,
        "tot": 26,
        "pts": 1,
        "plus": 0,
        "slash": 0,
        "err": 1,
        "video": null,
        "pts_pct": 4
      }
    ],
    "recepciones": [],
    "recepcion": {
      "flotado": {
        "desde_z1": {
          "P5": {
            "tot": 2,
            "eff": 25,
            "pos": 50,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 1,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 1,
            "eff": 50,
            "pos": 100,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 3,
            "eff": 33,
            "pos": 67,
            "neg": 0,
            "pt": 0,
            "mas": 2,
            "neu": 1,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 1,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 1,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 1,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 1,
            "eff": 50,
            "pos": 100,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 1,
            "eff": 50,
            "pos": 100,
            "neg": 0,
            "pt": 0,
            "mas": 1,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        }
      },
      "potencia": {
        "desde_z1": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        },
        "desde_z6": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 1,
            "eff": -100,
            "pos": 0,
            "neg": 100,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 1
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 1,
            "eff": -100,
            "pos": 0,
            "neg": 100,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 1
          }
        },
        "desde_z5": {
          "P5": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P6": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "P1": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          },
          "total": {
            "tot": 0,
            "eff": 0,
            "pos": 0,
            "neg": 0,
            "pt": 0,
            "mas": 0,
            "neu": 0,
            "med": 0,
            "ovp": 0,
            "err": 0
          }
        }
      }
    },
    "objetivos": {
      "sq": 1,
      "rec": 8,
      "bqpos": 50,
      "bqpt": 10,
      "atk": 50,
      "atqq": 50,
      "atqhb": null,
      "atqx": null,
      "atqrp": 50,
      "atqri": 100,
      "atqrm": null,
      "atqtr": 43
    },
    "tot_saques": 26,
    "tot_recep": 6,
    "tot_ataques": 18
  },
  {
    "num": 17,
    "nombre": "17 Herbsommer Leonardo",
    "pos": "CENTRAL",
    "color": "#22c55e",
    "info": {},
    "ataques": [
      {
        "cod": "XM",
        "tipo": "",
        "orig": 3,
        "destinos": [
          {
            "z": 7,
            "pct": 22
          },
          {
            "z": 3,
            "pct": 22
          },
          {
            "z": 6,
            "pct": 20
          },
          {
            "z": 1,
            "pct": 15
          }
        ],
        "eff": 20,
        "tot": 40,
        "pts": 18,
        "slash": 2,
        "err": 8,
        "video": null,
        "pts_pct": 45
      },
      {
        "cod": "X1",
        "tipo": "",
        "orig": 3,
        "destinos": [
          {
            "z": 3,
            "pct": 33
          },
          {
            "z": 5,
            "pct": 27
          },
          {
            "z": 9,
            "pct": 20
          },
          {
            "z": 7,
            "pct": 7
          }
        ],
        "eff": 53,
        "tot": 15,
        "pts": 8,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 53
      },
      {
        "cod": "X7",
        "tipo": "",
        "orig": 3,
        "destinos": [
          {
            "z": 3,
            "pct": 42
          },
          {
            "z": 9,
            "pct": 25
          },
          {
            "z": 1,
            "pct": 17
          },
          {
            "z": 8,
            "pct": 8
          }
        ],
        "eff": 33,
        "tot": 12,
        "pts": 4,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 33
      },
      {
        "cod": "X6",
        "tipo": "",
        "orig": 2,
        "destinos": [
          {
            "z": 8,
            "pct": 100
          }
        ],
        "eff": 0,
        "tot": 1,
        "pts": 0,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 0
      },
      {
        "cod": "X2",
        "tipo": "",
        "orig": 3,
        "destinos": [
          {
            "z": 4,
            "pct": 100
          }
        ],
        "eff": 0,
        "tot": 1,
        "pts": 0,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 0
      },
      {
        "cod": "PR",
        "tipo": "",
        "orig": 8,
        "destinos": [
          {
            "z": 6,
            "pct": 100
          }
        ],
        "eff": 0,
        "tot": 1,
        "pts": 0,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 0
      }
    ],
    "saques": [
      {
        "cod": "SM",
        "tipo": "FLOTADO",
        "orig": 6,
        "destinos": [
          {
            "z": 5,
            "pct": 35
          },
          {
            "z": 6,
            "pct": 23
          },
          {
            "z": 7,
            "pct": 21
          },
          {
            "z": 8,
            "pct": 11
          },
          {
            "z": 1,
            "pct": 6
          },
          {
            "z": 9,
            "pct": 3
          }
        ],
        "eff": -6,
        "tot": 71,
        "pts": 0,
        "plus": 0,
        "slash": 0,
        "err": 4,
        "video": null,
        "pts_pct": 0
      }
    ],
    "recepciones": [],
    "recepcion": {},
    "objetivos": {
      "sq": 0,
      "rec": null,
      "bqpos": 44,
      "bqpt": 26,
      "atk": 29,
      "atqq": 29,
      "atqhb": null,
      "atqx": null,
      "atqrp": 22,
      "atqri": 47,
      "atqrm": null,
      "atqtr": 23
    },
    "tot_saques": 71,
    "tot_recep": 0,
    "tot_ataques": 68
  },
  {
    "num": 18,
    "nombre": "18 Acosta Wilson",
    "pos": "OPUESTO",
    "color": "#ef4444",
    "info": {},
    "ataques": [
      {
        "cod": "X6",
        "tipo": "",
        "orig": 2,
        "destinos": [
          {
            "z": 4,
            "pct": 37
          },
          {
            "z": 1,
            "pct": 23
          },
          {
            "z": 9,
            "pct": 17
          },
          {
            "z": 6,
            "pct": 7
          }
        ],
        "eff": 30,
        "tot": 30,
        "pts": 14,
        "slash": 5,
        "err": 0,
        "video": null,
        "pts_pct": 47
      },
      {
        "cod": "V6",
        "tipo": "",
        "orig": 2,
        "destinos": [
          {
            "z": 1,
            "pct": 37
          },
          {
            "z": 4,
            "pct": 22
          },
          {
            "z": 9,
            "pct": 11
          },
          {
            "z": 5,
            "pct": 7
          }
        ],
        "eff": 0,
        "tot": 27,
        "pts": 5,
        "slash": 4,
        "err": 1,
        "video": null,
        "pts_pct": 19
      },
      {
        "cod": "X8",
        "tipo": "",
        "orig": 9,
        "destinos": [
          {
            "z": 5,
            "pct": 29
          },
          {
            "z": 1,
            "pct": 25
          },
          {
            "z": 4,
            "pct": 21
          },
          {
            "z": 9,
            "pct": 12
          }
        ],
        "eff": 28,
        "tot": 25,
        "pts": 13,
        "slash": 0,
        "err": 6,
        "video": null,
        "pts_pct": 52
      },
      {
        "cod": "V8",
        "tipo": "",
        "orig": 9,
        "destinos": [
          {
            "z": 1,
            "pct": 50
          },
          {
            "z": 4,
            "pct": 33
          },
          {
            "z": 6,
            "pct": 17
          }
        ],
        "eff": 33,
        "tot": 6,
        "pts": 3,
        "slash": 1,
        "err": 0,
        "video": null,
        "pts_pct": 50
      },
      {
        "cod": "PR",
        "tipo": "",
        "orig": 8,
        "destinos": [],
        "eff": 100,
        "tot": 1,
        "pts": 1,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 100
      },
      {
        "cod": "V5",
        "tipo": "",
        "orig": 4,
        "destinos": [],
        "eff": -100,
        "tot": 1,
        "pts": 0,
        "slash": 0,
        "err": 1,
        "video": null,
        "pts_pct": 0
      }
    ],
    "saques": [
      {
        "cod": "SQ",
        "tipo": "POTENCIA",
        "orig": 6,
        "destinos": [
          {
            "z": 6,
            "pct": 42
          },
          {
            "z": 5,
            "pct": 29
          },
          {
            "z": 1,
            "pct": 21
          },
          {
            "z": 3,
            "pct": 8
          }
        ],
        "eff": -16,
        "tot": 38,
        "pts": 4,
        "plus": 0,
        "slash": 0,
        "err": 10,
        "video": null,
        "pts_pct": 11
      }
    ],
    "recepciones": [],
    "recepcion": {},
    "objetivos": {
      "sq": -12,
      "rec": null,
      "bqpos": 43,
      "bqpt": 7,
      "atk": 20,
      "atqq": null,
      "atqhb": 3,
      "atqx": 29,
      "atqrp": 23,
      "atqri": 58,
      "atqrm": 50,
      "atqtr": 8
    },
    "tot_saques": 38,
    "tot_recep": 0,
    "tot_ataques": 89
  },
  {
    "num": 19,
    "nombre": "19 Diaz Bolli Santiago",
    "pos": "ARMADOR",
    "color": "#a855f7",
    "info": {},
    "ataques": [],
    "saques": [
      {
        "cod": "SM",
        "tipo": "FLOTADO",
        "orig": 6,
        "destinos": [
          {
            "z": 6,
            "pct": 50
          },
          {
            "z": 5,
            "pct": 25
          },
          {
            "z": 7,
            "pct": 25
          }
        ],
        "eff": 0,
        "tot": 12,
        "pts": 0,
        "plus": 0,
        "slash": 0,
        "err": 0,
        "video": null,
        "pts_pct": 0
      }
    ],
    "recepciones": [],
    "recepcion": {},
    "objetivos": {
      "sq": 4,
      "rec": null,
      "bqpos": null,
      "bqpt": null,
      "atk": null,
      "atqq": null,
      "atqhb": null,
      "atqx": null,
      "atqrp": null,
      "atqri": null,
      "atqrm": null,
      "atqtr": null
    },
    "tot_saques": 12,
    "tot_recep": 0,
    "tot_ataques": 0
  }
];
const PARTIDOS_EQUIPO_OBJ = {"sq": -6, "rec": 33, "bqpos": 46, "bqpt": 20, "atk": 28, "atqq": 43, "atqhb": 15, "atqx": 29, "atqrp": 35, "atqri": 42, "atqrm": 17, "atqtr": 21};
const PARTIDOS_INDIVIDUAL = [
  {
    "nombre": "Untref",
    "rival": "Untref",
    "resultado": "V",
    "equipo_obj": {
      "sq": -11,
      "rec": 37,
      "bqpos": 42,
      "bqpt": 14,
      "atk": 41,
      "atqq": 65,
      "atqhb": 17,
      "atqx": 44,
      "atqrp": 57,
      "atqri": 29,
      "atqrm": 14,
      "atqtr": 38
    },
    "jugadores": [
      {
        "nombre": "9 Godoy Martin",
        "num": 9,
        "objetivos": {
          "sq": -8,
          "rec": 0,
          "bqpos": 58,
          "bqpt": 8,
          "atk": 100,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": 100,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 1,
                "pct": 33
              },
              {
                "z": 9,
                "pct": 28
              },
              {
                "z": 6,
                "pct": 28
              },
              {
                "z": 2,
                "pct": 6
              },
              {
                "z": 8,
                "pct": 6
              }
            ],
            "eff": -11,
            "tot": 18,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 2,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "P2",
            "tipo": "",
            "orig": 8,
            "destinos": [],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "5 Ramos Iaki",
        "num": 5,
        "objetivos": {
          "sq": -17,
          "rec": 0,
          "bqpos": 18,
          "bqpt": 6,
          "atk": 35,
          "atqq": null,
          "atqhb": 20,
          "atqx": 43,
          "atqrp": 100,
          "atqri": 25,
          "atqrm": -50,
          "atqtr": 35
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 53
              },
              {
                "z": 1,
                "pct": 21
              },
              {
                "z": 5,
                "pct": 21
              },
              {
                "z": 9,
                "pct": 5
              }
            ],
            "eff": -21,
            "tot": 19,
            "pts": 3,
            "plus": 0,
            "slash": 0,
            "err": 7,
            "video": null,
            "pts_pct": 16
          }
        ],
        "ataques": [
          {
            "cod": "X6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 1,
                "pct": 46
              },
              {
                "z": 4,
                "pct": 23
              },
              {
                "z": 9,
                "pct": 23
              },
              {
                "z": 7,
                "pct": 8
              }
            ],
            "eff": 54,
            "tot": 13,
            "pts": 8,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 62
          },
          {
            "cod": "X8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 1,
                "pct": 57
              },
              {
                "z": 5,
                "pct": 29
              },
              {
                "z": 4,
                "pct": 14
              }
            ],
            "eff": 25,
            "tot": 8,
            "pts": 4,
            "slash": 1,
            "err": 1,
            "video": null,
            "pts_pct": 50
          },
          {
            "cod": "V6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 4,
                "pct": 50
              },
              {
                "z": 1,
                "pct": 33
              },
              {
                "z": 6,
                "pct": 17
              }
            ],
            "eff": 0,
            "tot": 6,
            "pts": 2,
            "slash": 2,
            "err": 0,
            "video": null,
            "pts_pct": 33
          },
          {
            "cod": "V8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 1,
                "pct": 75
              },
              {
                "z": 4,
                "pct": 25
              }
            ],
            "eff": 50,
            "tot": 4,
            "pts": 2,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 50
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "14 Nielson Ramiro",
        "num": 14,
        "objetivos": {
          "sq": -7,
          "rec": 53,
          "bqpos": 33,
          "bqpt": 33,
          "atk": 33,
          "atqq": null,
          "atqhb": 11,
          "atqx": 41,
          "atqrp": 43,
          "atqri": 50,
          "atqrm": 50,
          "atqtr": 25
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 62
              },
              {
                "z": 1,
                "pct": 23
              },
              {
                "z": 5,
                "pct": 15
              }
            ],
            "eff": -8,
            "tot": 13,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 8,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 1,
                "pct": 69
              },
              {
                "z": 2,
                "pct": 12
              },
              {
                "z": 7,
                "pct": 6
              },
              {
                "z": 9,
                "pct": 6
              }
            ],
            "eff": 41,
            "tot": 17,
            "pts": 8,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 47
          },
          {
            "cod": "V5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 1,
                "pct": 44
              },
              {
                "z": 2,
                "pct": 33
              },
              {
                "z": 4,
                "pct": 22
              }
            ],
            "eff": 11,
            "tot": 9,
            "pts": 2,
            "slash": 1,
            "err": 0,
            "video": null,
            "pts_pct": 22
          },
          {
            "cod": "PR",
            "tipo": "",
            "orig": 8,
            "destinos": [],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 2,
                "eff": 75,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 2,
                "eff": 75,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 4,
                "eff": 38,
                "pos": 75,
                "neg": 0,
                "pt": 0,
                "mas": 3,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 2,
                "eff": 50,
                "pos": 50,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 2,
                "eff": 50,
                "pos": 50,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 2,
                "eff": 50,
                "pos": 50,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 2,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 2,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 2,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 2,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "11 Durdos Valentin",
        "num": 11,
        "objetivos": {
          "sq": -25,
          "rec": 69,
          "bqpos": 56,
          "bqpt": 11,
          "atk": 37,
          "atqq": null,
          "atqhb": 18,
          "atqx": 60,
          "atqrp": 45,
          "atqri": 50,
          "atqrm": 33,
          "atqtr": 29
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 5,
                "pct": 44
              },
              {
                "z": 6,
                "pct": 44
              },
              {
                "z": 1,
                "pct": 12
              }
            ],
            "eff": -31,
            "tot": 16,
            "pts": 2,
            "plus": 0,
            "slash": 0,
            "err": 7,
            "video": null,
            "pts_pct": 12
          },
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 1,
                "pct": 27
              },
              {
                "z": 7,
                "pct": 20
              },
              {
                "z": 2,
                "pct": 20
              },
              {
                "z": 8,
                "pct": 7
              }
            ],
            "eff": 60,
            "tot": 15,
            "pts": 9,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 60
          },
          {
            "cod": "V5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 45
              },
              {
                "z": 5,
                "pct": 18
              },
              {
                "z": 1,
                "pct": 18
              },
              {
                "z": 4,
                "pct": 9
              }
            ],
            "eff": 18,
            "tot": 11,
            "pts": 4,
            "slash": 0,
            "err": 2,
            "video": null,
            "pts_pct": 36
          },
          {
            "cod": "XP",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 3,
                "pct": 67
              },
              {
                "z": 6,
                "pct": 33
              }
            ],
            "eff": 0,
            "tot": 4,
            "pts": 1,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 25
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 2,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 2,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 2,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 2,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 2,
                "eff": 50,
                "pos": 50,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 3,
                "eff": 67,
                "pos": 67,
                "neg": 0,
                "pt": 2,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 2,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 2,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 4,
                "eff": 50,
                "pos": 75,
                "neg": 0,
                "pt": 1,
                "mas": 2,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 3,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 3,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 4,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 4,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "3 Romeo Winer Agustin",
        "num": 3,
        "objetivos": {
          "sq": null,
          "rec": 18,
          "bqpos": null,
          "bqpt": null,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [],
        "ataques": [],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 4,
                "eff": 25,
                "pos": 50,
                "neg": 25,
                "pt": 1,
                "mas": 1,
                "neu": 1,
                "med": 0,
                "ovp": 1,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 4,
                "eff": 25,
                "pos": 50,
                "neg": 25,
                "pt": 1,
                "mas": 1,
                "neu": 1,
                "med": 0,
                "ovp": 1,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 4,
                "eff": 12,
                "pos": 25,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 1,
                "med": 2,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 1,
                "eff": -50,
                "pos": 0,
                "neg": 100,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 1,
                "err": 0
              },
              "P6": {
                "tot": 5,
                "eff": 20,
                "pos": 40,
                "neg": 0,
                "pt": 0,
                "mas": 2,
                "neu": 2,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 6,
                "eff": 8,
                "pos": 33,
                "neg": 17,
                "pt": 0,
                "mas": 2,
                "neu": 2,
                "med": 1,
                "ovp": 1,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 2,
                "eff": 50,
                "pos": 50,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "15 Rotezzi Ramiro Lucio",
        "num": 15,
        "objetivos": {
          "sq": 10,
          "rec": null,
          "bqpos": 60,
          "bqpt": 20,
          "atk": 56,
          "atqq": 56,
          "atqhb": null,
          "atqx": null,
          "atqrp": 50,
          "atqri": null,
          "atqrm": null,
          "atqtr": 67
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 75
              },
              {
                "z": 1,
                "pct": 17
              },
              {
                "z": 3,
                "pct": 8
              }
            ],
            "eff": 8,
            "tot": 13,
            "pts": 1,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 8
          }
        ],
        "ataques": [
          {
            "cod": "X1",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 9,
                "pct": 50
              },
              {
                "z": 1,
                "pct": 50
              }
            ],
            "eff": 33,
            "tot": 6,
            "pts": 3,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 50
          },
          {
            "cod": "XM",
            "tipo": "",
            "orig": 3,
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
                "z": 3,
                "pct": 33
              }
            ],
            "eff": 100,
            "tot": 3,
            "pts": 3,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "2 Ojuez Agustin",
        "num": 2,
        "objetivos": {
          "sq": -7,
          "rec": null,
          "bqpos": 50,
          "bqpt": 25,
          "atk": 50,
          "atqq": 62,
          "atqhb": null,
          "atqx": -100,
          "atqrp": 40,
          "atqri": 0,
          "atqrm": null,
          "atqtr": 75
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 43
              },
              {
                "z": 5,
                "pct": 29
              },
              {
                "z": 7,
                "pct": 14
              },
              {
                "z": 8,
                "pct": 14
              }
            ],
            "eff": -14,
            "tot": 7,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "XM",
            "tipo": "",
            "orig": 3,
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
            "eff": 67,
            "tot": 3,
            "pts": 2,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 67
          },
          {
            "cod": "X1",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 8,
                "pct": 50
              },
              {
                "z": 5,
                "pct": 50
              }
            ],
            "eff": 50,
            "tot": 2,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 50
          },
          {
            "cod": "X7",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 6,
                "pct": 50
              },
              {
                "z": 7,
                "pct": 50
              }
            ],
            "eff": 50,
            "tot": 2,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 50
          },
          {
            "cod": "PR",
            "tipo": "",
            "orig": 8,
            "destinos": [],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          },
          {
            "cod": "X6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 4,
                "pct": 100
              }
            ],
            "eff": -100,
            "tot": 1,
            "pts": 0,
            "slash": 1,
            "err": 0,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "X2",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 9,
                "pct": 100
              }
            ],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "13 Rojas Caruso Mauro",
        "num": 13,
        "objetivos": {
          "sq": 0,
          "rec": 50,
          "bqpos": null,
          "bqpt": null,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 4,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 2,
                "eff": 50,
                "pos": 50,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "1 Salazar Imanol",
        "num": 1,
        "objetivos": {
          "sq": -25,
          "rec": 50,
          "bqpos": 43,
          "bqpt": 29,
          "atk": 83,
          "atqq": 83,
          "atqhb": null,
          "atqx": null,
          "atqrp": 100,
          "atqri": 0,
          "atqrm": null,
          "atqtr": 100
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 7,
                "pct": 33
              },
              {
                "z": 6,
                "pct": 33
              },
              {
                "z": 8,
                "pct": 33
              }
            ],
            "eff": 0,
            "tot": 3,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 1,
                "pct": 100
              }
            ],
            "eff": -100,
            "tot": 1,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "XM",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 1,
                "pct": 25
              },
              {
                "z": 2,
                "pct": 25
              },
              {
                "z": 9,
                "pct": 25
              },
              {
                "z": 7,
                "pct": 25
              }
            ],
            "eff": 100,
            "tot": 4,
            "pts": 4,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          },
          {
            "cod": "X7",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 8,
                "pct": 50
              },
              {
                "z": 1,
                "pct": 50
              }
            ],
            "eff": 50,
            "tot": 2,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 50
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "17 Alderete Brian",
        "num": 17,
        "objetivos": {
          "sq": 0,
          "rec": null,
          "bqpos": null,
          "bqpt": null,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [],
        "recepcion": {}
      },
      {
        "nombre": "4 Vazquez Ezequiel",
        "num": 4,
        "objetivos": {
          "sq": 0,
          "rec": null,
          "bqpos": null,
          "bqpt": null,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [],
        "recepcion": {}
      }
    ]
  },
  {
    "nombre": "Ciudad",
    "rival": "Ciudad",
    "resultado": "D",
    "equipo_obj": {
      "sq": -18,
      "rec": 20,
      "bqpos": 36,
      "bqpt": 10,
      "atk": 29,
      "atqq": 36,
      "atqhb": 36,
      "atqx": 18,
      "atqrp": 33,
      "atqri": 7,
      "atqrm": 36,
      "atqtr": 32
    },
    "jugadores": [
      {
        "nombre": "9 Godoy Martin",
        "num": 9,
        "objetivos": {
          "sq": 10,
          "rec": 0,
          "bqpos": 67,
          "bqpt": 0,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 7,
                "pct": 60
              },
              {
                "z": 8,
                "pct": 27
              },
              {
                "z": 6,
                "pct": 7
              },
              {
                "z": 3,
                "pct": 7
              }
            ],
            "eff": 7,
            "tot": 15,
            "pts": 1,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 7
          }
        ],
        "ataques": [],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "3 Romeo Winer Agustin",
        "num": 3,
        "objetivos": {
          "sq": null,
          "rec": 10,
          "bqpos": null,
          "bqpt": null,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [],
        "ataques": [],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 5,
                "eff": 30,
                "pos": 60,
                "neg": 20,
                "pt": 1,
                "mas": 2,
                "neu": 1,
                "med": 0,
                "ovp": 1,
                "err": 0
              },
              "P1": {
                "tot": 3,
                "eff": 17,
                "pos": 33,
                "neg": 33,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 1,
                "err": 0
              },
              "total": {
                "tot": 8,
                "eff": 25,
                "pos": 50,
                "neg": 25,
                "pt": 2,
                "mas": 2,
                "neu": 1,
                "med": 1,
                "ovp": 2,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 7,
                "eff": -36,
                "pos": 14,
                "neg": 43,
                "pt": 0,
                "mas": 1,
                "neu": 2,
                "med": 1,
                "ovp": 0,
                "err": 3
              },
              "P1": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 8,
                "eff": -25,
                "pos": 25,
                "neg": 38,
                "pt": 0,
                "mas": 2,
                "neu": 2,
                "med": 1,
                "ovp": 0,
                "err": 3
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 5,
                "eff": 30,
                "pos": 40,
                "neg": 0,
                "pt": 1,
                "mas": 1,
                "neu": 0,
                "med": 3,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 10,
                "eff": 15,
                "pos": 30,
                "neg": 0,
                "pt": 0,
                "mas": 3,
                "neu": 4,
                "med": 3,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 15,
                "eff": 20,
                "pos": 33,
                "neg": 0,
                "pt": 1,
                "mas": 4,
                "neu": 4,
                "med": 6,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 2,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 2,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 3,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 2,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "5 Ramos Iaki",
        "num": 5,
        "objetivos": {
          "sq": -20,
          "rec": null,
          "bqpos": 30,
          "bqpt": 20,
          "atk": 28,
          "atqq": null,
          "atqhb": 36,
          "atqx": 22,
          "atqrp": 29,
          "atqri": 17,
          "atqrm": 33,
          "atqtr": 30
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 5,
                "pct": 40
              },
              {
                "z": 6,
                "pct": 40
              },
              {
                "z": 9,
                "pct": 10
              },
              {
                "z": 1,
                "pct": 10
              }
            ],
            "eff": -27,
            "tot": 11,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 3,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 1,
                "pct": 40
              },
              {
                "z": 6,
                "pct": 30
              },
              {
                "z": 9,
                "pct": 10
              },
              {
                "z": 5,
                "pct": 10
              }
            ],
            "eff": 40,
            "tot": 10,
            "pts": 4,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 40
          },
          {
            "cod": "V6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 1,
                "pct": 57
              },
              {
                "z": 4,
                "pct": 29
              },
              {
                "z": 5,
                "pct": 14
              }
            ],
            "eff": 22,
            "tot": 9,
            "pts": 4,
            "slash": 1,
            "err": 1,
            "video": null,
            "pts_pct": 44
          },
          {
            "cod": "X8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 5,
                "pct": 43
              },
              {
                "z": 6,
                "pct": 29
              },
              {
                "z": 1,
                "pct": 29
              }
            ],
            "eff": 0,
            "tot": 8,
            "pts": 3,
            "slash": 0,
            "err": 3,
            "video": null,
            "pts_pct": 38
          },
          {
            "cod": "V8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 4,
                "pct": 40
              },
              {
                "z": 6,
                "pct": 20
              },
              {
                "z": 9,
                "pct": 20
              },
              {
                "z": 1,
                "pct": 20
              }
            ],
            "eff": 60,
            "tot": 5,
            "pts": 4,
            "slash": 1,
            "err": 0,
            "video": null,
            "pts_pct": 80
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "14 Nielson Ramiro",
        "num": 14,
        "objetivos": {
          "sq": -40,
          "rec": 45,
          "bqpos": 33,
          "bqpt": 0,
          "atk": 15,
          "atqq": null,
          "atqhb": 31,
          "atqx": 0,
          "atqrp": -33,
          "atqri": -20,
          "atqrm": 40,
          "atqtr": 31
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 40
              },
              {
                "z": 1,
                "pct": 40
              },
              {
                "z": 5,
                "pct": 20
              }
            ],
            "eff": -60,
            "tot": 5,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 3,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 7,
                "pct": 60
              },
              {
                "z": 6,
                "pct": 20
              },
              {
                "z": 9,
                "pct": 20
              }
            ],
            "eff": -20,
            "tot": 5,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 75
              },
              {
                "z": 1,
                "pct": 17
              },
              {
                "z": 7,
                "pct": 8
              }
            ],
            "eff": 0,
            "tot": 13,
            "pts": 3,
            "slash": 3,
            "err": 0,
            "video": null,
            "pts_pct": 23
          },
          {
            "cod": "V5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 36
              },
              {
                "z": 1,
                "pct": 27
              },
              {
                "z": 5,
                "pct": 9
              },
              {
                "z": 7,
                "pct": 9
              }
            ],
            "eff": 31,
            "tot": 13,
            "pts": 4,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 31
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 2,
                "eff": 75,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 2,
                "eff": 75,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 3,
                "eff": 50,
                "pos": 67,
                "neg": 0,
                "pt": 1,
                "mas": 1,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 3,
                "eff": 50,
                "pos": 67,
                "neg": 0,
                "pt": 1,
                "mas": 1,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 6,
                "eff": 33,
                "pos": 67,
                "neg": 0,
                "pt": 0,
                "mas": 4,
                "neu": 1,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 6,
                "eff": 33,
                "pos": 67,
                "neg": 0,
                "pt": 0,
                "mas": 4,
                "neu": 1,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "11 Durdos Valentin",
        "num": 11,
        "objetivos": {
          "sq": -50,
          "rec": 27,
          "bqpos": 0,
          "bqpt": 0,
          "atk": 50,
          "atqq": null,
          "atqhb": 100,
          "atqx": 38,
          "atqrp": 33,
          "atqri": 50,
          "atqrm": null,
          "atqtr": 100
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 5,
                "pct": 60
              },
              {
                "z": 6,
                "pct": 40
              }
            ],
            "eff": -80,
            "tot": 5,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 4,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 8,
                "pct": 40
              },
              {
                "z": 5,
                "pct": 20
              },
              {
                "z": 1,
                "pct": 20
              },
              {
                "z": 9,
                "pct": 20
              }
            ],
            "eff": -20,
            "tot": 5,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 38
              },
              {
                "z": 7,
                "pct": 38
              },
              {
                "z": 8,
                "pct": 12
              },
              {
                "z": 1,
                "pct": 12
              }
            ],
            "eff": 38,
            "tot": 8,
            "pts": 5,
            "slash": 1,
            "err": 1,
            "video": null,
            "pts_pct": 62
          },
          {
            "cod": "XP",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 1,
                "pct": 75
              },
              {
                "z": 7,
                "pct": 25
              }
            ],
            "eff": 50,
            "tot": 4,
            "pts": 2,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 50
          },
          {
            "cod": "V5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 1,
                "pct": 100
              }
            ],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          },
          {
            "cod": "PR",
            "tipo": "",
            "orig": 8,
            "destinos": [],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 4,
                "eff": 38,
                "pos": 75,
                "neg": 0,
                "pt": 0,
                "mas": 3,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 5,
                "eff": 40,
                "pos": 80,
                "neg": 0,
                "pt": 0,
                "mas": 4,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 2,
                "eff": 50,
                "pos": 50,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 2,
                "eff": 50,
                "pos": 50,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 2,
                "eff": 25,
                "pos": 50,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 3,
                "eff": 17,
                "pos": 33,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 2,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 3,
                "eff": 33,
                "pos": 67,
                "neg": 33,
                "pt": 1,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 1,
                "err": 0
              },
              "P6": {
                "tot": 2,
                "eff": -25,
                "pos": 50,
                "neg": 50,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 1
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 5,
                "eff": 10,
                "pos": 60,
                "neg": 40,
                "pt": 1,
                "mas": 2,
                "neu": 0,
                "med": 0,
                "ovp": 1,
                "err": 1
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "1 Salazar Imanol",
        "num": 1,
        "objetivos": {
          "sq": -17,
          "rec": null,
          "bqpos": 67,
          "bqpt": 22,
          "atk": 22,
          "atqq": 22,
          "atqhb": null,
          "atqx": null,
          "atqrp": 50,
          "atqri": 0,
          "atqrm": null,
          "atqtr": -50
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
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
                "z": 1,
                "pct": 25
              },
              {
                "z": 7,
                "pct": 25
              }
            ],
            "eff": -12,
            "tot": 8,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 100
              }
            ],
            "eff": -100,
            "tot": 1,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "XM",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 1,
                "pct": 43
              },
              {
                "z": 9,
                "pct": 29
              },
              {
                "z": 6,
                "pct": 14
              },
              {
                "z": 3,
                "pct": 14
              }
            ],
            "eff": 43,
            "tot": 7,
            "pts": 3,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 43
          },
          {
            "cod": "X7",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 6,
                "pct": 100
              }
            ],
            "eff": -50,
            "tot": 2,
            "pts": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "2 Ojuez Agustin",
        "num": 2,
        "objetivos": {
          "sq": 0,
          "rec": null,
          "bqpos": 20,
          "bqpt": 0,
          "atk": 67,
          "atqq": 67,
          "atqhb": null,
          "atqx": null,
          "atqrp": 67,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 7,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 2,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "XM",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 6,
                "pct": 50
              },
              {
                "z": 1,
                "pct": 50
              }
            ],
            "eff": 50,
            "tot": 2,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 50
          },
          {
            "cod": "X7",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 1,
                "pct": 100
              }
            ],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "17 Herbsommer Leonardo",
        "num": 17,
        "objetivos": {
          "sq": -11,
          "rec": null,
          "bqpos": 0,
          "bqpt": 0,
          "atk": 50,
          "atqq": 50,
          "atqhb": null,
          "atqx": null,
          "atqrp": 50,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 8,
                "pct": 43
              },
              {
                "z": 6,
                "pct": 29
              },
              {
                "z": 5,
                "pct": 14
              },
              {
                "z": 7,
                "pct": 14
              }
            ],
            "eff": -14,
            "tot": 7,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "XM",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 1,
                "pct": 50
              },
              {
                "z": 9,
                "pct": 50
              }
            ],
            "eff": 50,
            "tot": 2,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 50
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "13 Rojas Caruso Mauro",
        "num": 13,
        "objetivos": {
          "sq": 0,
          "rec": 25,
          "bqpos": null,
          "bqpt": null,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      }
    ]
  },
  {
    "nombre": "Ferro",
    "rival": "Ferro",
    "resultado": "D",
    "equipo_obj": {
      "sq": -5,
      "rec": 43,
      "bqpos": 38,
      "bqpt": 30,
      "atk": 16,
      "atqq": 36,
      "atqhb": 0,
      "atqx": 15,
      "atqrp": 21,
      "atqri": 0,
      "atqrm": -50,
      "atqtr": 20
    },
    "jugadores": [
      {
        "nombre": "9 Godoy Martin",
        "num": 9,
        "objetivos": {
          "sq": 13,
          "rec": 0,
          "bqpos": 17,
          "bqpt": 17,
          "atk": -100,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": -100,
          "atqrm": null,
          "atqtr": -100
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 62
              },
              {
                "z": 1,
                "pct": 31
              },
              {
                "z": 8,
                "pct": 8
              }
            ],
            "eff": 8,
            "tot": 13,
            "pts": 1,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 8
          }
        ],
        "ataques": [
          {
            "cod": "P2",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 4,
                "pct": 100
              }
            ],
            "eff": -100,
            "tot": 1,
            "pts": 0,
            "slash": 1,
            "err": 0,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "PR",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 6,
                "pct": 100
              }
            ],
            "eff": -100,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "1 Salazar Imanol",
        "num": 1,
        "objetivos": {
          "sq": 0,
          "rec": 100,
          "bqpos": 44,
          "bqpt": 33,
          "atk": 33,
          "atqq": 38,
          "atqhb": null,
          "atqx": null,
          "atqrp": 50,
          "atqri": 0,
          "atqrm": null,
          "atqtr": 29
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 1,
                "pct": 40
              },
              {
                "z": 5,
                "pct": 20
              },
              {
                "z": 7,
                "pct": 20
              },
              {
                "z": 3,
                "pct": 10
              },
              {
                "z": 6,
                "pct": 10
              }
            ],
            "eff": 0,
            "tot": 10,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X7",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 3,
                "pct": 44
              },
              {
                "z": 6,
                "pct": 11
              },
              {
                "z": 1,
                "pct": 11
              },
              {
                "z": 7,
                "pct": 11
              }
            ],
            "eff": 44,
            "tot": 9,
            "pts": 6,
            "slash": 2,
            "err": 0,
            "video": null,
            "pts_pct": 67
          },
          {
            "cod": "X1",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 5,
                "pct": 50
              },
              {
                "z": 3,
                "pct": 50
              }
            ],
            "eff": 0,
            "tot": 2,
            "pts": 1,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 50
          },
          {
            "cod": "PR",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 3,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "X6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 3,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "X2",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 7,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "XM",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 6,
                "pct": 100
              }
            ],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "12 Zanotti Juan Cruz",
        "num": 12,
        "objetivos": {
          "sq": null,
          "rec": 36,
          "bqpos": null,
          "bqpt": null,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [],
        "ataques": [],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 4,
                "eff": 12,
                "pos": 50,
                "neg": 25,
                "pt": 0,
                "mas": 2,
                "neu": 0,
                "med": 1,
                "ovp": 1,
                "err": 0
              },
              "P1": {
                "tot": 11,
                "eff": 55,
                "pos": 82,
                "neg": 0,
                "pt": 3,
                "mas": 6,
                "neu": 1,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 15,
                "eff": 43,
                "pos": 73,
                "neg": 7,
                "pt": 3,
                "mas": 8,
                "neu": 1,
                "med": 2,
                "ovp": 1,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 5,
                "eff": 40,
                "pos": 60,
                "neg": 20,
                "pt": 3,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 1
              },
              "P1": {
                "tot": 4,
                "eff": 75,
                "pos": 100,
                "neg": 0,
                "pt": 2,
                "mas": 2,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 10,
                "eff": 55,
                "pos": 80,
                "neg": 10,
                "pt": 5,
                "mas": 3,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 1
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 3,
                "eff": 17,
                "pos": 33,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 1,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 4,
                "eff": 62,
                "pos": 75,
                "neg": 25,
                "pt": 3,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 1,
                "err": 0
              },
              "P1": {
                "tot": 2,
                "eff": -25,
                "pos": 50,
                "neg": 50,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 1
              },
              "total": {
                "tot": 9,
                "eff": 28,
                "pos": 56,
                "neg": 22,
                "pt": 3,
                "mas": 2,
                "neu": 1,
                "med": 1,
                "ovp": 1,
                "err": 1
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 2,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 3,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 2,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": -100,
                "pos": 0,
                "neg": 100,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 1
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": -100,
                "pos": 0,
                "neg": 100,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 1
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "5 Ramos Iaki",
        "num": 5,
        "objetivos": {
          "sq": -38,
          "rec": null,
          "bqpos": 12,
          "bqpt": 0,
          "atk": -4,
          "atqq": null,
          "atqhb": -30,
          "atqx": 6,
          "atqrp": 0,
          "atqri": -50,
          "atqrm": -50,
          "atqtr": 8
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 5,
                "pct": 60
              },
              {
                "z": 1,
                "pct": 40
              }
            ],
            "eff": -40,
            "tot": 10,
            "pts": 1,
            "plus": 0,
            "slash": 0,
            "err": 5,
            "video": null,
            "pts_pct": 10
          }
        ],
        "ataques": [
          {
            "cod": "X6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 2,
                "pct": 22
              },
              {
                "z": 4,
                "pct": 22
              },
              {
                "z": 6,
                "pct": 22
              },
              {
                "z": 5,
                "pct": 22
              }
            ],
            "eff": 0,
            "tot": 9,
            "pts": 2,
            "slash": 0,
            "err": 2,
            "video": null,
            "pts_pct": 22
          },
          {
            "cod": "X8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 4,
                "pct": 43
              },
              {
                "z": 5,
                "pct": 29
              },
              {
                "z": 1,
                "pct": 14
              },
              {
                "z": 9,
                "pct": 14
              }
            ],
            "eff": 14,
            "tot": 7,
            "pts": 3,
            "slash": 2,
            "err": 0,
            "video": null,
            "pts_pct": 43
          },
          {
            "cod": "V6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 4,
                "pct": 60
              },
              {
                "z": 1,
                "pct": 40
              }
            ],
            "eff": -67,
            "tot": 6,
            "pts": 0,
            "slash": 2,
            "err": 2,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "V8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 4,
                "pct": 50
              },
              {
                "z": 1,
                "pct": 25
              },
              {
                "z": 9,
                "pct": 25
              }
            ],
            "eff": 25,
            "tot": 4,
            "pts": 2,
            "slash": 1,
            "err": 0,
            "video": null,
            "pts_pct": 50
          },
          {
            "cod": "PR",
            "tipo": "",
            "orig": 8,
            "destinos": [],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "14 Nielson Ramiro",
        "num": 14,
        "objetivos": {
          "sq": 12,
          "rec": 42,
          "bqpos": 33,
          "bqpt": 17,
          "atk": 14,
          "atqq": null,
          "atqhb": 11,
          "atqx": 15,
          "atqrp": 11,
          "atqri": 50,
          "atqrm": -67,
          "atqtr": 38
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 53
              },
              {
                "z": 1,
                "pct": 42
              },
              {
                "z": 5,
                "pct": 5
              }
            ],
            "eff": 5,
            "tot": 19,
            "pts": 1,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 5
          },
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 83
              },
              {
                "z": 5,
                "pct": 17
              }
            ],
            "eff": 0,
            "tot": 6,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 38
              },
              {
                "z": 1,
                "pct": 23
              },
              {
                "z": 7,
                "pct": 23
              },
              {
                "z": 5,
                "pct": 15
              }
            ],
            "eff": 15,
            "tot": 13,
            "pts": 4,
            "slash": 0,
            "err": 2,
            "video": null,
            "pts_pct": 31
          },
          {
            "cod": "V5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 38
              },
              {
                "z": 5,
                "pct": 25
              },
              {
                "z": 6,
                "pct": 12
              },
              {
                "z": 7,
                "pct": 12
              }
            ],
            "eff": 12,
            "tot": 8,
            "pts": 3,
            "slash": 2,
            "err": 0,
            "video": null,
            "pts_pct": 38
          },
          {
            "cod": "VP",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 5,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 2,
                "eff": 75,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 3,
                "eff": 83,
                "pos": 100,
                "neg": 0,
                "pt": 2,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 4,
                "eff": 50,
                "pos": 75,
                "neg": 25,
                "pt": 2,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 1,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 4,
                "eff": 50,
                "pos": 75,
                "neg": 25,
                "pt": 2,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 1,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 2,
                "eff": 0,
                "pos": 50,
                "neg": 50,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 1
              },
              "P6": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 3,
                "eff": 33,
                "pos": 67,
                "neg": 33,
                "pt": 2,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 1
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": -100,
                "pos": 0,
                "neg": 100,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 1
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": -100,
                "pos": 0,
                "neg": 100,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 1
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "11 Durdos Valentin",
        "num": 11,
        "objetivos": {
          "sq": -32,
          "rec": 52,
          "bqpos": 43,
          "bqpt": 43,
          "atk": 19,
          "atqq": null,
          "atqhb": 22,
          "atqx": 21,
          "atqrp": 20,
          "atqri": 100,
          "atqrm": 0,
          "atqtr": 16
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 57
              },
              {
                "z": 5,
                "pct": 43
              }
            ],
            "eff": -43,
            "tot": 7,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 3,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 1,
                "pct": 33
              },
              {
                "z": 7,
                "pct": 33
              },
              {
                "z": 5,
                "pct": 33
              }
            ],
            "eff": -33,
            "tot": 3,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 45
              },
              {
                "z": 5,
                "pct": 18
              },
              {
                "z": 6,
                "pct": 14
              },
              {
                "z": 4,
                "pct": 9
              }
            ],
            "eff": 17,
            "tot": 23,
            "pts": 7,
            "slash": 1,
            "err": 2,
            "video": null,
            "pts_pct": 30
          },
          {
            "cod": "V5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 43
              },
              {
                "z": 1,
                "pct": 14
              },
              {
                "z": 5,
                "pct": 14
              },
              {
                "z": 4,
                "pct": 14
              }
            ],
            "eff": 29,
            "tot": 7,
            "pts": 3,
            "slash": 1,
            "err": 0,
            "video": null,
            "pts_pct": 43
          },
          {
            "cod": "VP",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 5,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 2,
            "pts": 1,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 50
          },
          {
            "cod": "XP",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 6,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 2,
            "pts": 1,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 50
          },
          {
            "cod": "PR",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 3,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "X6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 2,
                "pct": 100
              }
            ],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 2,
                "eff": 0,
                "pos": 50,
                "neg": 50,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 1,
                "err": 0
              },
              "P6": {
                "tot": 6,
                "eff": 58,
                "pos": 83,
                "neg": 17,
                "pt": 4,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 1
              },
              "P1": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 9,
                "eff": 44,
                "pos": 78,
                "neg": 22,
                "pt": 4,
                "mas": 3,
                "neu": 0,
                "med": 0,
                "ovp": 1,
                "err": 1
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 5,
                "eff": 60,
                "pos": 80,
                "neg": 0,
                "pt": 2,
                "mas": 2,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 3,
                "eff": 33,
                "pos": 33,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 1,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 9,
                "eff": 50,
                "pos": 67,
                "neg": 0,
                "pt": 3,
                "mas": 3,
                "neu": 2,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 5,
                "eff": 70,
                "pos": 100,
                "neg": 0,
                "pt": 2,
                "mas": 3,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 5,
                "eff": 70,
                "pos": 100,
                "neg": 0,
                "pt": 2,
                "mas": 3,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 3,
                "eff": 67,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 2,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 2,
                "eff": 25,
                "pos": 50,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "17 Herbsommer Leonardo",
        "num": 17,
        "objetivos": {
          "sq": 0,
          "rec": null,
          "bqpos": 25,
          "bqpt": 25,
          "atk": 10,
          "atqq": 10,
          "atqhb": null,
          "atqx": null,
          "atqrp": 10,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 33
              },
              {
                "z": 1,
                "pct": 22
              },
              {
                "z": 5,
                "pct": 22
              },
              {
                "z": 7,
                "pct": 11
              },
              {
                "z": 9,
                "pct": 11
              }
            ],
            "eff": 0,
            "tot": 9,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X1",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 3,
                "pct": 33
              },
              {
                "z": 5,
                "pct": 17
              },
              {
                "z": 9,
                "pct": 17
              },
              {
                "z": 7,
                "pct": 17
              }
            ],
            "eff": 33,
            "tot": 6,
            "pts": 2,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 33
          },
          {
            "cod": "XM",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 3,
                "pct": 50
              },
              {
                "z": 7,
                "pct": 25
              },
              {
                "z": 6,
                "pct": 25
              }
            ],
            "eff": -25,
            "tot": 4,
            "pts": 1,
            "slash": 1,
            "err": 1,
            "video": null,
            "pts_pct": 25
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "13 Rojas Caruso Mauro",
        "num": 13,
        "objetivos": {
          "sq": -50,
          "rec": null,
          "bqpos": null,
          "bqpt": null,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 9,
                "pct": 50
              },
              {
                "z": 6,
                "pct": 50
              }
            ],
            "eff": -50,
            "tot": 2,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [],
        "recepcion": {}
      },
      {
        "nombre": "4 Vazquez Ezequiel",
        "num": 4,
        "objetivos": {
          "sq": 0,
          "rec": null,
          "bqpos": 50,
          "bqpt": 0,
          "atk": 100,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": 100
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 7,
                "pct": 33
              },
              {
                "z": 1,
                "pct": 33
              },
              {
                "z": 5,
                "pct": 17
              },
              {
                "z": 6,
                "pct": 17
              }
            ],
            "eff": 0,
            "tot": 6,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "P2",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 4,
                "pct": 50
              },
              {
                "z": 3,
                "pct": 50
              }
            ],
            "eff": 100,
            "tot": 2,
            "pts": 2,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "18 Acosta Wilson",
        "num": 18,
        "objetivos": {
          "sq": null,
          "rec": null,
          "bqpos": null,
          "bqpt": null,
          "atk": 0,
          "atqq": null,
          "atqhb": null,
          "atqx": 0,
          "atqrp": 0,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [],
        "ataques": [
          {
            "cod": "X6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 4,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "2 Ojuez Agustin",
        "num": 2,
        "objetivos": {
          "sq": -33,
          "rec": 100,
          "bqpos": 100,
          "bqpt": 100,
          "atk": 80,
          "atqq": 80,
          "atqhb": null,
          "atqx": null,
          "atqrp": 80,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 1,
                "pct": 67
              },
              {
                "z": 6,
                "pct": 33
              }
            ],
            "eff": -33,
            "tot": 3,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X1",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 6,
                "pct": 50
              },
              {
                "z": 3,
                "pct": 25
              },
              {
                "z": 4,
                "pct": 25
              }
            ],
            "eff": 75,
            "tot": 4,
            "pts": 3,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 75
          },
          {
            "cod": "XM",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 3,
                "pct": 100
              }
            ],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      }
    ]
  },
  {
    "nombre": "Hacoaj",
    "rival": "Hacoaj",
    "resultado": "V",
    "equipo_obj": {
      "sq": -6,
      "rec": 40,
      "bqpos": 48,
      "bqpt": 13,
      "atk": 30,
      "atqq": 39,
      "atqhb": 20,
      "atqx": 34,
      "atqrp": 45,
      "atqri": 53,
      "atqrm": 17,
      "atqtr": 16
    },
    "jugadores": [
      {
        "nombre": "4 Vazquez Ezequiel",
        "num": 4,
        "objetivos": {
          "sq": -8,
          "rec": 0,
          "bqpos": 50,
          "bqpt": 6,
          "atk": 0,
          "atqq": null,
          "atqhb": 0,
          "atqx": null,
          "atqrp": null,
          "atqri": 0,
          "atqrm": null,
          "atqtr": 0
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 9,
                "pct": 41
              },
              {
                "z": 1,
                "pct": 27
              },
              {
                "z": 6,
                "pct": 23
              },
              {
                "z": 8,
                "pct": 9
              }
            ],
            "eff": -9,
            "tot": 22,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 2,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "P2",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 3,
                "pct": 50
              },
              {
                "z": 2,
                "pct": 25
              },
              {
                "z": 8,
                "pct": 25
              }
            ],
            "eff": 0,
            "tot": 4,
            "pts": 1,
            "slash": 1,
            "err": 0,
            "video": null,
            "pts_pct": 25
          },
          {
            "cod": "V8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 5,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "14 Nielson Ramiro",
        "num": 14,
        "objetivos": {
          "sq": 17,
          "rec": 59,
          "bqpos": 47,
          "bqpt": 13,
          "atk": 30,
          "atqq": null,
          "atqhb": 18,
          "atqx": 45,
          "atqrp": 44,
          "atqri": 75,
          "atqrm": 50,
          "atqtr": 16
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 1,
                "pct": 40
              },
              {
                "z": 6,
                "pct": 30
              },
              {
                "z": 7,
                "pct": 20
              },
              {
                "z": 5,
                "pct": 10
              }
            ],
            "eff": 20,
            "tot": 10,
            "pts": 2,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 20
          },
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 5,
                "pct": 50
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
                "z": 6,
                "pct": 17
              }
            ],
            "eff": 0,
            "tot": 6,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 47
              },
              {
                "z": 1,
                "pct": 16
              },
              {
                "z": 8,
                "pct": 11
              },
              {
                "z": 7,
                "pct": 11
              }
            ],
            "eff": 47,
            "tot": 19,
            "pts": 10,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 53
          },
          {
            "cod": "V5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 43
              },
              {
                "z": 1,
                "pct": 21
              },
              {
                "z": 4,
                "pct": 14
              },
              {
                "z": 6,
                "pct": 7
              }
            ],
            "eff": 27,
            "tot": 15,
            "pts": 7,
            "slash": 0,
            "err": 3,
            "video": null,
            "pts_pct": 47
          },
          {
            "cod": "X6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 4,
                "pct": 100
              }
            ],
            "eff": 33,
            "tot": 3,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 33
          },
          {
            "cod": "V6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 4,
                "pct": 50
              },
              {
                "z": 2,
                "pct": 50
              }
            ],
            "eff": -50,
            "tot": 2,
            "pts": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "XP",
            "tipo": "",
            "orig": 8,
            "destinos": [],
            "eff": -100,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 5,
                "eff": 80,
                "pos": 100,
                "neg": 0,
                "pt": 3,
                "mas": 2,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 5,
                "eff": 40,
                "pos": 60,
                "neg": 0,
                "pt": 1,
                "mas": 2,
                "neu": 2,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 10,
                "eff": 60,
                "pos": 80,
                "neg": 0,
                "pt": 4,
                "mas": 4,
                "neu": 2,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 3,
                "eff": 67,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 2,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 5,
                "eff": 60,
                "pos": 80,
                "neg": 0,
                "pt": 2,
                "mas": 2,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 8,
                "eff": 62,
                "pos": 88,
                "neg": 0,
                "pt": 3,
                "mas": 4,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 2,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 2,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 4,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 4,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 6,
                "eff": 67,
                "pos": 100,
                "neg": 0,
                "pt": 2,
                "mas": 4,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 2,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 2,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 2,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 2,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "12 Zanotti Juan Cruz",
        "num": 12,
        "objetivos": {
          "sq": null,
          "rec": 35,
          "bqpos": null,
          "bqpt": null,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [],
        "ataques": [],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 2,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 2,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 3,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 3,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 3,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 3,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 4,
                "eff": 12,
                "pos": 25,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 3,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 5,
                "eff": 60,
                "pos": 80,
                "neg": 0,
                "pt": 2,
                "mas": 2,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 8,
                "eff": 62,
                "pos": 75,
                "neg": 0,
                "pt": 4,
                "mas": 2,
                "neu": 2,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 14,
                "eff": 61,
                "pos": 79,
                "neg": 0,
                "pt": 6,
                "mas": 5,
                "neu": 2,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 7,
                "eff": 0,
                "pos": 14,
                "neg": 14,
                "pt": 0,
                "mas": 1,
                "neu": 4,
                "med": 1,
                "ovp": 1,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 7,
                "eff": 0,
                "pos": 14,
                "neg": 14,
                "pt": 0,
                "mas": 1,
                "neu": 4,
                "med": 1,
                "ovp": 1,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 5,
                "eff": -10,
                "pos": 20,
                "neg": 20,
                "pt": 0,
                "mas": 1,
                "neu": 1,
                "med": 2,
                "ovp": 0,
                "err": 1
              },
              "total": {
                "tot": 5,
                "eff": -10,
                "pos": 20,
                "neg": 20,
                "pt": 0,
                "mas": 1,
                "neu": 1,
                "med": 2,
                "ovp": 0,
                "err": 1
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "5 Ramos Iaki",
        "num": 5,
        "objetivos": {
          "sq": -80,
          "rec": 50,
          "bqpos": 71,
          "bqpt": 29,
          "atk": 33,
          "atqq": null,
          "atqhb": 20,
          "atqx": 46,
          "atqrp": 60,
          "atqri": 0,
          "atqrm": 0,
          "atqtr": 25
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 1,
                "pct": 100
              }
            ],
            "eff": -100,
            "tot": 3,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 3,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 100
              }
            ],
            "eff": -50,
            "tot": 2,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 5,
                "pct": 62
              },
              {
                "z": 4,
                "pct": 25
              },
              {
                "z": 6,
                "pct": 12
              }
            ],
            "eff": 50,
            "tot": 8,
            "pts": 5,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 62
          },
          {
            "cod": "V6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 5,
                "pct": 29
              },
              {
                "z": 1,
                "pct": 29
              },
              {
                "z": 9,
                "pct": 14
              },
              {
                "z": 4,
                "pct": 14
              }
            ],
            "eff": 29,
            "tot": 7,
            "pts": 3,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 43
          },
          {
            "cod": "X6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 4,
                "pct": 40
              },
              {
                "z": 1,
                "pct": 20
              },
              {
                "z": 6,
                "pct": 20
              },
              {
                "z": 3,
                "pct": 20
              }
            ],
            "eff": 20,
            "tot": 5,
            "pts": 2,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 40
          },
          {
            "cod": "V8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 5,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 2,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "X5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 8,
                "pct": 100
              }
            ],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          },
          {
            "cod": "V5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "15 Rotezzi Ramiro Lucio",
        "num": 15,
        "objetivos": {
          "sq": -8,
          "rec": 8,
          "bqpos": 40,
          "bqpt": 0,
          "atk": 45,
          "atqq": 44,
          "atqhb": null,
          "atqx": null,
          "atqrp": 50,
          "atqri": 100,
          "atqrm": null,
          "atqtr": 25
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 9,
                "pct": 46
              },
              {
                "z": 1,
                "pct": 31
              },
              {
                "z": 5,
                "pct": 8
              },
              {
                "z": 6,
                "pct": 8
              },
              {
                "z": 8,
                "pct": 8
              }
            ],
            "eff": -8,
            "tot": 13,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "XM",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 3,
                "pct": 50
              },
              {
                "z": 1,
                "pct": 33
              },
              {
                "z": 6,
                "pct": 17
              }
            ],
            "eff": 33,
            "tot": 6,
            "pts": 2,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 33
          },
          {
            "cod": "X1",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 7,
                "pct": 67
              },
              {
                "z": 3,
                "pct": 33
              }
            ],
            "eff": 67,
            "tot": 3,
            "pts": 2,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 67
          },
          {
            "cod": "PR",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 3,
                "pct": 100
              }
            ],
            "eff": 50,
            "tot": 2,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 50
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 2,
                "eff": 25,
                "pos": 50,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 3,
                "eff": 33,
                "pos": 67,
                "neg": 0,
                "pt": 0,
                "mas": 2,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": -100,
                "pos": 0,
                "neg": 100,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 1
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": -100,
                "pos": 0,
                "neg": 100,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 1
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "2 Ojuez Agustin",
        "num": 2,
        "objetivos": {
          "sq": -10,
          "rec": -25,
          "bqpos": 62,
          "bqpt": 23,
          "atk": 40,
          "atqq": 37,
          "atqhb": null,
          "atqx": null,
          "atqrp": 39,
          "atqri": 0,
          "atqrm": null,
          "atqtr": 100
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 9,
                "pct": 30
              },
              {
                "z": 1,
                "pct": 20
              },
              {
                "z": 6,
                "pct": 20
              },
              {
                "z": 8,
                "pct": 10
              },
              {
                "z": 7,
                "pct": 10
              },
              {
                "z": 5,
                "pct": 10
              }
            ],
            "eff": -10,
            "tot": 10,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X1",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 5,
                "pct": 33
              },
              {
                "z": 6,
                "pct": 25
              },
              {
                "z": 7,
                "pct": 17
              },
              {
                "z": 3,
                "pct": 17
              }
            ],
            "eff": 33,
            "tot": 12,
            "pts": 6,
            "slash": 0,
            "err": 2,
            "video": null,
            "pts_pct": 50
          },
          {
            "cod": "XM",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 1,
                "pct": 50
              },
              {
                "z": 3,
                "pct": 33
              },
              {
                "z": 6,
                "pct": 17
              }
            ],
            "eff": 50,
            "tot": 6,
            "pts": 4,
            "slash": 1,
            "err": 0,
            "video": null,
            "pts_pct": 67
          },
          {
            "cod": "PR",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 3,
                "pct": 100
              }
            ],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          },
          {
            "cod": "X2",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 6,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 1,
                "eff": -50,
                "pos": 0,
                "neg": 100,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 1,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 2,
                "eff": -25,
                "pos": 0,
                "neg": 50,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 1,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "11 Durdos Valentin",
        "num": 11,
        "objetivos": {
          "sq": -6,
          "rec": 41,
          "bqpos": 0,
          "bqpt": 0,
          "atk": 25,
          "atqq": null,
          "atqhb": 11,
          "atqx": 24,
          "atqrp": 50,
          "atqri": 100,
          "atqrm": 0,
          "atqtr": 9
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 9,
                "pct": 35
              },
              {
                "z": 5,
                "pct": 29
              },
              {
                "z": 1,
                "pct": 29
              },
              {
                "z": 7,
                "pct": 6
              }
            ],
            "eff": -6,
            "tot": 17,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 35
              },
              {
                "z": 6,
                "pct": 29
              },
              {
                "z": 7,
                "pct": 24
              },
              {
                "z": 3,
                "pct": 12
              }
            ],
            "eff": 24,
            "tot": 17,
            "pts": 6,
            "slash": 0,
            "err": 2,
            "video": null,
            "pts_pct": 35
          },
          {
            "cod": "V5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 62
              },
              {
                "z": 1,
                "pct": 12
              },
              {
                "z": 4,
                "pct": 12
              },
              {
                "z": 3,
                "pct": 12
              }
            ],
            "eff": 12,
            "tot": 8,
            "pts": 2,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 25
          },
          {
            "cod": "XP",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 3,
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
            "eff": 50,
            "tot": 4,
            "pts": 3,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 75
          },
          {
            "cod": "PR",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 2,
                "pct": 50
              },
              {
                "z": 7,
                "pct": 50
              }
            ],
            "eff": 50,
            "tot": 2,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 50
          },
          {
            "cod": "VP",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 4,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 2,
                "eff": 75,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 2,
                "eff": 75,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 2,
                "eff": -25,
                "pos": 0,
                "neg": 50,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 1,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 2,
                "eff": -25,
                "pos": 0,
                "neg": 50,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 1,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 5,
                "eff": 30,
                "pos": 60,
                "neg": 20,
                "pt": 1,
                "mas": 2,
                "neu": 1,
                "med": 0,
                "ovp": 1,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 5,
                "eff": 30,
                "pos": 60,
                "neg": 20,
                "pt": 1,
                "mas": 2,
                "neu": 1,
                "med": 0,
                "ovp": 1,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "3 Romeo Winer Agustin",
        "num": 3,
        "objetivos": {
          "sq": -17,
          "rec": null,
          "bqpos": null,
          "bqpt": null,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 9,
                "pct": 50
              },
              {
                "z": 7,
                "pct": 33
              },
              {
                "z": 6,
                "pct": 17
              }
            ],
            "eff": -17,
            "tot": 6,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [],
        "recepcion": {}
      },
      {
        "nombre": "9 Godoy Martin",
        "num": 9,
        "objetivos": {
          "sq": 0,
          "rec": null,
          "bqpos": null,
          "bqpt": null,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
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
            "eff": 0,
            "tot": 2,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [],
        "recepcion": {}
      },
      {
        "nombre": "18 Acosta Wilson",
        "num": 18,
        "objetivos": {
          "sq": 11,
          "rec": null,
          "bqpos": 0,
          "bqpt": 0,
          "atk": 25,
          "atqq": null,
          "atqhb": 50,
          "atqx": 17,
          "atqrp": 0,
          "atqri": 50,
          "atqrm": null,
          "atqtr": 20
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 56
              },
              {
                "z": 5,
                "pct": 22
              },
              {
                "z": 1,
                "pct": 22
              }
            ],
            "eff": 0,
            "tot": 9,
            "pts": 2,
            "plus": 0,
            "slash": 0,
            "err": 2,
            "video": null,
            "pts_pct": 22
          }
        ],
        "ataques": [
          {
            "cod": "X8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 1,
                "pct": 25
              },
              {
                "z": 5,
                "pct": 25
              },
              {
                "z": 4,
                "pct": 25
              },
              {
                "z": 3,
                "pct": 12
              }
            ],
            "eff": 11,
            "tot": 9,
            "pts": 4,
            "slash": 0,
            "err": 3,
            "video": null,
            "pts_pct": 44
          },
          {
            "cod": "V6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 4,
                "pct": 33
              },
              {
                "z": 1,
                "pct": 33
              },
              {
                "z": 9,
                "pct": 33
              }
            ],
            "eff": 33,
            "tot": 3,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 33
          },
          {
            "cod": "X6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 4,
                "pct": 100
              }
            ],
            "eff": 33,
            "tot": 3,
            "pts": 2,
            "slash": 1,
            "err": 0,
            "video": null,
            "pts_pct": 67
          },
          {
            "cod": "V8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 4,
                "pct": 100
              }
            ],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          }
        ],
        "recepcion": {}
      }
    ]
  },
  {
    "nombre": "Velez",
    "rival": "Velez",
    "resultado": "V",
    "equipo_obj": {
      "sq": 1,
      "rec": 40,
      "bqpos": 41,
      "bqpt": 20,
      "atk": 31,
      "atqq": 50,
      "atqhb": 4,
      "atqx": 35,
      "atqrp": 33,
      "atqri": 53,
      "atqrm": 40,
      "atqtr": 20
    },
    "jugadores": [
      {
        "nombre": "14 Nielson Ramiro",
        "num": 14,
        "objetivos": {
          "sq": 7,
          "rec": 50,
          "bqpos": 33,
          "bqpt": 17,
          "atk": 45,
          "atqq": null,
          "atqhb": 33,
          "atqx": 50,
          "atqrp": 27,
          "atqri": 50,
          "atqrm": 100,
          "atqtr": 50
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 62
              },
              {
                "z": 1,
                "pct": 31
              },
              {
                "z": 5,
                "pct": 6
              }
            ],
            "eff": 0,
            "tot": 16,
            "pts": 1,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 6
          },
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 1,
                "pct": 67
              },
              {
                "z": 6,
                "pct": 33
              }
            ],
            "eff": 0,
            "tot": 3,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 54
              },
              {
                "z": 1,
                "pct": 17
              },
              {
                "z": 7,
                "pct": 8
              },
              {
                "z": 6,
                "pct": 8
              }
            ],
            "eff": 50,
            "tot": 24,
            "pts": 13,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 54
          },
          {
            "cod": "V5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 44
              },
              {
                "z": 1,
                "pct": 22
              },
              {
                "z": 4,
                "pct": 22
              },
              {
                "z": 6,
                "pct": 11
              }
            ],
            "eff": 33,
            "tot": 9,
            "pts": 4,
            "slash": 1,
            "err": 0,
            "video": null,
            "pts_pct": 44
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 10,
                "eff": 65,
                "pos": 80,
                "neg": 0,
                "pt": 5,
                "mas": 3,
                "neu": 2,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 2,
                "eff": 50,
                "pos": 50,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 12,
                "eff": 62,
                "pos": 75,
                "neg": 0,
                "pt": 6,
                "mas": 3,
                "neu": 3,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 2,
                "eff": 75,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 3,
                "eff": 83,
                "pos": 100,
                "neg": 0,
                "pt": 2,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 6,
                "eff": 75,
                "pos": 83,
                "neg": 0,
                "pt": 4,
                "mas": 1,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 6,
                "eff": 75,
                "pos": 83,
                "neg": 0,
                "pt": 4,
                "mas": 1,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 2,
                "eff": -50,
                "pos": 0,
                "neg": 50,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 1
              },
              "P6": {
                "tot": 5,
                "eff": 50,
                "pos": 60,
                "neg": 0,
                "pt": 2,
                "mas": 1,
                "neu": 0,
                "med": 2,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 7,
                "eff": 21,
                "pos": 43,
                "neg": 14,
                "pt": 2,
                "mas": 1,
                "neu": 0,
                "med": 3,
                "ovp": 0,
                "err": 1
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 3,
                "eff": 17,
                "pos": 33,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 2,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 5,
                "eff": 10,
                "pos": 20,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 3,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "18 Acosta Wilson",
        "num": 18,
        "objetivos": {
          "sq": -31,
          "rec": null,
          "bqpos": 50,
          "bqpt": 25,
          "atk": 30,
          "atqq": null,
          "atqhb": -12,
          "atqx": 43,
          "atqrp": 38,
          "atqri": 40,
          "atqrm": 0,
          "atqtr": 27
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 1,
                "pct": 42
              },
              {
                "z": 5,
                "pct": 42
              },
              {
                "z": 6,
                "pct": 17
              }
            ],
            "eff": -33,
            "tot": 12,
            "pts": 1,
            "plus": 0,
            "slash": 0,
            "err": 5,
            "video": null,
            "pts_pct": 8
          }
        ],
        "ataques": [
          {
            "cod": "X6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 4,
                "pct": 50
              },
              {
                "z": 1,
                "pct": 17
              },
              {
                "z": 9,
                "pct": 8
              },
              {
                "z": 2,
                "pct": 8
              }
            ],
            "eff": 42,
            "tot": 12,
            "pts": 7,
            "slash": 2,
            "err": 0,
            "video": null,
            "pts_pct": 58
          },
          {
            "cod": "X8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 1,
                "pct": 33
              },
              {
                "z": 4,
                "pct": 33
              },
              {
                "z": 5,
                "pct": 11
              },
              {
                "z": 6,
                "pct": 11
              }
            ],
            "eff": 44,
            "tot": 9,
            "pts": 6,
            "slash": 0,
            "err": 2,
            "video": null,
            "pts_pct": 67
          },
          {
            "cod": "V6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 4,
                "pct": 67
              },
              {
                "z": 7,
                "pct": 17
              },
              {
                "z": 5,
                "pct": 17
              }
            ],
            "eff": 0,
            "tot": 6,
            "pts": 1,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 17
          },
          {
            "cod": "V8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 4,
                "pct": 50
              },
              {
                "z": 1,
                "pct": 50
              }
            ],
            "eff": -50,
            "tot": 2,
            "pts": 0,
            "slash": 1,
            "err": 0,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "PR",
            "tipo": "",
            "orig": 8,
            "destinos": [],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "11 Durdos Valentin",
        "num": 11,
        "objetivos": {
          "sq": -50,
          "rec": 31,
          "bqpos": 20,
          "bqpt": 0,
          "atk": 6,
          "atqq": null,
          "atqhb": -12,
          "atqx": 20,
          "atqrp": 11,
          "atqri": 60,
          "atqrm": 20,
          "atqtr": -25
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 67
              },
              {
                "z": 7,
                "pct": 33
              }
            ],
            "eff": -33,
            "tot": 3,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 5,
                "pct": 67
              },
              {
                "z": 6,
                "pct": 33
              }
            ],
            "eff": -67,
            "tot": 3,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 2,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 42
              },
              {
                "z": 6,
                "pct": 16
              },
              {
                "z": 5,
                "pct": 11
              },
              {
                "z": 7,
                "pct": 5
              }
            ],
            "eff": 20,
            "tot": 20,
            "pts": 9,
            "slash": 2,
            "err": 3,
            "video": null,
            "pts_pct": 45
          },
          {
            "cod": "V5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 62
              },
              {
                "z": 8,
                "pct": 25
              },
              {
                "z": 1,
                "pct": 12
              }
            ],
            "eff": -12,
            "tot": 8,
            "pts": 2,
            "slash": 3,
            "err": 0,
            "video": null,
            "pts_pct": 25
          },
          {
            "cod": "XP",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 1,
                "pct": 50
              },
              {
                "z": 3,
                "pct": 50
              }
            ],
            "eff": -33,
            "tot": 3,
            "pts": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 7,
                "eff": 50,
                "pos": 86,
                "neg": 0,
                "pt": 1,
                "mas": 5,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 7,
                "eff": 50,
                "pos": 86,
                "neg": 0,
                "pt": 1,
                "mas": 5,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 4,
                "eff": 12,
                "pos": 25,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 3,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 5,
                "eff": 20,
                "pos": 40,
                "neg": 0,
                "pt": 0,
                "mas": 2,
                "neu": 3,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 6,
                "eff": 33,
                "pos": 67,
                "neg": 17,
                "pt": 1,
                "mas": 3,
                "neu": 1,
                "med": 0,
                "ovp": 1,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 8,
                "eff": 31,
                "pos": 62,
                "neg": 12,
                "pt": 1,
                "mas": 4,
                "neu": 1,
                "med": 1,
                "ovp": 1,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 2,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 2,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 7,
                "eff": 36,
                "pos": 43,
                "neg": 0,
                "pt": 2,
                "mas": 1,
                "neu": 4,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 5,
                "eff": 20,
                "pos": 40,
                "neg": 20,
                "pt": 1,
                "mas": 1,
                "neu": 1,
                "med": 1,
                "ovp": 1,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 12,
                "eff": 29,
                "pos": 42,
                "neg": 8,
                "pt": 3,
                "mas": 2,
                "neu": 5,
                "med": 1,
                "ovp": 1,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "17 Herbsommer Leonardo",
        "num": 17,
        "objetivos": {
          "sq": 6,
          "rec": null,
          "bqpos": 40,
          "bqpt": 20,
          "atk": 55,
          "atqq": 55,
          "atqhb": null,
          "atqx": null,
          "atqrp": 64,
          "atqri": 60,
          "atqrm": null,
          "atqtr": 33
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 5,
                "pct": 36
              },
              {
                "z": 7,
                "pct": 23
              },
              {
                "z": 6,
                "pct": 18
              },
              {
                "z": 1,
                "pct": 9
              },
              {
                "z": 8,
                "pct": 9
              },
              {
                "z": 9,
                "pct": 5
              }
            ],
            "eff": -5,
            "tot": 22,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "XM",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 3,
                "pct": 38
              },
              {
                "z": 6,
                "pct": 15
              },
              {
                "z": 7,
                "pct": 15
              },
              {
                "z": 8,
                "pct": 8
              }
            ],
            "eff": 54,
            "tot": 13,
            "pts": 8,
            "slash": 1,
            "err": 0,
            "video": null,
            "pts_pct": 62
          },
          {
            "cod": "X7",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 3,
                "pct": 40
              },
              {
                "z": 8,
                "pct": 20
              },
              {
                "z": 9,
                "pct": 20
              },
              {
                "z": 1,
                "pct": 20
              }
            ],
            "eff": 40,
            "tot": 5,
            "pts": 2,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 40
          },
          {
            "cod": "X1",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 9,
                "pct": 50
              },
              {
                "z": 1,
                "pct": 25
              },
              {
                "z": 3,
                "pct": 25
              }
            ],
            "eff": 75,
            "tot": 4,
            "pts": 3,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 75
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "4 Vazquez Ezequiel",
        "num": 4,
        "objetivos": {
          "sq": 19,
          "rec": null,
          "bqpos": 33,
          "bqpt": 0,
          "atk": -100,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": -100
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 40
              },
              {
                "z": 5,
                "pct": 17
              },
              {
                "z": 8,
                "pct": 17
              },
              {
                "z": 1,
                "pct": 17
              },
              {
                "z": 7,
                "pct": 10
              }
            ],
            "eff": 13,
            "tot": 30,
            "pts": 5,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 17
          }
        ],
        "ataques": [
          {
            "cod": "P2",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 4,
                "pct": 100
              }
            ],
            "eff": -100,
            "tot": 1,
            "pts": 0,
            "slash": 1,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "2 Ojuez Agustin",
        "num": 2,
        "objetivos": {
          "sq": -9,
          "rec": null,
          "bqpos": 70,
          "bqpt": 40,
          "atk": 33,
          "atqq": 43,
          "atqhb": null,
          "atqx": null,
          "atqrp": 38,
          "atqri": null,
          "atqrm": 100,
          "atqtr": 17
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 5,
                "pct": 75
              },
              {
                "z": 7,
                "pct": 12
              },
              {
                "z": 6,
                "pct": 12
              }
            ],
            "eff": -12,
            "tot": 8,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X7",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 6,
                "pct": 40
              },
              {
                "z": 5,
                "pct": 20
              },
              {
                "z": 8,
                "pct": 20
              },
              {
                "z": 4,
                "pct": 20
              }
            ],
            "eff": 60,
            "tot": 5,
            "pts": 3,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 60
          },
          {
            "cod": "XM",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 1,
                "pct": 50
              },
              {
                "z": 7,
                "pct": 25
              },
              {
                "z": 6,
                "pct": 25
              }
            ],
            "eff": 0,
            "tot": 4,
            "pts": 1,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 25
          },
          {
            "cod": "X1",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 5,
                "pct": 25
              },
              {
                "z": 3,
                "pct": 25
              },
              {
                "z": 7,
                "pct": 25
              },
              {
                "z": 6,
                "pct": 25
              }
            ],
            "eff": 50,
            "tot": 4,
            "pts": 2,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 50
          },
          {
            "cod": "P2",
            "tipo": "",
            "orig": 8,
            "destinos": [],
            "eff": -100,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "X2",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 9,
                "pct": 100
              }
            ],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "12 Zanotti Juan Cruz",
        "num": 12,
        "objetivos": {
          "sq": null,
          "rec": 31,
          "bqpos": null,
          "bqpt": null,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [],
        "ataques": [],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 2,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 2,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 3,
                "eff": 83,
                "pos": 100,
                "neg": 0,
                "pt": 2,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 2,
                "eff": 75,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 2,
                "eff": 75,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 3,
                "eff": 33,
                "pos": 67,
                "neg": 0,
                "pt": 0,
                "mas": 2,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 4,
                "eff": 38,
                "pos": 75,
                "neg": 0,
                "pt": 0,
                "mas": 3,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 2,
                "eff": 50,
                "pos": 50,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 3,
                "eff": -33,
                "pos": 0,
                "neg": 33,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 2,
                "ovp": 0,
                "err": 1
              },
              "total": {
                "tot": 5,
                "eff": 0,
                "pos": 20,
                "neg": 20,
                "pt": 1,
                "mas": 0,
                "neu": 1,
                "med": 2,
                "ovp": 0,
                "err": 1
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": -100,
                "pos": 0,
                "neg": 100,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 1
              },
              "total": {
                "tot": 2,
                "eff": -25,
                "pos": 50,
                "neg": 50,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 1
              }
            }
          }
        }
      },
      {
        "nombre": "19 Diaz Bolli Santiago",
        "num": 19,
        "objetivos": {
          "sq": 12,
          "rec": null,
          "bqpos": null,
          "bqpt": null,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 75
              },
              {
                "z": 5,
                "pct": 25
              }
            ],
            "eff": 0,
            "tot": 4,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [],
        "recepcion": {}
      },
      {
        "nombre": "6 Villarruel Juan Simon",
        "num": 6,
        "objetivos": {
          "sq": -15,
          "rec": 67,
          "bqpos": null,
          "bqpt": null,
          "atk": -20,
          "atqq": null,
          "atqhb": null,
          "atqx": -20,
          "atqrp": 0,
          "atqri": null,
          "atqrm": null,
          "atqtr": -33
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 100
              }
            ],
            "eff": -20,
            "tot": 5,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 60
              },
              {
                "z": 1,
                "pct": 40
              }
            ],
            "eff": -20,
            "tot": 5,
            "pts": 1,
            "slash": 1,
            "err": 1,
            "video": null,
            "pts_pct": 20
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "5 Ramos Iaki",
        "num": 5,
        "objetivos": {
          "sq": 0,
          "rec": null,
          "bqpos": 33,
          "bqpt": 33,
          "atk": 40,
          "atqq": null,
          "atqhb": 0,
          "atqx": 50,
          "atqrp": 0,
          "atqri": 50,
          "atqrm": null,
          "atqtr": 100
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 7,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 1,
                "pct": 33
              },
              {
                "z": 4,
                "pct": 33
              },
              {
                "z": 6,
                "pct": 33
              }
            ],
            "eff": 33,
            "tot": 3,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 33
          },
          {
            "cod": "X8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 5,
                "pct": 100
              }
            ],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          },
          {
            "cod": "V6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 8,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "9 Godoy Martin",
        "num": 9,
        "objetivos": {
          "sq": 12,
          "rec": null,
          "bqpos": 20,
          "bqpt": 0,
          "atk": 50,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": 50
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 8,
                "pct": 50
              },
              {
                "z": 3,
                "pct": 50
              }
            ],
            "eff": 0,
            "tot": 2,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "P2",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 4,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "PR",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 3,
                "pct": 100
              }
            ],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          }
        ],
        "recepcion": {}
      }
    ]
  },
  {
    "nombre": "Defensores",
    "rival": "Defensores",
    "resultado": "D",
    "equipo_obj": {
      "sq": -3,
      "rec": 28,
      "bqpos": 58,
      "bqpt": 22,
      "atk": 19,
      "atqq": 39,
      "atqhb": -2,
      "atqx": 27,
      "atqrp": 24,
      "atqri": 67,
      "atqrm": 25,
      "atqtr": 2
    },
    "jugadores": [
      {
        "nombre": "4 Vazquez Ezequiel",
        "num": 4,
        "objetivos": {
          "sq": 15,
          "rec": -100,
          "bqpos": 57,
          "bqpt": 29,
          "atk": 50,
          "atqq": null,
          "atqhb": 0,
          "atqx": null,
          "atqrp": 0,
          "atqri": 0,
          "atqrm": null,
          "atqtr": 75
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 40
              },
              {
                "z": 9,
                "pct": 20
              },
              {
                "z": 8,
                "pct": 13
              },
              {
                "z": 7,
                "pct": 13
              },
              {
                "z": 1,
                "pct": 7
              },
              {
                "z": 5,
                "pct": 7
              }
            ],
            "eff": 7,
            "tot": 15,
            "pts": 1,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 7
          }
        ],
        "ataques": [
          {
            "cod": "XM",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 8,
                "pct": 25
              },
              {
                "z": 9,
                "pct": 25
              },
              {
                "z": 4,
                "pct": 25
              },
              {
                "z": 7,
                "pct": 25
              }
            ],
            "eff": 50,
            "tot": 4,
            "pts": 2,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 50
          },
          {
            "cod": "X6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 6,
                "pct": 100
              }
            ],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          },
          {
            "cod": "V6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 6,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": -100,
                "pos": 0,
                "neg": 100,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 1
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": -100,
                "pos": 0,
                "neg": 100,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 1
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "17 Herbsommer Leonardo",
        "num": 17,
        "objetivos": {
          "sq": -11,
          "rec": null,
          "bqpos": 60,
          "bqpt": 35,
          "atk": 19,
          "atqq": 20,
          "atqhb": null,
          "atqx": null,
          "atqrp": -50,
          "atqri": 57,
          "atqrm": null,
          "atqtr": 67
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 7,
                "pct": 50
              },
              {
                "z": 6,
                "pct": 19
              },
              {
                "z": 8,
                "pct": 19
              },
              {
                "z": 5,
                "pct": 12
              }
            ],
            "eff": -12,
            "tot": 16,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 2,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "XM",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 7,
                "pct": 50
              },
              {
                "z": 9,
                "pct": 30
              },
              {
                "z": 6,
                "pct": 20
              }
            ],
            "eff": 0,
            "tot": 10,
            "pts": 4,
            "slash": 0,
            "err": 4,
            "video": null,
            "pts_pct": 40
          },
          {
            "cod": "X7",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 9,
                "pct": 67
              },
              {
                "z": 2,
                "pct": 33
              }
            ],
            "eff": 67,
            "tot": 3,
            "pts": 2,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 67
          },
          {
            "cod": "X1",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 3,
                "pct": 50
              },
              {
                "z": 5,
                "pct": 50
              }
            ],
            "eff": 50,
            "tot": 2,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 50
          },
          {
            "cod": "X6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 8,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "14 Nielson Ramiro",
        "num": 14,
        "objetivos": {
          "sq": 0,
          "rec": 26,
          "bqpos": 44,
          "bqpt": 11,
          "atk": 20,
          "atqq": null,
          "atqhb": 8,
          "atqx": 31,
          "atqrp": 12,
          "atqri": 100,
          "atqrm": 0,
          "atqtr": 11
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 64
              },
              {
                "z": 1,
                "pct": 14
              },
              {
                "z": 5,
                "pct": 7
              },
              {
                "z": 2,
                "pct": 7
              },
              {
                "z": 3,
                "pct": 7
              }
            ],
            "eff": -7,
            "tot": 14,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 7,
                "pct": 25
              },
              {
                "z": 6,
                "pct": 25
              },
              {
                "z": 5,
                "pct": 25
              },
              {
                "z": 9,
                "pct": 12
              },
              {
                "z": 8,
                "pct": 12
              }
            ],
            "eff": 0,
            "tot": 8,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 6,
                "pct": 23
              },
              {
                "z": 1,
                "pct": 15
              },
              {
                "z": 7,
                "pct": 15
              },
              {
                "z": 2,
                "pct": 15
              }
            ],
            "eff": 31,
            "tot": 13,
            "pts": 6,
            "slash": 1,
            "err": 1,
            "video": null,
            "pts_pct": 46
          },
          {
            "cod": "V5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 5,
                "pct": 33
              },
              {
                "z": 1,
                "pct": 33
              },
              {
                "z": 6,
                "pct": 25
              },
              {
                "z": 9,
                "pct": 8
              }
            ],
            "eff": 8,
            "tot": 12,
            "pts": 3,
            "slash": 0,
            "err": 2,
            "video": null,
            "pts_pct": 25
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 5,
                "eff": 20,
                "pos": 40,
                "neg": 0,
                "pt": 0,
                "mas": 2,
                "neu": 3,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 6,
                "eff": 25,
                "pos": 50,
                "neg": 17,
                "pt": 1,
                "mas": 2,
                "neu": 2,
                "med": 0,
                "ovp": 1,
                "err": 0
              },
              "P1": {
                "tot": 3,
                "eff": 33,
                "pos": 67,
                "neg": 0,
                "pt": 0,
                "mas": 2,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 14,
                "eff": 25,
                "pos": 50,
                "neg": 7,
                "pt": 1,
                "mas": 6,
                "neu": 6,
                "med": 0,
                "ovp": 1,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 2,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 2,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 2,
                "eff": 50,
                "pos": 50,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 4,
                "eff": 75,
                "pos": 75,
                "neg": 0,
                "pt": 3,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 4,
                "eff": -38,
                "pos": 25,
                "neg": 50,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 2
              },
              "P6": {
                "tot": 6,
                "eff": 25,
                "pos": 50,
                "neg": 17,
                "pt": 2,
                "mas": 1,
                "neu": 1,
                "med": 1,
                "ovp": 0,
                "err": 1
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 10,
                "eff": 0,
                "pos": 40,
                "neg": 30,
                "pt": 2,
                "mas": 2,
                "neu": 1,
                "med": 2,
                "ovp": 0,
                "err": 3
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "11 Durdos Valentin",
        "num": 11,
        "objetivos": {
          "sq": 9,
          "rec": 24,
          "bqpos": 46,
          "bqpt": 8,
          "atk": 12,
          "atqq": null,
          "atqhb": -7,
          "atqx": 35,
          "atqrp": 50,
          "atqri": 50,
          "atqrm": 0,
          "atqtr": -11
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 7,
                "pct": 47
              },
              {
                "z": 6,
                "pct": 20
              },
              {
                "z": 5,
                "pct": 13
              },
              {
                "z": 8,
                "pct": 13
              },
              {
                "z": 9,
                "pct": 7
              }
            ],
            "eff": 0,
            "tot": 15,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 8,
                "pct": 100
              }
            ],
            "eff": 50,
            "tot": 2,
            "pts": 1,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 50
          }
        ],
        "ataques": [
          {
            "cod": "X5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 8,
                "pct": 36
              },
              {
                "z": 6,
                "pct": 21
              },
              {
                "z": 9,
                "pct": 14
              },
              {
                "z": 1,
                "pct": 14
              }
            ],
            "eff": 40,
            "tot": 15,
            "pts": 7,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 47
          },
          {
            "cod": "V5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 6,
                "pct": 31
              },
              {
                "z": 1,
                "pct": 23
              },
              {
                "z": 8,
                "pct": 15
              },
              {
                "z": 7,
                "pct": 15
              }
            ],
            "eff": -7,
            "tot": 14,
            "pts": 2,
            "slash": 0,
            "err": 3,
            "video": null,
            "pts_pct": 14
          },
          {
            "cod": "XP",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 5,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 2,
            "pts": 1,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 50
          },
          {
            "cod": "VP",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 7,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "X6",
            "tipo": "",
            "orig": 2,
            "destinos": [],
            "eff": -100,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 6,
                "eff": 25,
                "pos": 33,
                "neg": 0,
                "pt": 1,
                "mas": 1,
                "neu": 4,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 2,
                "eff": 75,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 9,
                "eff": 39,
                "pos": 56,
                "neg": 0,
                "pt": 2,
                "mas": 3,
                "neu": 4,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 2,
                "eff": 25,
                "pos": 50,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 2,
                "eff": 75,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 4,
                "eff": 50,
                "pos": 75,
                "neg": 0,
                "pt": 1,
                "mas": 2,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 2,
                "eff": -50,
                "pos": 0,
                "neg": 50,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 1
              },
              "P6": {
                "tot": 4,
                "eff": 0,
                "pos": 25,
                "neg": 25,
                "pt": 1,
                "mas": 0,
                "neu": 1,
                "med": 1,
                "ovp": 0,
                "err": 1
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 6,
                "eff": -17,
                "pos": 17,
                "neg": 33,
                "pt": 1,
                "mas": 0,
                "neu": 1,
                "med": 2,
                "ovp": 0,
                "err": 2
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "18 Acosta Wilson",
        "num": 18,
        "objetivos": {
          "sq": -13,
          "rec": null,
          "bqpos": 50,
          "bqpt": 0,
          "atk": 8,
          "atqq": null,
          "atqhb": -11,
          "atqx": 28,
          "atqrp": 22,
          "atqri": 100,
          "atqrm": 100,
          "atqtr": -12
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 53
              },
              {
                "z": 5,
                "pct": 20
              },
              {
                "z": 3,
                "pct": 20
              },
              {
                "z": 1,
                "pct": 7
              }
            ],
            "eff": -13,
            "tot": 15,
            "pts": 1,
            "plus": 0,
            "slash": 0,
            "err": 3,
            "video": null,
            "pts_pct": 7
          }
        ],
        "ataques": [
          {
            "cod": "V6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 1,
                "pct": 50
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
                "z": 6,
                "pct": 12
              }
            ],
            "eff": -12,
            "tot": 16,
            "pts": 2,
            "slash": 4,
            "err": 0,
            "video": null,
            "pts_pct": 12
          },
          {
            "cod": "X6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 1,
                "pct": 42
              },
              {
                "z": 9,
                "pct": 25
              },
              {
                "z": 7,
                "pct": 8
              },
              {
                "z": 5,
                "pct": 8
              }
            ],
            "eff": 25,
            "tot": 12,
            "pts": 5,
            "slash": 2,
            "err": 0,
            "video": null,
            "pts_pct": 42
          },
          {
            "cod": "X8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 5,
                "pct": 50
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
                "pct": 17
              }
            ],
            "eff": 33,
            "tot": 6,
            "pts": 3,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 50
          },
          {
            "cod": "V8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 6,
                "pct": 50
              },
              {
                "z": 1,
                "pct": 50
              }
            ],
            "eff": 50,
            "tot": 2,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 50
          },
          {
            "cod": "V5",
            "tipo": "",
            "orig": 4,
            "destinos": [],
            "eff": -100,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "12 Zanotti Juan Cruz",
        "num": 12,
        "objetivos": {
          "sq": null,
          "rec": 39,
          "bqpos": null,
          "bqpt": null,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [],
        "ataques": [],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 7,
                "eff": 64,
                "pos": 86,
                "neg": 0,
                "pt": 3,
                "mas": 3,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 7,
                "eff": 64,
                "pos": 86,
                "neg": 0,
                "pt": 3,
                "mas": 3,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 2,
                "eff": 75,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 2,
                "eff": 75,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 3,
                "eff": 67,
                "pos": 67,
                "neg": 0,
                "pt": 2,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 8,
                "eff": 31,
                "pos": 50,
                "neg": 12,
                "pt": 3,
                "mas": 1,
                "neu": 0,
                "med": 3,
                "ovp": 0,
                "err": 1
              },
              "total": {
                "tot": 11,
                "eff": 41,
                "pos": 55,
                "neg": 9,
                "pt": 5,
                "mas": 1,
                "neu": 1,
                "med": 3,
                "ovp": 0,
                "err": 1
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 3,
                "eff": 17,
                "pos": 33,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 1,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 4,
                "eff": 0,
                "pos": 25,
                "neg": 25,
                "pt": 1,
                "mas": 0,
                "neu": 2,
                "med": 0,
                "ovp": 0,
                "err": 1
              },
              "total": {
                "tot": 7,
                "eff": 7,
                "pos": 29,
                "neg": 14,
                "pt": 1,
                "mas": 1,
                "neu": 3,
                "med": 1,
                "ovp": 0,
                "err": 1
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "2 Ojuez Agustin",
        "num": 2,
        "objetivos": {
          "sq": -12,
          "rec": 0,
          "bqpos": 75,
          "bqpt": 31,
          "atk": 57,
          "atqq": 62,
          "atqhb": null,
          "atqx": null,
          "atqrp": 71,
          "atqri": 100,
          "atqrm": 50,
          "atqtr": 25
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 7,
                "pct": 38
              },
              {
                "z": 8,
                "pct": 25
              },
              {
                "z": 5,
                "pct": 25
              },
              {
                "z": 6,
                "pct": 12
              }
            ],
            "eff": -12,
            "tot": 8,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X7",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 7,
                "pct": 20
              },
              {
                "z": 8,
                "pct": 20
              },
              {
                "z": 3,
                "pct": 20
              },
              {
                "z": 1,
                "pct": 20
              }
            ],
            "eff": 60,
            "tot": 5,
            "pts": 3,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 60
          },
          {
            "cod": "X1",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 6,
                "pct": 60
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
            "eff": 60,
            "tot": 5,
            "pts": 3,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 60
          },
          {
            "cod": "XM",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 8,
                "pct": 50
              },
              {
                "z": 9,
                "pct": 25
              },
              {
                "z": 6,
                "pct": 25
              }
            ],
            "eff": 50,
            "tot": 4,
            "pts": 2,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 50
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "19 Diaz Bolli Santiago",
        "num": 19,
        "objetivos": {
          "sq": 0,
          "rec": null,
          "bqpos": null,
          "bqpt": null,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 7,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 3,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [],
        "recepcion": {}
      },
      {
        "nombre": "5 Ramos Iaki",
        "num": 5,
        "objetivos": {
          "sq": -100,
          "rec": null,
          "bqpos": null,
          "bqpt": null,
          "atk": 33,
          "atqq": null,
          "atqhb": 50,
          "atqx": 0,
          "atqrp": 0,
          "atqri": null,
          "atqrm": 100,
          "atqtr": 0
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 5,
                "pct": 100
              }
            ],
            "eff": -100,
            "tot": 1,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "V6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 1,
                "pct": 100
              }
            ],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          },
          {
            "cod": "X6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 1,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "V8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 1,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "6 Villarruel Juan Simon",
        "num": 6,
        "objetivos": {
          "sq": -100,
          "rec": 50,
          "bqpos": 100,
          "bqpt": 0,
          "atk": -50,
          "atqq": null,
          "atqhb": null,
          "atqx": -50,
          "atqrp": null,
          "atqri": 0,
          "atqrm": null,
          "atqtr": -100
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 3,
                "pct": 100
              }
            ],
            "eff": -100,
            "tot": 1,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 3,
                "pct": 50
              },
              {
                "z": 6,
                "pct": 50
              }
            ],
            "eff": -50,
            "tot": 2,
            "pts": 0,
            "slash": 1,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      }
    ]
  },
  {
    "nombre": "Lomas",
    "rival": "Lomas",
    "resultado": "V",
    "equipo_obj": {
      "sq": -3,
      "rec": 23,
      "bqpos": 53,
      "bqpt": 25,
      "atk": 30,
      "atqq": 36,
      "atqhb": 32,
      "atqx": 20,
      "atqrp": 35,
      "atqri": 50,
      "atqrm": 6,
      "atqtr": 27
    },
    "jugadores": [
      {
        "nombre": "4 Vazquez Ezequiel",
        "num": 4,
        "objetivos": {
          "sq": 0,
          "rec": 0,
          "bqpos": 50,
          "bqpt": 0,
          "atk": 0,
          "atqq": null,
          "atqhb": 0,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": 0,
          "atqtr": 0
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 50
              },
              {
                "z": 1,
                "pct": 41
              },
              {
                "z": 5,
                "pct": 9
              }
            ],
            "eff": -5,
            "tot": 22,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "P2",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 4,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 2,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "V6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 5,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "17 Herbsommer Leonardo",
        "num": 17,
        "objetivos": {
          "sq": 9,
          "rec": null,
          "bqpos": 48,
          "bqpt": 28,
          "atk": 15,
          "atqq": 16,
          "atqhb": null,
          "atqx": null,
          "atqrp": 27,
          "atqri": 20,
          "atqrm": null,
          "atqtr": -25
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 5,
                "pct": 75
              },
              {
                "z": 6,
                "pct": 19
              },
              {
                "z": 3,
                "pct": 6
              }
            ],
            "eff": 0,
            "tot": 16,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "XM",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 1,
                "pct": 36
              },
              {
                "z": 6,
                "pct": 27
              },
              {
                "z": 3,
                "pct": 18
              },
              {
                "z": 9,
                "pct": 9
              }
            ],
            "eff": 9,
            "tot": 11,
            "pts": 4,
            "slash": 0,
            "err": 3,
            "video": null,
            "pts_pct": 36
          },
          {
            "cod": "X7",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 3,
                "pct": 75
              },
              {
                "z": 1,
                "pct": 25
              }
            ],
            "eff": 0,
            "tot": 4,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "X1",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 5,
                "pct": 67
              },
              {
                "z": 3,
                "pct": 33
              }
            ],
            "eff": 67,
            "tot": 3,
            "pts": 2,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 67
          },
          {
            "cod": "X2",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 4,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "PR",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 6,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "11 Durdos Valentin",
        "num": 11,
        "objetivos": {
          "sq": 0,
          "rec": 28,
          "bqpos": 29,
          "bqpt": 14,
          "atk": 39,
          "atqq": null,
          "atqhb": 19,
          "atqx": 44,
          "atqrp": 56,
          "atqri": 100,
          "atqrm": -12,
          "atqtr": 47
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 1,
                "pct": 57
              },
              {
                "z": 5,
                "pct": 29
              },
              {
                "z": 3,
                "pct": 14
              }
            ],
            "eff": 0,
            "tot": 7,
            "pts": 1,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 14
          },
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 43
              },
              {
                "z": 1,
                "pct": 29
              },
              {
                "z": 5,
                "pct": 29
              }
            ],
            "eff": -14,
            "tot": 7,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "V5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 56
              },
              {
                "z": 1,
                "pct": 12
              },
              {
                "z": 6,
                "pct": 6
              },
              {
                "z": 3,
                "pct": 6
              }
            ],
            "eff": 19,
            "tot": 16,
            "pts": 7,
            "slash": 2,
            "err": 2,
            "video": null,
            "pts_pct": 44
          },
          {
            "cod": "X5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 38
              },
              {
                "z": 7,
                "pct": 25
              },
              {
                "z": 1,
                "pct": 19
              },
              {
                "z": 5,
                "pct": 12
              }
            ],
            "eff": 44,
            "tot": 16,
            "pts": 10,
            "slash": 1,
            "err": 2,
            "video": null,
            "pts_pct": 62
          },
          {
            "cod": "PR",
            "tipo": "",
            "orig": 8,
            "destinos": [],
            "eff": 100,
            "tot": 3,
            "pts": 3,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          },
          {
            "cod": "XP",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 5,
                "pct": 100
              }
            ],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 8,
                "eff": 44,
                "pos": 62,
                "neg": 0,
                "pt": 2,
                "mas": 3,
                "neu": 1,
                "med": 2,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 6,
                "eff": 58,
                "pos": 83,
                "neg": 0,
                "pt": 2,
                "mas": 3,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 14,
                "eff": 50,
                "pos": 71,
                "neg": 0,
                "pt": 4,
                "mas": 6,
                "neu": 2,
                "med": 2,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 6,
                "eff": 0,
                "pos": 33,
                "neg": 33,
                "pt": 2,
                "mas": 0,
                "neu": 1,
                "med": 1,
                "ovp": 0,
                "err": 2
              },
              "P6": {
                "tot": 3,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 2,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 9,
                "eff": 0,
                "pos": 22,
                "neg": 22,
                "pt": 2,
                "mas": 0,
                "neu": 3,
                "med": 2,
                "ovp": 0,
                "err": 2
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 1,
                "eff": -50,
                "pos": 0,
                "neg": 100,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 1,
                "err": 0
              },
              "P6": {
                "tot": 2,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 2,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 2,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 5,
                "eff": 10,
                "pos": 40,
                "neg": 20,
                "pt": 0,
                "mas": 2,
                "neu": 1,
                "med": 1,
                "ovp": 1,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "14 Nielson Ramiro",
        "num": 14,
        "objetivos": {
          "sq": 1,
          "rec": 13,
          "bqpos": 67,
          "bqpt": 33,
          "atk": 9,
          "atqq": null,
          "atqhb": 0,
          "atqx": 14,
          "atqrp": 33,
          "atqri": 67,
          "atqrm": -25,
          "atqtr": 0
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 48
              },
              {
                "z": 1,
                "pct": 39
              },
              {
                "z": 5,
                "pct": 13
              }
            ],
            "eff": -4,
            "tot": 23,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 2,
                "pct": 48
              },
              {
                "z": 7,
                "pct": 19
              },
              {
                "z": 5,
                "pct": 10
              },
              {
                "z": 6,
                "pct": 10
              }
            ],
            "eff": 14,
            "tot": 21,
            "pts": 7,
            "slash": 3,
            "err": 1,
            "video": null,
            "pts_pct": 33
          },
          {
            "cod": "V5",
            "tipo": "",
            "orig": 4,
            "destinos": [
              {
                "z": 1,
                "pct": 45
              },
              {
                "z": 2,
                "pct": 27
              },
              {
                "z": 3,
                "pct": 18
              },
              {
                "z": 5,
                "pct": 9
              }
            ],
            "eff": 0,
            "tot": 11,
            "pts": 1,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 9
          },
          {
            "cod": "VP",
            "tipo": "",
            "orig": 8,
            "destinos": [
              {
                "z": 6,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 2,
            "pts": 1,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 50
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 7,
                "eff": 7,
                "pos": 43,
                "neg": 29,
                "pt": 1,
                "mas": 2,
                "neu": 1,
                "med": 1,
                "ovp": 1,
                "err": 1
              },
              "P6": {
                "tot": 2,
                "eff": 50,
                "pos": 50,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 6,
                "eff": 50,
                "pos": 67,
                "neg": 0,
                "pt": 2,
                "mas": 2,
                "neu": 2,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 15,
                "eff": 30,
                "pos": 53,
                "neg": 13,
                "pt": 4,
                "mas": 4,
                "neu": 4,
                "med": 1,
                "ovp": 1,
                "err": 1
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 2,
                "eff": -25,
                "pos": 0,
                "neg": 50,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 1,
                "err": 0
              },
              "P6": {
                "tot": 4,
                "eff": 12,
                "pos": 25,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 2,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 2,
                "eff": -50,
                "pos": 0,
                "neg": 50,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 1
              },
              "total": {
                "tot": 8,
                "eff": -12,
                "pos": 12,
                "neg": 25,
                "pt": 0,
                "mas": 1,
                "neu": 2,
                "med": 3,
                "ovp": 1,
                "err": 1
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 1,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 3,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 2,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "18 Acosta Wilson",
        "num": 18,
        "objetivos": {
          "sq": 0,
          "rec": null,
          "bqpos": 100,
          "bqpt": 0,
          "atk": 33,
          "atqq": null,
          "atqhb": 67,
          "atqx": 0,
          "atqrp": 0,
          "atqri": null,
          "atqrm": 100,
          "atqtr": 33
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
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
            "eff": 0,
            "tot": 2,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "V6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 4,
                "pct": 50
              },
              {
                "z": 1,
                "pct": 50
              }
            ],
            "eff": 50,
            "tot": 2,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 50
          },
          {
            "cod": "X6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 9,
                "pct": 50
              },
              {
                "z": 4,
                "pct": 50
              }
            ],
            "eff": 0,
            "tot": 2,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "X8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 5,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          },
          {
            "cod": "V8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 1,
                "pct": 100
              }
            ],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "12 Zanotti Juan Cruz",
        "num": 12,
        "objetivos": {
          "sq": null,
          "rec": 27,
          "bqpos": null,
          "bqpt": null,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [],
        "ataques": [],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 2,
                "eff": 25,
                "pos": 50,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 3,
                "eff": 33,
                "pos": 67,
                "neg": 0,
                "pt": 0,
                "mas": 2,
                "neu": 0,
                "med": 1,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 2,
                "eff": 50,
                "pos": 50,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 3,
                "eff": 83,
                "pos": 100,
                "neg": 0,
                "pt": 2,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 5,
                "eff": 70,
                "pos": 80,
                "neg": 0,
                "pt": 3,
                "mas": 1,
                "neu": 1,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 3,
                "eff": 17,
                "pos": 33,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 2,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 7,
                "eff": 14,
                "pos": 29,
                "neg": 14,
                "pt": 1,
                "mas": 1,
                "neu": 2,
                "med": 2,
                "ovp": 1,
                "err": 0
              },
              "total": {
                "tot": 10,
                "eff": 15,
                "pos": 30,
                "neg": 10,
                "pt": 1,
                "mas": 2,
                "neu": 4,
                "med": 2,
                "ovp": 1,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 100,
                "pos": 100,
                "neg": 0,
                "pt": 1,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 4,
                "eff": -25,
                "pos": 0,
                "neg": 25,
                "pt": 0,
                "mas": 0,
                "neu": 1,
                "med": 2,
                "ovp": 0,
                "err": 1
              },
              "total": {
                "tot": 5,
                "eff": 0,
                "pos": 20,
                "neg": 20,
                "pt": 1,
                "mas": 0,
                "neu": 1,
                "med": 2,
                "ovp": 0,
                "err": 1
              }
            }
          }
        }
      },
      {
        "nombre": "2 Ojuez Agustin",
        "num": 2,
        "objetivos": {
          "sq": -7,
          "rec": 50,
          "bqpos": 50,
          "bqpt": 33,
          "atk": 78,
          "atqq": 78,
          "atqhb": null,
          "atqx": null,
          "atqrp": 50,
          "atqri": 100,
          "atqrm": null,
          "atqtr": 100
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 86
              },
              {
                "z": 1,
                "pct": 14
              }
            ],
            "eff": -14,
            "tot": 7,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "X1",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 5,
                "pct": 67
              },
              {
                "z": 3,
                "pct": 17
              },
              {
                "z": 6,
                "pct": 17
              }
            ],
            "eff": 67,
            "tot": 6,
            "pts": 5,
            "slash": 1,
            "err": 0,
            "video": null,
            "pts_pct": 83
          },
          {
            "cod": "XM",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 6,
                "pct": 50
              },
              {
                "z": 1,
                "pct": 50
              }
            ],
            "eff": 100,
            "tot": 2,
            "pts": 2,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          },
          {
            "cod": "X2",
            "tipo": "",
            "orig": 3,
            "destinos": [
              {
                "z": 1,
                "pct": 100
              }
            ],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          }
        ],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "5 Ramos Iaki",
        "num": 5,
        "objetivos": {
          "sq": -30,
          "rec": null,
          "bqpos": 78,
          "bqpt": 33,
          "atk": 41,
          "atqq": null,
          "atqhb": 71,
          "atqx": 7,
          "atqrp": 20,
          "atqri": 17,
          "atqrm": 100,
          "atqtr": 50
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 5,
                "pct": 60
              },
              {
                "z": 6,
                "pct": 30
              },
              {
                "z": 1,
                "pct": 10
              }
            ],
            "eff": -40,
            "tot": 10,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 4,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [
          {
            "cod": "V6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 6,
                "pct": 45
              },
              {
                "z": 4,
                "pct": 36
              },
              {
                "z": 1,
                "pct": 9
              },
              {
                "z": 2,
                "pct": 9
              }
            ],
            "eff": 64,
            "tot": 11,
            "pts": 7,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 64
          },
          {
            "cod": "X6",
            "tipo": "",
            "orig": 2,
            "destinos": [
              {
                "z": 4,
                "pct": 55
              },
              {
                "z": 6,
                "pct": 36
              },
              {
                "z": 2,
                "pct": 9
              }
            ],
            "eff": 18,
            "tot": 11,
            "pts": 4,
            "slash": 2,
            "err": 0,
            "video": null,
            "pts_pct": 36
          },
          {
            "cod": "X8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 4,
                "pct": 67
              },
              {
                "z": 5,
                "pct": 33
              }
            ],
            "eff": -33,
            "tot": 3,
            "pts": 1,
            "slash": 2,
            "err": 0,
            "video": null,
            "pts_pct": 33
          },
          {
            "cod": "V8",
            "tipo": "",
            "orig": 9,
            "destinos": [
              {
                "z": 6,
                "pct": 33
              },
              {
                "z": 5,
                "pct": 33
              },
              {
                "z": 4,
                "pct": 33
              }
            ],
            "eff": 100,
            "tot": 3,
            "pts": 3,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          },
          {
            "cod": "PR",
            "tipo": "",
            "orig": 8,
            "destinos": [],
            "eff": 100,
            "tot": 1,
            "pts": 1,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 100
          }
        ],
        "recepcion": {}
      },
      {
        "nombre": "19 Diaz Bolli Santiago",
        "num": 19,
        "objetivos": {
          "sq": 0,
          "rec": null,
          "bqpos": null,
          "bqpt": null,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 6,
                "pct": 60
              },
              {
                "z": 5,
                "pct": 40
              }
            ],
            "eff": 0,
            "tot": 5,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [],
        "recepcion": {}
      },
      {
        "nombre": "6 Villarruel Juan Simon",
        "num": 6,
        "objetivos": {
          "sq": 0,
          "rec": 50,
          "bqpos": null,
          "bqpt": null,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [
          {
            "cod": "SQ",
            "tipo": "POTENCIA",
            "orig": 6,
            "destinos": [
              {
                "z": 5,
                "pct": 100
              }
            ],
            "eff": 0,
            "tot": 1,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 0,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [],
        "recepcion": {
          "flotado": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 1,
                "eff": 50,
                "pos": 100,
                "neg": 0,
                "pt": 0,
                "mas": 1,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          },
          "potencia": {
            "desde_z1": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z6": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            },
            "desde_z5": {
              "P5": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P6": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "P1": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              },
              "total": {
                "tot": 0,
                "eff": 0,
                "pos": 0,
                "neg": 0,
                "pt": 0,
                "mas": 0,
                "neu": 0,
                "med": 0,
                "ovp": 0,
                "err": 0
              }
            }
          }
        }
      },
      {
        "nombre": "9 Godoy Martin",
        "num": 9,
        "objetivos": {
          "sq": -100,
          "rec": null,
          "bqpos": null,
          "bqpt": null,
          "atk": null,
          "atqq": null,
          "atqhb": null,
          "atqx": null,
          "atqrp": null,
          "atqri": null,
          "atqrm": null,
          "atqtr": null
        },
        "saques": [
          {
            "cod": "SM",
            "tipo": "FLOTADO",
            "orig": 6,
            "destinos": [
              {
                "z": 5,
                "pct": 100
              }
            ],
            "eff": -100,
            "tot": 1,
            "pts": 0,
            "plus": 0,
            "slash": 0,
            "err": 1,
            "video": null,
            "pts_pct": 0
          }
        ],
        "ataques": [],
        "recepcion": {}
      }
    ]
  }
];
