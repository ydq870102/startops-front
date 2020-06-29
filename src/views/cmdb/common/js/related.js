import { get } from '@/api/data'

export default {
  data() {
    return {
      room_list: [],
      zone_list: [],
      itsystem_list: [],
      section_list: [],
      level_list: [{ value: 'Level1 一般系统', label: 'Level1 一般系统' }, { value: 'Level2 重要系统', label: 'Level2 重要系统' }, { value: 'Level3 核心系统', label: 'Level3 核心系统' }]
    }
  },
  methods: {
    // 获取机房列表
    getAllRoom() {
      if (Array.isArray(this.room_list) && this.room_list.length === 0) {
        get('api/cmdb/room/', { size: 10000 }).then(res => {
          const _this = this
          res.results.forEach(function(data, index) {
            const room = { value: data.id, label: data.label_cn }
            _this.room_list.push(room)
          })
        })
      }
    },
    // 获取网络区域列表
    getAllZone() {
      if (Array.isArray(this.zone_list) && this.zone_list.length === 0) {
        get('api/cmdb/zone/', { size: 10000 }).then(res => {
          const _this = this
          res.results.forEach(function(data, index) {
            const zone = { value: data.id, label: data.label_cn }
            _this.zone_list.push(zone)
          })
        })
      }
    },
    // 获取设备列表
    getAllITsystem() {
      if (Array.isArray(this.itsystem_list) && this.itsystem_list.length === 0) {
        get('api/cmdb/itsystem/', { size: 10000 }).then(res => {
          const _this = this
          res.results.forEach(function(data, index) {
            const itsystem = { value: data.id, label: data.label_cn }
            _this.itsystem_list.push(itsystem)
          })
        })
      }
    },
    // 获取信息系统业务板块字段信息
    getAllSection() {
      if (Array.isArray(this.section_list) && this.section_list.length === 0) {
        get('api/cmdb/itsystememun/', { 'filed': 'section' }).then(res => {
          this.section_list = res.detail
        })
      }
    }
  }
}
