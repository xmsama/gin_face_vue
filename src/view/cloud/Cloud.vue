<template>
  <div>
    <warning-bar title="注：这里是卡类" />
    <div class="gva-search-box">
      <!-- 初始版本自动化代码工具 -->
      <el-form ref="autoCodeForm" :rules="rules" :model="form" label-width="120px" :inline="true">
        <el-form-item label="所属软件" prop="structName">
          <el-select v-model="searchapp" :disabled="dialogFlag != 'add'" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="tableName">
          <el-input placeholder="输入名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search">搜索</el-button>
          <el-button icon="refresh-left">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button size="small" type="primary" icon="plus" @click="addUser">新增变量</el-button>
        <el-popover placement="top" width="160">
          <p>确定要批量删除变量吗</p>
          <div style="text-align: right; margin-top: 8px;">
            <el-button size="small" type="text">取消</el-button>
            <el-button type="primary" size="small" @click="delvar">确定</el-button>
          </div>
          <template #reference>
            <el-button size="small" type="danger" icon="delete">批量删除</el-button>-->

          </template>
        </el-popover>
      </div>
      <el-table
        :data="tableData"
        row-key="ID"
        @selection-change="selectL"
      >
        <el-table-column type="selection" />
        <el-table-column v-if="false" align="left" label="ID" min-width="150" prop="ID" />
        <el-table-column v-if="false" align="left" label="APP_ID" min-width="150" prop="APP_ID" />
        <el-table-column align="left" label="键值" min-width="150" prop="Key" />
        <el-table-column align="left" label="数据" min-width="150" prop="Value" />
        <el-table-column align="left" label="所属软件" min-width="180">
          <template #default="scope">
            <span>{{ (GetName(scope.row.APP_ID)) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="250" fixed="right">
          <template #default="scope">

            <el-button type="text" icon="edit" size="small" @click="openEdit(scope.row)">编辑</el-button>
            <el-popover v-model:visible="scope.row.visible" placement="top" width="160">
              <p>确定要删除此变量吗</p>
              <div style="text-align: right; margin-top: 8px;">
                <el-button size="small" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="small" @click="deleteVarFunc(scope.row)">确定</el-button>
              </div>
              <template #reference>
                <el-button type="text" icon="delete" size="small">删除</el-button>
              </template>
            </el-popover>

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
      :title="'【'+VarInfo.Key+'】变量管理'"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div style="height:15vh;overflow:auto;padding:0 12px;">

        <el-form ref="userForm" :rules="rules" :model="VarInfo" label-width="80px">


          <el-form-item label="变量" style="margin-top: 20px">
            <el-input v-model="VarInfo.Key" />
          </el-form-item>
          <el-form-item label="数据" prop="">
            <el-input v-model="VarInfo.Value" type="textarea" />
          </el-form-item>
        </el-form>

      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="closeAddUserDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="enterAddUserDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <ChooseImg ref="chooseImg" :target="userInfo" :target-key="`headerImg`" />
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
      num: 100,
    }
  }
}
</script>

<script setup>

import {
  GetVarList,
  SetVarInfo,
  deleteVar
} from '@/api/Var'

import { getAuthorityList } from '@/api/authority'
import CustomPic from '@/components/customPic/index.vue'
import ChooseImg from '@/components/chooseImg/index.vue'
import warningBar from '@/components/warningBar/warningBar.vue'
import { getAppList } from '@/api/App'
import { nextTick, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const queryappid=parseInt(router.currentRoute.value.query.APPID)

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
const app_list = ref([])
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const listSelect = ref([])

const GetName = (val) => {
  for (let i = 0; i < app_list.value.data.list.length; i++) {
    if (app_list.value.data.list[i].ID === val) {
      return app_list.value.data.list[i].Name
    }
  }
}

const selectL = (selection, row) => {
  listSelect.value = selection
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

const delVar = async() => {
  if (listSelect.value.length < 1) {
    ElMessage({ type: 'error', message: '未选中卡密' })
    return
  }
  const req = {
    ...listSelect.value,
  }
  console.log(listSelect.value)
  const res = await deleteCard(req)
  if (res.code === 0) {
    ElMessage({ type: 'success', message: res.msg })
    await getTableData()
  }
}

// 查询
const getTableData = async() => {
  const table = await GetVarList({ page: page.value, pageSize: pageSize.value , APP_ID: queryappid })
  const App_list = await getAppList()
  app_list.value = App_list
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

watch(tableData, () => {
  setAuthorityIds()
})

const initPage = async() => {
  getTableData()
 // const res = await getAuthorityList({ page: 1, pageSize: 999 })
  // setOptions(res.data.list)`
}

initPage()

const setAuthorityIds = () => {
  tableData.value && tableData.value.forEach((user) => {
    const authorityIds = user.authorities && user.authorities.map(i => {
      return i.authorityId
    })
    user.authorityIds = authorityIds
  })
}

const chooseImg = ref(null)
const openHeaderChange = () => {
  chooseImg.value.open()
}

const authOptions = ref([])
const setOptions = (authData) => {
  authOptions.value = []
  setAuthorityOptions(authData, authOptions.value)
}

const deleteVarFunc = async(row) => {
  const res = await deleteVar({ id: row.ID })
  if (res.code === 0) {
    ElMessage.success('删除成功')
    row.visible = false
    await getTableData()
  }
}

// 弹窗相关
const VarInfo = ref({
  Key: '',
  Value: '',
  APP_ID: ''

})

const rules = ref({
//   userName: [
//     { required: true, message: '请输入用户名', trigger: 'blur' },
//     { min: 5, message: '最低5位字符', trigger: 'blur' },
//   ],
//   password: [
//     { required: true, message: '请输入用户密码', trigger: 'blur' },
//     { min: 6, message: '最低6位字符', trigger: 'blur' },
//   ],
//   nickName: [
//     { required: true, message: '请输入用户昵称', trigger: 'blur' },
//   ],
//   authorityId: [
//     { required: true, message: '请选择用户角色', trigger: 'blur' },
//   ],
}
)
const userForm = ref(null)
const enterAddUserDialog = async() => {
  userForm.value.validate(async valid => {
    if (valid) {
      const req = {
        ...VarInfo.value,
        APP_ID: queryappid
      }
      if (dialogFlag.value === 'add') {
        const res = await SetVarInfo(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '创建成功' })
          await getTableData()
          closeAddUserDialog()
        }
      }
      if (dialogFlag.value === 'edit') {
        const res = await SetVarInfo(req)
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
  VarInfo.value = {
    Key: '',
    Value: '',
    APP_ID: '',

  }
}

const dialogFlag = ref('add')

const addUser = () => {
  dialogFlag.value = 'add'
  addUserDialog.value = true
}

const openEdit = (row) => {
  dialogFlag.value = 'edit'
  VarInfo.value = JSON.parse(JSON.stringify(row))
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
