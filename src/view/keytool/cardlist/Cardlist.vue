<template>
  <div>
    <warning-bar title="注：这里是卡密 请勿通过f5直接刷新本页面" />
    <div class="gva-search-box">
      <!-- 初始版本自动化代码工具 -->
      <el-form ref="autoCodeForm" :rules="rules" :model="form" label-width="120px" :inline="true">
        <el-form-item label="卡号">

          <el-input v-model="SearchList.Card" placeholder="请输入卡号"></el-input>

        </el-form-item>
        <el-form-item label="卡类名称">
          <el-select v-model="SearchList.Type_ID"  placeholder="请选择">
            <el-option
                v-for="item in cardtype_list"
                :key="item.ID"
                :label="item.Name"
                :value="item.ID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡密状态">
          <el-select v-model="SearchList.Status" placeholder="请选择">
            <el-option key="0" :value=0 label="未激活">未激活</el-option>
            <el-option key="1" :value=1 label="激活">激活</el-option>
            <el-option key="2" :value=2 label="封卡">封卡</el-option>
            <el-option key="2" :value=3 label="冻结">冻结</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡密备注">

            <el-input v-model="SearchList.Remark" placeholder="请输入备注"></el-input>

        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="SearchHandle">搜索</el-button>
          <el-button icon="refresh-left" @click="ResetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </div>



    <div class="gva-table-box">
      <div class="gva-btn-list">
        <el-button size="small" type="primary" icon="plus" @click="addCard">新增卡密</el-button>
        <el-popover placement="top" width="160">
          <p>确定要批量删除卡密吗</p>
          <div style="text-align: right; margin-top: 8px;">
            <el-button size="small" type="text" >取消</el-button>
            <el-button type="primary" size="small" @click="delCard">确定</el-button>
          </div>
          <template #reference>
            <el-button size="small" type="danger" icon="delete">批量删除</el-button>-->

          </template>
        </el-popover>
        <el-button class="excel-btn" size="small" type="primary" icon="clock" @click="AddTime">批量加时</el-button>
        <el-button class="excel-btn" size="small" type="primary" icon="Moon" @click="ToFreezeTime">批量冻结</el-button>
        <el-button class="excel-btn" size="small" type="primary" icon="Sunrise" @click="ToUnFreezeTime">批量解冻</el-button>
        <el-button class="excel-btn" size="small" type="primary" icon="download" @click="handleExcelExport()">导出</el-button>

      </div>
      <!--导出用表格-->
      <el-table
          v-show="false"
          :data="tableData"
          id="cardlisttable">
        <el-table-column align="left" label="卡密" min-width="150" prop="Card" />
        <el-table-column align="left" label="卡类型" min-width="150">
          <template #default="scope">
            <span>{{ (GetCardType(scope.row.Type_ID)) }}</span>
          </template>
        </el-table-column>
          <el-table-column align="left" label="所属软件" min-width="200">
            <template #default="scope">
              <span>{{ Appname.Name }}</span>
            </template>
          </el-table-column>



      </el-table>

      <el-table
        :data="tableData"
        row-key="ID"

        @selection-change="selectL"
      >
        <el-table-column type="selection" />
        <el-table-column v-if="false" align="left" label="ID"  prop="ID" />
        <el-table-column align="left" label="卡密"  min-width="120" prop="Card" />
        <el-table-column align="left" label="卡类型"   min-width="120" >
          <template #default="scope">
            <span>{{ (GetCardType(scope.row.Type_ID)) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left"   min-width="120" label="使用账号" >
          <template #default="scope">
            <span>测试一下这么长的用户名</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="所属软件"  min-width="130"  >
          <template #default="scope">
            <span>{{  Appname.Name  }}</span>
          </template>
        </el-table-column>
        <el-table-column align="left" label="备注"  prop="Remark"  min-width="120"  />
        <el-table-column align="left" label="状态" >

          <template #default="scope">
            <el-dropdown>
              <el-button
                  :type="GetColor(scope.row.Status)">
                {{ GetState(scope.row.Status) }}
              </el-button>

              <template #dropdown>
                <el-dropdown-menu class="dropdown-group">

                  <el-dropdown-item @click="ToBanCard(scope.row)">封他卡！</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>


          </template>

        </el-table-column>

        <el-table-column label="操作" min-width="250" >
          <template #default="scope">

            <el-button type="text" icon="document" size="small" @click="openEdit(scope.row)">详情</el-button>
            <el-popover v-model:visible="scope.row.visible" placement="top" width="160">
              <p>确定要删除此卡密吗</p>
              <div style="text-align: right; margin-top: 8px;">
                <el-button size="small" type="text" @click="scope.row.visible = false">取消</el-button>
                <el-button type="primary" size="small" @click="deleteCardFunc(scope.row)">确定</el-button>
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
        title="输入一下封卡理由"
        custom-class="user-dialog"
        v-model="BanCardDialog"
        width="30%">
      <el-input v-model="BanReason" placeholder="请输入内容"></el-input>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" type="primary" @click="ABancard">确 定</el-button>
        </div>
      </template>
    </el-dialog>






    <el-dialog
        v-model="addCardDialog"
        custom-class="user-dialog"
        title="新增卡密"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
    >
   <div style="height:35vh;overflow:auto;padding:0 12px;">


    <el-form ref="userForm" :rules="rules" :model="CardTypeInfo" label-width="80px">

      <el-form-item label="所属卡类">
        <el-select v-model="CardList.Type_ID"  placeholder="请选择">
          <el-option
              v-for="item in cardtype_list"
              :key="item.ID"
              :label="item.Name"
              :value="item.ID">
          </el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="总数">
        <el-input-number v-model="CardList.total" :step="1"></el-input-number>
      </el-form-item>
      <el-form-item label="生成用户">
        <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="CardList.GenerateUser"
            active-color="#13ce66"
            inactive-color="#ff4949">
        </el-switch>
      </el-form-item>
      <warning-bar title="注：（仅适用于卡密模式）如果生成用户开关为开 生成卡密同时会生成用户并开始计时 绑定的机器码为空 用户首次登录后绑定机器码" />

      <el-form-item label="备注">
        <el-input type="textarea" :rows="2" v-model="CardList.Remark" />
      </el-form-item>

      <el-form-item label="本次生成卡">
        <el-input type="textarea" disabled="true"  v-model="CardRestult" :rows="4" />
      </el-form-item>


<!--          <el-form-item label="卡名称" prop="nickName">-->
<!--            <el-input v-model="CardTypeInfo.Name"/>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="前缀" prop="nickName">-->
<!--            <el-input v-model="CardTypeInfo.Prefix"/>-->
<!--          </el-form-item>-->
<!--          <el-row>-->
<!--            <el-col :span="14">-->
<!--              <el-form-item label="时间(秒)" prop="email">-->
<!--                <el-input v-model="CardTypeInfo.Time"/>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="10">-->
<!--              &nbsp;-->
<!--              <el-button size="small" @click="CardTypeInfo.Time+=3600">1小时</el-button>-->
<!--              <el-button size="small" @click="CardTypeInfo.Time+=86400">1天</el-button>-->
<!--              <el-button size="small" @click="CardTypeInfo.Time+=604800">1周</el-button>-->
<!--              <el-button size="small" @click="CardTypeInfo.Time=0">归零</el-button>-->
<!--            </el-col>-->
<!--            <warning-bar title="注：时间以秒为单位 四个按钮的时间为参考值 按一次按钮会叠加相应时间 例如一小时是3600 如果你想卡密是两小时卡 那么就是7200 也可以通过点两次按钮实现"/>-->
<!--          </el-row>-->

<!--          <el-form-item label="价格">-->
<!--            <el-input-number v-model="CardTypeInfo.Price" :step="0.1"></el-input-number>-->
<!--          </el-form-item>-->
      </el-form>

     </div>
<!--      v-clipboard:success="onCopy" v-clipboard:error="onError"-->
      <template #footer>
        <div class="dialog-footer">


            <el-button size="small" @click="copyCode(CardRestult)">复制本次生成的卡密</el-button>
          <el-button size="small" @click="closeAddCardDialog">关 闭</el-button>
          <el-button size="small" type="primary" @click="enterAddCardDialog">生 成</el-button>
        </div>
      </template>
    </el-dialog>
























    <el-dialog
      v-model="addUserDialog"
      custom-class="user-dialog"
      title="卡密详情"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div style="height:40vh;overflow:auto;padding:0 12px;">

        <el-table border :data="singlecard" style="width: 100%">
          <!--            <el-table-column align="left" label="卡密" min-width="150" prop="Card" />-->
          <el-table-column label="所属卡类" :width="250">

            <span>{{ (GetCardType(CardListInfo.Type_ID)) }}</span>

          </el-table-column>
          <el-table-column label="所属软件" :width="250">

            <span>{{ Appname.Name }}</span>

          </el-table-column>
          <el-table-column label="卡密" :width="400">

            <span>{{CardListInfo.Card}}</span>
          </el-table-column>
        </el-table>
        <el-table border :data="singlecard" style="width: 100%">
          <!--            <el-table-column align="left" label="卡密" min-width="150" prop="Card" />-->
          <el-table-column label="生成时间" :width="250">

            <el-date-picker
                v-model="CardListInfo.Create_Time"
                type="datetime"
                disabled
                placeholder="选择日期时间">
            </el-date-picker>

          </el-table-column>
          <el-table-column label="充值时间" :width="250">

            <el-date-picker
                v-model="CardListInfo.Use_Time"
                type="datetime"
                disabled
                placeholder="选择日期时间">
            </el-date-picker>

          </el-table-column>
          <el-table-column label="状态" :width="400">

            <span>{{ GetState(CardListInfo.Status) }}</span>

          </el-table-column>
        </el-table>
        <el-table border :data="singlecard" style="width: 100%">
          <!--            <el-table-column align="left" label="卡密" min-width="150" prop="Card" />-->
          <el-table-column label="封禁理由" :width="250">

            <span>{{ CardListInfo.BanReason }}</span>

          </el-table-column>
          <el-table-column label="备注" :width="650">

            <span>{{ CardListInfo.Remark }}</span>

          </el-table-column>
        </el-table>

      </div>

      <template #footer>
        <div class="dialog-footer">

          <el-button size="small" type="primary" @click="enterAddUserDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
        v-model="AddTimeDialog"
        custom-class="user-dialog"
        :title="'【批量加时】'"
        :show-close="false"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
    >
      <div style="height:35vh;overflow:auto;padding:0 12px;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础信息" name="first">
              <el-form ref="userForm" :rules="rules" label-width="120px">
                <el-form-item label="本次操作卡数量">
                  <span>{{ AddTimeCount }}张</span>
                </el-form-item>
                <el-row>
                  <el-col :span="14">
                    <el-form-item label="加时时间" prop="email">
                      <el-input v-model="AddTimeInfo.Time" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    &nbsp;
                    <el-button size="small" @click="AddTimeInfo.Time+=3600">1小时</el-button>
                    <el-button size="small" @click="AddTimeInfo.Time+=86400">1天</el-button>
                    <el-button size="small" @click="AddTimeInfo.Time+=604800">1周</el-button>
                    <el-button size="small" @click="AddTimeInfo.Time=0">归零</el-button>
                  </el-col>

                </el-row>
              </el-form>
            <warning-bar title="注：时间以秒为单位 四个按钮的时间为参考值 按一次按钮会叠加相应时间 例如一小时是3600 如果你想两小时 那么就是7200 也可以通过点两次按钮实现"/>
          </el-tab-pane>
        </el-tabs>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="closeAddTimeDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="enterAddTimeDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import { formatTimeToStr } from '@/utils/date'
import { deleteCard, getCardList, getCardTypeList, setCardList,FreezeTime, UnFreezeTime } from '@/api/Card'
import { ElMessage } from 'element-plus'

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
      searchapp: '123',
      value: '',

    }
  }

}
</script>

