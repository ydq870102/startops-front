<template>
  <el-row>
    <el-col :span="8">
      <el-card class="card" >
        <el-col :span="18">
          <el-input
            v-model="filterText"
            placeholder="输入关键字进行过滤">
          </el-input>
          <div style="max-height: 420px;overflow: auto">
            <el-tree
              ref="tree"
              :data="data"
              :props="defaultProps"
              :highlight-current="true"
              :filter-node-method="filterNode"
              default-expand-all
              style="margin-top:20px;"
              @current-change="getContent">
            </el-tree>
          </div>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" size="mini" style="margin: 2px 12px;max-width: 90px" @click="toAdd">新增配置</el-button>
          <!--<el-button type="success" size="mini" style="margin: 2px 12px;max-width: 90px" @click="toEdit">编辑配置</el-button>-->
          <el-popover
            ref="popver"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs['popver'].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="toDel">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini" style="margin: 2px 12px;max-width: 90px">删除配置</el-button>
          </el-popover>
        </el-col>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card class="card">
        <div v-if="read" style="display: inline-block;margin: 0px 8px;width: 97%">
          <el-button size="mini" class="filter-item" type="primary" icon="el-icon-edit" @click="toEdit">编辑</el-button>
          <el-button size="mini" class="filter-item" type="primary" icon="el-icon-edit" @click="toDeploy">发布</el-button>
          <el-button size="mini" class="filter-item" type="primary" icon="el-icon-edit" @click="toHistory">历史版本</el-button>
          <el-select v-model="mode_type" size="mini" placeholder="请选择语言类型" style="float: right" @change="selectModeType">
            <el-option
              v-for="item in mode_types"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div >
        <div v-else style="display: inline-block;margin: 0px 8px;">
          <el-button size="mini" class="filter-item" type="primary" icon="el-icon-edit" @click="toSave">保存</el-button>
          <el-button size="mini" class="filter-item" type="primary" icon="el-icon-edit" @click="toCancel">返回</el-button>
        </div>
        <editor v-if="loadtext" ref="Editor" :value="content" :mode ="mode_type" :read = "read" :theme="theme" class="code"></editor>
      </el-card>
    </el-col>
    <eForm ref="ruleForm" :is-show.sync="dialog" :is-add="isadd"></eForm>
    <deploy ref="ruleDeploy" :is-show.sync="deploy_dialog" :curobj ="cur_obj"></deploy>
  </el-row>
</template>
<script>

import { get, add, del } from '@/api/data'
import editor from '@/components/editor'
import eForm from './form'
import deploy from './deploy'

export default {
  name: 'Edit',
  components: { editor, eForm, deploy },
  data() {
    return {
      base_url: 'api/process/config/',
      defaultProps: {
        children: 'children',
        label: 'label_cn'
      },
      theme: 'base16-dark',
      deploy_dialog: false,
      dialog: false,
      data: [],
      isadd: true,
      openadd: false,
      openrenmae: false,
      rename_data: {},
      is_diable: true,
      cur_obj: {},
      content: '',
      mode_type: '',
      delLoading: false,
      mode_types: [{ label: 'shell', value: 'shell' }, { label: 'yaml', value: 'yaml' }],
      read: true,
      loadtext: true,
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.$nextTick(() => {
      this.getPath()
    })
  },
  methods: {
    getPath() {
      get(this.base_url, { related_project: this.$route.query.id }).then(res => {
        this.data = res.detail
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label_cn.indexOf(value) !== -1
    },
    getContent(obj) {
      this.is_diable = true
      this.cur_obj = obj
      if (obj.path_type === 'file') {
        this.selectModeType(this.cur_obj.path)
        get('/api/process/config/getcontent', { path: obj.path }).then(res => {
          this.content = res.detail
        })
      }
      if (obj.level > 1 && obj.edit_type === 'roles') {
        this.is_diable = false
      }
    },
    toAdd() {
      this.dialog = true
      this.isadd = true
    },
    toEdit() {
      if (!this.content) {
        this.$message({
          showClose: true,
          message: '请选择需要编辑的文件',
          type: 'warning'
        })
      } else {
        this.read = false
      }
    },
    toDeploy() {
      if (!this.cur_obj || this.cur_obj.path_type !== 'file') {
        this.$message({
          showClose: true,
          message: '请选择需要发布的文件',
          type: 'warning'
        })
      } else {
        this.deploy_dialog = true
        this.$refs['ruleDeploy'].getDeployConfig()
      }
    },
    toHistory() {
      console.log(this)
    },
    toCancel() {
      this.read = true
    },
    toSave() {
      this.cur_obj['content'] = this.content
      add('api/process/config/writecontent/', this.cur_obj).then(res => {
        this.result = res.code
        if (this.result === 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.read = true
        }
      })
    },
    selectModeType(path = '') {
      if (path) {
        if (path.endsWith('py')) {
          this.mode_type = 'python'
        } else if (path.endsWith('sh')) {
          this.mode_type = 'shell'
        } else if (path.endsWith('yaml') || path.endsWith('yml')) {
          this.mode_type = 'yaml'
        } else {
          this.mode_type = 'shell'
        }
      }
      this.loadtext = false
      this.$nextTick(() => {
        this.loadtext = true
      })
    },
    toDel() {
      del(this.base_url, this.cur_obj.edit_type).then(res => {
        this.result = res.code
        if (this.result === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      })
      this.getPath()
      this.cur_obj = ''
      this.read = true
      this.$refs['popver'].doClose()
    }
  }
}
</script>
<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
  .code {
    padding: 10px;
    line-height: 20px;
  }
  .card {
    height:530px;
    margin:10px 0px 0px 10px;
    border: 1px solid #eee
  }

</style>
