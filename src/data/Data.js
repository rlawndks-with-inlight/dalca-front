import $ from 'jquery';
import albumImg from '../assets/images/icon/albums.svg';
import albumWhiteImg from '../assets/images/icon/albums-white.svg';
import albumActiveImg from '../assets/images/icon/albums-active.svg';
import bulbImg from '../assets/images/icon/bulb.svg';
import bulbWhiteImg from '../assets/images/icon/bulb-white.svg';
import bulbActiveImg from '../assets/images/icon/bulb-active.svg';
import featureImg from '../assets/images/icon/features.svg';
import featureWhiteImg from '../assets/images/icon/features-white.svg';
import featureActiveImg from '../assets/images/icon/features-active.svg';
import talkImg from '../assets/images/icon/talk.svg';
import talkWhiteImg from '../assets/images/icon/talk-white.svg';
import talkActiveImg from '../assets/images/icon/talk-active.svg';
import thumbImg from '../assets/images/icon/thumb.svg';
import thumbWhiteImg from '../assets/images/icon/thumb-white.svg';
import thumbActiveImg from '../assets/images/icon/thumb-active.svg';
import menu5Icon from '../assets/images/icon/speaker.svg';
import menu5IconWhite from '../assets/images/icon/speaker-white.svg';
import menu5IconActive from '../assets/images/icon/speaker-active.svg';
import logo from '../assets/images/test/logo.png'
import logo_white from '../assets/images/test/logo-white.svg'
import defaultImage from '../assets/images/test/default-image.png'
import { EditorState } from "draft-js"
import theme from '../styles/theme';
import axios from 'axios';
import io from 'socket.io-client';

const test = true;

//export const backUrl = "http://localhost:8001";
export const backUrl = "https://dalcapay.com:8443";
export const frontUrl = "https://dalcapay.com";
//export const backUrl = "https://1st-academy.kr:8443";
export const SOCKET_URL = `https://dalcapay.com:5000`; // https://dalcapay.com:5000
export const socket = io(SOCKET_URL);


export const logoSrc = logo;
export const logoWhiteSrc = logo_white;
export const defaultImageSrc = defaultImage;
//http://weare-first.com:8001
export const editorState = {
    editorState: EditorState.createEmpty()
}
export const KAKAO_CLIENT_ID = "5c686a9c9a72a12ef2ef700e07d03b31";
export const KAKAO_REDIRECT_URI = `${frontUrl}/oauth/callback/kakao`;
export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

export const localization = {
    locale: 'ko',
}
export const zBottomMenu = [
    { name: `퍼스트강사${window.innerWidth>=1000?' ▼':''}`, link: '/masterlist', icon: <img src={localStorage.getItem('dark_mode') ? bulbWhiteImg : bulbImg} className='menu-icon' alt="#" />, activeIcon: <img src={bulbActiveImg} className='menu-icon' alt="#" />, className: 'master-dropdown-btn', allowList: ['/masterlist'] },
    { name: '강의실', link: '/academylist', icon: <img src={localStorage.getItem('dark_mode') ? featureWhiteImg : featureImg} className='menu-icon' alt="#" />, activeIcon: <img src={featureActiveImg} className='menu-icon' alt="#" />, className: '', allowList: ['/academylist'] },
    { name: '수강신청', link: '/enrolmentlist', icon: <img src={localStorage.getItem('dark_mode') ? albumWhiteImg : albumImg} className='menu-icon' alt="#" />, activeIcon: <img src={albumActiveImg} className='menu-icon' alt="#" />, className: '', allowList: ['/enrolmentlist'] },
    { name: '수강후기', link: '/reviewlist', icon: <img src={localStorage.getItem('dark_mode') ? thumbWhiteImg : thumbImg} className='menu-icon' alt="#" />, activeIcon: <img src={thumbActiveImg} className='menu-icon' alt="#" />, className: '', allowList: ['/reviewlist'] },
    { name: '고객센터', link: '/servicecenter', icon: <img src={localStorage.getItem('dark_mode') ? talkWhiteImg : talkImg} className='menu-icon' alt="#" />, activeIcon: <img src={talkActiveImg} className='menu-icon' alt="#" />, className: 'service-dropdown-btn', allowList: ['/servicecenter'] },
    { name: '이벤트', link: '/eventlist', icon: <img src={localStorage.getItem('dark_mode') ? menu5IconWhite : menu5Icon} className='menu-icon' alt="#" />, activeIcon: <img src={menu5IconActive} className='menu-icon' alt="#" />, className: '', allowList: ['/eventlist'] }
];

export const axiosInstance = axios.create({
    baseURL: `/`,
    timeout: 30000,
});

export const cardDefaultColor = {
    font: "#000",
    background: "#f4f4f4"
}
export const needTwoImage = ['issue', 'theme', 'feature'];


export const getManagerListApi = (table, num) => {
    let str = "";
    return str;
}

export const slideSetting = (num) => {
    return {
        infinite: false,
        dots: true,
        speed: 500,
        autoplay: false,
        autoplaySpeed: 2500,
        slidesToShow: 1.15,
        slidesToScroll: 1,
        breakpoint: 480,
        beforeChange(oldIndex, newIndex) {
            $(`.slider${num} > ul.slick-dots > li:nth-child(${(oldIndex % 1 == 0 ? oldIndex : parseInt(oldIndex) + 1) + 1})`).removeClass('slick-active');
            $(`.slider${num} > ul.slick-dots > li:nth-child(${(newIndex % 1 == 0 ? newIndex : parseInt(newIndex) + 1) + 1})`).addClass('slick-active');
        }
    }

}