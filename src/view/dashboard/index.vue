<template>
  <div class="page">
    <div class="gva-card-box">
      <div class="gva-card gva-top-card">
        <div class="gva-top-card-left">
          <div class="gva-top-card-left-title">{{ $t('message.welcome') }}</div>
          <el-button @click=" change" />
          <div class="gva-top-card-left-dot">今日晴，-999℃ - 1000℃，天气寒冷，注意添加衣物。</div>
          <div class="gva-top-card-left-rows">
            <el-row>
              <el-col v-for="(data,key) in dataCards" :key="key" :sm="8" :span="8" :xs="24">
                <div class="flex-center" style="font-size: 14px">
                  <el-icon class="dasboard-icon">
                    <component :is="data.icon" />
                  </el-icon>
                  {{ data.name }}:{{ data.text }}
                </div>
              </el-col>
            </el-row>
          </div>
          <div>
            <div class="gva-top-card-left-item">
              使用教学：
              <a
                href="https://没有.com"
                style="color:#409EFF"
                target="view_window"
              >https://没有.com</a>
            </div>
          </div>
        </div>
        <img alt class="gva-top-card-right" src="@/assets/dashboard.png">
      </div>
    </div>

    <!--    <el-row class="el-row">-->

    <!--      &lt;!&ndash;      <el-col :span="10">&ndash;&gt;-->
    <!--      &lt;!&ndash;        <div class="gva-card-box">&ndash;&gt;-->
    <!--      &lt;!&ndash;          <el-card class="gva-card quick-entrance">&ndash;&gt;-->
    <!--      &lt;!&ndash;            <template #header>&ndash;&gt;-->
    <!--      &lt;!&ndash;              <div class="card-header">&ndash;&gt;-->
    <!--      &lt;!&ndash;                <span>数据面板</span>&ndash;&gt;-->
    <!--      &lt;!&ndash;              </div>&ndash;&gt;-->
    <!--      &lt;!&ndash;            </template>&ndash;&gt;-->
    <!--      &lt;!&ndash;            <el-row :gutter="20"  class="el-row">&ndash;&gt;-->
    <!--      &lt;!&ndash;              <el-col :span="8" v-for="(data,key) in dataCards.slice(0,3)" :key="key">&ndash;&gt;-->
    <!--      &lt;!&ndash;                <el-card shadow="always">&ndash;&gt;-->
    <!--      &lt;!&ndash;                  <div class="data-card-body">&ndash;&gt;-->
    <!--      &lt;!&ndash;                    <div class="data-card-body-title" >{{data.name}}</div>&ndash;&gt;-->
    <!--      &lt;!&ndash;                    <div class="data-card-body-content">{{data.text}}</div>&ndash;&gt;-->
    <!--      &lt;!&ndash;                  </div>&ndash;&gt;-->
    <!--      &lt;!&ndash;                </el-card>&ndash;&gt;-->
    <!--      &lt;!&ndash;              </el-col>&ndash;&gt;-->
    <!--      &lt;!&ndash;            </el-row>&ndash;&gt;-->
    <!--      &lt;!&ndash;            <el-row :gutter="20"  class="el-row">&ndash;&gt;-->
    <!--      &lt;!&ndash;              <el-col :span="8" v-for="(data,key) in dataCards.slice(3,6)" :key="key">&ndash;&gt;-->
    <!--      &lt;!&ndash;                <el-card shadow="always">&ndash;&gt;-->
    <!--      &lt;!&ndash;                  <div class="data-card-body">&ndash;&gt;-->
    <!--      &lt;!&ndash;                    <div class="data-card-body-title" >{{data.name}}</div>&ndash;&gt;-->
    <!--      &lt;!&ndash;                    <div class="text item">{{data.text}}</div>&ndash;&gt;-->
    <!--      &lt;!&ndash;                  </div>&ndash;&gt;-->
    <!--      &lt;!&ndash;                </el-card>&ndash;&gt;-->
    <!--      &lt;!&ndash;              </el-col>&ndash;&gt;-->

    <!--      &lt;!&ndash;            </el-row>&ndash;&gt;-->
    <!--      &lt;!&ndash;          </el-card>&ndash;&gt;-->
    <!--      &lt;!&ndash;        </div>&ndash;&gt;-->
    <!--      &lt;!&ndash;      </el-col>&ndash;&gt;-->

    <!--      <el-col :span="24">-->
    <!--        <div class="gva-card-box">-->
    <!--          <el-card class="gva-card quick-entrance">-->
    <!--            <template #header>-->
    <!--              <div class="card-header">-->
    <!--                <span>管理面板</span>-->
    <!--              </div>-->
    <!--            </template>-->
    <!--            <el-row :gutter="10">-->
    <!--              <el-col-->
    <!--                v-for="(card, key) in toolCards"-->
    <!--                :key="key"-->
    <!--                :span="6"-->
    <!--                :xs="8"-->
    <!--                class="quick-entrance-items"-->
    <!--                @click="toTarget(card.name)"-->
    <!--              >-->
    <!--                <div class="quick-entrance-item">-->
    <!--                  <div class="quick-entrance-item-icon">-->
    <!--                    <el-icon>-->
    <!--                      <component :is="card.icon" />-->
    <!--                    </el-icon>-->
    <!--                  </div>-->
    <!--                  <p>{{ card.label }}</p>-->
    <!--                </div>-->
    <!--              </el-col>-->
    <!--            </el-row>-->
    <!--          </el-card>-->
    <!--          &lt;!&ndash; <div class="quick-entrance-title"></div> &ndash;&gt;-->
    <!--        </div>-->
    <!--      </el-col>-->

    <!--    </el-row>-->
    <el-row :gutter="10" style="margin-left: 10px">

      <el-col :span="17">
        <el-row>
          <el-col :span="24">
            <el-card class="gva-card quick-entrance">
              <template #header>
                <div class="card-header">
                  <span>版本信息</span>
                </div>
              </template>
              <el-descriptions

                class="margin-top"
                title=""
                :column="1"
                size="mini"
                border
              >
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">
                      <el-icon :style="iconStyle">
                        <monitor />
                      </el-icon>
                      服務器名稱：
                    </div>
                  </template>

                  ServerName
                </el-descriptions-item>

                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">
                      <el-icon :style="iconStyle">
                        <monitor />
                      </el-icon>
                      通信接口狀態：
                    </div>
                  </template>
                  Good
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">
                      <el-icon :style="iconStyle">
                        <monitor />
                      </el-icon>
                      操作系统版本:
                    </div>
                  </template>
                  Ubuntu 1.1
                </el-descriptions-item>

                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">
                      <el-icon :style="iconStyle">
                        <monitor />
                      </el-icon>
                      GO编译版本：
                    </div>
                  </template>
                  Go Version 1.20.1
                </el-descriptions-item>
                <!--                <el-descriptions-item>-->
                <!--                  <template #label>-->
                <!--                    <div class="cell-item">-->
                <!--                      <el-icon :style="iconStyle">-->
                <!--                        <monitor />-->
                <!--                      </el-icon>-->
                <!--                      PHP運行方式：-->
                <!--                    </div>-->
                <!--                  </template>-->
                <!--                  {{ tableData[0]['PHPRun'] }}-->
                <!--                </el-descriptions-item>-->

                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">
                      <el-icon :style="iconStyle">
                        <monitor />
                      </el-icon>
                      内存容量：
                    </div>
                  </template>
                  <!--                  <span :style="{color: tableData[0]['Redis'] === '連接失敗 請檢查Redis是否啟動!' ? 'red' : 'green'}">-->
                  <!--                    {{ tableData[0]['Redis'] }}</span>-->

                </el-descriptions-item>

                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">
                      <el-icon :style="iconStyle">
                        <monitor />
                      </el-icon>
                      系统运行时长：
                    </div>
                  </template>

                  <!--                  Microsoft Windows 10 专业版（X64）-->
                </el-descriptions-item>
