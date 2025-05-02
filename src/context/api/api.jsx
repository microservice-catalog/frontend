import axiosInstance, { API_URLS, PROJECT_URL } from './AxiosInstanse.jsx'

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
        axiosInstance.put(API_URLS.PROFILE, data),
};

export const projectApi = {
    // Список всех проектов текущего юзера
    getProjects: () =>
        axiosInstance.get(API_URLS.PROJECTS),

    // Создать новый проект.
// Параметры: { name, description, ... }
    createProject: (data) =>
        axiosInstance.post(API_URLS.PROJECTS, data),

    // Получить конкретный проект по user и projectName
    getProject: (userName, projectName) =>
        axiosInstance.get(PROJECT_URL(userName, projectName)),

    // Обновить проект.
// Параметры data — объект с полями, которые нужно изменить
    updateProject: (userName, projectName, data) =>
        axiosInstance.put(PROJECT_URL(userName, projectName), data),

    // Удалить проект
    deleteProject: (userName, projectName) =>
        axiosInstance.delete(PROJECT_URL(userName, projectName)),
};
