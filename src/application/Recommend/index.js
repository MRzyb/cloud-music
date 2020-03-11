import React, {useEffect} from "react";
import {connect} from 'react-redux'
import Slider from "../../components/Slider";
import RecommendList from "../../components/list";
import Scroll from "../../baseUI/scroll";
import {Content} from "./style";
import * as actionTypes from './store/actionCreators'

function Recommend(props) {

    const {bannerList, recommendList} = props
    const {getBannerDataDispatch, getRecommendListDataDispatch} = props

    useEffect(() => {
        getBannerDataDispatch()
        getRecommendListDataDispatch()
        // eslint-disable-next-line
    }, [])

    const bannerListJS = bannerList ? bannerList.toJS() : []
    const recommendListJS = recommendList ? recommendList.toJS() : []

    return <Content>
        <Scroll>
            <div>
                <Slider bannerList={bannerListJS}></Slider>
                <RecommendList recommendList={recommendListJS}></RecommendList>
            </div>
        </Scroll>
    </Content>
}
// 映射 redux 全局的 state 到组件的 props 上
const mapStateToProps = (state) => {
// 不要在这里用 toJS 不然每次 diff 对比 props 的时候都是不一样的引用 会导致不必要的重复渲染 属于滥用 immutable
    return {
        bannerList: state.getIn(['recommend', 'bannerList']),
        recommendList: state.getIn(['recommend', 'recommendList'])
    }
}

// 映射dispatch 到 props上
const mapDispatchToProps = (dispatch) => {
    return {
        getBannerDataDispatch() {
            dispatch(actionTypes.getBannerList())
        },
        getRecommendListDataDispatch() {
            dispatch(actionTypes.getRecommendList())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend))
