import React from 'react'
import { Row, Typography } from 'antd'
import styles from './UploadResult.module.less'

interface UploadResultProps {
  urlList: string[]
}

const UploadResult = ({ urlList }: UploadResultProps) => {
  return (
    <div className={styles.result}>
      <h4>结果：</h4>
      {urlList.map((item) => (
        <Row>
          <Typography.Title level={5}>{item}</Typography.Title>
        </Row>
      ))}
    </div>
  )
}

export default UploadResult
