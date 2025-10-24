use anchor_lang::prelude::*;

mod instructions;
mod state;

use instructions::*;
use state::*;

declare_id!("CdZeD33fXsAHfZYS8jdxg4qHgXYJwBQ1Bv6GJyETtLST");

#[program]
pub mod strategy {

    use super::*;

    pub fn init_strategy(
        ctx: Context<InitStrategy>,
        backend: Pubkey,
        registry: Pubkey,
        split_kamino: u16,
        split_jupiter: u16,
    ) -> Result<()> {
        process_init_strategy(ctx, backend, registry, split_kamino, split_jupiter)
    }
}
