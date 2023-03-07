import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import $ from 'jquery';
import axios from 'axios';
import logo from '../assets/images/test/logo.png'
const WrapperForm = styled.div`
width:90%;
background:#fff;
max-width:450px;
height:430px;
margin:120px auto 0 auto;
border-radius:0.25rem;
box-shadow:0 2px 4px rgb(15 34 58 / 12%);
display:flex;
flex-direction:column;
`
const Title = styled.div`
color:${(props) => props.theme.color.background1};
font-size:36px;
width:100%;
text-align:center;
margin:24px 0;
font-weight:bold;

`
const CategoryName = styled.div`
width:352px;
margin:1rem auto 0 auto;
font-size:15px;
color:${(props) => props.theme.color.manager.font1};
font-weight:bold;
@media (max-width: 600px) {
    width:80%;
}
`
const Input = styled.input`
width:336px;
padding:12px 8px;
border-top:0;
border-left:0;
border-right:0;
border-bottom:1px soild #cccccc;
margin:1rem auto 0 auto;
outline:none;
font-size:15px;
::placeholder {
    color:#dddddd;
}
@media (max-width: 600px) {
    width:75%;
}
`
const Button = styled.button`
width:100px;
margin:49px 49px 0 auto;
height:40px;
border:none;
background:${(props) => props.theme.color.manager.background1};
color:#fff;
font-size:16px;
cursor:pointer;
border-radius:0.25rem;
border: 1px solid transparent;
@media (max-width: 600px) {
width:80%;
margin:49px auto 0 auto;
}
`
const MLoginCard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        async function isAdmin() {
            const { data: response } = await axios.get('/api/auth', {
                headers: {
                    'Content-type': 'application/json',
                }
            },
                { withCredentials: true });
            if (response.user_level >= 40) {
                localStorage.setItem('auth', JSON.stringify(response))
                navigate('/manager/list/user');
            } else if (response.user_level >= 30) {
                localStorage.setItem('auth', JSON.stringify(response))
                navigate('/manager/list/strategy');
            } else {
                localStorage.removeItem('auth')
            }
        }
        isAdmin();
    

    }, [])
    const onLogin = async () => {
        const { data: response } = await axios.post('/api/loginbyid', {
            id: $('.id').val(),
            pw: $('.pw').val()
        })
        
        if (response.result > 0) {
            await localStorage.setItem('auth', JSON.stringify(response.data));
            if (response.data?.user_level >= 40) {
                alert(response.message);
                navigate('/manager/list/user');

            } else if (response.data?.user_level >= 30) {
                alert(response.message);
                navigate('/manager/list/strategy');
            }else{
                alert("아이디 또는 비밀번호를 확인해주세요.");
                navigate("/")
            }
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
    return (
        <>
            <WrapperForm onSubmit={onLogin} id='login_form'>
                <Title>
                    <img src={logo} alt="#" style={{ height: '50px', width: 'auto' }} />
                </Title>
                <CategoryName>ID</CategoryName>
                <Input placeholder='input id' type={'text'} className='id' onKeyPress={onKeyPressId} />
                <CategoryName>PW</CategoryName>
                <Input placeholder='input password' type={'password'} className='pw' onKeyPress={onKeyPressPw} />
                <Button onClick={onLogin}>Login</Button>
            </WrapperForm>
        </>
    );
};
export default MLoginCard