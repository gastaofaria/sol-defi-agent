use anchor_lang::prelude::*;

mod instructions;
mod state;

use instructions::*;

declare_id!("CdZeD33fXsAHfZYS8jdxg4qHgXYJwBQ1Bv6GJyETtLST");

#[program]
pub mod registry {

    use super::*;

    pub fn init_registry(ctx: Context<InitRegistry>, backend: Pubkey) -> Result<()> {
        process_init_registry(ctx, backend)
    }
}
