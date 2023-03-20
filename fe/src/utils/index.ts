import SparkMD5 from 'spark-md5'

export const checkImgExists = (imgurl: string) => {
  return new Promise(function (resolve, reject) {
    var ImgObj = new Image()
    ImgObj.src = imgurl
    ImgObj.onload = function (res) {
      resolve(res)
    }
    ImgObj.onerror = function (err) {
      reject(err)
    }
  })
}

const allowPictureExt = ['jpg', 'png', 'jpeg']

export const checkImgExistsByExt = (url: string) => {
  const index = url.lastIndexOf('.')
  const ext = url.substring(index + 1)
  return allowPictureExt.includes(ext)
}

export const calcFileMD5 = (file: File) => {
  return new Promise((resolve, reject) => {
    let chunkSize = 2097152, // 2M
      chunks = Math.ceil(file.size / chunkSize),
      currentChunk = 0,
      spark = new SparkMD5.ArrayBuffer(),
      fileReader = new FileReader()

    fileReader.onload = (e: any) => {
      spark.append(e.target.result)
      currentChunk++
      if (currentChunk < chunks) {
        loadNext()
      } else {
        resolve(spark.end())
      }
    }

    fileReader.onerror = (e) => {
      reject(fileReader.error)
    }

    function loadNext() {
      let start = currentChunk * chunkSize,
        end = start + chunkSize >= file.size ? file.size : start + chunkSize
      fileReader.readAsArrayBuffer(file.slice(start, end))
    }
    loadNext()
  })
}

export function asyncPool(
  poolLimit: number,
  array: any[],
  iteratorFn: Function,
) {
  let i = 0
  const ret: Promise<any>[] = [] // 存储所有的异步任务
  const executing: Promise<any>[] = [] // 存储正在执行的异步任务
  const enqueue: any = function () {
    if (i === array.length) {
      return Promise.resolve()
    }
    const item = array[i++] // 获取新的任务项
    const p = Promise.resolve().then(() => iteratorFn(item, array))
    ret.push(p)

    let r = Promise.resolve()

    // 当poolLimit值小于或等于总任务个数时，进行并发控制
    if (poolLimit <= array.length) {
      // 当任务完成后，从正在执行的任务数组中移除已完成的任务
      const e: Promise<any> = p.then(() =>
        executing.splice(executing.indexOf(e), 1),
      )
      executing.push(e)
      if (executing.length >= poolLimit) {
        r = Promise.race(executing)
      }
    }

    // 正在执行任务列表 中较快的任务执行完成之后，才会从array数组中获取新的待办任务
    return r.then(() => enqueue())
  }
  return enqueue().then(() => Promise.all(ret))
}

export function checkFileExist(url: string, name: string, md5: any) {
  return fetch(`${url}?name=${name}&md5=${md5}`, {
    method: 'GET',
  }).then((res) => res.json())
}
