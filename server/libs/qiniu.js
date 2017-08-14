import qiniu from 'qiniu'
import config from '../config'
import { exec } from 'shelljs'

qiniu.conf.ACCESS_KEY = config.qiniu.AK
qiniu.conf.SECRET_KEY = config.qiniu.SK

const bucket = config.qiniu.bucket

const bucketManager = new qiniu.rs.Client()

const uptoken = (key) => new qiniu.rs.PutPolicy(`${bucket}:${key}`).token()

const uploadFile = (uptoken, key, localFile) => new Promise((resolve, reject) => {
  var extra = new qiniu.io.PutExtra()

  qiniu.io.putFile(uptoken, key, localFile, extra, (err, ret) => {
    if(!err) {
      console.log('上传成功')
      resolve()
    }

    reject(err)
  })
})

// 因为七牛抓取互联网资源这个 node SDK 有坑，所以直接用 qshell，所以使用前需要全局安装
// npm i qshell -g
// 然后配置账号
// qshell account -dLG8KAfn4_fmsxZBfeqDgrtyM7e3rIzQezhdxvk wcgqiwkL7QaX5Bz8OtyJEfLuAFb_qCrqFg_eNbW0
const fetchImage = async (url, key) => new Promise((resolve, reject) => {
  let bash = `qshell fetch '${url}' ${bucket} '${key}'`

  // let child = exec(bash, { async: true })
  // child.stdout.on('data', data => {
  //   resolve(data)
  // })

  exec(bash, (code, stdout, stderr) => {
    if (stderr) return reject(stderr)
    if (stdout === 'Fetch error, 504 , xreqid:') return reject(stdout)

    resolve(stdout)
  })
})

const getImage = (url, key) => new Promise((resolve, reject) => {
  let bash = `qshell fetch '${url}' ${bucket} '${key}'`
  console.log('bash', bash)
  exec(bash, (code, stdout, stderr) => {
    if (stderr) return reject(stderr)
    if (stdout === 'Fetch error, 504 , xreqid:') return reject(stderr)
    resolve(stdout)
  })
})

export default {
  getImage,
  fetchImage,
  uptoken,
  uploadFile
}
