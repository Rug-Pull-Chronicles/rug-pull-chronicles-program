'use client'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useState, useEffect } from 'react'
import { mintStandardNFT } from '@/lib/program'
import { PublicKey, clusterApiUrl, Connection } from '@solana/web3.js'

// Constants
const LOCAL_ENDPOINT = 'http://127.0.0.1:8899';
const DEVNET_ENDPOINT = clusterApiUrl('devnet');
const STANDARD_COLLECTION = 'DSDXwuAh9KxpEaJxQTUJs7VXD1sfv2zF8op9pJJaNSce';
const SCAMMED_COLLECTION = 'Hv4sedKvWL1xEFqjDShUQ9GLRRiY1hRdVTgeemo4CHSN';
const PROGRAM_ID = '6cfjRrqry3MFPH9L7r2A44iCnCuoin6dauAwv1xa1Sc9';

export default function MintNFT() {
  const { connection } = useConnection()
  const wallet = useWallet()
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{signature: string, nftAddress: string} | null>(null)
  const [isLocalnet, setIsLocalnet] = useState(false)
  const [isDevnet, setIsDevnet] = useState(false)
  const [customConnection, setCustomConnection] = useState<Connection | null>(null)
  
  // Form state
  const [nftName, setNftName] = useState('My Rug Pull Chronicles NFT')
  const [nftUri, setNftUri] = useState('https://example.com/metadata.json')
  const [scamYear, setScamYear] = useState('2024')
  const [usdAmountStolen, setUsdAmountStolen] = useState('1000000')
  const [platformCategory, setPlatformCategory] = useState('DeFi')
  const [typeOfAttack, setTypeOfAttack] = useState('Rug Pull')
  const [collectionAddress, setCollectionAddress] = useState(STANDARD_COLLECTION)
  
  // Create a connection to devnet by default
  useEffect(() => {
    setCustomConnection(new Connection(DEVNET_ENDPOINT, 'confirmed'));
  }, []);
  
  // Check connection network
  useEffect(() => {
    if (connection?.rpcEndpoint) {
      setIsLocalnet(connection.rpcEndpoint === LOCAL_ENDPOINT);
      setIsDevnet(connection.rpcEndpoint.includes('devnet'));
    }
  }, [connection]);
  
  const handleMint = async () => {
    if (!wallet.publicKey) {
      setError('Please connect your wallet first')
      return
    }
    
    if (!collectionAddress) {
      setError('Please enter a collection address')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)
      setResult(null)
      
      // Parse collection address
      let pubkey: PublicKey
      try {
        pubkey = new PublicKey(collectionAddress)
      } catch (e) {
        throw new Error('Invalid collection address')
      }
      
      // Use devnet connection if available, otherwise fallback to the current connection
      const connectionToUse = customConnection || connection;
      
      const result = await mintStandardNFT(
        wallet,
        connectionToUse,
        pubkey,
        nftName,
        nftUri,
        scamYear,
        usdAmountStolen,
        platformCategory,
        typeOfAttack
      )
      
      setSuccess(true)
      setResult(result)
    } catch (err) {
      console.error('Error minting NFT:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }
  
  const connectToDevnet = () => {
    setCustomConnection(new Connection(DEVNET_ENDPOINT, 'confirmed'));
  };
  
  return (
    <div className="bg-black/90 rounded-lg p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Mint Rug Pull Chronicles NFT</h2>
        <WalletMultiButton />
      </div>

      {isDevnet || (customConnection && customConnection.rpcEndpoint.includes('devnet')) ? (
        <div className="p-4 mb-6 bg-blue-900/50 border border-blue-700 rounded-md text-blue-200">
          <p className="text-sm">
            <strong>Connected to Devnet</strong> - Using the deployed program for testing.
          </p>
          <p className="text-xs mt-1">
            Program ID: {PROGRAM_ID}
          </p>
        </div>
      ) : isLocalnet ? (
        <div className="p-4 mb-6 bg-green-900/50 border border-green-700 rounded-md text-green-200">
          <p className="text-sm">
            <strong>Connected to localnet</strong> - Using the local validator for testing.
          </p>
          <p className="text-xs mt-1">
            Program ID: {PROGRAM_ID}
          </p>
          <button 
            onClick={connectToDevnet}
            className="mt-2 px-3 py-1 bg-blue-700 text-white text-xs rounded hover:bg-blue-600"
          >
            Switch to Devnet
          </button>
        </div>
      ) : (
        <div className="p-4 mb-6 bg-yellow-900/50 border border-yellow-700 rounded-md text-yellow-200">
          <p className="text-sm">
            <strong>Note:</strong> Not connected to a known network. Using Devnet by default.
          </p>
          <button 
            onClick={connectToDevnet}
            className="mt-2 px-3 py-1 bg-blue-700 text-white text-xs rounded hover:bg-blue-600"
          >
            Connect to Devnet
          </button>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Collection Address</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={collectionAddress}
              onChange={(e) => setCollectionAddress(e.target.value)}
              placeholder="Enter collection address (required)"
              className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button 
              onClick={() => setCollectionAddress(STANDARD_COLLECTION)}
              className="px-2 py-1 bg-purple-700 text-white text-xs rounded hover:bg-purple-600"
              title="Use the Standard Collection from tests"
            >
              Standard
            </button>
            <button 
              onClick={() => setCollectionAddress(SCAMMED_COLLECTION)}
              className="px-2 py-1 bg-purple-700 text-white text-xs rounded hover:bg-purple-600"
              title="Use the Scammed Collection from tests"
            >
              Scammed
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">NFT Name</label>
          <input
            type="text"
            value={nftName}
            onChange={(e) => setNftName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Metadata URI</label>
          <input
            type="text"
            value={nftUri}
            onChange={(e) => setNftUri(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Scam Year</label>
            <input
              type="text"
              value={scamYear}
              onChange={(e) => setScamYear(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">USD Amount Stolen</label>
            <input
              type="text"
              value={usdAmountStolen}
              onChange={(e) => setUsdAmountStolen(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Platform Category</label>
            <select
              value={platformCategory}
              onChange={(e) => setPlatformCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="DeFi">DeFi</option>
              <option value="NFT">NFT</option>
              <option value="GameFi">GameFi</option>
              <option value="Exchange">Exchange</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Type of Attack</label>
            <select
              value={typeOfAttack}
              onChange={(e) => setTypeOfAttack(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Rug Pull">Rug Pull</option>
              <option value="Phishing">Phishing</option>
              <option value="Flash Loan">Flash Loan</option>
              <option value="Exploit">Exploit</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={handleMint}
          disabled={loading || !wallet.publicKey || !collectionAddress}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            !wallet.publicKey || !collectionAddress
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : loading
              ? 'bg-purple-700 text-white cursor-wait'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {loading ? 'Minting...' : !wallet.publicKey ? 'Connect Wallet to Mint' : 'Mint NFT'}
        </button>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mt-4 p-4 bg-green-900/50 border border-green-700 rounded-md text-green-200">
          <h3 className="font-medium text-lg mb-2">NFT Minted Successfully!</h3>
          {result ? (
            <div className="space-y-2 text-sm">
              <p className="break-all">
                <span className="font-semibold">NFT Address:</span> {result.nftAddress}
              </p>
              <p className="break-all">
                <span className="font-semibold">Transaction:</span> {result.signature}
              </p>
              <div className="flex justify-between mt-2">
                <a
                  href={`https://explorer.solana.com/address/${result.nftAddress}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 hover:text-green-200 underline text-xs"
                >
                  View NFT on Explorer
                </a>
                <a
                  href={`https://explorer.solana.com/tx/${result.signature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 hover:text-green-200 underline text-xs"
                >
                  View Transaction
                </a>
              </div>
            </div>
          ) : (
            <p className="text-sm">NFT minted successfully, but result details are not available.</p>
          )}
        </div>
      )}
    </div>
  )
} 