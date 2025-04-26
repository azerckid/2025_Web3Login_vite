import React from 'react';
import { Button } from '@solana/wallet-adapter-react-ui';

const METAMASK_ICON = 'https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg';

export const MetaMaskListItem = ({ onClick, tabIndex }) => {
    return (
        <li>
            <Button
                onClick={onClick}
                startIcon={<img src={METAMASK_ICON} alt="MetaMask icon" style={{ width: 24, height: 24, borderRadius: '50%', background: '#fff', padding: 2 }} />}
                tabIndex={tabIndex}
            >
                MetaMask
                <span style={{ marginLeft: 'auto', color: '#a3a3b5', fontSize: 14, fontWeight: 400 }}>Detected</span>
            </Button>
        </li>
    );
};

export default MetaMaskListItem; 