<script setup>

import {
  getCardTypeList,
  getCardList,
  setCardList,
  deleteCard,
  BanCard,
  reqAddTime
} from '@/api/Card'

import FileSaver from 'file-saver'
import XLSX from 'xlsx'

import { getAppList, getAppName } from '@/api/App'
import { nextTick, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { exportExcel } from '@/api/excel'
import useClipboard from 'vue-clipboard3'
const AddTimeCount=ref(0)
const {	toClipboard } = useClipboard();
const copyCode=async (val) => {
  try {
    await toClipboard(val)
    ElMessage({ type: 'success', message: "复制成功" })
  } catch (e) {
    alert('该浏览器不支持自动复制')
  }
}

const path = ref(import.meta.env.VITE_BASE_API)
// 初始化相关


const AddTimeDialog=ref(false)


//搜索相关
const SearchTypeList=ref([]) //搜索卡类列表 动态获取
const SearchTypeDis=ref(true) //搜索卡类是否禁用状态
const SearchList = ref({
  Card:'',
  Type_ID:'',
  Status:'',
  Remark:''

}) //初始化搜索表单
//软件改变以后获取卡类
const SearchAppGetType = async(val) => {
  //value 是appid
  SearchTypeDis.value = false;
  SearchTypeList.value=await getCardTypeList({ APP_ID: val })
  SearchTypeList.value=SearchTypeList.value.data.list
}






const addCardDialog = ref(false)
const app_list = ref([])



const js1=ref([])

const listSelect = ref([])

const cardtype_list = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const Bancardid=ref(0)
const tableData = ref([])
const BanReason=ref('')
const singlecard = ref([{ 'id': '123' }])
const Appname = ref('')
import { useRouter } from 'vue-router'
const router = useRouter()
const queryappid=parseInt(router.currentRoute.value.query.APPID)

const extend =(destination, source)=>{
  for (var property in source)
    destination[property] = source[property];
  return destination;
}

const ResetSearch =() => {
  SearchList.value = {
    Card:'',
    Type_ID: '',
    Status: '',
    Remark: ''
  }
}
const SearchHandle = async()  =>
{
  js1.value={ page: page.value, pageSize: pageSize.value,APP_ID:queryappid,
    Card:SearchList.value.Card, Type_ID:SearchList.value.Type_ID,Status:SearchList.value.Status,Remark__contains:SearchList.value.Remark}
  //extend(js1.value,SearchList.value)
  //js1.value.Remark="__contains "
  console.log(js1.value)
  const table = await getCardList(js1.value)
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
  //console.log(SearchList.value)
}



const GetCardType = (val) => {
  for (let i = 0; i < cardtype_list.value.length; i++) {
    if (cardtype_list.value[i].ID === val) {
      return cardtype_list.value[i].Name
    }
  }
}
const GetColor= (val)=>
{
  if (val==0 || val==1 ) {return "success"}
  else if(val==2){return "danger"}
  else if(val==3){return "warning"}
}
const GetState = (val) => {
  if (val==0) {return "未激活"}else if (val==1) {return "激活"}else if(val==2){return "封卡"}else if(val==3){return "冻结"}
}



const selectL = (selection,row) => {
  listSelect.value = selection;
  //listSelectId.value = selection.map(item => item.id)
  //console.log(this.listSelect)
}



const AddTimeInfo = ref({
  Time: 0
})


//新建用
const CardList=ref(
    {
      APP_ID:'',
      Type_ID:'',
      total:'',
      GenerateUser:0,
      Remark:''
    }
)


// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}




const closeAddTimeDialog = () => {
  userForm.value.resetFields()
  AddTimeDialog.value = false

  const AddTimeInfo = ref({
    Time: 0
  })
}


const BanCardDialog = ref(false)

const ToBanCard = async(row) => {
  if (row.Status==2)
  {
    ElMessage.error('已经被封了 封个锤子')
    return
  }
  Bancardid.value = row.ID
  BanCardDialog.value=true;

}

const ABancard= async(row) => {
  BanCardDialog.value=false
  const res = await BanCard({ ID: Bancardid.value ,Reason:BanReason.value})
  BanReason.value=""
  if (res.code === 0) {
    ElMessage.success('封卡成功')
    await getTableData()
  }
}

const AddTime = async ()=>
{
  AddTimeDialog.value=true
  if(listSelect.value.length>0)
  {
    AddTimeCount.value=listSelect.value.length
  }else
  {

    const resp=await reqAddTime({APP_ID:queryappid,Type:"Count",
      Search:{"Type_ID":SearchList.value.Type_ID,"Card":SearchList.value.Card,
        "Status":SearchList.value.Status,"Remark__contains":SearchList.value.Remark},Time:AddTimeInfo.Time})
    AddTimeCount.value=resp.count
  }
  return
  // if(listSelect.value.length>0)
  // {
  //   // 有选中的 交list
  //   await reqAddTime({APP_ID:queryappid,Type:"List",List:listSelect.value})
  //   console.log(listSelect.value)
  // }else {
  //   //没选中 交搜索条件
  //   await reqAddTime({APP_ID:queryappid,Type:"Search",Search:SearchList.value})
  //   console.log(SearchList.value)
  // }
}

const enterAddTimeDialog =async()=>
{
  if(listSelect.value.length>0)
  {
    // 有选中的 交list
    const resp=await reqAddTime({APP_ID:queryappid,Type:"List",List:listSelect.value,Time:AddTimeInfo.value.Time})
    // console.log(listSelect.value)
    if (resp.code === 0)
    {
      ElMessage.success('加时成功')

    }
  }else {
    //没选中 交搜索条件
    const resp= await reqAddTime({APP_ID:queryappid,Type:"Search",Search:{"Type_ID":SearchList.value.Type_ID,"Card":SearchList.value.Card,
        "Status":SearchList.value.Status,"Remark__contains":SearchList.value.Remark},Time:AddTimeInfo.value.Time})
    // console.log(SearchList.value)
    if (resp.code === 0)
    {
      ElMessage.success('加时成功')
    }
  }
}


const ToFreezeTime= async() =>
{
  let no = false
  console.log(listSelect.value.length)
  // 批量冻结
  if(listSelect.value.length>0)
  {
    await ElMessageBox.confirm("<p>正在進行批量凍結 本次操作數量:<span style='color:red'>"+listSelect.value.length+ "</span>張 是否確認操作</p>",
        '批量更改', {
          dangerouslyUseHTMLString: true,
          distinguishCancelAndClose: true,
          confirmButtonText: '確認',
          cancelButtonText: '取消'
        })
        .catch(() => {
          ElMessage.warning('取消操作')
          no = true
        })
    if(no) return

    // 有选中的 交list
    const resp=await FreezeTime({APP_ID:queryappid,Type:"List",List:listSelect.value})
    // console.log(listSelect.value)
    if (resp.code === 0)
    {
      ElMessage.success('冻结成功 操作成功:' + resp.Count + "张")

    }
  }else {
    //没选中 交搜索条件
    const Countresp=await FreezeTime({APP_ID:queryappid,Type:"Count",Search:{"Type_ID":SearchList.value.Type_ID,"Card":SearchList.value.Card,
        "Status":SearchList.value.Status,"Remark__contains":SearchList.value.Remark}})
    await ElMessageBox.confirm("<p>正在進行批量凍結 本次操作數量:<span style='color:red'>"+Countresp.Count+ "</span>張 是否確認操作</p>",
        '批量更改', {
          dangerouslyUseHTMLString: true,
          distinguishCancelAndClose: true,
          confirmButtonText: '確認',
          cancelButtonText: '取消'
        })
        .catch(() => {
          ElMessage.warning('取消操作')
          no = true
        })
    if(no) return
    const resp= await FreezeTime({APP_ID:queryappid,Type:"Search",Search:{"Type_ID":SearchList.value.Type_ID,"Card":SearchList.value.Card,
        "Status":SearchList.value.Status,"Remark__contains":SearchList.value.Remark}})
    // console.log(SearchList.value)
    if (resp.code === 0)
    {
      ElMessage.success('冻结成功 操作成功:' + resp.Count + "张")

    }
  }
  await getTableData()
}


const ToUnFreezeTime= async() =>
{
  // 批量解冻
  let no = false
  console.log(listSelect.value.length)
  if(listSelect.value.length>0)
  {
    await ElMessageBox.confirm("<p>正在進行批量解冻 本次操作數量:<span style='color:red'>"+listSelect.value.length+ "</span>張 是否確認操作</p>",
        '批量更改', {
          dangerouslyUseHTMLString: true,
          distinguishCancelAndClose: true,
          confirmButtonText: '確認',
          cancelButtonText: '取消'
        })
        .catch(() => {
          ElMessage.warning('取消操作')
          no = true
        })
    if(no) return

    // 有选中的 交list
    const resp=await UnFreezeTime({APP_ID:queryappid,Type:"List",List:listSelect.value})
    // console.log(listSelect.value)
    if (resp.code === 0)
    {
      ElMessage.success('解冻成功 操作成功:' + resp.Count + "张")

    }
  }else {
    //没选中 交搜索条件
    const Countresp=await UnFreezeTime({APP_ID:queryappid,Type:"Count",Search:{"Type_ID":SearchList.value.Type_ID,"Card":SearchList.value.Card,
        "Status":SearchList.value.Status,"Remark__contains":SearchList.value.Remark}})
    await ElMessageBox.confirm("<p>正在進行批量解冻 本次操作數量:<span style='color:red'>"+Countresp.Count+ "</span>張 是否確認操作</p>",
        '批量更改', {
          dangerouslyUseHTMLString: true,
          distinguishCancelAndClose: true,
          confirmButtonText: '確認',
          cancelButtonText: '取消'
        })
        .catch(() => {
          ElMessage.warning('取消操作')
          no = true
        })
    if(no) return
    const resp= await UnFreezeTime({APP_ID:queryappid,Type:"Search",Search:{"Type_ID":SearchList.value.Type_ID,"Card":SearchList.value.Card,
        "Status":SearchList.value.Status,"Remark__contains":SearchList.value.Remark}})
    // console.log(SearchList.value)
    if (resp.code === 0)
    {
      ElMessage.success('解冻成功 操作成功:' + resp.Count + "张")

    }
  }
  await getTableData()
}













const delCard = async() => {
  if(listSelect.value.length<1)
  {
    ElMessage({ type: 'error', message:"未选中卡密" })
    return
  }
  const req = {
    ...listSelect.value,
  }
  ElMessage({ type: 'warning', message: '删除时间较久 请耐心等待' })
  const res = await deleteCard(req)
  if (res.code === 0) {
    ElMessage({ type: 'success', message: res.msg })
    await getTableData()
  }
}
// 整体查询请求 内有卡类和app名称
const getTableData = async() => {
  console.log("来一个")
  if(js1.value!="")
  {
    await SearchHandle()
    return
  }
  const table = await getCardList({ page: page.value, pageSize: pageSize.value,APP_ID:queryappid})
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }

  cardtype_list.value=await getCardTypeList({ APP_ID: queryappid })
  cardtype_list.value=cardtype_list.value.data.list
  Appname.value = await getAppName({APP_ID: queryappid})


}


