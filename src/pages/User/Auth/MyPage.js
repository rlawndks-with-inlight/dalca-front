import { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import { borderButtonStyle, HalfTitle, RowContainer, RowContent, SelectType, ShadowContainer, TextButton, Title, Type, Wrappers } from "../../../components/elements/UserContentTemplete";
import { backUrl } from "../../../data/Data";
import defaultImg from '../../../assets/images/icon/default-profile.png'
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { MdEdit } from 'react-icons/md';
import theme from "../../../styles/theme";
import ContentTable from "../../../components/ContentTable";
import { Button } from "@mui/material";
import { getUserLevelByNumber } from "../../../functions/format";
import DefaultAvatar from '../../../assets/images/test/default-avatar.svg';
import BluePointIconSrc from '../../../assets/images/icon/blue-point.svg';
import { Icon } from "@iconify/react";
import { commarNumber } from "../../../functions/utils";
const MyCard = styled.div`
display:flex;
flex-direction: column;
`
const ProfileContainer = styled.div`
display:flex;
flex-direction:column;
row-gap: 0.5rem;
width: 100%;

`
const Container = styled.div`
display:flex;
flex-direction:column;
row-gap: 1rem;
font-size: ${theme.size.font5};
margin-top: 2rem;
`
const UserLevelContent = styled.div`
background: ${theme.color.background2};
color:#fff;
font-size: ${theme.size.font6};
padding: 0.25rem;
border-radius: 0.5rem;
`
const Content = styled.div`
width:100%;
display:flex;
justify-content: space-between;
`
const Category = styled.div`
color:${theme.color.font5};
`
const Result = styled.div`
display:flex;
align-items:center;
column-gap: 0.25rem;
`
const LogoutButton = styled.button`
width:160px;
height:40px;
margin:1rem auto;
border:none;
cursor:pointer;
background:${props => props.theme.color.font2};
color:#fff;
font-size:12px;
`
const MyPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [auth, setAuth] = useState({})
    const [isWebView, setIsWebView] = useState(false);
    const [bagList, setBagList] = useState();
    const [calssList, setClassList] = useState();
    const [payList, setPayList] = useState();
    useEffect(() => {
        async function isAdmin() {
            const { data: response } = await axios.get('/api/getmyinfo');
            if (response?.data?.pk > 0) {
                await localStorage.setItem('auth', JSON.stringify(response?.data))
                let obj = response?.data;
                console.log(obj)
                setAuth(obj);
            } else {
                localStorage.removeItem('auth');
                onLogout();
            }
        }
        isAdmin();
        if (window && window.flutter_inappwebview) {
            setIsWebView(true)
        }
    }, [])
    async function getMyContent() {
        const { data: response } = await axios.post('/api/myitems', { table: 'subscribe' });
        let list = [...response?.data?.data];
        let bag_list = [];
        let class_list = [];
        let pay_list = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i]?.status == 1) {
                if (list[i]?.transaction_status >= 0 && list[i]?.use_status == 1) {
                    class_list.push(list[i]);
                }
                pay_list.push(list[i]);
            } else {
                bag_list.push(list[i]);
            }
        }
        setBagList(bag_list);
        setClassList(class_list);
        setPayList(pay_list);
    }
    const pageSetting = async () => {
        await getMyContent();
    }
    const onLogout = async () => {
        if (window && window.flutter_inappwebview) {
            var params = { 'login_type': JSON.parse(localStorage.getItem('auth'))?.type };
            window.flutter_inappwebview.callHandler('native_app_logout', JSON.stringify(params)).then(async function (result) {
                //result = "{'code':100, 'message':'success', 'data':{'login_type':1, 'id': 1000000}}"
            });
        }
        const { data: response } = await axios.post('/api/logout');
        if (response.result > 0) {
            localStorage.removeItem('auth');
            window.location.href = '/login';
        } else {
            alert('error');
        }
    }

    return (
        <>
            <Wrappers className="wrapper" style={{ maxWidth: '800px' }}>
                {auth?.user_level == 0 ?
                    <>
                        <SelectType>
                            <Type style={{ border: `1px solid ${location.pathname == '/mypage' ? theme.color.background2 : '#fff'}`, color: `${location.pathname == '/mypage' ? theme.color.background2 : theme.color.font3}` }} onClick={() => { navigate(`/mypage`) }}>내정보</Type>
                            <Type style={{ border: `1px solid ${location.pathname == '/history/point' ? theme.color.background2 : '#fff'}`, color: `${location.pathname == '/history/point' ? theme.color.background2 : theme.color.font3}` }} onClick={() => { navigate(`/history/point`) }}>포인트 적립내역 및 사용하기</Type>
                        </SelectType>
                    </>
                    :
                    <>
                    </>}

                {/* <div style={{ margin: '2rem 0 1rem auto', color: `${theme.color.font2}`, fontSize: theme.size.font4, cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center' }} onClick={() => { navigate('/editmyinfo') }}>
                    <div style={{ paddingRight: '8px' }}>내정보 수정하기</div>
                    <MdEdit />
                </div> */}
                <MyCard>
                    <ProfileContainer>
                        <img src={auth?.profile_img ? auth?.profile_img.substring(0, 4) == "http" ? auth?.profile_img : backUrl + auth?.profile_img : DefaultAvatar} alt="#" onError={DefaultAvatar} style={{ height: '5rem', width: '5rem', borderRadius: '50%', background: '#fff', margin: 'auto' }} />
                        <RowContainer style={{ margin: '0 auto', alignItems: 'center', columnGap: '0.5rem' }}>
                            <UserLevelContent>
                                {getUserLevelByNumber(auth?.user_level)}
                            </UserLevelContent>
                            <div>{auth?.name}</div>
                            <Icon icon={'ooui:next-ltr'} />
                        </RowContainer>
                        <RowContainer style={{ margin: '0.5rem auto', alignItems: 'center', columnGap: '0.5rem' }}>
                            <img src={BluePointIconSrc} />
                            <div style={{ fontWeight: 'bold' }}>{commarNumber(auth?.total_point)}</div>
                            <Icon icon={'ooui:next-ltr'} />
                        </RowContainer>
                    </ProfileContainer>
                    <Container>
                        <Content>
                            <Category>아이디</Category>
                            <Result>
                                <div>
                                    {auth?.type != 0 ? "---" : auth.id}
                                </div>
                            </Result>
                        </Content>
                        <Content style={{ cursor: 'pointer' }} onClick={() => {
                            navigate(`/editmyinfo/0`);
                        }}>
                            <Category>비밀번호 변경</Category>
                            <Result>
                                <Icon icon={'ooui:next-ltr'} />
                            </Result>
                        </Content>
                        <Content>
                            <Category>유저권한</Category>
                            <Result>
                                <div>
                                    {getUserLevelByNumber(auth?.user_level, true)}
                                </div>
                            </Result>
                        </Content>
                        <Content style={{ cursor: 'pointer' }} onClick={() => {
                            navigate(`/editmyinfo/1`);
                        }}>
                            <Category>휴대폰번호</Category>
                            <Result>
                                <div>
                                    {auth?.phone ?? "---"}
                                </div>
                                <Icon icon={'ooui:next-ltr'} />
                            </Result>
                        </Content>
                        <Content>
                            <Category>우편번호</Category>
                            <Result>
                                <div>
                                    {auth?.zip_code}
                                </div>
                            </Result>
                        </Content>
                        <Content style={{ cursor: 'pointer' }} onClick={() => {
                            navigate(`/editmyinfo/2`);
                        }}>
                            <Category>주소</Category>
                            <Result>
                                <div>
                                    {auth?.address}&nbsp;
                                    {auth?.address_detail}
                                </div>
                                <Icon icon={'ooui:next-ltr'} />
                            </Result>
                        </Content>
                        <div style={{ borderBottom: `1px solid #ccc` }} />
                        <Content onClick={onLogout} style={{ cursor: 'pointer' }}>
                            <Category>로그아웃</Category>
                            <Result>
                                <Icon icon={'ooui:next-ltr'} />
                            </Result>
                        </Content>
                        <Content style={{ cursor: 'pointer' }} onClick={() => { navigate('/resign') }}>
                            <Category>회원탈퇴</Category>
                            <Result>
                                <Icon icon={'ooui:next-ltr'} />
                            </Result>
                        </Content>
                    </Container>
                </MyCard>
            </Wrappers>
        </>
    )
}
export default MyPage;