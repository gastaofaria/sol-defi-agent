use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Registry {
    pub backend: Pubkey,
}
