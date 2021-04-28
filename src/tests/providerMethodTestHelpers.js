import _ from 'lodash';
import { HostingProviders } from '../helpers/buildProvider';

const DummyArguments = {
  ACCOUNT_ADDRESS: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  CONTRACT_ADDRESS: '0x126BDD6aDA5d8C917803dd6A40B7C3c44b30f7F6',
  BLOCK_HEX: '0xBB7775',
  BLOCK_INT: '12285813',
  BLOCK_HASH:
    '0x54d0a5898fd551692c18d7e1004fe42dca18e09550b659215275788aea8a27ca',
  TXN_HASH:
    '0x819a6da5d6f4ce623ae5a660143f9c209824a0e2665d2eab9575752206dfee40',
  TXN_SIGNED_DATA:
    '0xf86c0a8502540be400825208944bbeeb066ed09b7aed07bf39eee0460dfa261520880de0b6b3a7640000801ca0f3ae52c1ef3300f44df0bcfd1341c232ed6134672b16e35699ae3f5fe2493379a023d23d2955a239dd6f61c4e8b2678d174356ff424eac53da53e17706c43ef871',
  DAVID_GUETTA_CONTRACT_ADDRESS: '0x493495Ba108F3644eCAcb08041A445e5736022fF',
  DAVID_GUETTA_CONTRACT_INPUT_ABI: JSON.stringify([
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: 'tokenOwner',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: 'balance',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ]),
};

const TestType = {
  simpleTest: (execBound, shouldLog) => {
    test('should run successfully', async () => {
      const result = await execBound();
      expect(result).toBeDefined();
      if (shouldLog) console.log(result);
    });
  },
  notAvailableTest: (execBound, shouldLog) => {
    test('is not available', async () => {
      try {
        const result = await execBound();
        if (shouldLog) console.log(result);
      } catch (err) {
        expect(err.message).toContain('does not exist/is not available');
        if (shouldLog) console.log(err.message);
      }
    });
  },
  errorTest: (errorMessage, execBound, shouldLog) => {
    test('is not available', async () => {
      try {
        const result = await execBound();
        if (shouldLog) console.log(result);
      } catch (err) {
        expect(err.message).toContain(errorMessage);
        if (shouldLog) console.log(err.message);
      }
    });
  },
  equalityTest: (matchValue, execBound, shouldLog) => {
    test('produces correct result', async () => {
      const result = await execBound();
      expect(result).toEqual(matchValue);
      if (shouldLog) console.log(result);
    });
  },
  skipTest: (execBound) => {
    test.skip('This method is not supported in EtherFlow', () => {});
  },
};

