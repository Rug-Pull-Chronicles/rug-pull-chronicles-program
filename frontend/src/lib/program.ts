import * as anchor from '@coral-xyz/anchor';
import { PublicKey, Connection, Keypair, SystemProgram } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { IDL } from './types/rug_pull_chronicles_program';
import { BN } from 'bn.js';

// Program ID 
export const PROGRAM_ID = new PublicKey('6cfjRrqry3MFPH9L7r2A44iCnCuoin6dauAwv1xa1Sc9');

// Metaplex Core Program ID
export const MPL_CORE_PROGRAM_ID = new PublicKey('CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d');

// Default seed for PDAs
export const DEFAULT_SEED = new BN(9876);

// Get program instance with connected wallet
export const getProgram = (wallet: WalletContextState, connection: Connection) => {
    if (!wallet.publicKey) {
        throw new Error('Wallet not connected');
    }

    // Create provider
    const provider = new anchor.AnchorProvider(
        connection,
        wallet as any,
        { commitment: 'confirmed' }
    );

    // Create and return the program instance
    // @ts-ignore - TypeScript has issues with the constructor parameters
    return new anchor.Program(IDL, PROGRAM_ID, provider);
};

// Get PDAs for the program
export const getPDAs = async (seed = DEFAULT_SEED) => {
    const seedBuffer = seed.toArrayLike(Buffer, 'le', 8);

    const [configPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('config'), seedBuffer],
        PROGRAM_ID
    );

    const [updateAuthorityPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('upd_auth')],
        PROGRAM_ID
    );

    const [treasuryPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('treasury')],
        PROGRAM_ID
    );

    const [antiScamTreasuryPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from('treasury_anti_scam')],
        PROGRAM_ID
    );

    return {
        configPDA,
        updateAuthorityPDA,
        treasuryPDA,
        antiScamTreasuryPDA
    };
};

// Function to mint a standard NFT
export const mintStandardNFT = async (
    wallet: WalletContextState,
    connection: Connection,
    collectionAddress: PublicKey,
    nftName: string,
    nftUri: string,
    scamYear: string,
    usdAmountStolen: string,
    platformCategory: string,
    typeOfAttack: string
) => {
    if (!wallet.publicKey) {
        throw new Error('Wallet not connected');
    }

    // Get program instance with connected wallet
    const program = getProgram(wallet, connection);

    // Generate a new keypair for the NFT
    const nftKeypair = Keypair.generate();

    // Get PDAs
    const { configPDA, updateAuthorityPDA, treasuryPDA, antiScamTreasuryPDA } = await getPDAs();

    try {
        // Call the mint instruction
        const tx = await program.methods
            .mintStandardNft(
                nftName,
                nftUri,
                scamYear,
                usdAmountStolen,
                platformCategory,
                typeOfAttack
            )
            .accounts({
                user: wallet.publicKey,
                ruggedNftMint: nftKeypair.publicKey,
                standardCollection: collectionAddress,
                updateAuthorityPda: updateAuthorityPDA,
                treasury: treasuryPDA,
                antiscamTreasury: antiScamTreasuryPDA,
                systemProgram: SystemProgram.programId,
                mplCoreProgram: MPL_CORE_PROGRAM_ID,
                config: configPDA,
            })
            .signers([nftKeypair])
            .rpc();

        return {
            signature: tx,
            nftAddress: nftKeypair.publicKey.toString()
        };
    } catch (error) {
        console.error('Error minting NFT:', error);
        throw error;
    }
}; 