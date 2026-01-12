/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/soulboard.json`.
 */
export type Soulboard = {
    "address": "61yLHnb8vjRGzkKUPGjN4zviBfsy7wHmwwnZpNP8SfcQ";
    "metadata": {
        "name": "soulboard";
        "version": "0.1.0";
        "spec": "0.1.0";
        "description": "Created with Anchor";
    };
    "instructions": [
        {
            "name": "addBudget";
            "discriminator": [
                8,
                21,
                47,
                83,
                188,
                233,
                214,
                5
            ];
            "accounts": [
                {
                    "name": "advertiser";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
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
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "authority";
                            }
                        ];
                    };
                },
                {
                    "name": "campaign";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    99,
                                    97,
                                    109,
                                    112,
                                    97,
                                    105,
                                    103,
                                    110
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "authority";
                            },
                            {
                                "kind": "arg";
                                "path": "campaignIdx";
                            }
                        ];
                    };
                },
                {
                    "name": "authority";
                    "writable": true;
                    "signer": true;
                    "relations": [
                        "advertiser"
                    ];
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [
                {
                    "name": "campaignIdx";
                    "type": "u8";
                },
                {
                    "name": "budget";
                    "type": "u64";
                }
            ];
        },
        {
            "name": "bookLocation";
            "discriminator": [
                55,
                29,
                41,
                10,
                103,
                158,
                172,
                58
            ];
            "accounts": [
                {
                    "name": "location";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    108,
                                    111,
                                    99,
                                    97,
                                    116,
                                    105,
                                    111,
                                    110
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "ad_provider.authority";
                                "account": "provider";
                            },
                            {
                                "kind": "arg";
                                "path": "locationIdx";
                            }
                        ];
                    };
                },
                {
                    "name": "campaign";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    99,
                                    97,
                                    109,
                                    112,
                                    97,
                                    105,
                                    103,
                                    110
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "authority";
                            },
                            {
                                "kind": "arg";
                                "path": "campaignIdx";
                            }
                        ];
                    };
                },
                {
                    "name": "authority";
                    "writable": true;
                    "signer": true;
                    "relations": [
                        "campaign"
                    ];
                },
                {
                    "name": "adProvider";
                    "writable": true;
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [
                {
                    "name": "campaignIdx";
                    "type": "u8";
                },
                {
                    "name": "locationIdx";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "cancelBooking";
            "discriminator": [
                139,
                162,
                116,
                202,
                78,
                140,
                139,
                90
            ];
            "accounts": [
                {
                    "name": "location";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    108,
                                    111,
                                    99,
                                    97,
                                    116,
                                    105,
                                    111,
                                    110
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "ad_provider.authority";
                                "account": "provider";
                            },
                            {
                                "kind": "arg";
                                "path": "locationIdx";
                            }
                        ];
                    };
                },
                {
                    "name": "campaign";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    99,
                                    97,
                                    109,
                                    112,
                                    97,
                                    105,
                                    103,
                                    110
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "authority";
                            },
                            {
                                "kind": "arg";
                                "path": "campaignIdx";
                            }
                        ];
                    };
                },
                {
                    "name": "authority";
                    "writable": true;
                    "signer": true;
                    "relations": [
                        "campaign"
                    ];
                },
                {
                    "name": "adProvider";
                    "writable": true;
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [
                {
                    "name": "campaignIdx";
                    "type": "u8";
                },
                {
                    "name": "locationIdx";
                    "type": "u8";
                },
                {
                    "name": "slotId";
                    "type": "u64";
                }
            ];
        },
        {
            "name": "closeCampaign";
            "discriminator": [
                65,
                49,
                110,
                7,
                63,
                238,
                206,
                77
            ];
            "accounts": [
                {
                    "name": "advertiser";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
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
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "authority";
                            }
                        ];
                    };
                },
                {
                    "name": "campaign";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    99,
                                    97,
                                    109,
                                    112,
                                    97,
                                    105,
                                    103,
                                    110
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "authority";
                            },
                            {
                                "kind": "arg";
                                "path": "campaignIdx";
                            }
                        ];
                    };
                },
                {
                    "name": "authority";
                    "writable": true;
                    "signer": true;
                    "relations": [
                        "advertiser",
                        "campaign"
                    ];
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [
                {
                    "name": "campaignIdx";
                    "type": "u8";
                }
            ];
        },
        {
            "name": "createAdvertiser";
            "discriminator": [
                249,
                170,
                60,
                235,
                33,
                219,
                7,
                83
            ];
            "accounts": [
                {
                    "name": "authority";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "advertiser";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
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
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "authority";
                            }
                        ];
                    };
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [];
        },
        {
            "name": "createCampaign";
            "discriminator": [
                111,
                131,
                187,
                98,
                160,
                193,
                114,
                244
            ];
            "accounts": [
                {
                    "name": "advertiser";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
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
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "authority";
                            }
                        ];
                    };
                },
                {
                    "name": "campaign";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    99,
                                    97,
                                    109,
                                    112,
                                    97,
                                    105,
                                    103,
                                    110
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "authority";
                            },
                            {
                                "kind": "account";
                                "path": "advertiser.last_campaign_id";
                                "account": "advertiser";
                            }
                        ];
                    };
                },
                {
                    "name": "authority";
                    "writable": true;
                    "signer": true;
                    "relations": [
                        "advertiser"
                    ];
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [
                {
                    "name": "campaignName";
                    "type": "string";
                },
                {
                    "name": "campaignDescription";
                    "type": "string";
                },
                {
                    "name": "campaignImageUrl";
                    "type": "string";
                },
                {
                    "name": "budget";
                    "type": "u64";
                }
            ];
        },
        {
            "name": "createProvider";
            "discriminator": [
                74,
                53,
                211,
                174,
                38,
                168,
                227,
                177
            ];
            "accounts": [
                {
                    "name": "authority";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                },
                {
                    "name": "provider";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    112,
                                    114,
                                    111,
                                    118,
                                    105,
                                    100,
                                    101,
                                    114
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "authority";
                            }
                        ];
                    };
                }
            ];
            "args": [];
        },
        {
            "name": "registerLocation";
            "discriminator": [
                6,
                192,
                107,
                95,
                99,
                19,
                126,
                64
            ];
            "accounts": [
                {
                    "name": "provider";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    112,
                                    114,
                                    111,
                                    118,
                                    105,
                                    100,
                                    101,
                                    114
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "authority";
                            }
                        ];
                    };
                },
                {
                    "name": "authority";
                    "writable": true;
                    "signer": true;
                    "relations": [
                        "provider"
                    ];
                },
                {
                    "name": "location";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    108,
                                    111,
                                    99,
                                    97,
                                    116,
                                    105,
                                    111,
                                    110
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "authority";
                            },
                            {
                                "kind": "account";
                                "path": "provider.last_location_id";
                                "account": "provider";
                            }
                        ];
                    };
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [
                {
                    "name": "locationName";
                    "type": "string";
                },
                {
                    "name": "locationDescription";
                    "type": "string";
                }
            ];
        },
        {
            "name": "withdrawAmount";
            "discriminator": [
                174,
                32,
                44,
                71,
                244,
                75,
                235,
                8
            ];
            "accounts": [
                {
                    "name": "advertiser";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
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
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "authority";
                            }
                        ];
                    };
                },
                {
                    "name": "campaign";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    99,
                                    97,
                                    109,
                                    112,
                                    97,
                                    105,
                                    103,
                                    110
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "authority";
                            },
                            {
                                "kind": "arg";
                                "path": "campaignIdx";
                            }
                        ];
                    };
                },
                {
                    "name": "authority";
                    "writable": true;
                    "signer": true;
                    "relations": [
                        "advertiser",
                        "campaign"
                    ];
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [
                {
                    "name": "campaignIdx";
                    "type": "u8";
                },
                {
                    "name": "amount";
                    "type": "u64";
                }
            ];
        },
        {
            "name": "withdrawEarnings";
            "discriminator": [
                6,
                132,
                233,
                254,
                241,
                87,
                247,
                185
            ];
            "accounts": [
                {
                    "name": "location";
                    "writable": true;
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const";
                                "value": [
                                    108,
                                    111,
                                    99,
                                    97,
                                    116,
                                    105,
                                    111,
                                    110
                                ];
                            },
                            {
                                "kind": "account";
                                "path": "authority";
                            },
                            {
                                "kind": "arg";
                                "path": "locationIdx";
                            }
                        ];
                    };
                },
                {
                    "name": "authority";
                    "writable": true;
                    "signer": true;
                },
                {
                    "name": "systemProgram";
                    "address": "11111111111111111111111111111111";
                }
            ];
            "args": [
                {
                    "name": "locationIdx";
                    "type": "u8";
                },
                {
                    "name": "amount";
                    "type": "u64";
                }
            ];
        }
    ];
    "accounts": [
        {
            "name": "advertiser";
            "discriminator": [
                224,
                189,
                134,
                74,
                86,
                113,
                216,
                184
            ];
        },
        {
            "name": "campaign";
            "discriminator": [
                50,
                40,
                49,
                11,
                157,
                220,
                229,
                192
            ];
        },
        {
            "name": "location";
            "discriminator": [
                73,
                140,
                105,
                78,
                215,
                159,
                92,
                234
            ];
        },
        {
            "name": "provider";
            "discriminator": [
                164,
                180,
                71,
                17,
                75,
                216,
                80,
                195
            ];
        }
    ];
    "errors": [
        {
            "code": 6000;
            "name": "invalidAuthority";
            "msg": "Invalid authority";
        },
        {
            "code": 6001;
            "name": "unauthorized";
            "msg": "Unauthorized operation";
        },
        {
            "code": 6002;
            "name": "campaignNotFound";
            "msg": "Campaign not found";
        },
        {
            "code": 6003;
            "name": "campaignAlreadyExists";
            "msg": "Campaign already exists";
        },
        {
            "code": 6004;
            "name": "insufficientBudget";
            "msg": "Insufficient campaign budget";
        },
        {
            "code": 6005;
            "name": "locationNotFound";
            "msg": "Location not found";
        },
        {
            "code": 6006;
            "name": "locationAlreadyExists";
            "msg": "Location already exists";
        },
        {
            "code": 6007;
            "name": "slotNotFound";
            "msg": "Slot not found";
        },
        {
            "code": 6008;
            "name": "slotAlreadyBooked";
            "msg": "Slot already booked";
        },
        {
            "code": 6009;
            "name": "slotAlreadyExists";
            "msg": "Slot already exists";
        },
        {
            "code": 6010;
            "name": "slotUnavailable";
            "msg": "Slot is unavailable";
        },
        {
            "code": 6011;
            "name": "invalidSlotStatus";
            "msg": "Invalid slot status";
        },
        {
            "code": 6012;
            "name": "maxSlotsReached";
            "msg": "Maximum number of slots reached";
        },
        {
            "code": 6013;
            "name": "bookingNotFound";
            "msg": "Booking not found";
        },
        {
            "code": 6014;
            "name": "invalidBooking";
            "msg": "Invalid booking";
        },
        {
            "code": 6015;
            "name": "transferFailed";
            "msg": "Transfer failed";
        },
        {
            "code": 6016;
            "name": "arithmeticOverflow";
            "msg": "Arithmetic overflow";
        },
        {
            "code": 6017;
            "name": "arithmeticUnderflow";
            "msg": "Arithmetic underflow";
        },
        {
            "code": 6018;
            "name": "invalidParameters";
            "msg": "Invalid parameters";
        },
        {
            "code": 6019;
            "name": "slotNotBooked";
            "msg": "Slot not booked";
        },
        {
            "code": 6020;
            "name": "insufficientEarnings";
            "msg": "Insufficient earnings";
        }
    ];
    "types": [
        {
            "name": "advertiser";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "authority";
                        "type": "pubkey";
                    },
                    {
                        "name": "lastCampaignId";
                        "type": "u8";
                    },
                    {
                        "name": "campaignCount";
                        "type": "u8";
                    }
                ];
            };
        },
        {
            "name": "campaign";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "authority";
                        "type": "pubkey";
                    },
                    {
                        "name": "campaignIdx";
                        "type": "u8";
                    },
                    {
                        "name": "campaignName";
                        "type": "string";
                    },
                    {
                        "name": "campaignDescription";
                        "type": "string";
                    },
                    {
                        "name": "campaignImageUrl";
                        "type": "string";
                    },
                    {
                        "name": "bookedLocations";
                        "type": {
                            "vec": {
                                "defined": {
                                    "name": "locationBooking";
                                };
                            };
                        };
                    }
                ];
            };
        },
        {
            "name": "location";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "authority";
                        "type": "pubkey";
                    },
                    {
                        "name": "locationIdx";
                        "type": "u8";
                    },
                    {
                        "name": "price";
                        "type": "u64";
                    },
                    {
                        "name": "locationName";
                        "type": "string";
                    },
                    {
                        "name": "locationDescription";
                        "type": "string";
                    },
                    {
                        "name": "locationStatus";
                        "type": {
                            "defined": {
                                "name": "locationStatus";
                            };
                        };
                    }
                ];
            };
        },
        {
            "name": "locationBooking";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "location";
                        "type": "pubkey";
                    }
                ];
            };
        },
        {
            "name": "locationStatus";
            "type": {
                "kind": "enum";
                "variants": [
                    {
                        "name": "available";
                    },
                    {
                        "name": "booked";
                        "fields": [
                            {
                                "name": "campaignId";
                                "type": "pubkey";
                            }
                        ];
                    },
                    {
                        "name": "unavailable";
                    }
                ];
            };
        },
        {
            "name": "provider";
            "type": {
                "kind": "struct";
                "fields": [
                    {
                        "name": "authority";
                        "type": "pubkey";
                    },
                    {
                        "name": "lastLocationId";
                        "type": "u8";
                    },
                    {
                        "name": "locationCount";
                        "type": "u8";
                    }
                ];
            };
        }
    ];
};
