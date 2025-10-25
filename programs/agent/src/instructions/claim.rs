use anchor_lang::prelude::*;
use anchor_lang::solana_program;
use crate::state::*;
use std::str::FromStr;

// Kamino vaults program ID
declare_id!("6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc");

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: Strategy account from Kamino protocol
    #[account(mut)]
    pub strategy: UncheckedAccount<'info>,

    /// CHECK: Global config account from Kamino protocol
    pub global_config: UncheckedAccount<'info>,

    /// CHECK: Base vault authority PDA
    #[account(mut)]
    pub base_vault_authority: UncheckedAccount<'info>,

    /// CHECK: Pool account
    #[account(mut)]
    pub pool: UncheckedAccount<'info>,

    /// CHECK: Tick array lower
    #[account(mut)]
    pub tick_array_lower: UncheckedAccount<'info>,

    /// CHECK: Tick array upper
    #[account(mut)]
    pub tick_array_upper: UncheckedAccount<'info>,

    /// CHECK: Position account
    #[account(mut)]
    pub position: UncheckedAccount<'info>,

    /// CHECK: Raydium protocol position or base vault authority
    #[account(mut)]
    pub raydium_protocol_position_or_base_vault_authority: UncheckedAccount<'info>,

    /// CHECK: Position token account
    pub position_token_account: UncheckedAccount<'info>,

    /// CHECK: Token A vault
    #[account(mut)]
    pub token_a_vault: UncheckedAccount<'info>,

    /// CHECK: Pool token vault A
    #[account(mut)]
    pub pool_token_vault_a: UncheckedAccount<'info>,

    /// CHECK: Token B vault
    #[account(mut)]
    pub token_b_vault: UncheckedAccount<'info>,

    /// CHECK: Pool token vault B
    #[account(mut)]
    pub pool_token_vault_b: UncheckedAccount<'info>,

    /// CHECK: Treasury fee token A vault
    #[account(mut)]
    pub treasury_fee_token_a_vault: UncheckedAccount<'info>,

    /// CHECK: Treasury fee token B vault
    #[account(mut)]
    pub treasury_fee_token_b_vault: UncheckedAccount<'info>,

    /// CHECK: Treasury fee vault authority
    pub treasury_fee_vault_authority: UncheckedAccount<'info>,

    /// CHECK: Reward 0 vault
    #[account(mut)]
    pub reward_0_vault: UncheckedAccount<'info>,

    /// CHECK: Reward 1 vault
    #[account(mut)]
    pub reward_1_vault: UncheckedAccount<'info>,

    /// CHECK: Reward 2 vault
    #[account(mut)]
    pub reward_2_vault: UncheckedAccount<'info>,

    /// CHECK: Pool reward vault 0
    #[account(mut)]
    pub pool_reward_vault_0: UncheckedAccount<'info>,

    /// CHECK: Pool reward vault 1
    #[account(mut)]
    pub pool_reward_vault_1: UncheckedAccount<'info>,

    /// CHECK: Pool reward vault 2
    #[account(mut)]
    pub pool_reward_vault_2: UncheckedAccount<'info>,

    /// CHECK: Token A mint
    pub token_a_mint: UncheckedAccount<'info>,

    /// CHECK: Token B mint
    pub token_b_mint: UncheckedAccount<'info>,

    /// CHECK: Token A token program
    pub token_a_token_program: UncheckedAccount<'info>,

    /// CHECK: Token B token program
    pub token_b_token_program: UncheckedAccount<'info>,

    /// CHECK: Memo program
    pub memo_program: UncheckedAccount<'info>,

    /// CHECK: Token program
    pub token_program: UncheckedAccount<'info>,

    /// CHECK: Token program 2022
    pub token_program_2022: UncheckedAccount<'info>,

    /// CHECK: Pool program
    pub pool_program: UncheckedAccount<'info>,

    /// CHECK: Instruction sysvar account
    pub instruction_sysvar_account: UncheckedAccount<'info>,

    /// CHECK: Event authority (optional)
    pub event_authority: Option<UncheckedAccount<'info>>,
}

