import _ from 'lodash';
import Web3 from 'web3';
import EthersCalls from '../ethers';
import curlToFetch from './curlToFetch';

const curlTemplate = (curlCommand) => {
  return `
// curl command
// ${curlCommand}
  
// Implemented using browser Fetch API
${curlToFetch(curlCommand)}
`.trim();
};

const curlCommands = _.keys(EthersCalls);

const getCurlCommand = (url, method, args) => {
  let filteredArgs = JSON.stringify(
    _.filter(args, (arg) => !_.includes([null, undefined, ''], arg))
  );
  return `curl -X POST --data '{"jsonrpc":"2.0","method":"${method}","params":${filteredArgs},"id":1337}' ${url}`;
};

const curlCalls = _.reduce(
  curlCommands,
  (accum, method) => {
    accum[method] = {
      exec: async (provider, proto, ...args) => {
        const url = provider.currentProvider.host;
        const jsonResponse = await eval(
          curlToFetch(getCurlCommand(url, method, args))
        );
        const response = await jsonResponse.json();
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.result;
      },
      codeSample: (url, ...args) =>
        curlTemplate(getCurlCommand(url, method, args)),
      args: EthersCalls[method].args,
    };
    return accum;
  },
  {}
);

// Overwritten methods

curlCalls.eth_call = {
  exec: async (provider, proto, ...args) => {
    const url = provider.currentProvider.host;
    const [address = '', abi = '', method, ...rest] = args;
    if (!_.every([address, abi, method])) {
      return curlTemplate(getCurlCommand(url, 'eth_call', []));
    }
    let data;
    try {
      const abiToEncode = JSON.parse(abi)[0];
      data = provider.eth.abi.encodeFunctionCall(abiToEncode, rest);
    } catch (err) {
      console.warn(err);
      throw new Error('Failed to encode contract request data');
    }
    const params = [{ data, to: address }, 'latest'];
    const jsonResponse = await eval(
      curlToFetch(getCurlCommand(url, 'eth_call', params))
    );
    const response = await jsonResponse.json();
    if (response.error) {
      throw new Error(response.error.message);
    }
    return response.result;
  },
  codeSample: (url, ...args) => {
    const provider = new Web3(url);
    const [address = '', abi = '', method, rest] = args;
    if (!_.every([address, abi, method])) {
      return curlTemplate(getCurlCommand(url, 'eth_call', []));
    }
    let data;
    try {
      const contractArgs = rest ? rest.split(',').map(JSON.parse) : [];
      const abiToEncode =
        typeof abi === 'string' ? JSON.parse(atob(abi)) : abi[0];
      data = provider.eth.abi.encodeFunctionCall(abiToEncode, contractArgs);
    } catch (err) {
      console.warn(err);
      return curlTemplate(getCurlCommand(url, 'eth_call', []));
    }
    const params = [{ data, to: address }, 'latest'];
    return curlTemplate(getCurlCommand(url, 'eth_call', params));
  },
  args: EthersCalls.eth_call.args,
};

_.forEach(['eth_getBlockByHash', 'eth_getBlockByNumber'], (method) => {
  curlCalls[method] = {
    exec: async (provider, proto, ...args) => {
      const url = provider.currentProvider.host;
      const filteredArgs = args.slice(0);
      filteredArgs[1] = filteredArgs[1] === 'true';
      const jsonResponse = await eval(
        curlToFetch(getCurlCommand(url, method, filteredArgs))
      );
      const response = await jsonResponse.json();
      if (response.error) {
        throw new Error(response.error.message);
      }
      return response.result;
    },
    codeSample: (url, ...args) => {
      const filteredArgs = args.slice(0);
      filteredArgs[1] = filteredArgs[1] === 'true';
      return curlTemplate(getCurlCommand(url, method, filteredArgs));
    },
    args: EthersCalls[method].args,
  };
});

export default curlCalls;
