import React, {useEffect, useImperativeHandle, useRef, useState, forwardRef, useMemo} from "react";
import PropTypes from 'prop-types'
import BScroll from 'better-scroll'
import styled from 'styled-components'
import Loading from "../loading";
import LoadingV2 from "../loading-v2";
import {debounce} from "../../api/utils";

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`
const PullUpLoading = styled.div`
  position: absolute;
  left:0; right:0;
  bottom: 5px;
  width: 60px;
  height: 60px;
  margin: auto;
  z-index: 100;
`;

export const PullDownLoading = styled.div`
  position: absolute;
  left:0; right:0;
  top: 0px;
  height: 30px;
  margin: auto;
  z-index: 100;
`;


const Scroll = forwardRef((props, ref) => {
    // bScroll 实例对象
    const [bScroll, setBScroll] = useState()
    const scrollContainerRef = useRef()
    const {direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom} = props
    const {pullUp, pullDown, onScroll} = props

    useEffect(() => {
        // current 指向初始化 bs 实例需要的 DOM 元素
        const scroll = new BScroll(scrollContainerRef.current, {
            scrollX: direction === 'horizontal',
            scrollY: direction === 'vertical',
            probeType: 3,
            click: click,
            bounce: {
                top: bounceTop,
                bottom: bounceBottom
            }
        })
        setBScroll(scroll)
        return () => {
            setBScroll(null)
        }
        // eslint-disable-next-line
    }, [])

    //  每次渲染都要重新刷新实例，防止无法滑动
    useEffect(() => {
        if (refresh && bScroll) {
            bScroll.refresh();
        }
    })

    // 给实例绑定 scroll 事件
    useEffect(() => {
        if (!onScroll || !bScroll) return
        bScroll.on('scroll', (scroll) => {
            onScroll(scroll)
        })
        return () => {
            bScroll.off('scroll')
        }
    }, [bScroll, onScroll])

    let pullUpDebounce = useMemo(() => {
        return debounce(pullUp, 300)
    }, [pullUp])

    let pullDownDebounce = useMemo(() => {
        return debounce(pullDown, 300)
    }, [pullDown]);

    // 进行上拉到底的判断，调用上拉加载的函数
    useEffect(() => {
        if (!bScroll || !pullUp) return
        const handlePullUp = () => {
            if (bScroll.y <= bScroll.maxScrollY + 100) {
                pullUpDebounce()
            }
        }
        bScroll.on('scrollEnd', handlePullUp)
        return () => {
            bScroll.off('scrollEnd', handlePullUp)
        }
    }, [bScroll, pullUp, pullUpDebounce])

    // 进行下拉到底的判断 调用下拉刷新函数
    useEffect(() => {
        if (!bScroll || !pullDown) return
        const handlePullDown = (pos) => {
            if (pos.y > 50) {
                pullDownDebounce()
            }
        }
        bScroll.on('touchEnd', handlePullDown)

        return () => {
            bScroll.off('touchEnd', handlePullDown)
        }
    }, [bScroll, pullDown, pullDownDebounce])

    // 向父组件暴露 refresh 方法 和bs实例
    // 一般和 forwardRef 一起使用，ref 已经在 forWardRef 中默认传入
    useImperativeHandle(ref, () => ({
        refresh() {
            if (refresh && bScroll) {
                bScroll.refresh()
                bScroll.scrollTo(0, 0)
            }
        },
        getBScroll() {
            if (bScroll) {
                return bScroll
            }
        }
    }))

    const pullUpDisplayStyle = pullUpLoading ? {display: ''} : {display: 'none'}
    const pullDownDisplayStyle = pullDownLoading ? {display: ''} : {display: 'none'}

    return (
        <ScrollContainer ref={scrollContainerRef}>
            {props.children}
            {/* 滑到底部加载动画 */}
            <PullUpLoading style={pullUpDisplayStyle}><Loading></Loading></PullUpLoading>
            {/* 顶部下拉刷新动画 */}
            <PullDownLoading style={pullDownDisplayStyle}><LoadingV2></LoadingV2></PullDownLoading>
        </ScrollContainer>
    )

})

Scroll.defaultProps = {
    direction: 'vertical',
    click: true,
    refresh: true,
    onScroll: null,
    pullUp: null,
    pullDown: null,
    pullUpLoading: false,
    pullDownLoading: false,
    bounceTop: true,
    bounceBottom: true
}

Scroll.propTypes = {
    direction: PropTypes.oneOf(['vertical', 'horizontal']), // 滚动的 方向
    click: PropTypes.bool, // 是否支持点击
    refresh: PropTypes.bool, // 是否刷新
    onScroll: PropTypes.func, // 滑动触发的回调函数
    pullUp: PropTypes.func, // 上拉逻辑
    pullDown: PropTypes.func, // 下拉逻辑
    pullUpLoading: PropTypes.bool, // 是否显示上拉 loading 动画
    pullDownLoading: PropTypes.bool, // 是否显示下拉 loading 动画
    bounceTop: PropTypes.bool, // 是否支持向上吸顶
    bounceBottom: PropTypes.bool // 是否支持向下吸顶
}

export default React.memo(Scroll)
