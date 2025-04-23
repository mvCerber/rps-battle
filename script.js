
const abi = [
    {
        "inputs": [{"internalType": "bytes32", "name": "moveHash", "type": "bytes32"}],
        "name": "commitMove",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "joinAsPlayer1",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "joinAsPlayer2",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "resetGame",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {"internalType": "string", "name": "moveStr", "type": "string"},
            {"internalType": "string", "name": "secret", "type": "string"}
        ],
        "name": "revealMove",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "_devWallet", "type": "address"}],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [{"internalType": "address", "name": "", "type": "address"}],
        "name": "committedMove",
        "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "devWallet",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "gameState",
        "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "player1",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "player2",
        "outputs": [{"internalType": "address", "name": "", "type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address", "name": "", "type": "address"}],
        "name": "revealedMove",
        "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "stakeAmount",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

const contractAddress = "0x82CC8cDF9f152cA4dF361d2741a5B698445bAe80";


let provider, signer, contract, currentAccount;

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        currentAccount = await signer.getAddress();
        contract = new ethers.Contract(contractAddress, abi, signer);
        document.getElementById("log").innerText = "Wallet connected: " + currentAccount;
        updateGameStatus();
    } else {
        alert("Install MetaMask.");
    }
}

async function joinAsPlayer1() {
    try {
        const tx = await contract.joinAsPlayer1({ value: ethers.utils.parseEther("0.02") });
        await tx.wait();
        updateGameStatus();
    } catch (e) {
        document.getElementById("log").innerText = "Error joining as Player 1: " + e.message;
    }
}

async function joinAsPlayer2() {
    try {
        const tx = await contract.joinAsPlayer2({ value: ethers.utils.parseEther("0.02") });
        await tx.wait();
        updateGameStatus();
    } catch (e) {
        document.getElementById("log").innerText = "Error joining as Player 2: " + e.message;
    }
}

async function commitMove() {
    const move = document.getElementById("move").value;
    const secret = document.getElementById("secret").value;
    const hash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["string", "string"], [move, secret]));
    const tx = await contract.commitMove(hash);
    await tx.wait();
    document.getElementById("log").innerText = "Move committed.";
}

async function revealMove() {
    const move = document.getElementById("move").value;
    const secret = document.getElementById("secret").value;
    const tx = await contract.revealMove(move, secret);
    await tx.wait();
    updateGameStatus();
}

async function resetGame() {
    const tx = await contract.resetGame();
    await tx.wait();
    updateGameStatus();
}

async function updateGameStatus() {
    const state = await contract.gameState();
    const p1 = await contract.player1();
    const p2 = await contract.player2();
    document.getElementById("status").innerText = "Game Status: " + ["WaitingForPlayer1", "WaitingForPlayer2", "CommitPhase", "RevealPhase", "Finished"][state];
    document.getElementById("players").innerText = `Player 1: ${p1}
Player 2: ${p2}`;
}
