const {
    assetDataUtils,
    BigNumber,
    ContractWrappers,
    generatePseudoRandomSalt,
    Order,
    orderHashUtils,
    signatureUtils,
  } =  require('0x.js');
  const TX_DEFAULTS = { gas: 400000 };  
  const { RPCSubprovider, Web3ProviderEngine } = require('0x.js');
  const MNEMONIC = 'youth viable bench view silk into throw wheat base powder kiwi lift';
  const BASE_DERIVATION_PATH = `44'/60'/0'/0`;
  const { MnemonicWalletSubprovider } = require('@0x/subproviders') ;
  const mnemonicWallet = new MnemonicWalletSubprovider({
      mnemonic: MNEMONIC,
      baseDerivationPath: BASE_DERIVATION_PATH,
  });

  const pe = new Web3ProviderEngine();
  pe.addProvider(mnemonicWallet);
  pe.addProvider(new RPCSubprovider('https://u0inegu4e1:q2kdFWlubGnNGeFxRSy82yWohjHE4us-z-dnHervzzA@u0fsmdlod4-u0dwxbpj5l-rpc.us-east-2.kaleido.io'));
  pe.start();
  const providerEngine = pe;
  //console.log(providerEngine);
   const ONE_SECOND_MS = 1000;
  // tslint:disable-next-line:custom-no-magic-numbers
   const ONE_MINUTE_MS = ONE_SECOND_MS * 60;
  // tslint:disable-next-line:custom-no-magic-numbers
   const TEN_MINUTES_MS = ONE_MINUTE_MS * 10;
  /**
   * Returns an amount of seconds that is greater than the amount of seconds since epoch.
   */
   const getRandomFutureDateInSeconds = () => {
    return new BigNumber(Date.now() + TEN_MINUTES_MS).div(ONE_SECOND_MS).integerValue(BigNumber.ROUND_CEIL);
  };
  //const ethers = require('ethers');
  //let privateKey = "44778F6DF03D73F72CBEBE74AD880503F3AEC7ED8A526AD2977BBD0DFE0616FD";
  //let wallet = new ethers.Wallet(privateKey);
  //let provider = ethers.getDefaultProvider('rinkeby');
  //let walletWithProvider = new ethers.Wallet(privateKey, provider);
  
  const { Web3Wrapper } = require ('@0x/web3-wrapper');
  const { getContractAddressesForNetworkOrThrow } = require('@0x/contract-addresses');
  
  //module.exports = providerEngine = new Web3ProviderEngine();
  //providerEngine.addProvider(new RPCSubprovider('https://rinkeby.infura.io/v3/4291b68da2a349ada4711a0a8290ebc2'));
  //providerEngine.start();
  const contractWrappers = new ContractWrappers(providerEngine,{ networkId: 100 });
  //console.log(contractWrappers);
  const web3Wrapper = new Web3Wrapper(providerEngine);
  const contractAddresses = getContractAddressesForNetworkOrThrow(100);
  //console.log(contractAddresses.exchange);
  const tokenAAddress = contractAddresses.tokenA;
  const tokenBAddress = contractAddresses.tokenB;
  const exchnage = contractAddresses.exchange;
  const DECIMALS = 18;
  const makerAssetData = assetDataUtils.encodeERC20AssetData(tokenAAddress);
  const takerAssetData = assetDataUtils.encodeERC20AssetData(tokenBAddress);
  const makerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(100), DECIMALS);
  const takerAssetAmount = Web3Wrapper.toBaseUnitAmount(new BigNumber(200), DECIMALS);
  const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
  const ZERO = new BigNumber(0);
  
  async function test() {
    
    const randomExpiration = getRandomFutureDateInSeconds();
    const exchangeAddress = contractAddresses.exchange;
    const [maker, taker] = await web3Wrapper.getAvailableAddressesAsync();
    console.log('Running...');
    // Create the order
    const check = assetDataUtils.isERC20AssetData(makerAssetData);
    console.log(check,'check asset data');
    const order = {
        exchangeAddress,
        makerAddress: maker,
        takerAddress: taker,
        senderAddress: taker,
        feeRecipientAddress: NULL_ADDRESS,
        expirationTimeSeconds: randomExpiration,
        salt: generatePseudoRandomSalt(),
        makerAssetAmount,
        takerAssetAmount,
        makerAssetData,
        takerAssetData,
        makerFee: ZERO,
        takerFee: ZERO,
    };
    console.log(order);
    const orderHashHex = orderHashUtils.getOrderHashHex(order);
    console.log(orderHashHex);
    const signature = await signatureUtils.ecSignHashAsync(providerEngine, orderHashHex, maker);
    const signedOrder = { ...order, signature };
    console.log(signature);
  //console.log(contractWrappers);
    //await contractWrappers.exchange.validateFillOrderThrowIfInvalidAsync(signedOrder, takerAssetAmount, taker);
try{   
    txHash = await contractWrappers.exchange.fillOrderAsync(signedOrder, takerAssetAmount, taker, {TX_DEFAULTS,});
    console.log(txHash);
    var transaction = await web3Wrapper.awaitTransactionSuccessAsync(txHash);
     console.log(transaction);}catch(error){
         console.log(error);
     }
  }
  test();
  