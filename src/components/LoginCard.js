import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import $ from 'jquery';
import axios from 'axios';
import logo from '../assets/images/test/logo.png'
import kakao from '../assets/images/icon/kakao.png'
import naver from '../assets/images/icon/naver.png'
import apple from '../assets/images/icon/apple.png'
import appleDark from '../assets/images/icon/apple-dark.png'
import { WrapperForm, CategoryName, Input, Button, FlexBox, SnsLogo } from './elements/AuthContentTemplete';
import { KAKAO_AUTH_URL } from '../data/Data';
import NaverLogin from '../pages/User/Auth/NaverLogin';
import Loading from './Loading';

const LoginCard = () => {
    const navigate = useNavigate();
    const [isWebView, setIsWebView] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("");
    useEffect(() => {
        async function isAdmin() {
            const { data: response } = await axios.get('/api/auth', {
                headers: {
                    'Content-type': 'application/json',
                }
            },
                { withCredentials: true });
            if (response.pk > 0) {
                localStorage.setItem('auth', JSON.stringify(response))
                window.location.href = '/mypage';
            } else {
                localStorage.removeItem('auth')
            }
        }
        isAdmin();
        if (window && window.flutter_inappwebview) {
            setIsWebView(true)
        }

    }, [])
    const onLogin = async () => {
        const { data: response } = await axios.post('/api/loginbyid', {
            id: $('.id').val(),
            pw: $('.pw').val()
        })
        alert(response.message);
        if (response.result > 0) {
            let params = {
                'login_type': 0,
                'id': $('.id').val()
            }
            if (window && window.flutter_inappwebview) {
                await window.flutter_inappwebview.callHandler('native_app_login', JSON.stringify(params)).then(async function (result) {
                    //result = "{'code':100, 'message':'success', 'data':{'login_type':1, 'id': 1000000}}"
                    // JSON.parse(result)
                    let obj = JSON.parse(result);
                });
            }
            await localStorage.setItem('auth', JSON.stringify(response.data));
            window.location.href = '/mypage';

        }
    }
    const onKeyPressId = (e) => {
        if (e.key == 'Enter') {
            $('.pw').focus();
        }
    }
    const onKeyPressPw = (e) => {
        if (e.key == 'Enter') {
            onLogin();
        }
    }
    const onLoginBySns = async (obj) => {
        let nick = "";
        if (obj.login_type == 1) {
            nick = "카카오" + new Date().getTime()
        } else if (obj.login_type == 2) {
            nick = "네이버" + new Date().getTime()
        } else if (obj.login_type == 3) {
            nick = "애플" + new Date().getTime()
        }
        let objs = {
            id: obj.id,
            name: obj.profile_nickname,
            nickname: nick,
            phone: obj.phone_number,
            user_level: 0,
            typeNum: obj.login_type,
            profile_img: obj.profile_image_url
        }
        const { data: response } = await axios.post('/api/loginbysns', objs);
        if (response.result > 0) {
            if (response.result <= 50) {//신규유저
                navigate('/signup', { state: { id: objs.id, typeNum: objs.typeNum, profile_img: objs.profile_img, name: objs.name } })
            } else {

                await localStorage.setItem('auth', JSON.stringify(response.data));
                window.location.href = '/mypage';
            }
        } else {
            //alert(response.message);
        }
    }

    const snsLogin = async (num) => {
        if (window && window.flutter_inappwebview) {
            setLoading(true);
            setLoadingText(num == 1 ? '카카오 로그인 중입니다...' : '')
            var params = { 'login_type': num };
            await window.flutter_inappwebview.callHandler('native_app_login', JSON.stringify(params)).then(async function (result) {
                //result = "{'code':100, 'message':'success', 'data':{'login_type':1, 'id': 1000000}}"
                // JSON.parse(result)
                let obj = JSON.parse(result);

                await onLoginBySns(obj.data);
            });
            setLoading(false);

        } else {
            if (num == 1) {
                window.location.href = KAKAO_AUTH_URL
            } else {
                alert('준비중입니다.');
            }
        }
    }

    return (
        <>
            <WrapperForm onSubmit={onLogin} id='login_form'>
                {loading ?
                    <>
                        <Loading text={loadingText} />
                    </>
                    :
                    <>
                        <CategoryName>가입 정보로 로그인</CategoryName>
                        <Input placeholder='아이디를 입력해주세요.' type={'text'} className='id' onKeyPress={onKeyPressId} />
                        <Input placeholder='비밀번호를 입력해주세요.' type={'password'} className='pw' onKeyPress={onKeyPressPw} />
                        <FlexBox style={{ justifyContent: 'space-between', fontSize: '11px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input type={'checkbox'} className='login-lock' style={{ border: '1px solid #000', outline: 'none', borderRadius: '0' }} />
                                <div>로그인 상태 유지</div>
                            </div>
                            <div style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/findmyinfo')}>
                                아이디/비밀번호 찾기
                            </div>
                        </FlexBox>
                        <Button onClick={onLogin}>로그인</Button>

                        {/* <SnsLogo src={kakao} onClick={() => snsLogin(1)} /> */}
                        {localStorage.getItem('is_ios') && isWebView ?
                            <>
                                <CategoryName style={{ marginTop: '36px' }}>SNS 간편 로그인</CategoryName>
                                <FlexBox>
                                    {localStorage.getItem('dark_mode') ?
                                        <>
                                            <SnsLogo src={apple} onClick={() => snsLogin(3)} />
                                        </>
                                        :
                                        <>
                                            <SnsLogo src={appleDark} onClick={() => snsLogin(3)} />
                                        </>
                                    }
                                </FlexBox>



                            </>
                            :
                            <>
                            </>
                        }


                        <CategoryName style={{ marginTop: '12px', fontSize: '11px' }}>
                            아직 first academy 회원이 아니라면?<strong style={{ textDecoration: 'underline', cursor: 'pointer', marginLeft: '12px' }} onClick={() => { navigate('/signup') }}>회원가입</strong>
                        </CategoryName>
                        {isWebView ?
                            <>
                                <Button style={{ marginTop: '36px' }} onClick={() => navigate('/appsetting')}>설정</Button>

                            </>
                            :
                            <>
                            </>}
                    </>}

            </WrapperForm>
        </>
    );
};
export default LoginCard