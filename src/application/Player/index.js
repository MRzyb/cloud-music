import React from "react";
import {connect} from 'react-redux'
import {
    changeCurrentSong, changFullScreen, changePlayingState,
    changeCurrentIndex, changePlayList, changePlayMode, changeShowPlayList
} from './store/actionCreators'

import MiniPlayer from "./miniPlayer";
import NormalPlayer from "./normalPlayer";

function Player(props) {
    // const {fullScreen, playing, sequencePlayList, playList, mode, currentIndex, showPlayList, currentSong} = props
    // const {
    //     togglePlayingDispatch, toggleFullScreenDispatch, togglePlayListDispatch, changeCurrentIndexDispatch, changeCurrentSongDispatch,
    //     changePlayModeDispatch, changePlayListDispatch
    // } = props

    const {fullScreen} = props
    const {toggleFullScreenDispatch} = props

    const currentSong = {
        al: {picUrl: "https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg"},
        name: "木偶人",
        ar: [{name: "薛之谦"}]
    }
    return (
        <div>
            <MiniPlayer song={currentSong}
                        fullScreen={fullScreen}
                        toggleFullScreen={toggleFullScreenDispatch}>
            </MiniPlayer>
            <NormalPlayer song={currentSong}
                          fullScreen={fullScreen}
                          toggleFullScreen={toggleFullScreenDispatch}>
            </NormalPlayer>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        fullScreen: state.getIn(['player', 'fullScreen']),
        playing: state.getIn(['player', 'playing']),
        sequencePlayList: state.getIn(['player', 'sequencePlayList']),
        playList: state.getIn(['player', 'playList']),
        mode: state.getIn(['player', 'mode']),
        currentIndex: state.getIn(['player', 'currentIndex']),
        showPlayList: state.getIn(['player', 'showPlayList']),
        currentSong: state.getIn(['player', 'currentSong']),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        togglePlayingDispatch(data) {
            dispatch(changePlayingState(data))
        },
        toggleFullScreenDispatch(data) {
            dispatch(changFullScreen(data))
        },
        togglePlayListDispatch(data) {
            dispatch(changeShowPlayList(data))
        },
        changeCurrentIndexDispatch(index) {
            dispatch(changeCurrentIndex(index))
        },
        changeCurrentSongDispatch(data) {
            dispatch(changeCurrentSong(data))
        },
        changePlayModeDispatch(data) {
            dispatch(changePlayMode(data))
        },
        changePlayListDispatch(data) {
            dispatch(changePlayList(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player))
