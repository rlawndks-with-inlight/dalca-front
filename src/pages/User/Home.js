import React, { useRef } from 'react'
import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import { Wrappers, ContentWrappers, twoOfThreeButtonStyle, MarginBottom, HalfTitle } from '../../components/elements/UserContentTemplete';
import Loading from '../../components/Loading';
import styled from 'styled-components';
import editIcon from '../../assets/images/icon/edit.svg'
import { Button } from '@mui/material';
import theme from '../../styles/theme';
import { Icon } from '@iconify/react';
import { getLocalStorage } from '../../functions/LocalStorage';
import { backUrl } from '../../data/Data';
import ContentTable from '../../components/ContentTable';
import { objHistoryListContent } from '../../data/ContentData';
import { getIsUser } from '../../functions/utils';
const BorderContainer = styled.div`
height:220px;
width:100%;
display:flex;
flex-direction:column;
align-items:center;
border:1px solid ${theme.color.background1};
border-radius:10px;
`
const MarginTop = styled.div`
margin-top:1.5rem;
@media screen and (max-width:1050px) { 
    margin-top:4rem;
}

`
const NoticeContainer = styled.div`
position:fixed;
z-index:9;
top:6rem;
width:100vw;
background:${theme.color.background3};
font-size:${theme.size.font4};
color:${theme.color.font2};
left:0;
display:flex;
flex-direction:column;
@media screen and (max-width:1050px) { 
    top:3.5rem;
}
`
const NoticeContent = styled.div`
width:90%;
max-width: 752px;
margin:0 auto;
padding:8px 0;
display:flex;
justify-content:space-between;
`
const NoticeComponent = (props) => {
    const { posts } = props;
    const navigate = useNavigate();
    return (
        <>
            <NoticeContainer>
                {posts && posts.map((item, idx) => (
                    <>
                        <div style={{ borderTop: `1px solid #fff`, cursor: 'pointer', width: '100%' }}
                            onClick={() => { navigate(`/post/notice/${item.pk}`) }}>
                            <NoticeContent>
                                <div>[공지] {item?.title}</div>
                                <Icon icon="material-symbols:navigate-next" style={{ fontSize: theme.size.font3 }} />
                            </NoticeContent>
                        </div>

                    </>
                ))}
            </NoticeContainer>
        </>
    )
}
const Home = () => {
    const navigate = useNavigate();
    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({});
    useEffect(() => {
        getHomeContent(true);
    }, [])
    const getHomeContent = async (is_loading) => {
        if (is_loading) {
            setLoading(true);
        }
        let user_data = getLocalStorage('auth');
        setUserData(user_data);
        const { data: response } = await axios.get('/api/gethomecontent');
        setPost(response?.data);
        if (is_loading) {
            setLoading(false);
        }
    }
    return (
        <>
            <Wrappers className='wrappers' style={{ marginBottom: '0', minHeight: '0px' }}>
                {loading ?
                    <>
                        <Loading />
                    </>
                    :
                    <>
                        <NoticeComponent
                            posts={post?.notice} />
                        <MarginTop />
                        {userData?.user_level >= 10 ?
                            <>
                                <BorderContainer>
                                    <img src={editIcon} style={{ width: '48px', margin: 'auto auto 16px auto' }} />
                                    <Button variant="text" sx={{ ...twoOfThreeButtonStyle, margin: '16px auto auto auto' }} onClick={() => { navigate('/addcontract') }}>계약생성하러 가기</Button>
                                </BorderContainer>
                            </>
                            :
                            <>
                            </>}
                    </>}
            </Wrappers>
            {loading ?
                <>
                </>
                :
                <>
                    <div style={{ width: '100%', display: 'flex' }}>
                        <img
                            src={backUrl + post?.setting?.home_banner_img_1}
                            style={{ width: '100%', margin: '16px auto', maxWidth: '750px', cursor: `${post?.setting?.home_banner_link_1 ? 'pointer' : ''}` }}
                            onClick={() => { if (post?.setting?.home_banner_link_1) window.location.href = post?.setting?.home_banner_link_1; }}
                        />
                    </div>
                </>}

            <Wrappers className='wrappers' style={{ marginTop: '0', minHeight: '53vh' }}>
                {loading ?
                    <>
                    </>
                    :
                    <>
                        {getIsUser(userData?.user_level) ?
                            <>
                                <HalfTitle style={{ maxWidth: '1050px' }}>계약내역</HalfTitle>
                                <ContentTable
                                    columns={objHistoryListContent[`contract_${userData?.user_level}`] ?? []}
                                    data={post?.contract ?? []}
                                    schema={`contract_${userData?.user_level}`}
                                    pageSetting={getHomeContent}
                                    table={'contract'}
                                />
                                <HalfTitle style={{ maxWidth: '1050px' }}>결제내역</HalfTitle>
                                <ContentTable
                                    columns={objHistoryListContent[`pay_${userData?.user_level}`] ?? []}
                                    data={post?.pay ?? []}
                                    schema={`pay_${userData?.user_level}`}
                                    table={'pay'} />
                                {userData?.user_level != 5 ?
                                    <>
                                        <HalfTitle style={{ maxWidth: '1050px' }}>포인트내역</HalfTitle>
                                        <ContentTable
                                            columns={objHistoryListContent[`point`] ?? []}
                                            data={post?.point ?? []}
                                            schema={'point'}
                                        />
                                    </>
                                    :
                                    <>
                                    </>
                                }


                            </>
                            :
                            <>
                            </>}

                    </>}
            </Wrappers>
        </>
    )
}
export default Home;
