<template>
  <div class="app-container">
    <eHeader :query="query"/>
    <!--表格渲染-->
    <el-table v-loading="loading" ref="table" :data="data" size="small" border style="width: 100%;" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column label="序号" width="50" align="center">
        <template slot-scope="scope">
          <div>{{ scope.$index + 1 }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="label_cn" label="名称" align="center"/>
      <el-table-column prop="script_type" label="类型" min-width="60" align="center" />
      <el-table-column prop="script_desc" label="描述" align="center"/>
      <el-table-column prop="script_args" label="参数" align="center"/>
      <el-table-column prop="script_user.username" label="添加人员" width="120" align="center"/>
      <el-table-column prop="filename" label="文件名" width="180" align="center"/>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button v-if="checkPermission(['admin','scriptsall','scripts_download'])" size="mini" type="primary" @click="toDownload(scope.row.script_file)">下载</el-button>
          <el-button v-if="checkPermission(['admin','scripts_all','scripts_edit'])" size="mini" type="success" @click="toEdit(scope.row.id)">编辑</el-button>
          <eForm :is-show.sync="dialog" :edit_data="edit_data" :is-add="false" />
          <el-popover
            v-if="checkPermission(['admin','scripts_all','scripts_delete'])"
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
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import del from '@/mixins/delete'
import permission from '@/mixins/permission'
import { dateFormat } from '@/utils/index'
import eHeader from './module/header'
import eForm from './module/form'
import { retrieve } from '@/api/data'

export default {
  components: { eHeader, eForm },
  mixins: [permission, initData, del],
  data() {
    return {
      base_url: 'api/scripts/',
      dialog: false,
      edit_data: {}
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
      return true
    },
    toEdit(id) {
      this.dialog = true
      retrieve(this.base_url, id).then(res => {
        this.edit_data = res
      })
    },
    toDownload(url) {
      const index = url.lastIndexOf('\/')
      const filename = decodeURI(url).substring(index + 1, url.length)
      fetch(url).then(res => res.blob().then(blob => {
        const a = document.createElement('a')
        const url = window.URL.createObjectURL(blob)
        console.log(filename)
        a.href = url
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(url)
      }))
    }
  }
}
</script>

<style scoped>
  .el-button+.el-button {
    margin-left: 0px;
  }
</style>
