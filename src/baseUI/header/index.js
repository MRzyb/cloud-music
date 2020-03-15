import React from "react";
import styled from 'styled-components'
import style from '../../assets/global-style';
import PropTypes from 'prop-types'

const HeaderContainer = styled.div`
  position: fixed;
  padding: 0 10px 5px;
  height: 40px;
  width: 100%;
  z-index: 100;
  display: flex;
  line-height: 40px;
  color: ${style["font-color-light"]};
  .back {
    margin-right: 5px;
    font-size: 20px;
    width: 20px;
  }
  >h1 {
    font-size: ${style["font-size-l"]};
    font-weight: 700;
  }
`
// 处理函数组件拿不到ref的问题,所以用forwardRef
const Header = React.forwardRef((props, ref) => {
    const {title, isMarquee, handleClick} = props
    console.log('title')
    return (
        <HeaderContainer ref={ref}>
            <i className="iconfont back" onClick={handleClick}>&#xe655;</i>
            {
                // eslint-disable-next-line jsx-a11y/no-distracting-elements
                isMarquee ? <marquee><h1>{title}</h1></marquee> : <h1>{title}</h1>
            }
        </HeaderContainer>
    )
})

Header.defaultProps = {
    title: "标题",
    handleClick: () => {},
    isMarquee: false
};

Header.propTypes = {
    title: PropTypes.string,
    handleClick: PropTypes.func,
    isMarquee: PropTypes.bool
}


export default React.memo(Header)
