import { get } from '@/api/data'

export default {
  data() {
    return {
      template_url: '',
      download_object: '',
      download_path: '',
      file_name: ''
    }
  },
  methods: {
    get_template_download_path(url, object) {
      get(url, { object: object, type: 'import' }).then(res => {
        this.download_path = res.results[0]['path']
        const index = this.download_path.lastIndexOf('\/')
        this.file_name = decodeURIComponent(this.download_path).substring(index + 1, this.download_path.length)
      })
    }
  }
}
