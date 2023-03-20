import express = require('express');
import path = require('path');
import bodyParser = require('body-parser');
import fs = require("fs")
import multer = require('multer')
const fse = require("fs-extra");
const util = require("util");
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);

const port = 3001;
const ALLOW_ORIGIN_LIST = ['http://localhost.meetwhale.com:3000', 'http://localhost:3000'];
const defaultPath = './upload/';
const BASIC_URL = `http://localhost:${port}/`
const uploadDir = path.join(__dirname, defaultPath);
const tmpDir = path.join(__dirname, "tmp"); // 临时目录
const IGNORES = [".DS_Store"]; // 忽略的文件列表

const app: express.Application = express();

const baseConfig = {
  dest: uploadDir,
  limits: {
    files: 9
  }
}

const upload = multer(baseConfig)

const uploadLarge = multer({
  ...baseConfig,
  limits: {
    ...baseConfig.limits,
    fieldSize: 2 * 1024 * 1024
  }
})

app.use(upload.any()) // any表示任意类型的文件
app.use(express.static(path.join(__dirname, defaultPath)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all('*', function (req, res, next) {
  if (ALLOW_ORIGIN_LIST.includes(req.headers.origin || '')) {
    res.header('Access-Control-Allow-Origin', req.headers.origin); // 当允许携带cookies此处的白名单不能写’*’
    res.header('Access-Control-Allow-Headers', 'content-type,Content-Length, Authorization,Origin,Accept,X-Requested-With'); // 允许的请求头
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT'); // 允许的请求方法
    res.header('Access-Control-Allow-Credentials', 'true');
  }
  next();
});

app.post('/upload', upload.single('file'), (req: any, res) => {
  const responseList = req.files.map((file: any) => {
    let oldName = file.path;
    let newName = file.path + path.parse(file.originalname).ext;
    fs.renameSync(oldName, newName);
    return BASIC_URL + path.basename(newName);
  })
  res.send({
    responseList,
    code: 200
  })
})

app.post('/upload/large', uploadLarge.single('file'), (req: any, res) => {
  const {originalname, filename} = req?.files?.[0] || {}
  const [md5, targetIndex] = originalname.split('-')
  const oldPath = path.resolve(__dirname, uploadDir, filename)
  const newPath = path.resolve(__dirname, uploadDir, md5, targetIndex)
  dirExists(path.resolve(__dirname, uploadDir, md5)).then((exists: any) => {
    fse.move(oldPath, newPath, (err: any) => {
      if (err) {
        res.send({
          data: err,
          message: '上传失败',
          code: 0
        })
      } else {
        res.send({
          data: req.files,
          message: '上传成功',
          code: 1
        })
      }
    })
  })
})

app.get('/upload/exists', async (req: any, res: any) => {
  const { name: fileName, md5: fileMd5 } = req.query;
  const filePath = path.join(uploadDir, fileName);
  const isExists = await fse.pathExists(filePath);
  if (isExists) {
    res.send({
      status: "success",
      data: {
        isExists: true,
        url: `http://localhost:3000/${fileName}`,
      },
    })
  } else {
    let chunkIds = [];
    const chunksPath = path.join(tmpDir, fileMd5);
    const hasChunksPath = await fse.pathExists(chunksPath);
    if (hasChunksPath) {
      let files = await readdir(chunksPath);
      chunkIds = files.filter((file: any) => {
        return IGNORES.indexOf(file) === -1;
      });
    }
    res.send({
      status: "success",
      data: {
        isExists: false,
        chunkIds,
      },
    })
  }
})

app.post('/upload/concatFiles', async (req: any, res) => {
  const { name: fileName, md5: fileMd5 } = req.body;
  await concatFiles(
    path.join(uploadDir, fileMd5),
    path.join(uploadDir, fileName)
  );
  res.send({
    status: "success",
    data: {
      url: `http://localhost:3001/${fileName}`,
    },
  })
})

async function concatFiles(sourceDir: string, targetPath: string) {
  const readFile = (file: any, ws: any) =>
    new Promise((resolve, reject) => {
      fs.createReadStream(file)
        .on("data", (data) => ws.write(data))
        .on("end", resolve)
        .on("error", reject);
    });
  const files = await readdir(sourceDir);
  const sortedFiles = files
    .filter((file: any) => {
      return IGNORES.indexOf(file) === -1;
    })
    .sort((a: any, b: any) => a - b);
  const writeStream = fs.createWriteStream(targetPath);
  for (const file of sortedFiles) {
    let filePath = path.join(sourceDir, file);
    await readFile(filePath, writeStream);
    await unlink(filePath); // 删除已合并的分块
  }
  await fs.rmdirSync(sourceDir)
  writeStream.end();
}

app.use((error: Error, req: any, res: any, next: Function) => {
  res.json({
    code: 10001,
    error
  })
})

app.listen(port, function () {
  console.info(`listening on port ${port}!`);
});

module.exports = app;

function mkdir(dir: string) {
  return new Promise((resolve, reject) => {
    fse.mkdir(dir, (err: any) => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    })
  })
}

function getStat(path: string) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        resolve(false);
      } else {
        resolve(stats);
      }
    })
  })
}


async function dirExists(dir: string) {
  let isExists = await getStat(dir) as false | fs.Stats;
  //如果该路径且不是文件，返回true
  if (isExists && isExists.isDirectory()) {
    return true;
  } else if (isExists) {
    //如果该路径存在但是文件，返回false
    return false;
  }
  //如果该路径不存在，拿到上级路径
  let tempDir = path.parse(dir).dir;
  //递归判断，如果上级目录也不存在，则会代码会在此处继续循环执行，直到目录存在
  let status = await dirExists(tempDir);
  let mkdirStatus;
  if (status) {
    mkdirStatus = await mkdir(dir);
  }
  return mkdirStatus;
}

function copyFile(sourcePath: string, targetPath: string){
  let rs = fs.createReadStream(sourcePath)
  let ws = fs.createWriteStream(targetPath)
  
  rs.pipe(ws)
}