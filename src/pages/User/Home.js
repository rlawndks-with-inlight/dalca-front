import React, { useRef } from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import theme from '../../styles/theme';
import axios from 'axios';
import { backUrl, defaultImageSrc, slideSetting } from '../../data/Data';
import { Wrappers, Title, Content, Card, Img, WrapDiv, SliderDiv, ShadowContainer, RowContent, LogoHeader } from '../../components/elements/UserContentTemplete';
import Loading from '../../components/Loading';
import $ from 'jquery';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import AcademyCard from '../../components/AcademyCard';
import { getIframeLinkByLink, onClickExternalLink, onClickWindowOpen, overString } from '../../functions/utils';
import sec3TitIcon from '../../assets/images/icon/sec3_tit.png'
import youtubeRowIcon from '../../assets/images/icon/yotube-row.png'
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';
const WrappersStyle = styled.div`
position:relative;
display:flex;
flex-direction:column;
width:100%;
margin-top:10rem;
margin-left:auto;
margin-right:auto;
font-family:${props => props.theme.font.normal};
@media screen and (max-width:1050px) { 
    margin-top:6rem;
}
`
const RowLastColumnContent = styled.div`
display:flex;
justify-content:space-between;
@media screen and (max-width:1000px) { 
flex-direction:column;
}
`
const HalfContent = styled.div`
width:48%;
font-size:${props => props.theme.size.font3};
display:flex;
flex-direction:column;
font-weight:normal;
@media screen and (max-width:1000px) { 
    width:100%;
}
`
const Iframe = styled.iframe`
width:100%;
height:300px;
@media screen and (max-width:700px) { 
    height:55vw;
    margin-bottom:8px;
}
`
const RowVideoContent = styled.div`
display:flex;
width:100%;
position:relative;
@media screen and (max-width:700px) { 
    flex-direction:column-reverse;
}
`
const NoticeContainer = styled.div`
color: ${props=>props.theme.color.font2};
display: flex;
justify-content: space-between;
font-size: theme.size.font4;
margin-bottom: 8px;
cursor: pointer;
border: 1px solid ${theme.color.font5};
padding: 4px 8px;
`
const NoticeImg = styled.img`
height: 100px;
width: 150px;
@media screen and (max-width:700px) { 
    margin:0 auto 8px auto;
    width:30vw;
    height:20vw;
}
`
const NoticeContent = styled.div`
display: flex;
flex-direction: column;
justify-content: space-between;
margin: 0 auto 0 8px;
width:306px;
@media screen and (max-width:1000px) {
width:100%;
}

`
const Home = () => {
    const navigate = useNavigate();
 
    return (
        <>
            <Wrappers className='wrappers'>
            </Wrappers>
        </>
    )
}
export default Home;