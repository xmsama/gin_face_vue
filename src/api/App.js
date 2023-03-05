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
export const getAppName = (data) => {
  return service({
    url: '/getAppName',
    method: 'post',
    data: data
  })
}




