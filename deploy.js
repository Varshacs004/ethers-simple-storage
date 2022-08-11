// Pulling Ethers Package :
const ethers = require("ethers")
// const - variable cannot be changed

// To read from ABI and BIN file we use fs [and fs-extra] package.
const fs = require("fs-extra")

//Pull up the environment variables.
require("dotenv").config()

// Function Definition :
async function main() {
  // http://127.0.0.1:8545 (ubuntu instance)

  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)

  // const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  /* NOTE:
    When developing actual Dapps do not copy paste the private key directly to the code.
    Since this is a practice code, we are copy-pasting the private key directly to the code.
  */
  const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8")
  let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.DECRYPTION_PASSWORD
  )
  wallet = await wallet.connect(provider)

  const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf8")
  const bin = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf8")

  // Contract Factory (it is an object used to deploy contracts).
  const contractFactory = new ethers.ContractFactory(abi, bin, wallet)
  console.log("Deploying, please wait...")

  // Contract Deployment with Ethers :
  const contract = await contractFactory.deploy({ gasLimit: 6721975 })
  // console.log(contract);

  const deploymentReceipt = await contract.deployTransaction.wait(1)
  // the above line is to make the contract wait for some blocks (number of blocks specified in .wait(...)) to be added to the chain.
  // this is to make sure our txn is attached to the blockchain.

  console.log(`Contract Address : ${contract.address}`)
  // console.log(contract.deployTransaction); //Transaction response.
  // console.log("Deployment Receipt : ");
  // console.log(deploymentReceipt); //Output after waiting for 1 block to be added in chain.

  const currentFavouriteNumber = await contract.retrieve()
  const transactionResponse = await contract.store("9")
  //const transactionReciept = await transactionResponse.deployTransaction.wait(1);
  const FavouriteNumber = await contract.retrieve()
  console.log(`Favourite Number : ${FavouriteNumber.toString()}`)
}

// Function Call :
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
