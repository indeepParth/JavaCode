document.addEventListener("DOMContentLoaded", loadApp());

async function loadApp()
{
    if (window.ethereum) {
        handleEthereum();
    } else {
        window.addEventListener('ethereum#initialized', handleEthereum, {
            once: true,
        });
        setTimeout(handleEthereum, 3000); // 3 seconds
    }    
}
async function handleEthereum() {
    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask) {
        console.log('Ethereum successfully detected!');
        // Access the decentralized web!
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log(accounts);
        // processAction(accounts[0]);
    } else {
        console.log('Please install MetaMask!');
    }
}