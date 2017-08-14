import Vue from 'vue'
import VueDND from 'awe-dnd'

if (process.BROWSER_BUILD) {
  Vue.use(VueDND)
}
