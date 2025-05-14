/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/rug_pull_chronicles_program.json`.
 */
export type RugPullChroniclesProgram = {
  "address": "Fhpi7Xfc6eYZxy5ENLeW4vmRbkWfNZpeFC4Btiqf7sR8",
  "metadata": {
    "name": "rugPullChroniclesProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addCollectionRoyalties",
      "discriminator": [
        11,
        255,
        82,
        131,
        16,
        0,
        47,
        188
      ],
      "accounts": [
        {
          "name": "admin",
          "docs": [
            "The admin who can add collection royalties"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "docs": [
            "The program's config account"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "config.seed",
                "account": "config"
              }
            ]
          }
        },
        {
          "name": "collection",
          "docs": [
            "The collection to update"
          ],
          "writable": true
        },
        {
          "name": "updateAuthorityPda",
          "docs": [
            "The program's update authority PDA"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  112,
                  100,
                  95,
                  97,
                  117,
                  116,
                  104
                ]
              }
            ]
          }
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "basisPoints",
          "type": "u16"
        },
        {
          "name": "creators",
          "type": {
            "vec": {
              "defined": {
                "name": "creatorInput"
              }
            }
          }
        }
      ]
    },
    {
      "name": "addFreezeDelegate",
      "discriminator": [
        98,
        47,
        75,
        227,
        16,
        123,
        72,
        112
      ],
      "accounts": [
        {
          "name": "user",
          "docs": [
            "The user adding the freeze delegate plugin - must be the owner of the asset"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "docs": [
            "The program's config account"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "config.seed",
                "account": "config"
              }
            ]
          }
        },
        {
          "name": "asset",
          "docs": [
            "The NFT to add the freeze delegate to"
          ],
          "writable": true
        },
        {
          "name": "owner",
          "docs": [
            "The owner of the asset - must sign the transaction",
            "This is required for Owner Managed Plugins like Freeze Delegate"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "collection",
          "docs": [
            "The collection the asset belongs to"
          ],
          "writable": true
        },
        {
          "name": "updateAuthorityPda",
          "docs": [
            "The program's update authority PDA"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  112,
                  100,
                  95,
                  97,
                  117,
                  116,
                  104
                ]
              }
            ]
          }
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "frozen",
          "type": "bool"
        },
        {
          "name": "delegate",
          "type": {
            "option": "pubkey"
          }
        }
      ]
    },
    {
      "name": "createCollection",
      "discriminator": [
        156,
        251,
        92,
        54,
        233,
        2,
        16,
        82
      ],
      "accounts": [
        {
          "name": "collection",
          "writable": true,
          "signer": true
        },
        {
          "name": "updateAuthority",
          "optional": true
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "config",
          "docs": [
            "Config account to store the collection address"
          ],
          "writable": true
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        },
        {
          "name": "maxSupply",
          "type": {
            "option": "u32"
          }
        },
        {
          "name": "editionName",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "editionUri",
          "type": {
            "option": "string"
          }
        }
      ]
    },
    {
      "name": "freezeAsset",
      "discriminator": [
        91,
        253,
        207,
        2,
        6,
        105,
        80,
        236
      ],
      "accounts": [
        {
          "name": "delegate",
          "docs": [
            "The authorized delegate who can freeze the asset"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "docs": [
            "The program's config account"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "config.seed",
                "account": "config"
              }
            ]
          }
        },
        {
          "name": "asset",
          "docs": [
            "The NFT to freeze"
          ],
          "writable": true
        },
        {
          "name": "collection",
          "docs": [
            "The collection the asset belongs to"
          ],
          "writable": true
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
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
          "name": "admin",
          "docs": [
            "The payer for all PDAs and collection-mint accounts"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "docs": [
            "Our on-chain config record"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "seed"
              }
            ]
          }
        },
        {
          "name": "updateAuthorityPda",
          "docs": [
            "PDA that will become update_authority on both collections"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  112,
                  100,
                  95,
                  97,
                  117,
                  116,
                  104
                ]
              }
            ]
          }
        },
        {
          "name": "treasuryPda",
          "docs": [
            "General‐ops treasury PDA"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "antiScamTreasuryPda",
          "docs": [
            "Anti‐scam treasury PDA"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121,
                  95,
                  97,
                  110,
                  116,
                  105,
                  95,
                  115,
                  99,
                  97,
                  109
                ]
              }
            ]
          }
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "seed",
          "type": "u64"
        },
        {
          "name": "bumps",
          "type": {
            "defined": {
              "name": "bumpSeeds"
            }
          }
        }
      ]
    },
    {
      "name": "mintScammedNft",
      "discriminator": [
        77,
        171,
        233,
        77,
        142,
        112,
        139,
        221
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "ruggedNftMint",
          "writable": true,
          "signer": true
        },
        {
          "name": "updateAuthorityPda",
          "docs": [
            "Required to sign when adding an asset to a collection"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  112,
                  100,
                  95,
                  97,
                  117,
                  116,
                  104
                ]
              }
            ]
          }
        },
        {
          "name": "scammedCollection",
          "docs": [
            "The scammed collection account",
            "When adding an asset to a collection, the collection becomes the asset's update authority"
          ],
          "writable": true
        },
        {
          "name": "treasury",
          "docs": [
            "Treasury account for collecting platform fees"
          ],
          "writable": true
        },
        {
          "name": "antiscamTreasury",
          "docs": [
            "Anti-scam treasury for collecting donation fees"
          ],
          "writable": true
        },
        {
          "name": "mintTracker",
          "docs": [
            "Simple tracker to prevent duplicate mints - acts as a flag"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116,
                  95,
                  116,
                  114,
                  97,
                  99,
                  107,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "ruggedNftMint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "config",
          "docs": [
            "Config account to store the collection address"
          ],
          "writable": true
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        },
        {
          "name": "scamDetails",
          "type": "string"
        }
      ]
    },
    {
      "name": "mintStandardNft",
      "discriminator": [
        126,
        0,
        75,
        71,
        46,
        198,
        125,
        128
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "ruggedNftMint",
          "writable": true,
          "signer": true
        },
        {
          "name": "updateAuthorityPda",
          "docs": [
            "Required to sign when adding an asset to a collection"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  112,
                  100,
                  95,
                  97,
                  117,
                  116,
                  104
                ]
              }
            ]
          }
        },
        {
          "name": "standardCollection",
          "docs": [
            "The standard collection account",
            "When adding an asset to a collection, the collection becomes the asset's update authority"
          ],
          "writable": true
        },
        {
          "name": "treasury",
          "docs": [
            "Treasury account for collecting platform fees"
          ],
          "writable": true
        },
        {
          "name": "antiscamTreasury",
          "docs": [
            "Anti-scam treasury for collecting donation fees"
          ],
          "writable": true
        },
        {
          "name": "mintTracker",
          "docs": [
            "Simple tracker to prevent duplicate mints - acts as a flag"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  105,
                  110,
                  116,
                  95,
                  116,
                  114,
                  97,
                  99,
                  107,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "ruggedNftMint"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "config",
          "docs": [
            "Config account to store the collection address"
          ],
          "writable": true
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "uri",
          "type": "string"
        },
        {
          "name": "scamYear",
          "type": "string"
        },
        {
          "name": "usdAmountStolen",
          "type": "string"
        },
        {
          "name": "platformCategory",
          "type": "string"
        },
        {
          "name": "typeOfAttack",
          "type": "string"
        }
      ]
    },
    {
      "name": "thawAsset",
      "discriminator": [
        118,
        63,
        80,
        239,
        236,
        22,
        140,
        125
      ],
      "accounts": [
        {
          "name": "delegate",
          "docs": [
            "The authorized delegate who can thaw the asset"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "docs": [
            "The program's config account"
          ],
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "config.seed",
                "account": "config"
              }
            ]
          }
        },
        {
          "name": "asset",
          "docs": [
            "The NFT to thaw"
          ],
          "writable": true
        },
        {
          "name": "collection",
          "docs": [
            "The collection the asset belongs to"
          ],
          "writable": true
        },
        {
          "name": "mplCoreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "togglePaused",
      "discriminator": [
        54,
        83,
        147,
        198,
        123,
        97,
        218,
        72
      ],
      "accounts": [
        {
          "name": "admin",
          "docs": [
            "The admin that can update the config"
          ],
          "signer": true
        },
        {
          "name": "config",
          "docs": [
            "The config account to update"
          ],
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "updateConfigCollection",
      "discriminator": [
        73,
        181,
        47,
        161,
        15,
        67,
        58,
        149
      ],
      "accounts": [
        {
          "name": "admin",
          "docs": [
            "The admin that can update the config"
          ],
          "signer": true
        },
        {
          "name": "config",
          "docs": [
            "The config account to update"
          ],
          "writable": true
        }
      ],
      "args": [
        {
          "name": "collectionAddress",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateConfigRuggedCollection",
      "discriminator": [
        3,
        49,
        241,
        228,
        169,
        217,
        24,
        136
      ],
      "accounts": [
        {
          "name": "admin",
          "docs": [
            "The admin that can update the config"
          ],
          "signer": true
        },
        {
          "name": "config",
          "docs": [
            "The config account to update"
          ],
          "writable": true
        }
      ],
      "args": [
        {
          "name": "collectionAddress",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateFeeSettings",
      "discriminator": [
        155,
        121,
        178,
        253,
        181,
        139,
        103,
        177
      ],
      "accounts": [
        {
          "name": "admin",
          "docs": [
            "The admin that can update the config"
          ],
          "signer": true
        },
        {
          "name": "config",
          "docs": [
            "The config account to update"
          ],
          "writable": true
        }
      ],
      "args": [
        {
          "name": "mintFeeBasisPoints",
          "type": "u16"
        },
        {
          "name": "treasuryFeePercent",
          "type": "u8"
        },
        {
          "name": "antiscamFeePercent",
          "type": "u8"
        }
      ]
    },
    {
      "name": "updateMinimumPayment",
      "discriminator": [
        149,
        223,
        226,
        175,
        142,
        150,
        214,
        194
      ],
      "accounts": [
        {
          "name": "admin",
          "docs": [
            "The admin that can update the config"
          ],
          "signer": true
        },
        {
          "name": "config",
          "docs": [
            "The config account to update"
          ],
          "writable": true
        }
      ],
      "args": [
        {
          "name": "minimumPayment",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "config",
      "discriminator": [
        155,
        12,
        170,
        224,
        30,
        250,
        204,
        130
      ]
    },
    {
      "name": "mintTracker",
      "discriminator": [
        217,
        230,
        22,
        187,
        250,
        88,
        11,
        174
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidFeeDistribution",
      "msg": "The provided fee distribution is invalid. Treasury and anti-scam fee percentages must sum to 100"
    },
    {
      "code": 6001,
      "name": "invalidFeeAmount",
      "msg": "The provided fee amount is too high. Maximum allowed is 50%"
    },
    {
      "code": 6002,
      "name": "invalidMinimumPayment",
      "msg": "The provided minimum payment is too low. Minimum allowed is 0.01 SOL"
    },
    {
      "code": 6003,
      "name": "arithmeticOverflow",
      "msg": "Arithmetic operation resulted in overflow"
    },
    {
      "code": 6004,
      "name": "operationNotAllowedWhenPaused",
      "msg": "The requested operation cannot be performed when the program is paused"
    }
  ],
  "types": [
    {
      "name": "bumpSeeds",
      "docs": [
        "Bumps for the PDAs created in the initialize instruction"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "config",
            "type": "u8"
          },
          {
            "name": "updateAuthorityPda",
            "type": "u8"
          },
          {
            "name": "treasuryPda",
            "type": "u8"
          },
          {
            "name": "antiScamTreasuryPda",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "config",
      "docs": [
        "Holds all of the \"global\" PDAs for Rug Pull Chronicles:",
        "– update authority",
        "– fee treasuries",
        "– collection details",
        "",
        "admin authority"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "docs": [
              "Admin authority that can update config and create collections"
            ],
            "type": "pubkey"
          },
          {
            "name": "seed",
            "docs": [
              "Seed used to generate the config PDA"
            ],
            "type": "u64"
          },
          {
            "name": "updateAuthorityBump",
            "docs": [
              "bump seed for the `upd_auth` PDA"
            ],
            "type": "u8"
          },
          {
            "name": "treasuryBump",
            "docs": [
              "bump seed for the general-ops treasury PDA"
            ],
            "type": "u8"
          },
          {
            "name": "antiscamTreasuryBump",
            "docs": [
              "bump seed for the anti-scam treasury PDA"
            ],
            "type": "u8"
          },
          {
            "name": "standardCollectionBump",
            "docs": [
              "bump seed for standard_collection"
            ],
            "type": "u8"
          },
          {
            "name": "scammedCollectionBump",
            "docs": [
              "bump seed for scammed_collection"
            ],
            "type": "u8"
          },
          {
            "name": "configBump",
            "docs": [
              "Config account's own bump"
            ],
            "type": "u8"
          },
          {
            "name": "updateAuthority",
            "docs": [
              "PDA that becomes MPL-Core's update authority"
            ],
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "docs": [
              "Where we collect platform fees"
            ],
            "type": "pubkey"
          },
          {
            "name": "antiscamTreasury",
            "docs": [
              "Where we send anti-scam donations"
            ],
            "type": "pubkey"
          },
          {
            "name": "standardCollection",
            "docs": [
              "The standard collection mint address"
            ],
            "type": "pubkey"
          },
          {
            "name": "scammedCollection",
            "docs": [
              "The rugged collection mint address"
            ],
            "type": "pubkey"
          },
          {
            "name": "mintFeeBasisPoints",
            "docs": [
              "Mint fee in basis points (e.g., 500 = 5%)"
            ],
            "type": "u16"
          },
          {
            "name": "treasuryFeePercent",
            "docs": [
              "Percentage of fee that goes to treasury (0-100)"
            ],
            "type": "u8"
          },
          {
            "name": "antiscamFeePercent",
            "docs": [
              "Percentage of fee that goes to anti-scam treasury (0-100)"
            ],
            "type": "u8"
          },
          {
            "name": "minimumPayment",
            "docs": [
              "Minimum payment required for minting (in lamports)"
            ],
            "type": "u64"
          },
          {
            "name": "paused",
            "docs": [
              "Circuit breaker flag to pause all functionality in case of emergencies"
            ],
            "type": "bool"
          },
          {
            "name": "totalMintedStandard",
            "docs": [
              "Total number of standard NFTs minted"
            ],
            "type": "u64"
          },
          {
            "name": "totalMintedScammed",
            "docs": [
              "Total number of scammed NFTs minted"
            ],
            "type": "u64"
          },
          {
            "name": "version",
            "docs": [
              "Program version for tracking upgrades"
            ],
            "type": "u16"
          },
          {
            "name": "standardCollectionHasMasterEdition",
            "docs": [
              "Flag indicating if standard collection has Master Edition plugin"
            ],
            "type": "bool"
          },
          {
            "name": "standardCollectionMaxSupply",
            "docs": [
              "Max supply for standard collection (if Master Edition plugin applied)"
            ],
            "type": {
              "option": "u32"
            }
          },
          {
            "name": "scammedCollectionHasMasterEdition",
            "docs": [
              "Flag indicating if scammed collection has Master Edition plugin"
            ],
            "type": "bool"
          },
          {
            "name": "scammedCollectionMaxSupply",
            "docs": [
              "Max supply for scammed collection (if Master Edition plugin applied)"
            ],
            "type": {
              "option": "u32"
            }
          }
        ]
      }
    },
    {
      "name": "creatorInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "pubkey"
          },
          {
            "name": "percentage",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "mintTracker",
      "docs": [
        "Simple tracker to prevent duplicate minting of NFTs",
        "Instead of storing redundant information, we just use this as a",
        "flag to indicate that an NFT mint has already been processed"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "isMinted",
            "docs": [
              "Flag indicating this mint has been processed"
            ],
            "type": "bool"
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "ruggedNftSeed",
      "type": "bytes",
      "value": "[114, 117, 103, 103, 101, 100, 95, 110, 102, 116]"
    }
  ]
};
