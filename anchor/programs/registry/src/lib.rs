use anchor_lang::prelude::*;
use instructions::*;

declare_id!("CdZeD33fXsAHfZYS8jdxg4qHgXYJwBQ1Bv6GJyETtLST");

#[program]
pub mod lending_protocol {

    use super::*;

    pub fn init_registry(ctx: Context<InitRegistry>) -> Result<()> {
        process_init_registry(ctx)
    }
}
