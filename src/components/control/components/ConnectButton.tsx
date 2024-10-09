import React from 'react';
import { ConnectButton as RainbowKitConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from './Button';
import { LoadingIndicator } from '../../common';
import { Identity } from '../../identity';
import { cn } from '../../../utils/cn';
import { ConnectButtonProps } from '../types';

export const ConnectButton: React.FC<ConnectButtonProps> = (props) => {
    const { showConnectedWallet = true, checkWrongNetwork = true, className } = props;
    
    return (
        <div className={cn("text-center", className)}>
            <RainbowKitConnectButton.Custom>
                {({
                    mounted,
                    authenticationStatus,
                    account,
                    chain,
                    openConnectModal,
                    openChainModal,
                    openAccountModal
                }) => {
                    const ready = mounted && authenticationStatus !== 'loading';
                    if (ready === false) {
                        return <LoadingIndicator></LoadingIndicator>;
                    }
                    const connected =
                        ready &&
                        account &&
                        chain &&
                        (!authenticationStatus ||
                            authenticationStatus === 'authenticated');
                    if (connected === true) {
                        if (checkWrongNetwork === true && chain.unsupported === true) {
                            return <Button
                                label="Wrong Network"
                                action={() => openChainModal()}
                            />
                        } else if (showConnectedWallet === true) {
                            return <div className={"cursor-pointer"} onClick={openAccountModal}>
                                <Identity address={account.address}></Identity>
                            </div>
                        }
                        return;
                    }
                    return <Button
                        label="Connect Wallet"
                        action={() => openConnectModal()}
                    />
                }}
            </RainbowKitConnectButton.Custom>
        </div>
    );
};