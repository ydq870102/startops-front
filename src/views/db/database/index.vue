<template>
  <div class="app-container">
    <eHeader :query="query"/>
    <!--表格渲染-->
    <tree-table v-loading="loading" :data="data" :expand-all="true" :columns="columns" border size="small" style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column prop="env" label="环境" width="80"/>
      <el-table-column prop="related_host_id.ip" label="ip 地址">
        <template v-if="scope.row.related_host_id" slot-scope="scope">
          <el-tag v-for="item in scope.row.related_host_id.ip.split(',')" :key="item" size="small" style="display: inline-block;margin: 0px 2px;">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型"/>
      <el-table-column prop="cluster_name" label="集群名称" show-overflow-tooltip/>
      <el-table-column prop="cluster_mode" label="集群类型"/>
      <el-table-column prop="version" label="版本"/>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button v-if="checkPermission(['admin','host_all','host_list'])" size="mini" type="success" @click="toDetail(scope.row.id)">详情</el-button>
          <el-popover
            v-if="checkPermission(['admin','host_all','host_delete'])"
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popover>
        </template>
      </el-table-column>
    </tree-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :page-sizes="[100, 200, 300, 400]"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import del from '@/mixins/delete'
import detail from '@/mixins/detail'
import permission from '@/mixins/permission'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import treeTable from '@/components/TreeTable'
import { get } from '@/api/data'

export default {
  components: { eHeader, treeTable },
  mixins: [permission, initData, del, detail],
  data() {
    return {
      basetree_url: 'api/databasetree/',
      base_url: 'api/database/',
      sup_this: this,
      template_url: 'api/templates/',
      download_object: 'database',
      imp_url: 'api/database/import_action/',
      columns: [
        {
          text: '名称',
          value: 'label_cn',
          width: 240
        }
      ]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    beforeInit() {
      const sort = 'id'
      const query = this.query
      const value = query.value
      this.params = { page: this.page, size: this.size, ordering: sort }
      if (value) { this.params['search'] = value }
      return true
    },
    handleNodeClick(data) {
      console.log(data)
    },
    // 详情
    toDetail(id) {
      this.$router.push({
        path: 'database/detail',
        query: { id: id }
      })
    },
    async init() {
      if (!await this.beforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        get(this.basetree_url, this.params).then(res => {
          this.total = res.count
          this.data = res.results
          setTimeout(() => {
            this.loading = false
          }, this.time)
          resolve(res)
        }).catch(err => {
          this.loading = false
          console.log(err)
          reject(err)
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
