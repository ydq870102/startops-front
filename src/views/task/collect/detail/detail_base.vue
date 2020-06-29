<template>
  <div class="app-container">
    <div style="display: inline-block;margin: 10px 10px;float: right">
    </div>
    <el-table v-loading="loading" ref="table" :data="data" size="small" border style="width: 100%;">
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <div>{{ scope.$index + 1 }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="related_task_name" label="任务名称" min-width="180"/>
      <el-table-column prop="related_task_id" label="任务ID" show-overflow-tooltip width="180"/>
      <el-table-column prop="status" label="任务状态" width="100"/>
      <el-table-column prop="count" label="总数" min-width="50"/>
      <el-table-column prop="sucessed" label="成功" min-width="50"/>
      <el-table-column prop="failed" label="失败" min-width="50"/>
      <el-table-column prop="create" label="新增" min-width="50"/>
      <el-table-column prop="update" label="修改" min-width="50"/>
      <el-table-column prop="delete" label="删除" min-width="50"/>
      <el-table-column prop="normal" label="正常" min-width="50"/>
      <el-table-column prop="total_time" label="任务持续时间（秒）" min-width="180"/>
      <el-table-column :formatter="dateFormat" prop="start_time" label="任务开始时间" min-width="150"/>
      <el-table-column :formatter="dateFormat" prop="end_time" label="任务结束时间" min-width="150"/>
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
import { dateFormat } from '@/utils/index'

export default {
  mixins: [initData],
  data() {
    return {
      base_url: 'api/task/collectresult'
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
      this.params['related_task_name'] = this.$route.query.label_cn
      return true
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
</style>
