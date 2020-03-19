// 专辑
import React, {useState, useRef, useCallback, useEffect} from "react";
import {connect} from 'react-redux'
import {Container, TopDesc, Menu, SongList, SongItem} from "./style";
import {CSSTransition} from 'react-transition-group'
import Header from "../../baseUI/header";
import Scroll from "../../baseUI/scroll";
import {getCount, getName, isEmptyObject} from "../../api/utils";
import Loading from "../../baseUI/loading";
import style from '../../assets/global-style'
import {getAlbumList, changeEntryLoading, changeCurrentAlbum} from "./store/actionCreators";
import SongsList from "../SongsList";
import MusicNote from "../../baseUI/music-note";

function Album(props) {
    const [showStatus, setShowStatus] = useState(true)
    const [title, setTitle] = useState("歌单");
    const [isMarquee, setIsMarquee] = useState(false) // 是否为跑马灯
    const headerEl = useRef();
    const musicNoteRef = useRef()

    const musicAnimation = (x, y) => {
        musicNoteRef.current.startAnimation({x, y})
    }

    const {getAlbumDetailDispatch, currentAlbum: currentAlbumImmutable, entryLoading} = props
    const id = props.match.params.id

    useEffect(() => {
        getAlbumDetailDispatch(id)
        //  eslint-disable-next-line
    }, [])

    let currentAlbum = currentAlbumImmutable.toJS()

    const handleBack = useCallback(() => {
        setShowStatus(false)
    }, [])

    //顶部的高度handleScroll
    const HEADER_HEIGHT = 45;

    const handleScroll = useCallback(
        pos => {
            let minScrollY = -HEADER_HEIGHT;
            let percent = Math.abs(pos.y / minScrollY);
            let headerDom = headerEl.current;
            //滑过顶部的高度开始变化
            if (pos.y < minScrollY) {
                headerDom.style.backgroundColor = style["theme-color"];
                headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
                setTitle(currentAlbum.name);
                setIsMarquee(true);
            } else {
                headerDom.style.backgroundColor = "";
                headerDom.style.opacity = 1;
                setTitle("歌单");
                setIsMarquee(false);
            }
        },
        [currentAlbum]
    );

    const renderTopDesc = () => {
        return (
            <TopDesc background={currentAlbum.coverImgUrl}>
                <div className="background">
                    <div className="filter"></div>
                </div>
                <div className="img_wrapper">
                    <div className="decorate"></div>
                    <img src={currentAlbum.coverImgUrl} alt=""/>
                    <div className="play_count">
                        <i className="iconfont play">&#xe885;</i>
                        <span className="count">{getCount(currentAlbum.subscribedCount)}</span>
                    </div>
                </div>
                <div className="desc_wrapper">
                    <div className="title">{currentAlbum.name}</div>
                    <div className="person">
                        <div className="avatar">
                            <img src={currentAlbum.creator.avatarUrl} alt=""/>
                        </div>
                        <div className="name">{currentAlbum.creator.nickname}</div>
                    </div>
                </div>
            </TopDesc>
        )
    }

    const renderMenu = () => {
        return (
            <Menu>
                <div><i className="iconfont">&#xe6ad;</i>评论</div>
                <div><i className="iconfont">&#xe86f;</i>点赞</div>
                <div><i className="iconfont">&#xe62d;</i>收藏</div>
                <div><i className="iconfont">&#xe606;</i>更多</div>
            </Menu>
        )
    };

    return (
        <CSSTransition in={showStatus}
                       timeout={300}
                       classNames="fly"
                       appear={true}
                       unmountOnExit
                       onExited={props.history.goBack}>
            <Container>
                <Header ref={headerEl} title={title} isMarquee={isMarquee} handleClick={handleBack}></Header>
                {!isEmptyObject(currentAlbum) ? (
                    <Scroll bounceTop={false} onScroll={handleScroll}>
                        <div>
                            {renderTopDesc()}
                            {renderMenu()}
                            <SongsList
                                songs={currentAlbum.tracks}
                                collectCount={currentAlbum.subscribedCount}
                                showCollect={true}
                                showBackground={true}
                                musicAnimation={musicAnimation}
                            ></SongsList>
                        </div>
                    </Scroll>
                ) : null}
                <Loading show={entryLoading}></Loading>
                <MusicNote ref={musicNoteRef}></MusicNote>
            </Container>
        </CSSTransition>
    )
}

const mapStateToProps = state => {
    return {
        currentAlbum: state.getIn(['album', 'currentAlbum']),
        entryLoading: state.getIn(['album', 'entryLoading'])
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAlbumDetailDispatch(id) {
            dispatch(changeCurrentAlbum({}))
            dispatch(changeEntryLoading(true))
            dispatch(getAlbumList(id))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album))
