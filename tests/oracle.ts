import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {SoulBoardOracle } from "../target/types/soul_board_oracle";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
import { expect, use } from "chai";
import { PublicKey, SystemProgram } from '@solana/web3.js';
import BN from 'bn.js';
const web3 = anchor.web3;


describe(" SoulBoard Oracle " , () => {
    const program = anchor.workspace.soul_board_oracle as Program<SoulBoardOracle>

    const provider = anchor.AnchorProvider.env()

    anchor.setProvider(provider);

    const user = (provider.wallet as anchor.Wallet).payer;
} )