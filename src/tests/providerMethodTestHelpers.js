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
  [HostingProviders.INFURA]: {
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
      expectTest: TestType.simpleTest,
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
      only: true,
    },
    eth_sign: {
      expectTest: TestType.skipTest,
    },
    eth_signTransaction: {
      expectTest: TestType.skipTest,
    },
    eth_sendTransaction: {
      expectTest: TestType.skipTest,
      only: true,
    },
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
  },
};

export const getHostingProviderTests = (hostingProvider) =>
  ProviderMethodTestMapping[hostingProvider];
