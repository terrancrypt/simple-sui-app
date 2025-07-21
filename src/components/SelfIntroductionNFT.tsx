import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";

interface SelfIntroductionNFTProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  mintResult: any;
  setMintResult: (result: any) => void;
}

export function SelfIntroductionNFT({
  isLoading,
  setIsLoading,
  mintResult,
  setMintResult,
}: SelfIntroductionNFTProps) {
  const account = useCurrentAccount();
  const signAndExecuteTransaction = useSignAndExecuteTransaction();
  const [selfIntroForm, setSelfIntroForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    rarity: 1,
  });

  async function handleMintSelfIntroductionNFT() {
    if (!account) return;

    // Validate form
    if (
      !selfIntroForm.name ||
      !selfIntroForm.description ||
      !selfIntroForm.imageUrl ||
      selfIntroForm.rarity < 1 || selfIntroForm.rarity > 5
    ) {
      alert("Please fill in all fields and set rarity between 1-5");
      return;
    }

    setIsLoading(true);
    setMintResult(null);

    // define a programmable transaction
    const tx = new Transaction();
    const packageObjectId =
      "0xe463bad101ad1d0b2f7d048a5cf7b946d73f9b831c4dbe90465ad9921f8a5374";

    // MemoryTemplateStore object ID
    const memoryTemplateStoreId =
      "0xa4741e999ca62a46e260aed19f7571f87a3207acca23f510e719c78681547a88";

    // Bước 1: Add template mới với thông tin user
    tx.moveCall({
      target: `${packageObjectId}::my_nft_collection::add_memory_template`,
      arguments: [
        tx.object(memoryTemplateStoreId),
        tx.pure.string(selfIntroForm.name),
        tx.pure.string(selfIntroForm.description), 
        tx.pure.string(selfIntroForm.imageUrl),
        tx.pure.u8(selfIntroForm.rarity), // Rarity từ user input
      ],
    });

    // Không mint - chỉ lưu template

    try {
      // execute the programmable transaction
      const resData = await signAndExecuteTransaction.mutateAsync({
        transaction: tx,
      });
      console.log("Memory template added successfully!", resData);
      setMintResult(resData);

      // Reset form
      setSelfIntroForm({
        name: "",
        description: "",
        imageUrl: "",
        rarity: 1,
      });
    } catch (e) {
      console.error("Memory template add failed", e);
      setMintResult({ error: e });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Add Memory Template</h2>
      <p className="text-gray-600 mb-6">
        Add your personal memory template to the collection. Others can mint NFTs from your template.
      </p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={selfIntroForm.name}
            onChange={(e) =>
              setSelfIntroForm({ ...selfIntroForm, name: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={selfIntroForm.description}
            onChange={(e) =>
              setSelfIntroForm({
                ...selfIntroForm,
                description: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your description"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="url"
            value={selfIntroForm.imageUrl}
            onChange={(e) =>
              setSelfIntroForm({
                ...selfIntroForm,
                imageUrl: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rarity (1-5)
          </label>
          <input
            type="number"
            min="1"
            max="5"
            value={selfIntroForm.rarity}
            onChange={(e) =>
              setSelfIntroForm({
                ...selfIntroForm,
                rarity: parseInt(e.target.value) || 1,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1-5"
          />
        </div>
      </div>

      <button
        onClick={handleMintSelfIntroductionNFT}
        disabled={!account || isLoading}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {isLoading
          ? "Adding Template..."
          : account
          ? "Add Memory Template"
          : "Connect Wallet First"}
      </button>
    </div>
  );
}
