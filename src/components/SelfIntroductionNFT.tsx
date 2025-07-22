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
    slogan: "",
  });

  async function handleMintSelfIntroductionNFT() {
    if (!account) return;

    // Validate form
    if (
      !selfIntroForm.name ||
      !selfIntroForm.description ||
      !selfIntroForm.imageUrl ||
      !selfIntroForm.slogan
    ) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setMintResult(null);

    // define a programmable transaction
    const tx = new Transaction();
    const packageObjectId =
      "0x489563cb7a99e87528b871f6f5df62100e96374d7cfc9432af7907f119049151";

    // @ts-ignore - SDK version compatibility issue
    tx.moveCall({
      target: `${packageObjectId}::my_nft_collection::mint_self_introduction_nft`,
      arguments: [
        tx.pure.string(selfIntroForm.name),
        tx.pure.string(selfIntroForm.description),
        tx.pure.string(selfIntroForm.imageUrl),
        tx.pure.string(selfIntroForm.slogan),
      ],
    });

    try {
      // execute the programmable transaction
      const resData = await signAndExecuteTransaction.mutateAsync({
        transaction: tx,
      });
      console.log("Self Introduction NFT minted successfully!", resData);
      setMintResult(resData);

      // Reset form
      setSelfIntroForm({
        name: "",
        description: "",
        imageUrl: "",
        slogan: "",
      });
    } catch (e) {
      console.error("Self Introduction NFT mint failed", e);
      setMintResult({ error: e });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Mint Self Introduction NFT</h2>
      <p className="text-gray-600 mb-6">
        Create your own self introduction NFT with custom details.
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
            Slogan
          </label>
          <input
            type="text"
            value={selfIntroForm.slogan}
            onChange={(e) =>
              setSelfIntroForm({
                ...selfIntroForm,
                slogan: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your slogan"
          />
        </div>
      </div>

      <button
        onClick={handleMintSelfIntroductionNFT}
        disabled={!account || isLoading}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {isLoading
          ? "Minting..."
          : account
          ? "Mint Self Introduction NFT"
          : "Connect Wallet First"}
      </button>
    </div>
  );
}
