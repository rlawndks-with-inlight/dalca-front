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
import ContractIcon from '../assets/images/icon/contract.svg'
import CommissionIcon from '../assets/images/icon/commission.svg'
import PayIcon from '../assets/images/icon/pay.svg'
import PointIcon from '../assets/images/icon/point.svg'
import { EditorState } from "draft-js"
import { BsPerson } from 'react-icons/bs';
import { GrEdit } from 'react-icons/gr';
import { AiOutlineGift, AiOutlineWallet } from 'react-icons/ai';
import { columnObjFormat } from './Manager/ManagerContentFormat';
import theme from '../styles/theme';
import SideCardIcon from '../assets/images/sidebar/card.svg';
import SideCommissionIcon from '../assets/images/sidebar/commission.svg';
import SideCustomerIcon from '../assets/images/sidebar/customer.svg';
import SideGuideIcon from '../assets/images/sidebar/guide.svg';
import SideHistoryIcon from '../assets/images/sidebar/history.svg';
import SideNoticeIcon from '../assets/images/sidebar/notice.svg';
import SideProfileIcon from '../assets/images/sidebar/profile.svg';
import SideRealEstateIcon from '../assets/images/sidebar/real-estate.svg';

export const confirmAsk = "저장 하시겠습니까?";
export const deleteAsk = "정말 삭제 하시겠습니까?";
export const max_child_depth = 500;//깊이
export const admin_pk = 74;//admin pk


//http://weare-first.com:8001

