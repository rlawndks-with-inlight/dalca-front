import { useState } from "react";
import { useEffect } from "react";
import { GrFormPrevious } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ContentWrappers, FakeHeaders, HalfTitle, InputComponent, RowContent, Title, TwoOfThreeButton, twoOfThreeButtonStyle, Wrappers } from "../../../components/elements/UserContentTemplete";
import theme from "../../../styles/theme";
import Button from '@mui/material/Button';
import { Divider } from "@mui/material";
import { toast } from "react-hot-toast";
import Modal from '../../../components/Modal';
import DaumPostcode from 'react-daum-postcode';
import $ from 'jquery';
import axios from "axios";
import { formatPhoneNumber, regExp } from "../../../functions/utils";
import Swal from "sweetalert2";
import { ImageContainer } from "../../../components/elements/ManagerTemplete";
import { AiFillFileImage } from "react-icons/ai";
import { CategoryName } from "../../../components/elements/AuthContentTemplete";
import Policy from "../Policy/Policy";
import { PAY_INFO } from "../../../data/ContentData";
import { socket } from "../../../data/Data";
const SignUp = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [signUpCount, setSignUpCount] = useState(0);
    const [isSeePostCode, setIsSeePostCode] = useState(false);
    const [isCheckId, setIsCheckId] = useState(false);
    const [isCheckPhone, setIsCheckPhone] = useState(false);
    const [isCheckNickname, setIsCheckNickname] = useState(false);
    const [step, setStep] = useState(0);
    const [values, setValues] = useState({});
    const [isSendSms, setIsSendSms] = useState(false)
    const [randNum, setRandNum] = useState("")
    const defaultObj = {
        id: '',
        pw: '',
        pw_check: '',
        address: '',
        address_detail: '',
        id_number_front: '',
        id_number_back: '',
        phone: '',
        phoneCheck: '',
        name: '',
        user_level: params?.user_level
    }
    const realtorObj = {
        office_name: '',//중개업소명칭
        company_number: '',//사업자등록번호
        office_address: '',//사무실주소
        office_address_detail: '',//사무실주소상세
        office_zip_code: '',//사무실우편번호
        office_lng: '',//사무실우편번호
        office_lat: '',//사무실우편번호
        office_phone: '',//사무실연락처
        company_number_src: '',// 파일 -> 사업자등록증
        office_src: '',// 파일 -> 중개업소등록증
        bank_book_src: '',// 파일 -> 통장사본
        id_number_src: '',// 파일 -> 신분증
    }
    const landlordObj = {
        bank_name: '',
        account_number: '',
        bank_book_src: ''
    }
    const handleChange = (value, key) => {
        setValues({ ...values, [key]: value });
        if (key == 'id_number_front' && value.length >= 6) {
            $(`.id_number_back`).focus();
        }
    }
    useEffect(() => {
        if (params?.user_level == 0) {
            setValues(defaultObj);
            setTitle('임차인');
        } else if (params?.user_level == 5) {
            setValues({ ...defaultObj, ...landlordObj });
            setTitle('임대인');
        } else if (params?.user_level == 10) {
            setValues({ ...defaultObj, ...realtorObj });
            setTitle('공인중개사');

        } else {
            toast.error('잘못된 접근입니다.');
            navigate(-1);
        }
        
        //getBankList();
    }, []);
    const getBankList = async () => {
        const response = await axios.post('https://iniweb-api.inicis.com/DefaultWebApp/service/acct_cfrm/inicis.jsp', {
            nmcomp: '',
            banksett: '',
            noacct: '3561311914533',
            mid: PAY_INFO.MID,
        });
        console.log(response)
    }
    useEffect(() => {
        if (step == 1 && params?.user_level == 10) {
            setTitle('중개업확인')
        }
    }, [step])
    const onSelectAddress = async (data) => {
        console.log(data)
        if (step == 0) {
            setIsSeePostCode(false);
            setValues({ ...values, ['address']: data?.autoJibunAddress || data?.jibunAddress, ['zip_code']: data?.zonecode, ['address_detail']: '' });
            $('.address_detail').focus();
        }
        if (step == 1) {
            setIsSeePostCode(false);
            const response = await axios.post('/api/getaddressbytext', {
                text: data?.jibunAddress
            })
            if (response?.data?.data?.length > 0) {
                setValues({
                    ...values,
                    ['office_address']: data?.autoJibunAddress || data?.jibunAddress,
                    ['office_zip_code']: data?.zonecode,
                    ['office_lat']: response?.data?.data[0]?.lat,
                    ['office_lng']: response?.data?.data[0]?.lng,
                });
                $('.office_address_detail').focus();
            } else {
                toast.error("위치추적 할 수 없는 주소입니다.");
            }

        }

    }
    const onCheckId = async () => {
        if (!values.id) {
            toast.error('아이디를 입력해주세요.');
            return;
        }
        if (values.id.includes(' ')) {
            toast.error('아이디의 공백을 제거해 주세요.');
            return;
        }
        if (!regExp('id', values.id)) {
            toast.error('아이디 정규식에 맞지 않습니다.');
            return;
        }
        const { data: response } = await axios.post('/api/checkexistid', { id: values.id });
        if (response.result > 0) {
            toast.success(response.message);
            setIsCheckId(true);
            $('.pw').focus();
        } else {
            toast.error(response.message);
            setIsCheckId(false);
        }
    }
    const onSignUp = () => {
        
        if (!values.id) {
            toast.error('아이디를 입력해주세요.');
            setStep(0);
            return;
        }
        if (values.id.includes(' ')) {
            toast.error('아이디의 공백을 제거해 주세요.');
            setStep(0);
            return;
        }
        if (!regExp('id', values.id)) {
            toast.error('아이디 정규식에 맞지 않습니다.');
            setStep(0);
            return;
        }
        if (!isCheckId) {
            toast.error('아이디 중복확인을 완료해 주세요.');
            setStep(0);
            return;
        }
        if (!values.pw) {
            toast.error('비밀번호를 입력해주세요.');
            setStep(0);
            return;
        }
        if (!regExp('pw', values.pw)) {
            toast.error('비밀번호 정규식을 지켜주세요.');
            setStep(0);
            return;
        }
        if (values.pw !== values.pw_check) {
            toast.error('비밀번호가 일치하지 않습니다.');
            setStep(0);
            return;
        }
        // if (!values.address && !params?.user_level != 10) {
        //     toast.error('주소를 입력해 주세요.');
        //     setStep(0);
        //     return;
        // }
        // if (!$('.id_number').val()) {
        //     alert('주민등록번호를 입력해 주세요.');
        //     return;
        // }
        if (!values.phone) {
            toast.error('휴대폰 번호를 입력해 주세요.');
            setStep(0);
            return;
        }
        if (values.phoneCheck != randNum) {
            toast.error('휴대폰 인증번호가 일치하지 않습니다.');
            setStep(0);
            return;
        }
        if (!values.name) {
            toast.error('이름을 입력해 주세요.');
            setStep(0);
            return;
        }
        // if (!regExp('name', values.name)) {
        //     toast.error('이름 정규식을 지켜주세요.');
        //     setStep(0);
        //     return;
        // }
        if (params.user_level == 5) {
            for (var i = 0; i < Object.keys(landlordObj).length; i++) {
                let key = Object.keys(landlordObj)[i];
                if (!values[key]) {
                    toast.error('필수값을 입력해 주세요요.');
                    setStep(1);
                    return;
                }
            }
        }
        if (params.user_level == 10) {
            for (var i = 0; i < Object.keys(realtorObj).length; i++) {
                let key = Object.keys(realtorObj)[i];
                if (!values[key]) {
                    toast.error('중개업 확인 내용을 채워주세요.');
                    setStep(1);
                    return;
                }
            }
        }
        if (!$('input[id=term-of-use-1]:checked').val()) {
            toast.error('이용약관을 동의해 주세요.');
            return;
        }
        if (params?.user_level == 10 && (!$('input[id=fee-1]:checked').val() && !$('input[id=fee-2]:checked').val())) {
            toast.error('부동산 중개수수료 결제 동의여부를 체크해 주세요.');
            return;
        }
        Swal.fire({
            title: '회원가입 하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                onSaveUser();
            }
        })
    }
    const onSaveUser = async () => {
        let obj = values
        let insert_obj = {};
        let add_obj = {};
        if (params?.user_level == 5) {
            insert_obj = landlordObj;
        }
        if (params?.user_level == 10) {
            insert_obj = realtorObj;
            if($('input[id=fee-1]:checked').val()){
                add_obj['is_agree_brokerage_fee'] = 1;
            }else if($('input[id=fee-2]:checked').val()){
                add_obj['is_agree_brokerage_fee'] = 0;
            }
        }
        let num = 1;
        for (var i = 0; i < Object.keys(insert_obj).length; i++) {
            let key = Object.keys(insert_obj)[i];
            if (key.includes('_src')) {
                let formData = new FormData();
                formData.append(`content${num}`, values[key]);
                const { data: add_image } = await axios.post('/api/addimageitems', formData);
                if (add_image.result < 0) {
                    toast.error(add_image?.message);
                    return;
                }
                num++;
                add_obj[key] = add_image?.data[0]?.filename;
            } else {
                add_obj[key] = values[key];
            }
        }
        obj = { ...obj, ...add_obj };

        obj = { ...obj, ['id_number']: obj?.id_number_front + '-' + obj?.id_number_back }
        const { data: response } = await axios.post('/api/adduser', obj);
        if (response?.result > 0) {
            socket.emit('message', {
                signup_user_level:params?.user_level
            });
            toast.success(response?.message);
            navigate('/login');
        } else {
            toast.error(response?.message);
            if (response?.data?.step) {
                setStep(response?.data?.step);
            }
        }
    }
    const onPreStep = () => {
        if (params?.user_level == 10 || params?.user_level == 5) {
            setStep(step - 1);

        } else {
            setStep(step - 2);
        }
        window.scrollTo(0, 0);
    }
    const onNextStep = () => {
        if (params?.user_level == 10 || params?.user_level == 5) {
            setStep(step + 1);

        } else {
            setStep(step + 2);
        }
        window.scrollTo(0, 0);
    }
    const sendSms = async () => {
        if (!values.phone) {
            toast.error("핸드폰 번호를 입력해주세요.")
            return;
        }

        setIsCheckPhone(false);
        let fix_phone = values.phone;
        for (var i = 0; i < fix_phone.length; i++) {
            if (isNaN(parseInt(fix_phone[i]))) {
                alert("전화번호는 숫자만 입력해 주세요.");
                return;
            }
        }
        fix_phone = fix_phone.replaceAll('-', '');
        fix_phone = fix_phone.replaceAll(' ', '');
        setValues({ ...values, phone: fix_phone });
        let content = "";
        for (var i = 0; i < 6; i++) {
            content += Math.floor(Math.random() * 10).toString();
        }

        let string = `\n인증번호를 입력해주세요 ${content}.\n\n-달카페이-`;
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
                setIsSendSms(false)
            }
        } catch (e) {
            console.log(e)
        }
        //console.log(response)
    }
    const addFile = (e) => {
        let { name, files } = e.target;
        if (files[0]) {
            setValues({ ...values, [name]: files[0] });
            $(`.${name}`).val("");
        }
    };
    return (
        <>
            <FakeHeaders label='회원가입' />
            <Wrappers className="wrapper" style={{ width: '100%' }}>
                <ContentWrappers>
                    {step == 0 ?
                        <>
                            <HalfTitle>{title}</HalfTitle>
                            <InputComponent
                                label={'ID*'}
                                input_type={{
                                    placeholder: '특수문자 제외한 6자리 이상 20자리 이하',
                                    disabled: isCheckId
                                }}
                                class_name='id'
                                button_label={isCheckId ? '완료' : '중복확인'}
                                isButtonAble={!isCheckId}
                                is_divider={true}
                                onKeyPress={() => onCheckId()}
                                onClickButton={() => onCheckId()}
                                onChange={(e) => handleChange(e, 'id')}
                                value={values.id}
                            />
                            <InputComponent
                                label={'PW*'}
                                input_type={{
                                    placeholder: '영문, 숫자, 특수문자조합 8~20자',
                                    type: 'password'
                                }}
                                class_name='pw'
                                is_divider={true}
                                onKeyPress={() => $('.pw_check').focus()}
                                onChange={(e) => handleChange(e, 'pw')}
                                value={values.pw}
                                isSeeButton={true}
                            />
                            <InputComponent
                                label={'PW 확인*'}
                                input_type={{
                                    placeholder: '비밀번호 확인을 위해 한번 더 입력해주세요',
                                    type: 'password'
                                }}
                                class_name='pw_check'
                                is_divider={true}
                                onKeyPress={() => setIsSeePostCode(true)}
                                onChange={(e) => handleChange(e, 'pw_check')}
                                value={values.pw_check}
                                isSeeButton={true}
                            />
                            {params?.user_level != 10 ?
                                <>
                                    <div onClick={() => {
                                    }}>
                                        <InputComponent
                                            label={'집주소* '}
                                            input_type={{
                                                placeholder: '',
                                                disabled: "true"
                                            }}
                                            class_name='address'
                                            is_divider={true}
                                            onClick={() => {
                                                setIsSeePostCode(!isSeePostCode)
                                            }}
                                            value={values.address}
                                        />
                                    </div>
                                    <InputComponent
                                        label={'상세주소'}
                                        input_type={{
                                            placeholder: ''
                                        }}
                                        class_name='address_detail'
                                        is_divider={true}
                                        onKeyPress={() => $('.id_number').focus()}
                                        onChange={(e) => handleChange(e, 'address_detail')}
                                        value={values.address_detail}
                                    />
                                </>
                                :
                                <>
                                </>}

                            <RowContent style={{ margin: '0 auto', alignItems: 'center', justifyContent: 'space-between' }}>
                                <InputComponent
                                    label={'주민등록번호 앞자리'}
                                    input_type={{
                                        placeholder: ''
                                    }}
                                    class_name='id_number_front'
                                    is_divider={true}
                                    onKeyPress={() => $('.id_number_back').focus()}
                                    onChange={(e) => handleChange(e, 'id_number_front')}
                                    value={values.id_number_front}
                                    divStyle={{ width: '47%', margin: '0' }}
                                />
                                <div>
                                    -
                                </div>
                                <InputComponent
                                    label={'뒷자리'}
                                    input_type={{
                                        placeholder: '',
                                        type: 'password'
                                    }}
                                    class_name='id_number_back'
                                    is_divider={true}
                                    onKeyPress={() => $('.phone').focus()}
                                    onChange={(e) => handleChange(e, 'id_number_back')}
                                    value={values.id_number_back}
                                    divStyle={{ width: '47%', margin: '0' }}
                                />
                            </RowContent>
                            <InputComponent
                                label={'휴대폰번호*'}
                                input_type={{
                                    placeholder: '-없이 숫자만 입력',
                                }}
                                class_name='phone'
                                button_label={isCheckPhone ? '완료' : '인증하기'}
                                isButtonAble={!isCheckPhone}
                                onClickButton={() => sendSms()}
                                onChange={(e) => {
                                    handleChange(e, 'phone');
                                    setIsCheckPhone(false);
                                }}
                                value={values.phone}
                            />
                            <InputComponent
                                label={'휴대폰인증번호*'}
                                input_type={{
                                    placeholder: '인증번호를 입력해주세요.',
                                }}
                                class_name='phone'
                                onChange={(e) => handleChange(e, 'phoneCheck')}
                                value={values.phoneCheck}
                            />
                            <InputComponent
                                label={'성명*'}
                                input_type={{
                                    placeholder: ''
                                }}
                                class_name='name'
                                is_divider={true}
                                onChange={(e) => handleChange(e, 'name')}
                                value={values.name}
                            />



                        </>
                        :
                        <>
                        </>}
                    {step == 1 ?
                        <>
                            <HalfTitle>{title}</HalfTitle>

                            {params?.user_level == 10 ?
                                <>
                                    <InputComponent
                                        label={'중개업소명칭'}
                                        input_type={{
                                            placeholder: ''
                                        }}
                                        class_name='office_name'
                                        is_divider={true}
                                        onChange={(e) => handleChange(e, 'office_name')}
                                        value={values.office_name}
                                    />
                                    <InputComponent
                                        label={'사업자등록번호'}
                                        input_type={{
                                            placeholder: '필수입력'
                                        }}
                                        class_name='company_number'
                                        is_divider={true}
                                        onChange={(e) => handleChange(e, 'company_number')}
                                        value={values.company_number}
                                    />
                                    <div onClick={() => {
                                    }}>
                                        <InputComponent
                                            label={'사무실주소'}
                                            input_type={{
                                                placeholder: '',
                                                disabled: "true"
                                            }}
                                            class_name='office_address'
                                            is_divider={true}
                                            onClick={() => {
                                                setIsSeePostCode(!isSeePostCode)
                                            }}
                                            value={values.office_address}
                                        />
                                    </div>
                                    <InputComponent
                                        label={'사무실상세주소'}
                                        input_type={{
                                            placeholder: ''
                                        }}
                                        class_name='office_address_detail'
                                        is_divider={true}
                                        onChange={(e) => handleChange(e, 'office_address_detail')}
                                        value={values.office_address_detail}
                                    />
                                    <InputComponent
                                        label={'사무실연락처'}
                                        input_type={{
                                            placeholder: ''
                                        }}
                                        class_name='office_phone'
                                        is_divider={true}
                                        onChange={(e) => handleChange(e, 'office_phone')}
                                        value={values.office_phone}
                                    />
                                    <CategoryName style={{ width: '100%', maxWidth: '700px', marginBottom: '0.5rem', fontWeight: 'bold' }}>사업자등록증사진</CategoryName>
                                    <ImageContainer for={`company_number_src`} style={{ margin: 'auto' }}>

                                        {values?.company_number_src ?
                                            <>
                                                <img src={URL.createObjectURL(values?.company_number_src)} alt="#"
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
                                        <input type="file" id={`company_number_src`} name={'company_number_src'} onChange={addFile} style={{ display: 'none' }} />
                                    </div>
                                    <CategoryName style={{ width: '100%', maxWidth: '700px', marginBottom: '0.5rem', fontWeight: 'bold' }}>중개업소등록증사진</CategoryName>
                                    <ImageContainer for={`office_src`} style={{ margin: 'auto' }}>

                                        {values?.office_src ?
                                            <>
                                                <img src={URL.createObjectURL(values?.office_src)} alt="#"
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
                                        <input type="file" id={`office_src`} name={'office_src'} onChange={addFile} style={{ display: 'none' }} />
                                    </div>


                                </>
                                :
                                <>
                                </>
                            }
                            {params?.user_level == 5 ?
                                <>
                                    <InputComponent
                                        label={'은행명*'}
                                        input_type={{
                                            placeholder: ''
                                        }}
                                        class_name='bank_name'
                                        is_divider={true}
                                        onChange={(e) => handleChange(e, 'bank_name')}
                                        value={values.bank_name}
                                    />
                                    <InputComponent
                                        label={'계좌번호*'}
                                        input_type={{
                                            placeholder: ''
                                        }}
                                        class_name='account_number'
                                        is_divider={true}
                                        onChange={(e) => handleChange(e, 'account_number')}
                                        value={values.account_number}
                                    />
                                </>
                                :
                                <>
                                </>}
                            <CategoryName style={{ width: '100%', maxWidth: '700px', marginBottom: '0.5rem', fontWeight: 'bold' }}>통장사본사진</CategoryName>
                            <ImageContainer for={`bank_book_src`} style={{ margin: 'auto' }}>

                                {values?.bank_book_src ?
                                    <>
                                        <img src={URL.createObjectURL(values?.bank_book_src)} alt="#"
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
                                <input type="file" id={`bank_book_src`} name={'bank_book_src'} onChange={addFile} style={{ display: 'none' }} />
                            </div>
                            {params?.user_level == 10 ?
                                <>
                                    <CategoryName style={{ width: '100%', maxWidth: '700px', marginBottom: '0.5rem', fontWeight: 'bold' }}>신분증사진</CategoryName>
                                    <ImageContainer for={`id_number_src`} style={{ margin: 'auto' }}>

                                        {values?.id_number_src ?
                                            <>
                                                <img src={URL.createObjectURL(values?.id_number_src)} alt="#"
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
                                        <input type="file" id={`id_number_src`} name={'id_number_src'} onChange={addFile} style={{ display: 'none' }} />
                                    </div>
                                </>
                                :
                                <>

                                </>}

                        </>
                        :
                        <>
                        </>}
                    {step == 2 ?
                        <>
                            <HalfTitle style={{ textAlign: 'left' }}>{'약관동의'}</HalfTitle>
                            <div style={{ width: '94%', height: '150px', overflowY: 'scroll', border: `1px solid ${theme.color.font3}`, padding: '3%' }}>
                                <Policy pk={0} />
                            </div>
                            <RowContent style={{ alignItems: 'center', marginTop: '8px' }}>
                                <input type={'radio'} id="term-of-use-1" name="term-of-use" style={{ margin: '0 4px 0 auto' }}
                                    onChange={(e) => {
                                        if ($('input[id=privacy-policy-1]:checked').val()) {
                                            $('#all-allow').prop('checked', true);
                                        }
                                    }} />
                                <label for={'term-of-use-1'} style={{ margin: '0 4px 0 0', fontSize: theme.size.font5 }}>동의함</label>
                                <input type={'radio'} id="term-of-use-2" name="term-of-use" style={{ margin: '0 4px 0 0' }}
                                    onChange={(e) => {
                                        $('#all-allow').prop('checked', false);
                                    }} />
                                <label for={'term-of-use-2'} style={{ margin: '0', fontSize: theme.size.font5 }}>동의안함</label>
                            </RowContent>
                            {params?.user_level == 10 ?
                                <>
                                    <RowContent style={{ alignItems: 'center', marginTop: '2rem', justifyContent: 'space-between' }}>
                                        <div>부동산 중개수수료를 카드로 결제하는 것에 동의합니다.</div>
                                        <RowContent style={{ width: 'auto' }}>
                                            <input type={'radio'} id="fee-1" name="fee" style={{ margin: '0 4px 0 auto' }}
                                                onChange={(e) => {
                                                    if ($('input[id=privacy-policy-1]:checked').val()) {
                                                        $('#all-allow').prop('checked', true);
                                                    }
                                                }} />
                                            <label for={'fee-1'} style={{ margin: '0 4px 0 0', fontSize: theme.size.font5 }}>동의함</label>
                                            <input type={'radio'} id="fee-2" name="fee" style={{ margin: '0 4px 0 0' }}
                                                onChange={(e) => {
                                                    $('#all-allow').prop('checked', false);
                                                }} />
                                            <label for={'fee-2'} style={{ margin: '0', fontSize: theme.size.font5 }}>동의안함</label>
                                        </RowContent>
                                    </RowContent>
                                </>
                                :
                                <>
                                </>}


                        </>
                        :
                        <>
                        </>}
                    {isSeePostCode ?
                        <>
                            <Modal onClickXbutton={() => { setIsSeePostCode(false) }}>
                                <DaumPostcode style={postCodeStyle} onComplete={onSelectAddress} />
                            </Modal>
                        </>
                        :
                        <>
                        </>}
                    {step != 0 ?
                        <>
                            <Button variant="text" sx={{ ...twoOfThreeButtonStyle, marginTop: '32px' }} onClick={onPreStep}>이전단계로</Button>
                        </>
                        :
                        <>
                        </>}

                    {step == 2 ?
                        <>
                            <Button variant="text" sx={{ ...twoOfThreeButtonStyle, marginTop: '8px' }} onClick={onSignUp}>회원가입</Button>
                        </>
                        :
                        <>
                            <Button variant="text" sx={{ ...twoOfThreeButtonStyle, marginTop: '8px' }} onClick={onNextStep}>임시저장</Button>
                        </>}
                </ContentWrappers>
            </Wrappers>
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
export default SignUp;