const ProviderMethodTestMapping = {
  [HostingProviders.DEFAULT]: {
    web3_clientVersion: {
      expectTest: TestType.simpleTest,
    },
    web3_sha3: {
      expectTest: TestType.equalityTest.bind(
        null,
        '0x56570de287d73cd1cb6092bb8fdee6173974955fdef345ae579ee9f475ea7432'
      ),
      args: ['0x1234'],
    },
    net_version: {
      expectTest: TestType.simpleTest,
    },
    net_listening: {
      expectTest: TestType.simpleTest,
    },
    net_peerCount: {
      expectTest: TestType.simpleTest,
    },
    eth_protocolVersion: {
      expectTest: TestType.simpleTest,
    },
    eth_syncing: {
      expectTest: TestType.simpleTest,
    },
    eth_coinbase: {
      expectTest: TestType.notAvailableTest,
    },
    eth_mining: {
      expectTest: TestType.simpleTest,
    },
    eth_hashrate: {
      expectTest: TestType.notAvailableTest,
    },
    eth_gasPrice: {
      expectTest: TestType.simpleTest,
    },
    eth_accounts: {
      expectTest: TestType.simpleTest,
    },
    eth_blockNumber: {
      expectTest: TestType.simpleTest,
    },
    eth_getBalance: {
      expectTest: TestType.simpleTest,
      args: [DummyArguments.ACCOUNT_ADDRESS, 'latest'],
    },
    eth_getStorageAt: {
      expectTest: TestType.simpleTest,
      args: [DummyArguments.CONTRACT_ADDRESS, '0x0', 'latest'],
    },
    eth_getTransactionCount: {
      expectTest: TestType.simpleTest,
      args: [DummyArguments.CONTRACT_ADDRESS, 'latest'],
    },
    eth_getBlockTransactionCountByHash: {
      expectTest: TestType.simpleTest,
      args: [DummyArguments.BLOCK_HASH],
    },
    eth_getBlockTransactionCountByNumber: {
      expectTest: TestType.simpleTest,
      args: [DummyArguments.BLOCK_HEX],
    },
    eth_getUncleCountByBlockHash: {
      expectTest: TestType.simpleTest,
      args: [DummyArguments.BLOCK_HASH],
    },
    eth_getUncleCountByBlockNumber: {
      expectTest: TestType.simpleTest,
      args: [DummyArguments.BLOCK_HEX],
    },
    eth_getCode: {
      expectTest: TestType.simpleTest,
      args: [DummyArguments.CONTRACT_ADDRESS, 'latest'],
    },
    eth_sign: {
      expectTest: TestType.skipTest,
    },
    eth_signTransaction: {
      expectTest: TestType.skipTest,
    },
    eth_sendTransaction: {
      expectTest: TestType.skipTest,
    },
    eth_sendRawTransaction: {
      expectTest: TestType.errorTest.bind(
        null,
        'insufficient funds for gas * price + value'
      ),
      args: [DummyArguments.TXN_SIGNED_DATA],
    },
    eth_call: {
      expectTest: TestType.simpleTest,
      args: [
        DummyArguments.DAVID_GUETTA_CONTRACT_ADDRESS,
        DummyArguments.DAVID_GUETTA_CONTRACT_INPUT_ABI,
        'balanceOf',
        DummyArguments.ACCOUNT_ADDRESS,
      ],
    },
    eth_estimateGas: {
      expectTest: TestType.skipTest,
    },
    eth_getBlockByHash: {
      expectTest: TestType.simpleTest,
      args: [DummyArguments.BLOCK_HASH, true],
    },
    eth_getBlockByNumber: {
      expectTest: TestType.simpleTest,
      args: [DummyArguments.BLOCK_HEX, true],
    },
    eth_getTransactionByHash: {
      expectTest: TestType.simpleTest,
      args: [DummyArguments.TXN_HASH],
    },
    eth_getTransactionByBlockHashAndIndex: {
      expectTest: TestType.simpleTest,
      args: [DummyArguments.BLOCK_HASH, '0x0'],
    },
    eth_getTransactionByBlockNumberAndIndex: {
      expectTest: TestType.simpleTest,
      args: [DummyArguments.BLOCK_HEX, '0x0'],
    },
    eth_getTransactionReceipt: {
      expectTest: TestType.simpleTest,
      args: [DummyArguments.TXN_HASH],
    },
    eth_getUncleByBlockHashAndIndex: {
      expectTest: TestType.simpleTest,
      args: [DummyArguments.BLOCK_HASH, '0x0'],
    },
    eth_getUncleByBlockNumberAndIndex: {
      expectTest: TestType.simpleTest,
      args: [DummyArguments.BLOCK_HEX, '0x0'],
    },
    eth_getCompilers: {
      expectTest: TestType.notAvailableTest,
    },
    eth_compileSolidity: {
      expectTest: TestType.notAvailableTest,
    },
    eth_compileSerpent: {
      expectTest: TestType.notAvailableTest,
    },
    // eth_newFilter
    eth_newBlockFilter: {
      expectTest: TestType.simpleTest,
      only: true,
    },
    eth_newPendingTransactionFilter: {
      expectTest: TestType.notAvailableTest,
    },
    eth_uninstallFilter: {
      expectTest: TestType.skipTest,
    },
    eth_getFilterChanges: {
      expectTest: TestType.skipTest,
    },
    eth_getFilterLogs: {
      expectTest: TestType.skipTest,
    },
    eth_getLogs: {
      expectTest: TestType.skipTest,
    },
    eth_getWork: {
      expectTest: TestType.errorTest.bind(null, 'no mining work available yet'),
    },
    trace_block: {
      expectTest: TestType.notAvailableTest,
    },
    trace_transaction: {
      expectTest: TestType.notAvailableTest,
    },
    trace_get: {
      expectTest: TestType.notAvailableTest,
    },
    trace_rawTransaction: {
      expectTest: TestType.notAvailableTest,
    },
    trace_replayBlockTransactions: {
      expectTest: TestType.notAvailableTest,
    },
    trace_replayTransaction: {
      expectTest: TestType.notAvailableTest,
    },
    trace_filter: {
      expectTest: TestType.notAvailableTest,
    },
    trace_call: {
      expectTest: TestType.notAvailableTest,
    },
  },
};

export const getAllMethods = () =>
  _.keys(ProviderMethodTestMapping[HostingProviders.DEFAULT]);

export const getHostingProviderTest = (hostingProvider, method) =>
  _.get(ProviderMethodTestMapping, [hostingProvider, method]) ||
  _.get(ProviderMethodTestMapping, [HostingProviders.DEFAULT, method]);
