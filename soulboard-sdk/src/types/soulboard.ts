/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/soulboard.json`.
 */
export type Soulboard = {
  "address": "915wZsHsUJ7Pdei1XUY8jtdfia7D8t4r9XkhGD3TvrDV",
  "metadata": {
    "name": "soulboard",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addBudget",
      "discriminator": [
        8,
        21,
        47,
        83,
        188,
        233,
        214,
        5
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "arg",
                "path": "campaignIdx"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "campaign"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "campaignIdx",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "addCampaignLocation",
      "discriminator": [
        30,
        90,
        251,
        9,
        46,
        137,
        20,
        163
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "arg",
                "path": "campaignIdx"
              }
            ]
          }
        },
        {
          "name": "provider",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  118,
                  105,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "provider.authority",
                "account": "provider"
              }
            ]
          }
        },
        {
          "name": "location",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  99,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "provider.authority",
                "account": "provider"
              },
              {
                "kind": "arg",
                "path": "locationIdx"
              }
            ]
          }
        },
        {
          "name": "campaignLocation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110,
                  95,
                  108,
                  111,
                  99,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign"
              },
              {
                "kind": "account",
                "path": "location"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "campaign"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "campaignIdx",
          "type": "u64"
        },
        {
          "name": "locationIdx",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closeCampaign",
      "discriminator": [
        65,
        49,
        110,
        7,
        63,
        238,
        206,
        77
      ],
      "accounts": [
        {
          "name": "advertiser",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  118,
                  101,
                  114,
                  116,
                  105,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "arg",
                "path": "campaignIdx"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "advertiser",
            "campaign"
          ]
        }
      ],
      "args": [
        {
          "name": "campaignIdx",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createAdvertiser",
      "discriminator": [
        249,
        170,
        60,
        235,
        33,
        219,
        7,
        83
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "advertiser",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  118,
                  101,
                  114,
                  116,
                  105,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "createCampaign",
      "discriminator": [
        111,
        131,
        187,
        98,
        160,
        193,
        114,
        244
      ],
      "accounts": [
        {
          "name": "advertiser",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  100,
                  118,
                  101,
                  114,
                  116,
                  105,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "account",
                "path": "advertiser.last_campaign_id",
                "account": "advertiser"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "advertiser"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "campaignName",
          "type": "string"
        },
        {
          "name": "campaignDescription",
          "type": "string"
        },
        {
          "name": "campaignImageUrl",
          "type": "string"
        },
        {
          "name": "budget",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createProvider",
      "discriminator": [
        74,
        53,
        211,
        174,
        38,
        168,
        227,
        177
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "provider",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  118,
                  105,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "registerLocation",
      "discriminator": [
        6,
        192,
        107,
        95,
        99,
        19,
        126,
        64
      ],
      "accounts": [
        {
          "name": "provider",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  118,
                  105,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "provider"
          ]
        },
        {
          "name": "location",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  99,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "account",
                "path": "provider.last_location_id",
                "account": "provider"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "locationName",
          "type": "string"
        },
        {
          "name": "locationDescription",
          "type": "string"
        },
        {
          "name": "price",
          "type": "u64"
        },
        {
          "name": "oracleAuthority",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "removeCampaignLocation",
      "discriminator": [
        11,
        168,
        157,
        230,
        206,
        75,
        95,
        212
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "arg",
                "path": "campaignIdx"
              }
            ]
          }
        },
        {
          "name": "provider",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  118,
                  105,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "provider.authority",
                "account": "provider"
              }
            ]
          }
        },
        {
          "name": "location",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  99,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "provider.authority",
                "account": "provider"
              },
              {
                "kind": "arg",
                "path": "locationIdx"
              }
            ]
          }
        },
        {
          "name": "campaignLocation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110,
                  95,
                  108,
                  111,
                  99,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign"
              },
              {
                "kind": "account",
                "path": "location"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "campaign"
          ]
        }
      ],
      "args": [
        {
          "name": "campaignIdx",
          "type": "u64"
        },
        {
          "name": "locationIdx",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setLocationStatus",
      "discriminator": [
        221,
        161,
        199,
        131,
        241,
        177,
        93,
        5
      ],
      "accounts": [
        {
          "name": "provider",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  118,
                  105,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "location",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  99,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "arg",
                "path": "locationIdx"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "provider"
          ]
        }
      ],
      "args": [
        {
          "name": "locationIdx",
          "type": "u64"
        },
        {
          "name": "status",
          "type": {
            "defined": {
              "name": "locationStatus"
            }
          }
        }
      ]
    },
    {
      "name": "settleCampaignLocation",
      "discriminator": [
        92,
        155,
        20,
        165,
        60,
        151,
        251,
        131
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "campaignAuthority"
              },
              {
                "kind": "arg",
                "path": "campaignIdx"
              }
            ]
          }
        },
        {
          "name": "provider",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  118,
                  105,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "arg",
                "path": "providerAuthority"
              }
            ]
          }
        },
        {
          "name": "location",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  99,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "providerAuthority"
              },
              {
                "kind": "arg",
                "path": "locationIdx"
              }
            ]
          }
        },
        {
          "name": "campaignLocation",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110,
                  95,
                  108,
                  111,
                  99,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "campaign"
              },
              {
                "kind": "account",
                "path": "location"
              }
            ]
          }
        },
        {
          "name": "locationAuthority",
          "writable": true
        },
        {
          "name": "oracleAuthority",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "campaignIdx",
          "type": "u64"
        },
        {
          "name": "locationIdx",
          "type": "u64"
        },
        {
          "name": "campaignAuthority",
          "type": "pubkey"
        },
        {
          "name": "providerAuthority",
          "type": "pubkey"
        },
        {
          "name": "settlementAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateCampaign",
      "discriminator": [
        235,
        31,
        39,
        49,
        121,
        173,
        19,
        92
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "arg",
                "path": "campaignIdx"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "campaign"
          ]
        }
      ],
      "args": [
        {
          "name": "campaignIdx",
          "type": "u64"
        },
        {
          "name": "campaignName",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "campaignDescription",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "campaignImageUrl",
          "type": {
            "option": "string"
          }
        }
      ]
    },
    {
      "name": "updateLocationDetails",
      "discriminator": [
        255,
        68,
        138,
        178,
        133,
        15,
        42,
        246
      ],
      "accounts": [
        {
          "name": "provider",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  118,
                  105,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "location",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  99,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "arg",
                "path": "locationIdx"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "provider"
          ]
        }
      ],
      "args": [
        {
          "name": "locationIdx",
          "type": "u64"
        },
        {
          "name": "locationName",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "locationDescription",
          "type": {
            "option": "string"
          }
        }
      ]
    },
    {
      "name": "updateLocationPrice",
      "discriminator": [
        116,
        230,
        163,
        205,
        126,
        234,
        98,
        124
      ],
      "accounts": [
        {
          "name": "provider",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  118,
                  105,
                  100,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        },
        {
          "name": "location",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  111,
                  99,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "arg",
                "path": "locationIdx"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "provider"
          ]
        }
      ],
      "args": [
        {
          "name": "locationIdx",
          "type": "u64"
        },
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawBudget",
      "discriminator": [
        26,
        141,
        71,
        90,
        120,
        39,
        231,
        91
      ],
      "accounts": [
        {
          "name": "campaign",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  97,
                  109,
                  112,
                  97,
                  105,
                  103,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "arg",
                "path": "campaignIdx"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "campaign"
          ]
        }
      ],
      "args": [
        {
          "name": "campaignIdx",
          "type": "u64"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "advertiser",
      "discriminator": [
        224,
        189,
        134,
        74,
        86,
        113,
        216,
        184
      ]
    },
    {
      "name": "campaign",
      "discriminator": [
        50,
        40,
        49,
        11,
        157,
        220,
        229,
        192
      ]
    },
    {
      "name": "campaignLocation",
      "discriminator": [
        140,
        91,
        221,
        49,
        222,
        38,
        117,
        125
      ]
    },
    {
      "name": "location",
      "discriminator": [
        73,
        140,
        105,
        78,
        215,
        159,
        92,
        234
      ]
    },
    {
      "name": "provider",
      "discriminator": [
        164,
        180,
        71,
        17,
        75,
        216,
        80,
        195
      ]
    }
  ],
  "events": [
    {
      "name": "budgetAdded",
      "discriminator": [
        227,
        8,
        82,
        112,
        239,
        227,
        92,
        169
      ]
    },
    {
      "name": "budgetWithdrawn",
      "discriminator": [
        6,
        32,
        94,
        74,
        79,
        3,
        32,
        122
      ]
    },
    {
      "name": "campaignClosed",
      "discriminator": [
        158,
        143,
        128,
        251,
        84,
        131,
        2,
        90
      ]
    },
    {
      "name": "campaignCreated",
      "discriminator": [
        9,
        98,
        69,
        61,
        53,
        131,
        64,
        152
      ]
    },
    {
      "name": "campaignLocationBooked",
      "discriminator": [
        54,
        9,
        124,
        21,
        230,
        113,
        25,
        177
      ]
    },
    {
      "name": "campaignLocationCancelled",
      "discriminator": [
        219,
        62,
        139,
        226,
        168,
        58,
        77,
        112
      ]
    },
    {
      "name": "campaignLocationSettled",
      "discriminator": [
        202,
        207,
        42,
        195,
        146,
        203,
        139,
        3
      ]
    },
    {
      "name": "campaignUpdated",
      "discriminator": [
        110,
        209,
        206,
        190,
        205,
        2,
        234,
        81
      ]
    },
    {
      "name": "locationRegistered",
      "discriminator": [
        43,
        158,
        200,
        223,
        220,
        110,
        239,
        162
      ]
    },
    {
      "name": "locationUpdated",
      "discriminator": [
        161,
        48,
        186,
        7,
        3,
        198,
        31,
        67
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidAuthority",
      "msg": "Invalid authority"
    },
    {
      "code": 6001,
      "name": "oracleNotConfigured",
      "msg": "Oracle authority not configured"
    },
    {
      "code": 6002,
      "name": "invalidOracleAuthority",
      "msg": "Invalid oracle authority"
    },
    {
      "code": 6003,
      "name": "unauthorized",
      "msg": "Unauthorized operation"
    },
    {
      "code": 6004,
      "name": "campaignNotActive",
      "msg": "Campaign is not active"
    },
    {
      "code": 6005,
      "name": "campaignHasActiveBookings",
      "msg": "Campaign has active bookings"
    },
    {
      "code": 6006,
      "name": "insufficientBudget",
      "msg": "Insufficient campaign budget"
    },
    {
      "code": 6007,
      "name": "locationUnavailable",
      "msg": "Location is unavailable"
    },
    {
      "code": 6008,
      "name": "locationInactive",
      "msg": "Location is inactive"
    },
    {
      "code": 6009,
      "name": "locationAlreadyBooked",
      "msg": "Location already booked"
    },
    {
      "code": 6010,
      "name": "bookingAlreadyExists",
      "msg": "Booking already exists"
    },
    {
      "code": 6011,
      "name": "bookingNotActive",
      "msg": "Booking not active"
    },
    {
      "code": 6012,
      "name": "settlementTooHigh",
      "msg": "Settlement amount exceeds escrow"
    },
    {
      "code": 6013,
      "name": "invalidParameters",
      "msg": "Invalid parameters"
    },
    {
      "code": 6014,
      "name": "invalidStringLength",
      "msg": "Invalid string length"
    },
    {
      "code": 6015,
      "name": "insufficientRent",
      "msg": "Insufficient rent-exempt balance"
    },
    {
      "code": 6016,
      "name": "insufficientEarnings",
      "msg": "Insufficient earnings"
    },
    {
      "code": 6017,
      "name": "arithmeticOverflow",
      "msg": "Arithmetic overflow"
    },
    {
      "code": 6018,
      "name": "arithmeticUnderflow",
      "msg": "Arithmetic underflow"
    }
  ],
  "types": [
    {
      "name": "advertiser",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "lastCampaignId",
            "type": "u64"
          },
          {
            "name": "campaignCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "budgetAdded",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "availableBudget",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "budgetWithdrawn",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "availableBudget",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "campaign",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "campaignIdx",
            "type": "u64"
          },
          {
            "name": "campaignName",
            "type": "string"
          },
          {
            "name": "campaignDescription",
            "type": "string"
          },
          {
            "name": "campaignImageUrl",
            "type": "string"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "campaignStatus"
              }
            }
          },
          {
            "name": "availableBudget",
            "type": "u64"
          },
          {
            "name": "reservedBudget",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "campaignClosed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "authority",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "campaignCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "campaignIdx",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "campaignLocation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "location",
            "type": "pubkey"
          },
          {
            "name": "advertiser",
            "type": "pubkey"
          },
          {
            "name": "provider",
            "type": "pubkey"
          },
          {
            "name": "oracleAuthority",
            "type": "pubkey"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "campaignLocationStatus"
              }
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "type": "i64"
          },
          {
            "name": "settledAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "campaignLocationBooked",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "location",
            "type": "pubkey"
          },
          {
            "name": "price",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "campaignLocationCancelled",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "location",
            "type": "pubkey"
          },
          {
            "name": "price",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "campaignLocationSettled",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          },
          {
            "name": "location",
            "type": "pubkey"
          },
          {
            "name": "settledAmount",
            "type": "u64"
          },
          {
            "name": "refundedAmount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "campaignLocationStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "cancelled"
          },
          {
            "name": "settled"
          }
        ]
      }
    },
    {
      "name": "campaignStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "closed"
          }
        ]
      }
    },
    {
      "name": "campaignUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaign",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "location",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "locationIdx",
            "type": "u64"
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "oracleAuthority",
            "type": "pubkey"
          },
          {
            "name": "locationName",
            "type": "string"
          },
          {
            "name": "locationDescription",
            "type": "string"
          },
          {
            "name": "locationStatus",
            "type": {
              "defined": {
                "name": "locationStatus"
              }
            }
          }
        ]
      }
    },
    {
      "name": "locationRegistered",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "location",
            "type": "pubkey"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "locationIdx",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "locationStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "available"
          },
          {
            "name": "booked",
            "fields": [
              {
                "name": "campaign",
                "type": "pubkey"
              }
            ]
          },
          {
            "name": "inactive"
          }
        ]
      }
    },
    {
      "name": "locationUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "location",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "provider",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "lastLocationId",
            "type": "u64"
          },
          {
            "name": "locationCount",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
