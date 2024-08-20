use anchor_lang::prelude::*;

pub mod contexts;
pub mod error;

pub use contexts::*;

declare_id!("CyhusoJP7Po7z8JHdyfhYN58kG1DH9Vmun16ibpiCfBz");

#[program]
pub mod anchor_nft_core_staking {
    use super::*;

    pub fn stake(ctx: Context<Stake>) -> Result<()> {
        ctx.accounts.stake()?;

        Ok(())   
    }

    pub fn unstake(ctx: Context<Stake>) -> Result<()> {
        ctx.accounts.unstake()?;

        Ok(())   
    }
}