<!--                <el-descriptions-item>-->
<!--                  <template #label>-->
<!--                    <div class="cell-item">-->
<!--                      <el-icon :style="iconStyle">-->
<!--                        <monitor />-->
<!--                      </el-icon>-->
<!--                      服务器IP：-->
<!--                    </div>-->
<!--                  </template>-->

<!--                </el-descriptions-item>-->

              </el-descriptions>

            </el-card>
          </el-col>
        </el-row>
      </el-col>

      <el-col :span="7">
        <el-row>
          <el-col :span="23">
            <el-card class="gva-card quick-entrance">
              <template #header>
                <div class="card-header">
                  <span>数据统计</span>
                </div>
              </template>
              <el-descriptions

                class="margin-top"
                title=""
                :column="1"
                border
              >
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">
                      <el-icon :style="iconStyle">
                        <monitor />
                      </el-icon>
                      心跳接口:
                    </div>
                  </template>
                  OK
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">
                      <el-icon :style="iconStyle">
                        <monitor />
                      </el-icon>
                      识别接口:
                    </div>
                  </template>
                  OK
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">
                      <el-icon :style="iconStyle">
                        <monitor />
                      </el-icon>
                      昨日识别数量
                    </div>
                  </template>
                  12345
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">
                      <el-icon :style="iconStyle">
                        <monitor />
                      </el-icon>
                      昨日识别失败数量：
                    </div>
                  </template>
                  12345
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">
                      <el-icon :style="iconStyle">
                        <monitor />
                      </el-icon>
                      今日识别数量：
                    </div>
                  </template>
                  12345
                </el-descriptions-item>
                <el-descriptions-item>
                  <template #label>
                    <div class="cell-item">
                      <el-icon :style="iconStyle">
                        <monitor />
                      </el-icon>
                      今日识别失败数量：
                    </div>
                  </template>
                  12345
                </el-descriptions-item>
              </el-descriptions>

            </el-card>
          </el-col>
        </el-row>

      </el-col>
    </el-row>
