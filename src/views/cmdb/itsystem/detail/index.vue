<template>
  <div class="tab-container">
    <el-card>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="设备信息" name="tab_base">
          <Base v-if="isbase" ref="form_base"/>
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
export default {
  name: 'Tab',
  components: { Base, Log },
  data() {
    return {
      dialog: false,
      loading: false,
      activeName: 'tab_base',
      isbase: true,
      isrelated: false,
      islog: false
    }
  },
  methods: {
    handleClick(tab) {
      if (tab.name === 'tab_base') {
        this.isbase = true
        this.isrelated = false
        this.islog = false
      } else if (tab.name === 'tab_related') {
        this.isbase = false
        this.isrelated = true
        this.islog = false
      } else if (tab.name === 'tab_log') {
        this.isbase = false
        this.isrelated = false
        this.islog = true
      }
    }
  }
}
</script>
<style >
  @import '../../common/css/tab.css';
</style>
