import Vue from 'vue';
import './ajax.js'
import './authority.js'
import './loading.js'
import depart from '../components/common/select/depart.vue';
import rank from '../components/common/select/rank.vue';
import position from '../components/common/select/position.vue';
import topBar from '../components/common/topBar.vue';
import tableBar from '../components/common/tableBar.vue';
import contentBar from '../components/common/contentBar.vue';
import contentItem from '../components/common/contentItem.vue';

Vue.component('depart', depart);
Vue.component('rank', rank);
Vue.component('position', position);
Vue.component('top-bar', topBar);
Vue.component('table-bar', tableBar);
Vue.component('content-bar', contentBar);
Vue.component('content-item', contentItem);