<!--    <div class="gva-card-box">-->
<!--      <div class="gva-card">-->
<!--        <div class="card-header">-->
<!--          <span>数据统计</span>-->
<!--        </div>-->

<!--        <el-table-->
<!--          :data="tableData"-->
<!--          style="width: 100%"-->
<!--        >-->
<!--          <el-table-column-->
<!--            label="名称"-->
<!--            prop="Name"-->
<!--            width="180"-->
<!--          />-->
<!--          <el-table-column-->
<!--            align="center"-->
<!--            label="状态"-->
<!--            prop="state"-->
<!--          >-->
<!--            <template #default="scope">-->
<!--              <el-tag-->
<!--                :type="scope.row.Status=='正常'?'success':scope.row.Status=='停用'?'danger':scope.row.Status=='停用'?'danger':'success'"-->
<!--              >-->
<!--                {{ Statu(scope.row.Status) }}-->
<!--              </el-tag>-->

<!--            </template>-->
<!--          </el-table-column>-->

<!--          <el-table-column-->
<!--            label="版本号"-->
<!--            prop="Version"-->
<!--          />-->

<!--          <el-table-column-->
<!--            label="解绑扣除（时）"-->
<!--            prop="Unbind_Del"-->
<!--          />-->
<!--          <el-table-column-->
<!--            label="免费解绑次数"-->
<!--            prop="Free_Unbind"-->
<!--          />-->
<!--          <el-table-column-->
<!--            label="解绑间隔（时）"-->
<!--            prop="Unbind_Interval"-->
<!--          />-->
<!--        </el-table>-->
<!--        <div class="gva-pagination">-->
<!--          <el-pagination-->
<!--            :current-page="page"-->
<!--            :page-size="pageSize"-->
<!--            :page-sizes="[5, 10]"-->
<!--            :total="total"-->
<!--            layout="total, sizes, prev, pager, next, jumper"-->
<!--            @current-change="handleCurrentChange"-->
<!--            @size-change="handleSizeChange"-->
<!--          />-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>
<script setup>

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAppList } from '@/api/App'
import { getAuthorityList } from '@/api/authority'

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

const AppInfo = ref({
  Name: '',
  Version: 0.1,
  App_Mode: '0',
  Update_Address: '',
  Notice: '',
  Unbind_Del: 0,
  Unbind_Interval: 0,
  Free_Unbind: 0,
  Rsa_Private: '',
  Rsa_Public: '',
  Aes_Key: '',
  ForcedUpdate: 0,
  BindMac: 1,
  FreeMode: 0,
  CanUnbind: 1,
  CanRegister: 1,
  CanLogin: 1
})

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
}
// initPage()
const dataCards = ref([
  {
    name: '班级管理',
    text: '1',
    icon: 'monitor',
  },
  {
    name: '课程管理',
    text: '122',
    icon: 'key',
  },
  {
    name: '课室管理',
    text: '122',
    icon: 'user',
  },
  {
    name: '学生管理',
    text: '122',
    icon: 'cloudy',
  },

])

const toolCards = ref([
  {
    label: '班级管理',
    icon: 'monitor',
    name: 'appmanage',
  },
  {
    label: '课程管理',
    icon: 'key',
    name: '',
  },
  {
    label: '课室管理',
    icon: 'menu',
    name: '',
  },
  {
    label: '学生管理',
    icon: 'user',
    name: '',
  },

])

