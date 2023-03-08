import { useState } from "react";
import { useEffect } from "react";
import { GrFormPrevious } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ContentWrappers, FakeHeaders, HalfTitle, InputComponet, RowContent, Title, TwoOfThreeButton, twoOfThreeButtonStyle, Wrappers } from "../../../components/elements/UserContentTemplete";
import theme from "../../../styles/theme";
import Button from '@mui/material/Button';
import { Divider } from "@mui/material";
import { toast } from "react-hot-toast";
import Modal from '../../../components/Modal';
import DaumPostcode from 'react-daum-postcode';
import $ from 'jquery';
import axios from "axios";
import { regExp } from "../../../functions/utils";
import Swal from "sweetalert2";
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
    const defaultObj = {
        id: '',
        pw: '',
        pw_check: '',
        address: '',
        address_detail: '',
        id_number_front: '',
        id_number_back: '',
        phone: '',
        name: '',
    }
    const [values, setValues] = useState(defaultObj);
    const handleChange = (value, key) => {
        setValues({ ...values, [key]: value });
    }
    useEffect(() => {
        if (params?.user_level == 0) {
            setTitle('임차인');
        } else if (params?.user_level == 5) {
            setTitle('임대인');
        } else if (params?.user_level == 10) {
            setTitle('공인중개사');
        } else {
            toast.error('잘못된 접근입니다.');
            navigate(-1);
        }
    }, []);
    const onSelectAddress = (data) => {
        setIsSeePostCode(false);
        setValues({ ...values, ['address']: data?.address, ['zip_code']: data?.zonecode, ['address_detail']: '' });
        $('.address_detail').focus();
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
        if (!isCheckId) {
            toast.error('아이디 중복확인을 완료해 주세요.');
            return;
        }
        if (!values.pw) {
            toast.error('비밀번호를 입력해주세요.');
            return;
        }
        if (!regExp('pw', values.pw)) {
            toast.error('비밀번호 정규식을 지켜주세요.');
            return;
        }
        if (values.pw !== values.pw_check) {
            toast.error('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!values.address) {
            toast.error('주소를 입력해 주세요.');
            return;
        }
        // if (!$('.id_number').val()) {
        //     alert('주민등록번호를 입력해 주세요.');
        //     return;
        // }
        if (!values.phone) {
            toast.error('휴대폰 번호를 입력해 주세요.');
            return;
        }
        // if (!isCheckPhone) {
        //     toast.error('휴대폰 번호 인증을 완료해 주세요.');
        //     return;
        // }
        if (!values.name) {
            toast.error('이름을 입력해 주세요.');
            return;
        }
        if (!regExp('name', values.name)) {
            toast.error('이름 정규식을 지켜주세요.');
            return;
        }
        if (params.user_level == 10) {

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
        if (params.user_level == 10) {
            let add_obj = {

            }
            obj = { ...obj, add_obj };
        }
        obj = { ...obj, ['id_number']: obj?.id_number_front + '-' + obj?.id_number_back }
        const { data: response } = await axios.post('/api/adduser', obj);
        if (response?.result > 0) {
            toast.success('성공적으로 회원가입 되었습니다.');
            navigate('/login');
        } else {
            toast.error(response?.message);
        }
    }
    const onPreStep = () => {
        if (params?.user_level == 10) {
            setStep(step - 1);

        } else {
            setStep(step - 2);
        }
        window.scrollTo(0, 0);
    }
    const onNextStep = () => {
        if (params?.user_level == 10) {
            setStep(step + 1);

        } else {
            setStep(step + 2);
        }
        window.scrollTo(0, 0);
    }
    return (
        <>
            <FakeHeaders label='회원가입' />
            <Wrappers className="wrapper" style={{ width: '100%' }}>
                <ContentWrappers>
                    {step == 0 ?
                        <>
                            <HalfTitle>{title}</HalfTitle>
                            <InputComponet
                                label={'ID*'}
                                input_type={{
                                    placeholder: '특수문자 제외한 6자리 이상 20자리 이하',
                                    disabled: isCheckId
                                }}
                                class_name='id'
                                button_label={isCheckId ? '완료' : '확인'}
                                isButtonAble={!isCheckId}
                                is_divider={true}
                                onKeyPress={() => onCheckId()}
                                onClickButton={() => onCheckId()}
                                onChange={(e) => handleChange(e, 'id')}
                                value={values.id}
                            />
                            <InputComponet
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
                            <InputComponet
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
                            <div onClick={() => {
                            }}>
                                <InputComponet
                                    label={'주소* '}
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
                            <InputComponet
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
                            <RowContent style={{ maxWidth: '500px', margin: '0 auto', alignItems: 'center', justifyContent: 'space-between' }}>
                                <InputComponet
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
                                <InputComponet
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

                            <InputComponet
                                label={'휴대폰번호*'}
                                input_type={{
                                    placeholder: '-없이 숫자만 입력',
                                    disabled: isCheckPhone
                                }}
                                class_name='phone'
                                button_label={isCheckPhone ? '완료' : '인증'}
                                isButtonAble={!isCheckPhone}
                                onChange={(e) => handleChange(e, 'phone')}
                                value={values.phone}
                            />
                            <InputComponet
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
                            <HalfTitle>{'중개업확인'}</HalfTitle>
                            <InputComponet
                                label={'사업자등록번호'}
                                input_type={{
                                    placeholder: '대표자 필수입력'
                                }}
                                class_name='cr_number'
                                is_divider={true}
                                onChange={(e) => handleChange(e, 'name')}
                                value={values.name}
                            />
                            <InputComponet
                                label={'사무소명칭'}
                                input_type={{
                                    placeholder: ''
                                }}
                                class_name='office_name'
                                is_divider={true}
                                onChange={(e) => handleChange(e, 'name')}
                                value={values.name}
                            />
                            <InputComponet
                                label={'중개업소관리번호'}
                                input_type={{
                                    placeholder: ''
                                }}
                                class_name='name'
                                is_divider={true}
                                onChange={(e) => handleChange(e, 'name')}
                                value={values.name}
                            />
                            <InputComponet
                                label={'중개업소직위구분'}
                                input_type={{
                                    placeholder: ''
                                }}
                                class_name='name'
                                is_divider={true}
                                onChange={(e) => handleChange(e, 'name')}
                                value={values.name}
                            />
                            <InputComponet
                                label={'중개인구분'}
                                input_type={{
                                    placeholder: ''
                                }}
                                class_name='name'
                                is_divider={true}
                                onChange={(e) => handleChange(e, 'name')}
                                value={values.name}
                            />
                            <InputComponet
                                label={'상태구분'}
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
                    {step == 2 ?
                        <>
                            <HalfTitle style={{ textAlign: 'left' }}>{'약관동의'}</HalfTitle>

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