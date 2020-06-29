<template>
  <div class="head-container">
    <!-- 搜索 -->
    <el-input v-model="query.value" clearable placeholder="输入名称或者IP搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
    <!-- 导入 -->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-dropdown>
        <el-button v-if="checkPermission(['admin','network_all','network_create'])" type="primary" size="mini" class="filter-item">
          导入<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="hostImHandler">导入网络设备</el-dropdown-item>
          <el-dropdown-item @click.native="passwordImHandler">导入用户</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <slider :is-show.sync="importInst.show" :title="title" >
      <div slot="content">
        <upload-excel-component :result.sync="importInst.result" :on-success="handleSuccess" :before-upload="beforeUpload" :download_url.sync="download_path" :download_name.sync="file_name"/>
      </div>
    </slider>
    <!-- 导出 -->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-dropdown>
        <el-button v-if="checkPermission(['admin','network_all','network_create'])" type="primary" size="mini" class="filter-item">
          导出<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="hostExHandler">导出网络设备</el-dropdown-item>
          <el-dropdown-item @click.native="passwordExHandler">导出用户</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 删除 -->
    <el-button v-if="checkPermission(['admin','network_all','network_delete'])" class="filter-item" size="mini" type="danger" icon="el-icon-remove" @click="deleteSelect">删除</el-button>
    <br>
    <el-select v-model="query.related_room_id" clearable placeholder="请选择机房" class="filter-item filter-select" style="width: 160px" @change="toQuery">
      <el-option v-for="item in room_list" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
    <el-select v-model="query.related_zone_id" clearable placeholder="请选择网络区域" class="filter-item filter-select" style="width: 160px" filterable @change="toQuery">
      <el-option v-for="item in zone_list" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import slider from '@/components/ui/slider'
import exportMixins from '@/mixins/exportMixins'
import importMixins from '@/mixins/importMixins'
import allDelete from '@/mixins/allDelete'
import permission from '@/mixins/permission'
import related from '../../common/js/related'
import template from '@/mixins/template'

// 查询条件
export default {
  components: { UploadExcelComponent, slider },
  mixins: [permission, exportMixins, importMixins, allDelete, related, template],
  props: {
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      model_url: 'api/cmdb/networkmodel/',
      base_url: 'api/cmdb/network/',
      template_url: 'api/templates/',
      download_object: 'network',
      imp_url: 'api/cmdb/network/import_action/',
      title: ''
    }
  },
  created() {
    this.$nextTick(() => {
      this.getAllRoom()
      this.getAllZone()
    })
  },
  methods: {
    toQuery() {
      this.$parent.page = 1
      this.$parent.init()
    },
    hostImHandler() {
      this.download_object = 'network'
      this.imp_url = 'api/cmdb/network/import_action/'
      this.title = '网络设备导入'
      this.importHandler()
    },
    passwordImHandler() {
      this.download_object = 'netuser'
      this.imp_url = 'api/cmdb/netuser/import_action/'
      this.title = '用户导入'
      this.importHandler()
    },
    hostExHandler() {
      this.model_url = 'api/cmdb/networkmodel/'
      this.base_url = 'api/cmdb/network/'
      this.downloadHandler()
    },
    passwordExHandler() {
      this.model_url = 'api/cmdb/netusermodel/'
      this.base_url = 'api/cmdb/netuser/'
      this.downloadHandler()
    }
  }
}
</script>
<style scoped="true">
  .filter-select {
    width: 160px;
  }
</style>
