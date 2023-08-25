import React, { useMemo } from 'react'
import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import ManagerWrappers from '../../components/elements/ManagerWrappers';
import SideBar from '../../common/manager/SideBar';
import ManagerContentWrappers from '../../components/elements/ManagerContentWrappers';
import axios from 'axios';
import Breadcrumb from '../../common/manager/Breadcrumb';
import ButtonContainer from '../../components/elements/button/ButtonContainer';
import AddButton from '../../components/elements/button/AddButton';
import CancelButton from '../../components/elements/button/CancelButton';
import $ from 'jquery';
import { addItem, base64toFile, updateItem } from '../../functions/utils';
import { Card, Title, Input, Row, Col, ImageContainer, Select } from '../../components/elements/ManagerTemplete';
import { backUrl } from '../../data/Data';
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";
import "react-quill/dist/quill.snow.css";
import quillEmoji from "react-quill-emoji";
import "react-quill-emoji/dist/quill-emoji.css";
import DaumPostcode from 'react-daum-postcode';
import Modal from '../../components/Modal';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
//카드변경
import { colorButtonStyle, ContentWrappers, CustomSelect, InputComponent, Wrappers } from "../../components/elements/UserContentTemplete";
// ** React Imports
// ** MUI Imports
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'

import Box from '@mui/material/Box'

