import dotenv from 'dotenv';
import _ from 'lodash';
import buildProvider, { getHostingProvider } from '../helpers/buildProvider';
import Web3RpcCalls from '../helpers/web3Config';
import { getHostingProviderTests } from './providerMethodTestHelpers.js';

dotenv.config();

const testProviderURL = process.env.TEST_PROVIDER_URL;
expect(testProviderURL).not.toBeFalsy();
console.log('TEST_PROVIDER_URL', testProviderURL);

const testLib = process.env.TEST_LIB;
expect(testLib).not.toBeFalsy();
console.log('TEST_LIB', testLib);

const hostingProvider = getHostingProvider(testProviderURL);
console.log('HOSTING_PROVIDER', hostingProvider);

const [provider, proto] = buildProvider(testLib, testProviderURL);

describe(`${_.capitalize(hostingProvider)}: Web3 Methods`, function () {
  _.forEach(
    getHostingProviderTests(hostingProvider),
    ({ expectTest, args = [] }, method) => {
      describe(method, function () {
        const web3Method = Web3RpcCalls[method];
        const { exec } = web3Method[testLib];
        const execBound = exec.bind(null, provider, proto, ...args);
        expectTest(execBound);
      });
    }
  );
});

// web3_sha3
// eth_coinbase
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
