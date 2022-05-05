import React from 'react'
import { checkImgExistsByExt } from '@/utils'
import styles from './UploadResult.module.less'

interface UploadResultProps {
  urlList: string[]
}

const UploadResult = ({ urlList }: UploadResultProps) => {
  return (
    <div className={styles.result}>
      <h4>结果：</h4>
      {urlList
        .filter((item) => checkImgExistsByExt(item))
        .map((item) => (
          <img src={item} alt={item} key={item} />
        ))}
    </div>
  )
}

export default UploadResult
