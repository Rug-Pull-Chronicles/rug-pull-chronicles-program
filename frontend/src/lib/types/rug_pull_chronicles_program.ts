export type RugPullChroniclesProgram = {
    "version": "0.1.0",
    "name": "rug_pull_chronicles_program",
    "instructions": [
        {
            "name": "initialize",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "config",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "updateAuthorityPda",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "treasuryPda",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "antiScamTreasuryPda",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "mplCoreProgram",
                    "isMut": false,
                    "isSigner": false
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
                        "defined": "BumpSeeds"
                    }
                }
            ]
        },
        {
            "name": "createCollection",
            "accounts": [
                {
                    "name": "collection",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "updateAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "mplCoreProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "config",
                    "isMut": false,
                    "isSigner": false
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
                }
            ]
        },
        {
            "name": "updateConfigCollection",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "config",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "collectionAddress",
                    "type": "publicKey"
                }
            ]
        },
        {
            "name": "updateConfigRuggedCollection",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "config",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "collectionAddress",
                    "type": "publicKey"
                }
            ]
        },
        {
            "name": "updateFeeSettings",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "config",
                    "isMut": true,
                    "isSigner": false
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
            "name": "addCollectionRoyalties",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "config",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "collection",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "updateAuthorityPda",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "mplCoreProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
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
                            "defined": "CreatorInput"
                        }
                    }
                }
            ]
        },
        {
            "name": "mintStandardNft",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "ruggedNftMint",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "updateAuthorityPda",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "standardCollection",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "treasury",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "antiscamTreasury",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "mplCoreProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "config",
                    "isMut": false,
                    "isSigner": false
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
            "name": "mintScammedNft",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "ruggedNftMint",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "updateAuthorityPda",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "scammedCollection",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "treasury",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "antiscamTreasury",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "mplCoreProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "config",
                    "isMut": false,
                    "isSigner": false
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
        }
    ],
    "accounts": [
        {
            "name": "Config",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "seed",
                        "type": "u64"
                    },
                    {
                        "name": "updateAuthority",
                        "type": "publicKey"
                    },
                    {
                        "name": "treasury",
                        "type": "publicKey"
                    },
                    {
                        "name": "antiscamTreasury",
                        "type": "publicKey"
                    },
                    {
                        "name": "standardCollection",
                        "type": "publicKey"
                    },
                    {
                        "name": "scammedCollection",
                        "type": "publicKey"
                    },
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
            }
        }
    ],
    "types": [
        {
            "name": "BumpSeeds",
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
            "name": "CreatorInput",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "address",
                        "type": "publicKey"
                    },
                    {
                        "name": "percentage",
                        "type": "u8"
                    }
                ]
            }
        }
    ]
};

export const IDL: RugPullChroniclesProgram = {
    "version": "0.1.0",
    "name": "rug_pull_chronicles_program",
    "instructions": [
        {
            "name": "initialize",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "config",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "updateAuthorityPda",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "treasuryPda",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "antiScamTreasuryPda",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "mplCoreProgram",
                    "isMut": false,
                    "isSigner": false
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
                        "defined": "BumpSeeds"
                    }
                }
            ]
        },
        {
            "name": "createCollection",
            "accounts": [
                {
                    "name": "collection",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "updateAuthority",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "mplCoreProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "config",
                    "isMut": false,
                    "isSigner": false
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
                }
            ]
        },
        {
            "name": "updateConfigCollection",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "config",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "collectionAddress",
                    "type": "publicKey"
                }
            ]
        },
        {
            "name": "updateConfigRuggedCollection",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "config",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "collectionAddress",
                    "type": "publicKey"
                }
            ]
        },
        {
            "name": "updateFeeSettings",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "config",
                    "isMut": true,
                    "isSigner": false
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
            "name": "addCollectionRoyalties",
            "accounts": [
                {
                    "name": "admin",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "config",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "collection",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "updateAuthorityPda",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "mplCoreProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
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
                            "defined": "CreatorInput"
                        }
                    }
                }
            ]
        },
        {
            "name": "mintStandardNft",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "ruggedNftMint",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "updateAuthorityPda",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "standardCollection",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "treasury",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "antiscamTreasury",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "mplCoreProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "config",
                    "isMut": false,
                    "isSigner": false
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
            "name": "mintScammedNft",
            "accounts": [
                {
                    "name": "user",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "ruggedNftMint",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "updateAuthorityPda",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "scammedCollection",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "treasury",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "antiscamTreasury",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "mplCoreProgram",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "config",
                    "isMut": false,
                    "isSigner": false
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
        }
    ],
    "accounts": [
        {
            "name": "Config",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "seed",
                        "type": "u64"
                    },
                    {
                        "name": "updateAuthority",
                        "type": "publicKey"
                    },
                    {
                        "name": "treasury",
                        "type": "publicKey"
                    },
                    {
                        "name": "antiscamTreasury",
                        "type": "publicKey"
                    },
                    {
                        "name": "standardCollection",
                        "type": "publicKey"
                    },
                    {
                        "name": "scammedCollection",
                        "type": "publicKey"
                    },
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
            }
        }
    ],
    "types": [
        {
            "name": "BumpSeeds",
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
            "name": "CreatorInput",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "address",
                        "type": "publicKey"
                    },
                    {
                        "name": "percentage",
                        "type": "u8"
                    }
                ]
            }
        }
    ]
}; 