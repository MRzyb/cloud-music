import {fromJS} from 'immutable'
import {getRankListAPI} from "../../../api/request";

export const CHANGE_RANK_LIST = 'rank/CHANGE_RANK_LIST'
export const CHANGE_LOADING = 'rank/CHANGE_LOADING'

const changeRankList = data => {
    return {
        type: CHANGE_RANK_LIST,
        data: fromJS(data)
    }
}

const changeLoading = data => {
    return {
        type: CHANGE_LOADING,
        data
    }
}

export const getRankList = () => {
    return dispatch => {
        getRankListAPI().then(data => {
            let list = data && data.list
            dispatch(changeRankList(list))
            dispatch(changeLoading(false))
        })
    }
}

const defaultState = fromJS({
    rankList: [],
    loading: true
})

export const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case CHANGE_RANK_LIST:
            return state.set('rankList', action.data)
        case CHANGE_LOADING:
            return state.set('loading', action.data)
        default:
            return state
    }
}
