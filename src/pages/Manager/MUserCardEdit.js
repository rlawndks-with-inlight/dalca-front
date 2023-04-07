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
import { colorButtonStyle, ContentWrappers, InputComponent, Wrappers } from "../../components/elements/UserContentTemplete";
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
    const [passwordCheck, setPasswordCheck] = useState('')
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
                setUser(response?.data);
            }
        }
        fetchPost();
    }, [])


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

    const onChangeMyCard = () => {
        Swal.fire({
            title: `저장 하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data: response } = await axios.post('/api/change-card', {
                    card_number: cardNumber,
                    card_name: name,
                    card_expire: expiry,
                    card_cvc: cvc,
                    card_password: password,
                    birth: birth,
                    user_pk: params?.pk
                })
                if (response?.result > 0) {
                    toast.success('성공적으로 저장 되었습니다.');
                    navigate(-1)
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
                    <Cards cvc={cvc} focused={focus} expiry={expiry} name={name} number={cardNumber} />
                </CardWrapper>
                <ContentWrappers style={{ marginTop: '1rem' }}>
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
                </ContentWrappers>
            </Card>
            <ButtonContainer>
                <CancelButton onClick={() => navigate(-1)}>x 취소</CancelButton>
                <AddButton onClick={onChangeMyCard}>{'수정'}</AddButton>
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