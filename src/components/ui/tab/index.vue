<template>
  <div class="tab2" style="border: none;">
    <div class="tab2-head">
      <el-tabs style="height: 100%" >
        <el-tab-pane label="基础属性">
          <slot name="base"/>
        </el-tab-pane>
        <el-tab-pane label="关联信息" >
          <slot name="related"/>
        </el-tab-pane>
        <el-tab-pane label="告警信息" >
          <slot name="alarm"/>
        </el-tab-pane>
        <el-tab-pane label="变更记录" >
          <slot name="log"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Tab'
}
</script>
<style  >
  .tab2{
    border: 1px solid #c3cdd7;
    border-radius: 2px;
    background: #fff;
    height: 100%;
  }
  .tab2-head {
    margin: 20px;
    position: relative;
    /*border-bottom: 1px solid #c3cdd7;*/
    height: 58px;
  }
  .el-tabs__header {
    padding: 0;
    position: relative;
    margin: 0 35px 10px;
  }
  .el-tabs__item {
    padding: 0 27px;
    height: 55px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 40px;
    display: inline-block;
    list-style: none;
    font-size: 14px;
    font-weight: 500;
    color: #757575;
    position: relative;
  }
  .attribute-wrapper{
    padding: 0 0 0 16px;
    height: 75%;
    overflow:auto;
  }
  .attribute-group{
    padding: 20px 0 0;
  }
  .attribute-group .title {
    margin-left: 20px;
    font-size: 14px;
    line-height: 14px;
    overflow: visible;
    color: #333948;
    font-weight:bold;
  }

  .attribute-list {
    padding: 4px 0;
  }

  .clearfix {
    /*display: inline-block;*/
    display: block;
    zoom: 1;
  }

  .attribute-list .attribute-item {
    width: 35%;
    font-size: 13px;
    line-height: 20px;
    margin: 12px 20px 1px;
    white-space: nowrap;
    list-style-type: none;
    float: left;
  }

  .attribute-list .attribute-item .attribute-item-label {
    width: 90px;
    color: #6b7baa;
    text-align: right;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 10px;
  }
  .attribute-list .attribute-item .attribute-item-value{
    max-width: 80%;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #4d597d;
  }
  .attribute-btn-group{
    position: absolute;
    bottom: 0;
    right: 0;
    height: 62px;
    width: 100%;
    background-color: #f9f9f9;
    padding: 14px 20px;
  }
  .el-tab-pane{
    height: calc(100% - 40px);
    margin-bottom: 62px;
  }
  .el-form-item__label {
    text-align: right;
    float: left;
    font-size: 12px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .el-form-item__content {
    line-height: 40px;
    position: relative;
    font-size: 14px;
    width: 75%;
    margin-left: 20px;
  }
  .el-form--label-top .el-form-item__label {
    float: none;
    display: inline-block;
    text-align: left;
    padding: 5px 20px 15px;
    color: #737987;
    line-height: 12px;
    font-size: 12px;
  }
  .filter-container {
    margin-bottom: 6px;
  }
</style>
