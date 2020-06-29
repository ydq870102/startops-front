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
      <el-table-column prop="label_cn" width="200" label="信息系统名称"/>
      <el-table-column prop="alias" label="英文简称"/>
      <el-table-column prop="related_zone_name" label="所属区域" />
      <el-table-column prop="level" label="系统等级" width="120"/>
      <el-table-column prop="section" label="业务板块" />
      <el-table-column prop="system_manager" label="系统管理员" />
      <el-table-column prop="system_admin" label="系统负责人" />
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button v-if="checkPermission(['admin','itsystem_all','itsystem_list'])" size="mini" type="success" @click="toDetail(scope.row.id)">详情</el-button>
          <el-popover
            v-if="checkPermission(['admin','itsystem_all','itsystem_delete'])"
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
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
export default {
  components: { eHeader },
  mixins: [permission, initData, del],
  data() {
    return {
      base_url: 'api/cmdb/itsystem/',
      sup_this: this
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
      const level = query.level
      const related_zone_id = query.related_zone_id
      const section = query.section
      this.params = { page: this.page, size: this.size, ordering: sort }
      if (level !== '' && level !== null) { this.params['level'] = level }
      if (section !== '' && section !== null) { this.params['section'] = section }
      if (related_zone_id !== '' && related_zone_id !== null) { this.params['related_zone_id'] = related_zone_id }
      if (value) { this.params['search'] = value }
      return true
    },
    // 详情
    toDetail(id) {
      this.$router.push({
        path: 'itsystem/detail/',
        query: { id: id }
      })
    }
  }
}
</script>

