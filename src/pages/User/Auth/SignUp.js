import { useRef, useState } from "react";
import { useEffect } from "react";
import { GrFormPrevious } from "react-icons/gr";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ContentWrappers, FakeHeaders, HalfTitle, InputComponent, RowContainer, RowContent, Title, TopTitleWithBackButton, TwoOfThreeButton, twoOfThreeButtonStyle, Wrappers } from "../../../components/elements/UserContentTemplete";
import theme from "../../../styles/theme";
import Button from '@mui/material/Button';
import { Dialog, DialogContent, Divider } from "@mui/material";
import { toast } from "react-hot-toast";
import Modal from '../../../components/Modal';
import DaumPostcode from 'react-daum-postcode';
import $ from 'jquery';
import axios from "axios";
import { formatPhoneNumber, regExp } from "../../../functions/utils";
import Swal from "sweetalert2";
import { Col, ImageContainer } from "../../../components/elements/ManagerTemplete";
import { AiFillFileImage } from "react-icons/ai";
import { CategoryName } from "../../../components/elements/AuthContentTemplete";
import Policy from "../Policy/Policy";
import { backUrl, frontUrl, socket } from "../../../data/Data";
import Loading from "../../../components/Loading";
import { getUserLevelByNumber } from "../../../functions/format";
import { onPostWebview } from "../../../functions/webview-connect";
import AuthPhoneSrc from '../../../assets/images/test/auth-phone.svg'
import PassSrc from '../../../assets/images/test/pass.svg'
import { Icon } from "@iconify/react";

