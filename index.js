//importing ethers for froneend
import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
connectButton.onclick = connect;
fundButton.onclick = fund;

async function connect() {
  if (typeof window.ethereum != "undefined") {
    await ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "CONNECTED SUCCESSFULLY";
  } else {
    connectButton.innerHTML = "Install MetaMask";
  }
}
async function fund(ethAmount) {
  const ethAmount = document.getElementById("ethAmount").value;
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
