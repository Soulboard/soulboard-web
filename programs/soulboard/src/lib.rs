use anchor_lang::prelude::*;

declare_id!("61yLHnb8vjRGzkKUPGjN4zviBfsy7wHmwwnZpNP8SfcQ");

#[program]
pub mod soulboard {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
