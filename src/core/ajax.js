import Vue from 'vue'
import axios from 'axios'
import router from '../router'
import ElementUI from 'element-ui';
Vue.use(ElementUI);
import qs from 'qs';

const axiosBaseUrl = "http://192.168.48.89:8080/jeecg-boot";
axios.defaults.baseURL = axiosBaseUrl;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.timeout = 30 * 1000;

let loadingInstance = null;

axios.interceptors.request.use((config) => {
	loadingInstance = ElementUI.Loading.service({});
	if (sessionStorage.getItem('token')) {
		config.headers.common['X-Access-Token'] = sessionStorage.getItem('token');
	}
	return config;
}, (error) => {
	Promise.reject(error);
});

axios.interceptors.response.use(response => {
	setTimeout(() => {
		loadingInstance.close();
		if (response.data && !response.data.success) {
			ElementUI.Message.error({
				message: response.data.message || '请求数据异常，请稍后再试！！',
				duration: 3000,
				showClose: true
			});
		}
	}, 500)
	return response.data;
}, error => {
	const errorRes = error.response.data;
	if (errorRes.message === 'Token失效，请重新登录') {
		router.push('/');
		ElementUI.Message.error({
			message: 'Token失效，请重新登录！！',
			duration: 3000,
			showClose: true
		});
	} else {
		ElementUI.Message.error({
			message: '服务器异常，请稍后再试！！',
			duration: 3000,
			showClose: true
		});
	}
	loadingInstance.close();
});

Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;