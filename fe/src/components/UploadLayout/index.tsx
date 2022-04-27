import React from 'react'
import { Layout } from 'antd'
import BaseMenu from '@/components/BaseMenu'
import './index.less'

interface UploadLayout {}

const UploadLayout: React.FunctionComponent<UploadLayout> = ({ children }) => {
  return (
    <Layout>
      <div className="upload-sider">
        <Layout.Sider>
          <BaseMenu
            menuProps={{
              inlineCollapsed: true,
              mode: 'inline',
            }}
            menuConfig={[
              {
                title: '上传',
                path: '/upload',
                children: [
                  {
                    title: '单文件上传',
                    path: '/upload/single',
                  },
                ],
              },
            ]}
          />
        </Layout.Sider>
      </div>
      <Layout.Content id="upload-layout-content">{children}</Layout.Content>
    </Layout>
  )
}

export default UploadLayout
