<template>
  <div class="app-container">
    <div style="display: inline-block;margin: 10px 14px;float: left">
      <el-select v-model="log_type" size="small" placeholder="请选择" @change="changeLogType">
        <el-option
          v-for="item in log_list"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <!--表格渲染-->
    <el-table v-loading="loading" ref="table" :data="data" size="small" border style="width: 100%;" >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="操作结果 :">
              <span>{{ props.row.content }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="object_type" label="对象类型" align="center"/>
      <el-table-column prop="object_name" label="对象名称" align="center"/>
      <el-table-column :formatter="dateFormat" prop="date" label="操作时间" align="center"/>
      <el-table-column prop="user" label="操作用户" align="center" />
      <el-table-column prop="type" label="操作类型" align="center"/>
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
import dynamicHeight from '@/mixins/dynamicHeight'
import permission from '@/mixins/permission'
import { dateFormat } from '@/utils/index'

export default {
  mixins: [permission, initData, dynamicHeight],
  props: {
    detaildata: {
      type: Object,
      default() {
      }
    }
  },
  data() {
    return {
      base_url: 'api/cmdb/networkhistory/',
      log_type: '网络设备',
      result_log: '',
      log_list: [{ value: '网络设备', label: '网络设备' }, { value: '网络设备用户', label: '网络设备用户' }],
      params: {
        id: this.$route.query.id,
        page: 1,
        size: 10
      },
      loading: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    dateFormat,
    beforeInit() {
      return true
    },
    changeLogType(value) {
      if (value === '网络设备') {
        this.base_url = 'api/cmdb/networkhistory/'
        this.params = { page: this.page, size: this.size, id: this.$route.query.id }
      } else if (value === '网络设备用户') {
        this.base_url = 'api/cmdb/netuserhistory/'
        this.params = { page: this.page, size: this.size, related_host_id: this.$route.query.id }
      }
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
  .el-table--border {
    border-right: none;
    border-bottom: none;
    margin-left: 14px;
  }
  .el-form--inline .el-form-item {
    display: inline-block;
    margin-right: 10px;
    vertical-align: top;
    width: 100%;
  }
</style>
