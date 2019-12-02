// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import i18n from './i18n/i18n'
import './mixin'
import api from './assets/js/common.js' // 公共js
import './assets/css/common.scss' // 公共css
import './core';
import { log } from 'util';

Vue.prototype.api = api;

// Date对象的toJSON方法
Date.prototype.toJSON = function () {
	return this.toString();
}

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	i18n,
	components: {
		App
	},
	template: '<App/>'
})