<template>
  <div class="app-container">
    <!--表格渲染-->
    <el-table v-loading="loading" ref="table" :data="data" size="small" border style="width: 100%;" >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="操作结果 :">
              <span>{{ props.row.result }}</span>
            </el-form-item>
            <br>
            <el-form-item label="操作详情 :">
              <span>{{ props.row.result_detail }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="user" label="操作用户" width="140" align="center"/>
      <el-table-column prop="log_type" label="操作类型" width="140" align="center" />
      <el-table-column prop="name" label="模块名称" width="200" align="center"/>
      <el-table-column prop="args" label="参数" width="180" align="center"/>
      <el-table-column prop="host" label="主机列表" align="center"/>
      <el-table-column :formatter="dateFormat" prop="datetime" label="操作时间" width="240" align="center"/>

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
import permission from '@/mixins/permission'
import { dateFormat } from '@/utils/index'

export default {
  mixins: [permission, initData],
  data() {
    return {
      base_url: 'api/log/',
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
      const sort = '-datetime'
      this.params = { page: this.page, size: this.size, ordering: sort }
      return true
    }
  }
}
</script>

<style scoped>

</style>
