import { ethers } from 'ethers';
import Web3 from 'web3';
import _ from 'lodash';

export const HostingProviders = {
  QUIKNODE: 'QUIKNODE',
  INFURA: 'INFURA',
  ALCHEMY: 'ALCHEMY',
};

export const getHostingProvider = (web3URL) =>
  _.reduce(
    _.values(HostingProviders),
    (accum, value) => {
      if (_.includes(web3URL, _.lowerCase(value))) {
        accum = value;
      }
      return accum;
    },
    undefined
  );

export default (web3Lib, web3URL) => {
  let provider;
  const proto = web3URL.startsWith('wss') ? 'wss' : 'https';
  if (web3Lib === 'ethers') {
    provider =
      proto === 'wss'
        ? new ethers.providers.WebSocketProvider(web3URL)
        : new ethers.providers.JsonRpcProvider(web3URL);
  } else if (web3Lib === 'web3') {
    provider = new Web3(web3URL);
  } else if (web3Lib === 'curl') {
    provider = new Web3(web3URL);
  } else {
    throw new Error(`web3Lib ${web3Lib} is not supported`);
  }
  return [provider, proto];
};