const closeAddCardDialog = () => {
  CardList.value=
      {
        APP_ID:'',
        Type_ID:'',
        total:'',
        GenerateUser:0,
        Remark:''
      }
  CardRestult.value=''


  addCardDialog.value = false
}

const initPage = async() => {
  await getTableData()

}

initPage()

const chooseImg = ref(null)
const openHeaderChange = () => {
  chooseImg.value.open()
}


const deleteCardFunc = async(row) => {
  const res = await deleteCard({ ID: row.ID })
  if (res.code === 0) {
    ElMessage.success('删除成功')
    row.visible = false
    await getTableData()
  }
}



// 弹窗相关
const CardListInfo = ref({
  Card: '',
  Type_ID: '',
  APP_ID: '',
  Use_Time: '',
  Create_Time: '',
  Status: '',
  BanReason: '',
  Remark:''

})

const delcarddialog= ref(false)
const addUserDialog = ref(false)

const rules = ref({
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, message: '最低5位字符', trigger: 'blur' },
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

const CardRestult=ref("")
const enterAddCardDialog = async() => {
      ElMessage({ type: 'warning', message: '生成时间较久 请耐心等待' })
      const req = {
        ...CardList.value,
        APP_ID:queryappid
      }
      console.log(CardList)
        const res = await setCardList(req)
        if (res.code === 0) {
          CardRestult.value=res.card
          ElMessage({ type: 'success', message: '创建成功' })
          await getTableData()

        }


}
const handleExcelExport = () => {

    /* generate workbook object from table */
    var xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换
    var table = document.querySelector('#cardlisttable').cloneNode(true)
    //  table.removeChild(table.querySelector('.el-table__fixed')) //这里是双下划线
    var wb = XLSX.utils.table_to_book(table, xlsxParam)

    /* get binary string as output */
    var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
    try {
      FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '卡密导出.xlsx')
    } catch (e) {
      if (typeof console !== 'undefined') {
        console.log(e, wbout)
      }
    }
    return wbout



}

