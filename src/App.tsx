import { ConnectButton } from "@mysten/dapp-kit";
import { useState } from "react";
import { RandomMemoryNFT } from "./components/RandomMemoryNFT";
import { SelfIntroductionNFT } from "./components/SelfIntroductionNFT";
import { TransactionResult } from "./components/TransactionResult";

function App() {
  const [mintResult, setMintResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex justify-between items-center p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold">Memory NFT Collection</h1>
        <ConnectButton />
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Random Memory NFT Section */}
          <RandomMemoryNFT
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            mintResult={mintResult}
            setMintResult={setMintResult}
          />

          {/* Self Introduction NFT Section */}
          <SelfIntroductionNFT
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            mintResult={mintResult}
            setMintResult={setMintResult}
          />
        </div>

        {/* Global Transaction Result */}
        <div className="max-w-4xl mx-auto mt-8">
          <TransactionResult isLoading={isLoading} mintResult={mintResult} />
        </div>
      </main>
    </div>
  );
}

export default App;
