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
      <el-table-column prop="label_cn" label="任务名称" show-overflow-tooltip min-width="180" align="center"/>
      <el-table-column prop="type" label="任务类型" min-width="100" align="center"/>
      <el-table-column prop="sub_type" label="任务子类型" min-width="100" align="center" />
      <el-table-column prop="crontab_name" label="所属定时器" min-width="250" align="center"/>
      <el-table-column prop="status" label="任务状态" min-width="120" align="center"/>
      <el-table-column prop="expire_time" label="任务过期时间" min-width="120" align="center"/>
      <el-table-column prop="desc" label="任务描述" min-width="200" align="center"/>
      <el-table-column label="操作" align="center" width="330">
        <template slot-scope="scope">
          <el-button v-if="checkPermission(['admin','task_all','task_list'])" size="mini" type="primary" @click="toDetail(scope.row.label_cn,scope.row.id)">详情</el-button>
          <el-button v-if="checkPermission(['admin','task_all','task_edit'])" size="mini" type="success" @click="toEdit(scope.row.id)">编辑</el-button>
          <eForm :is-show.sync="dialog" :edit_data="edit_data" :is-add="false" />
          <el-popover
            v-if="checkPermission(['admin','task_all','task_delete'])"
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
          <el-popover
            v-if="checkPermission(['admin','task_all','task_edit'])"
            :ref="scope.row.label_cn"
            placement="top"
            width="180">
            <p>是否立即执行该任务？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.label_cn].doClose()">取消</el-button>
              <el-button type="primary" size="mini" @click="toApply(scope.row.label_cn,scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="warning" size="mini">执行</el-button>
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
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import eForm from './module/form'
import { retrieve } from '@/api/data'
export default {
  components: { eHeader, eForm },
  mixins: [permission, initData, del],
  data() {
    return {
      base_url: 'api/task/collect/',
      apply_url: 'api/task/applytask/',
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
    parseTime,
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
    // 详情
    toDetail(label_cn, id) {
      this.$router.push({
        path: 'collect/detail',
        query: { label_cn: label_cn, id: id }
      })
    },
    toApply(label_cn, id) {
      retrieve(this.apply_url, id).then(res => {
        this.$refs[label_cn].doClose()
        this.$message({
          showClose: true,
          type: 'success',
          message: res,
          duration: 2500
        })
      })
    }
  }
}
</script>

<style scoped>
  .el-button+.el-button {
    margin-left: 0px;
  }
</style>
