import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorNftCoreStaking } from "../target/types/anchor_nft_core_staking";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, generateSigner, signerIdentity, publicKey, TransactionBuilder } from "@metaplex-foundation/umi";
import { MPL_CORE_PROGRAM_ID, mplCore, createV1, createCollectionV1, fetchAsset } from '@metaplex-foundation/mpl-core'
import { LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import { assert } from "chai";

describe("anchor-nft-core-staking", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const connection = provider.connection;

  const program = anchor.workspace.AnchorNftCoreStaking as Program<AnchorNftCoreStaking>;
  
  const wallet = anchor.Wallet.local();

  console.log(wallet.publicKey.toString());
  // Metaplex Setup
  const umi = createUmi(connection.rpcEndpoint);
  let umiKeypair = umi.eddsa.createKeypairFromSecretKey(wallet.payer.secretKey);
  const signerKeypair = createSignerFromKeypair(umi, umiKeypair);
  umi.use(signerIdentity(signerKeypair)).use(mplCore());

  // Helpers
  function wait(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  const confirm = async (signature: string): Promise<string> => {
    const block = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      signature,
      ...block
    })
    return signature
  }

  const log = async(signature: string): Promise<string> => {
    console.log(`Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${connection.rpcEndpoint}`);
    return signature;
  }

  const collection = generateSigner(umi);
  const asset = generateSigner(umi);

  it('should have some SOL for testing', async () => {
    const balance = await connection.getBalance(wallet.publicKey);
    
    assert.ok(balance > 1 * LAMPORTS_PER_SOL);

  });
  
  it("Creates Assets and Collections", async () => {
    await new TransactionBuilder().add(
      createCollectionV1(umi, {
        collection,
        name: 'My Collection',
        uri: 'https://example.com/my-collection.json',
      })
    ).add(
      createV1(umi, {
        asset: asset,
        name: 'My Nft',
        uri: 'https://example.com/my-nft.json',
        collection: collection.publicKey,
      })
    ).sendAndConfirm(umi)
  });

  it("Stake", async () => {
    const tx = await program.methods.stake()
    .accountsPartial({
      owner: wallet.publicKey,
      updateAuthority: wallet.publicKey,
      payer: wallet.publicKey,
      asset: asset.publicKey,
      collection: collection.publicKey,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
    })
    .signers([wallet.payer])
    .rpc()
    .then(confirm)
    .then(log);

    console.log(tx);
  });

  it("Unstake", async () => {
    await wait(5000);

    const tx = await program.methods.unstake()
    .accountsPartial({
      owner: wallet.publicKey,
      updateAuthority: wallet.publicKey,
      payer: wallet.publicKey,
      asset: asset.publicKey,
      collection: collection.publicKey,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
    })
    .signers([wallet.payer])
    .rpc()
    .then(confirm)
    .then(log);

    console.log(tx);
  });

  it("Stake", async () => {
    await wait(5000);

    const tx = await program.methods.stake()
    .accountsPartial({
      owner: wallet.publicKey,
      updateAuthority: wallet.publicKey,
      payer: wallet.publicKey,
      asset: asset.publicKey,
      collection: collection.publicKey,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
    })
    .signers([wallet.payer])
    .rpc()
    .then(confirm)
    .then(log);

    console.log(tx);
  });

  it("Unstake", async () => {
    await wait(5000);

    try {
      const tx = await program.methods.unstake()
      .accountsPartial({
        owner: wallet.publicKey,
        updateAuthority: wallet.publicKey,
        payer: wallet.publicKey,
        asset: asset.publicKey,
        collection: collection.publicKey,
        mplCoreProgram: MPL_CORE_PROGRAM_ID,
      })
      .signers([wallet.payer])
      .rpc()
      .then(confirm)
      .then(log);
  
      console.log(tx);

    } catch(err) {
      console.log(err);
    }
  });
});