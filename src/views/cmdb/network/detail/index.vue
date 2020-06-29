<template>
  <div class="tab-container">
    <el-card>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="设备信息" name="tab_base">
          <Base v-if="isbase" ref="form_base"/>
        </el-tab-pane>
        <el-tab-pane label="用户信息" name="tab_password">
          <Password v-if="ispassword" />
        </el-tab-pane>
        <el-tab-pane label="备份信息" name="tab_backup">
          <Backup v-if="isbackup" />
        </el-tab-pane>
        <el-tab-pane label="变更记录" name="tab_log">
          <Log v-if="islog"></Log>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import Base from './detail_base'
import Log from './detail_log'
import Password from './detail_password'
import Backup from './detail_backup'

export default {
  name: 'Tab',
  components: { Base, Log, Password, Backup },
  data() {
    return {
      dialog: false,
      loading: false,
      activeName: 'tab_base',
      isbase: true,
      ispassword: false,
      islog: false,
      isinstance: false,
      isbackup: false
    }
  },
  methods: {
    handleClick(tab) {
      if (tab.name === 'tab_base') {
        this.isbase = true
        this.ispassword = false
        this.islog = false
        this.isbackup = false
      } else if (tab.name === 'tab_password') {
        this.isbase = false
        this.ispassword = true
        this.islog = false
        this.isbackup = false
      } else if (tab.name === 'tab_log') {
        this.isbase = false
        this.ispassword = false
        this.islog = true
        this.isbackup = false
      } else if (tab.name === 'tab_backup') {
        this.isbase = false
        this.ispassword = false
        this.islog = false
        this.isbackup = true
      }
    }
  }
}
</script>
<style >
  @import '../../common/css/tab.css';
</style>
