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
        processAction(accounts[0]);
    } else {
        console.log('Please install MetaMask!');
    }
}




async function signMessage(wallet, token, amount, id, verifyContact, chainIdd) {
    try {
        var msgParams = {
            domain: {
                chainId: "137",
                name: 'Runiverse',
                verifyingContract: verifyContact,
                version: '1',
            },
            message: {
                sender: wallet,
                tokenChosen: token,
                amountBetted: amount,
                gameId: id,
                chainId: chainIdd,
                deadline: "300000000000000000000000",
            },
            primaryType: 'StartRun',
            types: {
                EIP712Domain: [
                    { name: 'name', type: 'string' },
                    { name: 'version', type: 'string' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'verifyingContract', type: 'address' },
                ],
                StartRun: [
                    { name: 'sender', type: 'address' },
                    { name: 'tokenChosen', type: 'address' },
                    { name: 'amountBetted', type: 'uint256' },
                    { name: 'gameId', type: 'uint256' },
                    { name: 'chainId', type: 'uint256' },
                    { name: 'deadline', type: 'uint256' },
                ],
            },
        };
        msgParams.message.sender = wallet;
        msgParams.message.tokenChosen = token;
        msgParams.message.amountBetted = amount;
        msgParams.message.gameId = id;
        msgParams.domain.verifyingContract = verifyContact;
        msgParams.message.chainId = chainIdd;

        // console.log('sign message in index = ' + JSON.stringify(msgParams));
        var sign1 = "";
        try {
            sign1 = await window.ethereum.request({
                method: 'eth_signTypedData_v4',
                params: [wallet, JSON.stringify(msgParams)],
            });
        }
        catch (error) {
            sign1 = "";
        }

        console.log({ sign1 });
        // displayResponse("Signature complete.<br><br>Copy to clipboard then continue to App", signature);
    } catch (error) {
        console.log("error sign");
        // displayResponse("Signature Denied");
    }
}

function processAction(accounts) {
    // ?action=sign&token=0x578FEE9DEF9a270C20865242CfD4ff86f31d0e5B&amount=1&gameid=500&verifyContact=0x3d28c98ae7092eaca8ea2fe145e210773affb686&chainId=137
    const urlParams = new URL(window.location.toLocaleString()).searchParams;
    const action = urlParams.get("action");
    const token = urlParams.get("token");
    const amount = urlParams.get("amount");
    const gameid = urlParams.get("gameid");
    const verifyContact = urlParams.get("verifyContact");
    const chainId = urlParams.get("chainId") || 137;
    const to = urlParams.get("to");
    const value = urlParams.get("value");
    const data = urlParams.get("data") || "";
    const gasLimit = urlParams.get("gasLimit") || undefined;
    const gasPrice = urlParams.get("gasPrice") || undefined;

    // Signatures
    const message = urlParams.get("message");
    // EIP712
    const domain = urlParams.get("domain") || undefined;
    const types = urlParams.get("types") || undefined;

    if (action == "sign" && token && amount && gameid && verifyContact && chainId) {
        console.log("signMessage");
        return signMessage(accounts, token, amount, gameid, verifyContact, chainId);
    }
}