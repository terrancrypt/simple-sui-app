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
  setMintResult,
}: RandomMemoryNFTProps) {
  const account = useCurrentAccount();
  const signAndExecuteTransaction = useSignAndExecuteTransaction();
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [templateForm, setTemplateForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    rarity: 1,
  });

  async function handleAddTemplate() {
    if (!account) return;
    
    if (!templateForm.title || !templateForm.description || !templateForm.imageUrl) {
      alert("Please fill in all template fields");
      return;
    }

    setIsLoading(true);
    setMintResult(null);

    const tx = new Transaction();
    const packageObjectId =
      "0xe463bad101ad1d0b2f7d048a5cf7b946d73f9b831c4dbe90465ad9921f8a5374";
    const memoryTemplateStoreId =
      "0xa4741e999ca62a46e260aed19f7571f87a3207acca23f510e719c78681547a88";

    tx.moveCall({
      target: `${packageObjectId}::my_nft_collection::add_memory_template`,
      arguments: [
        tx.object(memoryTemplateStoreId),
        tx.pure.string(templateForm.title),
        tx.pure.string(templateForm.description), 
        tx.pure.string(templateForm.imageUrl),
        tx.pure.u8(templateForm.rarity),
      ],
    });

    try {
      const resData = await signAndExecuteTransaction.mutateAsync({
        transaction: tx,
      });
      console.log("Template added successfully!", resData);
      setMintResult(resData);
      
      // Reset form
      setTemplateForm({
        title: "",
        description: "",
        imageUrl: "",
        rarity: 1,
      });
      setShowTemplateForm(false);
    } catch (e) {
      console.error("Template add failed", e);
      setMintResult({ error: e });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMintRandomMemoryNFT() {
    if (!account) return;

    setIsLoading(true);
    setMintResult(null);

    // define a programmable transaction
    const tx = new Transaction();
    // Dùng contract MỚI và MemoryTemplateStore tương ứng
    const packageObjectId =
      "0xe463bad101ad1d0b2f7d048a5cf7b946d73f9b831c4dbe90465ad9921f8a5374";

    // MemoryTemplateStore object ID từ contract mới
    const memoryTemplateStoreId =
      "0xa4741e999ca62a46e260aed19f7571f87a3207acca23f510e719c78681547a88";

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
