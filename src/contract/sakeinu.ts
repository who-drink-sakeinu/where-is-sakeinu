import { ethers } from "ethers";

// Importing the contract ABI
import { Contract } from "ethers";


const provider = new ethers.JsonRpcProvider("https://evm-rpc.sei-apis.com")

const abi = [
    "function getERC721QueueLength() public view returns (uint256)",
    "function getERC721TokensInQueue(uint256 start_, uint256 count_) public view returns (uint256[] memory)",
    "function erc721TotalSupply() view returns (uint256)"
]

const sakeinuContract = new Contract("0xe85dC0CCECa105755753Fef452C091dEF5324138", abi, provider)

export async function queryTokensInQueue() {
    const length = await sakeinuContract.getERC721QueueLength()
    const ids = await sakeinuContract.getERC721TokensInQueue(0, Number(length) ) 
    return ids
}

export async function queryTotalSupply() {
    const totalSupply = await sakeinuContract.erc721TotalSupply()
    return Number(totalSupply)
}