
const contractAddress = "0x82CC8cDF9f152cA4dF361d2741a5B698445bAe80";
const abi = [
    {
        "inputs": [{"internalType": "bytes32","name": "moveHash","type": "bytes32"}],
        "name": "commitMove","outputs": [],"stateMutability": "nonpayable","type": "function"
    },
    {"inputs": [],"name": "joinAsPlayer1","outputs": [],"stateMutability": "payable","type": "function"},
    {"inputs": [],"name": "joinAsPlayer2","outputs": [],"stateMutability": "payable","type": "function"},
    {"inputs": [],"name": "resetGame","outputs": [],"stateMutability": "nonpayable","type": "function"},
    {
        "inputs": [
            {"internalType": "string","name": "moveStr","type": "string"},
            {"internalType": "string","name": "secret","type": "string"}
        ],
        "name": "revealMove","outputs": [],"stateMutability": "nonpayable","type": "function"
    },
    {
        "inputs": [{"internalType": "address","name": "_devWallet","type": "address"}],
        "stateMutability": "nonpayable","type": "constructor"
    },
    {
        "inputs": [{"internalType": "address","name": "","type": "address"}],
        "name": "committedMove","outputs": [{"internalType": "bytes32","name": "","type": "bytes32"}],
        "stateMutability": "view","type": "function"
    },
    {
        "inputs": [],
        "name": "devWallet",
        "outputs": [{"internalType": "address","name": "","type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "gameState",
        "outputs": [{"internalType": "enum RockPaperScissorsBattleSafe.GameState","name": "","type": "uint8"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "player1",
        "outputs": [{"internalType": "address","name": "","type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "player2",
        "outputs": [{"internalType": "address","name": "","type": "address"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address","name": "","type": "address"}],
        "name": "revealedMove",
        "outputs": [{"internalType": "enum RockPaperScissorsBattleSafe.Move","name": "","type": "uint8"}],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "stakeAmount",
        "outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
];

let signer, contract;

async function connectWallet() {
    if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, abi, signer);
        document.getElementById("log").innerText = "Wallet connected.";
    } else {
        alert("MetaMask not detected!");
    }
}

async function joinAsPlayer(playerNumber) {
    try {
        if (playerNumber === 1) {
            await contract.joinAsPlayer1({ value: ethers.utils.parseEther("0.02") });
        } else {
            await contract.joinAsPlayer2({ value: ethers.utils.parseEther("0.02") });
        }
        document.getElementById("log").innerText = `Joined as Player ${playerNumber}`;
    } catch (err) {
        document.getElementById("log").innerText = `Join failed: ${err.message}`;
    }
}

async function commitMove() {
    const move = document.getElementById("moveInput").value.toLowerCase();
    const secret = document.getElementById("secretInput").value;
    const hash = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["string", "string"], [move, secret]));
    try {
        await contract.commitMove(hash);
        document.getElementById("log").innerText = "Move committed.";
    } catch (err) {
        document.getElementById("log").innerText = `Commit failed: ${err.message}`;
    }
}

async function revealMove() {
    const move = document.getElementById("moveInput").value.toLowerCase();
    const secret = document.getElementById("secretInput").value;
    try {
        await contract.revealMove(move, secret);
        document.getElementById("log").innerText = "Move revealed.";
    } catch (err) {
        document.getElementById("log").innerText = `Reveal failed: ${err.message}`;
    }
}

async function resetGame() {
    try {
        await contract.resetGame();
        document.getElementById("log").innerText = "Game reset.";
    } catch (err) {
        document.getElementById("log").innerText = `Reset failed: ${err.message}`;
    }
}
