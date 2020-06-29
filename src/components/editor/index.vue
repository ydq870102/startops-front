<template>
  <!-- bidirectional data binding（双向数据绑定） -->
  <codemirror
    ref="myCm"
    :value="value"
    :options="cmOptions"
    @ready="onCmReady"
    @focus="onCmFocus"
    @input="onCmCodeChange">
  </codemirror>
</template>

<script>
// language js
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/shell/shell.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/yaml/yaml.js'
// theme css
import 'codemirror/theme/base16-dark.css'
// more codemirror resources
// import 'codemirror/some-resource...'
// require component
import { codemirror } from 'vue-codemirror'

// require styles
import 'codemirror/lib/codemirror.css'

export default {
  name: 'Editor',
  components: {
    codemirror
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    read: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: this.mode,
        theme: this.theme,
        lineNumbers: true,
        line: true,
        readOnly: this.read
        // more codemirror options, 更多 codemirror 的高级配置...
      }
    }
  },
  methods: {
    onCmReady(cm) {
      return
    },
    onCmFocus(cm) {
      if (this.read === true) {
        cm.options['readOnly'] = true
      } else {
        cm.options['readOnly'] = false
      }
    },
    onCmCodeChange(newCode) {
      this.$parent.$parent.$parent.$parent.content = newCode
    }
  }
}
</script>
<style>
  .CodeMirror {
    /* Set height, width, borders, and global font properties here */
    font-family: monospace;
    position: relative;
    height: 450px;
    width: 100%;
  }
</style>
