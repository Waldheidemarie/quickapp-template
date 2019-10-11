const prompt = require('@system.prompt')
const router = require('@system.router')
const storage = require('@system.storage')
const hook2global = global.__proto__ || global

function queryString(url, query) {
  let str = []
  for (let key in query) {
    str.push(key + '=' + query[key])
  }
  let paramStr = str.join('&')
  return paramStr ? `${url}?${paramStr}` : url
}

function setStorage(key, value) {
  // 设置storage
  storage.set({
    key,
    value: value,
    fail(data, code) {
      console.log(`setStorage fail, code = ${code}`)
    }
  })
}

function getStorage(key) {
  return new Promise((resolve, reject) => {
    // 获取storage
    storage.get({
      key,
      success(data) {
        if (data) {
          resolve(data)
        } else {
          resolve('')
        }
      },
      fail(data, code) {
        console.log(`getStorage fail, code = ${code}`)
        reject({ data, code })
      }
    })
  })
}

export default {
  queryString,
  setStorage,
  getStorage,
  showToast(message = '', duration = 0) {
    if (!message) return
    prompt.showToast({
      message: message,
      duration
    })
  },
  route2theUrl(url, params, clear = false) {
    router.push({
      uri: url,
      params: params
    })
    if (clear) {
      router.clear()
    }
  },
  routeReplacetheUrl(url, params) {
    router.replace({
      uri: url,
      params: params
    })
  },
  setShelfList(list, storage = false) {
    hook2global.$shelfList = list
    if (storage) {
      setStorage('bookshelf', JSON.stringify(list))
    }
  }
}
