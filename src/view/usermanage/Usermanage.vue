<template>
  <div>
    <warning-bar title="注：目前只实现了查看功能" />
    <div class="gva-search-box">
      <!-- 初始版本自动化代码工具 -->
      <el-form ref="autoCodeForm" :rules="rules" :model="form" label-width="120px" :inline="true">

        <!--        <el-form-item   label="状态" prop="userName">-->
        <!--          <el-select v-model="value"  placeholder="请选择">-->
        <!--            <el-option key="1" value="正常">正常</el-option>-->
        <!--            <el-option key="0" value="封号">封号</el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item label="用户名">
          <el-input v-model="SearchList.Account" placeholder="输入用户名" />
        </el-form-item>
        <el-form-item label="登录时间小于">
          <el-date-picker
            v-model="SearchList.LoginTime"
            type="datetime"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item label="到期时间大于">
          <el-date-picker
            v-model="SearchList.ExpTime"
            type="datetime"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="SearchHandle">搜索</el-button>
          <el-button icon="refresh-left" @click="ResetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button size="small" type="primary" :disabled="true" icon="plus" @click="addUser">新增用户</el-button>
        <el-button size="small" type="danger" icon="delete" @click="deluser">批量删除</el-button>

        <el-popover placement="top" width="160">
          <p>确定要删除所有过期用户吗</p>
          <div style="text-align: right; margin-top: 8px;">
            <el-button size="small" type="text">取消</el-button>
            <el-button type="primary" size="small" @click="deloutuser">确定</el-button>
          </div>
          <template #reference>
            <el-button size="small" type="danger" icon="delete">删除所有过期用户</el-button>

          </template>
        </el-popover>
      </div>
      <el-table
        :data="tableData"
        row-key="ID"
      >
        <el-table-column type="selection" />
        <el-table-column v-if="false" align="left" label="ID" min-width="150" prop="ID" />
        <el-table-column align="left" label="用户名" min-width="200" prop="Account" />
        <el-table-column align="left" label="登陆时间" min-width="150">
          <template #default="scope">
            <span>{{ formatTimeToStr(scope.row.LoginTime*1000) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="登录ip" min-width="180" prop="LoginIp" />
        <el-table-column align="left" label="到期时间" min-width="180">
          <template #default="scope">
            <span>{{ formatTimeToStr(scope.row.ExpTime*1000) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="机器码" min-width="200" prop="Hwid" />
        <el-table-column align="left" label="状态" min-width="200" prop="Status">
          <template #default="scope">
            <el-button
              :type="GetColor(scope.row.Status)"
            >
              {{ GetState(scope.row.Status) }}
            </el-button>

          </template>
        </el-table-column>
        <el-table-column align="left" label="所属软件" min-width="180">
          <template #default="scope">
            <span>{{ (GetName(scope.row.APP_ID)) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="250">
          <template #default="scope">

            <el-button type="text" icon="edit" size="small" @click="openEdit(scope.row)">编辑</el-button>
            <el-popover v-model:visible="scope.row.visible" placement="top" width="160">
              <p>确定要删除此用户吗</p>
              <div style="text-align: right; margin-top: 8px;">
                <el-button size="small" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="small" @click="deleteUserFunc(scope.row)">确定</el-button>
              </div>
              <template #reference>
                <el-button type="text" icon="delete" size="small">删除</el-button>
              </template>
            </el-popover>
            <el-button type="text" icon="circle-close" size="small" @click="ToBanHwid(scope.row)">Ban机器码</el-button>
            <!--            <el-button type="text" icon="magic-stick" size="small" @click="resetPasswordFunc(scope.row)">重置密码</el-button>-->
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
      v-model="BanHwidDialog"
      title="输入一下Ban机理由"
      custom-class="user-dialog"
      width="30%"
    >
      <el-input v-model="BanReason" placeholder="请输入内容" />
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" type="primary" @click="CBanHwid">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="addUserDialog"
      custom-class="user-dialog"
      title="用户"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div style="height:35vh;overflow:auto;padding:0 12px;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="用户管理" name="first">
            <el-form ref="userForm" :rules="rules" :model="userInfo" label-width="80px">

              <el-form-item label="用户名" prop="Account">
                <el-input v-model="userInfo.Account" disabled="true" />
              </el-form-item>
              <el-form-item label="登录密码">
                <el-input v-model="userInfo.Password" />
              </el-form-item>
              <el-form-item label="预留字段1">
                <el-input v-model="userInfo.Param_1" />
              </el-form-item>
              <el-form-item label="预留字段2">
                <el-input v-model="userInfo.Param_2" />
              </el-form-item>
              <el-form-item label="预留字段3">
                <el-input v-model="userInfo.Param_3" />
              </el-form-item>

            </el-form>
          </el-tab-pane>
          <el-tab-pane label="附加信息" name="second">
            <el-form ref="userForm" :rules="rules" :model="userInfo" label-width="80px">
              <el-form-item label="解绑时间">
                <el-date-picker
                  v-model="userInfo.UnbindTime"
                  type="datetime"
                  placeholder="选择最后一次解绑的时间"
                />
              </el-form-item>
              <el-form-item label="机器码" placeholder="请输入机器码">
                <el-input v-model="userInfo.Hwid" />
              </el-form-item>
              <el-form-item label="到期时间">
                <el-date-picker
                  v-model="userInfo.ExpTime"
                  type="datetime"
                  placeholder="选择到期时间"
                />
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="userInfo.Status" placeholder="请选择">
                  <el-option :key="1" label="正常" :value="1">正常</el-option>
                  <el-option :key="0" label="封号" :value="0">封号</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="封禁理由" prop="email">
                <el-input v-model="userInfo.BanReason" type="textarea" />
              </el-form-item>

            </el-form>
          </el-tab-pane>

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
      value: ''
    }
  }
}
</script>

<script setup>

import {
  getUserList,
  register,
  deleteUser, DelExpUser,
} from '@/api/user'

import warningBar from '@/components/warningBar/warningBar.vue'
import { setUserInfo, resetPassword, BanHwid } from '@/api/user.js'
import { formatTimeToStr } from '@/utils/date'
import { nextTick, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAppList } from '../../api/class'
const path = ref(import.meta.env.VITE_BASE_API)
const app_list = ref([])

import { useRouter } from 'vue-router'
import { getCardList } from '@/api/Card'
const router = useRouter()
const queryappid = parseInt(router.currentRoute.value.query.APPID)

// 初始化相关
const js1 = ref([])

const listSelect = ref([])
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const BanHwidname = ref('')
const BanHwidDialog = ref(false)
const BanReason = ref('')
// 删除所有过期用户函数
const deloutuser = async() => {
  const res = await DelExpUser({ APP_ID: queryappid })
  if (res.code === 0) {
    ElMessage.success(res.msg)
    await getTableData()
  } else {
    ElMessage.error(res.msg)
  }
}

const SearchList = ref({
  Account: '',
  LoginTime: '',
  ExpTime: ''
})

const extend = (destination, source) => {
  for (var property in source) { destination[property] = source[property] }
  return destination
}
const SearchHandle = async() => {
  // SearchList.value.ExpTime = new Date(SearchList.value.ExpTime).getTime() / 1000
  // SearchList.value.LoginTime = new Date(SearchList.value.LoginTime).getTime() / 1000
  js1.value = { page: page.value, pageSize: pageSize.value, APP_ID: queryappid, Account: SearchList.value.Account,
    ExpTime__gte: new Date(SearchList.value.ExpTime).getTime() / 1000, LoginTime__lte: new Date(SearchList.value.LoginTime).getTime() / 1000 }
  // extend(js1, SearchList.value)
  // console.log(js1)
  const table = await getUserList(js1.value)
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

const ResetSearch = () => {
  SearchList.value = {
    Account: '',
    LoginTime: '',
    ExpTime: ''
  }
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

const GetName = (val) => {
  for (let i = 0; i < app_list.value.length; i++) {
    if (app_list.value[i].ID === val) {
      return app_list.value[i].Name
    }
  }
}
// 查询
const getTableData = async() => {
  if (js1.value != '') {
    await SearchHandle()
    return
  }
  const table = await getUserList({ page: page.value, pageSize: pageSize.value, APP_ID: queryappid })
  const App_list = await getAppList()
  app_list.value = App_list

  app_list.value = app_list.value.data.list

  if (table.code === 0) {
    console.log(table.data.list)
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

const initPage = async() => {
  getTableData()
}

initPage()

const ToBanHwid = async(row) => {
  if (row.Hwid == '') {
    ElMessage({
      type: 'error',
      message: '请勿Ban空机器码',
    })
  } else {
    BanHwidname.value = row.Hwid
    BanHwidDialog.value = true
  //   const res = await BanHwid({
  //     Hwid: row.Hwid,
  //   })
  //   ElMessage({
  //     type: 'success',
  //     message: res.msg,
  //   })
  }
}

const CBanHwid = async() => {
  const res = await BanHwid({
    Hwid: BanHwidname.value,
    Reason: BanReason.value
  })

  if (res.code === 0) {
    ElMessage({
      type: 'success',
      message: res.msg,
    })
  }

  BanReason.value = ''
  BanHwidDialog.value = false
}

const GetColor = (val) => {
  if (val === 0) { return 'danger' } else if (val === 1) { return 'success' } else if (val === 2) { return 'warning' }
}
const GetState = (val) => {
  if (val === 0) { return '封卡' } else if (val === 1) { return '正常' } else if (val === 2) { return '冻结' }
}

const deleteUserFunc = async(row) => {
  const res = await deleteUser({ Account: row.Account, APP_ID: queryappid })
  if (res.code === 0) {
    ElMessage.success('删除成功')
    row.visible = false
    await getTableData()
  }
}

// 弹窗相关
const userInfo = ref({
  username: '',
  password: '',
  Param_1: '',
  Param_2: '',
  Param_3: '',
  LoginTime: '',
  Status: 0,
  Hwid: '',
  ExpTime: 0,
  UnbindTime: 0,
  BanReason: ''

})

const rules = ref({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, message: '最低5位字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入用户密码', trigger: 'blur' },
    { min: 6, message: '最低6位字符', trigger: 'blur' }
  ],
  nickName: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' }
  ],
  authorityId: [
    { required: true, message: '请选择用户角色', trigger: 'blur' }
  ]
})
const userForm = ref(null)
const enterAddUserDialog = async() => {
  userInfo.value.ExpTime = new Date(userInfo.value.ExpTime).getTime() / 1000
  userForm.value.validate(async valid => {
    if (valid) {
      const req = {
        ...userInfo.value
      }
      if (dialogFlag.value === 'add') {
        const res = await register(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '创建成功' })
          await getTableData()
          closeAddUserDialog()
        }
      }
      if (dialogFlag.value === 'edit') {
        const res = await setUserInfo(req)
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
}

const dialogFlag = ref('add')

const addUser = () => {
  dialogFlag.value = 'add'
  addUserDialog.value = true
}

const openEdit = (row) => {
  dialogFlag.value = 'edit'
  userInfo.value = JSON.parse(JSON.stringify(row))
  userInfo.value.ExpTime = userInfo.value.ExpTime * 1000
  // console.log(userInfo.value)
  addUserDialog.value = true
}

</script>

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
.nickName{
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.pointer{
  cursor: pointer;
  font-size: 16px;
  margin-left: 2px;
}
</style>
