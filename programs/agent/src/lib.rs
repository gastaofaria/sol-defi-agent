use anchor_lang::prelude::*;
use instructions::*;

mod error;
mod instructions;
mod state;

declare_id!("9A5w93c2x7YKnvccutrLfuvdw7QW1oLDsf9ajw4SSufb");

#[program]
pub mod agent {
    use super::*;

    pub fn init_registry(ctx: Context<InitRegistry>) -> Result<()> {
        process_init_registry(ctx)
    }

    pub fn init_user(ctx: Context<InitUser>, usdc_address: Pubkey) -> Result<()> {
        process_init_user(ctx, usdc_address)
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        process_deposit(ctx, amount)
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        process_withdraw(ctx, amount)
    }

    pub fn set_protocol(ctx: Context<SetProtocol>, is_kamino: bool) -> Result<()> {
        process_set_protocol(ctx, is_kamino)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
