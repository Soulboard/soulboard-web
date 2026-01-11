import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SoulBoardOracle } from "../target/types/soul_board_oracle";
import { expect } from "chai";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import BN from "bn.js";

describe("soul_board_oracle", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SoulBoardOracle as Program<SoulBoardOracle>;
  const connection = provider.connection;

  const u64 = (value: number | BN) =>
    new BN(value).toArrayLike(Buffer, "le", 8);

  const deriveRegistryPda = (authority: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("device_registry"), authority.toBuffer()],
      program.programId
    )[0];

  const deriveDevicePda = (authority: PublicKey, deviceIdx: BN) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("device"), authority.toBuffer(), u64(deviceIdx)],
      program.programId
    )[0];

  const airdropTo = async (pubkey: PublicKey, sol = 5) => {
    const signature = await connection.requestAirdrop(
      pubkey,
      sol * LAMPORTS_PER_SOL
    );
    const latest = await connection.getLatestBlockhash();
    await connection.confirmTransaction({ signature, ...latest }, "confirmed");
  };

  const expectAnchorError = async (
    promise: Promise<string>,
    code: string | string[]
  ) => {
    try {
      await promise;
      expect.fail("Expected error");
    } catch (error: any) {
      const anchorError = error?.error ?? error;
      const actualCode =
        anchorError?.errorCode?.code ?? anchorError?.error?.errorCode?.code;
      const expectedCodes = Array.isArray(code) ? code : [code];
      expect(expectedCodes).to.include(actualCode);
    }
  };

  const setupRegistry = async () => {
    const authority = Keypair.generate();
    const oracleAuthority = Keypair.generate();
    await airdropTo(authority.publicKey);
    await airdropTo(oracleAuthority.publicKey);

    const registryPda = deriveRegistryPda(authority.publicKey);
    await program.methods
      .createDeviceRegistry()
      .accounts({
        authority: authority.publicKey,
        registry: registryPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc();

    return { authority, oracleAuthority, registryPda };
  };

  const setupDevice = async () => {
    const { authority, oracleAuthority, registryPda } = await setupRegistry();

    const deviceIdx = new BN(0);
    const devicePda = deriveDevicePda(authority.publicKey, deviceIdx);
    const location = Keypair.generate().publicKey;

    await program.methods
      .registerDevice(location, oracleAuthority.publicKey)
      .accounts({
        authority: authority.publicKey,
        registry: registryPda,
        device: devicePda,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc();

    return {
      authority,
      oracleAuthority,
      registryPda,
      deviceIdx,
      devicePda,
      location,
    };
  };

  it("registers a device and reports metrics", async () => {
    const {
      authority,
      oracleAuthority,
      registryPda,
      deviceIdx,
      devicePda,
      location,
    } = await setupDevice();

    await program.methods
      .reportDeviceMetrics(deviceIdx, new BN(100), new BN(250))
      .accounts({
        device: devicePda,
        deviceAuthority: authority.publicKey,
        oracleAuthority: oracleAuthority.publicKey,
      })
      .signers([oracleAuthority])
      .rpc();

    const device = await program.account.device.fetch(devicePda);
    const registry = await program.account.deviceRegistry.fetch(registryPda);
    expect(device.deviceIdx.toString()).to.equal(deviceIdx.toString());
    expect(device.location.toBase58()).to.equal(location.toBase58());
    expect(device.oracleAuthority.toBase58()).to.equal(
      oracleAuthority.publicKey.toBase58()
    );
    expect(device.metrics.totalViews.toNumber()).to.equal(100);
    expect(device.metrics.totalImpressions.toNumber()).to.equal(250);
    expect(device.metrics.lastReportedAt.toNumber()).to.be.greaterThan(0);
    expect(registry.deviceCount.toNumber()).to.equal(1);
    expect(registry.lastDeviceId.toNumber()).to.equal(1);
  });

  it("updates device location, oracle, and status", async () => {
    const { authority, oracleAuthority, deviceIdx, devicePda } =
      await setupDevice();

    const newLocation = Keypair.generate().publicKey;
    const newOracle = Keypair.generate();
    await airdropTo(newOracle.publicKey);

    await program.methods
      .updateDeviceLocation(deviceIdx, newLocation)
      .accounts({
        device: devicePda,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    await program.methods
      .updateDeviceOracle(deviceIdx, newOracle.publicKey)
      .accounts({
        device: devicePda,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    await program.methods
      .setDeviceStatus(deviceIdx, { inactive: {} })
      .accounts({
        device: devicePda,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    const device = await program.account.device.fetch(devicePda);
    expect(device.location.toBase58()).to.equal(newLocation.toBase58());
    expect(device.oracleAuthority.toBase58()).to.equal(
      newOracle.publicKey.toBase58()
    );
    expect(device.status).to.have.property("inactive");
  });

  it("rejects empty metrics reports", async () => {
    const { authority, oracleAuthority, deviceIdx, devicePda } =
      await setupDevice();

    await expectAnchorError(
      program.methods
        .reportDeviceMetrics(deviceIdx, new BN(0), new BN(0))
        .accounts({
          device: devicePda,
          deviceAuthority: authority.publicKey,
          oracleAuthority: oracleAuthority.publicKey,
        })
        .signers([oracleAuthority])
        .rpc(),
      "InvalidParameters"
    );
  });

  it("rejects metrics from the wrong oracle", async () => {
    const { authority, oracleAuthority, registryPda } = await setupRegistry();

    const deviceIdx = new BN(0);
    const devicePda = deriveDevicePda(authority.publicKey, deviceIdx);
    const location = Keypair.generate().publicKey;

    await program.methods
      .registerDevice(location, oracleAuthority.publicKey)
      .accounts({
        authority: authority.publicKey,
        registry: registryPda,
        device: devicePda,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc();

    const wrongOracle = Keypair.generate();
    await airdropTo(wrongOracle.publicKey);

    await expectAnchorError(
      program.methods
        .reportDeviceMetrics(deviceIdx, new BN(10), new BN(10))
        .accounts({
          device: devicePda,
          deviceAuthority: authority.publicKey,
          oracleAuthority: wrongOracle.publicKey,
        })
        .signers([wrongOracle])
        .rpc(),
      "InvalidOracleAuthority"
    );
  });

  it("blocks metrics when device is inactive", async () => {
    const { authority, oracleAuthority, registryPda } = await setupRegistry();

    const deviceIdx = new BN(0);
    const devicePda = deriveDevicePda(authority.publicKey, deviceIdx);
    const location = Keypair.generate().publicKey;

    await program.methods
      .registerDevice(location, oracleAuthority.publicKey)
      .accounts({
        authority: authority.publicKey,
        registry: registryPda,
        device: devicePda,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc();

    await program.methods
      .setDeviceStatus(deviceIdx, { inactive: {} })
      .accounts({
        authority: authority.publicKey,
        device: devicePda,
      })
      .signers([authority])
      .rpc();

    await expectAnchorError(
      program.methods
        .reportDeviceMetrics(deviceIdx, new BN(5), new BN(5))
        .accounts({
          device: devicePda,
          deviceAuthority: authority.publicKey,
          oracleAuthority: oracleAuthority.publicKey,
        })
        .signers([oracleAuthority])
        .rpc(),
      "DeviceInactive"
    );
  });
});
