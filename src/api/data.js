import request from '@/utils/request'

export function get(url, params) {
  return request({
    url: url,
    method: 'get',
    params
  })
}

export function add(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function add_header(url, data, config) {
  return request({
    url: url,
    method: 'post',
    data: data,
    headers: config
  })
}

export function retrieve(url, id) {
  return request({
    url: url + id + '/',
    method: 'get'
  })
}

export function del(url, id) {
  return request({
    url: url + id + '/',
    method: 'delete'
  })
}

export function edit(url, id, data) {
  return request({
    url: url + id + '/',
    method: 'put',
    data
  })
}

export function edit_header(url, id, data, config) {
  return request({
    url: url + id + '/',
    method: 'patch',
    data: data,
    headers: config
  })
}

export function imp(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}

export function log(url, id) {
  return request({
    url: url + id + '/',
    method: 'get'
  })
}
