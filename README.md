
# IdeaLink

IdeaLink is a platform where innovators can post, sell, and find investment for their business ideas. The platform includes AI-powered idea validation and blockchain integration for secure transactions.

## Features

- Browse and publish innovative business ideas
- AI-powered idea validation and market analysis
- Blockchain integration for secure ownership and transactions
- Messaging system for communication between sellers and buyers
- Anonymous public identity system with secure private verification
- Royalty system for ongoing participation in idea success
- Idea tokenization for fractional ownership

## Getting Started

### Prerequisites

- Node.js and npm installed
- A Web3 wallet like MetaMask for blockchain features

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# AI Configuration
IA_API_KEY=your_ai_api_key
IA_API_ENDPOINT=your_ai_api_endpoint

# Blockchain Configuration
NEXT_PUBLIC_CHAIN_RPC_URL=your_blockchain_rpc_url
```

## Blockchain Integration

IdeaLink uses Web3.js to connect to blockchain networks. The integration provides:

- Wallet connection for buyers and sellers
- Idea tokenization for fractional ownership
- Token sales (fixed price or auction)
- Smart contract integration for royalty distribution

### Setting Up Web3 Connection

1. Install MetaMask or another Web3 wallet browser extension
2. Connect your wallet using the "Connect Wallet" button in the application
3. Ensure you're connected to the correct network (Ethereum Mainnet, Polygon, etc.)

### Environment Variables for Blockchain

- `NEXT_PUBLIC_CHAIN_RPC_URL`: RPC URL for the blockchain provider (e.g., Infura, Alchemy)

## WebSocket Service

The messaging system uses WebSockets for real-time communication between users.

### WebSocket Configuration

Currently, the application uses a mock WebSocket service. To connect to a real WebSocket server:

1. Update the `webSocketService.ts` file
2. Replace mock functions with real WebSocket connections
3. Configure the WebSocket server endpoint in your environment

## Identity Handling

IdeaLink uses a two-tier identity system:

- **Public Identity**: Anonymous usernames visible to all users
- **Private Identity**: Government ID verification and personal details stored securely

### Identity Storage

Sensitive user information should be:
- Encrypted at rest
- Transmitted securely
- Stored in compliance with relevant privacy regulations

## Development Notes

### API Integration

- Add API endpoints in the `.env` file
- The AI services use the centralized `AI_CONFIG` from `src/services/aiConfig.js`
- Blockchain interactions are handled through `src/services/walletService.js`

### Adding Smart Contract Functionality

To implement actual smart contract functionality:

1. Replace placeholder ABIs in `walletService.ts`
2. Implement actual contract deployment in `PostIdeaPage.tsx`
3. Connect transaction functions in `IdeaDetailPage.tsx`

## License

[MIT](LICENSE)
