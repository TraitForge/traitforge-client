import { useEffect, useState } from 'react';

const useMetaMask = () => {
    const [account, setAccount] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initMetaMask = async () => {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    setAccount(accounts[0]);

                    window.ethereum.on('accountsChanged', (accounts) => {
                        setAccount(accounts[0]);
                    });
                    window.ethereum.on('chainChanged', () => {
                        window.location.reload();
                    });
                } catch (error) {
                    setError(error);
                }
            } else {
                setError('MetaMask is not installed.');
            }
        };

        initMetaMask();
    }, []);

    return { account, error };
};

export default useMetaMask;
