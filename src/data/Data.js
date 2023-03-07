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
import logo from '../assets/images/test/logo.svg'
import logo_white from '../assets/images/test/logo-white.svg'
import defaultImage from '../assets/images/test/default-image.png'
import { EditorState } from "draft-js"
import theme from '../styles/theme';
import axios from 'axios';

const test = true;

//export const frontUrl = "http://localhost:3000";
export const backUrl = "https://dalcapay.com:8443";
export const frontUrl = "https://dalcapay.com";
//export const backUrl = "https://1st-academy.kr:8443";

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

export const objManagerListContent = {
    user: {
        breadcrumb: '회원',
        schema: 'user',
        zColumn: [
            { name: '로그인타입', width: '8', type: 'login_type', column: 'type' },
            { name: '아이디', width: '8', type: 'text', column: 'id' },
            { name: '닉네임', width: '8', type: 'text', column: 'nickname' },
            { name: '이름', width: '8', type: 'text', column: 'name' },
            { name: '폰번호', width: '10', type: 'text', column: 'phone' },
            { name: '레벨', width: '8', type: 'level', column: 'user_level' },
            { name: '로그인시간', width: '17', type: 'text', column: 'last_login' },
            { name: '가입일', width: '17', type: 'text', column: 'date' },
            { name: '수정', width: '8', type: 'edit', column: 'edit' },
            { name: '삭제', width: '8', type: 'delete', column: 'delete' }
        ]
    },
    user_statistics: {
        breadcrumb: '회원통계',
        schema: 'user_statistics',
        zColumn: [
            { name: '일자', width: 11, type: 'text', column: 'date' },
            { name: '가입', width: 11, type: 'number', column: 'user_count' },
            { name: '방문', width: 11, type: 'number', column: 'visit_count' },
            { name: '새글', width: 11, type: 'number', column: 'post_count' },
            { name: '댓글', width: 11, type: 'number', column: 'comment_count' },
            { name: '페이지뷰', width: 15, type: 'number', column: 'views_count' },
        ]
    },
    comment: {
        breadcrumb: '댓글',
        schema: 'comment',
        zColumn: [
            { name: '카테고리', width: 11, type: 'category_type', column: 'category_pk' },
            { name: '제목', width: 22, type: 'text', column: 'item_title' },
            { name: '닉네임', width: 11, type: 'text', column: 'user_nickname' },
            { name: '생성일', width: 17, type: 'text', column: 'date' },
            { name: '댓글', width: 28, type: 'text', column: 'note' },
            { name: '삭제', width: 12, type: 'delete', column: 'delete' }
        ]
    },
    master: {
        breadcrumb: '전문가',
        schema: 'user',
        zColumn: [
            { name: '프로필이미지', width: 12, type: 'img', column: 'profile_img' },
            { name: '채널이미지', width: 12, type: 'img', column: 'channel_img' },
            { name: '아이디', width: 12, type: 'text', column: 'id' },
            { name: '이름', width: 8, type: 'text', column: 'name' },
            { name: '채널명', width: 12, type: 'text', column: 'nickname' },
            { name: '생성시간', width: 12, type: 'text', column: 'date' },
            { name: '맨위로', width: 8, type: 'top', column: '' },
            { name: '노출여부', width: 8, type: 'status', column: 'status' },
            { name: '수정', width: 8, type: 'master_edit', column: 'edit' },
            { name: '삭제', width: 8, type: 'delete', column: 'delete' }
        ],
    },
    channel: {
        breadcrumb: '채널',
        schema: 'user',
        zColumn: [
            { name: '채널이미지', width: 24, type: 'img', column: 'channel_img' },
            { name: '채널명', width: 24, type: 'text', column: 'nickname' },
            { name: '생성시간', width: 28, type: 'text', column: 'date' },
            { name: '수정', width: 12, type: 'edit', column: 'edit' },
            { name: '삭제', width: 12, type: 'delete', column: 'delete' }
        ],
    },
    all: {
        breadcrumb: '게시물',
        schema: 'all',
        zColumn: [
            { name: '작성위치', width: 24, type: 'post_category', column: 'category' },
            { name: '제목', width: 24, type: 'text', column: 'title' },
            { name: '작성자', width: 14, type: 'text', column: 'nickname' },
            { name: '게시일', width: 12, type: 'text', column: 'date' },
            { name: '조회수', width: 12, type: 'number', column: 'views' },
            { name: '댓글수', width: 12, type: 'number', column: 'comment_num' }
        ],
    },
    oneword: {
        breadcrumb: '하루1단어',
        schema: 'oneword',
        zColumn: [
            { name: '메인이미지', width: 24, type: 'img', column: 'main_img' },
            { name: '제목', width: 24, type: 'text', column: 'title' },
            { name: '생성시간', width: 20, type: 'text', column: 'date' },
            { name: '맨위로', width: 8, type: 'top', column: '' },
            { name: '노출여부', width: 8, type: 'status', column: 'status' },
            { name: '수정', width: 8, type: 'edit', column: 'edit' },
            { name: '삭제', width: 8, type: 'delete', column: 'delete' }
        ],
    },
    oneevent: {
        breadcrumb: '하루1종목',
        schema: 'oneevent',
        zColumn: [
            { name: '메인이미지', width: 24, type: 'img', column: 'main_img' },
            { name: '제목', width: 24, type: 'text', column: 'title' },
            { name: '생성시간', width: 20, type: 'text', column: 'date' },
            { name: '맨위로', width: 8, type: 'top', column: '' },
            { name: '노출여부', width: 8, type: 'status', column: 'status' },
            { name: '수정', width: 8, type: 'edit', column: 'edit' },
            { name: '삭제', width: 8, type: 'delete', column: 'delete' }
        ],
    },
    theme: {
        breadcrumb: '핵심테마',
        schema: 'theme',
        zColumn: [
            { name: '메인이미지', width: 24, type: 'img', column: 'main_img' },
            { name: '제목', width: 24, type: 'text', column: 'title' },
            { name: '생성시간', width: 20, type: 'text', column: 'date' },
            { name: '맨위로', width: 8, type: 'top', column: '' },
            { name: '노출여부', width: 8, type: 'status', column: 'status' },
            { name: '수정', width: 8, type: 'edit', column: 'edit' },
            { name: '삭제', width: 8, type: 'delete', column: 'delete' }
        ],
    },
    strategy: {
        breadcrumb: '전문가칼럼',
        schema: 'strategy',
        zColumn: [
            { name: '메인이미지', width: 24, type: 'img', column: 'main_img' },
            { name: '제목', width: 24, type: 'text', column: 'title' },
            { name: '생성시간', width: 20, type: 'text', column: 'date' },
            { name: '맨위로', width: 8, type: 'top', column: '' },
            { name: '노출여부', width: 8, type: 'status', column: 'status' },
            { name: '수정', width: 8, type: 'edit', column: 'edit' },
            { name: '삭제', width: 8, type: 'delete', column: 'delete' }
        ],
    },
    issue: {
        breadcrumb: '핵심이슈&공시',
        schema: 'issue',
        zColumn: [
            { name: '메인이미지', width: 24, type: 'img', column: 'main_img' },
            { name: '제목', width: 24, type: 'text', column: 'title' },
            { name: '생성시간', width: 20, type: 'text', column: 'date' },
            { name: '맨위로', width: 8, type: 'top', column: '' },
            { name: '노출여부', width: 8, type: 'status', column: 'status' },
            { name: '수정', width: 8, type: 'edit', column: 'edit' },
            { name: '삭제', width: 8, type: 'delete', column: 'delete' }
        ],
    },
    issue_category: {
        breadcrumb: '핵심이슈&공시 카테고리',
        schema: 'issue_category',
        zColumn: [
            { name: '제목', width: 48, type: 'text', column: 'title' },
            { name: '생성시간', width: 20, type: 'text', column: 'date' },
            { name: '맨위로', width: 8, type: 'top', column: '' },
            { name: '노출여부', width: 8, type: 'status', column: 'status' },
            { name: '수정', width: 8, type: 'edit', column: 'edit' },
            { name: '삭제', width: 8, type: 'delete', column: 'delete' }
        ],
    },
    feature_category: {
        breadcrumb: '특징주 카테고리',
        schema: 'feature_category',
        zColumn: [
            { name: '제목', width: 48, type: 'text', column: 'title' },
            { name: '생성시간', width: 20, type: 'text', column: 'date' },
            { name: '맨위로', width: 8, type: 'top', column: '' },
            { name: '노출여부', width: 8, type: 'status', column: 'status' },
            { name: '수정', width: 8, type: 'edit', column: 'edit' },
            { name: '삭제', width: 8, type: 'delete', column: 'delete' }
        ],
    },
    feature: {
        breadcrumb: '특징주',
        schema: 'feature',
        zColumn: [
            { name: '메인이미지', width: 24, type: 'img', column: 'main_img' },
            { name: '제목', width: 24, type: 'text', column: 'title' },
            { name: '생성시간', width: 20, type: 'text', column: 'date' },
            { name: '맨위로', width: 8, type: 'top', column: '' },
            { name: '노출여부', width: 8, type: 'status', column: 'status' },
            { name: '수정', width: 8, type: 'edit', column: 'edit' },
            { name: '삭제', width: 8, type: 'delete', column: 'delete' }
        ],
    },
    video: {
        breadcrumb: '핵심비디오',
        schema: 'video',
        zColumn: [
            { name: '번호', width: 8, type: 'text', column: 'pk' },
            { name: '제목', width: 16, type: 'text', column: 'title' },
            { name: '링크', width: 20, type: 'link', column: 'link' },
            { name: '생성시간', width: 16, type: 'text', column: 'date' },
            { name: '맨위로', width: 8, type: 'top', column: '' },
            { name: '노출여부', width: 8, type: 'status', column: 'status' },
            { name: '수정', width: 8, type: 'edit', column: 'edit' },
            { name: '삭제', width: 8, type: 'delete', column: 'delete' }
        ],
    },
    notice: {
        breadcrumb: '공지',
        schema: 'notice',
        zColumn: [
            { name: '제목', width: 38, type: 'text', column: 'title' },
            { name: '생성시간', width: 38, type: 'text', column: 'date' },
            { name: '노출여부', width: 8, type: 'status', column: 'status' },
            { name: '수정', width: 8, type: 'edit', column: 'edit' },
            { name: '삭제', width: 8, type: 'delete', column: 'delete' }
        ],
    },
    popup: {
        breadcrumb: '팝업',
        schema: 'popup',
        zColumn: [
            { name: '이미지', width: 38, type: 'img', column: 'img_src' },
            { name: '생성시간', width: 38, type: 'text', column: 'date' },
            { name: '노출여부', width: 8, type: 'status', column: 'status' },
            { name: '수정', width: 8, type: 'edit', column: 'edit' },
            { name: '삭제', width: 8, type: 'delete', column: 'delete' }
        ],
    },
    alarm: {
        breadcrumb: '푸시알람',
        schema: 'alarm',
        zColumn: [
            { name: '제목', width: 25, type: 'text', column: 'title' },
            { name: '타입', width: 25, type: 'alarm_type', column: 'type' },
            { name: '생성시간', width: 26, type: 'text', column: 'date' },
            { name: '노출여부', width: 8, type: 'status', column: 'status' },
            { name: '수정', width: 8, type: 'edit', column: 'edit' },
            { name: '삭제', width: 8, type: 'delete', column: 'delete' }
        ],
    }
}
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