import MuiTextField from '@mui/material/TextField'
import { motion } from "framer-motion";
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from '../../functions/format';
// ** Third Party Imports
import Payment from 'payment'
import Cards from 'react-credit-cards'
import theme from "../../styles/theme";
// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'
import { Icon } from "@iconify/react";
import ContentTable from '../../components/ContentTable';
import { objHistoryListContent } from '../../data/ContentData';
import { FormControl, InputLabel, MenuItem } from '@mui/material';
import { AiFillFileImage } from 'react-icons/ai';
import { CategoryName } from '../../components/elements/AuthContentTemplete';
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
const MUserCardEdit = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [myNick, setMyNick] = useState("")
    const [user, setUser] = useState({})
    const [name, setName] = useState('')
    const [cvc, setCvc] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [focus, setFocus] = useState()
    const [expiry, setExpiry] = useState('')
    const [password, setPassword] = useState('')
    const [birth, setBirth] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [cards, setCards] = useState([]);
    const [isUserMine, setIsUserMine] = useState(true);
    const [familyType, setFamilyType] = useState(1);
    const [cardSrc, setCardSrc] = useState(undefined);
    const [phone, setPhone] = useState("");
    const [editPk, setEditPk] = useState(0);
    useEffect(() => {

        async function fetchPost() {
            if (params.pk > 0) {
                const { data: response } = await axios.get(`/api/item?table=user&pk=${params.pk}`)
                setCvc(response?.data?.card_cvc ?? "");
                setCardNumber(response?.data?.card_number ?? "");
                setName(response?.data?.card_name ?? "");
                setExpiry(response?.data?.card_expire ?? "");
                setBirth(response?.data?.birth ?? "");
                setPassword(response?.data?.card_password ?? "");
                setUser({ ...response?.data, ['pk']: 0 });
                getFamilyCard({ ...response?.data, ['pk']: 0 });
            }
        }
        fetchPost();
    }, [])
    const getFamilyCard = async (user) => {
        const { data: res_cards } = await axios.get(`/api/items?table=user_card&user_pk=${params?.pk}&order=pk`);
        if (user?.card_number) {
            setCards([...[user], ...res_cards?.data]);

        } else {
            setCards(res_cards?.data);
        }
        const { data: auto_card } = await axios.get(`/api/myautocard?user_pk=${params?.pk}`);
        $(`#user_card-${auto_card?.data?.pk}`).prop('checked', true);
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
    const returnCardInfoMask = (name, value) => {
        let result = value;
        if (name == 'cardNumber') {
            if (result.length > 15) {
                result = result.slice(0, 15);
                for (var i = 15; i < value.length; i++) {
                    result += '*';
                }
            }
        } else if (name == 'cvc') {
            result = "";
            for (var i = 0; i < value.length; i++) {
                result += '*';
            }
        } else if (name == 'password') {
            result = "";
            for (var i = 0; i < value.length; i++) {
                result += '*';
            }
        }
        return result;
    }
    const onChangeMyCard = () => {
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
                let user_obj = {
                    user_pk: params?.pk
                }
                let family_obj = {
                    family_type: familyType,
                    phone: phone,
                    pk: editPk
                }
                let api_str = '/api/change-card'
                if (isUserMine) {
                    obj = { ...obj, ...user_obj };
                } else {
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
                    obj = { ...obj, ...family_obj };
                    api_str = `/api/updatefamilycard`
                }
                const { data: response } = await axios.post(api_str, obj);
                if (response?.result > 0) {
                    toast.success('성공적으로 저장 되었습니다.');
                    // navigate(-1)
                } else {
                    toast.error(response?.message);
                }
            }
        })
    }
    const onClickEditButton = (data, idx) => {
        if (idx == 0 && user?.card_number) {
            setIsUserMine(true);
        } else {
            setIsUserMine(false);
        }
        setCvc(data?.card_cvc ?? "");
        setCardNumber(data?.card_number ?? "");
        setName(data?.card_name ?? "");
        setExpiry(data?.card_expire ?? "");
        setBirth(data?.birth ?? "");
        setPassword(data?.card_password ?? "");
        setFamilyType(data?.family_type);
        setCardSrc(data?.card_src);
        setPhone(data?.phone ?? "");
        setEditPk(data?.pk)
    }
    const addFile = (e) => {
        let { name, files } = e.target;
        if (files[0]) {
            setCardSrc(files[0]);
            $(`.${name}`).val("");
        }
    };
    const checkOnlyOne = (checkThis) => {
        const checkboxes = document.getElementsByName('user_card-check')
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i] !== checkThis) {
                checkboxes[i].checked = false
            }
        }
    }
    const registerAutoCard = async () => {
        let table = "";
        let pk = 0;
        for (var i = 0; i < cards.length; i++) {
            if ($(`#user_card-${cards[i]?.pk}`).is(':checked')) {
                pk = cards[i]?.pk
                break;
            }
        }
        if (pk == 0) {
            table = 'user';
        } else {
            table = 'user_card'
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
                    pk: pk,
                    user_pk: params?.pk
                })
                if (response?.result > 0) {
                    toast.success("성공적으로 자동결제 카드가 등록 되었습니다.");
                } else {
                    toast.error(response?.message);
                }
            }
        })
    }
    const onCancelAutoCard = async () =>{
        Swal.fire({
            title: `정기결제 사용을 취소 하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const {data:response} = await axios.post('/api/cancelautocard',{
                    user_pk: params?.pk
                })
                if (response?.result > 0) {
                    toast.success("성공적으로 정기결제 사용 취소 되었습니다.");
                } else {
                    toast.error(response?.message);
                }
            }
        })
    }
    return (
        <>
            <Breadcrumb title={`${user?.id} 회원 카드 수정`} nickname={myNick} />
            <Card>
                <CardWrapper>
                    <Cards cvc={cvc} focused={focus} expiry={expiry} name={name} number={returnCardInfoMask('cardNumber', cardNumber)} />
                </CardWrapper>
                <ContentWrappers style={{ marginTop: '1rem' }}>
                    <TextField
                        fullWidth
                        size="small"
                        name='cardNumber'
                        className="cardNumber"
                        value={returnCardInfoMask('cardNumber', cardNumber)}
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
                        value={returnCardInfoMask('cvc', cvc)}
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
                        value={returnCardInfoMask('password', password)}
                        autoComplete='off'
                        onBlur={handleBlur}
                        inputProps={{ maxLength: '2' }}
                        onChange={e => setPassword(e.target.value)}
                        onFocus={e => setFocus(e.target.name)}
                    />

                    {!isUserMine ?
                        <>
                            <FormControl sx={{ minWidth: 120, margin: '8px 1px' }} size="small">
                                <InputLabel id="demo-select-small">가족관계</InputLabel>
                                <CustomSelect
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={familyType}
                                    label="가족관계"

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
                            <CategoryName style={{ width: '100%', maxWidth: '1000px', marginBottom: '0.5rem', fontWeight: 'bold' }}>카드 일부분 사진</CategoryName>
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
                                isButtonAble={true}
                                onChange={(e) => {
                                    setPhone(e)
                                }}
                                value={phone}
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
                    <ContentTable
                        columns={objHistoryListContent['user_card'] ?? []}
                        checkOnlyOne={checkOnlyOne}
                        data={cards}
                        schema={'user_card'}
                        table={'user_card'}
                        onClickEditButton={onClickEditButton}
                        pageSetting={() => {
                            getFamilyCard();
                        }}
                    />
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
                            onClick={registerAutoCard}
                        >정기결제카드 저장</Button>
                    </div>
                     <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        margin: '1rem 0',
                    }}>
                        <div />
                        <Button
                            sx={{ ...colorButtonStyle }}
                            startIcon={<Icon icon="line-md:cancel" />}
                            onClick={onCancelAutoCard}
                        >정기결제 사용취소</Button>
                    </div>
                </ContentWrappers>
            </Card>
            <ButtonContainer>
                <CancelButton style={{ marginRight: '0', width: '84px' }} onClick={() => navigate(-1)}>x 뒤로가기</CancelButton>
            </ButtonContainer>
        </>
    )
}
const postCodeStyle = {
    display: 'block',
    position: 'relative',
    top: '0%',
    width: '90%',
    height: '450px',
    margin: '16px auto'
};
export default MUserCardEdit;