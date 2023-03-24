import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';

const Wrappers = styled.div`
padding:24px;
margin:0 auto;
font-size:16px;
font-weight:500;
z-index:4;
display:flex;
justify-content:space-between;
align-items:center;
width:95%;
color:${props=>props.theme.color.manager.font1};
@media screen and (max-width:700px) {
    width:92%;
}
@media screen and (max-width:600px) {
    width:88%;
}
@media screen and (max-width:400px) {
    width:86%;
}
@media screen and (max-width:300px) {
    width:83%;
}
`
const Logout = styled.div`
border-radius:4px;
cursor:pointer;
padding:6px;
transition: 0.2s;
margin-right:24px;
&:hover{  
    background-color: ${(props) => props.theme.color.manager.background1};
    color:#fff;
    font-weight:bold;
}
@media screen and (max-width:1000px) {
    margin-right:0;
}
`
const Breadcrumb = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [nickname, setNickname] = useState('')
    useEffect(()=>{
        async function isAuth(){
            const {data:response} = await axios.get('/api/auth');
            if(location.pathname.includes('/manager')&&location.pathname!='/manager/login'&&location.pathname!='/manager'){
                if(response.user_level>=30){
                    localStorage.setItem('auth',JSON.stringify(response));
                }else{
                    localStorage.removeItem('auth')
                    navigate('/manager/login')
                }
            }
        }
        if(location.pathname.includes('/manager')){
            isAuth();
        }
    },[])
    useEffect(() => {
        if (!localStorage.getItem('auth')) {
            window.location.href = '/manager';
        } else {
            let auth = JSON.parse(localStorage.getItem('auth'));
            setNickname(auth.nickname)
        }
    }, [location])
    const onLogout = async () => {
        const { data: response } = await axios.post('/api/logout');
        
        if (response.result > 0) {
            toast.success(response.message);
            localStorage.removeItem('auth')
            navigate('/manager')
        }else{
            toast.error(response.message);

        }
    }
    return (
        <>
            <div style={{ width: '100%', boxShadow: '0 2px 4px rgb(15 34 58 / 12%)', background: '#fff' }}>
                <Wrappers>
                    <div style={{ marginLeft:'24px' }}>{props.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: '12px', fontSize: '14px', fontWeight: '400' }}>{nickname}</div>
                        <Logout onClick={() => {
                            Swal.fire({
                                title: `로그아웃 하시겠습니까?`,
                                showCancelButton: true,
                                confirmButtonText: '확인',
                                cancelButtonText: '취소'
                            }).then(async (result) => {
                                if (result.isConfirmed) {
                                    onLogout();
                                }
                            })
                        }}>로그아웃</Logout>
                    </div>
                </Wrappers>
            </div>
        </>
    )
}
export default Breadcrumb;