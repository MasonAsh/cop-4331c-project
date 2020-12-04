import settings from './settings';
import axios from 'axios';

export function get(target) {
    let config = {};

    let authtoken = localStorage.getItem("authtoken");
    if (authtoken != null) {
        config.headers = {
            Authorization: authtoken
        }
    }

    return axios.get(settings.apiEndpoint + target, config)
}

export function post(target, payload) {
    let config = {};

    let authtoken = localStorage.getItem("authtoken");
    if (authtoken != null) {
        config.headers = {
            Authorization: authtoken
        }
    }

    return axios.post(settings.apiEndpoint + target, payload, config);
}