import React from 'react';
import { ConfigProvider, Menu, Upload } from 'antd';
import { ApolloProvider } from 'react-apollo';
import antdConfig from './config/antdConfig';
import apolloClient from 'src/apollo/apolloClient'
import './App.less';
import './reset.less'
import BaseMenu from './components/BaseMenu';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ConfigProvider {...antdConfig}>
        <Upload />
        <BaseMenu />
      </ConfigProvider>
    </ApolloProvider>
  );
}

export default App;
