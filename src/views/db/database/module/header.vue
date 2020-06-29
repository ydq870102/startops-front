<template>
  <div class="head-container">
    <!-- 搜索 -->
    <el-input v-model="query.value" clearable placeholder="输入名称或者IP搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-search" @click="toQuery">搜索</el-button>
    <!-- 导入 -->
    <div style="display: inline-block;margin: 0px 2px;">
      <el-button v-if="checkPermission(['admin','database_all','database_create'])" type="primary" size="mini" class="filter-item" icon="el-icon-circle-plus-outline" @click="toAdd">
        新增
      </el-button>
      <el-dropdown>
        <el-button v-if="checkPermission(['admin','database_all','database_create'])" type="primary" size="mini" class="filter-item">
          导入<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="databaseImHandler">导入数据库</el-dropdown-item>
          <el-dropdown-item @click.native="instanceImHandler">导入实例</el-dropdown-item>
          <el-dropdown-item @click.native="userImHandler">导入用户</el-dropdown-item>
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
        <el-button v-if="checkPermission(['admin','database_all','database_create'])" type="primary" size="mini" class="filter-item">
          导出<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="databaseExHandler">导出数据库</el-dropdown-item>
          <el-dropdown-item @click.native="instanceExHandler">导出实例</el-dropdown-item>
          <el-dropdown-item @click.native="userExHandler">导出用户</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 删除 -->
    <el-button v-if="checkPermission(['admin','database_all','database_delete'])" class="filter-item" size="mini" type="danger" icon="el-icon-remove" @click="deleteSelect">删除</el-button>
    <addForm ref="addForm" :is-show.sync="dialog"></addForm>
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
import addForm from './add_form'

// 查询条件
export default {
  components: { UploadExcelComponent, slider, addForm },
  mixins: [permission, exportMixins, importMixins, allDelete, related, template],
  props: {
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      model_url: 'api/databasemodel/',
      base_url: 'api/database/',
      template_url: 'api/templates/',
      download_object: '',
      dialog: false,
      imp_url: 'api/database/import_action/',
      title: ''
    }
  },
  methods: {
    toQuery() {
      this.base_url = 'api/database/'
      this.$parent.page = 1
      this.$parent.init()
    },
    databaseImHandler() {
      this.download_object = 'database'
      this.imp_url = 'api/database/import_action/'
      this.title = '数据库导入'
      this.importHandler()
    },
    instanceImHandler() {
      this.download_object = 'dbinstance'
      this.imp_url = 'api/dbinstance/import_action/'
      this.title = '实例导入'
      this.importHandler()
    },
    userImHandler() {
      this.download_object = 'dbuser'
      this.imp_url = 'api/dbuser/import_action/'
      this.title = '用户导入'
      this.importHandler()
    },
    databaseExHandler() {
      this.model_url = 'api/databasemodel/'
      this.base_url = 'api/database/'
      this.downloadHandler()
    },
    instanceExHandler() {
      this.model_url = 'api/dbinstancemodel/'
      this.base_url = 'api/dbinstance/'
      this.title = '实例导入'
      this.downloadHandler()
    },
    userExHandler() {
      this.model_url = 'api/dbusermodel/'
      this.base_url = 'api/dbuser/'
      this.title = '用户导入'
      this.downloadHandler()
    },
    toAdd() {
      this.dialog = true
    }
  }
}
</script>
<style scoped="true">
  .filter-select {
    width: 160px;
  }
</style>
