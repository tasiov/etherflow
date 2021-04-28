import dotenv from 'dotenv';
import _ from 'lodash';
import buildProvider, { getHostingProvider } from '../helpers/buildProvider';
import Web3RpcCalls from '../helpers/web3Config';
import {
  getAllMethods,
  getHostingProviderTest,
} from './providerMethodTestHelpers.js';

dotenv.config();

const testProviderURL = process.env.TEST_PROVIDER_URL;
expect(testProviderURL).not.toBeFalsy();

const testLib = process.env.TEST_LIB;
expect(testLib).not.toBeFalsy();

const hostingProvider = getHostingProvider(testProviderURL);

const testOnlys = process.env.TEST_ONLYS === 'true';
const shouldLog = testOnlys;

console.log(`
ENV_VARS
--------
HOSTING_PROVIDER: ${hostingProvider}
TEST_PROVIDER_URL: ${testProviderURL}
TEST_LIB: ${testLib}
TEST_ONLYS: ${testOnlys}
`);

const [provider, proto] = buildProvider(testLib, testProviderURL);

describe(`${_.capitalize(hostingProvider)}: Web3 Methods`, function () {
  const methods = getAllMethods();
  _.forEach(methods, (method) => {
    const { expectTest, args = [], only = false } = getHostingProviderTest(
      hostingProvider,
      method
    );
    if (testOnlys && !only) {
      return;
    }
    describe(method, function () {
      const web3Method = Web3RpcCalls[method];
      const { exec } = web3Method[testLib];
      const execBound = exec.bind(null, provider, proto, ...args);
      expectTest(execBound, shouldLog);
    });
  });
});
