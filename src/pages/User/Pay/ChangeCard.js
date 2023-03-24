//카드변경

import { colorButtonStyle, ContentWrappers, InputComponent, Wrappers } from "../../../components/elements/UserContentTemplete";
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
    const [name, setName] = useState('')
    const [cvc, setCvc] = useState('')
    const [cardNumber, setCardNumber] = useState('')
    const [focus, setFocus] = useState()
    const [expiry, setExpiry] = useState('')
    const [password, setPassword] = useState('')
    const [passwordCheck, setPasswordCheck] = useState('')

    useEffect(() => {
        getAuth();
    }, [])
    const getAuth = async () => {
        const { data: response } = await axios.get('/api/getmyinfo');
        setCvc(response?.data?.card_cvc ?? "");
        setCardNumber(response?.data?.card_number ?? "");
        setName(response?.data?.card_name ?? "");
        setExpiry(response?.data?.card_expire ?? "");
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

    const onChangeMyCard = () => {
        Swal.fire({
            title: `저장 하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (result.isConfirmed) {
                console.log(name)
                console.log(cvc)
                console.log(cardNumber)
                console.log(expiry)
                const { data: response } = await axios.post('/api/change-card', {
                    card_number: cardNumber,
                    card_name: name,
                    card_expire: expiry,
                    card_cvc: cvc,
                    card_password: password,
                })
                if(response?.result>0){
                    toast.success('성공적으로 저장 되었습니다.');
                }else{
                    toast.error(response?.message);
                }
            }
        })
    }
    return (
        <>
            <Wrappers className="wrapper" style={{ minHeight: '100vh', margin: '0 auto', background: "#fff", height: '100vh' }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '250px', margin: 'auto' }}
                >
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
                            name='password'
                            className="password"
                            label='카드 비밀번호'
                            value={password}
                            autoComplete='off'
                            onBlur={handleBlur}
                            type='password'
                            inputProps={{ maxLength: '4' }}
                            onChange={e => setPassword(e.target.value)}
                            onFocus={e => setFocus(e.target.name)}
                        />
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            marginTop: '1rem',
                        }}>
                            <div />
                            <Button
                                sx={{ ...colorButtonStyle }}
                                startIcon={<Icon icon="line-md:confirm" />}
                                onClick={onChangeMyCard}
                            >저장</Button>
                        </div>
                    </ContentWrappers>

                </motion.div>

            </Wrappers>
        </>
    )
}
export default ChangeCard;