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


function Header(props) {
    const {title, handleClick} = props
    return (
        <HeaderContainer>
            <i className="iconfont back" onClick={handleClick}>&#xe655;</i>
            <h1>{title}</h1>
        </HeaderContainer>
    )
}

Header.defaultProps = {
    title: "标题",
    handleClick: () => {}
};

Header.propTypes = {
    title: PropTypes.string,
    handleClick: PropTypes.func
}


export default React.memo(Header)
