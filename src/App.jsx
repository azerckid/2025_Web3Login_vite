import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import Login from './pages/Login';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

const solanaWallets = [new PhantomWalletAdapter()];

function App() {
  return (
    <WalletProvider wallets={solanaWallets} autoConnect>
      <WalletModalProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </WalletModalProvider>
    </WalletProvider>
  );
}

export default App;
