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
    transformResponse: [
        // сначала прогоняем через дефолтные трансформеры (чтобы учесть JSON.stringify, etc.)
        ...axios.defaults.transformResponse,
        (data) => {
            // если тело пустое или это не строка — просто возвращаем «как есть»
            if (typeof data !== 'string' || !data.trim()) {
                return data;
            }
            // пытаемся распарсить и кейс-конвертировать
            try {
                const parsed = JSON.parse(data);
                return camelcaseKeys(parsed, {deep: true});
            } catch (e) {
                // не JSON — возвращаем оригинал
                return data;
            }
        }
    ]
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


// Маппинг ваших DomainErrorCodes → человекочитаемые тексты :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}
const CODE_MESSAGE_MAP = {
    1400: 'Нарушение целостности данных',
    1404: 'Сущность не найдена',
    3000: 'Некорректные данные при обновлении',
    4000: 'Недействительный токен',
    4001: 'Срок действия токена истёк',
    4100: 'Ошибка регистрации',
    4101: 'Имя пользователя уже занято',
    4102: 'Имя пользователя слишком короткое',
    4103: 'Имя пользователя слишком длинное',
    4104: 'Email уже зарегистрирован',
    4105: 'Пароль слишком слабый',
    4106: 'Имя пользователя начинается с недопустимого символа',
    4107: 'Имя пользователя заканчивается на недопустимый символ',
    4108: 'Имя пользователя содержит недопустимый символ',
    4109: 'Неверный формат email',
    4110: 'Недействительный email',
    4111: 'Пароль слишком длинный',
    4200: 'Неверное имя пользователя или пароль',
    4201: 'Email не подтверждён',
    4300: 'Доступ запрещён',
    4301: 'Недостаточно прав для этого действия',
    4302: 'Ресурс не найден',
    4303: 'Аккаунт заблокирован',
    5100: 'Проект не найден',
    5101: 'Проект с таким именем уже существует',
    5102: 'Доступ к проекту запрещён',
    5103: 'Имя проекта слишком короткое',
    5104: 'Имя проекта слишком длинное',
    5105: 'Имя проекта начинается с недопустимого символа',
    5106: 'Имя проекта заканчивается на недопустимый символ',
    5107: 'Имя проекта содержит недопустимый символ',
    5108: 'Описание проекта слишком длинное',
    5200: 'Версия проекта не найдена',
    5201: 'Версия проекта уже существует',
    5300: 'Параметр окружения не найден',
    5301: 'Параметр окружения уже существует',
    5400: 'Неверный формат тега',
    5500: 'Внутренняя ошибка проекта'
};

// глобальная обработка ошибок
axiosInstance.interceptors.response.use(
    response => {
        const {code} = response.data;
        // если код бизнес-ошибки — кидаем
        if (code != null && CODE_MESSAGE_MAP[code]) {
            const err = new Error(CODE_MESSAGE_MAP[code]);
            err.customCode = code;
            err.customMessage = CODE_MESSAGE_MAP[code];
            return Promise.reject(err);
        }
        // иначе — всё ок
        return response;
    },
    error => {
        if (error.response && error.response.data) {
            const {code, message} = error.response.data;
            error.httpStatus = error.response.status;
            error.customCode = code;
            // если в карте — своё сообщение, иначе текст из backend или дефолт
            error.customMessage =
                (code != null && CODE_MESSAGE_MAP[code]) ||
                message ||
                'Произошла неизвестная ошибка, попробуйте ещё раз';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;