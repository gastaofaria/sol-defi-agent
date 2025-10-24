use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

#[derive(Accounts)]
pub struct InitRegistry<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
        init,
        space = 8 + Registry::INIT_SPACE,
        payer = signer,
        seeds = [mint.key().as_ref()],
        bump,
    )]
    pub registry: Account<'info, Registry>,
    #[account(
        init,
        token::mint = mint,
        token::authority = strategy_token_account,
        payer = signer,
        seeds = [b"treasury", mint.key().as_ref()],
        bump,
    )]
    pub strategy_token_account: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

pub fn process_init_registry(ctx: Context<InitRegistry>, backend: Pubkey) -> Result<()> {
    let registry = &mut ctx.accounts.registry;
    registry.backend = backend;
    Ok(())
}
