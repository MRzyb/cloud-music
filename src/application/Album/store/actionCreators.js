import {CHANGE_ENTER_LOADING, CHANGE_CURRENT_ALBUM} from './constant'
import {getAlbumDetailAPI} from "../../../api/request";
import {fromJS} from 'immutable'

export const changeCurrentAlbum = (data) => {
    return {
        type: CHANGE_CURRENT_ALBUM,
        data: fromJS(data)
    }
}

export const changeEntryLoading = data => {
    return {
        type: CHANGE_ENTER_LOADING,
        data: data
    }
}

export const getAlbumList = id => {
    return dispatch => {
        getAlbumDetailAPI(id).then(res => {
            let data = res.playlist
            dispatch(changeCurrentAlbum(data))
            dispatch(changeEntryLoading(false))
        }).catch(() => {
            console.log('获取 album 数据失败')
        })
    }
}
