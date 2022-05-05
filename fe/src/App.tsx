import React from 'react'
import { Switch, BrowserRouter, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import antdConfig from 'src/config/antdConfig'
import UploadLayout from './components/UploadLayout'
import UploadSingle from './pages/UploadSingle'
import UploadMuti from './pages/UploadMuti'
import UploadDragger from './pages/UploadDragger'
import UploadLarge from './pages/UploadLarge'
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
            <Route path="/upload/muti">
              <UploadMuti />
            </Route>
            <Route path="/upload/dragger">
              <UploadDragger />
            </Route>
            <Route path="/upload/large">
              <UploadLarge />
            </Route>
            <Route path="/download">
              <UploadSingle />
            </Route>
          </UploadLayout>
        </Switch>
      </BrowserRouter>
    </ConfigProvider>
  )
}

export default App
