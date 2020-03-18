import React, {useEffect, useRef, useState} from "react";
import {connect} from 'react-redux'
import {
    changeCurrentSong, changFullScreen, changePlayingState,
    changeCurrentIndex, changePlayList, changePlayMode, changeShowPlayList
} from './store/actionCreators'

import MiniPlayer from "./miniPlayer";
import NormalPlayer from "./normalPlayer";
import {shuffle, findIndex, isEmptyObject, getSongUrl} from "../../api/utils";
import Toast from "../../baseUI/toast";
import {playMode} from "../../api/config";

function Player(props) {
    const {
        fullScreen,
        playing,
        sequencePlayList: immutableSequencePlayList,
        playList: immutablePlayList,
        mode,
        currentIndex,
        showPlayList,
        currentSong: immutableCurrentSong
    } = props

    const {
        togglePlayingDispatch, toggleFullScreenDispatch, togglePlayListDispatch, changeCurrentIndexDispatch, changeCurrentSongDispatch,
        changePlayModeDispatch, changePlayListDispatch
    } = props


    const playList = immutablePlayList.toJS()
    const currentSong = immutableCurrentSong.toJS()
    const sequencePlayList = immutableSequencePlayList.toJS();

    // 当前播放时间
    const [currentTime, setCurrentTime] = useState(0)
    // 歌曲总时长
    const [duration, setDuration] = useState(0)
    // 歌曲播放进度
    let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration

    const [preSong, setPreSong] = useState({});
    const [modeText, setModeText] = useState("");
    const [songReady, setSongReady] = useState(true);
    const toastRef = useRef()
    const audioRef = useRef()

    useEffect(() => {
        if (!playList.length || currentIndex === -1 || !playList[currentIndex] || playList[currentIndex].id === preSong.id || !songReady) {
            return
        }
        let current = playList[currentIndex]
        setPreSong(current)
        setSongReady(false)
        changeCurrentSongDispatch(current)
        audioRef.current.src = getSongUrl(current.id);
        setTimeout(() => {
            audioRef.current.play().then(() => {
                setSongReady(true)
            })
        })
        togglePlayingDispatch(true)
        setCurrentTime(0)
        setDuration(current.dt / 1000 | 0)
    }, [changeCurrentSongDispatch, currentIndex, playList, preSong.id, songReady])

    useEffect(() =>{
        playing ? audioRef.current.play() : audioRef.current.pause()
    }, [playing])

    const clickPlaying = (e, state) => {
        e.stopPropagation()
        togglePlayingDispatch(state)
    }

    const changeMode = () => {
        let newMode = (mode + 1) % 3
        if (newMode === 0) {
            // 顺序模式
            changePlayListDispatch(sequencePlayList)
            let index = findIndex(currentSong, sequencePlayList)
            changeCurrentIndexDispatch(index)
            setModeText('顺序播放')
        } else if (newMode === 1) {
            // 单曲循环
            changePlayListDispatch(sequencePlayList)
            setModeText('单曲循环')
        } else if (newMode === 2) {
            // 随机播放
            let newList = shuffle(sequencePlayList);
            let index = findIndex(currentSong, newList);
            changePlayListDispatch(newList)
            changeCurrentIndexDispatch(index)
            setModeText('随机播放')
        }
        changePlayModeDispatch(newMode)
        toastRef.current.show();
    }

    const updateTime = (e) => {
        setCurrentTime(e.target.currentTime);
    }

    const onProgressChange = (curPercent) => {
        const newTime = curPercent * duration;
        setCurrentTime(newTime);
        audioRef.current.currentTime = newTime;
        if (!playing) {
            togglePlayingDispatch(true);
        }
    }

    const handleLoop = () => {
        audioRef.current.currentTime = 0
        changePlayingState(true)
        audioRef.current.play()
    }

    const handleNext = () => {
        if (playList.length === 1) {
            handleLoop()
            return
        }
        audioRef.current.currentTime = 0
        let index = currentIndex + 1
        if (index === playList.length) {
            index = 0
        }
        if (!playing) {
            togglePlayingDispatch(true)
        }
        changeCurrentIndexDispatch(index)
    }

    const handlePrev = () => {
        if (playList.length === 1) {
            handleLoop()
            return
        }
        let index = currentIndex - 1;
        if (index < 0) index = playList.length - 1;
        if (!playing) togglePlayingDispatch(true);
        changeCurrentIndexDispatch(index);
    }

    const handleEnd = () => {
        if (mode === playMode.loop) {
            handleLoop()
        } else {
            handleNext()
        }
    }

    return (
        <div>
            {
                isEmptyObject(currentSong) ? null : (
                    <MiniPlayer song={currentSong}
                                fullScreen={fullScreen}
                                playing={playing}
                                percent={percent}
                                currentTime={currentTime}
                                clickPlaying={clickPlaying}
                                toggleFullScreen={toggleFullScreenDispatch}>
                    </MiniPlayer>
                )
            }

            {
                isEmptyObject(currentSong) ? null : (
                    <NormalPlayer song={currentSong}
                                  fullScreen={fullScreen}
                                  playing={playing}
                                  mode={mode}
                                  percent={percent}
                                  duration={duration}
                                  currentTime={currentTime}
                                  changeMode={changeMode}
                                  clickPlaying={clickPlaying}
                                  onProgressChange={onProgressChange}
                                  handlePrev={handlePrev}
                                  handleNext={handleNext}
                                  toggleFullScreen={toggleFullScreenDispatch}>
                    </NormalPlayer>
                )
            }
            <audio
                ref={audioRef}
                onTimeUpdate={updateTime}
                onEnded={handleEnd}
            ></audio>
            <Toast text={modeText} ref={toastRef}></Toast>
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
