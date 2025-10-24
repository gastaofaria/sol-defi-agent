import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Strategy } from '../target/types/strategy';
import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, createMint, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import { expect } from 'chai';

describe('strategy', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Strategy as Program<Strategy>;
  const payer = provider.wallet as anchor.Wallet;

  let mint: PublicKey;
  let strategyPda: PublicKey;
  let strategyBump: number;
  let treasuryPda: PublicKey;
  let treasuryBump: number;
  let backendKeypair: Keypair;
  let registryKeypair: Keypair;

  before(async () => {
    // Create a test mint (USDC-like token)
    mint = await createMint(
      provider.connection,
      payer.payer,
      payer.publicKey,
      payer.publicKey,
      6 // 6 decimals like USDC
    );

    // Generate backend and registry keypairs
    backendKeypair = Keypair.generate();
    registryKeypair = Keypair.generate();

    // Derive PDAs
    [strategyPda, strategyBump] = PublicKey.findProgramAddressSync(
      [mint.toBuffer()],
      program.programId
    );

    [treasuryPda, treasuryBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('treasury'), mint.toBuffer()],
      program.programId
    );
  });

  it('Initialize Strategy', async () => {
    const splitKamino = 7000; // 70%
    const splitJupiter = 3000; // 30%

    const tx = await program.methods
      .initStrategy(
        backendKeypair.publicKey,
        registryKeypair.publicKey,
        splitKamino,
        splitJupiter
      )
      .accounts({
        signer: payer.publicKey,
        mint: mint,
        strategy: strategyPda,
        strategyTokenAccount: treasuryPda,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log('Initialize strategy transaction signature:', tx);

    // Fetch and verify the strategy account
    const strategyAccount = await program.account.strategy.fetch(strategyPda);

    expect(strategyAccount.owner.toString()).to.equal(payer.publicKey.toString());
    expect(strategyAccount.backend.toString()).to.equal(backendKeypair.publicKey.toString());
    expect(strategyAccount.registry.toString()).to.equal(registryKeypair.publicKey.toString());
    expect(strategyAccount.splitKamino).to.equal(splitKamino);
    expect(strategyAccount.splitJupiter).to.equal(splitJupiter);
  });

  it('Verify treasury token account was created', async () => {
    // Verify the treasury token account exists and has the correct properties
    const tokenAccountInfo = await provider.connection.getAccountInfo(treasuryPda);

    expect(tokenAccountInfo).to.not.be.null;
    expect(tokenAccountInfo.owner.toString()).to.equal(TOKEN_2022_PROGRAM_ID.toString());
  });

  it('Should fail to initialize same strategy twice', async () => {
    const splitKamino = 5000;
    const splitJupiter = 5000;

    try {
      await program.methods
        .initStrategy(
          backendKeypair.publicKey,
          registryKeypair.publicKey,
          splitKamino,
          splitJupiter
        )
        .accounts({
          signer: payer.publicKey,
          mint: mint,
          strategy: strategyPda,
          strategyTokenAccount: treasuryPda,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      // If we get here, the test should fail
      expect.fail('Should have thrown an error');
    } catch (error) {
      // Verify it's the expected error (account already initialized)
      expect(error.toString()).to.include('already in use');
    }
  });
});
