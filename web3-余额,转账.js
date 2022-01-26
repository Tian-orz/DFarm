// 加载web3js的库
const Web3 = require('web3');
require('dotenv').config()

// 设置BSC的RPC链接
const rpcUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/';// bsc测试网
// 实例化web3
const web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));

const abi = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
]


/**
 * 获得原生代币数量(BSC链即钱包BNB数量)
 * @param {*} walletAddress 钱包地址
 * @returns 公链币数量
 */
const getBalance = async (walletAddress) => {
    let res = await web3.eth.getBalance(walletAddress)
    // 单位换算
    let balance = web3.utils.fromWei(res, 'ether')
    return balance
}

/**
 * 获得钱包ERC20代币数量
 * @param {*} walletAddress 钱包地址
 * @param {*} tokenAddress 代币合约地址
 * @returns 代币数量
**/
const getTokenBalance = async (walletAddress, tokenAddress) => {
    // 实例化代币合约
    let tokenContract = new web3.eth.Contract(abi, tokenAddress);
    // 调用合约提供的获取余额方法
    let result = await tokenContract.methods.balanceOf(walletAddress).call();
    // 单位换算
    let tokenBalance = web3.utils.fromWei(result, 'ether');
    // 获得代币的符号
    let symbol = await tokenContract.methods.symbol().call();
    return `${tokenBalance} ${symbol}`;
}

/**
 * 原生代币转账
 * @param {*} from 来源钱包
 * @param {*} to 目标钱包
 * @param {*} amount 数量
 * @returns tx_hash
 */
 const transfer = async (from, to, amount) => {
    return new Promise(async (resolve) => {
        let nounce = await web3.eth.getTransactionCount(from);
        let gasPrice = await web3.eth.getGasPrice();
        let gasLimit = 42000;
        let value = web3.utils.toWei((amount).toString(10), 'ether');
        //构建交易参数
        let tx = {
            nounce,
            gasPrice,
            gasLimit,
            to,
            value
        }
        web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY).then(signed => {
            web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', receipt => {
                resolve(receipt)
            })
        })
    })
}

/**
 * ERC20代币转账
 * @param {*} from 来源钱包
 * @param {*} to 目标钱包
 * @param {*} amount 数量
 * @param {*} tokenAddress 代币合约地址
 * @returns tx_hash
 */
 const transferToken = async (from, to, amount, tokenAddress) => {
    return new Promise(async (resolve) => {
        let nounce = await web3.eth.getTransactionCount(from);
        let gasPrice = await web3.eth.getGasPrice();
        let gasLimit = 420000;
        // 实例化代币合约
        let tokenContract = new web3.eth.Contract(abi, tokenAddress);
        // 调用合约 通用 transfer 方法
        let transaction = await tokenContract.methods.transfer(to,web3.utils.toWei((amount).toString(), 'ether'));
        //构建交易参数
        let tx = {
            data: transaction.encodeABI(),
            nounce,
            gasPrice,
            gasLimit,
            to: tokenAddress // 合约交互时，to写合约地址
        }
        web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY).then(signed => {
            web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', receipt => {
                resolve(receipt)
            })
        })
    })
}



(async function main() {
    // 查询原生代币余额
    // let walletAddress = '0x5f88Eb1e4E43b1e72Bc14Cb32CB2b787625d8aD1'
    // let balance = await getBalance(walletAddress)
    // console.log(balance)

    // 查询ERC20代币余额
    // let tokenAddress = '0x78867bbeef44f2326bf8ddd1941a4439382ef2a7'
    // let tokenBalance = await getTokenBalance(walletAddress,tokenAddress)
    // console.log(tokenBalance)

    // 原生代币转账
    // let target_address = '0xDA40Ff9bB7e898Af35044A5c23085647d2dFBf0B'
    // let receipt= await transfer(walletAddress,target_address,0.01)
    // console.log(`transactionHash: ${receipt.transactionHash}`)
    
    // ERC20代币转账
    // let receipt = await transferToken(walletAddress,target_address,0.01,tokenAddress)
    // console.log(`transactionHash: ${receipt.transactionHash}`)
})()
