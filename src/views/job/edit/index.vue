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
              :allow-drop="allowDrop"
              :allow-drag="allowDrag"
              draggable
              accordion
              style="margin-top:20px;"
              @current-change="getContent"
              @node-drop="handleDrop">
            </el-tree>
          </div>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" size="mini" style="margin: 2px 12px;max-width: 90px" @click="openAddNode">新增节点</el-button>
          <el-button type="success" size="mini" style="margin: 2px 12px;max-width: 90px" @click="renameNode">编辑名称</el-button>
          <el-popover
            ref="popver"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs['popver'].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="delNode">确定</el-button>
            </div>
            <el-button slot="reference" :disabled="is_diable" type="danger" size="mini" style="margin: 2px 12px;max-width: 90px">删除节点</el-button>
          </el-popover>
        </el-col>
        <addNode :is-show.sync="openadd" :parent_path="cur_obj.path" :parent_name="cur_obj.label_cn" @refresh="getPath"/>
        <renameNode :is-show.sync="openrenmae" :parent_path="cur_obj.path" :parent_name="cur_obj.label_cn" @refresh="getPath"/>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card class="card">
        <div v-if="read" style="display: inline-block;margin: 0px 8px;">
          <el-button size="mini" class="filter-item" type="primary" icon="el-icon-edit" @click="toEdit">编辑</el-button>
          <el-select v-model="mode_type" size="mini" placeholder="请选择语言类型" @change="selectModeType">
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
  </el-row>
</template>
<script>
import { get, add } from '@/api/data'
import editor from '@/components/editor'
import addNode from './module/addform'
import renameNode from './module/renameform'
export default {
  name: 'Edit',
  components: { editor, addNode, renameNode },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label_cn'
      },
      data: [],
      openadd: false,
      openrenmae: false,
      rename_data: {},
      is_diable: true,
      cur_obj: '',
      content: '',
      mode_type: '',
      delLoading: false,
      mode_types: [{ label: 'python', value: 'python' }, { label: 'shell', value: 'shell' }, { label: 'javascript', value: 'javascript' }, { label: 'yaml', value: 'yaml' }],
      read: true,
      loadtext: true,
      theme: 'base16-dark',
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
      get('api/edit/', { path_type: 'roles' }).then(res => {
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
        get('/api/edit/getcontent', { path: obj.path }).then(res => {
          this.content = res.detail
        })
      }
      if (obj.level > 1 && obj.edit_type === 'roles') {
        this.is_diable = false
      }
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
    toCancel() {
      this.read = true
    },
    toSave() {
      this.cur_obj['content'] = this.content
      add('api/edit/writecontent/', this.cur_obj).then(res => {
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
    openAddNode() {
      if (this.cur_obj.path_type === 'dir') {
        this.openadd = true
      } else {
        this.$message({
          message: '请选择需要增加的父节点',
          type: 'warning'
        })
      }
    },
    renameNode() {
      if (this.cur_obj.level === 0) {
        this.$message({
          message: '不允许修改根节点名称',
          type: 'warning'
        })
        return
      }
      this.openrenmae = true
    },
    delNode() {
      this.delLoading = true
      add('api/edit/delnode/', this.cur_obj).then(res => {
        this.result = res.code
        if (this.result === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getPath()
          this.cur_obj = ''
          this.read = true
        }
        console.log(this)
        this.$refs['popver'].doClose()
        this.delLoading = false
      })
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.path_type === 'dir') {
        return true
      }
    },
    allowDrag(node) {
      if (node.data.level === 0 || (node.data.level === 1 && node.parent.data.label_cn === 'roles')) {
        this.$message({
          message: '根节点不允许移动',
          type: 'warning'
        })
        return false
      } else {
        console.log(node)
        return true
      }
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      this.rename_data['src_path'] = draggingNode.data.path
      this.rename_data['dest_path'] = dropNode.data.path
      add('api/edit/movenode/', this.rename_data).then(res => {
        this.result = res.code
        if (this.result === 200) {
          this.$message({
            message: '移动成功',
            type: 'success'
          })
          this.rename_data = {}
        }
      })
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
