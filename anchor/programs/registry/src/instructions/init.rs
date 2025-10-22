use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct InitRegistry<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub mint: InterfaceAccount<'info, Mint>,
    #[account(
        init, 
        space = 8 + Bank::INIT_SPACE, 
        payer = signer,
        seeds = [mint.key().as_ref()],
        bump, 
    )]
    pub bank: Account<'info, Bank>,
    #[account(
        init, 
        token::mint = mint, 
        token::authority = bank_token_account,
        payer = signer,
        seeds = [b"treasury", mint.key().as_ref()],
        bump,
    )]
    pub bank_token_account: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>, 
    pub system_program: Program <'info, System>,
}

pub fn process_init_registry(ctx: Context<InitRegistry>, admin: Pubkey, backend: Pubkey) -> Result<()> {
    let registry = &mut ctx.accounts.registry;
    registry.admin = admin;
    registry.backend = backend;
    Ok(())
}
