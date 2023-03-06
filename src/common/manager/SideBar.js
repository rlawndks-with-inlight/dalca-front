import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi'
import logo from '../../assets/images/test/logo.svg'
import { BsPerson, BsCameraVideo, BsAlarm, BsGraphUp } from 'react-icons/bs'
import { MdOutlineAccessTime, MdNotificationImportant, MdOutlineFeaturedPlayList, MdOutlineStickyNote2 } from 'react-icons/md'
import { IoStatsChartSharp, IoLogoReact } from 'react-icons/io5'
import { FaChalkboardTeacher } from 'react-icons/fa'
import { AiOutlineQuestionCircle, AiOutlineRotateLeft, AiOutlineComment } from 'react-icons/ai'
import { WiDayHaze } from 'react-icons/wi'
import { SiMicrostrategy } from 'react-icons/si'
import { BiCommentDetail } from 'react-icons/bi'
import axios from 'axios';
import $ from 'jquery'
import { GoRepoPush } from 'react-icons/go'
import { zSidebar } from '../../data/Manager/ManagerContentData';
import theme from '../../styles/theme';
const Wrappers = styled.div`
display:flex;
flex-direction:column;
width:250px;
min-height:100vh;
box-shadow:0 2px 4px rgb(15 34 58 / 12%);
z-index:5;
position:fixed;
background:#fff;
overflow-y:auto;
padding-bottom:16px;
@media screen and (max-width:900px) {
    position:fixed;
    display:${(props => props.display)};
    transition:0.3s;
    @keyframes fadein {
        from {
            left:-500px;
        }
        to {
            left:0;
        }
      }
}
`
const LogoWrappers = styled.div`
text-align:center;
font-size:32px;
font-weight:bold;
padding-top:24px;
padding-bottom:24px;
color:${(props) => props.theme.color.background1};
`
const SelectMenuContent = styled.div`
width:192px;
padding:8px;
background:${(props) => props.theme.color.background1}29;
margin:0.3rem auto;
border-radius:3px;
font-size:15px;
display:flex;
align-items:center;
color:${(props) => props.theme.color.manager.background1};
cursor:pointer;
`
const MenuContent = styled.div`
width:192px;
padding:8px;
background:#fff;
margin:0.3rem auto;
border-radius:12px;
font-size:15px;
display:flex;
align-items:center;
color:${(props) => props.theme.color.manager.font3};
cursor:pointer;
transition: 0.4s;
&:hover{  
    color:${(props) => props.theme.color.manager.font1};
}
`
const MenuText = styled.p`
margin:0 0 0 8px;
`
const SubMenuText = styled.p`
margin:0 0 0 23px;
font-size: 13px;
`
const HambergurContainer = styled.div`
display:none;
position:fixed;
top:0;
left:0;
z-index:5;
padding:12px;
@media screen and (max-width:900px) {
    display:flex;
}
`
const SideBar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [auth, setAuth] = useState({})
    const [zIssueCategory, setZIssueCategory] = useState([])
    const [issueCategoryDisplay, setIssueCategoryDisplay] = useState(false);
    const [zFeatureCategory, setZFeatureCategory] = useState([])
    const [featureCategoryDisplay, setFeatureCategoryDisplay] = useState(false);
    const [zInnerSideBar, setZInnerSideBar] = useState({});
    const [sideBarDisplayList, setSideBarDisplayList] = useState([]);
    const [display, setDisplay] = useState('none');
    useEffect(() => {
        if (localStorage.getItem('auth')) {
            let obj = JSON.parse(localStorage.getItem('auth'))
            setAuth(obj);
        }
    }, [location]);
    useEffect(() => {
        let side_bar_display_list = [];
        for (var i = 0; i < zSidebar.length; i++) {
            side_bar_display_list.push(false);
        }
        setSideBarDisplayList(side_bar_display_list);
        async function fetchPost() {

        }
        fetchPost()

    }, [])
    const onChangeMenuDisplay = async () => {
        if (display == 'flex') {
            $('.header-menu-list').animate({ left: '-500px', opacity: '0' }, 300);
            if (window.innerWidth <= 1050) {
                await new Promise((r) => setTimeout(r, 300));
                $('.header-menu-list').css("display", "none");
            }
        } else {
            $('.header-menu-list').animate({ left: '0', opacity: '1' }, 1);
            if (window.innerWidth <= 1050) {
                $('.header-menu-list').css("display", "flex");
            }
        }
        setDisplay(display == 'flex' ? 'none' : 'flex');
    }
    const onClickMenu = (idx) => {
        let side_bar_display_list = [...sideBarDisplayList];
        side_bar_display_list[idx] = !side_bar_display_list[idx];
        setSideBarDisplayList(side_bar_display_list);
    }
    const onClickSubMenu = (obj) => {
        navigate(obj.link);
    }
    return (
        <>
            <HambergurContainer onClick={onChangeMenuDisplay}>
                <GiHamburgerMenu />
            </HambergurContainer>
            <Wrappers className='scroll-css header-menu-list'>
                <HambergurContainer onClick={onChangeMenuDisplay}>
                    <GiHamburgerMenu />
                </HambergurContainer>
                <LogoWrappers>
                    <img src={logo} alt="dalca-pay" style={{ height: '40px', width: 'auto' }} />
                </LogoWrappers>
                <div style={{ maxHeight: '80vh', paddingBottom: '32px' }}>
                    {zSidebar.map((list, index) => (
                        <>
                            <MenuContent key={index} onClick={() => { onClickMenu(index) }}>
                                {list.main_icon}
                                <MenuText>{list.main_title}</MenuText>
                            </MenuContent>
                            {sideBarDisplayList[index] ?
                                <>
                                    {list.list.map((item, index) => (
                                        <>
                                            {item.allow_list.includes(location.pathname) ?
                                                <>
                                                    <SelectMenuContent key={index} onClick={() => { onClickSubMenu(item) }}>
                                                        <SubMenuText>{item.name}</SubMenuText>
                                                    </SelectMenuContent>
                                                </>
                                                :
                                                <>
                                                    <MenuContent key={index} onClick={() => { onClickSubMenu(item) }}>
                                                        <SubMenuText>{item.name}</SubMenuText>
                                                    </MenuContent>
                                                </>
                                            }
                                        </>
                                    ))}
                                </>
                                :
                                <>
                                </>
                            }

                        </>
                    ))}
                    <div style={{ paddingBottom: '36px' }} />
                </div>
            </Wrappers>
        </>
    )
}
export default SideBar