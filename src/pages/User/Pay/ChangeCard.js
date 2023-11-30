//카드변경

import { colorButtonStyle, ContentWrappers, borderButtonStyle, CustomSelect, InputComponent, RowContent, SelectType, twoOfThreeButtonStyle, Type, Wrappers } from "../../../components/elements/UserContentTemplete";
// ** React Imports
import { useState } from 'react'
// ** MUI Imports
import Button from '@mui/material/Button'

import { styled as muiStyled } from '@mui/material/styles'

import Box from '@mui/material/Box'

import MuiTextField from '@mui/material/TextField'
import $ from 'jquery';
import { motion } from "framer-motion";
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from '../../../functions/format';
// ** Third Party Imports
import Payment from 'payment'
import Cards from 'react-credit-cards'
import theme from "../../../styles/theme";
// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { useEffect } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getLocalStorage } from "../../../functions/LocalStorage";
import { formatPhoneNumber, range, returnCardInfoMask } from "../../../functions/utils";
import ContentTable from "../../../components/ContentTable";
import MBottomContent from "../../../components/elements/MBottomContent";
import PageButton from "../../../components/elements/pagination/PageButton";
import PageContainer from "../../../components/elements/pagination/PageContainer";
import { objHistoryListContent } from "../../../data/ContentData";
import Loading from "../../../components/Loading";
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import { Col, ImageContainer } from "../../../components/elements/ManagerTemplete";
import { backUrl, frontUrl } from "../../../data/Data";
import { AiFillFileImage } from "react-icons/ai";
import { CategoryName } from "../../../components/elements/AuthContentTemplete";
import { useRef } from "react";
import styled from "styled-components";
import CardBannerSrc from '../../../assets/images/test/card-banner.svg';
import CardIconSrc from '../../../assets/images/icon/card.svg';
import OnIconSrc from '../../../assets/images/icon/on.svg';
import OffIconSrc from '../../../assets/images/icon/off.svg';
import EditIconSrc from '../../../assets/images/icon/edit.svg'
import CheckOnIconSrc from '../../../assets/images/icon/check-on.svg'
import CheckOffIconSrc from '../../../assets/images/icon/check-off.svg'
import NoneCardSrc from '../../../assets/images/test/none-card.svg'
import CameraIconSrc from '../../../assets/images/icon/camera.svg';


