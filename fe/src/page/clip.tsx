import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const Clip = () => {
  const [fileList, setFileList] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file, index) => {
      formData.append('file.' + index, file);
    });
    setUploading(true)
    fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(() => {
        setFileList([])
        message.success('upload successfully.');
      })
      .catch(() => {
        message.error('upload failed.');
      })
      .finally(() => {
        setUploading(false)
      });
  };

  const onRemove = (file: any) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList)
  }

  const beforeUpload = (file: any) => {
    setFileList([...fileList, file])
    return false;
  }

  return (
    <>
      <Upload
        fileList={fileList}
        onRemove={onRemove}
        beforeUpload={beforeUpload}
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
      <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? 'Uploading' : 'Start Upload'}
      </Button>
    </>
  );
}

export default Clip;