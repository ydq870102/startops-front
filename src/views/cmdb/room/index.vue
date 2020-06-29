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
      <el-table-column prop="label_cn" label="机房名称" show-overflow-tooltip width="180"/>
      <el-table-column prop="addr" label="机房地址" show-overflow-tooltip />
      <el-table-column prop="room_contact" label="机房联系人" width="100"/>
      <el-table-column prop="room_phone" label="机房联系电话" width="100"/>
      <el-table-column prop="is_ipsec" label="IPSec  Vpn" width="140"/>
      <el-table-column prop="is_mpls" label="MPLS与IPSec Vpn" width="140"/>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button v-if="checkPermission(['admin','room_all','room_list'])" size="mini" type="success" @click="toDetail(scope.row.id)">详情</el-button>
          <el-popover
            v-if="checkPermission(['admin','room_all','room_delete'])"
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
      base_url: 'api/cmdb/room/',
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
      const is_ipsec = query.is_ipsec
      const is_mpls = query.is_mpls
      this.params = { page: this.page, size: this.size, ordering: sort }
      if (value) { this.params['search'] = value }
      if (is_ipsec !== '' && is_ipsec !== null) { this.params['is_ipsec'] = is_ipsec }
      if (is_mpls !== '' && is_mpls !== null) { this.params['is_mpls'] = is_mpls }
      return true
    },
    // 详情
    toDetail(id) {
      this.$router.push({
        path: 'room/detail',
        query: { id: id }
      })
    }
  }
}
</script>

<style scoped>

</style>
