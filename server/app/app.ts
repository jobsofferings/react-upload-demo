import express = require('express');
import path = require('path');
import bodyParser = require('body-parser');
import fs = require("fs")
import multer = require('multer')

const port = 3001;
const ALLOW_ORIGIN_LIST = ['http://localhost.meetwhale.com:3000'];
const defaultPath = './upload/';
const BASIC_URL = `http://localhost:${port}/`
const uploadDir = path.join(__dirname, defaultPath);

const app: express.Application = express();

const upload = multer({
  dest: uploadDir,
  limits: {
    files: 9,
    fieldSize: 2 * 1024 * 1024 // 2 MB
  }
})

app.use(upload.any()) // any表示任意类型的文件
app.use(express.static(path.join(__dirname, defaultPath)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.all('*', function (req, res, next) {
  console.log(req.headers.origin);
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
    console.log(file.path);
    let oldName = file.path;
    let newName = file.path + path.parse(file.originalname).ext;
    fs.renameSync(oldName, newName);
    return BASIC_URL + path.basename(newName);
  })
  console.log(responseList);
  res.send({
    responseList,
    code: 200
  })
})

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