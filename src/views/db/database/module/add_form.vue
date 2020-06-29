<template>
  <el-dialog :append-to-body="true" :visible="isShow" title="新增数据库" width="600px" @close="cancel">
    <el-row>
      <el-col :span="12">
        <el-card shadow="always" style="margin: 10px 5px 10px; text-align: center; background:#aee888;color:blue;font-size:13px">
          <a type="primary" @click="toDeploy('ORACLE')">
            <p><i class="el-icon-plus"></i></p>
            <p>ORACLE</p>
          </a>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always" style="margin: 10px 5px 10px; text-align: center; background:#aee888;color:blue;font-size:13px">
          <a type="primary" @click="toDeploy('MYSQL')">
            <p><i class="el-icon-plus"></i></p>
            <p>MYSQL</p>
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
    toDeploy(db_type) {
      this.$router.push({
        path: 'database/deploy',
        query: { db_type: db_type }
      })
    }
  }
}
</script>
