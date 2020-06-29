<template>
  <div class="head-container">
    <!-- 新增 -->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button v-if="checkPermission(['admin','task_all','task_list'])" size="mini" class="filter-item" type="primary" icon="el-icon-download" @click="toAdd">新增</el-button>
      <eForm ref="ruleForm" :is-show.sync="dialog" :is-add="true"></eForm>
    </div>
    <!-- 删除 -->
    <el-button v-if="checkPermission(['admin','task_all','task_delete'])" class="filter-item" size="mini" type="danger" icon="el-icon-remove" @click="deleteSelect">删除</el-button>
  </div>
</template>

<script>
import allDelete from '@/mixins/allDelete'
import permission from '@/mixins/permission'
import eForm from './form'

// 查询条件
export default {
  components: { eForm },
  mixins: [permission, allDelete],
  data() {
    return {
      base_url: 'api/crontab/',
      dialog: false
    }
  },
  methods: {
    toAdd() {
      this.dialog = true
    }
  }
}
</script>
