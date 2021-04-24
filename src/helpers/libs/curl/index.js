import _ from 'lodash';
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
  let filteredArgs = JSON.stringify(_.filter(args));
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

export default curlCalls;
