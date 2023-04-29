
<template>
  <div>

    <warning-bar title="注：这里课程管理" />

    <div class="gva-search-box">
      <!-- 初始版本自动化代码工具 -->
      <el-form ref="autoCodeForm" :rules="rules" :model="form" label-width="120px" :inline="true">
        <el-form-item label="课程名称" prop="tableName">
          <el-input v-model="SearchList.name"  placeholder="输入搜索条件" />

        </el-form-item>
        <el-form-item label="上课班级" prop="tableName">
          <el-select v-model="SearchList.classid" placeholder="请选择">
            <el-option
              v-for="item in ClassList"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上课课室" prop="tableName">
          <el-select v-model="SearchList.classroomid" placeholder="请选择">
            <el-option
              v-for="item in ClassRoomList"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="search" @click="getTableData">搜索</el-button>
          <el-button icon="refresh-left" @click="ResetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button size="small" type="primary" icon="plus" @click="addUser">新增课程</el-button>
        <!--        <el-button size="small" type="danger" icon="delete" @click="deluser">批量删除</el-button>-->
      </div>
      <el-table
        :data="tableData"
        row-key="ID"
      >
        <el-table-column type="selection" />
        <el-table-column v-if="false" align="left" label="ID" min-width="100" prop="ID" />
        <el-table-column align="left" label="课程名称" min-width="120" prop="Name" />
        <el-table-column align="left" label="所属班级" min-width="150" prop="ClassId">
          <template #default="scope">
            <span>{{ GetClassName(scope.row.ClassId) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="上课教室" min-width="80" prop="ClassRoomId">
          <template #default="scope">
            <span>{{ GetClassRoomName(scope.row.ClassRoomId) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="上课时间" min-width="80" prop="TimeId">
          <template #default="scope">
            <span>{{ GetTimeName(scope.row.TimeId) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="250">

          <template #default="scope">

            <!--            <el-button type="text" icon="user" size="small" @click="RouteUser(scope.row)">查看照片</el-button>-->
            <!--            <el-button type="text" icon="key" size="small" @click="RouteCloud(scope.row)">云变量</el-button>-->
            <!--            <el-button type="text" icon="clock" size="small" @click="ToAddTime(scope.row)">批量加时</el-button>-->
            <el-button type="text" icon="edit" size="small" @click="openEdit(scope.row)">编辑</el-button>
            <el-button type="text" icon="edit" size="small" @click="Delete(scope.row)">删除</el-button>
          &nbsp;
            <!--            <el-dropdown>-->

            <!--              <el-button style="margin-top:5px" type="text" icon="delete" size="small">删除</el-button>-->

            <!--              <template #dropdown>-->
            <!--                <el-dropdown-menu class="dropdown-group">-->
            <!--                  <el-dropdown-item>个人信息</el-dropdown-item>-->
            <!--                  <el-dropdown-item>登 出</el-dropdown-item>-->
            <!--                </el-dropdown-menu>-->
            <!--              </template>-->
            <!--            </el-dropdown>-->
          </template>

        </el-table-column>

      </el-table>

      <div class="gva-pagination">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10, 30, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <el-dialog
      v-model="addUserDialog"
      custom-class="user-dialog"
      :title="'【'+LessonInfo.Name+'】课程管理'"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div style="height:30vh;overflow:auto;padding:0 12px;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="first">
            <el-form ref="userForm" :rules="rules" :model="LessonInfo" label-width="120px">

              <el-form-item label="课程名称" prop="Name">
                <el-input v-model="LessonInfo.Name" />
              </el-form-item>
              <el-form-item label="所属班级">
                <el-select v-model="LessonInfo.ClassId" placeholder="请选择">
                  <el-option
                    v-for="item in ClassList"
                    :key="item.ID"
                    :label="item.Name"
                    :value="item.ID"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="所属教室">
                <el-select v-model="LessonInfo.ClassRoomId" placeholder="请选择">
                  <el-option
                    v-for="item in ClassRoomList"
                    :key="item.ID"
                    :label="item.Name"
                    :value="item.ID"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="所属时间">
                <el-select v-model="LessonInfo.TimeId" placeholder="请选择">
                  <el-option
                    v-for="item in TimeList"
                    :key="item.ID"
                    :label="item.Name"
                    :value="item.ID"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <!--          <el-tab-pane label="额外设置" name="fourth">-->
          <!--            <el-form ref="userForm" label-position="right" :rules="rules" :model="AppInfo" label-width="150px">-->
          <!--              <el-form-item label="是否启用">-->
          <!--                <el-switch-->
          <!--                  v-model="AppInfo.CanUnbind"-->
          <!--                  :active-value="1"-->
          <!--                  :inactive-value="0"-->
          <!--                  active-color="#13ce66"-->
          <!--                  inactive-color="#ff4949"-->
          <!--                />-->
          <!--              </el-form-item>-->
          <!--              <el-form-item label="是否可以登录">-->
          <!--                <el-switch-->
          <!--                  v-model="AppInfo.CanLogin"-->
          <!--                  :active-value="1"-->
          <!--                  :inactive-value="0"-->
          <!--                  active-color="#13ce66"-->
          <!--                  inactive-color="#ff4949"-->
          <!--                />-->
          <!--              </el-form-item>-->
          <!--              <el-form-item label="修改通讯封号">-->
          <!--                <el-switch-->
          <!--                  v-model="AppInfo.CheatBan"-->
          <!--                  :active-value="1"-->
          <!--                  :inactive-value="0"-->
          <!--                  active-color="#13ce66"-->
          <!--                  inactive-color="#ff4949"-->
          <!--                />-->

          <!--              </el-form-item>-->
          <!--              <warning-bar title="修改通信封号为测试功能 可能不稳定" />-->
          <!--            </el-form>-->
          <!--          </el-tab-pane>-->

        </el-tabs>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="closeAddUserDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="enterAddUserDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'first',
      options: [{
        value: '选项1',
        label: '黄金糕',
      }, {
        value: '选项2',
        label: '双皮奶',
      }, {
        value: '选项3',
        label: '蚵仔煎',
      }, {
        value: '选项4',
        label: '龙须面',
      }, {
        value: '选项5',
        label: '北京烤鸭',
      }],
      searchapp: '',
      value: '',
      modevalue: '',
    }
  },
  methods: {
    Statu(value) {
      return value ? '正常' : '停用'
    },
    Mode(value) {
      return '芜湖'
    },

  },
}
</script>

<script setup>

import {
  DelClass,
  GetClassList,
  GetUserList,
} from '@/api/class'

import ChooseImg from '@/components/chooseImg/index.vue'
import warningBar from '@/components/warningBar/warningBar.vue'

import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatTimeToStr } from '@/utils/date.js'
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const ClassList = ref([])
const ClassRoomList = ref([])
const TimeList = ref([])

const tableData = ref([])
// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}
const SearchList = ref({
  name: '',
  classid: '',
  classroomid: ''
})

const ResetSearch = () => {
  SearchList.value = {
    name: '',
    classid: '',
    classroomid: ''
  }
}

// 查询
const getTableData = async() => {
  const table = await GetLessonList({ page: page.value, pageSize: pageSize.value, ...SearchList.value })
  const classlist = await GetClassList({ page: page.value, pageSize: 99 })
  const classroom = await GetClassRoomList({ page: page.value, pageSize: 99 })
  const timelist = await GetLessonTime({ page: page.value, pageSize: 99 })
  if (table.code === 0) {
    TimeList.value = timelist.data.list
    ClassRoomList.value = classroom.data.list
    ClassList.value = classlist.data.list
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

const initPage = async() => {
  getTableData()
  // const res = await getAuthorityList({ page: 1, pageSize: 999 })
  // setOptions(res.data.list)
}

initPage()

import { useRouter } from 'vue-router'
import { getCardTypeList } from '@/api/Card'
import { DelLesson, GetClassRoomList, GetLessonList, GetLessonTime, SetLessonInfo } from '@/api/lesson'
const router = useRouter()

const Delete = async(obj) => {
  ElMessageBox.confirm(
    '是否删除当前课程？',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(async() => {
      // 后端业务处理
      const resp = await DelLesson({ ID: obj.ID })
      if (resp.code === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
      }
      getTableData()
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消刪除',
      })
    })
}

const GetClassName = (ID) => {
  for (var i = 0; i < ClassList.value.length; i++) {
    if (ClassList.value[i]['ID'] === ID) {
      return ClassList.value[i]['Name']
    }
  }
}

const GetClassRoomName = (ID) => {
  for (var i = 0; i < ClassRoomList.value.length; i++) {
    if (parseInt(ClassRoomList.value[i]['ID']) === ID) {
      return ClassRoomList.value[i]['Name']
    }
  }
}
const GetTimeName = (ID) => {
  // console.log(ClassList)
  for (var i = 0; i < TimeList.value.length; i++) {
    if (parseInt(TimeList.value[i]['ID']) === ID) {
      return TimeList.value[i]['Name']
    }
  }
}

// 弹窗相关
const LessonInfo = ref({
  Name: '',
  ClassId: '',
  ClassRoomId: '',
  TimeId: ''
})

const rules = ref({
  Name: [
    { required: true, message: '请输入课程名称', trigger: 'blur' },
    { min: 1, message: '最低1位字符', trigger: 'blur' },
  ]
})
const userForm = ref(null)

const enterAddUserDialog = async() => {
  // AppInfo.value.authorityId = App.value.authorityIds[0]
  userForm.value.validate(async valid => {
    if (valid) {
      const req = {
        ...LessonInfo.value,
      }

      if (dialogFlag.value === 'add') {
        const res = await SetLessonInfo(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '创建成功' })
          await getTableData()
          closeAddUserDialog()
        }
      }
      if (dialogFlag.value === 'edit') {
        const res = await SetLessonInfo(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '编辑成功' })
          await getTableData()
          closeAddUserDialog()
        }
      }
    }
  })
}

const addUserDialog = ref(false)

const closeAddUserDialog = () => {
  userForm.value.resetFields()
  addUserDialog.value = false
  LessonInfo.value = {
    Name: '',
    ClassId: '',
    ClassRoomId: '',
    TimeId: ''
  }
}

const dialogFlag = ref('add')

const addUser = () => {
  dialogFlag.value = 'add'
  addUserDialog.value = true
}

const openEdit = (row) => {
  dialogFlag.value = 'edit'
  LessonInfo.value = JSON.parse(JSON.stringify(row))
  console.log(LessonInfo.value)
  addUserDialog.value = true
}

</script>
<style>
.el-dropdown {
  vertical-align: top;
}

.el-dropdown + .el-dropdown {
  margin-left: 15px;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>

<style lang="scss">
.user-dialog {
  .header-img-box {
    width: 200px;
    height: 200px;
    border: 1px dashed #ccc;
    border-radius: 20px;
    text-align: center;
    line-height: 200px;
    cursor: pointer;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}

.nickName {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.pointer {
  cursor: pointer;
  font-size: 16px;
  margin-left: 2px;
}
</style>
