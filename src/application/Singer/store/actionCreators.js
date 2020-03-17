import {CHANGE_ENTRY_LOADING, CHANGE_ARTIST, CHANGE_SONGS_OF_ARTIST} from './constant'
import {fromJS} from 'immutable'
import {getSingerInfoAPI} from "../../../api/request";

export const changeArtist = data => {
    return {
        type: CHANGE_ARTIST,
        data: fromJS(data)
    }
}

export const changeSongs = data => ({
    type: CHANGE_SONGS_OF_ARTIST,
    data: fromJS(data)
})

export const changeLoading = data => ({
    type: CHANGE_ENTRY_LOADING,
    data
})

export const getSingerInfo = id => {
    return dispatch => {
        getSingerInfoAPI(id).then(res => {
            dispatch(changeArtist(res.artist))
            dispatch(changeSongs(res.hotSongs))
            dispatch(changeLoading(false))
        })
    }
}
