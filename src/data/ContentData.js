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
export const mainPhone = "1533-8643";
export const zManagerLevel = [40, 50];
export const PAY_INFO = {
    MID: `wpaybill01`,
}
export const zSidebarMenu = [
    { name: '공인중개사 이용가이드', link: '/post/guide/3', level_list: [10, ...zManagerLevel] },
    { name: '임대인 이용가이드', link: '/post/guide/2', level_list: [5, ...zManagerLevel] },
    { name: '임차인 이용가이드', link: '/post/guide/1', level_list: [0, ...zManagerLevel] },
    { name: '달카페이 회원부동산', link: '/around-realestate', level_list: [0, 5, 10, ...zManagerLevel] },
    { name: '결제카드등록 및 변경', link: '/card/change', level_list: [0, 5, ...zManagerLevel] },
    { name: '타인카드등록 및 변경', link: '/card/family', level_list: [0, 5, ...zManagerLevel] },
    { name: '계약내역', link: '/history/contract', level_list: [0, 5, 10, ...zManagerLevel] },
    { name: '고객정보조회', link: '/customer-info', level_list: [5, 10, ...zManagerLevel] },
    { name: '결제내역', link: '/history/pay', level_list: [0, 5, 10, ...zManagerLevel] },
    { name: '공지사항', link: '/list/notice', level_list: [0, 5, 10, ...zManagerLevel] },
    { name: '자주 하는 질문', link: '/list/faq', level_list: [0, 5, 10, ...zManagerLevel] },
    { name: '문의하기', link: '/list/request', level_list: [0, 5, 10, ...zManagerLevel] },
    { name: '마이페이지', link: '/mypage', level_list: [0, 5, 10, ...zManagerLevel] },
    { name: '포인트 적립내역 및 사용', link: '/history/point', level_list: [0, 10, ...zManagerLevel] },
    { name: '정산내역', link: '/history/commission', level_list: [10, ...zManagerLevel] },
]
export const objHistoryListContent = {
    point_0: {
        title: "포인트",
        columns: [
            columnObjFormat('날짜', '', 'date', 'date'),
            columnObjFormat('포인트', '', 'number', 'price'),
            columnObjFormat('비고', '', 'text', 'user_note'),
        ]
    },
    point_5: {
        title: "포인트",
        columns: [
            columnObjFormat('날짜', '', 'date', 'date'),
            columnObjFormat('포인트', '', 'number', 'price'),
            columnObjFormat('비고', '', 'text', 'user_note'),
        ]
    },
    point_10: {
        title: "포인트",
        columns: [
            columnObjFormat('날짜', '', 'date', 'date'),
            columnObjFormat('고객레벨', '', 'level', 'user_level'),
            columnObjFormat('고객명', '', 'number', 'user_name'),
            columnObjFormat('포인트', '', 'number', 'price'),
            columnObjFormat('비고', '', 'text', 'user_note'),
        ]
    },
    pay_0: {
        title: "결제",
        columns: [
            columnObjFormat('계약고유번호', '74px', 'number', 'contract_pk'),
            columnObjFormat('임대인명', '', 'text', 'landlord_name'),
            columnObjFormat('공인중개사명', '', 'text', 'realtor_name'),
            columnObjFormat('종류', '', 'pay_category', 'pay_category'),
            columnObjFormat('금액', '', 'number', 'price'),
            columnObjFormat('실결제금액', '', 'card_percent_add_price', 'card_percent_add_price'),
            columnObjFormat('납부예정일', '', 'text', 'day'),
            columnObjFormat('납부일', '', 'text', 'trade_day'),
            columnObjFormat('납부현황', '', 'pay_status', 'status'),
            columnObjFormat('납부하기', '', 'go_pay', 'go_pay'),
            columnObjFormat('취소요청', '', 'want_cancel', 'want_cancel'),
        ]
    },
    pay_5: {
        title: "결제",
        columns: [
            columnObjFormat('계약고유번호', '74px', 'number', 'contract_pk'),
            columnObjFormat('지불인명', '', 'text', 'lessee_name'),
            columnObjFormat('공인중개사명', '', 'text', 'realtor_name'),
            columnObjFormat('종류', '', 'pay_category', 'pay_category'),
            columnObjFormat('금액', '', 'number', 'price'),
            columnObjFormat('실결제금액', '', 'card_percent_add_price', 'card_percent_add_price'),
            columnObjFormat('납부예정일', '', 'text', 'day'),
            columnObjFormat('납부일', '', 'text', 'trade_day'),
            columnObjFormat('납부하기', '', 'go_pay', 'go_pay'),
            columnObjFormat('납부현황', '', 'pay_status', 'status'),
        ]
    },
    pay_10: {
        title: "결제",
        columns: [
            columnObjFormat('계약고유번호', '74px', 'number', 'contract_pk'),
            columnObjFormat('임대인명 ', '', 'text', 'landlord_name'),
            columnObjFormat('지불인명', '', 'text', 'lessee_name'),
            columnObjFormat('종류', '', 'pay_category', 'pay_category'),
            columnObjFormat('금액', '', 'number', 'price'),
            columnObjFormat('실결제금액', '', 'card_percent_add_price', 'card_percent_add_price'),
            columnObjFormat('납부예정일', '', 'text', 'day'),
            columnObjFormat('납부일', '', 'text', 'trade_day'),
            columnObjFormat('납부현황', '', 'pay_status', 'status'),
            columnObjFormat('미납문자발송', '', 'send_miss_pay', 'send_miss_pay'),
            columnObjFormat('납부상태변경', '', 'change_pay_status', 'change_pay_status'),
        ]
    },
    contract_0: {
        title: "계약",
        columns: [
            columnObjFormat('계약고유번호', '74px', 'number', 'pk'),
            columnObjFormat('임대인명', '', 'text', 'landlord_name'),
            columnObjFormat('공인중개사명', '', 'text', 'realtor_name'),
            columnObjFormat('등록일', '', 'date', 'date'),
            columnObjFormat('상태', '', 'contract_comment', ''),
            columnObjFormat('계약서보기', '', 'contract_detail', 'contract_detail'),
            columnObjFormat('결제내역', '', 'go_pay_list', 'go_pay_list'),
        ]
    },
    contract_5: {
        title: "계약",
        columns: [
            columnObjFormat('계약고유번호', '74px', 'number', 'pk'),
            columnObjFormat('임차인명', '', 'text', 'lessee_name'),
            columnObjFormat('공인중개사명', '', 'text', 'realtor_name'),
            columnObjFormat('등록일', '', 'date', 'date'),
            columnObjFormat('상태', '', 'contract_comment', ''),
            columnObjFormat('계약서보기', '', 'contract_detail', 'contract_detail'),
        ]
    },
    contract_10: {
        title: "계약",
        columns: [
            columnObjFormat('계약고유번호', '74px', 'number', 'pk'),
            columnObjFormat('임대인명 ', '', 'text', 'landlord_name'),
            columnObjFormat('임차인명', '', 'text', 'lessee_name'),
            columnObjFormat('등록일', '', 'date', 'date'),
            columnObjFormat('상태', '', 'contract_comment', ''),
            columnObjFormat('계약서보기', '', 'contract_detail', 'contract_detail'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ]
    },
    request: {
        title: "문의",
        columns: [
            columnObjFormat('제목', '', 'text', 'title'),
            columnObjFormat('등록일', '', 'date', 'date'),
            columnObjFormat('자세히보기', '', 'link', ''),
            columnObjFormat('답변상태', '', 'is_request_com', ''),
        ]
    },
    notice: {
        title: "공지사항",
        columns: [
            columnObjFormat('제목', '', 'text', 'title'),
            columnObjFormat('등록일', '', 'date', 'date'),
            columnObjFormat('자세히보기', '', 'link', ''),
        ]
    },
    faq: {
        title: "자주 하는 질문",
        columns: [
            columnObjFormat('제목', '', 'text', 'title'),
            columnObjFormat('등록일', '', 'date', 'date'),
            columnObjFormat('자세히보기', '', 'link', ''),
        ]
    },
    real_estate: {
        title: "부동산",
        columns: [
            columnObjFormat('부동산명', '', 'text', 'name'),
            columnObjFormat('주소', '', 'text', 'address'),
            columnObjFormat('상세주소', '', 'text', 'address_detail'),
            columnObjFormat('전화번호', '', 'text', 'phone'),
            columnObjFormat('거리', '', 'text', 'distance'),
        ]
    },
    user_card: {
        title: "타인카드",
        columns: [
            columnObjFormat('체크', '', 'check', 'check'),
            columnObjFormat('카드번호', '', 'text', 'card_number'),
            columnObjFormat('카드사용자명', '', 'text', 'card_name'),
            columnObjFormat('생년월일', '', 'text', 'birth'),
            columnObjFormat('수정', '', 'edit', 'edit'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ]
    },
    commission: {
        title: "정산내역",
        columns: [
            columnObjFormat('날짜', '', 'text', 'date'),
            columnObjFormat('금액', '', 'number', 'price'),
            columnObjFormat('비고', '', 'text', 'note'),
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
