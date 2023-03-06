import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/style.css'
import { zSidebarMenu } from '../data/ContentData';
import { logoSrc } from '../data/Data';
import theme from '../styles/theme';
import $ from 'jquery';
import share from '../assets/images/icon/home/share.svg';
import hamburger from '../assets/images/icon/home/hamburger.svg';
import axios from 'axios';
import { returnMoment } from '../functions/utils';
import logoutIcon from '../assets/images/icon/logout.svg'
import { Viewer } from '@toast-ui/react-editor';
import { IoMdClose } from 'react-icons/io'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { getLocalStorage } from '../functions/LocalStorage';
const Header = styled.header`
position:fixed;
height:6rem;
width:100%;
top:0;
z-index:10;
background:#ffffff;
box-shadow: 5px 10px 10px rgb(0 0 0 / 3%);
@media screen and (max-width:1050px) { 
  box-shadow:none;
  height:3.5rem;
}
`
const Row = styled.div`
display:flex;
justify-content: space-between;
margin: auto 0;
`
const Col = styled.div`
display:flex;
flex-direction:column;
text-align:center;
`
const HeaderMenuContainer = styled.div`
width:90%;
position:relative;
margin:0 auto;
display:flex;
align-items:center;
justify-content: space-between;
`
const HeaderMenuList = styled.div`
display: flex;
margin: 2rem 2rem 2rem 0;
height: 2rem;
@media screen and (max-width:1050px) { 
  display:none;
}
`


const OpenSideBarBackground = styled.div`
    position: fixed;
    background: #00000055;
    width: 100%;
    display: none;
    top: 0;
    left: 0;
    height: 100%;
    z-index:11;
`
const SideBarContainer = styled.div`
  display: flex;
  margin: 2rem 2rem 2rem 0;
  height: 2rem;
  width:250px;
  opacity:0;
  right:-100rem;
  flex-direction:column;
  position:absolute;
  top:0;
  background:#fff;
  height:100vh;
  margin:0;
  z-index:50;
  @media screen and (max-width:300px) { 
    width:90%;
  }
`
const SideBarList = styled.div`
  display: flex;
  margin: 2rem 2rem 2rem 0;
  width:100%;
  flex-direction:column;
  background:#fff;
  height:82vh;
  margin:0;
  font-size:${props => props.theme.size.font3};
  overflow-y:auto;
  padding-bottom:16px;

`
const SideBarMenu = styled.div`
text-align:left;
font-size:${props => props.theme.size.font3_5};
padding:0.5rem;
margin-left:1rem;
font-weight:bold;
cursor:pointer;
transition-duration: 0.3s;
&:hover{  
  color : ${props => props.theme.color.background1};
}
`

