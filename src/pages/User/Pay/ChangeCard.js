//카드변경

import { colorButtonStyle, ContentWrappers, CustomSelect, InputComponent, Wrappers } from "../../../components/elements/UserContentTemplete";
// ** React Imports
import { useState } from 'react'

// ** MUI Imports

import Button from '@mui/material/Button'

import { styled } from '@mui/material/styles'

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
import { formatPhoneNumber, range } from "../../../functions/utils";
import ContentTable from "../../../components/ContentTable";
import MBottomContent from "../../../components/elements/MBottomContent";
import PageButton from "../../../components/elements/pagination/PageButton";
import PageContainer from "../../../components/elements/pagination/PageContainer";
import { objHistoryListContent } from "../../../data/ContentData";
import Loading from "../../../components/Loading";
import { FormControl, InputLabel, MenuItem } from "@mui/material";
import { ImageContainer } from "../../../components/elements/ManagerTemplete";
import { backUrl } from "../../../data/Data";
import { AiFillFileImage } from "react-icons/ai";
import { CategoryName } from "../../../components/elements/AuthContentTemplete";
const CreditCardWrapper = styled(Box)(({ }) => ({
    display: 'flex',
    flexDirection: 'column',
}))
const TextField = styled(MuiTextField)(({ }) => ({
    width: '100%',
    fontSize: theme.size.font4,
    margin: '8px 0',
    '& label.Mui-focused': {
        color: theme.color.background1,
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: theme.color.font5,
        },
        '&:hover fieldset': {
            borderColor: theme.color.font4_5,
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.color.background1,
        },
    },
}))
const CardWrapper = styled('div')({
    display: 'flex',
    margin: '0 auto',
    '& .rccs, & .rccs__card': {
        margin: 0
    }
})

