class Aria2Client {
  constructor(options) {
    this.options = options
    this.websocket = new WebSocket(`ws://${options.host}:${options.port}/jsonrpc`)

    this.connectPromise = new Promise(resolve => {
      this.websocket.addEventListener('open', () => {
        resolve()
      })
    })
    this.lastId = 1

    this.callbacks = {} // 存放每个请求的回调函数

    this.websocket.addEventListener('message', e => {
      var data = JSON.parse(e.data)
      var callback = this.callbacks[data.id]
      delete this.callbacks[data.id]
      if (typeof callback == 'function') {
        callback(data)
      }
    })
  }
}

[
  "addUri",
  "addTorrent",
  "getPeers",
  "addMetalink",
  "remove",
  "pause",
  "forcePause",
  "pauseAll",
  "forcePauseAll",
  "unpause",
  "unpauseAll",
  "forceRemove",
  "changePosition",
  "tellStatus",
  "getUris",
  "getFiles",
  "getServers",
  "tellActive",
  "tellWaiting",
  "tellStopped",
  "getOption",
  "changeUri",
  "changeOption",
  "getGlobalOption",
  "changeGlobalOption",
  "purgeDownloadResult",
  "removeDownloadResult",
  "getVersion",
  "getSessionInfo",
  "shutdown",
  "forceShutdown",
  "getGlobalStat",
  "saveSession"
].forEach(methodName => {
  Aria2Client.prototype[methodName] = function (...args) {
    return this.connectPromise.then(() => {
      return new Promise((resolve, reject) => {
        var id = this.lastId++
        this.callbacks[id] = function (data) {
          if (data.error) {
            reject(data.error)
          } else {
            resolve(data.result)
          }
        }
        this.websocket.send(JSON.stringify({
          jsonrpc: '2.0',
          id: id,
          method: `aria2.${methodName}`,
          params: [`token:${this.options.secret}`, ...args]
        }))
      })
    })
  }
})

export default Aria2Client;
