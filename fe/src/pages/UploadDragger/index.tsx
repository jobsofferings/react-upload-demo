import React, { useState } from 'react'
import { Upload, Button, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import UploadResult from '../UploadResult'

const { Dragger } = Upload

const UploadDragger = () => {
  const [fileList, setFileList] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<string[]>([])

  const handleUpload = () => {
    const formData = new FormData()
    fileList.forEach((file, index) => {
      formData.append('file.' + index, file)
    })
    setUploading(true)
    fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        setFileList([])
        setResult(res?.responseList || [])
        message.success('upload successfully.')
      })
      .catch(() => {
        message.error('upload failed.')
      })
      .finally(() => {
        setUploading(false)
      })
  }

  const onRemove = (file: any) => {
    const index = fileList.indexOf(file)
    const newFileList = fileList.slice()
    newFileList.splice(index, 1)
    setFileList(newFileList)
  }

  const beforeUpload = (_: File, fileList: File[]) => {
    setFileList(fileList)
    return false
  }

  return (
    <>
      <h2>拖拽上传</h2>
      <Dragger
        style={{ width: '100%', height: '200px !important' }}
        fileList={fileList}
        onRemove={onRemove}
        beforeUpload={beforeUpload}
        maxCount={9}
        multiple
      >
        <Button icon={<UploadOutlined />}>拖拽上传</Button>
      </Dragger>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? '上传中' : '开始上传'}
      </Button>
      <UploadResult urlList={result} />
    </>
  )
}

export default UploadDragger
