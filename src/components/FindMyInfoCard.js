import { useEffect, useState } from "react";
import styled from "styled-components";
import { WrapperForm, CategoryName, Input, FlexBox, SnsLogo, RegularNotice } from './elements/AuthContentTemplete';
import { Title, SelectType, InputComponent, twoOfThreeButtonStyle, TopTitleWithBackButton } from "./elements/UserContentTemplete";
import theme from "../styles/theme";
import $ from 'jquery';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { formatPhoneNumber } from "../functions/utils";
import { Button } from "@mui/material";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import ScrollToTop from "./ScrollToTop";
const Type = styled.div`
width:120px;
text-align:center;
padding: 0.5rem 0;
cursor:pointer;
font-size:1rem;
border-radius: 1.5rem;
`
const FindMyInfoCard = () => {
    const navigate = useNavigate();
    const [typeNum, setTypeNum] = useState(1);

    const [myPk, setMyPk] = useState(0);
    const [myId, setMyId] = useState("");
    const [phoneCheckIng, setPhoneCheckIng] = useState(false);
    const [isCheckId, setIsCheckId] = useState(false);
    const [isCheckNickname, setIsCheckNickname] = useState(false);
    const [isCheckPhoneNumber, setIsCheckPhoneNumber] = useState(false)
    const [isCheckIdAndPhone, setIsCheckIdAndPhone] = useState(false)
    const [randNum, setRandNum] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [num, setNum] = useState("");
    const [isCoinside, setIsCoinside] = useState(false);
    const [isSendSms, setIsSendSms] = useState(false)
    const [fixPhoneNumber, setFixPhoneNumber] = useState("")
    const [values, setValues] = useState({
        phone: '',
        phoneCheck: ''
    })
    const [values2, setValues2] = useState({
        id: '',
        phone: '',
        phoneCheck: ''
    })
    const [passwordValues, setPasswordValues] = useState({
        password: '',
        passwordCheck: ''
    })
    useEffect(() => {
        if (typeNum == 1) {
            setValues({
                phone: '',
                phoneCheck: ''
            })
        }
        if (typeNum == 2) {
            setValues2({
                id: '',
                phone: '',
                phoneCheck: ''
            })
        }
    }, [typeNum])
    const sendSms = async () => {
        let phone = "";
        if (typeNum == 1) {
            if (!values.phone) {
                toast.error("필수 값을 입력해 주세요.");
                return;
            }
            phone = values.phone;
        }
        if (typeNum == 2) {
            if (!values2.id || !values2.phone) {
                toast.error("필수 값을 입력해 주세요.");
                return;
            }
            phone = values2.phone;
        }
        setIsCheckPhoneNumber(false);
        let fix_phone = phone.replace('-', '');
        setFixPhoneNumber(fix_phone);
        let content = "";
        for (var i = 0; i < 6; i++) {
            content += Math.floor(Math.random() * 10).toString();
        }
        let string = `\n인증번호를 입력해주세요 ${content}.\n\n-달카페이-`;
        setRandNum(content);
        try {
            const { data: response } = await axios.post(`/api/sendsms`, {
                receiver: [fix_phone, formatPhoneNumber(fix_phone)],
                content: string
            })
            if (response?.result > 0) {
                toast.success('인증번호가 전송되었습니다.');
                setIsSendSms(true)
            } else {
                toast.error(response?.message);
                setIsSendSms(false)
            }
        } catch (e) {
            console.log(e)
        }
    }
    const confirmCoincide = async (e) => {
        if (randNum == values.phoneCheck) {
            toast.success("인증번호가 일치합니다.");
            const { data: response } = await axios.post('/api/findidbyphone', {
                phone: fixPhoneNumber
            })
            if (response.result > 0) {
                if (response.data?.id) {
                    setMyId(response.data?.id);
                    setIsCheckPhoneNumber(true);
                } else {

                }
            } else {

            }

        } else {
            setIsCheckPhoneNumber(false);
            toast.error("인증번호가 일차하지 않습니다.");
        }
    }
    const onChangeTypeNum = (num) => {
        if (num != typeNum) {
            setTypeNum(num);
            $('.id').val('');
            $('.phone').val('');
            $('.phone-check').val('');
            $('.pw').val('');
            $('.pw-check').val('');
            setIsCheckPhoneNumber(false);
            setIsCheckIdAndPhone(false);
        }
    }
    const handleChange = (value, key) => {
        setValues({ ...values, [key]: value });
    }
    const handleChange2 = (value, key) => {
        setValues2({ ...values2, [key]: value });
    }
    const handleChangePasswordValue = (value, key) => {
        setPasswordValues({ ...passwordValues, [key]: value });
    }
    const confirmCoincideIdAndPhone = async () => {
        if (randNum === values2.phoneCheck) {
            toast.success("인증번호가 일치합니다.");
            const { data: response } = await axios.post('/api/findauthbyidandphone', {
                id: values2.id,
                phone: fixPhoneNumber
            })
            setIsCheckIdAndPhone(true);
            if (response.result > 0) {
                setMyId(values2.id)
                setIsCheckIdAndPhone(true);
            } else {
                toast.error(response.message);
            }
        } else {
            setIsCheckIdAndPhone(false);
            toast.error("인증번호가 일차하지 않습니다.");
        }
    }
    const changePassword = async () => {
        if (passwordValues.password != passwordValues.passwordCheck) {
            toast.error('비밀번호가 일치하지 않습니다.');
            return;
        } else {
            Swal.fire({
                title: '저장 하시겠습니까?',
                showCancelButton: true,
                confirmButtonText: '확인',
                cancelButtonText: '취소'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { data: response } = await axios.post('/api/changepassword', {
                        pw: passwordValues.password,
                        id: myId
                    })
                    if (response.result > 0) {
                        toast.success('저장되었습니다.')
                        navigate('/login');
                    } else {
                        toast.error(response.message);
                    }
                }
            })
        }
    }

    return (
        <>
            <ScrollToTop />
            <WrapperForm>
                <TopTitleWithBackButton title={'아이디/비밀번호 찾기'} />
                <SelectType className="select-type">
                    <Type style={{ border: `1px solid ${typeNum == 1 ? theme.color.background2 : '#fff'}`, color: `${typeNum == 1 ? theme.color.background2 : '#ccc'}` }} onClick={() => { onChangeTypeNum(1) }}>아이디찾기</Type>
                    <Type style={{ border: `1px solid ${typeNum == 2 ? theme.color.background2 : '#fff'}`, color: `${typeNum == 2 ? theme.color.background2 : '#ccc'}` }} onClick={() => { onChangeTypeNum(2) }}>비밀번호 찾기</Type>
                </SelectType>

                {typeNum == 1 ?
                    <>
                        {isCheckPhoneNumber ?
                            <>
                                <CategoryName>고객님의 아이디는 "{myId}" 입니다.</CategoryName>
                            </>
                            :
                            <>
                                <InputComponent
                                    label={'전화번호를 입력해주세요.'}
                                    input_type={{
                                        placeholder: '',
                                    }}
                                    class_name='phone'
                                    onChange={(e) => handleChange(e, 'phone')}
                                    value={values?.phone}
                                    button_label={'인증번호 전송'}
                                    isButtonAble={!isCheckPhoneNumber}
                                    onClickButton={() => sendSms()}
                                />
                                <InputComponent
                                    label={'인증번호를 입력해주세요.'}
                                    input_type={{
                                        placeholder: '',
                                    }}
                                    class_name='phoneCheck'
                                    onChange={(e) => handleChange(e, 'phoneCheck')}
                                    value={values?.phoneCheck}
                                    button_label={isCheckPhoneNumber ? '확인완료' : '확인'}
                                    isButtonAble={!isCheckPhoneNumber}
                                    onClickButton={() => confirmCoincide()}
                                />
                            </>
                        }

                    </>
                    :
                    <>
                        {isCheckIdAndPhone ?
                            <>
                                <InputComponent
                                    label={'비밀번호를 입력해주세요.'}
                                    input_type={{
                                        placeholder: '',
                                        type: 'password'
                                    }}
                                    class_name='password'
                                    onChange={(e) => handleChangePasswordValue(e, 'password')}
                                    value={passwordValues?.password}
                                    isSeeButton={true}
                                />
                                <InputComponent
                                    label={'비밀번호를 한번더 입력해주세요.'}
                                    input_type={{
                                        placeholder: '',
                                        type: 'password'
                                    }}
                                    class_name='passwordCheck'
                                    onChange={(e) => handleChangePasswordValue(e, 'passwordCheck')}
                                    value={passwordValues?.passwordCheck}
                                    isSeeButton={true}
                                />
                                <Button sx={twoOfThreeButtonStyle} onClick={changePassword} >저장</Button>
                            </>
                            :
                            <>
                                <InputComponent
                                    label={'아이디를 입력해주세요.'}
                                    input_type={{
                                        placeholder: '',
                                    }}
                                    class_name='id'
                                    onChange={(e) => handleChange2(e, 'id')}
                                    value={values2?.id}
                                />
                                <InputComponent
                                    label={'전화번호를 입력해주세요.'}
                                    input_type={{
                                        placeholder: '',
                                    }}
                                    class_name='phone'
                                    onChange={(e) => handleChange2(e, 'phone')}
                                    value={values2?.phone}
                                    button_label={'인증번호 전송'}
                                    isButtonAble={!isCheckIdAndPhone}
                                    onClickButton={() => sendSms()}
                                />
                                <InputComponent
                                    label={'인증번호를 입력해주세요.'}
                                    input_type={{
                                        placeholder: '',
                                    }}
                                    class_name='phoneCheck'
                                    onChange={(e) => handleChange2(e, 'phoneCheck')}
                                    value={values2?.phoneCheck}
                                    button_label={isCheckPhoneNumber ? '확인완료' : '확인'}
                                    isButtonAble={!isCheckIdAndPhone}
                                    onClickButton={() => confirmCoincideIdAndPhone()}
                                />
                            </>
                        }

                    </>
                }
            </WrapperForm>
        </>
    )
}
export default FindMyInfoCard;