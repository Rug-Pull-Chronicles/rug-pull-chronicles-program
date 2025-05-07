import { Program, AnchorProvider, Idl, BN } from '@coral-xyz/anchor';
import { Connection, SystemProgram } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import rawIdl from '../../../target/idl/rug_pull_chronicles_program.json';
import { PublicKey, Keypair } from '@solana/web3.js';
import { RugPullChroniclesProgram } from '../../../target/types/rug_pull_chronicles_program';
// import { PROGRAM_ID } from './constants';


// Program ID 
const PROGRAM_ID = new PublicKey('6cfjRrqry3MFPH9L7r2A44iCnCuoin6dauAwv1xa1Sc9');

// Metaplex Core Program ID
const MPL_CORE_PROGRAM_ID = new PublicKey('CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d');

const DEFAULT_SEED = new BN(9876);


export function getProgram(
    wallet: WalletContextState,
    connection: Connection
): Program<RugPullChroniclesProgram> {
    if (!wallet.publicKey) throw new Error('Wallet not connected');

    const provider = new AnchorProvider(connection, wallet as any, {
        commitment: 'confirmed',
    });

    return new Program(
        rawIdl as Idl, // ✅ cast runtime JSON to Idl
        provider
    ) as Program<RugPullChroniclesProgram>; // ✅ cast result to typed Program
}



// Compute relevant PDAs
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
        antiScamTreasuryPDA,
    };
};

// Mint an NFT in the Standard collection
export const mintStandardNFT = async (
    wallet: WalletContextState,
    connection: Connection,
    collectionAddress: PublicKey,
    nftName: string,
    nftUri: string,
    scamYear: string,
    usdAmountStolen: string | number,
    platformCategory: string,
    typeOfAttack: string
) => {
    if (!wallet.publicKey) {
        throw new Error('Wallet not connected');
    }

    const program = getProgram(wallet, connection);
    const nftKeypair = Keypair.generate();

    const {
        configPDA,
        updateAuthorityPDA,
        treasuryPDA,
        antiScamTreasuryPDA,
    } = await getPDAs();

    // Convert to string instead of BN
    const stolenAmountStr = usdAmountStolen.toString();

    try {
        console.log('Minting with the following data:', {
            nftName,
            nftUri,
            scamYear,
            stolenAmount: stolenAmountStr,
            platformCategory,
            typeOfAttack,
            configPDA: configPDA.toBase58(),
            collectionAddress: collectionAddress.toBase58(),
        });

        const tx = await program.methods
            .mintStandardNft(
                nftName,
                nftUri,
                scamYear,
                stolenAmountStr,
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
            } as any)
            .signers([nftKeypair])
            .rpc();

        return {
            signature: tx,
            nftAddress: nftKeypair.publicKey.toBase58(),
        };
    } catch (error) {
        console.error('Error minting NFT:', error);
        throw error;
    }
};
