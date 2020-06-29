<template>
  <div class="attribute-wrapper">
    <el-form ref="form" :model="form_base" size="small" label-width="98px">
      <div class="attribute-group">
        <h3 class="title">基础属性</h3>
        <el-row>
          <el-col :span="12">
            <el-form-item label="机房名称">
              <el-input v-model="form_base.label_cn" :readonly="is_Readonly" style="width: 300px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机房地址" >
              <el-input v-model="form_base.addr" :readonly="is_Readonly" style="width: 300px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="机房联系人">
              <el-input v-model="form_base.room_contact" :readonly="is_Readonly" style="width: 300px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机房联系电话" >
              <el-input v-model="form_base.room_phone" :readonly="is_Readonly" style="width: 300px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否IPSec">
              <el-select v-model="form_base.is_ipsec" :disabled="is_Readonly" style="width: 300px" placeholder="请选择是否IPSec">
                <el-option v-for="item in boolen_type" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否MPLS" >
              <el-select v-model="form_base.is_mpls" :disabled="is_Readonly" style="width: 300px" placeholder="请选择是否MPLS">
                <el-option v-for="item in boolen_type" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="attribute-group">
        <h3 class="title">其他属性</h3>
        <el-row>
          <el-col :span="12">
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="form_base.create_time"
                :disabled="true"
                type="datetime"
                placeholder="选择日期"
                style="width: 300px;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最后修改时间">
              <el-date-picker
                v-model="form_base.last_modify_time"
                :disabled="true"
                type="datetime"
                placeholder="选择日期"
                style="width: 300px;">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-row>
        <el-form-item v-if="form_base.error_message" label="错误信息">
          <el-input v-model="form_base.error_message" :readonly="is_Readonly" style="width: 720px;" type="textarea"/>
        </el-form-item>
      </el-row>
      <el-form-item>
        <div style="display: inline-block;margin: 20px 0px;float: left">
          <el-button v-if="checkPermission(['admin','room_all','room_edit']) && button == 'edit'" type="primary" @click="edit">编辑</el-button>
          <el-button v-if="checkPermission(['admin','room_all','room_edit']) && button == 'save'" type="success" @click="doSubmit">保存</el-button>
          <el-button v-if="checkPermission(['admin','room_all','room_edit']) && button == 'save'" type="warning" @click="cancel">取消</el-button>
          <el-button v-if="checkPermission(['admin','room_all','room_edit']) && button == 'edit'" @click="closeTag">返回</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import permission from '@/mixins/permission'
import { retrieve, edit } from '@/api/data'
export default {
  name: 'Base',
  mixins: [permission],
  data() {
    return {
      base_url: 'api/cmdb/room/',
      loading: false,
      button: 'edit',
      room_list: [],
      zone_list: [],
      itsystem_list: [],
      is_Readonly: true,
      form_base: {},
      boolen_type: [{ label: '是', value: '1' }, { label: '否', value: '0' }]
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      retrieve(this.base_url, this.$route.query.id).then(res => {
        this.form_base = res
      })
    },
    closeTag() {
      this.$store.dispatch('delView', this.$store.state.tagsView.visitedViews.slice(-1)[0])
      this.$router.go(-1)
    },
    cancel() {
      this.button = 'edit'
      this.is_Readonly = true
    },
    edit() {
      this.button = 'save'
      this.is_Readonly = false
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          edit(this.base_url, this.form_base.id, this.form_base).then(res => {
            this.$message({
              showClose: true,
              type: 'success',
              message: '修改成功!',
              duration: 2500
            })
            this.loading = false
            this.is_Readonly = true
            this.button = 'edit'
            this.init()
          }).catch(err => {
            this.loading = false
            console.log(err.response.data.detail)
          })
        }
      })
    }
  }
}
</script>

<style>
  @import '../../common/css/base.css';
</style>