pub fn process_claim_rewards(ctx: Context<ClaimRewards>) -> Result<()> {
    // Prepare the accounts for the CPI call
    let account_metas = vec![
        AccountMeta::new(ctx.accounts.user.key(), true),
        AccountMeta::new(ctx.accounts.strategy.key(), false),
        AccountMeta::new_readonly(ctx.accounts.global_config.key(), false),
        AccountMeta::new(ctx.accounts.base_vault_authority.key(), false),
        AccountMeta::new(ctx.accounts.pool.key(), false),
        AccountMeta::new(ctx.accounts.tick_array_lower.key(), false),
        AccountMeta::new(ctx.accounts.tick_array_upper.key(), false),
        AccountMeta::new(ctx.accounts.position.key(), false),
        AccountMeta::new(ctx.accounts.raydium_protocol_position_or_base_vault_authority.key(), false),
        AccountMeta::new_readonly(ctx.accounts.position_token_account.key(), false),
        AccountMeta::new(ctx.accounts.token_a_vault.key(), false),
        AccountMeta::new(ctx.accounts.pool_token_vault_a.key(), false),
        AccountMeta::new(ctx.accounts.token_b_vault.key(), false),
        AccountMeta::new(ctx.accounts.pool_token_vault_b.key(), false),
        AccountMeta::new(ctx.accounts.treasury_fee_token_a_vault.key(), false),
        AccountMeta::new(ctx.accounts.treasury_fee_token_b_vault.key(), false),
        AccountMeta::new_readonly(ctx.accounts.treasury_fee_vault_authority.key(), false),
        AccountMeta::new(ctx.accounts.reward_0_vault.key(), false),
        AccountMeta::new(ctx.accounts.reward_1_vault.key(), false),
        AccountMeta::new(ctx.accounts.reward_2_vault.key(), false),
        AccountMeta::new(ctx.accounts.pool_reward_vault_0.key(), false),
        AccountMeta::new(ctx.accounts.pool_reward_vault_1.key(), false),
        AccountMeta::new(ctx.accounts.pool_reward_vault_2.key(), false),
        AccountMeta::new_readonly(ctx.accounts.token_a_mint.key(), false),
        AccountMeta::new_readonly(ctx.accounts.token_b_mint.key(), false),
        AccountMeta::new_readonly(ctx.accounts.token_a_token_program.key(), false),
        AccountMeta::new_readonly(ctx.accounts.token_b_token_program.key(), false),
        AccountMeta::new_readonly(ctx.accounts.memo_program.key(), false),
        AccountMeta::new_readonly(ctx.accounts.token_program.key(), false),
        AccountMeta::new_readonly(ctx.accounts.token_program_2022.key(), false),
        AccountMeta::new_readonly(ctx.accounts.pool_program.key(), false),
        AccountMeta::new_readonly(ctx.accounts.instruction_sysvar_account.key(), false),
    ];

    // Add optional event_authority if provided
    let mut account_metas = account_metas;
    if let Some(event_authority) = &ctx.accounts.event_authority {
        account_metas.push(AccountMeta::new_readonly(event_authority.key(), false));
    }

    // Build the instruction discriminator for collectFeesAndRewards
    // SHA256("global:collectFeesAndRewards") = ef2db7b788231900...
    let discriminator: [u8; 8] = [0xef, 0x2d, 0xb7, 0xb7, 0x88, 0x23, 0x19, 0x00];

    let mut instruction_data = Vec::new();
    instruction_data.extend_from_slice(&discriminator);

    // Create the instruction
    let kamino_program_id = Pubkey::from_str("6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc")
        .map_err(|_| ProgramError::InvalidArgument)?;

    let instruction = solana_program::instruction::Instruction {
        program_id: kamino_program_id,
        accounts: account_metas,
        data: instruction_data,
    };

    // Prepare account infos for CPI
    let mut account_infos = vec![
        ctx.accounts.user.to_account_info(),
        ctx.accounts.strategy.to_account_info(),
        ctx.accounts.global_config.to_account_info(),
        ctx.accounts.base_vault_authority.to_account_info(),
        ctx.accounts.pool.to_account_info(),
        ctx.accounts.tick_array_lower.to_account_info(),
        ctx.accounts.tick_array_upper.to_account_info(),
        ctx.accounts.position.to_account_info(),
        ctx.accounts.raydium_protocol_position_or_base_vault_authority.to_account_info(),
        ctx.accounts.position_token_account.to_account_info(),
        ctx.accounts.token_a_vault.to_account_info(),
        ctx.accounts.pool_token_vault_a.to_account_info(),
        ctx.accounts.token_b_vault.to_account_info(),
        ctx.accounts.pool_token_vault_b.to_account_info(),
        ctx.accounts.treasury_fee_token_a_vault.to_account_info(),
        ctx.accounts.treasury_fee_token_b_vault.to_account_info(),
        ctx.accounts.treasury_fee_vault_authority.to_account_info(),
        ctx.accounts.reward_0_vault.to_account_info(),
        ctx.accounts.reward_1_vault.to_account_info(),
        ctx.accounts.reward_2_vault.to_account_info(),
        ctx.accounts.pool_reward_vault_0.to_account_info(),
        ctx.accounts.pool_reward_vault_1.to_account_info(),
        ctx.accounts.pool_reward_vault_2.to_account_info(),
        ctx.accounts.token_a_mint.to_account_info(),
        ctx.accounts.token_b_mint.to_account_info(),
        ctx.accounts.token_a_token_program.to_account_info(),
        ctx.accounts.token_b_token_program.to_account_info(),
        ctx.accounts.memo_program.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
        ctx.accounts.token_program_2022.to_account_info(),
        ctx.accounts.pool_program.to_account_info(),
        ctx.accounts.instruction_sysvar_account.to_account_info(),
    ];

    if let Some(event_authority) = &ctx.accounts.event_authority {
        account_infos.push(event_authority.to_account_info());
    }

    // Invoke the CPI call
    solana_program::program::invoke(
        &instruction,
        &account_infos,
    )?;

    Ok(())
}
