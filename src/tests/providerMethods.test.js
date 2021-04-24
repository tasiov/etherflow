import dotenv from 'dotenv';
import _ from 'lodash';
import buildProvider, { getHostingProvider } from '../helpers/buildProvider';
import Web3RpcCalls from '../helpers/web3Config';
import { getHostingProviderTests } from './providerMethodTestHelpers.js';

dotenv.config();
let shouldLog = false;

const testProviderURL = process.env.TEST_PROVIDER_URL;
expect(testProviderURL).not.toBeFalsy();
console.log('TEST_PROVIDER_URL', testProviderURL);

const testLib = process.env.TEST_LIB;
expect(testLib).not.toBeFalsy();
console.log('TEST_LIB', testLib);

const hostingProvider = getHostingProvider(testProviderURL);
console.log('HOSTING_PROVIDER', hostingProvider);

const testOnlys = process.env.TEST_ONLYS === 'true';
if (testOnlys) {
  console.log('TEST_ONLYS', testOnlys);
  shouldLog = true;
}

const [provider, proto] = buildProvider(testLib, testProviderURL);

describe(`${_.capitalize(hostingProvider)}: Web3 Methods`, function () {
  const testMapping = getHostingProviderTests(hostingProvider);
  const methods = _.keys(testMapping);
  _.forEach(methods, (method, idx) => {
    const { expectTest, args = [], only } = testMapping[method];

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
