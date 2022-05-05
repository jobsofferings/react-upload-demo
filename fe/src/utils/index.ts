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
