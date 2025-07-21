# Sui Memory NFT Collection App

Ứng dụng quản lý Memory NFT Collection trên Sui blockchain với 2 chức năng chính: Add Memory Template và Mint Random NFT.

## 🚀 Demo

- **Add Memory Template**: Thêm memory templates vào collection để mọi người có thể mint
- **Random Memory NFT**: Mint NFT ngẫu nhiên từ templates có sẵn trong collection
- **Real-time Transaction**: Hiển thị kết quả transaction ngay lập tức
- **Wallet Integration**: Tích hợp với Sui wallet

## 📋 Prerequisites

Trước khi bắt đầu, đảm bảo bạn có:

- Node.js (v18+)
- pnpm hoặc npm
- Sui wallet (Sui Wallet, Suiet, hoặc các wallet khác)
- SUI testnet tokens

## 🛠️ Step-by-Step Setup

### Bước 1: Tạo Project

```bash
# Tạo project React với Vite
pnpm create vite simple-sui-app --template react-ts
cd simple-sui-app

# Cài đặt dependencies
pnpm install
```

### Bước 2: Cài đặt Sui Dependencies

```bash
# Cài đặt Sui SDK và dapp-kit
pnpm add @mysten/sui @mysten/dapp-kit @tanstack/react-query

# Cài đặt Tailwind CSS
pnpm add tailwindcss @tailwindcss/vite
```

### Bước 3: Cấu hình Tailwind CSS

Tạo file `tailwind.config.ts`:

```typescript
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

Cập nhật `src/index.css`:

```css
@import "tailwindcss";
```

### Bước 4: Cấu hình Main App

Cập nhật `src/main.tsx`:

```typescript
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create Sui client for testnet
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
});
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
      <WalletProvider>
        <App />
      </WalletProvider>
    </SuiClientProvider>
  </QueryClientProvider>
);
```

### Bước 5: Tạo Components

#### 5.1. Tạo thư mục components

```bash
mkdir src/components
```

#### 5.2. Tạo `src/components/TransactionResult.tsx`

```typescript
interface TransactionResultProps {
  isLoading: boolean;
  mintResult: any;
}

export function TransactionResult({ isLoading, mintResult }: TransactionResultProps) {
  return (
    <>
      {/* Loading State */}
      {isLoading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-blue-700 font-medium">Minting your NFT...</span>
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
            <h3 className="text-green-800 font-semibold">NFT Minted Successfully!</h3>
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
            {mintResult.error.message || "An error occurred while minting the NFT."}
          </p>
        </div>
      )}
    </>
  );
}
```

#### 5.3. Tạo `src/components/RandomMemoryNFT.tsx`

```typescript
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";

interface RandomMemoryNFTProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  mintResult: any;
  setMintResult: (result: any) => void;
}

export function RandomMemoryNFT({ isLoading, setIsLoading, mintResult, setMintResult }: RandomMemoryNFTProps) {
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
```

#### 5.4. Tạo `src/components/SelfIntroductionNFT.tsx`

```typescript
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";

interface SelfIntroductionNFTProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  mintResult: any;
  setMintResult: (result: any) => void;
}

export function SelfIntroductionNFT({ isLoading, setIsLoading, mintResult, setMintResult }: SelfIntroductionNFTProps) {
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
```

### Bước 6: Tạo Main App Component

Cập nhật `src/App.tsx`:

```typescript
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
```

### Bước 7: Chạy ứng dụng

```bash
# Chạy development server
pnpm dev
```

Truy cập `http://localhost:5173` để xem ứng dụng.

## 🔧 Configuration

### Smart Contract Details

- **Package ID**: `0xe463bad101ad1d0b2f7d048a5cf7b946d73f9b831c4dbe90465ad9921f8a5374`
- **MemoryTemplateStore**: `0xa4741e999ca62a46e260aed19f7571f87a3207acca23f510e719c78681547a88`
- **Network**: Sui Testnet

### Functions

1. **`add_memory_template`**: Thêm memory template vào MemoryTemplateStore
   - Arguments: store_id, title, description, image_url, rarity (1-10)
2. **`mint_random_memory_nft`**: Mint NFT ngẫu nhiên từ templates có sẵn
   - Arguments: store_id

## 🎯 App Flow

### Workflow hiện tại:

1. **Add Template Phase**:
   - User sử dụng "Add Memory Template" component
   - Nhập: name, description, image URL, rarity (1-5)
   - Template được lưu vào MemoryTemplateStore

2. **Mint NFT Phase**:
   - User sử dụng "Random Memory NFT" component
   - Có thể add thêm templates hoặc mint ngay từ templates có sẵn
   - NFT được mint ngẫu nhiên từ pool templates

### Component Architecture:

#### AddMemoryTemplate Component (formerly SelfIntroductionNFT):
- **Chức năng**: Chỉ add memory template vào MemoryTemplateStore
- **Input**: name, description, imageUrl, rarity (1-5)
- **Output**: Template được lưu trong collection

#### RandomMemoryNFT Component:
- **Chức năng**: Quản lý templates và mint random NFT
- **Features**:
  - Template management section (add/view templates)
  - Mint random NFT from available templates
  - Separation of concerns: add ≠ mint

## 🎯 Features

### ✅ Đã hoàn thành

- [x] Wallet connection với @mysten/dapp-kit
- [x] Random Memory NFT minting
- [x] Self Introduction NFT minting với form
- [x] Real-time transaction status
- [x] Loading states và error handling
- [x] Responsive design với Tailwind CSS
- [x] Component-based architecture
- [x] TypeScript support

### 🚀 Tính năng nổi bật

1. **Dual NFT Types**: Hỗ trợ 2 loại NFT khác nhau
2. **Form Validation**: Kiểm tra input trước khi mint
3. **Transaction Feedback**: Hiển thị kết quả ngay lập tức
4. **Error Handling**: Xử lý lỗi gracefully
5. **Responsive UI**: Hoạt động tốt trên mobile và desktop

## 🛠️ Troubleshooting

### Lỗi thường gặp

1. **Wallet không kết nối**: Đảm bảo wallet đang ở testnet
2. **Transaction failed**: Kiểm tra SUI balance trên testnet
3. **TypeScript errors**: Có thể bỏ qua các warning về SDK compatibility

### Debug

```bash
# Xem logs trong browser console
F12 > Console

# Kiểm tra network requests
F12 > Network
```

## 📚 Resources

- [Sui Documentation](https://docs.sui.io/)
- [@mysten/dapp-kit](https://sdk.mystenlabs.com/dapp-kit)
- [Sui Explorer](https://suiexplorer.com/)
- [Sui Faucet](https://faucet.testnet.sui.io/)

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

---

**Happy Minting! 🎉**
