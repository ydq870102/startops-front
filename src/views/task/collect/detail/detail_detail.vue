<template>
  <div class="app-container">
    <div style="display: inline-block;margin: 10px 10px;float: left">
      <el-input v-model="query.value" clearable placeholder="输入名称搜索" size="mini" style="width: 160px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-select v-model="query.action_type" clearable placeholder="操作类型" size="mini" class="filter-item filter-select" style="width: 160px" @change="toQuery">
        <el-option v-for="item in action_types" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-select v-model="query.result" clearable placeholder="操作结果" size="mini" class="filter-item filter-select" style="width: 160px" @change="toQuery">
        <el-option v-for="item in result_list" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
    </div>
    <el-table v-loading="loading" ref="table" :data="data" size="small" border style="width: 100%;">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="失败原因">
              <span>{{ props.row.reason }}</span>
            </el-form-item>
            <el-form-item label="元数据">
              <span>{{ props.row.attr }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="序号" width="60" align="center">
        <template slot-scope="scope">
          <div>{{ scope.$index + 1 }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="related_task_name" label="任务名称"/>
      <el-table-column prop="related_task_id" label="任务ID" show-overflow-tooltip/>
      <el-table-column prop="label_cn" label="资源名称" show-overflow-tooltip />
      <el-table-column prop="action_type" label="操作类型"/>
      <el-table-column prop="result" label="操作结果"/>
      <el-table-column :formatter="dateFormat" prop="create_time" label="操作时间"/>
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
      base_url: 'api/task/collectdetail',
      result_list: [{ value: '成功', label: '成功' }, { value: '失败', label: '失败' }],
      action_types: [{ value: 'Update', label: 'Update' }, { value: 'Create', label: 'Create' }, { value: 'Failed', label: 'Failed' }]
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
      const query = this.query
      const value = query.value
      const result = query.result
      const action_type = query.action_type
      const sort = '-create_time'
      this.params = { page: this.page, size: this.size, ordering: sort }
      this.params['related_task_name'] = this.$route.query.label_cn
      this.params['result'] = result
      this.params['action_type'] = action_type
      if (value) { this.params['search'] = value }
      return true
    },
    toQuery() {
      this.page = 1
      this.init()
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