const CardWrapper = muiStyled('div')({
    display: 'flex',
    margin: '0 auto',
    '& .rccs, & .rccs__card': {
        margin: 0
    }
})
const OverBannerImg = styled.img`
position: absolute;
left: 50%;
transform: translate(-50%, 0);
width:1000px;
top: -30rem;
@media screen and (max-width: 1000px) {
top: 0;
width: 100%;
}
`
const Table = styled.table`
border-collapse: collapse;
font-size: ${theme.size.font5};
`
const Tr = styled.tr`
align-items: center;
`
const Td = styled.td`
padding: 0.3rem 0;
align-items: center;
`
const CardData = (props) => {

    const { data = [], checkCardPk, setCheckCardPk, onClickEditButton, deleteItem } = props;
    return (
        <>
            <Table>
                <thead>
                    <Tr style={{ fontWeight: 'bold' }}>
                        <Td style={{ borderBottom: '1px solid #000' }}>체크</Td>
                        <Td style={{ borderBottom: '1px solid #000' }}>카드번호</Td>
                        <Td style={{ borderBottom: '1px solid #000' }}>사용자</Td>
                        <Td style={{ borderBottom: '1px solid #000' }}>생년월일</Td>
                        <Td style={{ borderBottom: '1px solid #000' }}>수정</Td>
                        <Td style={{ borderBottom: '1px solid #000' }}>삭제</Td>
                    </Tr>
                </thead>
                <tbody>
                    {data.map((item, idx) => (
                        <>
                            <Tr>
                                <Td><img src={checkCardPk == item?.pk ? CheckOnIconSrc : CheckOffIconSrc} style={{ marginTop: '4px', cursor: 'pointer' }} onClick={() => {
                                    setCheckCardPk(item?.pk)
                                }} /></Td>
                                <Td>{returnCardInfoMask('cardNumber', item?.card_number ?? "")}</Td>
                                <Td>{item?.card_name}</Td>
                                <Td>{item?.birth}</Td>
                                <Td style={{ cursor: 'pointer', marginTop: '4px' }}><img src={EditIconSrc} onClick={() => {
                                    onClickEditButton(item, -1, false)
                                }} /></Td>
                                <Td style={{ cursor: 'pointer' }} onClick={() => {
                                    deleteItem(item?.pk)
                                }}>삭제</Td>
                            </Tr>
                        </>
                    ))}
                </tbody>

            </Table>

        </>
    )
}
const ChangeCard = () => {

    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    const cardIdRef = useRef([]);

    const [user, setUser] = useState({});

    const [name, setName] = useState('')
    const [cvc, setCvc] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [focus, setFocus] = useState()
    const [expiry, setExpiry] = useState('')
    const [password, setPassword] = useState('')
    const [birth, setBirth] = useState('');
    const [page, setPage] = useState(1);
    const [pageList, setPageList] = useState([]);
    const [posts, setPosts] = useState([])
    const [isSeeCard, setIsSeeCard] = useState(true);
    const [loading, setLoading] = useState(false);
    const [editPk, setEditPk] = useState(0);
    const [familyType, setFamilyType] = useState(1);
    const [cardSrc, setCardSrc] = useState(undefined);
    const [phone, setPhone] = useState("");
    const [phoneCheck, setPhoneCheck] = useState("")
    const [isSendSms, setIsSendSms] = useState(false);
    const [randNum, setRandNum] = useState("");
    const [checkCardPk, setCheckCardPk] = useState(-1);
    const [myCheckCardPk, setMyCheckCardPk] = useState(-1);
    const [saveCardInfo, setSaveCardInfo] = useState({});
    const [openConfirmCardId, setOpenConfirmCardId] = useState(false);
    useEffect(() => {
        setLoading(true);
        getCard(1);
    }, [location.pathname])

    const getCardIdentificationInfo = async () => {
        const { data: response } = await axios.post('/api/gcii');
        setSaveCardInfo(response?.data);
        setOpenConfirmCardId(true);
    }
    useEffect(() => {
        let flag = true;
        for (var i = 0; i < cardIdRef.current.length; i++) {
            if (!cardIdRef.current[i].value) {
                flag = false;
            }
        }
        if (flag && openConfirmCardId) {
            openWindow()
            setOpenConfirmCardId(false);
        }
    }, [cardIdRef.current.map(item => { return item?.value })])
    function openWindow() {
        /*
         * 해당 로직은 팝업창 구현으로
         * 가맹점측에서 알맞게 팝업창 구현 해주시면 됩니다.
         */
        var contents;
        var OpenOption = 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=420,height=800,top=100,left=100,';
        let device_type = window.innerWidth > 800 ? 'pc' : 'mobile';
        if (device_type == 'pc') {
            contents = window.open("", "contents", OpenOption);
            document.reqfrm.action = "https://cas.inicis.com/casapp/ui/cardauthreq";
            document.reqfrm.target = "contents";
            document.reqfrm.submit();
        } else {
            document.reqfrm.action = "https://cas.inicis.com/casapp/ui/cardauthreq";
            document.reqfrm.target = "_self";
            document.reqfrm.submit();
        }
    }
    const getCard = async (num) => {
        setEditPk(0);
        setPage(num);
        let user_data = getLocalStorage('auth');
        setUser(user_data)
        let api_str = "";
        if (params?.category == 'change') {
            api_str = '/api/getmyinfo';
        } else if (params?.category == 'family') {
            setIsSeeCard(false);
            api_str = `/api/items?table=user_card&page=${num}&user_pk=${user_data?.pk}&order=pk&page_cut=10`;
        }
        const { data: response } = await axios.get(api_str);
        if (response?.result == -150) {
            toast.error('로그인을 해주세요.');
            navigate('/', {
                state: {
                    redirect_url: location.pathname
                }
            })
            return;
        }
        let data = response?.data || response?.data?.data;
        let data_obj = {};
        if (params?.category == 'change') {
            data_obj['card_cvc'] = response?.data?.card_cvc;
            data_obj['card_number'] = response?.data?.card_number;
            data_obj['card_name'] = response?.data?.card_name;
            data_obj['card_expire'] = response?.data?.card_expire;
            data_obj['birth'] = response?.data?.birth;
            data_obj['card_password'] = response?.data?.card_password;
        } else if (params?.category == 'family') {
            // data_obj['card_cvc'] = response?.data?.data[0]?.card_cvc;
            // data_obj['card_number'] = response?.data?.data[0]?.card_number;
            // data_obj['card_name'] = response?.data?.data[0]?.card_name;
            // data_obj['card_expire'] = response?.data?.data[0]?.card_expire;
            // data_obj['birth'] = response?.data?.data[0]?.birth;
            // data_obj['card_password'] = response?.data?.data[0]?.card_password;
        }
        setCvc(data?.card_cvc ?? "");
        setCardNumber(data?.card_number ?? "");
        setName(data?.card_name ?? "");
        setExpiry(data?.card_expire ?? "");
        setBirth(data?.birth ?? "");
        setPassword(data?.card_password ?? "");
        setFamilyType(1);
        setCardSrc("");
        setPageList(range(1, response?.data?.maxPage));
        setPosts(response?.data?.data);
        const { data: auto_card } = await axios.get('/api/myautocard');
        console.log(auto_card)
        setCheckCardPk(auto_card?.data?.pk ?? -1)
        setMyCheckCardPk(auto_card?.data?.pk ?? -1)
        setLoading(false);
    }


    const handleBlur = () => setFocus(undefined)

    const handleInputChange = ({ target }) => {
        if (target.name === 'cardNumber') {
            let card_number = cardNumber;
            if (card_number.length > target.value.length) {//줄어드는거
                card_number = card_number.slice(0, card_number.length - 1);
            } else {//늘어나는거
                card_number += target.value[target.value.length - 1];

            }
            card_number = formatCreditCardNumber(card_number, Payment)
            setCardNumber(card_number)
        } else if (target.name === 'expiry') {
            target.value = formatExpirationDate(target.value)
            setExpiry(target.value)
        } else if (target.name === 'cvc') {
            let cvc_number = cvc;
            if (cvc_number.length > target.value.length) {//줄어드는거
                cvc_number = cvc_number.slice(0, cvc_number.length - 1);
            } else {//늘어나는거
                cvc_number += target.value[target.value.length - 1];
            }
            cvc_number = formatCVC(cvc_number, cardNumber, Payment)
            setCvc(cvc_number)
        } else if (target.name === 'password') {
            let password_number = password;
            if (password_number.length > target.value.length) {//줄어드는거
                password_number = password_number.slice(0, password_number.length - 1);
            } else {//늘어나는거
                password_number += target.value[target.value.length - 1];
            }
            setPassword(target.value)
        }
    }
    const sendMessage = async () => {
        let string = `
        \n
        1) 부  2) 모  3) 형제  4) 자매  5) 배우자  6) 자녀\n
        ※ 가족 외에 타인카드는 등록불가합니다.\n\n
    
        1. 본인은 이 임대 계약한 월세 또는 보증금 카드결제 사실을 알고 있습니다.\n
        2. 송금이 정상 완료된 후, 첫 결제월(달)에는 결제취소 또는 카드정보변경이 되지 않습니다.\n
        3. 휴대폰번호, 성명 등의 개인정보를 수집합니다. \n
        4. 경우에 따라 본인(카드주)에게 전화를 드릴 수 있습니다.\n\n
        -달카페이-`;
        try {
            const { data: response } = await axios.post(`/api/sendsms`, {
                receiver: [user?.phone, formatPhoneNumber(user?.phone)],
                content: string
            })
            if (response?.result > 0) {
            } else {
                toast.error(response?.message);
            }
        } catch (e) {
            console.log(e)
        }
    }
    const onChangeMyCard = () => {
        if (
            !cardNumber ||
            !name ||
            !expiry ||
            !cvc ||
            !birth ||
            !password
        ) {
            toast.error("필수값이 비어 있습니다.");
            return;
        }
        if (params?.category == 'family') {
            if (!isSendSms) {
                toast.error("휴대폰 인증을 완료해 주세요.");
                return;
            }
            if (randNum != phoneCheck) {
                toast.error("인증번호가 일치하지 않습니다.");
                return;
            }
        }
        Swal.fire({
            title: `저장 하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let obj = {
                    card_number: cardNumber,
                    card_name: name,
                    card_expire: expiry,
                    card_cvc: cvc,
                    card_password: password,
                    birth: birth,
                }
                let family_obj = {
                    family_type: familyType,
                    phone: phone
                }
                let api_str = "";
                if (params?.category == 'change') {
                    api_str = '/api/change-card';
                } else if (params?.category == 'family') {
                    if (typeof cardSrc == 'string') {
                        family_obj['card_src'] = cardSrc.replaceAll(backUrl, '');
                    } else {
                        let formData = new FormData();
                        formData.append(`card`, cardSrc);
                        const { data: add_image } = await axios.post('/api/addimageitems', formData);
                        if (add_image.result < 0) {
                            toast.error(add_image?.message);
                            return;
                        }
                        family_obj['card_src'] = add_image?.data[0]?.filename;
                    }
                    if (editPk > 0) {
                        api_str = `/api/updatefamilycard`
                        family_obj['pk'] = editPk;
                    } else {
                        api_str = `/api/addfamilycard`;
                    }
                }
                obj = { ...obj, ...family_obj };
                const { data: response } = await axios.post(api_str, obj)
                if (response?.result > 0) {
                    toast.success('성공적으로 저장 되었습니다.');
                    getCard(1);
                    setEditPk(0);

                } else {
                    toast.error(response?.message);
                }


            }
        })
    }
    const addFile = (e) => {
        let { name, files } = e.target;
        if (files[0]) {
            setCardSrc(files[0]);
            $(`.${name}`).val("");
        }
    };
    const onClickEditButton = (data, idx, is_mine) => {
        setCvc(data?.card_cvc ?? "");
        setCardNumber(data?.card_number ?? "");
        setName(data?.card_name ?? "");
        setExpiry(data?.card_expire ?? "");
        setBirth(data?.birth ?? "");
        setPassword(data?.card_password ?? "");
        if (!is_mine) {
            setFamilyType(data?.family_type);
            setCardSrc(data?.card_src);
            setPhone(data?.phone ?? "");
            setPhoneCheck("");
            setEditPk(data?.pk)
            setIsSeeCard(true);
            setIsSendSms(false);
        }
    }
    const sendSms = async () => {
        if (!phone) {
            toast.error("핸드폰 번호를 입력해주세요.")
            return;
        }

        let fix_phone = phone;
        for (var i = 0; i < fix_phone.length; i++) {
            if (isNaN(parseInt(fix_phone[i]))) {
                toast.error("전화번호는 숫자만 입력해 주세요.");
                return;
            }
        }
        fix_phone = fix_phone.replaceAll('-', '');
        fix_phone = fix_phone.replaceAll(' ', '');
        setPhone(fix_phone)
        let content = "";
        for (var i = 0; i < 6; i++) {
            content += Math.floor(Math.random() * 10).toString();
        }

        let string = `\n타인카드등록\n인증번호를 입력해주세요 ${content}.\n\n-달카페이-`;
        try {
            const { data: response } = await axios.post(`/api/sendsms`, {
                receiver: [fix_phone, formatPhoneNumber(fix_phone)],
                content: string
            })
            if (response?.result > 0) {
                toast.success('인증번호가 발송되었습니다.');
                setIsSendSms(true)
                setRandNum(content);
                $('phone-check').focus();
            } else {
                toast.error(response?.message);
                setIsSendSms(false)
            }
        } catch (e) {
            console.log(e)
        }
        //console.log(response)
    }
    const registerAutoCard = async () => {
        let table = "";
        let pk = 0;
        if (params?.category == 'family') {
            table = 'user_card';
            if (posts.length == 0) {
                toast.error(`카드를 등록해 주세요.`);
            }
            pk = checkCardPk;
            if (pk == 0) {
                toast.error(`선택할 카드를 체크해 주세요.`);
                return;
            }
        } else if (params?.category == 'change') {
            table = 'user';
        } else {
            return;
        }
        Swal.fire({
            title: `저장 하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data: response } = await axios.post('/api/registerautocard', {
                    table: table,
                    pk: pk
                })
                if (response?.result > 0) {
                    toast.success("성공적으로 자동결제 카드가 등록 되었습니다.");
                    getCard(1);
                } else {
                    toast.error(response?.message);
                }
            }
        })
    }
    const onCancelAutoCard = async () => {
        Swal.fire({
            title: `정기결제 사용을 취소 하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data: response } = await axios.post('/api/cancelautocard')
                if (response?.result > 0) {
                    toast.success("성공적으로 정기결제 사용 취소 되었습니다.");
                    getCard(1);
                } else {
                    toast.error(response?.message);
                }
            }
        })
    }
    const checkOnlyOne = (checkThis) => {
        const checkboxes = document.getElementsByName('user_card-check')
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i] !== checkThis) {
                checkboxes[i].checked = false
            }
        }
    }
    const isCheckCardRegist = () => {
        if (params?.category == 'change') {
            if (myCheckCardPk == 0) {
                return true;
            }
        } else if (params?.category == 'family') {
            if (myCheckCardPk > 0) {
                return true;
            }
        }
        return false;
    }
    const deleteItem = async (pk) => {
        Swal.fire({
            title: `정말로 삭제하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let obj = {
                    pk: pk,
                    table: 'user_card',
                }
                const { data: response } = await axios.post(`/api/deleteitembyuser`, obj);
                if (response.result > 0) {
                    toast.success('삭제되었습니다.');
                    getCard(1);
                } else {
                    toast.error(response?.message);
                }
            }
        })
    }
    return (
        <>
            <form name="reqfrm" id="reqfrm" method="post" style={{ display: 'none' }}>
                <input type="hidden" id="mid" name="mid" value={saveCardInfo?.mid} ref={el => cardIdRef.current[0] = el} />
                <input type="hidden" id="Siteurl" name="Siteurl" value={frontUrl.replace('https://', '').replace('http://', '')} ref={el => cardIdRef.current[1] = el} />
                <input type="hidden" id="Tradeid" name="Tradeid" value={saveCardInfo?.Tradeid} ref={el => cardIdRef.current[2] = el} />
                <input type="hidden" id="Closeurl" name="Closeurl" value={frontUrl + '/api/'} ref={el => cardIdRef.current[3] = el} />
                <input type="hidden" id="Okurl" name="Okurl" value={frontUrl + '/api/'} ref={el => cardIdRef.current[4] = el} />
            </form>
            <OverBannerImg src={CardBannerSrc} />
            <Wrappers>
                <SelectType className="select-type">
                    <Type style={{ border: `1px solid transparent`, color: `${params?.category == 'change' ? theme.color.background2 : theme.color.font3}`, background: `${params?.category == 'change' ? '#fff' : 'transparent'}`, }} onClick={() => { navigate(`/card/change`) }}>본인카드 등록 및 변경</Type>
                    <Type style={{ border: `1px solid transparent`, color: `${params?.category == 'family' ? theme.color.background2 : theme.color.font3}`, background: `${params?.category == 'family' ? '#fff' : 'transparent'}`, }} onClick={() => { navigate(`/card/family`) }}>타인카드 등록 및 변경</Type>
                </SelectType>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '250px', margin: `${isSeeCard ? 'auto' : '1rem auto'}` }}
                >
                    {loading ?
                        <>
                            <Loading />
                        </>
                        :
                        <>

                            {isSeeCard ?
                                <>
                                    <CardWrapper style={{ marginTop: '1rem' }}>
                                        <Cards cvc={cvc} focused={focus} expiry={expiry} name={name} number={returnCardInfoMask('cardNumber', cardNumber)} />
                                    </CardWrapper>
                                </>
                                :
                                <>
                                    <img src={NoneCardSrc} style={{ maxWidth: '330px', margin: '1rem auto', width: '100%', cursor: 'pointer' }} onClick={() => {
                                        setCardNumber("");
                                        setName("");
                                        setExpiry("");
                                        setCvc("");
                                        setBirth("");
                                        setPassword("");
                                        setPhone("");
                                        setPhoneCheck("");
                                        setIsSeeCard(true);
                                        setIsSendSms(false);
                                        sendMessage();
                                        toast.success("문자 및 알림을 확인해 주세요.");
                                    }} />
                                </>}
                            {params?.category == 'family' ?
                                <>
                                    <ContentWrappers style={{ margin: '1rem auto' }}>
                                        <div style={{ fontSize: theme.size.font6, color: theme.color.red }}>
                                            ※ 가족 외에 타인카드는 등록불가합니다.<br /><br />

                                            1. 본인은 이 임대 계약한 월세 또는 보증금 카드결제 사실을 알고 있습니다.<br />
                                            2. 송금이 정상 완료된 후, 첫 결제월(달)에는 결제취소 또는 카드정보변경이 되지 않습니다.<br />
                                            3. 휴대폰번호, 성명 등의 개인정보를 수집합니다.<br />
                                            4. 경우에 따라 본인(카드주)에게 전화를 드릴 수 있습니다.<br />
                                        </div>
                                    </ContentWrappers>
                                </>
                                :
                                <>

                                </>}
                            <ContentWrappers style={{ marginTop: '1rem' }}>
                                {isSeeCard ?
                                    <>

                                        <InputComponent
                                            label={'숫자를 입력해 주세요.'}
                                            top_label={'카드번호'}
                                            class_name='cardNumber'
                                            is_divider={true}
                                            onFocus={() => {
                                                setFocus('cardNumber')
                                            }}
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                                handleInputChange({
                                                    target: {
                                                        value: e,
                                                        name: 'cardNumber'
                                                    }
                                                })
                                            }}
                                            value={returnCardInfoMask('cardNumber', cardNumber)}
                                        />
                                        <InputComponent
                                            label={''}
                                            top_label={'카드 사용자명'}
                                            class_name='name'
                                            onFocus={() => {
                                                setFocus('name')
                                            }}
                                            onBlur={handleBlur}
                                            is_divider={true}
                                            onChange={(e) => {
                                                setName(e);
                                            }}
                                            value={name}
                                        />
                                        <RowContent style={{ columnGap: '0.5rem', alignItems: 'center' }}>
                                            <Col style={{ width: '50%' }}>
                                                <InputComponent
                                                    label={''}
                                                    top_label={'만료일'}
                                                    class_name='expiry'
                                                    is_divider={true}
                                                    onFocus={() => {
                                                        setFocus('expiry')
                                                    }}
                                                    onBlur={handleBlur}
                                                    onChange={(e) => {
                                                        handleInputChange({
                                                            target: {
                                                                value: e,
                                                                name: 'expiry'
                                                            }
                                                        })
                                                    }}
                                                    value={expiry}
                                                />
                                            </Col>
                                            <Col style={{ width: '50%' }}>
                                                <InputComponent
                                                    label={''}
                                                    top_label={'CVC 번호'}
                                                    class_name='cvc'
                                                    is_divider={true}
                                                    onFocus={() => {
                                                        setFocus('cvc')
                                                    }}
                                                    onBlur={handleBlur}
                                                    onChange={(e) => {
                                                        handleInputChange({
                                                            target: {
                                                                value: e,
                                                                name: 'cvc'
                                                            }
                                                        })
                                                    }}
                                                    value={returnCardInfoMask('cvc', cvc)}
                                                />
                                            </Col>
                                        </RowContent>
                                        <RowContent style={{ columnGap: '0.5rem', alignItems: 'center' }}>
                                            <Col style={{ width: '50%' }}>
                                                <InputComponent
                                                    label={''}
                                                    top_label={'생년월일 6자리'}
                                                    class_name='birth'
                                                    is_divider={true}
                                                    onFocus={() => {
                                                        setFocus('birth')
                                                    }}
                                                    onBlur={handleBlur}
                                                    onChange={(e) => {
                                                        setBirth(e);
                                                    }}
                                                    value={birth}
                                                />
                                            </Col>
                                            <Col style={{ width: '50%' }}>
                                                <InputComponent
                                                    label={''}
                                                    top_label={'카드 비밀번호 앞 두자리'}
                                                    class_name='password'
                                                    is_divider={true}
                                                    onFocus={() => {
                                                        setFocus('password')
                                                    }}
                                                    onBlur={handleBlur}
                                                    onChange={(e) => {
                                                        handleInputChange({
                                                            target: {
                                                                value: e,
                                                                name: 'password'
                                                            }
                                                        })
                                                    }}
                                                    value={returnCardInfoMask('password', password)}
                                                />
                                            </Col>
                                        </RowContent>
                                        {params?.category == 'family' ?
                                            <>
                                                <div style={{ fontSize: theme.size.font5, fontWeight: '400', color: theme.color.font5 }}>가족관계</div>
                                                <CustomSelect
                                                    labelId="demo-select-small"
                                                    id="demo-select-small"
                                                    value={familyType}
                                                    onChange={(e) => setFamilyType(e.target.value)}
                                                >
                                                    <MenuItem value={1}>부</MenuItem>
                                                    <MenuItem value={2}>모</MenuItem>
                                                    <MenuItem value={3}>형제</MenuItem>
                                                    <MenuItem value={4}>자매</MenuItem>
                                                    <MenuItem value={5}>배우자</MenuItem>
                                                    <MenuItem value={6}>자녀</MenuItem>
                                                </CustomSelect>
                                                <CategoryName style={{ width: '98%', marginBottom: '0.5rem', fontWeight: 'bold', maxWidth: '1000px' }}>신용카드 실물</CategoryName>

                                                <div style={{ margin: '8px 0 8px auto' }} for={`card_src`}>
                                                    <label style={{
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        fontSize: theme.size.font5,
                                                        alignItems: 'center',
                                                        columnGap: '0.5rem',
                                                        color: theme.color.background2,
                                                        fontWeight: 'bold',
                                                    }} for={`card_src`} multiple>
                                                        <img src={CameraIconSrc} />
                                                        <div>업로드</div>
                                                    </label>
                                                </div>
                                                <div>
                                                    <input type="file" id={`card_src`} name={'card_src'} onChange={addFile} style={{ display: 'none' }} />
                                                </div>
                                                {cardSrc ?
                                                    <>
                                                        <img src={typeof cardSrc == 'string' ? backUrl + cardSrc : URL.createObjectURL(cardSrc)} alt="#"
                                                            style={{
                                                                width: 'auto', maxHeight: '8rem',
                                                                maxWidth: '80%',
                                                                margin: 'auto'
                                                            }} />
                                                    </>
                                                    :
                                                    <>
                                                    </>}

                                                <InputComponent
                                                    label={'휴대폰번호*'}
                                                    input_type={{
                                                        placeholder: '-없이 숫자만 입력',
                                                    }}
                                                    class_name='phone'
                                                    button_label={'인증하기'}
                                                    isButtonAble={true}
                                                    onClickButton={() => sendSms()}
                                                    onChange={(e) => {
                                                        setPhone(e)
                                                    }}
                                                    value={phone}
                                                />
                                                <InputComponent
                                                    label={'휴대폰인증번호*'}
                                                    input_type={{
                                                        placeholder: '인증번호를 입력해주세요.',
                                                    }}
                                                    class_name='phoneCheck'
                                                    onChange={(e) => setPhoneCheck(e)}
                                                    value={phoneCheck}
                                                />
                                            </>
                                            :
                                            <>
                                            </>}
                                        <RowContent style={{ columnGap: '0.5rem', marginTop: '1rem' }}>
                                            <Button sx={{ ...borderButtonStyle, width: '50%' }} onClick={() => {
                                                onClickEditButton({}, 0, true)
                                            }}>초기화</Button>
                                            <Button sx={{ ...colorButtonStyle, width: '50%' }} onClick={onChangeMyCard}>저장</Button>
                                        </RowContent>
                                    </>
                                    :
                                    <>
                                    </>}
                                {user?.user_level == 0 &&
                                    <>
                                        {/* <div style={{ margin: '0.5rem auto', maxWidth: '400px', fontSize: theme.size.font5 }}>현재 등록된 카드로 매월 정기적으로 월세납부를 원하시면 {params?.category == 'family' ? '왼쪽 체크박스 클릭하여 선택 후' : '"저장" 버튼 클릭 후'} 아래 버튼을 눌러주세요.</div> */}
                                        <RowContent style={{ alignItems: 'center', columnGap: '0.5rem', cursor: 'pointer' }}
                                            onClick={() => {
                                                if (isCheckCardRegist()) {
                                                    onCancelAutoCard();
                                                } else {
                                                    registerAutoCard();
                                                }
                                            }}
                                        >
                                            <img src={CardIconSrc} />
                                            <div>월세 정기결제 카드 등록하기</div>
                                            <img src={isCheckCardRegist() ? OnIconSrc : OffIconSrc} style={{ marginLeft: 'auto', marginTop: '0.5rem' }} />
                                        </RowContent>
                                    </>
                                }
                                {params?.category == 'family' ?
                                    <>
                                        <CardData
                                            data={posts}
                                            checkOnlyOne={checkOnlyOne}
                                            checkCardPk={checkCardPk}
                                            setCheckCardPk={setCheckCardPk}
                                            onClickEditButton={onClickEditButton}
                                            deleteItem={deleteItem}
                                        />
                                        {/* <ContentTable
                                            columns={objHistoryListContent['user_card'] ?? []}
                                            checkOnlyOne={checkOnlyOne}
                                            data={posts}
                                            schema={'user_card'}
                                            table={'user_card'}
                                            onClickEditButton={onClickEditButton}
                                            pageSetting={() => {
                                                getCard(page);
                                            }}
                                        /> */}
                                        <MBottomContent style={{ width: '100%' }}>
                                            <div />
                                            <PageContainer>
                                                <PageButton onClick={() => getCard(1)} style={{ color: '#000', background: '#fff', border: '1px solid #ccc' }}>
                                                    처음
                                                </PageButton>
                                                {pageList.map((item, index) => (
                                                    <>
                                                        <PageButton onClick={() => getCard(item)} style={{ color: `${page == item ? '#000' : ''}`, background: `${page == item ? theme.color.background1 : ''}`, display: `${Math.abs(index + 1 - page) > 4 ? 'none' : ''}` }}>
                                                            {item}
                                                        </PageButton>
                                                    </>
                                                ))}
                                                <PageButton onClick={() => getCard(pageList.length ?? 1)} style={{ color: '#000', background: '#fff', border: '1px solid #ccc' }}>
                                                    마지막
                                                </PageButton>
                                            </PageContainer>
                                            <div />
                                        </MBottomContent>
                                    </>
                                    :
                                    <>
                                    </>}

                            </ContentWrappers>

                        </>}

                </motion.div>

            </Wrappers>
        </>
    )
}
export default ChangeCard;