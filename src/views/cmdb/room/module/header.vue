<template>
  <div class="head-container">
    <!-- 搜索 -->
    <el-input v-model="query.value" clearable placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
    <!-- 导入 -->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button v-if="checkPermission(['admin','room_all','room_create','edit'])" size="mini" class="filter-item" type="primary" icon="el-icon-edit" @click="importHandler">导入</el-button>
    </div>
    <slider :is-show.sync="importInst.show" title="批量导入" >
      <div slot="content">
        <upload-excel-component :result.sync="importInst.result" :on-success="handleSuccess" :before-upload="beforeUpload" :download_url.sync="download_path" :download_name.sync="file_name"/>
      </div>
    </slider>
    <!-- 导出 -->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button v-if="checkPermission(['admin','room_all','room_list'])" :loading="exportArr.downloadLoading" size="mini" class="filter-item" type="primary" icon="el-icon-download" @click="downloadHandler">导出</el-button>
    </div>
    <!-- 删除 -->
    <el-button v-if="checkPermission(['admin','room_all','room_delete'])" class="filter-item" size="mini" type="danger" icon="el-icon-remove" @click="deleteSelect">删除</el-button>
    <br>
    <el-select v-model="query.is_ipsec" clearable placeholder="请选择IPSec Vpn" class="filter-item filter-select" style="width: 160px" @change="toQuery">
      <el-option v-for="item in boolen_type" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
    <el-select v-model="query.is_mpls" clearable placeholder="请选择MPLS" class="filter-item filter-select" style="width: 160px" @change="toQuery">
      <el-option v-for="item in boolen_type" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import slider from '@/components/ui/slider'
import exportMixins from '@/mixins/exportMixins'
import importMixins from '@/mixins/importMixins'
import template from '@/mixins/template'
import allDelete from '@/mixins/allDelete'
import permission from '@/mixins/permission'

// 查询条件
export default {
  components: { UploadExcelComponent, slider },
  mixins: [permission, exportMixins, importMixins, allDelete, template],
  props: {
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      model_url: 'api/cmdb/roommodel/',
      template_url: 'api/templates/',
      download_object: 'room',
      base_url: 'api/cmdb/room/',
      imp_url: 'api/cmdb/room/import_action/',
      boolen_type: [{ label: '是', value: '1' }, { label: '否', value: '0' }]
    }
  },
  methods: {
    toQuery() {
      this.$parent.page = 1
      this.$parent.init()
    }
  }
}
</script>
<style>
  .el-select {
    border: none;
    outline: none;
  }
</style>
