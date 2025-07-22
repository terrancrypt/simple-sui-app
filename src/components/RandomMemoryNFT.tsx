import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";

interface RandomMemoryNFTProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  mintResult: any;
  setMintResult: (result: any) => void;
}

export function RandomMemoryNFT({
  isLoading,
  setIsLoading,
  mintResult,
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

      {/* Loading State */}
      {isLoading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-blue-700 font-medium">
              Minting your NFT...
            </span>
          </div>
        </div>
      )}

      {/* Success Result */}
      {mintResult && !mintResult.error && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center mb-2">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-green-800 font-semibold">
              NFT Minted Successfully!
            </h3>
          </div>
          <div className="text-sm text-green-700">
            <p className="mb-2">
              <strong>Transaction Digest:</strong>
            </p>
            <code className="bg-green-100 px-2 py-1 rounded text-xs break-all">
              {mintResult.digest}
            </code>
            <p className="mt-3 text-xs">
              <strong>Status:</strong> Confirmed
            </p>
          </div>
        </div>
      )}

      {/* Error Result */}
      {mintResult && mintResult.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <svg
              className="w-5 h-5 text-red-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-red-800 font-semibold">Minting Failed</h3>
          </div>
          <p className="text-red-700 text-sm">
            {mintResult.error.message ||
              "An error occurred while minting the NFT."}
          </p>
        </div>
      )}

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
