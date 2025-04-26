import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Login = () => {
    const { connected: solanaConnected, publicKey } = useWallet();

    return (
        <div className="w-screen h-screen flex flex-col gap-4 items-center justify-center bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome</h2>
                    <p className="mt-2 text-gray-600">
                        Connect your wallet to continue
                    </p>
                </div>

                <div className="flex justify-center">
                    <WalletMultiButton />
                </div>

                {solanaConnected && publicKey && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Connected Solana Wallet:</p>
                        <p className="text-sm font-mono break-all">{publicKey.toString()}</p>
                    </div>
                )}
            </div>

            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome</h2>
                    <p className="mt-2 text-gray-600">
                        Connect your wallet to continue
                    </p>
                </div>

                <div className="flex justify-center">
                    <WalletMultiButton />
                </div>

                {solanaConnected && publicKey && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">Connected Solana Wallet:</p>
                        <p className="text-sm font-mono break-all">{publicKey.toString()}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login; 