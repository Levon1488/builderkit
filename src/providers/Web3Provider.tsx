import '@rainbow-me/rainbowkit/styles.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
    connectorsForWallets,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { coreWallet, rainbowWallet } from "@rainbow-me/rainbowkit/wallets";
import { avalanche } from 'wagmi/chains';
import { Chain, createClient } from 'viem';
import { Toaster } from '../components/common/components/Toaster';

interface Web3ProviderProps {
    appName: string;
    projectId: string;
    chains: Chain[];
    children: any;
}

const queryClient = new QueryClient();

export const Web3Provider: React.FC<Web3ProviderProps> = (props) => {
    const { appName, projectId, chains = [avalanche], children } = props;

    const connectors = connectorsForWallets(
        [
            {
                groupName: 'Recommended',
                wallets: [coreWallet],
            },
            {
                groupName: 'Others',
                wallets: [rainbowWallet],
            },
        ],
        { appName, projectId }
    );
    let _chains: any = chains;
    const cc = createConfig({
        connectors,
        chains: _chains,
        client({ chain }) {
            return createClient({ chain, transport: http() })
        }
    });

    return (
        <WagmiProvider config={cc}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider showRecentTransactions={true}>
                    {children}
                    <Toaster />
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};