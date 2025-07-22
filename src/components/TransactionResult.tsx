interface TransactionResultProps {
  isLoading: boolean;
  mintResult: any;
}

export function TransactionResult({
  isLoading,
  mintResult,
}: TransactionResultProps) {
  return (
    <>
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
    </>
  );
}
