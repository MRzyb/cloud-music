import {fromJS} from 'immutable'
import * as actionTypes from './constant'

const defaultState = fromJS({
    singerList: [],
    enterLoading: true,
    pullDownLoading: false, // 下拉加载动画
    pullUpLoading: false, // 上拉加载动画
    pageCount: 0 // 当前页
})

export default (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_SINGER_LIST:
            return state.set('singerList', action.data)
        case actionTypes.CHANGE_PAGE_COUNT:
            return state.set('pageCount', action.data)
        case actionTypes.CHANGE_ENTER_LOADING:
            return state.set('enterLoading', action.data)
        case actionTypes.CHANGE_PULL_UP_LOADING:
            return state.set('pullUpLoading', action.data)
        case actionTypes.CHANGE_PULL_DOWN_LOADING:
            return state.set('pullDownLoading', action.data)
        default:
            return state
    }
}
