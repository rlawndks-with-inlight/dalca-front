import styled from "styled-components"
import { AiOutlineUp } from 'react-icons/ai';
import $ from 'jquery';
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import kakaoFotterIcon from '../assets/images/test/kakao-footer.png'

const Button = styled.div`

background:${props => props.theme.color.background1};
padding:7px 8px 5px 8px;
color:#000;
border-radius:50%;
font-size:16px;
cursor:pointer;
animation: fadein 0.5s;
z-index:3;
@keyframes fadein {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

`
const KakaoImg = styled.img`
width: 140px;
cursor: pointer;
margin-right:8px;
animation: fadein 0.5s;
z-index:3;
@keyframes fadein {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
`
const ScrollToTopButton = () => {
    const { pathname } = useLocation();
    const [isPost, setIsPost] = useState(false);
    const [display, setDisplay] = useState(true);
    useEffect(() => {
        window.addEventListener('scroll', function () {
            if (window.scrollY <= 50) {
                setDisplay("none");
            } else {
                setDisplay("");
            }
        })
    }, [])
    useEffect(() => {
        if (pathname.includes('/manager')) {
            setDisplay('none');
        } else {
            setDisplay('')
        }
        if (window.scrollY <= 50) {
            setDisplay("none");
        } else {
            setDisplay("");
        }
        if (pathname.substring(0, 6) == '/post/' || pathname.substring(0, 7) == '/video/' || window.innerWidth > 600) {
            setIsPost(true);
        } else {
            setIsPost(false);
        }
    }, [pathname])
    const scrollToTop = () => {
        $("html, body").animate({ scrollTop: 0 }, 300);
    }
    return (
        <>
            <div style={{position:'fixed',right:'1rem',bottom:'6rem',display:'flex',alignItems:'center'}}>
                {/* <KakaoImg src={kakaoFotterIcon} style={{ display: `flex` }} onClick={() => window.open('http://pf.kakao.com/_xgKMUb/chat')} /> */}
                <Button onClick={scrollToTop} style={{ bottom: `${isPost ? '6rem' : '8rem'}`, display: `${display}`, color: '#fff' }}>
                    <AiOutlineUp />
                </Button>
            </div>

        </>
    )
}
export default ScrollToTopButton;