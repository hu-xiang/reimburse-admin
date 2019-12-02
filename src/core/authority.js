import Vue from 'vue'

Vue.prototype.$auths = (key) => {
	const resourceCodes = sessionStorage.getItem('resourceCodes');
	return (key && resourceCodes && resourceCodes.includes(key));
};