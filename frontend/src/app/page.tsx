import MintNFT from '@/components/MintNFT';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-6 lg:p-24">
      <div className="mt-8 flex-grow flex justify-center items-center">
        <MintNFT />
      </div>
    </main>
  );
}