const enterAddUserDialog = async() => {
  closeAddUserDialog()

}
//   userForm.value.validate(async valid => {
//     if (valid) {
//       const req = {
//         ...CardListInfo.value,
//       }
//       if (dialogFlag.value === 'add') {
//         const res = await setCardListInfo(req)
//         if (res.code === 0) {
//           ElMessage({ type: 'success', message: '创建成功' })
//           await getTableData()
//           closeAddUserDialog()
//         }
//       }
//       if (dialogFlag.value === 'edit') {
//         const res = await setCardListInfo(req)
//         if (res.code === 0) {
//           ElMessage({ type: 'success', message: '编辑成功' })
//           await getTableData()
//           closeAddUserDialog()
//         }
//       }
//     }
//   })
// }


const closeAddUserDialog = () => {
  CardListInfo.value = []
  addUserDialog.value = false
}


const dialogFlag = ref('add')

const addCard = () => {

  addCardDialog.value = true
}





const openEdit = (row) => {
  dialogFlag.value = 'edit'
  CardListInfo.value = JSON.parse(JSON.stringify(row))
  CardListInfo.value.Create_Time = formatTimeToStr(CardListInfo.value.Create_Time * 1000)
  CardListInfo.value.Use_Time = formatTimeToStr(CardListInfo.value.Use_Time * 1000)
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
