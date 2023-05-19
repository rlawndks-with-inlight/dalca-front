import React, { Fragment } from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { socket } from '../../data/Data';
import { Icon } from '@iconify/react';
import theme from '../../styles/theme';
import { Badge, Box, Menu, MenuItem, Select } from '@mui/material';
import $ from 'jquery';
import { commarNumber, returnMoment } from '../../functions/utils';
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
color:${props => props.theme.color.manager.font1};
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
const BellContent = styled.a`
display:flex;
flex-direction:column;
border-bottom:1px solid ${theme.color.font3};
padding-bottom:0.5rem;
text-decoration:none;
color: ${theme.color.font1};
&:visited { 
    text-decoration:none; 
    color: ${theme.color.font3};
}
`
const BellCount = styled.div`
position:absolute;
top:-0.25rem;
left:0.75rem;
background:${theme.color.red};
color:#fff;
border-radius:8px;
padding:0 0.25rem;
font-size:${theme.size.font6};
`
const Breadcrumb = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [nickname, setNickname] = useState('')
    const [anchorEl, setAnchorEl] = useState(null)
    const [bellAnchorEl, setBellAnchorEl] = useState(null)
    const [bellList, setBellList] = useState([]);
    const [bellCount, setBellCount] = useState(0);
    useEffect(() => {
        async function isAuth() {
            const { data: response } = await axios.get('/api/auth');
            if (location.pathname.includes('/manager') && location.pathname != '/manager/login' && location.pathname != '/manager') {
                if (response.user_level >= 30) {
                    localStorage.setItem('auth', JSON.stringify(response));
                } else {
                    localStorage.removeItem('auth')
                    navigate('/manager/login')
                }
            }
        }
        if (location.pathname.includes('/manager')) {
            isAuth();
        }
    }, [])
    useEffect(() => {
        getBellContent();
        socket.on('message', (msg) => {
            if (msg?.site == 'manager') {
                if (msg?.table == 'user' && msg?.signup_user_level == 10) {
                    setBellList([...[{
                        pk: msg?.signup_user_pk,
                        id: msg?.signup_user_id,
                        date: returnMoment()
                    }], ...bellList]);
                    setBellCount(bellCount + 1);
                    toast.success(`새로운 공인중개사가 회원가입 하였습니다.`);
                }
            }
        });
    }, [])
    const getBellContent = async () => {
        let three_day_ago = returnMoment(-3).substring(0, 10);
        const { data: response } = await axios.get(`/api/items?table=user&level=10&order=pk&start_date=${three_day_ago}`)
        let bell_list = response?.data;
        let bell_count = 0;
        for (var i = 0; i < bell_list.length; i++) {
            if (bell_list[i]?.status != 1) {
                bell_count++;
            }
        }
        setBellCount(bell_count)
        setBellList(response?.data);
    }
    useEffect(() => {
        if (!localStorage.getItem('auth')) {
            window.location.href = '/manager';
        } else {
            let auth = JSON.parse(localStorage.getItem('auth'));
            setNickname(auth.name)
        }
    }, [location])
    const onLogout = async () => {
        setAnchorEl(null)
        Swal.fire({
            title: `로그아웃 하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data: response } = await axios.post('/api/logout');
                if (response.result > 0) {
                    toast.success(response.message);
                    localStorage.removeItem('auth')
                    navigate('/manager')
                } else {
                    toast.error(response.message);

                }
            }
        })
    }
    const handleDropdownOpen = event => {
        setAnchorEl(event.currentTarget)
    }
    const handleBellDropdownOpen = event => {
        setBellAnchorEl(event.currentTarget)
    }
    return (
        <>
            <div style={{ width: '100%', boxShadow: '0 2px 4px rgb(15 34 58 / 12%)', background: '#fff' }}>
                <Wrappers>
                    <div style={{ marginLeft: '24px' }}>{props.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Fragment>
                            <Badge
                                overlap='circular'
                                onClick={handleBellDropdownOpen}
                                sx={{ cursor: 'pointer', margin: '0 1rem 0 0.25rem' }}
                                //badgeContent={<BadgeContentSpan />}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left'
                                }}
                            >
                                <Icon icon={'bx:bell'} style={{ fontSize: theme.size.font2 }} />
                                <BellCount>{commarNumber(bellCount >= 100 ? '99+' : bellCount)}</BellCount>
                            </Badge>
                            <Menu
                                anchorEl={bellAnchorEl}
                                open={Boolean(bellAnchorEl)}
                                onClose={() => setBellAnchorEl(null)}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            >
                                <div style={{ display: '-webkit-flex', flexDirection: 'column', padding: '0 0.5rem', maxHeight: '300px', overflowY: 'auto' }} className='none-scroll'>
                                    {bellList.map((item, idx) => (
                                        <>
                                            <BellContent href={`/manager/edit/user/${item?.pk}`} className={`user-${item?.pk}`}>
                                                <div style={{ fontSize: theme.size.font5 }}>{item?.id} 공인중개사 {item?.status == 1 ? '승인 완료 되었습니다.' : '승인 대기중입니다.'}</div>
                                                <div style={{ marginLeft: 'auto', fontSize: theme.size.font6, color: theme.color.font3 }}>{item?.date}</div>
                                            </BellContent>
                                        </>
                                    ))}
                                </div>
                            </Menu>
                        </Fragment>
                        <Badge
                            overlap='circular'
                            onClick={handleDropdownOpen}
                            sx={{ cursor: 'pointer', mr: '0.5rem' }}
                            //badgeContent={<BadgeContentSpan />}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right'
                            }}
                        >
                            <Icon icon={'mingcute:user-4-line'} style={{ fontSize: theme.size.font2 }} />
                        </Badge>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                        >
                            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', color: theme.color.font2 }}>
                                <Icon icon='mingcute:user-4-line' style={{ fontSize: theme.size.font3 }} />
                                <div style={{ margin: '0 0 0.25rem 0.5rem' }}>{nickname} 님</div>
                            </Box>
                            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', color: theme.color.font2, cursor: 'pointer' }}
                                onClick={onLogout}>
                                <Icon icon='ri:logout-circle-line' style={{ fontSize: theme.size.font3 }} />
                                <div style={{ margin: '0 0 0.25rem 0.5rem' }}>로그아웃</div>
                            </Box>
                        </Menu>
                    </div>
                </Wrappers>
            </div>
        </>
    )
}
export default Breadcrumb;