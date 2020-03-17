import React, {useCallback, useContext, useEffect} from "react";
import {connect} from 'react-redux'
import LazyLoad, {forceCheck} from 'react-lazyload'
import Horizontal from "../../baseUI/horizontal-item";
import Scroll from "../../baseUI/scroll";
import {categoryTypes, alphaTypes} from "../../api/config";
import {NavContainer, ListContainer, ListItem, List} from './style'
import {
    getHotSingerList,
    getSingerList,
    refreshMoreHotSingerList,
    refreshMoreSingerList,
    changeEnterLoading,
    changePullDownLoading,
    changePullUpLoading,
    changePageCount
} from './store/actionCreators'
import Loading from "../../baseUI/loading";
import {CategoryDataContext, CHANGE_ALPHA, CHANGE_CATEGORY} from "./data";
import {renderRoutes} from 'react-router-config'


function Singers(props) {

    const {singerList, enterLoading, pullUpLoading, pullDownLoading, pageCount} = props
    const {getHotSingerListDispatch, updateDispatch, pullUpDispatch, pullDownDispatch} = props

    // let [category, setCategory] = useState('')
    // let [alpha, setAlpha] = useState('')
    const {data, dispatch} = useContext(CategoryDataContext)
    const {category, alpha} = data.toJS()

    const updateCategory = useCallback(val => {
        // setCategory(val)
        dispatch({type: CHANGE_CATEGORY, data: val})
        updateDispatch(val, alpha)
    }, [alpha, dispatch, updateDispatch])

    const updateAlpha = useCallback(val => {
        // setAlpha(val)
        dispatch({type: CHANGE_ALPHA, data: val})
        updateDispatch(category, val)
    }, [category, dispatch, updateDispatch])

    useEffect(() => {
        if (!singerList.size) {
            getHotSingerListDispatch()
        }
        //  eslint-disable-next-line
    }, [])

    const entryDetail = id => {
        props.history.push(`/singers/${id}`)
    }

    // 渲染歌手列表
    const renderSingerList = () => {
        const list = singerList ? singerList.toJS() : [];
        return (
            <List>
                {
                    list.map((item, index) => {
                        return <ListItem key={item.picId + ' ' + index} onClick={() => entryDetail(item.id)}>
                            <div className="img_wrapper">
                                <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')}
                                                            alt=""/>}>
                                    <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music"/>
                                </LazyLoad>
                            </div>
                            <span className="name">{item.name}</span>
                        </ListItem>
                    })
                }
            </List>
        )
    }

    const pullUp = () => {
        pullUpDispatch(category, alpha, category === '', pageCount)
    }
    const pullDown = () => {
        pullDownDispatch(category, alpha)
    }
    return (
        <div>
            <NavContainer>
                <Horizontal list={categoryTypes} title={"分类（默认热门）"} oldVal={category}
                            handleClick={(val) => updateCategory(val)}></Horizontal>
                <div>{enterLoading}</div>
                <Horizontal list={alphaTypes} title={"首字母:"} oldVal={alpha}
                            handleClick={(val) => updateAlpha(val)}></Horizontal>
            </NavContainer>
            <ListContainer>
                <Scroll
                    onScroll={forceCheck}
                    pullUp={pullUp}
                    pullDown={pullDown}
                    pullUpLoading={pullUpLoading}
                    pullDownLoading={pullDownLoading}>
                    {renderSingerList()}
                </Scroll>
                <Loading show={enterLoading}></Loading>
            </ListContainer>
            {renderRoutes(props.route.routes)}
        </div>

    )
}

const mapStateToProps = (state) => {
    return {
        singerList: state.getIn(['singers', 'singerList']),
        enterLoading: state.getIn(['singers', 'enterLoading']),
        pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
        pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
        pageCount: state.getIn(['singers', 'pageCount'])
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getHotSingerListDispatch() {
            dispatch(getHotSingerList())
        },
        updateDispatch(category, alpha) {
            dispatch(changePageCount(0)) // 由于改变了分类 所以pageCount清零
            dispatch(changeEnterLoading(true))
            dispatch(getSingerList(category, alpha))
        },
        //    滑动到最底部的处理逻辑
        pullUpDispatch(category, alpha, hot, count) {
            dispatch(changePullUpLoading(true))
            dispatch(changePageCount(count + 1))
            if (hot) {
                dispatch(refreshMoreHotSingerList())
            } else {
                dispatch(refreshMoreSingerList(category, alpha))
            }
        },
        //    顶部下拉刷新
        pullDownDispatch(category, alpha) {
            dispatch(changePullDownLoading(true))
            dispatch(changePageCount(0))
            if (category === '' && alpha === '') {
                dispatch(getHotSingerList())
            } else {
                dispatch(getSingerList(category, alpha))
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers))
