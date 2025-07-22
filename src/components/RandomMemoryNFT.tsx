import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

interface RandomMemoryNFTProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  mintResult: any;
  setMintResult: (result: any) => void;
}

export function RandomMemoryNFT({
  isLoading,
  setIsLoading,
  setMintResult,
}: RandomMemoryNFTProps) {
  const account = useCurrentAccount();
  const signAndExecuteTransaction = useSignAndExecuteTransaction();

  async function handleMintRandomMemoryNFT() {
    if (!account) return;

    setIsLoading(true);
    setMintResult(null);

    // define a programmable transaction
    const tx = new Transaction();
    const packageObjectId =
      "0x489563cb7a99e87528b871f6f5df62100e96374d7cfc9432af7907f119049151";

    // MemoryTemplateStore object ID trên testnet
    // Đây là shared object được tạo khi khởi tạo contract
    const memoryTemplateStoreId =
      "0x0b8391f4a847b3c9b1ec9a4820939906c8520714dcf5f1b4b503f8ab3c33f4c0";

    tx.moveCall({
      target: `${packageObjectId}::my_nft_collection::mint_random_memory_nft`,
      arguments: [
        tx.object(memoryTemplateStoreId), // MemoryTemplateStore reference
      ],
    });

    try {
      // execute the programmable transaction
      const resData = await signAndExecuteTransaction.mutateAsync({
        transaction: tx,
      });
      console.log("Memory NFT minted successfully!", resData);
      setMintResult(resData);
    } catch (e) {
      console.error("Memory NFT mint failed", e);
      setMintResult({ error: e });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Mint Random Memory NFT</h2>
      <p className="text-gray-600 mb-6">
        Mint a random memory NFT from the available templates in the collection.
      </p>

      <button
        onClick={handleMintRandomMemoryNFT}
        disabled={!account || isLoading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {isLoading
          ? "Minting..."
          : account
          ? "Mint Random Memory NFT"
          : "Connect Wallet First"}
      </button>
    </div>
  );
}
