import React, {useCallback, useEffect, useRef, useState} from "react";
import {CSSTransition} from 'react-transition-group'
import {connect} from 'react-redux'
import {HEADER_HEIGHT} from "../../api/config";

import Scroll from "../../baseUI/scroll";
import Header from "../../baseUI/header";
import SongsList from "../SongsList";
import Loading from "../../baseUI/loading";
import {getSingerInfo,  changeLoading} from "./store/actionCreators";

import {ImgWrapper, Container, BgLayer, CollectButton, SongListWrapper} from './style'

const Singer = (props) => {
    const [showStatus, setShowStatus] = useState(true)
    const {artist: artistImmutable, songs: songsImmutable, loading, getSingerDetailDispatch} = props

    const artist = artistImmutable.toJS()
    const songs = songsImmutable.toJS()

    const collectButton = useRef()
    const imageWrapper = useRef()
    const songScrollWrapper = useRef()
    const songScroll = useRef();
    const header = useRef()
    const layer = useRef()
    const initialHeight = useRef(0)

    //  网上偏移尺寸 露出圆角
    const OFFSET = 5

    useEffect(() => {
        const id = props.match.params.id
        getSingerDetailDispatch(id)
        console.log('id', id)

        let h = imageWrapper.current.offsetHeight;
        songScrollWrapper.current.style.top = `${h - OFFSET}px`
        initialHeight.current = h

        layer.current.style.top = `${h - OFFSET}px`
        songScroll.current.refresh();

    }, [getSingerDetailDispatch, props.match.params.id])

    const handleScroll = useCallback(pos => {
        let height = initialHeight.current
        const newY = pos.y
        const imageDOM = imageWrapper.current
        const buttonDOM = collectButton.current
        const headerDOM = header.current
        const layerDOM = layer.current
        const minScrollY = -(height - OFFSET) + HEADER_HEIGHT
        //  欢动距离占图片高度的百分比
        const percent = Math.abs(newY / height)

        // 滑动的三种情况
        // 1. 下拉的时候 图片跟着放大 按钮进行偏移
        if (newY > 0) {
            imageDOM.style.transform = `scale(${1 + percent})`
            buttonDOM.style.transform = `translate3d(0, ${newY}px, 0)`
            layerDOM.style.top = `${height + newY}px`
        } else if (newY >= minScrollY) {
            // 2. 上滑的时候 但是遮罩还没超过header部分
            layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`
            layerDOM.style.zIndex = 1
            imageDOM.style.paddingTop = '75%'
            imageDOM.style.height = 0;
            imageDOM.style.zIndex = -1;
            // 按钮跟着移动且渐渐变透明
            buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
            buttonDOM.style["opacity"] = `${1 - percent * 2}`;
        } else if (newY < minScrollY) {
            // 3.往上滑动 但是超过了header部分
            layerDOM.style.top = `${HEADER_HEIGHT}px`
            layerDOM.style.zIndex = 1;
            headerDOM.style.zIndex = 100
            // 此时图片高度与 Header 一致
            imageDOM.style.height = `${HEADER_HEIGHT}px`;
            imageDOM.style.paddingTop = 0;
            imageDOM.style.zIndex = 99;
        }
    }, [])

    const setShowStatusFalse = useCallback(() => {
        setShowStatus(false);
    }, []);

    return (
        <CSSTransition
            in={showStatus}
            timeout={300}
            classNames="fly"
            appear={true}
            unmountOnExit
            onExited={() => props.history.goBack()}
        >
            <Container>
                <Header title={"头部"} ref={header} handleClick={setShowStatusFalse}></Header>
                <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
                    <div className="filter"></div>
                </ImgWrapper>
                <CollectButton ref={collectButton}>
                    <i className="iconfont">&#xe62d;</i>
                    <span className="text"> 收藏 </span>
                </CollectButton>
                <BgLayer ref={layer}></BgLayer>
                <SongListWrapper ref={songScrollWrapper}>
                    <Scroll ref={songScroll} onScroll={handleScroll}>
                        <SongsList
                            songs={songs}
                            showCollect={false}
                        ></SongsList>
                    </Scroll>
                </SongListWrapper>
                { loading ? (<Loading></Loading>) : null}
            </Container>
        </CSSTransition>
    )
}

const matStateToProps = state => {
    return {
        artist: state.getIn(['singerInfo', 'artist']),
        songs: state.getIn(['singerInfo', 'songsOfArtist']),
        loading: state.getIn(['singerInfo', 'loading'])
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getSingerDetailDispatch(id) {
            dispatch(changeLoading(true))
            dispatch(getSingerInfo(id))
        }
    }
}

export default connect(matStateToProps, mapDispatchToProps)(React.memo(Singer))
