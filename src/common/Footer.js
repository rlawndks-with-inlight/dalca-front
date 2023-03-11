import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { logoSrc } from "../data/Data";
const Wrappers = styled.footer`
    display:flex;
    flex-direction:column;
    background:${props => props.theme.color.background3}99;
    color:${props => props.theme.color.font1};
    font-weight:500;
    padding:32px 120px;
    font-size:${props => props.theme.size.font4};
    @media screen and (max-width:1050px) {
        // margin-bottom:80px;
        display:none;
    }
    @media screen and (max-width:650px) {
        padding:32px 5vw;
        font-size:${props => props.theme.size.font4};

    }
`
const Post = styled.div`
cursor:pointer;
border-right:1px solid ${props => props.theme.color.font1};
padding:4px;
transition: 0.3s;
&:hover{  
    color : ${props => props.theme.color.background1};
  }
  @media screen and (max-width:400px) {
    font-size:${props => props.theme.size.font5};
    padding:2px;
}
`
const Img = styled.img`
width: 80px;
@media screen and (max-width:400px) {
width:14vw;
}
`
const Flex = styled.div`
display:flex;
margin-top:8px;
@media screen and (max-width:650px) {
flex-direction:column;
}
`
const Footer = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    
    return (
        <>
            {pathname.includes('/manager') || pathname.substring(0, 6) == '/post/' || pathname.substring(0, 7) == '/video/' ?
                <>
                </>
                :
                <>
                    <Wrappers className="footer">
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Img src={logoSrc} alt="footer" />
                            <Post>이용약관</Post>
                            <Post>개인정보처리방침</Post>
                            <Post style={{ borderRight: 'none' }}>저작권정책</Post>
                        </div>
                        <div style={{ marginTop: '8px' }}>road_address</div>
                        <Flex>
                            <div style={{ marginRight: '16px' }}>Email&nbsp;&nbsp;email_address</div>
                            <div>FAX&nbsp;&nbsp;tel_address</div>
                        </Flex>
                    </Wrappers>
                </>
            }

        </>
    )
}
export default Footer;