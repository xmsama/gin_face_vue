
<template>
  <div>

    <warning-bar title="注：这里学生管理" />

    <div class="gva-search-box">
      <!-- 初始版本自动化代码工具 -->
      <el-form ref="autoCodeForm" :rules="rules" :model="form" label-width="120px" :inline="true">
        <el-form-item label="学生名称" prop="tableName">
          <el-input v-model="SearchList.username" placeholder="输入搜索条件" />
        </el-form-item>
        <el-form-item label="班级名称" prop="tableName">
          <el-select v-model="SearchList.userclass" placeholder="请选择">
            <el-option
              v-for="item in ClassList"
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
        <el-button size="small" type="primary" icon="plus" @click="addUser">新增学生</el-button>
        <!--        <el-button size="small" type="danger" icon="delete" @click="deluser">批量删除</el-button>-->
      </div>
      <el-table
        :data="tableData"
        row-key="ID"
      >
        <el-table-column type="selection" />
        <el-table-column v-if="false" align="left" label="ID" min-width="100" prop="ID" />
        <el-table-column align="left" label="姓名" min-width="100" prop="Name" />

        <el-table-column align="left" label="所属班级" min-width="150" prop="Class" />

        <el-table-column align="left" label="人脸图片" min-width="70" prop="Image">
          <template #default="scope">
            <img :src="scope.row.Image" style="width: 65px; height: 75px" class="link-icon">
            <!--            <el-image style="width: 100px; height: 100px" src="require('@/assets/video.png')" fit="fill" />-->
            <!--            <el-img width="100px" height="100px" fit="fill" src="@/assets/dashboard.png"/>-->

          </template>

        </el-table-column>
        <el-table-column align="left" label="更新时间" min-width="80" prop="Time" />
        <!--        <el-table-column align="left" label="状态" min-width="80" prop="Status" />-->
        <!---->
        <el-table-column prop="Status" label="状态" align="center" min-width="100">
          <template #default="scope">
            <el-tag
              :type="scope.row.Status=='已生成人脸数据'?'success':'danger'"
            >
              {{ scope.row.Status }}
            </el-tag>

          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="250">

          <template #default="scope">

            <el-button type="text" icon="user" size="small" @click="RouteUser(scope.row)">手动更新人脸数据</el-button>
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
      :title="'【'+UserInfo.Name+'】学生管理'"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div style="height:40vh;overflow:auto;padding:0 12px;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="first">
            <el-form ref="userForm" :rules="rules" :model="UserInfo" label-width="120px">

              <el-form-item label="学生名称" prop="Name">
                <el-input v-model="UserInfo.Name" />
              </el-form-item>
              <el-form-item label="所属班级">
                <el-select v-model="UserInfo.ClassId" placeholder="请选择">
                  <el-option
                    v-for="item in ClassList"
                    :key="item.ID"
                    :label="item.Name"
                    :value="item.ID"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="上传照片">
                <el-upload
                  ref="uploadRef"
                  v-model:file-list="fileList"
                  class="upload-demo"
                  action="http://localhost:8887/api/Upload"
                  :on-preview="handlePreview"

                  :data="uploadData"
                  :auto-upload="false"
                  :on-change="handleChange"
                  :on-remove="handleRemove"
                  list-type="picture"
                >
                  <el-button type="primary">点击上传</el-button>
                  <template #tip>
                    <div class="el-upload__tip">
                      格式为jpg/png 且小于1M
                    </div>
                  </template>
                </el-upload>
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
  GetUserList,
  GetClassList,
  SetUserInfo, DelClass, DelUser,
} from '@/api/class'

import warningBar from '@/components/warningBar/warningBar.vue'

import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatTimeToStr } from '@/utils/date.js'
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const tableData = ref([])
const ClassList = ref([])
const uploadRef = ref(null)

const uploadData = ref({
  Name: '',
  ClassId: ''
})

const SearchList = ref({
  userclass: '',
  username: ''
})

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

const Delete = async(obj) => {
  ElMessageBox.confirm(
    '是否删除当前学生？',
    'Warning',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(async() => {
      // 后端业务处理
      const resp = await DelUser({ ID: obj.ID })
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
const ResetSearch = () => {
  SearchList.value = {
    userclass: '',
    username: ''
  }
}
// 查询
const getTableData = async() => {
  const table = await GetUserList({ page: page.value, pageSize: pageSize.value, ...SearchList.value })
  const classlist = await GetClassList({ page: page.value, pageSize: 99 })
  if (table.code === 0) {
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
const router = useRouter()
const ImageB64 = ref('')
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

// 弹窗相关
const UserInfo = ref({
  Name: '',
  ClassId: ''

})

const rules = ref({
  Name: [
    { required: true, message: '请输入学生名称', trigger: 'blur' },
    { min: 1, message: '最低1位字符', trigger: 'blur' },
  ]
})
const userForm = ref(null)

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file.raw)
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = (error) => {
      reject(error)
    }
  })
}

const handleChange = async(file) => {
  const b64 = await getBase64(file)
  ImageB64.value = b64
  // console.log(b64)
  // 在这里可以使用b64.value来获取base64编码
}

const enterAddUserDialog = async() => {
  console.log(uploadRef.value.uploadFiles[0])

  userForm.value.validate(async valid => {
    if (valid) {
      const req = {
        ...UserInfo.value,
        'Image': ImageB64.value
      }

      if (dialogFlag.value === 'add') {
        const res = await SetUserInfo(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '创建成功' })
          await getTableData()
          closeAddUserDialog()
        }
      }
      if (dialogFlag.value === 'edit') {
        const res = await SetUserInfo(req)
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
  UserInfo.value = {
    Name: '',
    ClassId: ''
  }
  ImageB64.value = ''
}

const dialogFlag = ref('add')

const addUser = () => {
  dialogFlag.value = 'add'
  addUserDialog.value = true
  uploadRef.value.clearFiles()
}

const openEdit = (row) => {
  dialogFlag.value = 'edit'
  UserInfo.value = JSON.parse(JSON.stringify(row))
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
