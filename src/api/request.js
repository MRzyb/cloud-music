import {axiosInstance} from "./config";

export const getBannerAPI = () => {
    return axiosInstance.get('/banner')
}
export const getRecommendListAPI = () => {
    return axiosInstance.get('/personalized')
}
