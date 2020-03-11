import * as actionTypes from './constant'
import {fromJS} from 'immutable' // 用formJS把 JS 数据结构转换成 immutable 数据结构

const defaultState = fromJS({
    bannerList: [],
    recommendList: []
})

export default (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_BANNER:
            return state.set('bannerList', action.data)
        case actionTypes.CHANGE_RECOMMEND_LIST:
            return state.set('recommendList', action.data)
        default:
            return state
    }
}
