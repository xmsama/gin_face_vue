import service from '@/utils/request'



// @Tags User
// @Summary 分页获取用户列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body modelInterface.PageInfo true "分页获取用户列表"
// @Success 200 {string} json "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /user/getUserList [post]
export const SetClassInfo = (data) => {
  return service({
    url: '/SetClassInfo',
    method: 'post',
    data: data
  })
}
export const AddTime = (data) => {
  return service({
    url: '/AddTime',
    method: 'post',
    data: data
  })
}

export const GetClassList = (data) => {
  return service({
    url: '/GetClassList',
    method: 'post',
    data: data
  })
}



export const GetUserList = (data) => {
  return service({
    url: '/GetUserList',
    method: 'post',
    data: data
  })
}
export const DelClass = (data) => {
  return service({
    url: '/DelClass',
    method: 'post',
    data: data
  })
}
export const SetUserInfo = (data) => {
  return service({
    url: '/SetUserInfo',
    method: 'post',
    data: data
  })
}
export const DelUser = (data) => {
  return service({
    url: '/DelUser',
    method: 'post',
    data: data
  })
}

