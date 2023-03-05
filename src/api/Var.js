import service from '@/utils/request'

export const GetVarList = (data) => {
  return service({
    url: '/GetVarList',
    method: 'post',
    data: data
  })
}
export const SetVarInfo = (data) => {
  return service({
    url: '/SetVarInfo',
    method: 'post',
    data: data
  })
}
export const deleteVar = (data) => {
  return service({
    url: '/deleteVar',
    method: 'post',
    data: data
  })
}



