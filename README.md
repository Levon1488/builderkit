# BuilderKit
BuilderKit is a UI kit designed for developing onchain applications for Avalanche L1s and other blockchains. This library provides ready-to-use React components and hooks, enabling you to quickly and easily build frontends for blockchain applications. It supports essential functions like Interchain Token Transfer (ICTT) and faucet flows, simplifying cross-chain app development. The kit offers a seamless configuration experience, making blockchain-based operations more straightforward.

## Components
Ready-to-use UI elements designed to simplify building frontends for blockchain applications, including chain selectors, inputs, and transaction controls.

### Chains
- `ChainDropDown`, `ChainIcon`, `ChainRow`
### Collectibles
- `Collectible`
### Common
- `Alert`, `Container`, `Dialog`, `Icon`, `LoadingIndicator`, `Select`, `Spinner`, `Toaster`
### Control
- `Button`, `ConnectButton`
### Identity
- `Address`, `Domain`, `Identity`
### Input
- `AddressInput`, `AmountInput`, `Input`, `MultiChainTokenInput`, `TokenInput`
### Tokens
- `TokenChip`, `TokenIcon`, `TokenIconWithChain`, `TokenList`, `TokenRow`
### Transaction
- `TransactionButton`, `TransactionManager`
### Wallet
- `ConnectStatusIndicator`

---

## Hooks
Custom React hooks providing logic and state management for blockchain interactions, such as handling tokens, contracts, and chain operations.

### Chains
- `useChains`
### Collectibles
- `useCollectibles`
### Contracts
- `useContracts`
### Data
- `useGlacier`
### Identity
- `useAvaxDomain`
### Precompiles
- `useAllowList`
- `useDeployerAllowList`
- `useFeeManager`
- `useRewardManager`
- `useTransactionAllowList`
- `useWarpMessenger`
### Swap
- `useUniswapV2`
### Tokens
- `useTokens`

---

## Flows
Pre-built, functional flows for common blockchain processes like Interchain Token Transfer (ICTT) and faucet management.
- **ICTT Flow**: Interchain Token Transfer components and hooks
- **Faucet Flow**: Faucet functionality including token and network selection

## Set Up
This library is built to be highly configurable and easy to integrate into any Avalanche L1 or blockchain-based app. Here's how you can get started:

1. Clone the repository:
```bash
git clone https://github.com/ava-labs/builderkit.git
cd builderkit
```
2. Install dependencies:
```bash
yarn install
```
3. Run the development server:
```bash
yarn run watch
```

## Example Usages
For example usages of these components and hooks, please refer to our [Avalanche Starter Kit](https://github.com/ava-labs/avalanche-starter-kit) where you can find practical implementations.
- [**Faucet Example**](https://github.com/ava-labs/avalanche-starter-kit/tree/main/web-apps/src/app/faucet) 
- [**ICTT Example**](https://github.com/ava-labs/avalanche-starter-kit/tree/main/web-apps/src/app/ictt) 

## Contributions
We welcome contributions! Feel free to submit pull requests, report issues, or suggest new features to make BuilderKit even better for Avalanche L1 and blockchain app development.

<!-- Test comment added by Devin for PR verification -->   