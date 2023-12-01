import { useEffect, useState } from "react";
import styled from "styled-components";
import { WrapperForm, CategoryName, Input, FlexBox, SnsLogo, RegularNotice } from './elements/AuthContentTemplete';
import { Title, SelectType, RowContent, ShadowContainer, Type, InputComponent, twoOfThreeButtonStyle } from "./elements/UserContentTemplete";
import theme from "../styles/theme";
import $ from 'jquery';
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { formatPhoneNumber, regExp } from "../functions/utils";
import defaultImg from '../assets/images/icon/default-profile.png';
import { backUrl } from "../data/Data";
import imageCompression from 'browser-image-compression';
import DaumPostcode from 'react-daum-postcode';
import AddButton from './elements/button/AddButton';
import { AiOutlineLock } from "react-icons/ai";
import Modal from "./Modal";
import { Button } from "@mui/material";
import toast from "react-hot-toast";
const Table = styled.table`
font-size:12px;
width:95%;
margin:0 auto;
text-align:center;
border-collapse: collapse;
color:${props => props.theme.color.font1};
background:#fff;
`
const Tr = styled.tr`
width:100%;
height:26px;
border-bottom:1px solid ${props => props.theme.color.font4};
`
const Td = styled.td`
border-bottom:1px solid ${props => props.theme.color.font4};
`

