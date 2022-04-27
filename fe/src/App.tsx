import React from 'react'
import { Switch, BrowserRouter, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import antdConfig from 'src/config/antdConfig'
import UploadSingle from './pages/Upload'
import UploadLayout from './components/UploadLayout'
import './App.less'

export type useSitevarItemProps = string | useSitevarItemProps[]

export type useSitevarProps = useSitevarItemProps[]

const App = () => {
  return (
    <ConfigProvider {...antdConfig}>
      <BrowserRouter basename={'/'}>
        <Switch>
          <UploadLayout>
            <Route path="/upload/single">
              <UploadSingle />
            </Route>
          </UploadLayout>
        </Switch>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
