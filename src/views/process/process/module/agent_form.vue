<template>
  <el-dialog :append-to-body="true" :visible="isShow" title="安装告警Agent" width="600px" @close="cancel">
    <el-row>
      <el-col :span="6">
        <el-card shadow="always" style="margin: 10px 5px 10px; text-align: center; background:#aee888;color:blue;font-size:12px">
          <a type="primary" @click="toDeploy('nodeAgent')">
            <p><i class="el-icon-plus"></i></p>
            <p>Node Exporter</p>
          </a>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always" style="margin: 10px 5px 10px; text-align: center; background:#aee888;color:blue;font-size:12px">
          <a type="primary" @click="toDeploy('oracle')">
            <p><i class="el-icon-plus"></i></p>
            <p>Oracle Exporter</p>
          </a>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always" style="margin: 10px 5px 10px; text-align: center; background:#aee888;color:blue;font-size:12px">
          <a type="primary" @click="toDeploy('mysql')">
            <p><i class="el-icon-plus"></i></p>
            <p>Mysql Exporter</p>
          </a>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="always" style="margin: 10px 5px 10px; text-align: center; background:#aee888;color:blue;font-size:12px">
          <a type="primary" @click="toDeploy('nginx')">
            <p><i class="el-icon-plus"></i></p>
            <p>Nginx Exporter</p>
          </a>
        </el-card>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      file: ''
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    resetForm() {
      this.$emit('update:isShow', false)
    },
    toDeploy(type) {
      this.$router.push({
        path: 'process/detail',
        query: { agent_type: type }
      })
    }
  }
}
</script>
