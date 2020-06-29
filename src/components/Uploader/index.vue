<template>
  <uploader :options="options" :auto-start="false" class="uploader-example" @file-added="onFileAdded" @change="onChange">
    <uploader-unsupport></uploader-unsupport>
    <uploader-drop>
      <p>Drop files here to upload or</p>
      <uploader-btn>选择文件</uploader-btn>
      <uploader-btn :directory="true">选择文件夹</uploader-btn>
    </uploader-drop>
    <uploader-list></uploader-list>
  </uploader>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  props: {
    // 标题
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options: {
        // https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js
        target: this.url,
        testChunks: false,
        headers: {
          Authorization: 'Bearer ' + getToken()
        }
      },
      attrs: {
        accept: 'image/*'
      }
    }
  },
  methods: {
    fileUpload() {
    },
    onFileSuccess(rootFile, file, message, chunk) {
    },
    onFileAdded(file, event) {
    },
    onChange(event) {
    }
  }
}
</script>

<style>
  .uploader-example {
    width: 880px;
    padding: 15px;
    margin: 0px auto 0;
    font-size: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }
  .uploader-example .uploader-btn {
    margin-right: 4px;
  }
  .uploader-example .uploader-list {
    min-height: 120px;
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
