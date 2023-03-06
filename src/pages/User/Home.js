import React, { useRef } from 'react'
import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import { Wrappers, ContentWrappers, twoOfThreeButtonStyle } from '../../components/elements/UserContentTemplete';
import Loading from '../../components/Loading';
import styled from 'styled-components';
import editIcon from '../../assets/images/icon/edit.svg'
import { Button } from '@mui/material';
import theme from '../../styles/theme';
const BorderContainer = styled.div`
height:220px;
width:100%;
display:flex;
flex-direction:column;
align-items:center;
border:1px solid ${theme.color.background1};
border-radius:10px;
`

const Home = () => {
    const navigate = useNavigate();
    const [post, setPost] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getHomeContent();
    }, [])
    const getHomeContent = async () => {
        const { data: response } = await axios.get('/api/gethomecontent');
        setPost(response?.data);
    }
    return (
        <>
            <Wrappers className='wrappers'>
                {loading ?
                    <>
                        <Loading />
                    </>
                    :
                    <>
                        <ContentWrappers>
                            <BorderContainer>
                                <img src={editIcon} style={{ width: '48px', margin: 'auto auto 16px auto' }} />
                                <Button variant="text" sx={{ ...twoOfThreeButtonStyle, margin: '16px auto auto auto' }} onClick={() => { }}>계약등록하러 가기</Button>
                            </BorderContainer>
                        </ContentWrappers>
                    </>}
            </Wrappers>
        </>
    )
}
export default Home;