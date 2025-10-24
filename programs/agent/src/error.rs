use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient funds to withdraw.")]
    InsufficientFunds,
    #[msg("Unauthorized access: only the registry authority can perform this action.")]
    UnauthorizedAccess,
}
