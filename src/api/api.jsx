import axiosInstance from './AxiosInstanse.jsx'
import axiosFormDataInstance from './AxiosInstanse.jsx'
import {API_URLS, PROJECT_URL} from "./urls.jsx";

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

    getMe: () =>
        axiosInstance.get(`${API_URLS.USERS}/me`),

    getProfileShortData: (username) =>
        axiosInstance.get(`${API_URLS.USERS}/${username}/short`),

    getUserProfile: (username) =>
        axiosInstance.get(`${API_URLS.USERS}/${username}`),

    updateUserProfile: (username, dto) =>
        axiosInstance.patch(`${API_URLS.USERS}/${username}`, dto),

};

export const photoApi = {

    uploadPhoto: (username, file) => {
        const formData = new FormData()
        formData.append('photo', file)
        return axiosFormDataInstance.post(
            `${API_URLS.USERS}/${username}/photos`,
            formData,
            {headers: {'Content-Type': 'multipart/form-data'}}
        )
    },

    downloadPhoto: (photoId) =>
        axiosFormDataInstance.get(`${API_URLS.PHOTOS}/${photoId}`),

    getUserPhotoList: (username) =>
        axiosInstance.get(`${API_URLS.USERS}/${username}/photos`),

    getUserMainPhoto: (username) =>
        axiosInstance.get(`${API_URLS.USERS}/${username}/photos/main`),

    deletePhoto: (username, photoId) =>
        axiosInstance.delete(`${API_URLS.USERS}/${username}/photos/${photoId}`),

}

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

export const projectTagApi = {

    searchTags: (query) =>
        axiosInstance.get(`${API_URLS.TAGS}`, {params: {'q': query}})

}

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

    getUserFavourites: (username) =>
        axiosInstance.get(`${API_URLS.USERS}/${username}/favourites`),

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