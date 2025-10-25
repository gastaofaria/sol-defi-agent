use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Registry {
    /// Authority to make changes to Registry State
    pub authority: Pubkey,
    /// Mint address of the asset
    pub mint_address: Pubkey,
    /// Current number of tokens in the registry
    pub total_deposits: u64,
    /// Current number of deposit shares in the registry
    pub total_deposit_shares: u64,
    /// Current number of USDC tokens in the registry
    pub usdc_deposits: u64,
    /// Current number of CASH tokens in the registry
    pub cash_deposits: u64,
    /// Last updated timestamp
    pub last_updated: i64,
    pub interest_rate: u64,
    // true: farm Kamino, false: farm Jupiter
    pub is_kamino: bool,
}

// Challenge: How would you update the user state to save "all_deposited_assets" and "all_borrowed_assets" to accommodate for several asset listings?
#[account]
#[derive(InitSpace)]
pub struct User {
    /// Pubkey of the user's wallet
    pub owner: Pubkey,
    /// User's deposited tokens in the USDC registry
    pub deposited_usdc: u64,
    /// User's deposited shares in the USDC registry
    pub deposited_usdc_shares: u64,
    /// USDC mint address
    pub usdc_address: Pubkey,
    /// Last updated timestamp
    pub last_updated: i64,
}
