import dotenv from 'dotenv';
import buildProvider from '../helpers/buildProvider';
import Web3RpcCalls from '../helpers/web3Config';

dotenv.config();

describe('Web3 Methods', function () {
  const testProviderURL = process.env.TEST_PROVIDER_URL;
  const testLib = process.env.TEST_LIB;
  expect(testProviderURL).not.toBeFalsy();
  expect(testLib).not.toBeFalsy();

  const [provider, proto] = buildProvider(testLib, testProviderURL);

  const simpleMethods = ['web3_clientVersion'];

  simpleMethods.forEach((method) => {
    describe(method, function () {
      const web3Method = Web3RpcCalls[method];
      const { exec } = web3Method[testLib];

      test('should run successfully', async () => {
        const result = await exec(provider, proto);
        expect(result).toBeTruthy();
      });
    });
  });
});

// web3_sha3
// net_version
// net_listening
// net_peerCount
// eth_protocolVersion
// eth_syncing
// eth_coinbase
// eth_mining
// eth_hashrate
// eth_gasPrice
// eth_accounts
// eth_blockNumber
// eth_getBalance
// eth_getStorageAt
// eth_getTransactionCount
// eth_getBlockTransactionCountByHash
// eth_getBlockTransactionCountByNumber
// eth_getUncleCountByBlockHash
// eth_getUncleCountByBlockNumber
// eth_getCode
// eth_sign
// eth_signTransaction
// eth_sendTransaction
// eth_sendRawTransaction
// eth_call
// eth_estimateGas
// eth_getBlockByHash
// eth_getBlockByNumber
// eth_getTransactionByHash
// eth_getTransactionByBlockHashAndIndex
// eth_getTransactionByBlockNumberAndIndex
// eth_getTransactionReceipt
// eth_getUncleByBlockHashAndIndex
// eth_getUncleByBlockNumberAndIndex
// eth_getCompilers
// eth_compileSolidity
// eth_compileSerpent
// eth_newFilter
// eth_newBlockFilter
// eth_newPendingTransactionFilter
// eth_uninstallFilter
// eth_getFilterChanges
// eth_getFilterLogs
// eth_getLogs
// eth_getWork
// trace_block
// trace_transaction
// trace_get
// trace_rawTransaction
// trace_replayBlockTransactions
// trace_replayTransaction
// trace_filter
// trace_call