export const ContractIconSrc = ContractIcon;
export const PayIconSrc = PayIcon;
export const PointIconSrc = PointIcon;
export const CommissionIconSrc = CommissionIcon;

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
    { name: '공인중개사 이용가이드', link: '/post/guide/3', level_list: [10, ...zManagerLevel], icon: SideGuideIcon },
    { name: '임대인 이용가이드', link: '/post/guide/2', level_list: [5, ...zManagerLevel], icon: SideGuideIcon },
    { name: '임차인 이용가이드', link: '/post/guide/1', level_list: [0, ...zManagerLevel], icon: SideGuideIcon },
    { name: '달카페이 회원부동산 찾기', link: '/around-realestate', level_list: [0, 5, 10, ...zManagerLevel], icon: SideRealEstateIcon },
    { name: '결제카드등록 및 변경하기', link: '/card/change', level_list: [0, 5, ...zManagerLevel], icon: SideCardIcon },
    { name: '계약 및 결제내역', link: '/history/contract', level_list: [0, 5, 10, ...zManagerLevel], icon: SideHistoryIcon },
    { name: '고객정보조회', link: '/customer-info', level_list: [5, 10, ...zManagerLevel], icon: SideCustomerIcon },
    { name: '공지사항 및 문의하기', link: '/list/notice', level_list: [0, 5, 10, ...zManagerLevel], icon: SideNoticeIcon },
    { name: '내 정보 확인하기', link: '/mypage', level_list: [5, 10, ...zManagerLevel], icon: SideProfileIcon },
    { name: '내 정보 및 포인트 적립내역 확인하기', link: '/mypage', level_list: [0, ...zManagerLevel], icon: SideProfileIcon },
    { name: '정산내역', link: '/history/commission', level_list: [10, ...zManagerLevel], icon: SideCommissionIcon },
]
export const objHistoryListContent = {
    point_0: {
        title: "포인트",
        columns: [
            columnObjFormat('', '', 'date', 'date'),
            columnObjFormat('포인트', '', 'number', 'price'),
            columnObjFormat('', '25%', '', ''),
            columnObjFormat('', '25%', '', ''),
            columnObjFormat('비고', '45%', 'text', 'user_note'),
        ]
    },
    point_5: {
        title: "포인트",
        columns: [
            columnObjFormat('', '', 'date', 'date'),
            columnObjFormat('포인트', '', 'number', 'price'),
            columnObjFormat('', '25%', '', ''),
            columnObjFormat('', '25%', '', ''),
            columnObjFormat('비고', '45%', 'text', 'user_note'),
        ]
    },
    point_10: {
        title: "포인트",
        columns: [
            columnObjFormat('', '100%', 'date', 'date'),
            columnObjFormat('고객레벨', '', 'level', 'user_level'),
            columnObjFormat('고객명', '', 'number', 'user_name'),
            columnObjFormat('', '30%', '', ''),
            columnObjFormat('포인트', '35%', 'number', 'price'),
            columnObjFormat('', '30%', '', ''),
            columnObjFormat('비고', '45%', 'text', 'user_note'),
        ]
    },
    pay_0: {
        title: "결제",
        columns: [
            columnObjFormat('', '100%', 'number', 'contract_pk'),
            columnObjFormat('임대인명', '', 'text', 'landlord_name'),
            columnObjFormat('중개사명', '', 'text', 'realtor_name'),
            columnObjFormat('종류', '', 'pay_category', 'pay_category'),
            columnObjFormat('금액', '', 'number', 'price'),
            columnObjFormat('실결제액', '', 'card_percent_add_price', 'card_percent_add_price'),
            columnObjFormat('계약생성일', '', 'text', 'day'),
            columnObjFormat('납부일', '', 'text', 'trade_day'),
            columnObjFormat('납부현황', '', 'pay_status', 'status'),
            columnObjFormat('납부하기', '', 'go_pay', 'go_pay'),
            columnObjFormat('취소요청', '', 'want_cancel', 'want_cancel'),
        ]
    },
    pay_0_detail: {
        title: "결제",
        columns: [
            //columnObjFormat('선택', '100%', 'pay_check', 'pay_check'),
            columnObjFormat('', '100%', 'number', 'contract_pk'),
            columnObjFormat('임대인명', '', 'text', 'landlord_name'),
            columnObjFormat('중개사명', '', 'text', 'realtor_name'),
            columnObjFormat('종류', '', 'pay_category', 'pay_category'),
            columnObjFormat('금액', '', 'number', 'price'),
            columnObjFormat('납부타입', '', 'pay_type', 'type'),
            columnObjFormat('실결제액', '', 'card_percent_add_price', 'card_percent_add_price'),
            columnObjFormat('계약생성일', '', 'text', 'day'),
            columnObjFormat('납부일', '', 'text', 'trade_day'),
            columnObjFormat('납부현황', '', 'pay_status', 'status'),
            columnObjFormat('납부하기', '', 'go_pay', 'go_pay'),
            columnObjFormat('취소요청', '', 'want_cancel', 'want_cancel'),
        ]
    },
    pay_5: {
        title: "결제",
        columns: [
            columnObjFormat('', '100%', 'number', 'contract_pk', ''),
            columnObjFormat('지불인명', '', 'text', 'lessee_name'),
            columnObjFormat('중개사명', '', 'text', 'realtor_name'),
            columnObjFormat('종류', '', 'pay_category', 'pay_category'),
            columnObjFormat('금액', '', 'number', 'price'),
            columnObjFormat('납부타입', '', 'pay_type', 'type'),
            columnObjFormat('실결제액', '', 'card_percent_add_price', 'card_percent_add_price'),
            columnObjFormat('계약생성일', '', 'text', 'day'),
            columnObjFormat('납부일', '', 'text', 'trade_day'),
            columnObjFormat('납부하기', '', 'go_pay', 'go_pay'),
            columnObjFormat('납부현황', '', 'pay_status', 'status'),
        ]
    },
    pay_10: {
        title: "결제",
        columns: [
            columnObjFormat('', '100%', 'number', 'contract_pk'),
            columnObjFormat('임대인명 ', '', 'text', 'landlord_name'),
            columnObjFormat('지불인명', '', 'text', 'lessee_name'),
            columnObjFormat('종류', '', 'pay_category', 'pay_category'),
            columnObjFormat('금액', '', 'number', 'price'),
            columnObjFormat('납부타입', '', 'pay_type', 'type'),
            columnObjFormat('실결제액', '', 'card_percent_add_price', 'card_percent_add_price'),
            columnObjFormat('계약생성일', '', 'text', 'day'),
            columnObjFormat('납부일', '', 'text', 'trade_day'),
            columnObjFormat('미납문자발송', '', 'send_miss_pay', 'send_miss_pay'),
            columnObjFormat('납부현황', '', 'pay_status', 'status'),
            columnObjFormat('납부상태', '40%', 'change_pay_status', 'change_pay_status'),
        ]
    },
    contract_0: {
        title: "계약",
        columns: [
            columnObjFormat('', '100%', 'number', 'pk'),
            columnObjFormat('임대인', '', 'text', 'landlord_name'),
            columnObjFormat('공인중개사', '', 'text', 'realtor_name'),
            columnObjFormat('등록일', '', 'date', 'date'),
            columnObjFormat('상태', '', 'contract_comment', ''),
            columnObjFormat('계약서', '', 'contract_detail', 'contract_detail'),
            columnObjFormat('결제내역', '', 'go_pay_list', 'go_pay_list'),
        ]
    },
    contract_5: {
        title: "계약",
        columns: [
            columnObjFormat('', '100%', 'number', 'pk'),
            columnObjFormat('임차인', '', 'text', 'lessee_name'),
            columnObjFormat('공인중개사', '', 'text', 'realtor_name'),
            columnObjFormat('등록일', '', 'date', 'date'),
            columnObjFormat('상태', '', 'contract_comment', ''),
            columnObjFormat('계약서', '', 'contract_detail', 'contract_detail'),
        ]
    },
    contract_10: {
        title: "계약",
        columns: [
            columnObjFormat('', '100%', 'number', 'pk'),
            columnObjFormat('임대인', '', 'text', 'landlord_name'),
            columnObjFormat('임차인', '', 'text', 'lessee_name'),
            columnObjFormat('등록일', '', 'date', 'date'),
            columnObjFormat('상태', '', 'contract_comment', ''),
            columnObjFormat('계약서', '', 'contract_detail', 'contract_detail'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ]
    },
    commission_10: {
        title: "정산",
        columns: [
            columnObjFormat('', '100%', 'text', 'date'),
            columnObjFormat('금액', '', 'number', 'price'),
            columnObjFormat('퍼센트', '', 'percent', 'percent'),
            columnObjFormat('비고', '75%', 'text', 'note'),
        ]
    },
    request: {
        title: "문의",
        columns: [
            columnObjFormat('', '75%', 'title_link', 'title'),
            columnObjFormat('', '20%', 'is_request_com', '', 'right'),
            columnObjFormat('', '100%', 'date', 'date'),
        ]
    },
    notice: {
        title: "공지사항",
        columns: [
            columnObjFormat('', '100%', 'title_link', 'title'),
            columnObjFormat('', '', 'date', 'date'),
        ]
    },
    faq: {
        title: "자주 하는 질문",
        columns: [
            columnObjFormat('', '100%', 'title_link', 'title'),
            columnObjFormat('', '', 'date', 'date'),
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
            columnObjFormat('카드번호', '', 'card_number', 'card_number'),
            columnObjFormat('카드사용자명', '', 'text', 'card_name'),
            columnObjFormat('생년월일', '', 'text', 'birth'),
            columnObjFormat('수정', '', 'edit', 'edit'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ]
    },
    commission: {
        title: "정산내역",
        columns: [
            columnObjFormat('', '100%', 'text', 'date'),
            columnObjFormat('금액', '', 'number', 'price'),
            columnObjFormat('퍼센트', '', 'percent', 'percent'),
            columnObjFormat('비고', '75%', 'text', 'note'),
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
