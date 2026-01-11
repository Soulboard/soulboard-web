/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/soul_board_oracle.json`.
 */
export type SoulBoardOracle = {
  "address": "HbjHJmYYCSjfyiJWCRvaYWo1vKsgRurFDkrxNnNusVFX",
  "metadata": {
    "name": "soulBoardOracle",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createDeviceRegistry",
      "discriminator": [
        131,
        80,
        204,
        27,
        54,
        238,
        200,
        41
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "registry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  118,
                  105,
                  99,
                  101,
                  95,
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121
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
      "name": "registerDevice",
      "discriminator": [
        210,
        151,
        56,
        68,
        22,
        158,
        90,
        193
      ],
      "accounts": [
        {
          "name": "registry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  118,
                  105,
                  99,
                  101,
                  95,
                  114,
                  101,
                  103,
                  105,
                  115,
                  116,
                  114,
                  121
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
          "name": "device",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  118,
                  105,
                  99,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "account",
                "path": "registry.last_device_id",
                "account": "deviceRegistry"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "registry"
          ]
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "location",
          "type": "pubkey"
        },
        {
          "name": "oracleAuthority",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "reportDeviceMetrics",
      "discriminator": [
        167,
        111,
        216,
        158,
        228,
        237,
        202,
        110
      ],
      "accounts": [
        {
          "name": "device",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  118,
                  105,
                  99,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "deviceAuthority"
              },
              {
                "kind": "arg",
                "path": "deviceIdx"
              }
            ]
          }
        },
        {
          "name": "deviceAuthority"
        },
        {
          "name": "oracleAuthority",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "deviceIdx",
          "type": "u64"
        },
        {
          "name": "views",
          "type": "u64"
        },
        {
          "name": "impressions",
          "type": "u64"
        }
      ]
    },
    {
      "name": "setDeviceStatus",
      "discriminator": [
        151,
        78,
        75,
        125,
        26,
        121,
        118,
        57
      ],
      "accounts": [
        {
          "name": "device",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  118,
                  105,
                  99,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "arg",
                "path": "deviceIdx"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "device"
          ]
        }
      ],
      "args": [
        {
          "name": "deviceIdx",
          "type": "u64"
        },
        {
          "name": "status",
          "type": {
            "defined": {
              "name": "deviceStatus"
            }
          }
        }
      ]
    },
    {
      "name": "updateDeviceLocation",
      "discriminator": [
        73,
        91,
        38,
        107,
        101,
        244,
        49,
        252
      ],
      "accounts": [
        {
          "name": "device",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  118,
                  105,
                  99,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "arg",
                "path": "deviceIdx"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "device"
          ]
        }
      ],
      "args": [
        {
          "name": "deviceIdx",
          "type": "u64"
        },
        {
          "name": "location",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateDeviceOracle",
      "discriminator": [
        119,
        208,
        173,
        7,
        221,
        44,
        220,
        201
      ],
      "accounts": [
        {
          "name": "device",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  118,
                  105,
                  99,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              },
              {
                "kind": "arg",
                "path": "deviceIdx"
              }
            ]
          }
        },
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "device"
          ]
        }
      ],
      "args": [
        {
          "name": "deviceIdx",
          "type": "u64"
        },
        {
          "name": "oracleAuthority",
          "type": "pubkey"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "device",
      "discriminator": [
        153,
        248,
        23,
        39,
        83,
        45,
        68,
        128
      ]
    },
    {
      "name": "deviceRegistry",
      "discriminator": [
        103,
        245,
        70,
        187,
        154,
        60,
        208,
        216
      ]
    }
  ],
  "events": [
    {
      "name": "deviceLocationUpdated",
      "discriminator": [
        23,
        18,
        155,
        48,
        81,
        51,
        186,
        75
      ]
    },
    {
      "name": "deviceMetricsReported",
      "discriminator": [
        83,
        54,
        173,
        236,
        81,
        5,
        102,
        13
      ]
    },
    {
      "name": "deviceOracleUpdated",
      "discriminator": [
        163,
        101,
        119,
        241,
        250,
        143,
        147,
        150
      ]
    },
    {
      "name": "deviceRegistered",
      "discriminator": [
        221,
        90,
        2,
        153,
        72,
        98,
        71,
        181
      ]
    },
    {
      "name": "deviceRegistryCreated",
      "discriminator": [
        22,
        99,
        185,
        119,
        249,
        100,
        36,
        68
      ]
    },
    {
      "name": "deviceStatusUpdated",
      "discriminator": [
        32,
        242,
        77,
        41,
        85,
        110,
        123,
        182
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
      "name": "unauthorized",
      "msg": "Unauthorized operation"
    },
    {
      "code": 6002,
      "name": "deviceInactive",
      "msg": "Device is inactive"
    },
    {
      "code": 6003,
      "name": "invalidParameters",
      "msg": "Invalid parameters"
    },
    {
      "code": 6004,
      "name": "invalidOracleAuthority",
      "msg": "Invalid oracle authority"
    },
    {
      "code": 6005,
      "name": "arithmeticOverflow",
      "msg": "Arithmetic overflow"
    },
    {
      "code": 6006,
      "name": "arithmeticUnderflow",
      "msg": "Arithmetic underflow"
    }
  ],
  "types": [
    {
      "name": "device",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "deviceIdx",
            "type": "u64"
          },
          {
            "name": "location",
            "type": "pubkey"
          },
          {
            "name": "oracleAuthority",
            "type": "pubkey"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "deviceStatus"
              }
            }
          },
          {
            "name": "metrics",
            "type": {
              "defined": {
                "name": "deviceMetrics"
              }
            }
          }
        ]
      }
    },
    {
      "name": "deviceLocationUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "device",
            "type": "pubkey"
          },
          {
            "name": "location",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "deviceMetrics",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "totalViews",
            "type": "u64"
          },
          {
            "name": "totalImpressions",
            "type": "u64"
          },
          {
            "name": "lastReportedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "deviceMetricsReported",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "device",
            "type": "pubkey"
          },
          {
            "name": "views",
            "type": "u64"
          },
          {
            "name": "impressions",
            "type": "u64"
          },
          {
            "name": "totalViews",
            "type": "u64"
          },
          {
            "name": "totalImpressions",
            "type": "u64"
          },
          {
            "name": "reportedAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "deviceOracleUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "device",
            "type": "pubkey"
          },
          {
            "name": "oracleAuthority",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "deviceRegistered",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "device",
            "type": "pubkey"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "deviceIdx",
            "type": "u64"
          },
          {
            "name": "location",
            "type": "pubkey"
          },
          {
            "name": "oracleAuthority",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "deviceRegistry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "lastDeviceId",
            "type": "u64"
          },
          {
            "name": "deviceCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "deviceRegistryCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "registry",
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
      "name": "deviceStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "inactive"
          }
        ]
      }
    },
    {
      "name": "deviceStatusUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "device",
            "type": "pubkey"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "deviceStatus"
              }
            }
          }
        ]
      }
    }
  ]
};
