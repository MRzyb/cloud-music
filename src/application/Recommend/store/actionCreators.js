import * as actionTypes from './constant'
import {fromJS} from 'immutable'
import {getBannerAPI, getRecommendListAPI} from "../../../api/request";

export const changeBannerList = (data) => {
    return {
        type: actionTypes.CHANGE_BANNER,
        data: fromJS(data)
    }
}

export const changeRecommendList = data => {
    return {
        type: actionTypes.CHANGE_RECOMMEND_LIST,
        data: fromJS(data)
    }
}

export const getBannerList = () => {
    return dispatch => {
        getBannerAPI().then(res => {
            dispatch(changeBannerList(res.banners))
        }).catch(() => {
            console.log('轮播图数据传输错误')
        })
    }
}

export const getRecommendList = () => {
    return dispatch => {
        getRecommendListAPI().then(res => {
            dispatch(changeRecommendList(res.result))
        }).catch(() => {
            console.log('推荐歌单数据传输错误')
        })
    }
}
