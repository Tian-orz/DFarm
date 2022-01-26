const bip39 = require('bip39')
const { hdkey } = require("ethereumjs-wallet");
const util = require('ethereumjs-util')

const Web3 = require('web3');

// 通过web3js创建钱包(含地址和私钥)
let createWallet1 = () => {
    const web3 = new Web3('https://eth-mainnet.alchemyapi.io/v2/drsYFmqbDqcTNhWsrceiuHE4x_Zmzlb7');
    let wallet = web3.eth.accounts.create();
    console.log(`地址: ${wallet.address}`)
    console.log(`私钥: ${wallet.privateKey}`)
}
// createWallet1()


// 通过助记词创建钱包(含地址,助记词,私钥,公钥)
let createWallet2 = () => {
    // 生成助记词
    let mnemonic = bip39.generateMnemonic();
    // 将助记词转成seed
    let seed = bip39.mnemonicToSeedSync(mnemonic);
    // 通过hdkey将seed生成HDWallet
    let hdWallet = hdkey.fromMasterSeed(seed);
    // 生成钱包中在m/44'/60'/0'/0/0路径的第一个帐户的keypair。
    let key = hdWallet.derivePath("m/44'/60'/0'/0/0");
    // 从keypair中获取私钥
    let privateKey = util.bufferToHex(key._hdkey._privateKey)
    // 从keypair中获取公钥
    let publicKey = util.bufferToHex(key._hdkey._publicKey)
    // 使用keypair中的公钥生成地址
    let address = util.pubToAddress(key._hdkey._publicKey, true)
    address = util.toChecksumAddress('0x'+address.toString('hex'))
    console.log(`地址: ${address}`)
    console.log(`助记词: ${mnemonic}`)
    console.log(`私钥: ${privateKey}`)
    console.log(`公钥: ${publicKey}`)
}
// createWallet2()