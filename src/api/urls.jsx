export const CORE_BASE_URL = "http://localhost:8080/api/v1";  // Базовый URL для вашего API

export const API_URLS = {
    REGISTER: `${CORE_BASE_URL}/auth/register`,
    LOGIN: `${CORE_BASE_URL}/auth/login`,
    REFRESH: `${CORE_BASE_URL}/auth/refresh`,
    CONFIRM_EMAIL: `${CORE_BASE_URL}/auth/confirm`,
    PROJECTS: `${CORE_BASE_URL}/projects`,
    USERS: `${CORE_BASE_URL}/users`,
    PROFILE: `${CORE_BASE_URL}/profile`,
    LOGOUT: `${CORE_BASE_URL}/auth/logout`,
    PHOTOS: `${CORE_BASE_URL}/photos`,
    TAGS: `${CORE_BASE_URL}/projects/tags`,
};

export const PROJECT_URL = (username, projectName, versionName = null) => {
    return `${API_URLS.PROJECTS}/${username}/${projectName}${!!versionName ? ('/versions/' + versionName) : ""}`
};