import _ from 'lodash';
import curlToFetch from './curlToFetch';

const curlTemplate = (curlCommand) => {
  return `
// curl command
// ${curlCommand}
  
// Implemented using browser Fetch API
${curlToFetch(curlCommand)}
`.trim();
};

const curlCommands = {
  web3_clientVersion: (url) =>
    `curl ${url} -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":67}'`,
};

const curlExec = (method, url, proto, ...args) =>
  eval(curlToFetch(curlCommands[method](url))).then((response) =>
    response.json()
  );

const curlCodeSample = (method, url, ...args) =>
  curlTemplate(curlCommands[method](url));

const curlCalls = _.mapValues(
  curlCommands,
  (accum, method) => ({
    exec: curlExec.bind(null, method),
    codeSample: curlCodeSample.bind(null, method),
  }),
  {}
);

export default curlCalls;
