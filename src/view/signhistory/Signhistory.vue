
<template>
  <div>

    <warning-bar title="注：这里学生管理" />

    <div class="gva-search-box">
      <!-- 初始版本自动化代码工具 -->
      <el-form ref="autoCodeForm" :rules="rules" :model="form" label-width="120px" :inline="true">
        <el-form-item label="名称" prop="tableName">
          <el-input placeholder="输入搜索条件" />

        </el-form-item>
        <el-form-item label="状态" prop="userName">
          <el-select v-model="value" placeholder="请选择">
            <el-option key="1" value="正常">正常</el-option>
            <el-option key="0" value="停止">停止</el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="search">搜索</el-button>
          <el-button icon="refresh-left">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button size="small" type="primary" icon="plus" @click="addUser">新增学生</el-button>
        <el-button size="small" type="danger" icon="delete" @click="deluser">批量删除</el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="ID"
      >
        <el-table-column type="selection" />
        <el-table-column v-if="false" align="left" label="ID" min-width="100" prop="ID" />
        <el-table-column align="left" label="课程名称" min-width="150" prop="LessonId">
          <template #default="scope">
            <span>{{ GetLessonName(scope.row.LessonId) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="课室名称" min-width="80" prop="ClassRoomId">
          <template #default="scope">
            <span>{{ GetClassRoomName(scope.row.ClassRoomId) }}</span>
          </template>
        </el-table-column>

        <el-table-column align="left" label="班级名称" min-width="150" prop="ClassId" >
          <template #default="scope">
            <span>{{ GetClassName(scope.row.ClassId) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="生成时间" min-width="150" prop="Time" />

        <!--        <el-table-column align="left" label="所属班级" min-width="150" prop="Class" />-->
        <!--        <el-table-column align="left" label="人脸图片" min-width="70" prop="Count" >-->
        <!--          <template #default="scope">-->
        <!--            <img src="@/assets/bona.jpg" style="width: 50px; height: 50px" class="link-icon">-->
        <!--&lt;!&ndash;            <el-image style="width: 100px; height: 100px" src="require('@/assets/video.png')" fit="fill" />&ndash;&gt;-->
        <!--&lt;!&ndash;            <el-img width="100px" height="100px" fit="fill" src="@/assets/dashboard.png"/>&ndash;&gt;-->

        <!--          </template>-->

        <!--        </el-table-column>-->
        <!--        <el-table-column align="left" label="状态" min-width="80" prop="Status" />-->
        <!---->
        <!--        <el-table-column prop="Status" label="状态" align="center" min-width="100">-->
        <!--          <template #default="scope">-->
        <!--              <el-tag-->
        <!--                  :type="scope.row.Status=='正常'?'success':'danger'"-->
        <!--              >-->
        <!--                {{ scope.row.Status }}-->
        <!--              </el-tag>-->

        <!--          </template>-->
        <!--        </el-table-column>-->

        <el-table-column label="操作" min-width="250">

          <template #default="scope">

            <el-button type="text" icon="user" size="small" @click="RouteUser(scope.row)">查看详情</el-button>
            <!--            <el-button type="text" icon="key" size="small" @click="RouteCloud(scope.row)">云变量</el-button>-->
            <!--            <el-button type="text" icon="clock" size="small" @click="ToAddTime(scope.row)">批量加时</el-button>-->
            <el-button type="text" icon="edit" size="small" @click="openEdit(scope.row)">删除</el-button>
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
      :title="'【'+AppInfo.Name+'】管理'"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div style="height:16vh;overflow:auto;padding:0 12px;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="first">
            <el-form ref="userForm" :rules="rules" :model="AppInfo" label-width="120px">

              <el-form-item label="班级名称" prop="Name">
                <el-input v-model="AppInfo.Name" />
              </el-form-item>
              <el-form-item label="是否启用">
                <el-switch
                  v-model="AppInfo.CanUnbind"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
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
  GetClassList,
  GetUserList,
} from '@/api/class'

import ChooseImg from '@/components/chooseImg/index.vue'
import warningBar from '@/components/warningBar/warningBar.vue'

import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { formatTimeToStr } from '@/utils/date.js'
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const tableData = ref([])
const ClassList = ref([])
const ClassRoomList = ref([])
const LessonList = ref([])

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

const GetLessonName = (ID) => {
  for (var i = 0; i < LessonList.value.length; i++) {
    if (LessonList.value[i]['ID'] === ID) {
      return LessonList.value[i]['Name']
    }
  }
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

// 查询
const getTableData = async() => {
  const table = await GetSignHistory({ page: page.value, pageSize: pageSize.value })
  const classlist = await GetClassList({ page: page.value, pageSize: 99 })
  const classroom = await GetClassRoomList({ page: page.value, pageSize: 99 })
  const lessonlist = await GetLessonList({ page: page.value, pageSize: 99 })

  if (table.code === 0) {
    LessonList.value = lessonlist.data.list
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
import { GetClassRoomList, GetLessonList, GetLessonTime, GetSignHistory } from '@/api/lesson'
const router = useRouter()
const RouteCardType = (obj) => {
  router.push({ name: 'cardtype', query: { 'APPID': obj.ID }})
}
const RouteCardList = (obj) => {
  router.push({ name: 'cardlist', query: { 'APPID': obj.ID }})
}
const RouteCloud = (obj) => {
  router.push({ name: 'cloud', query: { 'APPID': obj.ID }})
}
const RouteUser = (obj) => {
  router.push({ name: 'usermanage', query: { 'APPID': obj.ID }})
}

// 加时弹窗相关

const AddTimeInfo = ref({
  Name: '',
  CardType: 0, // 卡类id
  AddType: 0, // 加时模式
  Time: 0,
})

// 弹窗相关
const AppInfo = ref({
  Name: '',
  Version: 0.1,
  App_Mode: '0',
  Update_Address: '',
  Notice: '',
  Unbind_Del: 0,
  Free_Unbind: 0,
  Rsa_Private: '',
  Rsa_Public: '',
  Secret: '',
  VmKey: '',
  ForcedUpdate: 0,
  BindHwid: 1,
  CanUnbind: 0,
  CanRegister: 1,
  CanLogin: 1,
  CheatBan: 0
})

const rules = ref({
  Name: [
    { required: true, message: '请输入班级名称', trigger: 'blur' },
    { min: 1, message: '最低1位字符', trigger: 'blur' },
  ]
})
const userForm = ref(null)

const enterAddTimeDialog = async() => {
  const req = {
    ...AddTimeInfo.value,
  }
  const res = await AddTime(req)
  console.log(AddTimeInfo.value)
  if (res.code === 0) {
    ElMessage({ type: 'success', message: '加时成功' })
    await getTableData()
    closeAddTimeDialog()
  }
}

const enterAddUserDialog = async() => {
  // AppInfo.value.authorityId = App.value.authorityIds[0]
  userForm.value.validate(async valid => {
    if (valid) {
      const req = {
        ...AppInfo.value,
      }
      console.log(AppInfo.value)
      if (dialogFlag.value === 'add') {
        const res = await SetClassInfo(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '创建成功' })
          await getTableData()
          closeAddUserDialog()
        }
      }
      if (dialogFlag.value === 'edit') {
        const res = await SetClassInfo(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '编辑成功' })
          await getTableData()
          closeAddUserDialog()
        }
      }
    }
  })
}

const AddTimeDialog = ref(false)
const addUserDialog = ref(false)
const closeAddTimeDialog = () => {
  userForm.value.resetFields()
  AddTimeDialog.value = false

  AddTimeInfo.value = {
    Name: '',
    CardType: 0,
    AddType: 0,
    Time: 0,
  }
}

const closeAddUserDialog = () => {
  userForm.value.resetFields()
  addUserDialog.value = false
  AppInfo.value = {
    Name: '',
    Version: 0.1,
    App_Mode: '0',
    Update_Address: '',
    Notice: '',
    Unbind_Del: 0,
    Free_Unbind: 0,
    Rsa_Private: '',
    Rsa_Public: '',
    Secret: '',
    ForcedUpdate: 0,
    BindHwid: 1,
    CanUnbind: 1,
    CanRegister: 1,
    CanLogin: 1
  }
}

const dialogFlag = ref('add')

const addUser = () => {
  dialogFlag.value = 'add'
  addUserDialog.value = true
}

const openEdit = (row) => {
  dialogFlag.value = 'edit'
  AppInfo.value = JSON.parse(JSON.stringify(row))
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
