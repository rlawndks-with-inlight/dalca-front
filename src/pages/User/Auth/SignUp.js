import { useState } from "react";
import { useEffect } from "react";
import { GrFormPrevious } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ContentWrappers, FakeHeaders, HalfTitle, InputComponet, Title, TwoOfThreeButton, twoOfThreeButtonStyle, Wrappers } from "../../../components/elements/UserContentTemplete";
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
        $('.address').val(data?.address);
        $('.zip_code').val(data?.zonecode);
        $('.address_detail').val("");
        $('.address_detail').focus();
    }
    const onCheckId = async () => {
        if (!$('.id').val()) {
            toast.error('아이디를 입력해주세요.');
            return;
        }
        if ($('.id').val().includes(' ')) {
            toast.error('아이디의 공백을 제거해 주세요.');
            return;
        }
        if (!regExp('id', $('.id').val())) {
            toast.error('아이디 정규식에 맞지 않습니다.');
            return;
        }
        const { data: response } = await axios.post('/api/checkexistid', { id: $('.id').val() });
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
        if (!$('.id').val()) {
            toast.error('아이디를 입력해주세요.');
            return;
        }
        if ($('.id').val().includes(' ')) {
            toast.error('아이디의 공백을 제거해 주세요.');
            return;
        }
        if (!regExp('id', $('.id').val())) {
            toast.error('아이디 정규식에 맞지 않습니다.');
            return;
        }
        if (!isCheckId) {
            toast.error('아이디 중복확인을 완료해 주세요.');
            return;
        }
        if (!$('.pw').val()) {
            toast.error('비밀번호를 입력해주세요.');
            return;
        }
        if (!regExp('pw', $('.pw').val())) {
            toast.error('비밀번호 정규식을 지켜주세요.');
            return;
        }
        if ($('.pw').val() !== $('.pw_check').val()) {
            toast.error('비밀번호가 일치하지 않습니다.');
            return;
        }
        if (!$('.address').val()) {
            toast.error('주소를 입력해 주세요.');
            return;
        }
        // if (!$('.id_number').val()) {
        //     alert('주민등록번호를 입력해 주세요.');
        //     return;
        // }
        if (!$('.phone').val()) {
            toast.error('휴대폰 번호를 입력해 주세요.');
            return;
        }
        // if (!isCheckPhone) {
        //     toast.error('휴대폰 번호 인증을 완료해 주세요.');
        //     return;
        // }
        if (!$('.name').val()) {
            toast.error('이름을 입력해 주세요.');
            return;
        }
        if (!regExp('name', $('.name').val())) {
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
        let obj = {
            id: $('.id').val(),
            pw: $('.pw').val(),
            address: $('.address').val(),
            address_detail: $('.address_detail').val(),
            id_number: $('.id_number').val(),
            phone: $('.phone').val(),
            name: $('.name').val(),
        }
        if (params.user_level == 10) {
            let add_obj = {

            }
            obj = { ...obj, add_obj };
        }
        const { data: response } = await axios.post('/api/adduser', obj);
        if (response?.result > 0) {
            toast.success('성공적으로 회원가입 되었습니다.');
            navigate('/login');
        } else {
            toast.error(response?.message);
        }
    }
    return (
        <>
            <FakeHeaders label='회원가입' />
            <Wrappers className="wrapper" style={{ width: '100%' }}>
                <ContentWrappers>
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
                    />
                    <div onClick={() => {
                        setIsSeePostCode(true)
                    }}>
                        <InputComponet
                            label={'주소* '}
                            input_type={{
                                placeholder: '',
                                disabled: "true"
                            }}
                            class_name='address'
                            is_divider={true}
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
                    />
                    <InputComponet
                        label={'주민등록번호'}
                        input_type={{
                            placeholder: ''
                        }}
                        class_name='id_number'
                        is_divider={true}
                        onKeyPress={() => $('.phone').focus()}
                    />
                    <InputComponet
                        label={'휴대폰번호*'}
                        input_type={{
                            placeholder: '-없이 숫자만 입력',
                            disabled: isCheckPhone
                        }}
                        class_name='phone'
                        button_label={isCheckPhone ? '완료' : '인증'}
                        isButtonAble={!isCheckPhone}
                        is_divider={true}
                    />
                    <InputComponet
                        label={'성명*'}
                        input_type={{
                            placeholder: ''
                        }}
                        class_name='name'
                        is_divider={true}
                    />
                    {params?.user_level == 10 ?
                        <>
                            <HalfTitle>{'중개업확인'}</HalfTitle>
                            <InputComponet
                                label={'사업자등록번호'}
                                input_type={{
                                    placeholder: '대표자 필수입력'
                                }}
                                class_name='cr_number'
                                is_divider={true}
                            />
                            <InputComponet
                                label={'사무소명칭'}
                                input_type={{
                                    placeholder: ''
                                }}
                                class_name='office_name'
                                is_divider={true}
                            />
                            <InputComponet
                                label={'중개업소관리번호'}
                                input_type={{
                                    placeholder: ''
                                }}
                                class_name='name'
                                is_divider={true}
                            />
                            <InputComponet
                                label={'중개업소직위구분'}
                                input_type={{
                                    placeholder: ''
                                }}
                                class_name='name'
                                is_divider={true}
                            />
                            <InputComponet
                                label={'중개인구분'}
                                input_type={{
                                    placeholder: ''
                                }}
                                class_name='name'
                                is_divider={true}
                            />
                            <InputComponet
                                label={'상태구분'}
                                input_type={{
                                    placeholder: ''
                                }}
                                class_name='name'
                                is_divider={true}
                            />

                        </>
                        :
                        <>
                        </>}
                    <HalfTitle style={{ textAlign: 'left' }}>{'약관동의'}</HalfTitle>
                    {isSeePostCode ?
                        <>
                            <Modal onClickXbutton={() => { setIsSeePostCode(false) }}>
                                <DaumPostcode style={postCodeStyle} onComplete={onSelectAddress} />
                            </Modal>
                        </>
                        :
                        <>
                        </>}
                    <Button variant="text" sx={{ ...twoOfThreeButtonStyle, marginTop: '32px' }} onClick={onSignUp}>회원가입</Button>
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