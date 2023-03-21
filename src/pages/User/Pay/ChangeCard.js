//카드변경

import { colorButtonStyle, ContentWrappers, InputComponet, Wrappers } from "../../../components/elements/UserContentTemplete";
// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import RadioGroup from '@mui/material/RadioGroup'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import Box from '@mui/material/Box'
import CardHeader from '@mui/material/CardHeader'
import DialogTitle from '@mui/material/DialogTitle'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogContentText from '@mui/material/DialogContentText'
import MuiTextField from '@mui/material/TextField'

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
            }
        })
    }
    return (
        <>
            <Wrappers>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '250px' }}
                >
                    <CardWrapper>
                        <Cards cvc={cvc} focused={focus} expiry={expiry} name={name} number={cardNumber} />
                    </CardWrapper>
                    <ContentWrappers style={{ marginTop: '1rem' }}>
                        <FormControl fullWidth>
                            <TextField
                                fullWidth
                                name='cardNumber'
                                value={cardNumber}
                                autoComplete='off'
                                label='카드 번호'
                                onBlur={handleBlur}
                                onChange={handleInputChange}
                                placeholder='0000 0000 0000 0000'
                                onFocus={e => setFocus(e.target.name)}
                            />
                        </FormControl>
                        <TextField
                            fullWidth
                            name='name'
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
                            name='expiry'
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
                            name='cvc'
                            label='CVC 번호'
                            value={cvc}
                            autoComplete='off'
                            onBlur={handleBlur}
                            onChange={handleInputChange}
                            onFocus={e => setFocus(e.target.name)}
                            placeholder={Payment.fns.cardType(cardNumber) === 'amex' ? '1234' : '123'}
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