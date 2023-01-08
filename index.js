//importing ethers for froneend
import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum != "undefined") {
    await ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "CONNECTED SUCCESSFULLY";
  } else {
    connectButton.innerHTML = "Install MetaMask";
  }
}
async function fund(ethAmount) {
  ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding With ${ethAmount}`);
  if (typeof window.ethereum != "undefined") {
    // provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(signer);
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenTransactionMined(transactionResponse, provider);
      console.log("Done");
    } catch (error) {
      console.log(error);
    }
  }
}

async function getBalance() {
  if (typeof window.ethereum != "undefined") {
    // provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(`The balance is : ${ethers.utils.formatEther(balance)}`);
  }
}
function listenTransactionMined(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

async function withdraw() {
  if (typeof window.ethereum != "undefined") {
    // provider
    console.log("Withdrawing funds");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await listenTransactionMined(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
}