const ChangeCard = () => {

    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({});

    const [name, setName] = useState('')
    const [cvc, setCvc] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [focus, setFocus] = useState()
    const [expiry, setExpiry] = useState('')
    const [password, setPassword] = useState('')
    const [birth, setBirth] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('')
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
    useEffect(() => {
        setLoading(true);
        getCard(1);
    }, [])
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
        if (params?.category == 'family') {
            setPageList(range(1, response?.data?.maxPage));
            setPosts(response?.data?.data);
        }
        setLoading(false);

    }


    const handleBlur = () => setFocus(undefined)

    const handleInputChange = ({ target }) => {
        if (target.name === 'cardNumber') {
            target.value = formatCreditCardNumber(target.value, Payment)
            setCardNumber(target.value)
        } else if (target.name === 'expiry') {
            target.value = formatExpirationDate(target.value)
            setExpiry(target.value)
        } else if (target.name === 'cvc') {
            target.value = formatCVC(target.value, cardNumber, Payment)
            setCvc(target.value)
        }
    }

    const onChangeMyCard = (pk) => {
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
                        setEditPk(0);
                    } else {
                        api_str = `/api/addfamilycard`;
                    }
                }
                obj = { ...obj, ...family_obj };
                const { data: response } = await axios.post(api_str, obj)
                if (response?.result > 0) {
                    toast.success('성공적으로 저장 되었습니다.');
                    getCard(1);
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
    const onClickEditButton = (data, idx) => {
        setCvc(data?.card_cvc ?? "");
        setCardNumber(data?.card_number ?? "");
        setName(data?.card_name ?? "");
        setExpiry(data?.card_expire ?? "");
        setBirth(data?.birth ?? "");
        setPassword(data?.card_password ?? "");
        setFamilyType(data?.family_type);
        setCardSrc(backUrl + data?.card_src);
        setPhone(data?.phone ?? "");
        setPhoneCheck("");
        setEditPk(data?.pk)
        setIsSeeCard(true);
        setIsSendSms(false);
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
    return (
        <>
            <Wrappers className="wrapper" style={{ minHeight: '100vh', margin: '0 auto', background: "#fff" }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '250px', margin: `${isSeeCard ? 'auto' : '1rem auto'}`, paddingTop: '4rem' }}
                >

                    {loading ?
                        <>
                            <Loading />
                        </>
                        :
                        <>
                            <ContentWrappers style={{ marginTop: '1rem' }}>
                                {params?.category == 'family' ?
                                    <>
                                        <div style={{ fontSize: theme.size.font4, color: theme.color.red }}>
                                            ※ 가족 외에 타인카드는 등록불가합니다.<br /><br />

                                            1. 본인은 이 임대 계약한 월세 또는 보증금 카드결제 사실을 알고 있습니다.<br />
                                            2. 송금이 정상 완료된 후, 첫 결제월(달)에는 결제취소 또는 카드정보변경이 되지 않습니다.<br />
                                            3. 휴대폰번호, 성명 등의 개인정보를 수집합니다.<br />
                                            4. 경우에 따라 본인(카드주)에게 전화를 드릴 수 있습니다.<br />
                                        </div>

                                    </>
                                    :
                                    <>
                                    </>}
                            </ContentWrappers>

                            {isSeeCard ?
                                <>
                                    <CardWrapper style={{ marginTop: '1rem' }}>
                                        <Cards cvc={cvc} focused={focus} expiry={expiry} name={name} number={cardNumber} />
                                    </CardWrapper>
                                </>
                                :
                                <>
                                </>}

                            <ContentWrappers style={{ marginTop: '1rem' }}>
                                {isSeeCard ?
                                    <>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name='cardNumber'
                                            className="cardNumber"
                                            value={cardNumber}
                                            autoComplete='off'
                                            label='카드 번호'
                                            onBlur={handleBlur}
                                            onChange={handleInputChange}
                                            placeholder='0000 0000 0000 0000'
                                            onFocus={e => setFocus(e.target.name)}
                                        />
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name='name'
                                            className="name"
                                            value={name}
                                            autoComplete='off'
                                            onBlur={handleBlur}
                                            label='카드 사용자명'
                                            placeholder='John Doe'
                                            onChange={e => setName(e.target.value)}
                                            onFocus={e => setFocus(e.target.name)}
                                        />
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name='expiry'
                                            className="expiry"
                                            label='만료일'
                                            value={expiry}
                                            onBlur={handleBlur}
                                            placeholder='MM/YY'
                                            onChange={handleInputChange}
                                            inputProps={{ maxLength: '5' }}
                                            onFocus={e => setFocus(e.target.name)}
                                        />
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name='cvc'
                                            className="cvc"
                                            label='CVC 번호'
                                            value={cvc}
                                            type='password'
                                            autoComplete='off'
                                            onBlur={handleBlur}
                                            onChange={handleInputChange}
                                            onFocus={e => setFocus(e.target.name)}
                                            placeholder={Payment.fns.cardType(cardNumber) === 'amex' ? '1234' : '123'}
                                        />
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name='birth'
                                            className="birth"
                                            label='생년월일 6자리'
                                            value={birth}
                                            autoComplete='off'
                                            onBlur={handleBlur}
                                            type='birth'
                                            inputProps={{ maxLength: '6' }}
                                            onChange={e => setBirth(e.target.value)}
                                            onFocus={e => setFocus(e.target.name)}
                                        />
                                        <TextField
                                            fullWidth
                                            size="small"
                                            name='password'
                                            className="password"
                                            label='카드 비밀번호 앞 두자리'
                                            value={password}
                                            autoComplete='off'
                                            onBlur={handleBlur}
                                            type='password'
                                            inputProps={{ maxLength: '2' }}
                                            onChange={e => setPassword(e.target.value)}
                                            onFocus={e => setFocus(e.target.name)}
                                        />
                                        {params?.category == 'family' ?
                                            <>
                                                <FormControl sx={{ minWidth: 120, margin: '8px 1px' }} size="small">
                                                    <InputLabel id="demo-select-small">가족관계</InputLabel>
                                                    <CustomSelect
                                                        labelId="demo-select-small"
                                                        id="demo-select-small"
                                                        value={familyType}
                                                        label="전/월세"

                                                        onChange={(e) => setFamilyType(e.target.value)}
                                                    >
                                                        <MenuItem value={1}>부</MenuItem>
                                                        <MenuItem value={2}>모</MenuItem>
                                                        <MenuItem value={3}>형제</MenuItem>
                                                        <MenuItem value={4}>자매</MenuItem>
                                                        <MenuItem value={5}>배우자</MenuItem>
                                                        <MenuItem value={6}>자녀</MenuItem>
                                                    </CustomSelect>
                                                </FormControl>
                                                <CategoryName style={{ width: '100%', maxWidth: '700px', marginBottom: '0.5rem', fontWeight: 'bold' }}>카드 일부분 사진</CategoryName>
                                                <ImageContainer for={`card_src`} style={{ margin: 'auto' }}>

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
                                                            <AiFillFileImage style={{ margin: 'auto', fontSize: '4rem', color: `${theme.color.manager.font3}` }} />
                                                        </>}
                                                </ImageContainer>
                                                <div>
                                                    <input type="file" id={`card_src`} name={'card_src'} onChange={addFile} style={{ display: 'none' }} />
                                                </div>

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

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            margin: '1rem 0',
                                        }}>
                                            <div />
                                            <Button
                                                sx={{ ...colorButtonStyle }}
                                                startIcon={<Icon icon="line-md:confirm" />}
                                                onClick={onChangeMyCard}
                                            >저장</Button>
                                        </div>
                                    </>
                                    :
                                    <>
                                    </>}

                                {params?.category == 'family' ?
                                    <>
                                        <ContentTable
                                            columns={objHistoryListContent['user_card'] ?? []}
                                            data={posts}
                                            schema={'user_card'}
                                            table={'user_card'}
                                            onClickEditButton={onClickEditButton}
                                            pageSetting={() => {
                                                getCard(page);
                                            }}
                                        />
                                        <MBottomContent style={{ width: '100%' }}>
                                            <div style={{ width: '64px' }} />
                                            <PageContainer>
                                                <PageButton onClick={() => getCard(1)}>
                                                    처음
                                                </PageButton>
                                                {pageList.map((item, index) => (
                                                    <>
                                                        <PageButton onClick={() => getCard(item)} style={{ color: `${page == item ? '#fff' : ''}`, background: `${page == item ? theme.color.background1 : ''}`, display: `${Math.abs(index + 1 - page) > 4 ? 'none' : ''}` }}>
                                                            {item}
                                                        </PageButton>
                                                    </>
                                                ))}
                                                <PageButton onClick={() => getCard(pageList.length ?? 1)}>
                                                    마지막
                                                </PageButton>
                                            </PageContainer>
                                            <Button style={colorButtonStyle} onClick={() => {
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
                                            }}>추가</Button>
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