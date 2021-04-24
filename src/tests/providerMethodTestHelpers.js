import { HostingProviders } from '../helpers/buildProvider';

const TestType = {
  simpleTest: (execBound) => {
    test('should run successfully', async () => {
      const result = await execBound();
      expect(result).toBeDefined();
    });
  },
  notAvailableTest: (execBound) => {
    test('is not available', async () => {
      try {
        await execBound();
      } catch (err) {
        expect(err.message).toContain('does not exist/is not available');
      }
    });
  },
  equalityTest: (matchValue, execBound) => {
    test('produces correct result', async () => {
      const result = await execBound();
      expect(result).toEqual(matchValue);
    });
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
  },
};

export const getHostingProviderTests = (hostingProvider) =>
  ProviderMethodTestMapping[hostingProvider];
