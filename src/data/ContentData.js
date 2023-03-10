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
import { EditorState } from "draft-js"
import { BsPerson } from 'react-icons/bs';
import { GrEdit } from 'react-icons/gr';
import { AiOutlineGift, AiOutlineWallet } from 'react-icons/ai';
import { columnObjFormat } from './Manager/ManagerContentFormat';
import theme from '../styles/theme';
export const confirmAsk = "저장 하시겠습니까?";
export const deleteAsk = "정말 삭제 하시겠습니까?";
export const max_child_depth = 500;//깊이
export const admin_pk = 74;//admin pk
//http://weare-first.com:8001
export const editorState = {
    editorState: EditorState.createEmpty()
}
export const fullBackgroundColorWrappersStyle = { background: theme.color.background1, margin: '0', minHeight: '100vh', width: '100%', maxWidth: '100%' };

export const zBottomMenu = [
    { name: '선물하기', link: '/gift', icon: <BsPerson src={localStorage.getItem('dark_mode') ? bulbWhiteImg : bulbImg} className='menu-icon' alt="#" />, activeIcon: <BsPerson src={bulbActiveImg} className='menu-icon' alt="#" />, allowList: [] },
    // { name: '핵심비디오', link: '/videolist', icon: <img src={playImg} className='menu-icon' alt="#" />, activeIcon: <img src={playActiveImg} className='menu-icon' alt="#" />, allowList: ['/videolist'] },
    { name: '지갑변동내역', link: '/randombox/history', icon: <AiOutlineWallet src={localStorage.getItem('dark_mode') ? featureWhiteImg : featureImg} className='menu-icon' alt="#" />, activeIcon: <AiOutlineWallet src={featureActiveImg} className='menu-icon' alt="#" />, allowList: [] },
    { name: '개인정보수정', link: '/editmyinfo', icon: <GrEdit src={localStorage.getItem('dark_mode') ? albumWhiteImg : albumImg} className='menu-icon' alt="#" />, activeIcon: <GrEdit src={albumActiveImg} className='menu-icon' alt="#" />, allowList: ['/editmyinfo'] },
    { name: '마이페이지', link: '/mypage', icon: <AiOutlineGift src={localStorage.getItem('dark_mode') ? talkWhiteImg : talkImg} className='menu-icon' alt="#" />, activeIcon: <AiOutlineGift src={talkActiveImg} className='menu-icon' alt="#" />, allowList: [] }
];
export const zManagerLevel = [40, 50];
export const zSidebarMenu = [
    { name: '결제카드변경', link: '/change-card', level_list: [0, ...zManagerLevel] },
    { name: '계약내역', link: '/history/contract', level_list: [0, 5, 10, ...zManagerLevel] },
    { name: '포인트내역', link: '/history/point', level_list: [0, 5, 10, ...zManagerLevel] },
    { name: '고객정보조회', link: '/customer-info', level_list: [0, 5, 10, ...zManagerLevel] },
    { name: '결제내역', link: '/history/pay', level_list: [0, 5, 10, ...zManagerLevel] },
    { name: '공지사항', link: '/list/notice', level_list: [0, 5, 10, ...zManagerLevel] },
    { name: 'FAQ', link: '/list/faq', level_list: [0, 5, 10, ...zManagerLevel] },
    { name: '문의하기', link: '/list/request', level_list: [0, 5, 10, ...zManagerLevel] },
    { name: '마이페이지', link: '/mypage', level_list: [0, 5, 10, ...zManagerLevel] },
]
export const objHistoryListContent = {
    point: {
        title: "포인트",
        columns: [
            columnObjFormat('날짜', '', 'date', 'date'),
            columnObjFormat('점수', '', 'score', 'score'),
            columnObjFormat('비고', '', 'text', 'comment'),
        ]
    },
    pay_0: {
        title: "결제",
        columns: [
            columnObjFormat('임대인명', '', 'text', 'landlord_name'),
            columnObjFormat('공인중개사명', '', 'text', 'realtor_name'),
            columnObjFormat('옵션명', '', 'text', 'option_name'),
        ]
    },
    pay_5: {
        title: "결제",
        columns: [
            columnObjFormat('임차인명', '', 'text', 'lessee_name'),
            columnObjFormat('공인중개사명', '', 'text', 'realtor_name'),
            columnObjFormat('옵션명', '', 'text', 'option_name'),
        ]
    },
    pay_10: {
        title: "결제",
        columns: [
            columnObjFormat('임대인명 ', '', 'text', 'landlord_name'),
            columnObjFormat('임차인명', '', 'text', 'lessee_name'),
            columnObjFormat('옵션명', '', 'text', 'option_name'),
        ]
    },
    contract_0: {
        title: "계약",
        columns: [
            columnObjFormat('임대인명', '', 'text', 'landlord_name'),
            columnObjFormat('공인중개사명', '', 'text', 'realtor_name'),
            columnObjFormat('등록일', '', 'date', 'date'),
            columnObjFormat('비고', '', 'contract_comment', ''),
            columnObjFormat('자세히보기', '', 'contract_detail', 'contract_detail'),
        ]
    },
    contract_5: {
        title: "계약",
        columns: [
            columnObjFormat('임차인명', '', 'text', 'lessee_name'),
            columnObjFormat('공인중개사명', '', 'text', 'realtor_name'),
            columnObjFormat('등록일', '', 'date', 'date'),
            columnObjFormat('비고', '', 'contract_comment', ''),
            columnObjFormat('자세히보기', '', 'contract_detail', 'contract_detail'),
        ]
    },
    contract_10: {
        title: "계약",
        columns: [
            columnObjFormat('임대인명 ', '', 'text', 'landlord_name'),
            columnObjFormat('임차인명', '', 'text', 'lessee_name'),
            columnObjFormat('등록일', '', 'date', 'date'),
            columnObjFormat('비고', '', 'contract_comment', ''),
            columnObjFormat('자세히보기', '', 'contract_detail', 'contract_detail'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ]
    },
};

export const cardDefaultColor = {
    font: "#000",
    background: "#f4f4f4"
}
export const needTwoImage = ['issue', 'theme', 'feature'];

export const getManagerListApi = (table, num) => {
    let str = "";
    return str;
}
export const slideSetting = {
    infinite: false,
    dots: true,
    speed: 500,
    autoplay: false,
    autoplaySpeed: 2500,
    slidesToShow: 1.15,
    slidesToScroll: 1,
    breakpoint: 480,
    beforeChange: (current, next) => { console.log(current) },
    afterChange: current => { console.log(current) },
}
