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
    // Получить профиль залогиненого юзера
    getMe: () =>
        axiosInstance.get(API_URLS.ME),

    // Получить свой профиль (если отличается от /users/me)
    getProfile: () =>
        axiosInstance.get(API_URLS.PROFILE),

    // Обновить профиль.
// Параметры: { name, bio, avatarUrl, ... }
    updateProfile: (data) =>
        axiosInstance.patch(API_URLS.PROFILE, data),
};

export const projectApi = {
    // Список всех проектов текущего юзера
    /**
     * Get list of projects with pagination
     * @param {number} page - Zero-based page index
     * @param {number} limit - Page size
     */
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

    // Получить конкретный проект по user и projectName
    getProjectVersion: (userName, projectName, versionName, page = 0, limit = 20) =>
        axiosInstance.get(PROJECT_URL(userName, projectName, versionName), {params: {page, limit}}),

    // Обновить проект.
// Параметры data — объект с полями, которые нужно изменить
    updateProject: (userName, projectName, data) =>
        axiosInstance.put(PROJECT_URL(userName, projectName), data),

    // Удалить проект
    deleteProject: (userName, projectName) =>
        axiosInstance.delete(PROJECT_URL(userName, projectName)),

    addFavourite: (userName, projectName) =>
        axiosInstance.put(`${PROJECT_URL(userName, projectName)}/favourite`),

    removeFavourite: (userName, projectName) =>
        axiosInstance.delete(`${PROJECT_URL(userName, projectName)}/favourite`),

    toggleFavourite: async (userName, projectName, liked) => {
        return liked
            ? projectApi.removeFavourite(userName, projectName)
            : projectApi.addFavourite(userName, projectName);
    },
};
