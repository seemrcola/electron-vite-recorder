// 如下是一个简单的express实现
// 官网：https://expressjs.com/
const http = require('node:http')
const url = require('node:url')

const RESTFUL_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']

function createApplication() {
  // app其实就是一个监听函数
  const app = (req, res) => {
    // 获取请求的方法
    const requestMethod = req.method.toUpperCase()
    // 获取请求的路径
    const { pathname } = url.parse(req.url, true)

    // next
    let index = 0
    function next(error) {
      // 如果有错误，那么就直接跳过所有的中间件和路由，直接到错误处理中间件
      if (error) {
        const errorMiddleware = app.findErrorMiddleware(app)
        if (!errorMiddleware)
          return res.end('Oops 500!! Server Error!!')

        return errorMiddleware(error, req, res, next)
      }
      // 如果没有错误，那么就继续执行中间件和路由
      const layer = app.routes[index++]
      // 如果index大于了app.routes的长度，那么就说明没有匹配到任何中间件和路由，那么就返回404
      if (!layer)
        return res.end('Oops 404!! Not Found!!')

      // 如果是中间件
      if (layer.method === 'MIDDLEWARE') {
        // 如果是中间件，那么就需要判断路径是否匹配
        if (layer.matchMiddleware(pathname))
          layer.handler(req, res, next)
        else
          next()
      }
      // 如果是路由
      else {
        // 如果是路由
        if (layer.matchMethod(requestMethod) && layer.matchPath(pathname))
          layer.handler(req, res)
        else
          next()
      }
    }

    // 启动next函数
    next()
  }

  app.routes = []

  // 为app添加请求方法
  RESTFUL_METHODS.forEach((method) => {
    app[method.toLowerCase()] = function (path, handler) {
      const layer = {
        method,
        path,
        handler,
        ...extraMethods,
      }
      app.routes.push(layer)
    }
  })

  // 为app添加all方法
  app.all = function (path, handler) {
    const layer = {
      method: 'ALL',
      path,
      handler,
      ...extraMethods,
    }
    app.routes.push(layer)
  }

  app.use = function (path, handler) {
    // 如果没有传递path，那么默认为'/'
    if (typeof handler !== 'function') {
      handler = path
      path = '/'
    }
    const layer = {
      method: 'MIDDLEWARE',
      path,
      handler,
      ...extraMethods,
    }
    app.routes.push(layer)
  }

  app.listen = (...args) => {
    const server = http.createServer(app)
    server.listen(...args)
  }

  return app
}

// 增强一个matchMethod方法
function matchMethod(requestMethod) {
  return this.method === requestMethod || this.method === 'ALL'
}
// 增强一个matchPath方法
function matchPath(pathname) {
  return this.path === pathname || this.path === '*'
}
// 增强一个matchMiddleware方法
function matchMiddleware(pathname) {
  return this.path === '/' || this.path === pathname || this.path === '*'
}
// 增强一个findErrorMiddleware方法
function findErrorMiddleware(app) {
  for (let i = 0; i < app.routes.length; i++) {
    const layer = app.routes[i]
    if (layer.method === 'MIDDLEWARE' && layer.handler.length === 4)
      return layer.handler
  }
}
const extraMethods = {
  matchMethod,
  matchPath,
  matchMiddleware,
  findErrorMiddleware,
}

module.exports = createApplication

/**
 * 总结：
 * 1. 本质上express就是一个监听函数，当你访问一个路由时，就会执行这个监听函数
 * 2. express的核心就是中间件，路由和错误处理中间件
 * 3. express的中间件和路由都是一个对象，这个对象上有method，path，handler等属性
 *
 * 这是一个简单实现，并且可以优化，比如无需将extraMethods挂载到每一个中间件和路由上，可以直接挂载到app上/错误处理也可以继续传递等等
 * 不过这个简单实现已经足够理解express的核心了
 */
