import axiosInstance, {API_URLS, PROJECT_URL} from './AxiosInstanse.jsx'

export const authApi = {
    // Регистрация нового пользователя.
// Параметры: { username, password, email, ... }
    register: (data) =>
        axiosInstance.post(API_URLS.REGISTER, data),

    // Логин.
// Параметры: { username, password }
    login: (data) =>
        axiosInstance.post(API_URLS.LOGIN, data),

    // Обновление access-token по refresh-token (cookie автоматически отправится).
    refresh: () =>
        axiosInstance.post(API_URLS.REFRESH),

    // Подтверждение e-mail.
// Параметры: { token }
    confirmEmail: (data) =>
        axiosInstance.post(API_URLS.CONFIRM_EMAIL, data),

    // Логаут (удаление сессии).
    logout: () =>
        axiosInstance.post(API_URLS.LOGOUT),
};

export const userApi = {
    getMe: () =>
        axiosInstance.get(`${API_URLS.USERS}/me`),

    getProfile: () =>
        axiosInstance.get(API_URLS.PROFILE),

    getUserProfile: (username) =>
        axiosInstance.get(`${API_URLS.USERS}/${username}`),

    // Обновить профиль.
    updateProfile: (data) =>
        axiosInstance.patch(API_URLS.PROFILE, data),
};

export const projectApi = {
    // Список всех проектов текущего юзера
    getHomeProjects: (page = 0, limit = 20) =>
        axiosInstance.get(API_URLS.PROJECTS, {params: {page, limit}}),

    // Создать новый проект.
    createProject: (data) =>
        axiosInstance.post(API_URLS.PROJECTS, data),

    getProjects: ({page = 0, limit = 20, query, tags} = {}) =>
        axiosInstance.get(API_URLS.PROJECTS, {
            params: {
                page, limit, q: query, t: tags
            }
        }),

    getUserProjects: (username, page = 0, limit = 20) =>
        axiosInstance.get(`${API_URLS.PROJECTS}/${username}`, {params: {page, limit}}),

    // Получить конкретный проект по user и projectName
    getProject: (username, projectName) =>
        axiosInstance.get(PROJECT_URL(username, projectName)),

    // Получить конкретный проект по user и projectName
    getProjectVersion: (username, projectName, versionName) =>
        axiosInstance.get(PROJECT_URL(username, projectName, versionName)),


    getAllVersions: (username, projectName) =>
        axiosInstance.get(PROJECT_URL(username, projectName) + "/versions"),

    // Обновить проект.
    updateProject: (username, projectName, data) =>
        axiosInstance.patch(PROJECT_URL(username, projectName), data),

    // Удалить проект
    deleteProject: (username, projectName) =>
        axiosInstance.delete(PROJECT_URL(username, projectName)),

    addFavourite: (username, projectName) =>
        axiosInstance.put(`${PROJECT_URL(username, projectName)}/favourite`),

    removeFavourite: (username, projectName) =>
        axiosInstance.delete(`${PROJECT_URL(username, projectName)}/favourite`),

    toggleFavourite: async (username, projectName, liked) => {
        return liked
            ? projectApi.removeFavourite(username, projectName)
            : projectApi.addFavourite(username, projectName);
    },

    addEnvParam: (username, projectName, version, dto) =>
        axiosInstance.post(`${PROJECT_URL(username, projectName, version)}/env`, dto),

    updateEnvParam: (username, projectName, version, name, dto) =>
        axiosInstance.patch(`${PROJECT_URL(username, projectName, version)}/env/${name}`, dto),

    deleteEnvParam: (username, projectName, version, name) =>
        axiosInstance.delete(`${PROJECT_URL(username, projectName, version)}/env/${name}`),
};
