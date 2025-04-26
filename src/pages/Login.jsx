import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';

function shortAddress(addr) {
    return addr ? addr.slice(0, 5) + '...' + addr.slice(-4) : '';
}

const ERC20_TOKENS = [
    {
        symbol: 'USDT',
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        decimals: 6
    },
    {
        symbol: 'DAI',
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        decimals: 18
    }
];

const SPL_TOKENS = [
    {
        symbol: 'USDC',
        mint: 'EPjFWdd5AufqSSqeM2q8Vs6X6uJp6hWcJ8uDkLugF6tS',
        decimals: 6
    },
    {
        symbol: 'USDT',
        mint: 'Es9vMFrzaCERk7r6vQh6fGz5o6dQb5Qx3h8uFvF6hF6',
        decimals: 6
    }
];

const erc20Abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)"
];

// Solana Alchemy RPC 엔드포인트를 .env에서 불러오기
const solanaConnection = new Connection(import.meta.env.VITE_SOLANA_RPC_URL);

const Login = () => {
    const { connected: solanaConnected, publicKey } = useWallet();
    const [solBalance, setSolBalance] = useState(null);
    const [splTokenBalances, setSplTokenBalances] = useState([]);
    const [ethereumAccount, setEthereumAccount] = useState(null);
    const [ethereumConnected, setEthereumConnected] = useState(false);
    const [ethereumError, setEthereumError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [ethBalance, setEthBalance] = useState(null);
    const [tokenBalances, setTokenBalances] = useState([]);

    // Solana 잔액 fetch (@solana/web3.js만 사용)
    useEffect(() => {
        const fetchSolanaBalances = async () => {
            if (!solanaConnected || !publicKey) {
                setSolBalance(null);
                setSplTokenBalances([]);
                return;
            }
            try {
                // SOL 잔액
                const sol = await solanaConnection.getBalance(publicKey);
                setSolBalance(sol / 1e9); // lamports to SOL
                // SPL 토큰 잔액 (web3.js만 사용)
                const tokens = [];
                const parsed = await solanaConnection.getParsedTokenAccountsByOwner(publicKey, { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') });
                for (const { account } of parsed.value) {
                    const info = account.data.parsed.info;
                    const mint = info.mint;
                    const tokenDef = SPL_TOKENS.find(t => t.mint === mint);
                    if (tokenDef) {
                        const amount = Number(info.tokenAmount.amount) / Math.pow(10, tokenDef.decimals);
                        tokens.push({ symbol: tokenDef.symbol, balance: amount });
                    }
                }
                setSplTokenBalances(tokens);
            } catch (e) {
                setSolBalance(null);
                setSplTokenBalances([]);
            }
        };
        fetchSolanaBalances();
    }, [solanaConnected, publicKey]);

    useEffect(() => {
        const fetchBalances = async () => {
            if (!ethereumConnected || !ethereumAccount) {
                setEthBalance(null);
                setTokenBalances([]);
                return;
            }
            try {
                // Ethereum RPC도 .env에서 불러오기
                const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_ETHEREUM_RPC_URL);
                // ETH 잔액
                const balance = await provider.getBalance(ethereumAccount);
                setEthBalance(ethers.formatEther(balance));
                // ERC-20 토큰 잔액
                const tokens = await Promise.all(ERC20_TOKENS.map(async (token) => {
                    const contract = new ethers.Contract(token.address, erc20Abi, provider);
                    const raw = await contract.balanceOf(ethereumAccount);
                    // 소수점 반영
                    const formatted = ethers.formatUnits(raw, token.decimals);
                    return { symbol: token.symbol, balance: formatted };
                }));
                setTokenBalances(tokens);
            } catch (e) {
                setEthBalance(null);
                setTokenBalances([]);
            }
        };
        fetchBalances();
    }, [ethereumConnected, ethereumAccount]);

    const connectMetaMask = async () => {
        setEthereumError('');
        try {
            if (typeof window.ethereum === 'undefined') {
                setEthereumError('MetaMask가 설치되어 있지 않습니다.');
                return;
            }
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            setEthereumAccount(accounts[0]);
            setEthereumConnected(true);
            setModalOpen(false);
        } catch (error) {
            setEthereumError('MetaMask 연결 중 오류가 발생했습니다.');
            console.error('MetaMask connection error:', error);
        }
    };

    const disconnectMetaMask = () => {
        setEthereumAccount(null);
        setEthereumConnected(false);
        setMenuOpen(false);
        setEthBalance(null);
        setTokenBalances([]);
    };

    const copyAddress = () => {
        if (ethereumAccount) {
            navigator.clipboard.writeText(ethereumAccount);
            setMenuOpen(false);
        }
    };

    const changeWallet = () => {
        disconnectMetaMask();
        setTimeout(() => {
            setModalOpen(true);
        }, 200);
        setMenuOpen(false);
    };

    return (
        <div className="w-screen h-screen flex flex-col gap-4 items-center justify-center bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome to Solana</h2>
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
                        <p className="text-sm font-mono break-all text-gray-900">{publicKey.toString()}</p>
                        <div className="mt-2">
                            <p className="text-sm text-gray-700">SOL: {solBalance !== null ? solBalance : '-'}</p>
                            {splTokenBalances.map((token) => (
                                <p key={token.symbol} className="text-sm text-gray-700">{token.symbol}: {token.balance}</p>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">Welcome to Ethereum</h2>
                    <p className="mt-2 text-gray-600">
                        Connect your wallet to continue
                    </p>
                </div>
                <div className="flex justify-center">
                    {!ethereumConnected ? (
                        <button
                            onClick={() => setModalOpen(true)}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                        >
                            <img src="/ethereum.svg" alt="Ethereum" className="w-6 h-6" />
                            Select Wallet
                        </button>
                    ) : (
                        <div className="relative w-full flex flex-col items-center">
                            <button
                                onClick={() => setMenuOpen((open) => !open)}
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded flex items-center gap-2 min-w-[140px]"
                            >
                                <img src="/ethereum.svg" alt="Ethereum" className="w-6 h-6" />
                                {shortAddress(ethereumAccount)}
                            </button>
                            {menuOpen && (
                                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#232136] text-white rounded-xl shadow-lg py-2 z-50 flex flex-col items-stretch">
                                    <button
                                        onClick={copyAddress}
                                        className="px-4 py-2 hover:bg-[#2a2740] text-left"
                                    >
                                        Copy address
                                    </button>
                                    <button
                                        onClick={changeWallet}
                                        className="px-4 py-2 hover:bg-[#2a2740] text-left"
                                    >
                                        Change wallet
                                    </button>
                                    <button
                                        onClick={disconnectMetaMask}
                                        className="px-4 py-2 hover:bg-[#2a2740] text-left text-red-400"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            )}
                            {/* 전체 주소 및 잔액 박스 */}
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg w-full">
                                <p className="text-sm text-gray-600">Connected Ethereum Wallet:</p>
                                <p className="text-sm font-mono break-all text-gray-900">{ethereumAccount}</p>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-700">ETH: {ethBalance !== null ? ethBalance : '-'}</p>
                                    {tokenBalances.map((token) => (
                                        <p key={token.symbol} className="text-sm text-gray-700">{token.symbol}: {token.balance}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {ethereumError && (
                    <div className="mt-2 text-red-500 text-sm">{ethereumError}</div>
                )}
                {/* 이더리움 지갑 선택 모달 */}
                {modalOpen && !ethereumConnected && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="relative bg-[#181028] rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
                            {/* 닫기(X) 버튼 */}
                            <button
                                onClick={() => setModalOpen(false)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#232136] hover:bg-[#2a2740] text-white text-xl focus:outline-none"
                                aria-label="Close"
                            >
                                ×
                            </button>
                            <h3 className="text-xl font-bold mb-6 text-white">Connect a wallet on Ethereum to continue</h3>
                            <button
                                onClick={connectMetaMask}
                                className="flex items-center justify-center gap-2 bg-[#f6851b] hover:bg-[#e2761b] text-white font-bold py-3 px-4 rounded-xl mb-2 w-full transition-colors duration-150 text-lg shadow-md"
                            >
                                {/* MetaMask SVG 아이콘 */}
                                <svg width="28" height="28" viewBox="0 0 212 189" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g>
                                        <polygon fill="#E2761B" points="35.5,10.5 105.5,60.5 175.5,10.5 105.5,120.5" />
                                        <polygon fill="#E2761B" points="105.5,60.5 35.5,10.5 55.5,90.5" />
                                        <polygon fill="#E2761B" points="105.5,60.5 175.5,10.5 155.5,90.5" />
                                        <polygon fill="#763D16" points="55.5,90.5 105.5,120.5 105.5,60.5" />
                                        <polygon fill="#763D16" points="155.5,90.5 105.5,120.5 105.5,60.5" />
                                    </g>
                                </svg>
                                MetaMask로 연결
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login; 