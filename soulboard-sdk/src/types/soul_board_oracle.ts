/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/soul_board_oracle.json`.
 */
export type SoulBoardOracle = {
  "address": "9hpXQKdSM4gJLa37Lb259dNJ5J2d6wA2sy2sAzni5nNF",
  "metadata": {
    "name": "soulBoardOracle",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addDevice",
      "discriminator": [
        21,
        27,
        66,
        42,
        18,
        30,
        14,
        18
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
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
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
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "location",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateDeviceMetrics",
      "discriminator": [
        148,
        216,
        37,
        250,
        138,
        0,
        189,
        30
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
          "name": "device",
          "writable": true
        }
      ],
      "args": []
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
            "name": "deviceId",
            "type": "u64"
          },
          {
            "name": "location",
            "type": "pubkey"
          },
          {
            "name": "locationIdx",
            "type": "u64"
          },
          {
            "name": "deviceMetrics",
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
      "name": "deviceMetric",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "i64"
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
      }
    },
    {
      "name": "deviceMetrics",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "deviceId",
            "type": "u64"
          },
          {
            "name": "location",
            "type": "pubkey"
          },
          {
            "name": "metrics",
            "type": {
              "vec": {
                "defined": {
                  "name": "deviceMetric"
                }
              }
            }
          }
        ]
      }
    }
  ]
};
