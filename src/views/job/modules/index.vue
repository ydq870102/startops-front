<template>
  <el-row>
    <el-col :span="8">
      <el-card class="card">
        <el-row>
          <span style="font-weight: bold;font-size:14px;">选择主机组</span>
        </el-row>
        <el-row>
          <el-select v-model="group" placeholder="请选择主机组" clearable size="small" style="width: 100%" @change="SetHost">
            <el-option
              v-for="item in group_list"
              :key="item.id"
              :label="item.label_cn"
              :value="item.id">
            </el-option>
          </el-select>
        </el-row>
        <el-row>
          <span style="font-weight: bold;font-size:14px;">选择主机</span>
        </el-row>
        <el-row>
          <el-select v-model="host" multiple placeholder="请选择主机" size="small" style="width: 100%;">
            <el-option
              v-for="item in host_list"
              :key="item.id"
              :label="item.related_host_id.ip"
              :value="item.id">
            </el-option>
          </el-select>
        </el-row>
        <el-row>
          <span style="font-weight: bold;font-size:14px;">选择模块</span>
        </el-row>
        <el-row>
          <el-select v-model="module" placeholder="请选择模块" clearable size="small" filterable allow-create style="width: 100%;" @change="SetModule">
            <el-option
              v-for="item in module_list"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-row>
        <el-row v-show="is_script">
          <span style="font-weight: bold;font-size:14px;">选择脚本</span>
        </el-row>
        <el-row v-show="is_script">
          <el-select v-model="script" placeholder="请选择脚本" clearable size="small" filterable style="width: 100%;">
            <el-option
              v-for="item in script_list"
              :key="item.id"
              :label="item.label_cn"
              :value="item.id">
            </el-option>
          </el-select>
        </el-row>
        <el-row v-show="is_playbook">
          <span style="font-weight: bold;font-size:14px;">选择Playbook</span>
        </el-row>
        <el-row v-show="is_playbook">
          <el-select v-model="playbook" placeholder="请选择Playbook" clearable size="small" filterable style="width: 100%;">
            <el-option
              v-for="item in playbook_list"
              :key="item.id"
              :label="item.label_cn"
              :value="item.id">
            </el-option>
          </el-select>
        </el-row>
        <el-row>
          <span style="font-weight: bold;font-size:14px;">输入参数</span>
        </el-row>
        <el-row>
          <el-input v-model="vars" placeholder="请输入参数" size="small" style="width: 100%;"></el-input>
        </el-row>
        <el-row>
          <el-button size="small" class="filter-item" type="primary" icon="el-icon-plus" @click="runModule">执行</el-button>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card class="card">
        <el-row class="console">
          <pre v-html="content"></pre>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import { retrieve, get } from '@/api/data'
import { mapGetters } from 'vuex'
export default {
  name: 'ModuleRun',
  data() {
    return {
      base_url: 'api/inventory/',
      group_list: [],
      host_list: [],
      module_list: [{ label: 'shell', value: 'shell' }, { label: 'ping', value: 'ping' }, { label: 'yum', value: 'yum' }, { label: 'script', value: 'script' }, { label: 'playbook', value: 'playbook' }],
      script_list: [],
      playbook_list: [],
      playbook: '',
      script: '',
      group: '',
      host: [],
      module: '',
      vars: '',
      content: '',
      websock: null,
      is_script: false,
      is_playbook: false,
      wsuri: ''
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
      this.getGroup()
    })
  },
  methods: {
    getGroup() {
      get(this.base_url, { size: 10000 }).then(res => {
        this.group_list = res.results
        this.group_list.push({ id: '-1', label_cn: '自定义' })
      })
    },
    SetHost(group) {
      this.host = []
      if (group === '-1') {
        get('/api/cmdb/password/', { 'is_ansible': 1 }).then(res => {
          this.host_list = res.results
        })
      } else if (group) {
        retrieve(this.base_url, group).then(res => {
          console.log(res.related_host)
          this.host_list = res.related_host
        })
      }
    },
    SetModule(module) {
      if (module === 'script') {
        this.is_script = true
        this.is_playbook = false
        get('/api/scripts/', { size: 10000 }).then(res => {
          this.script_list = res.results
        })
      } else if (module === 'playbook') {
        this.is_playbook = true
        this.is_script = false
        get('/api/playbook/', { size: 10000 }).then(res => {
          this.playbook_list = res.results
        })
      } else {
        this.is_script = false
        this.is_playbook = false
      }
    },
    runModule() {
      if (this.host.length === 0) {
        this.$message({
          showClose: true,
          type: 'warning ',
          message: '请选择执行主机!',
          duration: 2500
        })
        return
      }
      if (!this.module) {
        this.$message({
          showClose: true,
          type: 'warning ',
          message: '请选择执行模块!',
          duration: 2500
        })
        return
      }
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
      const data = {
        group: this.group,
        host: this.host,
        module: this.module,
        var: this.vars,
        script: this.script,
        playbook: this.playbook,
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
<style scoped="scoped" >
  .el-select__tags-text {
    color: #ffffff;
  }
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  .el-select .el-tag {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-color: transparent;
    margin: 2px 0 2px 6px;
    background-color: #409eff;
  }
  .el-tag--info, .el-tag--info  {
    color: #ffffff;
  }
  .console {
    font-family: "Interstate", "Hind", -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol;
    overflow-y: scroll;
    background: #070505;
    color: #f7f7f7;
    width: 100%;
    height: 450px;
    padding: 10px;
    font-size: 14px;
    border-radius: 3px 1px 3px 3px;
  }
  .el-tag--info, .el-tag--info .el-tag__close {
    color: #ffffff;
  }
  .el-aside {
    color: #333;
  }
  .el-row {
    margin: 20px 20px
  }
  .card {
    height:530px;
    margin:10px 0px 0px 10px;
    border: 1px solid #eee
  }
  pre {
    white-space: pre-wrap;
    word-wrap: break-word;

  }
</style>
