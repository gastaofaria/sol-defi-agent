use anchor_lang::prelude::*;
use crate::state::*;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct SetProtocol<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        constraint = registry.authority == signer.key() @ ErrorCode::UnauthorizedAccess
    )]
    pub registry: Account<'info, Registry>,
}

pub fn process_set_protocol(ctx: Context<SetProtocol>, is_kamino: bool) -> Result<()> {
    let registry = &mut ctx.accounts.registry;

    // Set the protocol based on the is_kamino parameter
    registry.is_kamino = is_kamino;

    // Update the last_updated timestamp
    let now = Clock::get()?.unix_timestamp;
    registry.last_updated = now;

    Ok(())
}