const router = useRouter()

const toTarget = (name) => {
  router.push({ name })
}

</script>

<script>

export default {
  name: 'Dashboard',
  data() {
    return {
      currentPage: 1, // 当前页码
      total: 0, // 总条数
      pageSize: 3, // 每页的数据条数
    }
  },

  methods: {
    change() {
      if (this.$i18n.locale === 'tw') {
        this.$i18n.locale = 'zh'
      } else {
        this.$i18n.locale = 'tw'
      }
    },

    Statu(value) {
      return value ? '正常' : '停用'
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.currentPage = 1
      this.pageSize = val
    },

    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.currentPage = val
    },
  },
}

</script>

<style>

.data-card-body-content {
  font-size: 24px;
  color: #019589;
}

/*.div-card .card-body .data-card .data-card-body .data-card-body-content*/
/*{*/
/*  font-size:24px;*/
/*  color:#019589;*/
/*}*/

.system_state {
  padding: 10px;
}

.card_item {
  height: 280px;
}
</style>

<style>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 480px;
}
</style>

<style lang="scss" scoped>
@mixin flex-center {
  display: flex;
  align-items: center;
}

.page {
  background: #f0f2f5;
  padding: 0;

  .gva-card-box {
    padding: 12px 16px;

    & + .gva-card-box {
      padding-top: 0px;
    }
  }

  .gva-card {
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 2px;
    height: auto;
    padding: 26px 30px;
    overflow: hidden;
    box-shadow: 0 0 7px 1px rgba(0, 0, 0, 0.03);
  }

  .gva-top-card {
    height: 260px;
    @include flex-center;
    justify-content: space-between;
    color: #777;

    &-left {
      height: 100%;
      display: flex;
      flex-direction: column;

      &-title {
        font-size: 22px;
        color: #343844;
      }

      &-dot {
        font-size: 14px;
        color: #6B7687;
        margin-top: 24px;
      }

      &-rows {
        // margin-top: 15px;
        margin-top: 18px;
        color: #6B7687;
        width: 600px;
        align-items: center;
      }

      &-item {
        + .gva-top-card-left-item {
          margin-top: 24px;
        }

        margin-top: 14px;
      }
    }

    &-right {
      height: 600px;
      width: 600px;
      margin-top: 28px;
    }
  }

  ::v-deep(.el-card__header) {
    padding: 0;
    border-bottom: none;
  }

  .card-header {
    padding-bottom: 20px;
    border-bottom: 1px solid #e8e8e8;
  }

  .quick-entrance-title {
    height: 30px;
    font-size: 22px;
    color: #333;
    width: 100%;
    border-bottom: 1px solid #eee;
  }

  .quick-entrance-items {
    @include flex-center;
    justify-content: center;
    text-align: center;
    color: #333;

    .quick-entrance-item {
      padding: 16px 28px;
      margin-top: -16px;
      margin-bottom: -16px;
      border-radius: 4px;
      transition: all 0.2s;

      &:hover {
        box-shadow: 0px 0px 7px 0px rgba(217, 217, 217, 0.55);
      }

      cursor: pointer;
      height: auto;
      text-align: center;
      // align-items: center;
      &-icon {
        width: 50px;
        height: 50px !important;
        border-radius: 8px;
        @include flex-center;
        justify-content: center;
        margin: 0 auto;

        i {
          font-size: 24px;
        }
      }

      p {
        margin-top: 10px;
      }
    }
  }

  .echart-box {
    padding: 14px;
  }
}

.dasboard-icon {
  font-size: 20px;
  color: rgb(85, 160, 248);
  width: 30px;
  height: 30px;
  margin-right: 10px;
  @include flex-center;
}

.flex-center {
  @include flex-center;
}

//小屏幕不显示右侧，将登陆框居中
@media (max-width: 750px) {
  .gva-card {
    padding: 20px 10px !important;

    .gva-top-card {
      height: auto;

      &-left {
        &-title {
          font-size: 20px !important;
        }

        &-rows {
          margin-top: 15px;
          align-items: center;
        }
      }

      &-right {
        display: none;
      }
    }

    .gva-middle-card {
      &-item {
        line-height: 20px;
      }
    }

    .dasboard-icon {
      font-size: 18px;
    }
  }
}
</style>

