import {axiosInstance} from "./config";

export const getBannerAPI = () => {
    return axiosInstance.get('/banner')
}
export const getRecommendListAPI = () => {
    return axiosInstance.get('/personalized')
}

export const getHotSingerListAPI = (count) => {
    return axiosInstance.get(`/top/artists?offset=${count}`)
}

export const getSingerListAPI = (category, alpha, count) => {
    return axiosInstance.get(`/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`);
}

export const getRankListAPI = () => {
    return axiosInstance.get('/toplist/detail')
}

export const getAlbumDetailAPI = id => {
    return axiosInstance.get(`/playlist/detail?id=${id}`);
}

export const getSingerInfoAPI = id => {
    return axiosInstance.get (`/artists?id=${id}`);
}


