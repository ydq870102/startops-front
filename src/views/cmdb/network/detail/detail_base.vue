<template>
  <div class="attribute-wrapper">
    <el-form ref="form" :model="form_base" size="small" label-width="98px">
      <div class="attribute-group">
        <h3 class="title">基础属性</h3>
        <el-row>
          <el-col :span="12">
            <el-form-item label="资产名称">
              <el-input v-model="form_base.label_cn" :readonly="is_Readonly" style="width: 300px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备UUID" >
              <el-input v-model="form_base.uuid" :disabled="true" :readonly="is_Readonly" style="width: 300px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="IP地址">
              <el-input v-model="form_base.ip" :readonly="is_Readonly" style="width: 300px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用途" >
              <el-input v-model="form_base.use_for" :readonly="is_Readonly" style="width: 300px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="环境">
              <el-input v-model="form_base.env" :readonly="is_Readonly" style="width: 300px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" >
              <el-input v-model="form_base.status" :readonly="is_Readonly" style="width: 300px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备管理员">
              <el-input v-model="form_base.device_manager" :readonly="is_Readonly" style="width: 300px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" >
              <el-input v-model="form_base.remark" :readonly="is_Readonly" style="width: 300px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属机房">
              <el-select v-model="form_base.related_room_id" :disabled="is_Readonly" style="width: 300px" placeholder="请选择机房">
                <el-option v-for="item in room_list" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属区域">
              <el-select v-model="form_base.related_zone_id" :disabled="is_Readonly" style="width: 300px" placeholder="请选择网络区域">
                <el-option v-for="item in zone_list" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="attribute-group">
        <h3 class="title">资产属性</h3>
        <el-row>
          <el-col :span="12">
            <el-form-item label="采购成本">
              <el-input v-model="form_base.purchase_cost" :readonly="is_Readonly" style="width: 300px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备标签">
              <el-input v-model="form_base.device_label" :readonly="is_Readonly" style="width: 300px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="供货商">
              <el-input v-model="form_base.provider" :readonly="is_Readonly" style="width: 300px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维保供应商">
              <el-input v-model="form_base.Maintenance_supplier" :readonly="is_Readonly" style="width: 300px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="资产类型">
              <el-input v-model="form_base.assets_type" :readonly="is_Readonly" style="width: 300px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产细分类型">
              <el-input v-model="form_base.assets_sub_type" :readonly="is_Readonly" style="width: 300px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备序列号">
              <el-input v-model="form_base.sn" :readonly="is_Readonly" style="width: 300px;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="厂家">
              <el-input v-model="form_base.vendor" :readonly="is_Readonly" style="width: 300px;"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="购买时间">
              <el-date-picker
                v-model="form_base.buy_time"
                :disabled="is_Readonly"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                style="width: 300px;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="过保修期">
              <el-date-picker
                v-model="form_base.expire_date"
                :disabled="is_Readonly"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                style="width: 300px;">
              </el-date-picker>
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
          <el-button v-if="checkPermission(['admin','network_all','network_edit']) && button == 'edit'" type="primary" @click="edit">编辑</el-button>
          <el-button v-if="checkPermission(['admin','network_all','network_edit']) && button == 'save'" type="success" @click="doSubmit">保存</el-button>
          <el-button v-if="checkPermission(['admin','network_all','network_edit']) && button == 'save'" type="warning" @click="cancel">取消</el-button>
          <el-button v-if="checkPermission(['admin','network_all','network_edit']) && button == 'edit'" @click="closeTag">返回</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import detail_edit from '@/mixins/detail_edit'
import permission from '@/mixins/permission'
import { retrieve, edit } from '@/api/data'
import related from '../../common/js/related'
export default {
  name: 'Base',
  mixins: [permission, detail_edit, related],
  data() {
    return {
      base_url: 'api/cmdb/network/',
      loading: false,
      button: 'edit',
      is_Readonly: true,
      form_base: {}
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
      this.getAllRoom()
      this.getAllZone()
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