const SignUp = () => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [isSeePostCode, setIsSeePostCode] = useState(false);
    const [isCheckId, setIsCheckId] = useState(false);
    const [step, setStep] = useState(0);
    const [values, setValues] = useState({});
    const [isSendSms, setIsSendSms] = useState(false)
    const [randNum, setRandNum] = useState("")
    const [loading, setLoading] = useState(false);
    const [returnUrl, setReturnUrl] = useState("");
    const [popupContent, setPopupContent] = useState(undefined)
    const [openPhoneCheckType, setOpenPhoneCheckType] = useState(false);
    const [phoneCheckType, setPhoneCheckType] = useState(1);//0인증,1pass
    const [checkPhoneNum, setCheckPhoneNum] = useState("")//휴대폰번호 인증 인증번호 시퀀스일때 잠깐 사용할 번호 성공일시 유저 obj phone 으로 들어감
    const [phoneCheckNum, setPhoneCheckNum] = useState("");
    const defaultObj = {
        id: '',
        pw: '',
        pw_check: '',
        address: '',
        address_detail: '',
        id_number: '',
        phone: '',
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
    function searchToObject(search) {
        var pairs = search.substring(1).split("&"),
            obj = {},
            pair,
            i;
        for (i in pairs) {
            if (pairs[i] === "") continue;
            pair = pairs[i].split("=");
            obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]).replaceAll('+', ' ');
        }
        return obj;
    }
    useEffect(() => {
        let query_object = searchToObject(decodeURIComponent(location.search));
        console.log(query_object)
        if (query_object?.name && query_object?.mobileno) {
            query_object['receivedata'] = JSON.parse(query_object?.receivedata);
            setValues({
                ...query_object?.receivedata,
                phone: query_object?.mobileno,
                name: query_object?.name,
                id_number: query_object?.birthdate,
            })
            setIsCheckId(query_object?.receivedata?.isCheckId);
            setTitle(getUserLevelByNumber(query_object?.receivedata?.user_level));
        } else {
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
        }

    }, []);
    const getIdentificationInfo = async () => {
        setOpenPhoneCheckType(false);
        const { form } = document;
        const left = window.screen.width / 2 - 500 / 2;
        const top = window.screen.height / 2 - 800 / 2;
        const option = `status=no, menubar=no, toolbar=no, resizable=no, width=500, height=600, left=${left}, top=${top}`;
        let device_type = window.innerWidth > 800 ? 'pc' : 'mobile';
        let return_url = `${window.location.origin}/api/nice-result`;
        const { data: response } = await axios.post('/api/nice-token', {
            level: params?.user_level,
            return_url: return_url,
            receive_data: JSON.stringify({
                ...values,
                device_type: device_type,
                isCheckId: isCheckId,
            })
        });
        setReturnUrl(return_url);
        if (response?.result > 0 && form) {
            const { enc_data, integrity_value, token_version_id } = response?.data;
            if (device_type == 'pc') {
                let popup = window.open('', 'nicePopup', option);
                setPopupContent(popup);
                form.target = 'nicePopup';
                form.enc_data.value = enc_data;
                form.token_version_id.value = token_version_id;
                form.integrity_value.value = integrity_value;
                form.submit();
            } else {
                if (window.ReactNativeWebView) {
                    onPostWebview('pass_auth', response?.data);
                } else {
                    form.target = '_self';
                    form.enc_data.value = enc_data;
                    form.token_version_id.value = token_version_id;
                    form.integrity_value.value = integrity_value;
                    form.submit();
                }
            }
        }
    }
    useEffect(() => {
        if (!popupContent) {
            return;
        }
        const timer = setInterval(() => {
            if (!popupContent) {
                timer && clearInterval(timer);
                return;
            }
            const currentUrl = popupContent.location.href;

            if (!currentUrl) {
                return;
            }
            let json = popupContent.document.body.innerText;
            json = JSON.parse(json);
            let resData = json?.data;
            console.log(json);
            setValues({ ...values, ['name']: resData?.name, ['phone']: resData?.mobileno, ['id_number']: resData?.birthdate, });
            console.log(currentUrl);
            if (json?.result > 0) {
                toast.success("성공적으로 인증 되었습니다.");
            } else {
                toast.error(json?.message);
            }
            popupContent.close();
            clearInterval(timer)
        }, 500)
    }, [popupContent]);
    useEffect(() => {
        if (step == 1 && params?.user_level == 10) {
            setTitle('중개업확인')
        }
    }, [step])
    const onSelectAddress = async (data) => {
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
        if (!values.phone) {
            toast.error('휴대폰 번호를 입력해 주세요.');
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
            if ($('input[id=fee-1]:checked').val()) {
                add_obj['is_agree_brokerage_fee'] = 1;
            } else if ($('input[id=fee-2]:checked').val()) {
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

        obj = { ...obj }
        const { data: response } = await axios.post('/api/adduser', obj);
        if (response?.result > 0) {
            socket.emit('message', {
                method: 'signup_user_level_10',
                data: {
                    signup_user_level: params?.user_level,
                    signup_user_id: obj?.id,
                    signup_user_pk: response?.data?.pk,
                }
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
        if (step == 0) {
            if (!isCheckId) {
                toast.error("아이디 중복확인을 완료해 주세요.");
                return;
            }
            if (
                !values?.pw ||
                !values?.pw_check
            ) {
                toast.error("필수값을 입력해 주세요.");
                return;
            }
            if (!regExp('pw', values.pw)) {
                toast.error('비밀번호 정규식을 지켜주세요.');
                return;
            }
            if (values?.pw != values?.pw_check) {
                toast.error("비밀번호가 일치하지 않습니다.");
                return;
            }
            if (
                !values?.name ||
                !values?.phone ||
                !values?.id_number
            ) {
                toast.error("휴대폰 인증을 완료해 주세요.");
                return;
            }
        }
        if (params?.user_level == 10 || params?.user_level == 5) {
            setStep(step + 1);
        } else {
            setStep(step + 2);
        }
        window.scrollTo(0, 0);
    }

    const addFile = (e) => {
        let { name, files } = e.target;
        if (files[0]) {
            setValues({ ...values, [name]: files[0] });
            $(`.${name}`).val("");
        }
    };
    const sendSms = async () => {
        if (!values.name) {
            alert("이름을 입력해주세요.");
            return;
        }
        if (!values.id_number) {
            alert("생년월일을 입력해주세요.");
            return;
        }
        if (!checkPhoneNum) {
            alert("핸드폰 번호를 입력해주세요.");
            return;
        }
        setValues({ ...values, phone: '' })
        let fix_phone = checkPhoneNum.replaceAll('-', '');
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
        }
    }
    const onCheckRandNum = () => {
        if (phoneCheckNum == randNum) {
            setValues({
                ...values,
                phone: checkPhoneNum
            })
            setOpenPhoneCheckType(false);
            toast.success("휴대폰인증이 성공적으로 완료되었습니다.")
        } else {
            alert('인증번호가 일치하지 않습니다.')
        }
    }
    return (
        <>
            <form name="form" id="form" action="https://nice.checkplus.co.kr/CheckPlusSafeModel/service.cb" style={{ display: 'none' }}>
                <input type="hidden" id="m" name="m" value="service" />
                <input type="hidden" id="token_version_id" name="token_version_id" value="" />
                <input type="hidden" id="enc_data" name="enc_data" />
                <input type="hidden" id="integrity_value" name="integrity_value" />
            </form>
            <Dialog open={openPhoneCheckType} onClose={() => {
                setOpenPhoneCheckType(false);
                setTimeout(() => {
                    setPhoneCheckType(1);
                    setCheckPhoneNum("");
                }, 500);
            }}>
                <Icon icon='mingcute:close-line' style={{ margin: '20px 20px 0 auto', fontSize: '2rem', cursor: 'pointer' }} onClick={() => {
                    setOpenPhoneCheckType(false);
                    setTimeout(() => {
                        setPhoneCheckType(1);
                        setCheckPhoneNum("");
                    }, 500);
                }} />
                <DialogContent style={{ columnGap: '1rem', display: 'flex', width: `${window.innerWidth > 1000 ? '500px' : '70vw'}` }}>
                    {phoneCheckType == 0 ?
                        <>
                            <ContentWrappers>
                                <InputComponent
                                    label={'이름'}
                                    input_type={{
                                        placeholder: ''
                                    }}
                                    class_name='name'
                                    is_divider={true}
                                    value={values.name}
                                    onKeyPress={() => $('.id_number').focus()}
                                    onChange={(e) => handleChange(e, 'name')}
                                />
                                <InputComponent
                                    label={'생년월일'}
                                    input_type={{
                                        placeholder: '20220101'
                                    }}
                                    class_name='id_number'
                                    is_divider={true}
                                    value={values.id_number}
                                    onKeyPress={() => { }}
                                    onChange={(e) => handleChange(e, 'id_number')}
                                />
                                <InputComponent
                                    label={'휴대폰번호'}
                                    input_type={{
                                        placeholder: '하이픈제외(-)',
                                        disabled: values?.phone
                                    }}
                                    class_name='id'
                                    button_label={values?.phone ? '완료' : '인증발송'}
                                    isButtonAble={!values?.phone}
                                    is_divider={true}
                                    onKeyPress={() => sendSms()}
                                    onClickButton={() => sendSms()}
                                    onChange={(e) => setCheckPhoneNum(e)}
                                    value={checkPhoneNum}
                                />
                                <InputComponent
                                    label={'휴대폰인증번호'}
                                    input_type={{
                                        placeholder: '',
                                    }}
                                    class_name='id'
                                    button_label={values?.phone ? '완료' : '인증확인'}
                                    isButtonAble={!values?.phone}
                                    is_divider={true}
                                    onKeyPress={() => onCheckRandNum()}
                                    onClickButton={() => onCheckRandNum()}
                                    onChange={(e) => setPhoneCheckNum(e)}
                                    value={phoneCheckNum}
                                />
                            </ContentWrappers>
                        </>
                        :
                        <>
                            <ContentWrappers>
                                <div style={{ margin: '1rem auto', fontWeight: 'bold' }}>인증방법을 선택해주세요</div>
                                <RowContainer>
                                    <Col style={{ alignItems: 'center', rowGap: '1rem', cursor: 'pointer', margin: '0 auto' }} onClick={() => {
                                        setPhoneCheckType(0);
                                    }}>
                                        <img src={AuthPhoneSrc} />
                                        <div>인증번호</div>
                                    </Col>
                                    {!window.ReactNativeWebView &&
                                        <>
                                            <Col style={{ alignItems: 'center', rowGap: '1rem', cursor: 'pointer', margin: '0 auto' }} onClick={getIdentificationInfo}>
                                                <img src={PassSrc} style={{ borderRadius: '0.5rem' }} />
                                                <div>PASS</div>
                                            </Col>
                                        </>}

                                    {/* <Button variant="outlined" style={{ width: `${window.innerWidth > 1000 ? '200px' : '30vw'}`, height: '72px', margin: `0 ${!window.ReactNativeWebView ? '0' : 'auto'} 0 auto`, fontWeight: 'bold' }} onClick={() => {
                                        setPhoneCheckType(0);
                                    }}>인증번호</Button>
                                    {!window.ReactNativeWebView &&
                                        <>
                                            <Button variant="contained" style={{ width: `${window.innerWidth > 1000 ? '200px' : '30vw'}`, height: '72px', margin: `0 auto 0 auto`, fontWeight: 'bold' }} onClick={getIdentificationInfo}>PASS</Button>
                                        </>} */}
                                </RowContainer>
                            </ContentWrappers>

                        </>}

                </DialogContent>
            </Dialog>
            <Wrappers className="wrapper" style={{ marginTop: '0' }}>
                <TopTitleWithBackButton title='회원가입' />
                <ContentWrappers>
                    {loading ?
                        <>
                            <Loading />
                        </>
                        :
                        <>

                            {step == 0 ?
                                <>
                                    <HalfTitle>{title}</HalfTitle>
                                    <InputComponent
                                        label={'아이디'}
                                        input_type={{
                                            placeholder: '특수문자 제외한 6자리 이상 20자리 이하 영문소문자',
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
                                        label={'비밀번호'}
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
                                        label={'비밀번호확인'}
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
                                                    label={'집주소'}
                                                    input_type={{
                                                        placeholder: '',
                                                    }}
                                                    class_name='address'
                                                    is_divider={true}
                                                    onClick={() => {
                                                        setIsSeePostCode(true)
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
                                                onChange={(e) => handleChange(e, 'address_detail')}
                                                value={values.address_detail}
                                            />
                                        </>
                                        :
                                        <>
                                        </>}
                                    {(values?.name && values?.id_number && values?.phone) ?
                                        <>
                                            <InputComponent
                                                label={'휴대폰번호'}
                                                input_type={{
                                                    placeholder: ''
                                                }}
                                                class_name='phone'
                                                is_divider={true}
                                                disabled={true}
                                                value={values.phone}
                                            />
                                            <InputComponent
                                                label={'이름'}
                                                input_type={{
                                                    placeholder: ''
                                                }}
                                                class_name='name'
                                                is_divider={true}
                                                disabled={true}
                                                value={values.name}
                                            />
                                            <InputComponent
                                                label={'생년월일'}
                                                input_type={{
                                                    placeholder: ''
                                                }}
                                                class_name='id_number'
                                                is_divider={true}
                                                disabled={true}
                                                value={values.id_number}
                                            />
                                        </>
                                        :
                                        <>
                                            <Button variant="text" sx={{ ...twoOfThreeButtonStyle, marginTop: '8px' }} onClick={() => setOpenPhoneCheckType(true)}>휴대폰인증 하러가기</Button>
                                        </>
                                    }
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
                                                top_label={'중개업소명칭'}
                                                input_type={{
                                                    placeholder: ''
                                                }}
                                                class_name='office_name'
                                                is_divider={true}
                                                onChange={(e) => handleChange(e, 'office_name')}
                                                value={values.office_name}
                                            />
                                            <InputComponent
                                                top_label={'사업자등록번호'}
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
                                                    top_label={'사무실주소'}
                                                    label={'사무실주소'}
                                                    input_type={{
                                                        placeholder: '',
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
                                                top_label={'사무실상세주소'}
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
                                                top_label={'사무실연락처'}
                                                label={'사무실연락처'}
                                                input_type={{
                                                    placeholder: ''
                                                }}
                                                class_name='office_phone'
                                                is_divider={true}
                                                onChange={(e) => handleChange(e, 'office_phone')}
                                                value={values.office_phone}
                                            />
                                            <CategoryName style={{ width: '100%', maxWidth: '1000px', marginBottom: '0.5rem', fontWeight: 'bold' }}>사업자등록증사진</CategoryName>
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
                                            <CategoryName style={{ width: '100%', maxWidth: '1000px', marginBottom: '0.5rem', fontWeight: 'bold' }}>중개업소등록증사진</CategoryName>
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
                                    <CategoryName style={{ width: '100%', maxWidth: '1000px', marginBottom: '0.5rem', fontWeight: 'bold' }}>통장사본사진</CategoryName>
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
                                            <CategoryName style={{ width: '100%', maxWidth: '1000px', marginBottom: '0.5rem', fontWeight: 'bold' }}>신분증사진</CategoryName>
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
                                    <Button variant="text" sx={{ ...twoOfThreeButtonStyle, marginTop: '8px' }} onClick={onNextStep}>다음단계로</Button>
                                </>}
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