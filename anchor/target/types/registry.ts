/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/registry.json`.
 */
export type Registry = {
  "address": "CdZeD33fXsAHfZYS8jdxg4qHgXYJwBQ1Bv6GJyETtLST",
  "metadata": {
    "name": "registry",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "manage strategies"
  },
  "instructions": [
    {
      "name": "initRegistry",
      "discriminator": [
        131,
        22,
        4,
        103,
        24,
        94,
        163,
        239
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
          "name": "registry",
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
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "registry",
      "discriminator": [
        47,
        174,
        110,
        246,
        184,
        182,
        252,
        218
      ]
    }
  ],
  "types": [
    {
      "name": "registry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "backend",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
