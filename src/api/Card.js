import service from '@/utils/request'

// @Tags User
// @Summary 分页获取用户列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body modelInterface.PageInfo true "分页获取用户列表"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /user/getUserList [post]
export const setCardTypeInfo = (data) => {
  return service({
    url: '/setCardTypeInfo',
    method: 'post',
    data: data,
  })
}
export const getCardTypeList = (data) => {
  return service({
    url: '/getCardTypeList',
    method: 'post',
    data: data,
  })
}
export const deleteCardType = (data) => {
  return service({
    url: '/deleteCardType',
    method: 'post',
    data: data,
  })
}






export const getCardList = (data) => {
  return service({
    url: '/getCardList',
    method: 'post',
    data: data,
  })
}

export const deleteCard = (data) => {
  return service({
    url: '/deleteCard',
    method: 'post',
    data: data,
  })
}

export const BanCard = (data) => {
  return service({
    url: '/BanCard',
    method: 'post',
    data: data,
  })
}

export const setCardList = (data) => {
  return service({
    url: '/setCardList',
    method: 'post',
    data: data,
  })
}

export const reqAddTime = (data) => {
  return service({
    url: '/reqAddTime',
    method: 'post',
    data: data,
  })
}


export const FreezeTime = (data) => {
  return service({
    url: '/reqFreezeTime',
    method: 'post',
    data: data,
  })
}
export const UnFreezeTime = (data) => {
  return service({
    url: '/reqUnFreezeTime',
    method: 'post',
    data: data,
  })
}

export const OnlineStatus = (header,data) => {
  return service({
    url: '/OnlineStatus',
    headers: header,
    method: 'post',
    data: data,
  })
}