const HeaderLogo = styled.img`
height: 5rem;
@media screen and (max-width:1050px) { 
  height: 2.5rem;
  margin-top: 0.25rem;
}

`
const PopupContainer = styled.div`
position:absolute;
top:16px;
left:0px;
display:flex;
flex-wrap:wrap;
`
const PopupContent = styled.div`
background:#fff;
margin-right:16px;
margin-bottom:16px;
padding:24px 24px 48px 24px;
box-shadow:${props => props.theme.boxShadow};
border-radius:8px;
width:300px;
min-height:450px;
position:relative;
opacity:0.95;
z-index:10;
@media screen and (max-width:400px) { 
width:78vw;
}
`
const LeftNoneIcon = styled.div`
width:2rem;
@media screen and (max-width:1050px) { 
  display:none;
}
`
const Headers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [display, setDisplay] = useState('flex');
  const [menuDisplay, setMenuDisplay] = useState('none');
  const [auth, setAuth] = useState({})
  const [popupList, setPopupList] = useState([]);

  useEffect(() => {

     function isAuth() {
      let user_auth = getLocalStorage('auth');
      setAuth(user_auth);
    }
    if (!location.pathname.includes('/manager')) {
      isAuth();
    }
    if (location.pathname.includes('/manager')) {
      setDisplay('none');
      $('html').addClass('show-scrollbar');
    } else {
      setDisplay('flex');
    }
    if (localStorage.getItem('dark_mode')) {
      $('body').addClass("dark-mode");
      $('p').addClass("dark-mode");
      $('.toastui-editor-contents p').addClass("dark-mode");
      $('.menu-container').addClass("dark-mode");
      $('.menu-container').css("border-top", "none");
      $('.header').addClass("dark-mode");
      $('.select-type').addClass("dark-mode");
      $('.footer').addClass("dark-mode");
    } else {

    }
    async function fetchPopup() {
      const { data: response } = await axios.get('/api/items?table=notice&status=1&is_popup=1')
      setPopupList(response?.data ?? []);
    }
    if (location.pathname == '/home') {
      fetchPopup();
    } else {
      setPopupList([]);
    }
  }, [location])
  const onChangeMenuDisplay = async () => {
    if (menuDisplay == 'flex') {
      $('.sidebar-menu-list').animate({ right: '-100rem', opacity: '0' }, 300);
      $('.sidebar-open-background').attr("style", "display: none !important;");

    } else {
      $('.sidebar-menu-list').animate({ right: '-5vw', opacity: '1' }, 300);
      $('.sidebar-open-background').attr("style", "display: flex !important;");

    }

    setMenuDisplay(menuDisplay == 'flex' ? 'none' : 'flex');

  }

  const onClickLink = (link) => {
    navigate(link);
    onChangeMenuDisplay();
  }
  const shareCopy = () => {
    let copyText = document.getElementById("share-link");
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(copyText.value);
    alert("추천 url이 복사되었습니다.");
  }
  const onLogout = async () => {
    if (window.confirm('정말 로그아웃 하시겠습니까?')) {
      const { data: response } = await axios.post('/api/logout');
      if (response.result > 0) {
        localStorage.removeItem('auth');
        navigate('/login');
      } else {
        alert('error');
      }
    }
  }
  const onClosePopup = async (pk, is_not_see) => {
    if (is_not_see) {
      await localStorage.setItem(`not_see_popup_${pk}_${returnMoment().substring(0, 10).replaceAll('-', '_')}`, '1');
    }
    let popup_list = [];
    for (var i = 0; i < popupList.length; i++) {
      if (pk == popupList[i]?.pk) {
      } else {
        popup_list.push(popupList[i]);
      }
    }
    setPopupList(popup_list);
  }
  return (
    <>
      <Header style={{ display: `${display}` }} className='header'>
        <HeaderMenuContainer>{/* pc */}

          {popupList.length > 0 ?
            <>
              <PopupContainer>

                {popupList && popupList.map((item, idx) => (
                  <>
                    {localStorage.getItem(`not_see_popup_${item?.pk}_${returnMoment().substring(0, 10).replaceAll('-', '_')}`) ?
                      <>

                      </>
                      :
                      <>
                        <PopupContent>
                          <IoMdClose style={{ color: theme.color.background1, position: 'absolute', right: '8px', top: '8px', fontSize: theme.size.font3, cursor: 'pointer' }} onClick={() => { onClosePopup(item?.pk) }} />
                          <Viewer initialValue={item?.note ?? `<body></body>`} />
                          <div style={{ display: 'flex', alignItems: 'center', position: 'absolute', left: '8px', bottom: '8px' }}>
                            <IoCloseCircleOutline style={{ color: theme.color.background1, fontSize: theme.size.font3, marginRight: '4px', cursor: 'pointer' }} onClick={() => { onClosePopup(item?.pk, true) }} />
                            <div style={{ fontSize: theme.size.font5, cursor: 'pointer' }} onClick={() => { onClosePopup(item?.pk, true) }}>오늘 하루 보지않기</div>
                          </div>
                        </PopupContent>
                      </>
                    }
                  </>
                ))}
              </PopupContainer>

            </>
            :
            <>
            </>}

          <LeftNoneIcon />
          <HeaderLogo src={logoSrc} alt="홈으로" onClick={() => { navigate('/home') }} />
          <img src={hamburger} className='hamburgur' onClick={onChangeMenuDisplay} style={{ cursor: 'pointer' }} />
          <OpenSideBarBackground className='sidebar-open-background' onClick={onChangeMenuDisplay} />
          <SideBarContainer className="sidebar-menu-list">
            <img src={logoutIcon} className='hamburgur' style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', width: '32px' }} onClick={onLogout} />
            <div style={{ width: '100%', background: theme.color.background1, margin: '0', height: '18vh', color: '#fff', display: 'flex' }}>
              <Row style={{ justifyContent: 'flex-start', margin: 'auto' }}>
                {/* <img src={auth?.profile_img ? backUrl + auth?.profile_img : defaultProfile} style={{ width: '34px', height: '34px', borderRadius: '50%' }} /> */}
                <Col style={{ marginLeft: '8px', textAlign: 'left', height: '34px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ fontSize: theme.size.font3, fontWeight: 'bold' }}>{auth.name} 님 환영합니다</div>
                  </div>
                </Col>
              </Row>
            </div>
            <div style={{ width: '100%', background: theme.color.background3, height: '5vh' }} />
            <SideBarList className='scroll-table'>
              {zSidebarMenu.map((item, idx) => (
                <>
                  <SideBarMenu key={idx} onClick={() => { onClickLink(item.link) }} style={{ color: `${item.link == location.pathname ? theme.color.background1 : ''}` }}>{item.name}</SideBarMenu>
                </>
              ))}
            </SideBarList>
          </SideBarContainer>

        </HeaderMenuContainer>
      </Header>
    </>
  )
}
export default Headers;