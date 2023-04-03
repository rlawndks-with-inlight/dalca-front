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
    font-size:${props => props.theme.size.font5};
    @media screen and (max-width:1050px) {
        // margin-bottom:80px;
        display:none;
    }
    @media screen and (max-width:650px) {
        padding:32px 5vw;
    }
`
const Post = styled.div`
border-right:1px solid ${props => props.theme.color.font1};
padding:0 8px;
transition: 0.3s;
font-size:${props => props.theme.size.font5};
// &:hover{  
//     color : ${props => props.theme.color.background1};
//   }
//   @media screen and (max-width:400px) {
//     font-size:${props => props.theme.size.font5};
//     padding:2px;
// }
`
const Img = styled.img`
width: 80px;
margin-right:1rem;
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
                            <Post>주식회사 오앤유페이먼츠</Post>
                            <Post>대표자 조웅형</Post>
                            <Post style={{ borderRight: 'none' }}>사업자등록번호</Post>
                        </div>
                        <div style={{ marginTop: '8px' }}>경기도 김포시 태장로789, 611호(장기동, 금광하이테크)</div>
                        <Flex>
                            <div style={{ marginRight: '16px' }}>대표번호&nbsp;&nbsp;1533-8643</div>
                            <div>팩스번호&nbsp;&nbsp;031) 624-4396</div>
                        </Flex>
                    </Wrappers>
                </>
            }

        </>
    )
}
export default Footer;