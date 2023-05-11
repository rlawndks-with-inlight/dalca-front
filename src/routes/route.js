import Home from '../pages/User/Home';


import Login from '../pages/User/Auth/Login';
import MyPage from '../pages/User/Auth/MyPage';
import EditMyInfo from '../pages/User/Auth/EditMyInfo';
import FindMyInfo from '../pages/User/Auth/FindMyInfo';
import SignUp from '../pages/User/Auth/SignUp';
import Resign from '../pages/User/Auth/Resign';
import KakaoRedirectHandler from '../pages/User/Auth/KakaoRedirectHandler';

import Post from '../pages/User/Posts/Post';

import Policy from '../pages/User/Policy/Policy';

import MLogin from '../pages/Manager/MLogin';
import MUserEdit from '../pages/Manager/MUserEdit';
import MIssueCategoryEdit from '../pages/Manager/MIssueCategoryEdit';
import MFeatureCategoryEdit from '../pages/Manager/MFeatureCategoryEdit';
import MVideoEdit from '../pages/Manager/MVideoEdit';
import MSettingEdit from '../pages/Manager/MSettingEdit';

import MItemEdit from '../pages/Manager/MItemEdit';
import MItemList from '../pages/Manager/MItemList';
import MAlarmEdit from '../pages/Manager/MAlarmEdit';
import MAcademyEdit from '../pages/Manager/MAcademyEdit';
import MSubscribeEdit from '../pages/Manager/MSubscribeEdit';
import MPayEdit from '../pages/Manager/MPayEdit';
import MPayCancelEdit from '../pages/Manager/MPayCancelEdit';
import MPayExcelEdit from '../pages/Manager/MPayExcelEdit';
import InsertInfo from '../pages/User/InsertInfo';
import AddContract from '../pages/User/Contract/AddContract';
import List from '../pages/User/Community/CommunityList'
import History from '../pages/User/History/History'
import CustomerInfo from '../pages/User/Auth/CustomerInfo'
import Contract from '../pages/User/Contract/Contract';
import Request from '../pages/User/Auth/Request';
import PayReady from '../pages/User/Pay/PayReady';
import ChangeCard from '../pages/User/Pay/ChangeCard';
import MContactEdit from '../pages/Manager/MContactEdit';
import MUserCardEdit from '../pages/Manager/MUserCardEdit';
import MRealEstateEdit from '../pages/Manager/MRealEstateEdit';
import AroundRealEstate from '../pages/User/RealEstate/AroundRealEstate';
import MPointEdit from '../pages/Manager/MPointEdit';
import ChangePayStatus from '../pages/User/Pay/ChangePayStatus';

const zManagerRoute = [
    { link: '/manager', element: <MLogin />, title: "관리자로그인" },
    { link: '/manager/login', element: <MLogin />, title: "관리자로그인" },
    { link: '/manager/edit/user/:pk', element: <MUserEdit />, title: "회원관리" },
    { link: '/manager/edit/pay/:pk', element: <MPayEdit />, title: "회원관리" },
    { link: '/manager/edit/alarm/:pk', element: <MAlarmEdit />, title: "알람관리" },
    { link: '/manager/edit/subscribe/:pk', element: <MSubscribeEdit />, title: "결제 내역 관리" },
    { link: '/manager/edit/contract/:pk', element: <MContactEdit />, title: "계약 관리" },
    { link: '/manager/edit/pay_edit/:pk', element: <MPayEdit />, title: "결제 내역 관리" },
    { link: '/manager/edit/pay_cancel/:pk', element: <MPayCancelEdit />, title: "결제 내역 취소 관리" },
    { link: '/manager/edit/user_card/:pk', element: <MUserCardEdit />, title: "결제 카드 관리" },
    { link: '/manager/edit/real_estate/:pk', element: <MRealEstateEdit />, title: "부동산 관리" },
    { link: '/manager/edit/point/:pk', element: <MPointEdit />, title: "포인트 관리" },
    
    { link: '/manager/edit/setting', element: <MSettingEdit />, title: "환경설정" },
    { link: '/manager/edit/pay_excel', element: <MPayExcelEdit />, title: "" },
    
    { link: '/manager/edit/:table/:pk', element: <MItemEdit />, title: "" },
    { link: '/manager/list/:table/:pk', element: <MItemList />, title: "" },
    { link: '/manager/list/:table', element: <MItemList />, title: "" },
];
const zUserRoute = [
    { link: '/home', element: <Home />, title: "홈" },
    { link: '/insert-info', element: <InsertInfo />, title: "정보등록" },
    { link: '/post/:table/:pk', element: <Post />, title: "게시물" },
    { link: '/addcontract', element: <AddContract />, title: "" },
    { link: '/addcontract/:pk', element: <AddContract />, title: "" },
    { link: '/contract/:pk', element: <Contract />, title: "" },
    { link: '/history/:category', element: <History />, title: "" },
    { link: '/list/:category', element: <History />, title: "" },
    { link: '/customer-info', element: <CustomerInfo />, title: "" },
    { link: '/request', element: <Request />, title: "" },
    { link: '/request/:pk', element: <Request />, title: "" },
    { link: '/payready/:contract_pk', element: <PayReady />, title: "" },
    { link: '/card/:category', element: <ChangeCard />, title: "" },
    { link: '/around-realestate', element: <AroundRealEstate />, title: "" },
    { link: '/change_pay_status', element: <ChangePayStatus />, title: "" },
    
    //{ link: '/payready/:pk', element: <PayReady />, title: "결제준비" },
    //{ link: '/authpay/:pk', element: <AuthPay />, title: "결제" },
    //{ link: '/authpay', element: <AuthPay />, title: "결제" },
    //{ link: '/authpay-v2/:pk', element: <AuthPayV2 />, title: "결제 v2" },
   // { link: '/keyrecieve', element: <KeyRecieve />, title: "결제" },

    // { link: '/selectissuecategory', element: <SelectIssueCategory />, title: "핵심이슈" },
    // { link: '/selectfeaturecategory', element: <SelectFeatureCategory />, title: "특징주" },
    // { link: '/themelist', element: <ThemeList />, title: "핵심테마" },
    // { link: '/videolist', element: <VideoList />, title: "핵심비디오" },
    // { link: '/issuelist/:pk', element: <IssueList />, title: "핵심이슈" },
    // { link: '/featurelist/:pk', element: <FeatureList />, title: "특징주" },
    // { link: '/onewordlist', element: <OneWordList />, title: "하루1단어" },
    // { link: '/oneeventlist', element: <OneEventList />, title: "하루1종목" },
    // { link: '/noticelist', element: <NoticeList />, title: "공지사항" },
    { link: '/', element: <Login />, title: "로그인" },
    { link: '/login', element: <Login />, title: "로그인" },
    { link: '/mypage', element: <MyPage />, title: "마이페이지" },
    { link: '/editmyinfo', element: <EditMyInfo />, title: "회원수정" },
    { link: '/findmyinfo', element: <FindMyInfo />, title: "아이디/비밀번호 찾기" },
    { link: '/signup/:user_level', element: <SignUp />, title: "회원가입" },
    { link: '/resign', element: <Resign />, title: "회원탈퇴" },
    { link: '/oauth/callback/kakao', element: <KakaoRedirectHandler />, title: "" },
    // { link: '/post/notice/:pk', element: <Notice />, title: "공지사항" },
    // { link: '/video/:pk', element: <Video />, title: "핵심비디오" },
    { link: '/policy/:pk', element: <Policy />, title: "" },
    //{ link: '*', element: <Page404 />, title: "" },
];

export { zUserRoute, zManagerRoute }