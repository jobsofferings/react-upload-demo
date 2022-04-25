import { ConfigProvider, Upload } from 'antd';
import { ApolloProvider } from 'react-apollo';
import antdConfig from './config/antdConfig';
import apolloClient from 'src/apollo/apolloClient'
import Clip from './page/clip';
import './App.less';

const App = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ConfigProvider {...antdConfig}>
        <Clip />
      </ConfigProvider>
    </ApolloProvider>
  );
}

export default App;
