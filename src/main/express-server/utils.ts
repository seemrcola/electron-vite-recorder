import * as net from 'node:net'

function findAvailablePort(startPort: number, endPort: number, callback: (...arg: any[]) => void) {
  function tryPort(port: number) {
    const server = net.createServer()
    server.unref()
    server.on('error', () => {
      if (port < endPort)
        tryPort(port + 1)
      else
        callback(new Error('No available ports'))
    })
    server.listen(port, () => {
      server.close(() => {
        callback(null, port)
      })
    })
  }

  tryPort(startPort)
}

// 示例用法
// findAvailablePort(3000, 4000, (err, port) => {
//   if (err) {
//     console.error('Error finding available port:', err);
//   } else {
//     console.log('Available port found:', port);
//   }
// });

export {
  findAvailablePort,
}
