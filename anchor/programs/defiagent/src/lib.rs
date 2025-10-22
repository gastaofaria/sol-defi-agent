#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("Count3AcZucFDPSFBAeHkQ6AvttieKUkyJ8HiQGhQwe");

#[program]
pub mod defiagent {
    use super::*;

    pub fn close(_ctx: Context<CloseDefiagent>) -> Result<()> {
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.defiagent.count = ctx.accounts.defiagent.count.checked_sub(1).unwrap();
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.defiagent.count = ctx.accounts.defiagent.count.checked_add(1).unwrap();
        Ok(())
    }

    pub fn initialize(_ctx: Context<InitializeDefiagent>) -> Result<()> {
        Ok(())
    }

    pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
        ctx.accounts.defiagent.count = value.clone();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeDefiagent<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  init,
  space = 8 + Defiagent::INIT_SPACE,
  payer = payer
    )]
    pub defiagent: Account<'info, Defiagent>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseDefiagent<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  mut,
  close = payer, // close account and return lamports to payer
    )]
    pub defiagent: Account<'info, Defiagent>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub defiagent: Account<'info, Defiagent>,
}

#[account]
#[derive(InitSpace)]
pub struct Defiagent {
    count: u8,
}
