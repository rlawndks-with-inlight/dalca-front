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
export const backUrl = "https://daogo.co.kr:8443";
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
export const zSidebarMenu = [
    { name: '계약등록', link: '#' },
    { name: '결제하기', link: '#' },
    { name: '결제내역', link: '#' },
    { name: '적립포인트조회', link: '#' },
    { name: '고객정보조회 ', link: '#' },
    { name: '계약만기 및 납부현황 ', link: '#' },
]
export const historyContent = {
    bag: {
        title: "장바구니",
        columns: [
            columnObjFormat('상품명', 20, 'text', 'name'),
            columnObjFormat('상품가격', 15, 'text', 'price'),
            columnObjFormat('옵션명', 15, 'text', 'option_name'),
            columnObjFormat('수량선택', 15, 'select_count', 'select_count'),
            columnObjFormat('날짜', 15, 'date', 'date'),
            columnObjFormat('주문하기', 10, 'order', 'order'),
            columnObjFormat('삭제', 10, 'delete_bag', 'delete_bag'),
        ]
    },
    gift: {
        title: "선물한 내역",
        columns: [
            columnObjFormat('History', 50, 'history', 'note'),
            columnObjFormat('Time', 25, 'date', 'date'),
            columnObjFormat('Price', 25, 'number', 'price'),
        ]
    },
    randombox: {
        title: "랜덤박스 변동내역",
        columns: [
            columnObjFormat('History', 50, 'history', 'note'),
            columnObjFormat('Time', 25, 'date', 'date'),
            columnObjFormat('Point', 25, 'number', 'price'),
        ]
    },
    randombox_rolling: {
        title: "랜덤박스 이벤트 롤링 변동내역",
        columns: [
            columnObjFormat('History', 50, 'history', 'note'),
            columnObjFormat('Time', 25, 'date', 'date'),
            columnObjFormat('Point', 25, 'number', 'price'),
        ]
    },
    star: {
        title: "스타 변동내역",
        columns: [
            columnObjFormat('History', 50, 'history', 'note'),
            columnObjFormat('Time', 25, 'date', 'date'),
            columnObjFormat('Point', 25, 'number', 'price'),
        ]
    },
    point: {
        title: "포인트 변동내역",
        columns: [
            columnObjFormat('History', 50, 'history', 'note'),
            columnObjFormat('Time', 25, 'date', 'date'),
            columnObjFormat('Point', 25, 'number', 'price'),
        ]
    },
    eventgame: {
        title: "이벤트 게임",
        columns: [
            columnObjFormat('제목', 25, 'text', 'title'),
            columnObjFormat('진행여부', 15, 'auction_status', 'auction_status'),
            columnObjFormat('최소금액', 15, 'abs', 'min_price'),
            columnObjFormat('최대금액', 15, 'abs', 'max_price'),
            columnObjFormat('당첨자', 15, 'text', 'winner_id'),
            columnObjFormat('등록일', 15, 'date', 'date'),
        ]
    },
    esgw: {
        title: "ESGWP 변동내역",
        columns: [
            columnObjFormat('History', 50, 'history', 'note'),
            columnObjFormat('Time', 25, 'date', 'date'),
            columnObjFormat('Point', 25, 'number', 'price'),
        ]
    },
    exchange: {
        title: "출금신청내역",
        columns: [
            columnObjFormat('History', 50, 'history', 'note'),
            columnObjFormat('Time', 25, 'date', 'date'),
            columnObjFormat('Point', 25, 'number', 'price'),
        ]
    },
    sharecode: {
        title: "공유코드",
        columns: [
            columnObjFormat('Code', 50, 'text', 'code'),
            columnObjFormat('Quantity', 50, 'text', 'quantity'),
        ]
    },
    outlet_order: {
        title: "아울렛 주문 내역",
        columns: [
            columnObjFormat('상품명', 10, 'text', 'item_name'),
            columnObjFormat('옵션', 10, 'option_name', 'option_name'),
            columnObjFormat('수량', 5, 'outlet_order', 'item_count'),
            columnObjFormat('사용스타', 10, 'outlet_order', 'use_star'),
            columnObjFormat('사용포인트', 10, 'outlet_order', 'use_point'),
            columnObjFormat('날짜', 10, 'date', 'date'),
            columnObjFormat('배송현황', 10, 'outlet_order', 'status'),
            columnObjFormat('비고', 10, 'outlet_order_cancel', 'outlet_order_cancel'),
            columnObjFormat('반송사유', 25, 'outlet_order', 'return_reason'),
        ]
    },
    withdraw_request: {
        title: "출금 내역",
        columns: [
            columnObjFormat('진행상태', 15, 'withdraw_request', 'status'),
            columnObjFormat('접수일자', 20, 'date', 'date'),
            columnObjFormat('진행일자', 20, 'withdraw_request', 'date'),
            columnObjFormat('스타', 15, 'number', 'price'),
            columnObjFormat('수수료', 15, 'withdraw_request', 'commission'),
            columnObjFormat('실지급액', 15, 'withdraw_request', 'payout'),
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
