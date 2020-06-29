<template>
  <div class="attribute-wrapper">
    <el-form ref="ruleForm" :model="form_base" :rules="rules" size="small" label-width="98px">
      <div class="attribute-group">
        <el-row>
          <el-col :span="12">
            <el-form-item label="Agent类型">
              <el-select v-model="form_base.type" style="width: 300px" filterable placeholder="请选择告警Agent类型">
                <el-option v-for="item in type_list" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属主机">
              <el-select v-model="form_base.related_host_id" style="width: 300px" multiple filterable placeholder="请选择所属主机">
                <el-option v-for="item in host_list" :key="item.id" :label="item.related_host_id.ip" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item>
        <div style="display: inline-block;margin: 20px 0px;float: left">
          <el-button v-if="checkPermission(['admin','database_all','database_edit'])" type="primary" @click="toDeploy">部署</el-button>
          <el-button v-if="checkPermission(['admin','database_all','database_edit'])" @click="closeTag">返回</el-button>
        </div>
      </el-form-item>
    </el-form>
    <el-card>
      <el-row class="console">
        <pre v-html="content"></pre>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import permission from '@/mixins/permission'
import { get } from '@/api/data'
import { mapGetters } from 'vuex'
export default {
  name: 'Base',
  mixins: [permission],
  data() {
    return {
      content: '',
      base_url: 'api/database/',
      is_Readonly: true,
      host_list: [],
      module: 'playbook',
      form_base: {
        type: this.$route.query.agent_type
      },
      type_list: [{ value: 'nodeAgent', label: 'node' }, { value: 'oracleAgent', label: 'oracle' }, { value: 'mysql', label: 'mysql' }, { value: 'nginx', label: 'nginx' }],
      rules: {
        related_host_id: [
          { required: true, message: '请选择所属主机', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'id',
      'name'
    ])
  },
  created() {
    this.$nextTick(() => {
      this.setHost()
    })
  },
  methods: {
    setHost() {
      get('/api/cmdb/password/', { 'is_ansible': 1 }).then(res => {
        this.host_list = res.results
      })
    },
    closeTag() {
      this.$store.dispatch('delView', this.$store.state.tagsView.visitedViews.slice(-1)[0])
      this.$router.go(-1)
    },
    toDeploy() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.runModule()
        } else {
          return false
        }
      })
    },
    runModule() {
      if (this.module === 'playbook') {
        this.wsuri = process.env.BASE_API.replace('http', 'ws') + '/ws/runplaybook'
      } else {
        this.wsuri = process.env.BASE_API.replace('http', 'ws') + '/ws/runmodule'
      }

      this.websock = new WebSocket(this.wsuri)
      this.content = ''
      this.websock.onopen = this.websocketonopen

      this.websock.onerror = this.websocketonerror

      this.websock.onmessage = this.websocketonmessage
      this.websock.onclose = this.websocketclose
    },
    websocketonopen() {
      console.log(this.form_base)
      const data = {
        group: '-1',
        host: this.form_base.related_host_id,
        module: this.module,
        script: '',
        playbook: this.form_base.type,
        user: this.id
      }
      this.content = this.content + '<code style="color: #ffffff">######################开始执行###########################</code>\n\n'
      if (this.websock.readyState === 1) {
        this.websocketsend(JSON.stringify(data))
      }
    },
    websocketonerror(e) {
      this.content = this.content + '<code style="color: #ff000a">WebSocket连接发生错误</code>\n'
    },
    websocketonmessage(e) {
      const data = e.data.replace(/\\n/gm, '<br>')
      this.content = this.content + data
    },
    websocketsend(agentData) {
      this.websock.send(agentData)
    },
    websocketclose(e) {
      this.content = this.content + '\n\n<code style="color: #ffffff">######################执行完毕###########################</code>\n'
    }
  }
}
</script>

<style>
  .el-select__tags-text {
    color: #409EFF;
  }
  .attribute-wrapper{
    padding: 0 0 0 16px;
    height: 75%;
    overflow:auto;
  }
  .attribute-group{
    padding: 25px 8px 0;
  }
  .attribute-group .title {
    margin-left: 20px;
    font-size: 14px;
    line-height: 14px;
    overflow: visible;
    color: #333948;
    font-weight:bold;
  }
  .el-form-item__label {
    text-align: right;
    float: left;
    font-size: 12px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .el-form-item__content {
    line-height: 40px;
    position: relative;
    font-size: 14px;
    width: 75%;
    margin-left: 20px;
  }
  .el-form--label-top .el-form-item__label {
    float: none;
    display: inline-block;
    text-align: left;
    padding: 5px 20px 15px;
    color: #737987;
    line-height: 12px;
    font-size: 12px;
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 10px;
    margin-left: 23px;
  }
  .el-select:hover .el-input__inner{
    -webkit-appearance: none;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
    height: 32px;
    line-height: 32px;
  }
  .el-select__tags-text {
    color: #409EFF;
  }
  .el-input.is-disabled .el-input__inner {
    color: #606266;
  }
  .el-row {
    margin: 0 0;
  }
  .title {
    margin: 0px auto 40px auto;
    text-align: left;
  }
  .console {
    font-family: "Interstate", "Hind", -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
    overflow-y: scroll;
    background: #070505;
    color: #f7f7f7;
    width: 100%;
    height: 300px;
    padding: 10px;
    font-size: 14px;
    border-radius: 3px 1px 3px 3px;
  }
</style>
