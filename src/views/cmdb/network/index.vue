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
      <el-table-column prop="label_cn" label="设备名称" show-overflow-tooltip min-width="140"/>
      <el-table-column prop="ip" label="ip地址" min-width="140">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.ip.split(',')" :key="item" size="small" style="display: inline-block;margin: 0px 2px;">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="assets_type" label="设备类型" min-width="80"/>
      <el-table-column prop="vendor" label="品牌" show-overflow-tooltip min-width="80"/>
      <el-table-column prop="status" label="状态" show-overflow-tooltip width="80"/>
      <el-table-column prop="location" label="位置" show-overflow-tooltip min-width="180"/>
      <el-table-column prop="related_room_id.label_cn" label="所属机房" show-overflow-tooltip min-width="120"/>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button v-if="checkPermission(['admin','network_all','network_list'])" size="mini" type="success" @click="toDetail(scope.row.id)">详情</el-button>
          <el-popover
            v-if="checkPermission(['admin','network_all','network_delete'])"
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
import detail from '@/mixins/detail'
import permission from '@/mixins/permission'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'

export default {
  components: { eHeader },
  mixins: [permission, initData, del, detail],
  data() {
    return {
      base_url: 'api/cmdb/network/',
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
      const related_room_id = query.related_room_id
      const related_zone_id = query.related_zone_id
      this.params = { page: this.page, size: this.size, ordering: sort }
      if (related_room_id !== '' && related_room_id !== null) { this.params['related_room_id'] = related_room_id }
      if (related_zone_id !== '' && related_zone_id !== null) { this.params['related_zone_id'] = related_zone_id }
      if (value) { this.params['search'] = value }
      return true
    },
    handleNodeClick(data) {
      console.log(data)
    },
    // 详情
    toDetail(id) {
      this.$router.push({
        path: 'network/detail',
        query: { id: id }
      })
    }
  }
}
</script>

<style scoped>

</style>
