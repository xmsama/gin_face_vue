import service from '@/utils/request'
export const GetLessonTime = (data) => {
  return service({
    url: '/GetLessonTime',
    method: 'post',
    data: data
  })
}
export const SetLessonTime = (data) => {
  return service({
    url: '/SetLessonTime',
    method: 'post',
    data: data
  })
}
export const DelLessonTime = (data) => {
  return service({
    url: '/DelLessonTime',
    method: 'post',
    data: data
  })
}
export const GetLessonList = (data) => {
  return service({
    url: '/GetLessonList',
    method: 'post',
    data: data
  })
}

export const SetLessonInfo = (data) => {
  return service({
    url: '/SetLessonInfo',
    method: 'post',
    data: data
  })
}
export const DelLesson = (data) => {
  return service({
    url: '/DelLesson',
    method: 'post',
    data: data
  })
}





export const GetClassRoomList = (data) => {
  return service({
    url: '/GetClassRoomList',
    method: 'post',
    data: data
  })
}

export const SetClassRoom = (data) => {
  return service({
    url: '/SetClassRoom',
    method: 'post',
    data: data
  })
}
export const DelClassRoom = (data) => {
  return service({
    url: '/DelClassRoom',
    method: 'post',
    data: data
  })
}
export const GetSignHistory = (data) => {
  return service({
    url: '/GetSignHistory',
    method: 'post',
    data: data
  })
}

export const GetSignInfo = (data) => {
  return service({
    url: '/GetSignInfo',
    method: 'post',
    data: data
  })
}
export const DelSignInfo = (data) => {
  return service({
    url: '/DelSignInfo',
    method: 'post',
    data: data
  })
}

