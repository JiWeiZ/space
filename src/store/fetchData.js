/**
 * execute http request
 * using window.fetch() if supported, ortherwise using XHR
 * @export
 * @param {String} url the request url
 * @param {*} [data={}] data to be send, default {}
 * @param {*} method fetch method, default 'GET'
 * @return {Promise}
 */
import { BASEURL } from './params'

// data属性值只能是string，数字，数组和对象，并且数组和对象的元素都是基本类型
function parseString (data) {
  return Object.entries(data).map(e => {
    if (e[1] instanceof Array) {
      return e[1].map((item, index) => `${e[0]}[${index}]=${item}`).join('&')
    } else if (e[1] instanceof Object) {
      return Object.entries(e[1]).map(item => `${e[0]}[${item[0]}]=${item[1]}`).join('&')
    } else {
      return `${e[0]}=${e[1]}`
    }
  }).join('&')
}

export default async function (url, data = {}, method = 'GET') {
  // 处理字符串
  method = method.toUpperCase()
  if (!(url.startsWith('http://') || url.startsWith('https://'))) {
    url = url.startsWith('/') ? BASEURL + url : BASEURL + '/' + url
  }
  if (method === 'GET') {
    if (Object.keys(data).length) {
      let dataStr = parseString(data)
      url = url + '?' + dataStr
    }
  }

  // use window.fetch() if supported, ortherwise use XHR
  if (window.fetch) {
    let initConfig
    if (method === 'GET') {
      initConfig = {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        cache: 'default'
      }
    } else if (method === 'POST') {
      initConfig = {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify(data)
      }
    } else if (method === 'POST_FD') {
      initConfig = {
        method: 'POST',
        credentials: 'omit',
        // 不要设置Content-Type！
        // headers: {
        //   'Content-Type': 'multipart/form-data'
        // },
        mode: 'cors',
        cache: 'default',
        body: data
      }
    }
    try {
      const res = await fetch(url, initConfig)
      const resJson = res.json()
      return resJson
    } catch (e) {
      throw new Error(e)
    }
  } else {
    // 如果不支持fetch就是用XHR
    return new Promise((resolve, reject) => {
      let xhr, sendData
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest()
      } else {
        xhr = new window.ActiveXObject('Microsoft.XMLHTTP')
      }

      if (method === 'GET') {
        xhr.open('GET', url, true)
        xhr.send(null)
      } else if (method === 'POST') {
        xhr.open('POST', url, true)
        xhr.withCredentials = true
        sendData = JSON.stringify(data)
        xhr.setRequestHeader('Content-type', 'application/json')
        // 不用json也可以
        // sendData = parseString(data)
        // xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencode')
        xhr.send(sendData)
      } else if (method === 'POST_FD') {
        xhr.open('POST', url, true)
        xhr.send(data)
      }

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
            let res = xhr.response
            if (typeof res !== 'object') {
              res = JSON.parse(res)
            }
            resolve(res)
          } else {
            reject(xhr)
          }
        }
      }
    })
  }
}
