use crate::state::*;
use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};

#[derive(Accounts)]
pub struct InitStrategy<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
        init, 
        space = 8 + Strategy::INIT_SPACE, 
        payer = signer,
        seeds = [mint.key().as_ref()],
        bump, 
    )]
    pub strategy: Account<'info, Strategy>,
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

pub fn process_init_strategy(ctx: Context<InitStrategy>, backend: Pubkey, registry: Pubkey, split_kamino: u16, split_jupiter: u16) -> Result<()> {
    let strategy = &mut ctx.accounts.strategy;
    strategy.owner = ctx.accounts.signer.key();
    strategy.backend = backend;
    strategy.registry = registry;
    strategy.split_kamino = split_kamino;
    strategy.split_jupiter = split_jupiter;
    Ok(())
}
