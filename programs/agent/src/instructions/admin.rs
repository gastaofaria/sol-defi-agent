use anchor_lang::prelude::*;
use anchor_spl::token_interface::{ Mint, TokenAccount, TokenInterface };
use crate::state::*;

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
        token::authority = registry_token_account,
        payer = signer,
        seeds = [b"treasury", mint.key().as_ref()],
        bump,
    )]
    pub registry_token_account: InterfaceAccount<'info, TokenAccount>,
    pub token_program: Interface<'info, TokenInterface>, 
    pub system_program: Program <'info, System>,
}

#[derive(Accounts)]
pub struct InitUser<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer, 
        space = 8 + User::INIT_SPACE,
        seeds = [signer.key().as_ref()],
        bump,
    )]
    pub user_account: Account<'info, User>,
    pub system_program: Program <'info, System>,
}

pub fn process_init_registry(ctx: Context<InitRegistry>) -> Result<()> {
    let registry = &mut ctx.accounts.registry;
    registry.mint_address = ctx.accounts.mint.key();
    registry.authority = ctx.accounts.signer.key();
    Ok(())
}

pub fn process_init_user(ctx: Context<InitUser>, usdc_address: Pubkey) -> Result<()> {
    let user = &mut ctx.accounts.user_account;
    user.owner = ctx.accounts.signer.key();
    user.usdc_address = usdc_address;
    
    let now = Clock::get()?.unix_timestamp; 
    user.last_updated = now;

    Ok(())
}