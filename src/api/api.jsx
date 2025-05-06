import axiosInstance, {API_URLS, PROJECT_URL} from './AxiosInstanse.jsx'

export const authApi = {

    register: (data) =>
        axiosInstance.post(API_URLS.REGISTER, data),

    login: (data) =>
        axiosInstance.post(API_URLS.LOGIN, data),

    refresh: () =>
        axiosInstance.post(API_URLS.REFRESH),

    confirmEmail: (data) =>
        axiosInstance.post(API_URLS.CONFIRM_EMAIL, data),

    logout: () =>
        axiosInstance.post(API_URLS.LOGOUT),

};

export const userApi = {

    getProfileShortData: (username = "me") =>
        axiosInstance.get(`${API_URLS.USERS}/${username}`),

    getProfile: () =>
        axiosInstance.get(API_URLS.PROFILE),

    getUserProfile: (username) =>
        axiosInstance.get(`${API_URLS.USERS}/${username}`),

    updateProfile: (data) =>
        axiosInstance.patch(API_URLS.PROFILE, data),

};

export const projectApi = {

    getHomeProjects: (page = 0, limit = 20) =>
        axiosInstance.get(API_URLS.PROJECTS, {params: {page, limit}}),

    getProject: (username, projectName) =>
        axiosInstance.get(PROJECT_URL(username, projectName)),

    createProject: (data) =>
        axiosInstance.post(API_URLS.PROJECTS, data),

    getProjects: ({page = 0, limit = 20, query, tags} = {}) =>
        axiosInstance.get(API_URLS.PROJECTS, {
            params: {
                page, limit, q: query, t: tags
            }
        }),

    updateProject: (username, projectName, data) =>
        axiosInstance.patch(PROJECT_URL(username, projectName), data),

    deleteProject: (username, projectName) =>
        axiosInstance.delete(PROJECT_URL(username, projectName)),

    incrementPulls: (username, projectName) =>
        axiosInstance.post(`${PROJECT_URL(username, projectName)}/pulls`),

    getUserProjects: (username, page = 0, limit = 20, privateFlag = false) =>
        axiosInstance.get(`${API_URLS.PROJECTS}/${username}`, {params: {page, limit, 'private': privateFlag}}),

};

export const projectVersionApi = {

    getProjectVersion: (username, projectName, versionName) =>
        axiosInstance.get(PROJECT_URL(username, projectName, versionName)),

    getAllVersions: (username, projectName) =>
        axiosInstance.get(PROJECT_URL(username, projectName) + "/versions"),

    createVersion: (username, projectName, dto) =>
        axiosInstance.post(`${PROJECT_URL(username, projectName)}/versions`, dto),

    updateVersion: (username, projectName, versionName, dto) =>
        axiosInstance.patch(`${PROJECT_URL(username, projectName)}/versions/${versionName}`, dto),

    deleteVersion: (username, projectName, versionName) =>
        axiosInstance.delete(`${PROJECT_URL(username, projectName)}/versions/${versionName}`),

    addEnvParam: (username, projectName, version, dto) =>
        axiosInstance.post(`${PROJECT_URL(username, projectName, version)}/env`, dto),

    updateEnvParam: (username, projectName, version, name, dto) =>
        axiosInstance.patch(`${PROJECT_URL(username, projectName, version)}/env/${name}`, dto),

    deleteEnvParam: (username, projectName, version, name) =>
        axiosInstance.delete(`${PROJECT_URL(username, projectName, version)}/env/${name}`),

};

export const favouriteApi = {

    addFavourite: (username, projectName) =>
        axiosInstance.put(`${PROJECT_URL(username, projectName)}/favourite`),

    removeFavourite: (username, projectName) =>
        axiosInstance.delete(`${PROJECT_URL(username, projectName)}/favourite`),

    toggleFavourite: async (username, projectName, liked) => {
        return liked
            ? favouriteApi.removeFavourite(username, projectName)
            : favouriteApi.addFavourite(username, projectName);
    },

};