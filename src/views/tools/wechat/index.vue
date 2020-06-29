<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-card style="height: 480px">
          <el-form ref="ruleForm" :model="form_data" :rules="rules" size="small" label-width="100px">
            <el-form-item label="企业微信号" prop="title">
              <el-select v-model="form_data.related_process" placeholder="请选择企业微信程序" style="width: 360px;" >
                <el-option
                  v-for="item in wechatprocess_list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="消息类型" prop="title">
              <el-select v-model="form_data.message_type" placeholder="请选择消息类型" style="width: 360px;">
                <el-option
                  v-for="item in media_tupes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="标题" prop="title">
              <el-input v-model="form_data.title" placeholder="" style="width: 360px;"/>
            </el-form-item>
            <el-form-item label="url" prop="url">
              <el-input v-model="form_data.url" placeholder="" style="width: 360px;"/>
            </el-form-item>
            <el-form-item label="用户" prop="to_user">
              <el-input v-model="form_data.to_user" placeholder="" style="width: 360px;"/>
              <el-tooltip content="多个用户ID以'| '为分割线" placement="top">
                <i class="el-icon-warning"></i>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="正文" prop="content">
              <el-input :rows="2" v-model="form_data.content" type="textarea" placeholder="" style="width: 360px;"/>
            </el-form-item>
            <el-form-item v-show="form_data.message_type===1" label="上传图片" prop="picid">
              <el-upload
                :headers="headers"
                :file-list="fileList"
                :limit="1"
                :on-success="handleSuccess"
                :action="pic_post_url"
                class="upload-demo">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
          <el-button :loading="loading" type="primary" style="margin-left: 100px" @click="to_chat()">推送</el-button>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="margin-left: 20px;height: 480px">
          <el-row style="font-weight: bold;height: 40px">
            <span >推送结果</span>
          </el-row>
          <el-row>
            <span >{{ result }}</span>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row style="margin-top: 20px">
      <el-table v-loading="loading" ref="table" :data="data" size="small" border style="width: 100%;" >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="url">
                <span>{{ props.row.url }}</span>
              </el-form-item>
              <el-form-item label="正文">
                <span>{{ props.row.content }}</span>
              </el-form-item>
              <el-form-item label="推送结果">
                <span>{{ props.row.result }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="related_process" label="企业微信号" align="center"/>
        <el-table-column prop="title" label="标题" align="center"/>
        <el-table-column prop="to_user" label="用户" align="center"/>
        <el-table-column prop="create_time" label="操作时间" align="center"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="topush(scope.row)">重新推送</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <el-pagination
        :total="total"
        style="margin-top: 8px;"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"/>
    </el-row>
  </div>
</template>

<script>
import { add, get } from '@/api/data'
import initData from '@/mixins/initData'
export default {
  mixins: [initData],
  data() {
    return {
      loading: false,
      wechatprocess_list: [],
      media_tupes: [{ value: 0, label: '卡片信息' }, { value: 1, label: '图文信息' }],
      result: '',
      fileList: [],
      dialogImageUrl: '',
      pic_post_url: process.env.BASE_API.replace() + '/api/wechatmedia/',
      base_url: 'api/wechathistory/',
      post_url: 'api/wechat/',
      form_data: {
        'related_process': '',
        'message_type': '',
        'picid': '',
        'title': '',
        'content': '',
        'url': '',
        'to_user': ''
      },
      rules: {
        label_cn: [
          { required: true, message: '请输入企业微信ID', trigger: 'blur' },
          { required: true, message: '请输入Secret', trigger: 'blur' },
          { required: true, message: '请输入AgentId', trigger: 'blur' },
          { required: true, message: '请输入标题', trigger: 'blur' },
          { required: true, message: '请输入正文内容', trigger: 'blur' },
          { required: true, message: '请输入URL', trigger: 'blur' },
          { required: true, message: '请输入发送的用户ID', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
      this.getAllprocesses()
    })
  },
  methods: {
    beforeInit() {
      const sort = '-create_time'
      this.params = { page: this.page, size: this.size, ordering: sort }
      return true
    },
    getAllprocesses() {
      if (Array.isArray(this.wechatprocess_list) && this.wechatprocess_list.length === 0) {
        get('api/wechatprocess/', { size: 10000 }).then(res => {
          const _this = this
          res.results.forEach(function(data, index) {
            const wechatprocess = { value: data.id, label: data.label_cn }
            _this.wechatprocess_list.push(wechatprocess)
          })
        })
      }
    },
    // handleProcessChange(value) {
    //   return new Promise((resolve, reject) => {
    //     get('api/wechattoken/', { related_process: value }).then(res => {
    //       const token = res.detail
    //       this.pic_post_url = 'https://qyapi.weixin.qq.com/cgi-bin/media/upload?access_token=' + token + '&type=image'
    //       // this.pic_post_url = process.env.BASE_API.replace() + '/api/wechatmedia/'
    //       resolve(res)
    //     }).catch(err => {
    //       console.log(err)
    //       reject(err)
    //     })
    //   })
    // },

    handleSuccess(response, file, fileList) {
      this.form_data.picid = response.file
    },
    // handleBeforeUpload(file) {
    //   if (this.form_data.related_process) {
    //     return new Promise((resolve, reject) => {
    //       get('api/wechattoken/', { related_process: this.form_data.related_process }).then(res => {
    //         // const token = res.detail
    //         // this.pic_post_url = 'https://qyapi.weixin.qq.com/cgi-bin/media/upload?access_token=' + token + '&type=image'
    //         this.pic_post_url = process.env.BASE_API.replace() + '/api/wechatmedia/'
    //         setTimeout(() => {
    //           this.loading = false
    //         }, this.time)
    //         resolve(res)
    //       }).catch(err => {
    //         console.log(err)
    //         reject(err)
    //       })
    //     })
    //   } else {
    //     return false
    //   }
    // },
    to_chat() {
      this.result = ''
      this.loading = true
      add(this.post_url, this.form_data).then(res => {
        this.result = res.detail
      })
      this.loading = false
    },
    topush(row) {
      this.form_data = Object.assign({}, row)
    }
  }
}
</script>

<style scoped="scoped">
  .el-upload--picture-card {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 58px;
    height: 58px;
    line-height: 146px;
    vertical-align: top;
  }
</style>
