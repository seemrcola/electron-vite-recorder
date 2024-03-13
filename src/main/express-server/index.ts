import express from 'express'
import cors from 'cors'
import * as api from './utils'

import { useFrame } from './routes/useFrame'

function setupApp() {
  return new Promise((resolve, reject) => {
    const app = express()

    app.use(cors())

    // 用于解析 application/x-www-form-urlencoded post请求的请求体 x=1&y=2
    app.use(express.urlencoded({ extended: true }))
    // 用于解析 application/json post请求的请求体 {"x":1,"y":2}
    app.use(express.json())
    // 静态资源目录
    app.use(express.static('public'))

    // hello world
    app.get('/', (req, res) => {
      res.send('Hello World!')
    })

    // routes
    useFrame(app)

    // 启动服务
    api.findAvailablePort(3000, 5000, (err: Error, port: number) => {
      if (err)
        reject(err)

      app.listen(port, () => {
        console.log('Server started at port:', port)
        resolve(port)
      })
    })
  })
}

export {
  setupApp,
}
