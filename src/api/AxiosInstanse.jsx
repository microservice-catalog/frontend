import axios from 'axios';
import camelcaseKeys from "camelcase-keys";

axios.defaults.withCredentials = true;

// Функция для получения cookie по имени
const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
};

const CORE_BASE_URL = "http://localhost:8080/api/v1";  // Базовый URL для вашего API

export const API_URLS = {
    REGISTER: `${CORE_BASE_URL}/auth/register`,
    LOGIN: `${CORE_BASE_URL}/auth/login`,
    REFRESH: `${CORE_BASE_URL}/auth/refresh`,
    CONFIRM_EMAIL: `${CORE_BASE_URL}/auth/confirm`,
    PROJECTS: `${CORE_BASE_URL}/projects`,
    PROFILE: `${CORE_BASE_URL}/profile`,
    ME: `${CORE_BASE_URL}/users/me`,
    LOGOUT: `${CORE_BASE_URL}/auth/logout`
};

export const PROJECT_URL = (userName, projectName) => {
    return `${API_URLS.PROJECTS}/${userName}/${projectName}`
};

// Создаем axios экземпляр
const axiosInstance = axios.create({
    baseURL: CORE_BASE_URL,
    withCredentials: true,  // Обязательно для работы с cookie
    transformResponse: [data => {
        // data — это строка JSON
        const parsed = JSON.parse(data)
        // рекурсивно преобразует все ключи в camelCase
        return camelcaseKeys(parsed, { deep: true })
    }]
});

// Добавляем токен в заголовки каждого запроса
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = getCookie('dockins_access_token');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;