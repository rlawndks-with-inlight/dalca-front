import styled from "styled-components";
import { MarginBottom, Wrappers, ContentWrappers, twoOfThreeButtonStyle, InputComponent, RowContent, RowContainer, TopTitleWithBackButton } from "../../../components/elements/UserContentTemplete";
import LoginCard from "../../../components/LoginCard";
import { fullBackgroundColorWrappersStyle } from "../../../data/ContentData";
import { logoSrc } from "../../../data/Data";
import userIcon from '../../../assets/images/icon/user-id.svg';
import lockIcon from '../../../assets/images/icon/lock.svg';
import { useEffect, useState } from "react";
import signUpIcon1 from '../../../assets/images/icon/signup-1.svg';
import signUpIcon2 from '../../../assets/images/icon/signup-2.svg';
import signUpIcon3 from '../../../assets/images/icon/signup-3.svg';
import theme from "../../../styles/theme";
import { useLocation, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { toast } from "react-hot-toast";
import axios from "axios";
import $ from 'jquery';
import { setLocalStorage } from "../../../functions/LocalStorage";
import { motion } from "framer-motion";
import Footer from '../../../common/Footer'
import OverBannerSrc from '../../../assets/images/test/login-banner.svg'
import PersonIcon from '../../../assets/images/icon/person.svg'
import LockIcon from '../../../assets/images/icon/lock.svg'
import KakaoTalkIcon from '../../../assets/images/icon/kako-talk.svg'
import LandlordBannerSrc from '../../../assets/images/test/landlord-banner.svg'
import RealEstateBannerSrc from '../../../assets/images/test/real-estate-banner.svg'
import LesseeBannerSrc from '../../../assets/images/test/lessee-banner.svg'
import { Col } from "../../../components/elements/ManagerTemplete";
const OverBannerImg = styled.img`
position: absolute;
width: 800px;
top: -10vh;
left: 50%;
transform: translate(-50%, 0);
@media screen and (max-width: 1000px) {
    
    width: 100vw;
    top: -10vw;
}
`
const OverBannerPaddingTop = styled.div`
margin-bottom: 50vh;
@media screen and (max-width: 1000px) {
    margin-bottom: 80vw;
}
`
const RowIconContainer = styled.div`
display: flex;
margin: 1rem auto;
column-gap: 0.5rem;
align-items: center;
`
const SignUpCategoryButton = (props) => {
    const { icon, title, sub_title, onClick } = props;
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', width: '30%', fontSize: theme.size.font5, cursor: 'pointer' }} onClick={onClick}>
                <div style={{ background: '#fff', width: '100%', height: '13vh', borderRadius: '14px', display: 'flex', backgroundColor: '#ddd' }}>
                    <img src={icon} style={{ margin: 'auto auto', width: '50%' }} />
                </div>
                <div style={{ marginTop: '0.5vh' }}>{title}</div>
                <div style={{ marginTop: '0.5vh' }}>({sub_title})</div>
            </div>
        </>
    )
}
const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [signUpCount, setSignUpCount] = useState(0);
    const [state, setState] = useState({});
    useEffect(() => {
        window.scrollTo(0, 0);
        setState(location.state)
    }, []);
    const defaultObj = {
        id: '',
        pw: ''
    }
    const [values, setValues] = useState(defaultObj);
    useEffect(() => {
        isAuth();
    }, [])
    const isAuth = async () => {
        const { data: response } = await axios.get(`/api/auth`);
        if (response?.pk > 0) {
            navigate('/home');
        }
    }
    const handleChange = (value, key) => {
        setValues({ ...values, [key]: value });
    }
    const onLogin = async () => {
        const { data: response } = await axios.post('/api/loginbyid', values)
        if (response?.result > 0) {
            toast.success(response.message);
        } else {
            toast.error(response.message);
        }
        if (response.result > 0) {
            let params = {
                'login_type': 0,
                'id': values?.id
            }
            if (window && window.flutter_inappwebview) {
                await window.flutter_inappwebview.callHandler('native_app_login', JSON.stringify(params)).then(async function (result) {
                    //result = "{'code':100, 'message':'success', 'data':{'login_type':1, 'id': 1000000}}"
                    // JSON.parse(result)
                    let obj = JSON.parse(result);
                });
            }
            await setLocalStorage('auth', JSON.stringify(response.data));
            window.location.href = state?.redirect_url ?? '/home';

        }
    }
    return (
        <>
            <Wrappers className="wrapper" style={{ minHeight: '100vh', margin: '0 auto', background: "#fff", width: '100%' }}>
                {signUpCount == 0 &&
                    <>
                        <OverBannerImg src={OverBannerSrc} />
                    </>}
                <ContentWrappers style={{ margin: '0 auto', maxWidth: '750px', width: '90%' }}>
                    {signUpCount == 1 &&
                        <>
                            <TopTitleWithBackButton title={'로그인 하러가기'} onClickBackIcon={() => {
                                setSignUpCount(0);
                            }} />
                        </>}
                    {/* <img src={logoSrc} style={{ maxWidth: '250px', margin: 'auto auto 10vh auto', zIndex: '1' }} onClick={() => { setSignUpCount(0) }} /> */}
                    {signUpCount == 0 &&
                        <>
                            <OverBannerPaddingTop />
                            <InputComponent
                                label={'아이디를 입력해주세요.'}
                                input_type={{
                                    placeholder: '',
                                }}
                                class_name='id'
                                onKeyPress={() => $('.pw').focus()}
                                onChange={(e) => handleChange(e, 'id')}
                                value={values?.id}
                            />
                            <InputComponent
                                label={'비밀번호를 입력해주세요.'}
                                input_type={{
                                    placeholder: '',
                                    type: 'password'
                                }}
                                class_name='pw'
                                onKeyPress={onLogin}
                                onChange={(e) => handleChange(e, 'pw')}
                                value={values?.pw}
                                isSeeButton={true}
                            />
                        </>}
                    {signUpCount == 1 &&
                        <>
                            <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', margin: '0 auto' }}>
                                <div style={{ color: '', fontWeight: 'bold', margin: '1rem auto' }}>
                                    해당하는 버튼을 터치해주세요
                                </div>
                                <MarginBottom value={'1vh'} />
                                <Col style={{ rowGap: '1rem' }}>
                                    <img src={LesseeBannerSrc} onClick={() => { navigate('/signup/0') }} style={{ cursor: 'pointer', width: '100%' }} />
                                    <img src={LandlordBannerSrc} onClick={() => { navigate('/signup/5') }} style={{ cursor: 'pointer', width: '100%' }} />
                                    <img src={RealEstateBannerSrc} onClick={() => { navigate('/signup/10') }} style={{ cursor: 'pointer', width: '100%' }} />
                                </Col>
                            </div>
                        </>}
                    <MarginBottom value={'5vh'} />
                    {signUpCount == 0 &&
                        <>
                            <Button variant="text" sx={twoOfThreeButtonStyle} onClick={onLogin}>로그인</Button>
                            <MarginBottom value={'2vh'} />
                            <RowIconContainer>
                                <RowContainer style={{ columnGap: '0.25rem', cursor: 'pointer' }} onClick={() => { setSignUpCount(1) }}>
                                    <img src={PersonIcon} />
                                    <div>회원가입</div>
                                </RowContainer>
                                <RowContainer style={{ columnGap: '0.25rem', cursor: 'pointer' }} onClick={() => {
                                    navigate('/findmyinfo')
                                }}>
                                    <img src={LockIcon} />
                                    <div>ID/PW 찾기</div>
                                </RowContainer>
                                <RowContainer style={{ columnGap: '0.25rem', cursor: 'pointer' }} onClick={() => {
                                    window.location.href = `https://pf.kakao.com/_pqZxkxj`;
                                }}>
                                    <img src={KakaoTalkIcon} />
                                    <div>고객센터</div>
                                </RowContainer>
                            </RowIconContainer>
                        </>}
                    <div style={{ margin: '0 auto auto auto' }} />
                </ContentWrappers>
            </Wrappers>
            <Footer />
        </>
    )
}
export default Login;