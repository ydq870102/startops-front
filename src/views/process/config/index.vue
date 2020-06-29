<template>
  <div class="confd-def">
    <el-row>
      <el-input v-model="searchVal" size="medium" placeholder="输入名称或者代号进行搜索"/>
      <el-col :span="4">
        <el-card shadow="always" style="margin: 10px 5px 10px; text-align: center; background:#aee888;color:blue;font-size:13px">
          <a type="primary" @click="toAdd()">
            <p><i class="el-icon-plus"></i></p>
            <p>新建项目</p>
          </a>
        </el-card>
      </el-col >
      <el-col v-for="item in data" :span="4" :key="`custom-icon-${item.project_code}-${_uid}`">
        <el-card shadow="always" style="margin: 10px 5px 10px; text-align: center;color:blue;font-size:13px">
          <a @click="toConfig(item.id,item.project_code)">
            <p>{{ item.project_code }}</p>
            <p>{{ item.project_name }}</p>
          </a>
        </el-card>
      </el-col>
      <el-col :span="4">
        <el-card style="margin: 10px 5px 10px; text-align: center;font-size:13px">
          <a @click="handlerMore()">
            <p><i class="el-icon-more"></i></p>
            <p>查看更多</p>
          </a>
        </el-card>
      </el-col >
    </el-row>
    <eForm ref="ruleForm" :is-show.sync="dialog" :is-add="true"></eForm>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import del from '@/mixins/delete'
import permission from '@/mixins/permission'
import { dateFormat } from '@/utils/index'
import eForm from './module/form'

export default {
  components: { eForm },
  mixins: [permission, initData, del],
  data() {
    return {
      base_url: 'api/process/project/',
      dialog: false,
      edit_data: {},
      searchVal: ''
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    dateFormat,
    beforeInit() {
      const sort = 'id'
      this.params = { page: this.page, size: this.size, ordering: sort }
      if (this.searchVal) { this.params['search'] = this.searchVal }
      return true
    },
    toAdd() {
      this.dialog = true
    },
    toConfig(id, code) {
      this.$router.push({
        path: 'config/detail',
        query: { id: id, code: code }
      })
    }
  }
}
</script>

<style scoped>
  .confd-def{
    background:#eee;padding: 20px 5px 0px 20px;
  }
</style>
