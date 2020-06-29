<template>
  <div class="head-container">
    <!-- 搜索 -->
    <el-input v-model="query.value" clearable placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
    <!-- 导入 -->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button v-if="checkPermission(['admin','itsystem_all','itsystem_create','itsystem_edit'])" size="mini" class="filter-item" type="primary" icon="el-icon-edit" @click="importHandler">导入</el-button>
    </div>
    <slider :is-show.sync="importInst.show" title="批量导入" >
      <div slot="content">
        <upload-excel-component :result.sync="importInst.result" :on-success="handleSuccess" :before-upload="beforeUpload" :download_url.sync="download_path" :download_name.sync="file_name"/>
      </div>
    </slider>
    <!-- 导出 -->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button v-if="checkPermission(['admin','itsystem_all','itsystem_list'])" :loading="exportArr.downloadLoading" size="mini" class="filter-item" type="primary" icon="el-icon-download" @click="downloadHandler">导出</el-button>
    </div>
    <el-button v-if="checkPermission(['admin','itsystem_all','itsystem_delete'])" class="filter-item" size="mini" type="danger" icon="el-icon-remove" @click="deleteSelect">删除</el-button>
    <br>
    <el-select v-model="query.related_zone_id" clearable placeholder="所属区域" class="filter-item" style="width: 160px" @change="toQuery">
      <el-option v-for="item in zone_list" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
    <el-select v-model="query.level" clearable placeholder="系统等级" class="filter-item" style="width: 160px" @change="toQuery">
      <el-option v-for="item in level_list" :key="item.value" :label="item.label" :value="item.value"/>
    </el-select>
    <el-select v-model="query.section" clearable placeholder="业务板块" class="filter-item" style="width: 160px" @change="toQuery">
      <el-option v-for="item in section_list" :key="item.section" :label="item.section" :value="item.section"/>
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
      model_url: 'api/cmdb/itsystemmodel/',
      base_url: 'api/cmdb/itsystem/',
      template_url: 'api/templates/',
      download_object: 'itsystem',
      imp_url: 'api/cmdb/itsystem/import_action/'
    }
  },
  created() {
    this.$nextTick(() => {
      this.getAllZone()
      this.getAllSection()
    })
  },
  methods: {
    toQuery() {
      this.$parent.page = 1
      this.$parent.init()
    }
  }
}
</script>
