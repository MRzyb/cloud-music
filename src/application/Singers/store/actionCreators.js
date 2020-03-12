import {fromJS} from 'immutable'
import * as actionTypes from './constant'
import {getHotSingerListAPI, getSingerListAPI} from '../../../api/request'


export const changeSingerList = (data) => {
    return {
        type: actionTypes.CHANGE_SINGER_LIST,
        data: fromJS(data)
    }
}

export const changePageCount = data => {
    return {
        type: actionTypes.CHANGE_PAGE_COUNT,
        data: fromJS(data)
    }
}

export const changeEnterLoading = data => {
    return {
        type: actionTypes.CHANGE_ENTER_LOADING,
        data: fromJS(data)
    }
}

export const changePullUpLoading = data => {
    return {
        type: actionTypes.CHANGE_PULL_UP_LOADING,
        data: fromJS(data)
    }
}
export const changePullDownLoading = data => {
    return {
        type: actionTypes.CHANGE_PULL_DOWN_LOADING,
        data: fromJS(data)
    }
}

// 第一次加载热门歌手
export const getHotSingerList = () => {
    return dispatch => {
        getHotSingerListAPI(0).then(res => {
            const data = res.artists
            dispatch(changeSingerList(data))
            dispatch(changeEnterLoading(false))
            dispatch(changePullDownLoading(false))
        }).catch(() => {
            console.log('热门歌手数据获取失败');
        })
    }
}

//加载更多热门歌手
export const refreshMoreHotSingerList = () => {
    return (dispatch, getState) => {
        const pageCount = getState().getIn(['singers', 'pageCount']);
        const singerList = getState().getIn(['singers', 'singerList']).toJS();
        getHotSingerListAPI(pageCount).then(res => {
            const data = [...singerList, ...res.artists];
            dispatch(changeSingerList(data));
            dispatch(changePullUpLoading(false));
        }).catch(() => {
            console.log('热门歌手数据获取失败');
        });
    }
};

// 第一次加载对应类别的歌手
export const getSingerList = (category, alpha) => {
    return (dispatch, getState) => {
        getSingerListAPI(category, alpha, 0).then(res => {
            const data = res.artists;
            dispatch(changeSingerList(data));
            dispatch(changeEnterLoading(false));
            dispatch(changePullDownLoading(false));
        }).catch(() => {
            console.log('歌手数据获取失败')
        })
    }
}

// 加载更多歌手
export const refreshMoreSingerList = (category, alpha) => {
    return (dispatch, getState) => {
        const pageCount = getState().getIn(['singers', 'pageCount']);
        const singerList = getState().getIn(['singers', 'singerList']).toJS();
        getSingerListAPI(category, alpha, pageCount).then(res => {
            const data = [...singerList, ...res.artists];
            dispatch(changeSingerList(data));
            dispatch(changePullUpLoading(false));
        }).catch(() => {
            console.log('歌手数据获取失败');
        });
    }
};
