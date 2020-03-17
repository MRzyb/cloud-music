import {
    SET_PLAY_LIST,
    SET_SHOW_PLAY_LIST,
    SET_PLAY_MODE,
    SET_SEQUENCE_PLAY_LIST,
    SET_PLAYING_STATE,
    SET_CURRENT_INDEX,
    SET_FULL_SCREEN,
    SET_CURRENT_SONG,
} from './constant'
import {fromJS} from 'immutable'

export const changeCurrentSong = data => ({
    type: SET_CURRENT_SONG,
    data: fromJS(data)
})

export const changFullScreen = data => ({
    type: SET_FULL_SCREEN,
    data
})

export const changePlayingState = data => ({
    type: SET_PLAYING_STATE,
    data
})

export const changeCurrentIndex = data => ({
    type: SET_CURRENT_INDEX,
    data
})

export const changeSequencePlayList = data => ({
    type: SET_SEQUENCE_PLAY_LIST,
    data: fromJS(data)
})

export const changePlayMode = data => ({
    type: SET_PLAY_MODE,
    data: fromJS(data)
})

export const changePlayList = data => ({
    type: SET_PLAY_LIST,
    data: fromJS(data)
})

export const changeShowPlayList = data => ({
    type: SET_SHOW_PLAY_LIST,
    data: fromJS(data)
})
