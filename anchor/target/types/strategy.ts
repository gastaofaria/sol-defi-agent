/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/strategy.json`.
 */
export type Strategy = {
  "address": "CdZeD33fXsAHfZYS8jdxg4qHgXYJwBQ1Bv6GJyETtLST",
  "metadata": {
    "name": "strategy",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "manage strategies"
  },
  "instructions": [
    {
      "name": "initStrategy",
      "discriminator": [
        154,
        74,
        215,
        216,
        229,
        204,
        141,
        241
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint"
        },
        {
          "name": "strategy",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "strategyTokenAccount",
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
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "backend",
          "type": "pubkey"
        },
        {
          "name": "registry",
          "type": "pubkey"
        },
        {
          "name": "splitKamino",
          "type": "u16"
        },
        {
          "name": "splitJupiter",
          "type": "u16"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "strategy",
      "discriminator": [
        174,
        110,
        39,
        119,
        82,
        106,
        169,
        102
      ]
    }
  ],
  "types": [
    {
      "name": "strategy",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "docs": [
              "The owner of this strategy instance"
            ],
            "type": "pubkey"
          },
          {
            "name": "backend",
            "docs": [
              "Reference to the backend address that can perform admin operations"
            ],
            "type": "pubkey"
          },
          {
            "name": "registry",
            "docs": [
              "Reference to the registry program"
            ],
            "type": "pubkey"
          },
          {
            "name": "splitKamino",
            "docs": [
              "Percentage of funds allocated to Kamino in basis points (e.g., 7000 = 70%)"
            ],
            "type": "u16"
          },
          {
            "name": "splitJupiter",
            "docs": [
              "Percentage of funds allocated to Jupiter liquidity in basis points (e.g., 3000 = 30%)"
            ],
            "type": "u16"
          },
          {
            "name": "bump",
            "docs": [
              "Bump seed for PDA derivation"
            ],
            "type": "u8"
          }
        ]
      }
    }
  ]
};
