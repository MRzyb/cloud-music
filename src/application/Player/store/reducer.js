import * as actionTypes from './constant'
import {fromJS} from 'immutable'
import {playMode} from "../../../api/config";
import {SET_FULL_SCREEN} from "./constant";

const defaultStatus = fromJS({
    fullScreen: false, // 播放器是否为全屏模式
    playing: false, // 当前歌曲是否播放
    sequencePlayList: [], // 顺序播放（之后会有随机模式，列表会乱序，从这里保存个顺序列表）
    playList: [],
    mode: playMode.sequence, // 播放模式
    currentIndex: -1, // 当前歌曲在播放列表的索引位置
    showPlayList: false, // 是否展示播放列表
    currentSong: {}
})

export default (state = defaultStatus, action) => {
    switch (action.type) {
        case actionTypes.SET_CURRENT_SONG:
            return state.set('currentSong', action.data)
        case actionTypes.SET_FULL_SCREEN:
            return state.set('fullScreen', action.data)
        case actionTypes.SET_CURRENT_INDEX:
            return state.set('currentIndex', action.data)
        case actionTypes.SET_PLAYING_STATE:
            return state.set('playing', action.data)
        case actionTypes.SET_SEQUENCE_PLAY_LIST:
            return state.set ('sequencePlayList', action.data);
        case actionTypes.SET_PLAY_MODE:
            return state.set('mode', action.data)
        case actionTypes.SET_SHOW_PLAY_LIST:
            return state.set('showPlayList', action.data)
        case actionTypes.SET_PLAY_LIST:
            return state.set('playList', action.data)
        default:
            return state
    }
}
