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
                  {
                    title: '多文件上传',
                    path: '/upload/muti',
                  },
                  {
                    title: '拖拽上传',
                    path: '/upload/draw',
                  },
                ],
              },
              {
                title: '下载',
                path: '/download',
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