const EditMyInfoCard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    const [typeNum, setTypeNum] = useState(0);

    const [myPk, setMyPk] = useState(0);
    const [myId, setMyId] = useState("");
    const [phoneCheckIng, setPhoneCheckIng] = useState(false);
    const [isCheckId, setIsCheckId] = useState(false);
    const [isCheckNickname, setIsCheckNickname] = useState(false);
    const [isCheckPhoneNumber, setIsCheckPhoneNumber] = useState(false)
    const [isCheckIdAndPhone, setIsCheckIdAndPhone] = useState(false)
    const [url, setUrl] = useState('')
    const [content, setContent] = useState(undefined)
    const [randNum, setRandNum] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [num, setNum] = useState("");
    const [isCoinside, setIsCoinside] = useState(false);
    const [isSendSms, setIsSendSms] = useState(false)
    const [fixPhoneNumber, setFixPhoneNumber] = useState("")
    const zType = [
        { title: "비밀번호변경", type: 0 },
        { title: "휴대폰번호변경", type: 1 },
        { title: "주소변경", type: 2 }]

    const [userData, setUserData] = useState({});
    const [isSeePostCode, setIsSeePostCode] = useState(false);

    useEffect(() => {
        setUserData({});
        setTypeNum(params?.type ?? 0);
        let auth = JSON.parse(localStorage.getItem('auth'))
        setMyId(auth.id);
    }, [params])
    const sendSms = async () => {
        if (typeNum == 2 && !$('.id').val()) {
            alert("아이디를 입력해 주세요.");
            return;
        }
        if (!$('.phone').val()) {
            alert("핸드폰 번호를 입력해주세요.");
            return;
        }
        setIsCheckPhoneNumber(false);
        let fix_phone = $('.phone').val().replace('-', '');
        setFixPhoneNumber(fix_phone);
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
                alert('인증번호가 발송되었습니다.');

                setIsSendSms(true)
                setRandNum(content);
                $('phone-check').focus();
            } else {
                setIsSendSms(false)
            }
        } catch (e) {
        }
    }

    const onChangeTypeNum = async (num) => {
        navigate(`/editmyinfo/${num}`);
    }
    const onSave = async () => {
        let str = '/api/editmyinfo';
        let obj = { id: myId, typeNum: typeNum };
        if (typeNum == 0) {
            if (!userData?.password) {
                return toast.error('현재 비밀번호를 입력해 주세요.');
            }
            if (!userData?.new_password) {
                return toast.error('새 비밀번호를 입력해 주세요.');
            }
            if (userData?.new_password != userData?.new_password_check) {
                return toast.error('비밀번호가 일치하지 않습니다.');
            }
            obj = {
                ...obj,
                pw: userData?.password,
                newPw: userData?.new_password,
            }
        } else if (typeNum == 1) {
            if (randNum != userData?.phone_check) {
                toast.error('인증번호가 일치하지 않습니다.');
                return;
            }
            obj = {
                ...obj,
                pw: userData?.password,
                phone: userData?.phone,
            }

        } else if (typeNum == 2) {
            obj = {
                ...obj,
                zip_code: userData?.zip_code,
                address: userData?.address,
                address_detail: userData?.address_detail,
            }
        }
        const { data: response } = await axios.post(str, obj);
        if (response.result > 0) {
            toast.success("성공적으로 저장되었습니다.");
            navigate('/mypage');
        } else {
            toast.error(response.message);
        }
    }
    const onSelectAddress = (data) => {
        setIsSeePostCode(false);
        setUserData({
            ...userData,
            address: data?.address,
            zip_code: data?.zonecode,
            address_detail: "",
        })
        $('.address_detail').focus();
    }
    return (
        <>
            <WrapperForm>
                <SelectType className="select-type">
                    {zType.map((item, idx) => (
                        <>
                            <Type style={{ border: `1px solid ${typeNum == item?.type ? theme.color.background2 : '#fff'}`, color: `${typeNum == item?.type ? theme.color.background2 : (localStorage.getItem('dark_mode') ? '#fff' : '#ccc')}` }} onClick={() => { onChangeTypeNum(item?.type) }}>{item.title}</Type>
                        </>
                    ))}

                </SelectType>
                {typeNum == 0 &&
                    <>

                        <InputComponent
                            top_label={'현재 비밀번호'}
                            label={'비밀번호를 입력해주세요.'}
                            input_type={{
                                placeholder: '',
                                type: 'password'
                            }}
                            class_name='password'
                            onChange={(e) => setUserData({
                                ...userData,
                                password: e,
                            })}
                            value={userData?.password}
                            isSeeButton={true}
                        />
                        <InputComponent
                            top_label={'새 비밀번호'}
                            label={'새비밀번호를 입력해주세요.'}
                            input_type={{
                                placeholder: '',
                                type: 'password'
                            }}
                            class_name='new_password'
                            onChange={(e) => setUserData({
                                ...userData,
                                new_password: e,
                            })}
                            value={userData?.new_password}
                            isSeeButton={true}
                        />
                        <InputComponent
                            top_label={'새 비밀번호 확인'}
                            label={'새비밀번호를 한번더 입력해주세요.'}
                            input_type={{
                                placeholder: '',
                                type: 'password'
                            }}
                            class_name='new_password_check'
                            onChange={(e) => setUserData({
                                ...userData,
                                new_password_check: e,
                            })}
                            value={userData?.new_password_check}
                            isSeeButton={true}
                        />
                    </>}
                {typeNum == 1 &&
                    <>
                        <InputComponent
                            top_label={'현재 비밀번호'}
                            label={'비밀번호를 입력해주세요.'}
                            input_type={{
                                placeholder: '',
                                type: 'password'
                            }}
                            class_name='password'
                            onChange={(e) => setUserData({
                                ...userData,
                                password: e,
                            })}
                            value={userData?.password}
                            isSeeButton={true}
                        />
                        <InputComponent
                            top_label={'휴대폰번호'}
                            label={'하이픈제외(-)'}
                            input_type={{
                                disabled: userData?.phone_check_confirm
                            }}
                            class_name='phone'
                            button_label={userData?.phone_check_confirm ? '완료' : '인증번호 발송'}
                            isButtonAble={!userData?.phone_check_confirm}
                            is_divider={true}
                            onKeyPress={() => sendSms()}
                            onClickButton={() => sendSms()}
                            onChange={(e) => setUserData({
                                ...userData,
                                phone: e,
                            })}
                            value={userData?.phone}
                        />
                        <InputComponent
                            top_label={'인증번호'}
                            label={'인증번호를 입력해주세요.'}
                            class_name='phone_check'
                            is_divider={true}
                            value={userData?.phone_check}
                            onKeyPress={() => { }}
                            onChange={(e) => setUserData({
                                ...userData,
                                phone_check: e,
                            })}
                        />
                    </>}
                {typeNum == 2 &&
                    <>
                        <InputComponent
                            top_label={'우편번호'}
                            label={'우편번호'}
                            input_type={{
                                placeholder: '',
                            }}
                            class_name='zip_code'
                            is_divider={true}
                            onClick={() => {
                                setIsSeePostCode(true)
                            }}
                            value={userData?.zip_code}
                        />
                        <InputComponent
                            top_label={'주소'}
                            label={'주소'}
                            input_type={{
                                placeholder: '',
                            }}
                            class_name='address'
                            is_divider={true}
                            onClick={() => {
                                setIsSeePostCode(true)
                            }}
                            value={userData?.address}
                        />
                        <InputComponent
                            top_label={'상세주소'}
                            label={'상세주소를 입력해주세요.'}
                            class_name='address_detail'
                            is_divider={true}
                            value={userData?.address_detail}
                            onKeyPress={() => { }}
                            onChange={(e) => setUserData({
                                ...userData,
                                address_detail: e,
                            })}
                        />
                    </>}
                <Button variant="text" sx={{ ...twoOfThreeButtonStyle, marginTop: '8px' }} onClick={onSave}>저장</Button>
            </WrapperForm>
            {isSeePostCode ?
                <>
                    <Modal onClickXbutton={() => { setIsSeePostCode(false) }}>
                        <DaumPostcode style={postCodeStyle} onComplete={onSelectAddress} />
                    </Modal>
                </>
                :
                <>
                </>}
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

export default EditMyInfoCard;