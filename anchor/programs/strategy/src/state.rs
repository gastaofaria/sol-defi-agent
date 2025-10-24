use anchor_lang::prelude::*;

// USDC
pub const TOKEN_MINT: Pubkey = pubkey!("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

// Jupiter Lend
pub const JUPITER_MARKET: Pubkey = pubkey!("jup3YeL8QhtSx1e253b2FDvsMNC87fDrgQZivbrndc9");

// KLend
pub const KAMINO_MARKET: Pubkey = pubkey!("7u3HeHxYDLhnCoErrtycNokbQYbWGzLs6JSDqGAv5PfF");

#[account]
#[derive(InitSpace)]
pub struct Strategy {
    /// The owner of this strategy instance
    pub owner: Pubkey,

    /// Reference to the backend address that can perform admin operations
    pub backend: Pubkey,

    /// Reference to the registry program
    pub registry: Pubkey,

    /// Percentage of funds allocated to Kamino in basis points (e.g., 7000 = 70%)
    pub split_kamino: u16,

    /// Percentage of funds allocated to Jupiter liquidity in basis points (e.g., 3000 = 30%)
    pub split_jupiter: u16,

    /// Bump seed for PDA derivation
    pub bump: u8,
}
