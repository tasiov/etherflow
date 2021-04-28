import React from 'react';
import ReactDOM from 'react-dom';
import {
  CodeSampleContainer,
  LogsContainer,
  MethodCallContainer,
  StatusBarContainer,
  NavBarContainer,
  Web3MenuContainer,
  SponsoredAdContainer,
} from './containers';
import { AppProvider } from './context';
import { Router } from '@reach/router';
import Web3 from 'web3';

import './tailwind.output.css';
window.Web3 = Web3;

const Wrapper = () => (
  <AppProvider>
    <div>
      <NavBarContainer />
      <StatusBarContainer />

      <div className="flex">
        <Web3MenuContainer />
        <MethodCallContainer />
        <LogsContainer />
      </div>

      <CodeSampleContainer />
      <SponsoredAdContainer />
    </div>
  </AppProvider>
);

const App = () => (
  <Router>
    <Wrapper default />
    <Wrapper path="/:web3URL" />
    <Wrapper path="/:web3URL/:web3Lib" />
    <Wrapper path="/:web3URL/:web3Lib/:currentMethod" />
    <Wrapper path="/:web3URL/:web3Lib/:currentMethod/*formArgs" />
  </Router>
);

ReactDOM.render(<App />, document.querySelector('#root'));
