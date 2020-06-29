<template>
  <div class="app-container">
    <div style="display: inline-block;margin: 10px 14px;float: left">
    </div>
    <el-table v-loading="loading" ref="table" :data="data" size="small" border style="width: 100%;">
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <div>{{ scope.$index + 1 }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="related_network_id.label_cn" label="所属网络设备" />
      <el-table-column prop="filename" label="文件名" />
      <el-table-column :formatter="dateFormat" prop="create_time" label="备份时间" show-overflow-tooltip />
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <el-button v-if="checkPermission(['admin','network_all','network_list'])" size="mini" type="primary" @click="toDownload(scope.row.file_path)">下载</el-button>
          <el-button v-if="checkPermission(['admin','network_all','network_list'])" size="mini" type="success" @click="toOpenDialog(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="dialog"
      width="60%"
      center>
      <editor ref="Editor" :value="content" :read = "read" mode ="shell" class="code"></editor>
    </el-dialog>
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
import editor from '@/components/editor'
import del from '@/mixins/delete'
import { dateFormat } from '@/utils/index'
import permission from '@/mixins/permission'
import eForm from '../module/form'
import { retrieve, get } from '@/api/data'

export default {
  components: { eForm, retrieve, editor },
  mixins: [initData, permission, del],
  data() {
    return {
      base_url: 'api/cmdb/netbackup/',
      dialog: false,
      id: this.$route.query.id,
      form_data: {},
      isadd: true,
      content: '',
      read: true
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
      const sort = '-create_time'
      this.params = { page: this.page, size: this.size, ordering: sort }
      this.params['related_network_id'] = this.id
      return true
    },
    toOpenDialog(row) {
      this.getContent(row)
      this.dialog = true
    },
    toDownload(url) {
      const index = url.lastIndexOf('\/')
      const filename = decodeURI(url).substring(index + 1, url.length)
      fetch(url).then(res => res.blob().then(blob => {
        const a = document.createElement('a')
        const url = window.URL.createObjectURL(blob)
        a.href = url
        a.download = filename
        a.click()
        window.URL.revokeObjectURL(url)
      }))
    },
    getContent(obj) {
      get(obj.file_path).then(res => {
        this.content = res
      })
    }
  }
}
</script>

<style scoped>
  .edit-input {
    padding-right: 100px;
  }
  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }
  .app-container{
    margin: -30px 0px;
  }
  .el-table--border {
    border-right: none;
    border-bottom: none;
    margin-left: 14px;
  }
   .el-button+.el-button {
     margin-left: 0px;
   }
</style>
