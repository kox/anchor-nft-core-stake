use anchor_lang::prelude::*;

#[error_code]
pub enum CustomErrorCode {
    #[msg("Custom error message")]
    CustomError,

    #[msg("Already staked")]
    AlreadyStaked,

    #[msg("NFT non staked")]
    NonStaked,

    #[msg("Staked time overflow")]
    Overflow,

    #[msg("Staked time underflow")]
    Underflow,
    
    #[msg("Invalid timestamp")]
    InvalidTimestamp
}
