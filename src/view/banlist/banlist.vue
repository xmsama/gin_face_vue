
<template>
  <div>


    <warning-bar title="注：这是个ban机表" />

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
        <el-button size="small" type="primary" icon="plus" @click="addUser">新增软件</el-button>
        <el-button size="small" type="danger" icon="delete" @click="deluser">批量删除</el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="ID"
      >
        <el-table-column type="selection" />
        <el-table-column v-if="false" align="left" label="ID" min-width="100" prop="ID" />
        <el-table-column align="left" label="名称" min-width="100" prop="Name" />

        <el-table-column align="left" label="app_key" min-width="150" prop="App_Key" />
        <el-table-column align="left" label="版本号" min-width="60" prop="Version" />
        <el-table-column prop="Status" label="状态" align="center" min-width="80">

          <template #default="scope">
            <el-dropdown>
              <el-button
                :type="scope.row.Status=='1'?'success':scope.row.Status=='0'?'danger':scope.row.Status=='0'?'danger':'success'"
              >
                {{ Statu(scope.row.Status) }}
              </el-button>

              <template #dropdown>
                <el-dropdown-menu class="dropdown-group">
                  <el-dropdown-item>正常</el-dropdown-item>
                  <el-dropdown-item>不正常</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="250">

          <template #default="scope">
            <el-button type="text" icon="edit" size="small" @click="openEdit(scope.row)">删除</el-button>

            <el-dropdown>

              <el-button style="margin-top:5px" type="text" icon="delete" size="small">删除</el-button>

              <template #dropdown>
                <el-dropdown-menu class="dropdown-group">
                  <el-dropdown-item>个人信息</el-dropdown-item>
                  <el-dropdown-item>登 出</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
  getAppList,
  SetAppInfo,

} from '@/api/class'

import CustomPic from '@/components/customPic/index.vue'
import ChooseImg from '@/components/chooseImg/index.vue'
import warningBar from '@/components/warningBar/warningBar.vue'
import { setUserInfo, resetPassword } from '@/api/user.js'

import { nextTick, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const KeyMode = ref('')
const path = ref(import.meta.env.VITE_BASE_API)
// 初始化相关
const setAuthorityOptions = (AuthorityData, optionsData) => {
  AuthorityData &&
  AuthorityData.forEach(item => {
    if (item.children && item.children.length) {
      const option = {
        authorityId: item.authorityId,
        authorityName: item.authorityName,
        children: [],
      }
      setAuthorityOptions(item.children, option.children)
      optionsData.push(option)
    } else {
      const option = {
        authorityId: item.authorityId,
        authorityName: item.authorityName,
      }
      optionsData.push(option)
    }
  })
}
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
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

// 查询
const getTableData = async() => {
  const table = await getAppList({ page: page.value, pageSize: pageSize.value })
  if (table.code === 0) {

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

const resetPasswordFunc = (row) => {
  ElMessageBox.confirm(
    '是否将此用户密码重置为123456?',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  ).then(async() => {
    const res = await resetPassword({
      ID: row.ID,
    })
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: res.msg,
      })
    } else {
      ElMessage({
        type: 'error',
        message: res.msg,
      })
    }
  })
}
import { useRouter } from 'vue-router'
const router = useRouter()
const RouteCardType = (obj) => {
  router.push({ name: 'cardtype', query: { 'APPID': obj.ID }})
}
const RouteCardList = (obj) => {
  router.push({ name: 'cardlist', query: { 'APPID': obj.ID }})
}
const RouteCloud= (obj) => {
  router.push({ name: 'cloud', query: { 'APPID': obj.ID }})
}
const RouteUser= (obj) => {
  router.push({ name: 'usermanage', query: { 'APPID': obj.ID }})
}

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
  Aes_Key: '',
  ForcedUpdate: 0,
  BindHwid: 1,
  CanUnbind: 0,
  CanRegister: 1,
  CanLogin: 1,
  CheatBan: 0
})

const rules = ref({
  Name: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 1, message: '最低1位字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入用户密码', trigger: 'blur' },
    { min: 6, message: '最低6位字符', trigger: 'blur' },
  ],
  nickName: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
  ],
  authorityId: [
    { required: true, message: '请选择用户角色', trigger: 'blur' },
  ],
})
const userForm = ref(null)
const enterAddUserDialog = async() => {
  // AppInfo.value.authorityId = App.value.authorityIds[0]
  userForm.value.validate(async valid => {
    if (valid) {
      const req = {
        ...AppInfo.value,
      }
      console.log(AppInfo.value)
      if (dialogFlag.value === 'add') {
        const res = await SetAppInfo(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '创建成功' })
          await getTableData()
          closeAddUserDialog()
        }
      }
      if (dialogFlag.value === 'edit') {
        const res = await SetAppInfo(req)
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
    Aes_Key: '',
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
const changeAuthority = async(row, flag) => {
  if (flag) {
    return
  }

  await nextTick()
  const res = await setUserAuthorities({
    ID: row.ID,
    authorityIds: row.authorityIds,
  })
  if (res.code === 0) {
    ElMessage({ type: 'success', message: '角色设置成功' })
  }
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
