<template>
  <el-dialog :append-to-body="true" :visible="isShow" title="重启服务" width="55%" top="30px" @close="cancel">
    <el-card>
      <el-row>
        <el-col :span="4" style="margin-top: 4px">
          <span style="font-weight: bold;font-size:13px">重启的服务名:</span>
        </el-col>
        <el-col :span="20">
          <span>{{ curobj.label_cn }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" style="margin-top: 15px">
          <span style="font-weight: bold;font-size:13px">选择主机:</span>
        </el-col>
        <el-col :span="20">
          <el-select v-model="host" multiple placeholder="请选择主机" size="small" style="width: 100%;">
            <el-option
              v-for="item in host_list"
              :key="item.id"
              :label="item.related_host_id.ip"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-button size="small" class="filter-item" type="primary" style="float: right;margin-top: 15px" @click="runModule">重启</el-button>
      </el-row>
    </el-card>
    <el-card>
      <el-row class="console">
        <pre v-html="content"></pre>
      </el-row>
    </el-card>
  </el-dialog>
</template>

<script>
import { get } from '@/api/data'
import { mapGetters } from 'vuex'

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    curobj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      host_list: [],
      host: [],
      path: '',
      content: '',
      module: 'systemd',
      vars: 'name=' + this.curobj.service_name + ' state=restarted',
      config: {}
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
    cancel() {
      this.$emit('update:isShow', false)
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
        group: '-1',
        host: this.host,
        module: this.module,
        var: this.vars,
        script: '',
        playbook: '',
        user: this.id
      }
      console.log(data)
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
<style scoped="scoped">
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
