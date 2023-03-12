<template>
  <div>
    <warning-bar title="注：这里是卡类" />
    <!--    <div class="gva-search-box">-->
    <!--      &lt;!&ndash; 初始版本自动化代码工具 &ndash;&gt;-->
    <!--      <el-form ref="autoCodeForm" :rules="rules" :model="form" label-width="120px" :inline="true">-->
    <!--        <el-form-item label="名称" prop="tableName">-->
    <!--          <el-input placeholder="输入名称" />-->
    <!--        </el-form-item>-->
    <!--        <el-form-item>-->
    <!--          <el-button type="primary" icon="search">搜索</el-button>-->
    <!--          <el-button icon="refresh-left">重置</el-button>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--    </div>-->
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button size="small" type="primary" icon="plus" @click="addUser">新增卡类</el-button>
        <el-button size="small" type="danger" icon="delete" @click="deluser">批量删除</el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="ID"
      >
        <el-table-column type="selection" />
        <el-table-column v-if="false" align="left" label="ID" min-width="150" prop="ID" />
        <el-table-column v-if="false" align="left" label="APP_ID" min-width="150" prop="APP_ID" />
        <el-table-column align="left" label="卡名称" min-width="150" prop="Name" />
        <el-table-column align="left" label="前缀" min-width="150" prop="Prefix" />
        <el-table-column align="left" label="小时数(四舍五入)" min-width="180" prop="Time">
          <template #default="scope">
            <span>{{ Math.ceil(scope.row.Time/3600) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="价格" min-width="200" prop="Price" />
        <el-table-column align="left" label="卡等级" min-width="200" prop="Level" />
        <el-table-column align="left" label="所属软件" min-width="180">
          <template #default="scope">
            <span>{{ Appname.Name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="250" fixed="right">
          <template #default="scope">

            <el-button type="text" icon="edit" size="small" @click="openEdit(scope.row)">编辑</el-button>
            <el-popover v-model:visible="scope.row.visible" placement="top" width="160">
              <p>删除会将本卡类的所有卡密删除 确定吗?</p>
              <div style="text-align: right; margin-top: 8px;">
                <el-button size="small" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="small" @click="deleteUserFunc(scope.row)">确定</el-button>
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
      :title="'【'+CardTypeInfo.Name+'】卡类管理'"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div style="height:35vh;overflow:auto;padding:0 12px;">

          <el-form ref="userForm" :rules="rules" :model="CardTypeInfo" label-width="120px">
            <el-form-item label="卡名称" style="margin-top:20px">
              <el-input v-model="CardTypeInfo.Name" />
            </el-form-item>
            <el-form-item label="卡等级">
              <el-input v-model="CardTypeInfo.Level" />
            </el-form-item>
            <el-form-item label="前缀">
              <el-input v-model="CardTypeInfo.Prefix" />
            </el-form-item>
            <el-row>
              <el-col :span="14">
                <el-form-item label="时间(秒)">
                  <el-input v-model="CardTypeInfo.Time" />
                </el-form-item>
              </el-col>
            <el-col :span="10">
              &nbsp;
              <el-button size="small" @click="CardTypeInfo.Time+=3600">1小时</el-button>
              <el-button size="small" @click="CardTypeInfo.Time+=86400">1天</el-button>
              <el-button size="small" @click="CardTypeInfo.Time+=604800">1周</el-button>
              <el-button size="small" @click="CardTypeInfo.Time=0">归零</el-button>
            </el-col>

          </el-row>
          <el-form-item label="价格">
            <el-input-number v-model="CardTypeInfo.Price" :step="0.1" />
          </el-form-item>
          <el-divider></el-divider>
          <warning-bar title="注: 解绑遵循卡类开关若开启 则解绑规则会跟随此卡类解绑规则 否则跟随APP解绑规则(默认跟随APP解绑规则)" />
          <!--这里有后端特殊性 所以开是0 不开是1-->
          <el-form-item label="解绑遵循卡类">
            <el-switch
              v-model="CardTypeInfo.FollowApp"
              :active-value="0"
              :inactive-value="1"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />

          </el-form-item>

          <el-row v-show="!CardTypeInfo.FollowApp">
            <el-col :span="14">
              <el-form-item label="解绑扣除" prop="email">
                <el-input v-model="CardTypeInfo.Unbind_Del" />
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-button size="small" @click="CardTypeInfo.Unbind_Del+=3600">1小时</el-button>
              <el-button size="small" @click="CardTypeInfo.Unbind_Del+=86400">1天</el-button>
              <el-button size="small" @click="CardTypeInfo.Unbind_Del+=604800">1周</el-button>
              <el-button size="small" @click="CardTypeInfo.Unbind_Del=0">归零</el-button>
            </el-col>
          </el-row>

          <el-form-item v-show="!CardTypeInfo.FollowApp" label="免费解绑次数(天)">

            <el-input v-model="CardTypeInfo.Free_Unbind" />
            <warning-bar title="解绑次数填0即无限解绑" />
          </el-form-item>


          <el-divider></el-divider>

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
    }
  },
}
</script>

<script setup>

import {
  getCardTypeList,
  deleteCardType
} from '@/api/Card'

import ChooseImg from '@/components/chooseImg/index.vue'
import warningBar from '@/components/warningBar/warningBar.vue'
import { setCardTypeInfo } from '@/api/Card.js'
import { getAppName } from '@/api/class'
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const queryappid = parseInt(router.currentRoute.value.query.APPID)
const Appname = ref('')

// 初始化相关

const page = ref(1)
const total = ref(0)
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
  const table = await getCardTypeList({ page: page.value, pageSize: pageSize.value, APP_ID: queryappid })
  Appname.value = await getAppName({ APP_ID: queryappid })

  if (table.code === 0) {
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

const deleteUserFunc = async(row) => {
  ElMessage({ type: 'warning', message: '删除时间较久 请耐心等待' })
  const res = await deleteCardType({ id: row.ID })
  if (res.code === 0) {
    ElMessage.success('删除成功')
    row.visible = false
    await getTableData()
  }
}

// 弹窗相关
const CardTypeInfo = ref({
  Name: '',
  Prefix: '',
  APP_ID: '',
  Price: '1.0',
  Time: 0,
  Unbind_Del: 0,
  Free_Unbind: 0,
  FollowApp: 1,
  Level: 0
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
        ...CardTypeInfo.value,
        APP_ID: queryappid
      }
      if (dialogFlag.value === 'add') {
        const res = await setCardTypeInfo(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '创建成功' })

          await getTableData()
          closeAddUserDialog()
        }
      }
      if (dialogFlag.value === 'edit') {
        const res = await setCardTypeInfo(req)
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
  CardTypeInfo.value = {
    Name: '',
    Prefix: '',
    APP_ID: '',
    Price: '1.0',
    Time: 0,
    Unbind_Del: 0,
    Free_Unbind: 0,
    FollowApp: 1,
    Level:0

  }
}

const dialogFlag = ref('add')

const addUser = () => {
  dialogFlag.value = 'add'
  addUserDialog.value = true
}

const openEdit = (row) => {
  dialogFlag.value = 'edit'
  CardTypeInfo.value = JSON.parse(JSON.stringify(row))
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
