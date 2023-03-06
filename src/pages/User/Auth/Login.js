import styled from "styled-components";
import { MarginBottom, Title, TitleInputComponent, TwoOfThreeButton, Wrappers, ContentWrappers, twoOfThreeButtonStyle, InputComponet } from "../../../components/elements/UserContentTemplete";
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
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import { toast } from "react-hot-toast";
import axios from "axios";
import $ from 'jquery';
import { setLocalStorage } from "../../../functions/LocalStorage";
import { motion } from "framer-motion";
const SignUpCategoryButton = (props) => {
    const { icon, title, sub_title, onClick } = props;
    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', width: '30%', fontSize: theme.size.font4, cursor: 'pointer' }} onClick={onClick}>
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
    const [signUpCount, setSignUpCount] = useState(0);
    useEffect(() => {
    }, []);
    const onLogin = async () => {
        const { data: response } = await axios.post('/api/loginbyid', {
            id: $('.id').val(),
            pw: $('.pw').val()
        })
        if (response?.result > 0) {
            toast.success(response.message);
        } else {
            toast.error(response.message);
        }
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
            setLocalStorage('auth', JSON.stringify(response.data))
            window.location.href = '/home';

        }
    }
    return (
        <>
            <Wrappers className="wrapper" style={{ ...fullBackgroundColorWrappersStyle, background: "#fff", height: '100vh' }}>
                <ContentWrappers style={{ height: '100%' }}>
                    <img src={logoSrc} style={{ maxWidth: '500px', width: '90%', margin: 'auto auto 10vh auto' }} onClick={() => { setSignUpCount(0) }} />
                    {signUpCount == 0 ?
                        <>
                            <InputComponet
                                label={'아이디를 입력해주세요.'}
                                input_type={{
                                    placeholder: '',
                                }}
                                icon_label={<img src={userIcon} />}
                                class_name='id'
                                onKeyPress={() => $('.pw').focus()}
                            />
                            <InputComponet
                                label={'비밀번호를 입력해주세요.'}
                                input_type={{
                                    placeholder: '',
                                    type: 'password'
                                }}
                                class_name='pw'
                                onKeyPress={onLogin}
                            />
                        </>
                        :
                        <>
                            <div
style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', margin: '0 auto' }}>
                                <div style={{ color: '#fff' }}>
                                    원하는 회원가입 유형을 선택하세요.
                                </div>
                                <MarginBottom value={'1vh'} />
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <SignUpCategoryButton
                                        icon={signUpIcon1}
                                        title={'임차인'}
                                        sub_title={'세입자'}
                                        onClick={() => { navigate('/signup/0') }}
                                    />
                                    <SignUpCategoryButton
                                        icon={signUpIcon2}
                                        title={'임대인'}
                                        sub_title={'집주인'}
                                        onClick={() => { navigate('/signup/5') }}
                                    />
                                    <SignUpCategoryButton
                                        icon={signUpIcon3}
                                        title={'공인중개사'}
                                        sub_title={'부동산'}
                                        onClick={() => { navigate('/signup/10') }}
                                    />
                                </div>
                            </div>
                        </>}

                    <MarginBottom value={'10vh'} />
                    {signUpCount == 0 ?
                        <>
                            <Button variant="text" sx={twoOfThreeButtonStyle} onClick={onLogin}>로그인</Button>
                            <MarginBottom value={'1vh'} />
                            <Button variant="text" sx={twoOfThreeButtonStyle} onClick={() => { setSignUpCount(1) }}>회원가입</Button>
                        </>
                        :
                        <>
                            <Button variant="text" sx={twoOfThreeButtonStyle} onClick={() => { setSignUpCount(0) }}>로그인 페이지로</Button>
                        </>}
                    <div style={{ margin: '0 auto auto auto' }} />

                </ContentWrappers>
            </Wrappers>
        </>
    )
}
export default Login;