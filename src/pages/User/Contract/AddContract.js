//계약생성

import { colorButtonStyle, ContentWrappers, InputComponet, postCodeStyle, smallButtonStyle, Wrappers } from "../../../components/elements/UserContentTemplete";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useEffect, useState } from "react";
import { getLocalStorage } from "../../../functions/LocalStorage";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import theme from "../../../styles/theme";
import { Button } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import styled from "styled-components";
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import { motion } from "framer-motion";
import axios from "axios";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";
import $ from 'jquery';
import { Explain, ImageContainer } from "../../../components/elements/ManagerTemplete";
import { AiFillFileImage } from "react-icons/ai";
import { backUrl } from "../../../data/Data";
import Modal from '../../../components/Modal';
import DaumPostcode from 'react-daum-postcode';
const steps = ['계약서등록', '임대인\n동의구하기', '임차인\n동의구하기', '완료'];
const stepLabelStyle = {
    whiteSpace: 'pre'
};

const AddContract = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set());
    const [landlordList, setLandlordList] = useState([]);
    const [lesseeList, setLesseeList] = useState([]);
    const [imgUrlObj, setImgUrlObj] = useState({});
    const [imgContentObj, setImgContentObj] = useState({});
    const [isSeePostCode, setIsSeePostCode] = useState(false);
    const [values, setValues] = useState({
        landlord_pk: 0,
        landlord_search: '',
        landlord: {},
        landlord_appr: 0,
        lessee_pk: 0,
        lessee_search: '',
        lessee_appr: 0,
        lessee: {},
        realtor_pk: 0,
        pay_type: 0,
        deposit: 0,
        monthly: 0,
        address: '',
        address_detail: '',
        zip_code: ''
    })
    useEffect(() => {
        let user_data = getLocalStorage('auth');
        if (user_data?.user_level < 10 || !user_data?.pk) {
            toast.error("잘못된 접근입니다.");
            setTimeout(() => {
                navigate(-1);
            }, 1000);
        }
        if (params?.pk) {
            getContract(user_data)
        }
    }, [params?.pk])
    const getContract = async (user_data) => {
        const { data: response } = await axios.get(`/api/item?table=contract&pk=${params?.pk}`);
        if (response?.data?.realtor_pk != user_data?.pk) {
            toast.error('권한이 없습니다.');
            navigate(-1);
        }
        let obj = response?.data;
        obj['monthly'] = obj['monthly'] / 10000;
        obj['deposit'] = obj['deposit'] / 10000;
        setImgUrlObj({ ...imgUrlObj, ['document_src']: backUrl + obj['document_src'] })
        setValues({ ...values, ...obj });
        setActiveStep(obj?.step);
    }
    const onSelectAddress = (data) => {
        setIsSeePostCode(false);
        setValues({ ...values, ['address']: data?.address, ['zip_code']: data?.zonecode, ['address_detail']: '' });
        $('.address_detail').focus();
    }
    const handleChange = async (value, key) => {
        setValues({ ...values, [key]: value });
        if (key == 'landlord_search') {
            if (value.length >= 2 && !values.landlord?.name) {
                const { data: response } = await axios.get(`/api/items?table=user&level=5&keyword=${value}`);
                setLandlordList(response?.data ?? []);
            } else {
                setLandlordList([]);
            }
        }
        if (key == 'lessee_search') {
            if (value.length >= 2 && !values.lessee?.name) {
                const { data: response } = await axios.get(`/api/items?table=user&level=0&keyword=${value}`);
                setLesseeList(response?.data ?? []);
            } else {
                setLesseeList([]);
            }
        }

    }
    const onNextButton = () => {
        if (activeStep == 0) {
            if (!params?.pk) {
                Swal.fire({
                    title: '계약서를 등록 하시겠습니까?',
                    showCancelButton: true,
                    confirmButtonText: '확인',
                    cancelButtonText: '취소'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            if (!params?.pk) {
                                let response_img = undefined;
                                if (imgContentObj?.document_src) {
                                    let formData = new FormData();
                                    formData.append('document_src', imgContentObj?.document_src);
                                    const { data: response_image } = await axios.post('/api/addimageitems', formData);
                                    response_img = response_image?.data[0];
                                }
                                let obj = {
                                    pay_type: values?.pay_type,
                                    address: values?.address,
                                    zip_code: values?.zip_code,
                                    address_detail: values?.address_detail,
                                    deposit: parseInt(values?.deposit) * 10000,
                                    monthly: parseInt(values?.monthly) * 10000,
                                }
                                if (response_img) {
                                    obj['document_src'] = response_img?.filename;
                                }
                                const { data: response } = await axios.post('/api/addcontract', obj);
                                console.log(response)
                                if (response?.result > 0) {
                                    toast.success('등록되었습니다. 다음 절차를 진행해 주세요.');
                                    navigate(`/addcontract/${response?.data?.result_pk}`)
                                } else {
                                    toast.error(response?.message);
                                }
                            }

                        } catch (err) {
                            console.log(err);
                            toast.error(err?.message)
                        }

                    }

                })
            } else {
                setActiveStep(activeStep + 1);
                setLandlordList([]);
                setLesseeList([]);
            }
        } else {
            setActiveStep(activeStep + 1);
            setLandlordList([]);
            setLesseeList([]);
        }
    }
    const onPrevButton = () => {
        setActiveStep(activeStep - 1);
        setLandlordList([]);
        setLesseeList([]);
    }
    const onSelectLandlord = async (obj) => {
        setLandlordList([]);
        setValues({ ...values, ['landlord']: obj, ['landlord_search']: obj?.name });
    }
    const onSelectLessee = async (obj) => {
        setLesseeList([]);
        setValues({ ...values, ['lessee']: obj, ['lessee_search']: obj?.name });
    }
    const canNextButton = (num) => {
        if (num == 0) {
            return true;
        }
        if (num == 1) {
            return true;

        }
        if (num == 2) {

        }
        if (num == 3) {
            return true;
        }
        return false;
    }
    const addContract = async () => {

    }
    const updateContract = async () => {

    }
    const addFile = (e) => {
        let { id, files } = e.target;
        if (e.target.files[0]) {
            let img_content_obj = { ...imgContentObj };
            let img_url_obj = { ...imgUrlObj };
            img_content_obj[`${id}`] = e.target.files[0];
            img_url_obj[`${id}`] = URL.createObjectURL(e.target.files[0]);
            setImgContentObj({ ...img_content_obj });
            setImgUrlObj({ ...img_url_obj });
        }
        $(`#${id}`).val("");
    };
    const imgReset = (column) => {
        let img_url_obj = { ...imgUrlObj };
        img_url_obj[column] = -1;
        setImgUrlObj({ ...img_url_obj });
    }
    return (
        <>
            <Wrappers>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step key={label} classes={{
                            completed: theme.color.background1,
                            active: theme.color.background1,
                        }}>
                            <StepLabel sx={stepLabelStyle}>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <ContentWrappers style={{ marginTop: '1rem' }}>
                    {activeStep == 0 ?
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '250px' }}
                            >
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
                                <FormControl sx={{ minWidth: 120, margin: '8px 1px' }} size="small">
                                    <InputLabel id="demo-select-small">전/월세</InputLabel>
                                    <Select
                                        labelId="demo-select-small"
                                        id="demo-select-small"
                                        value={values.pay_type}
                                        label="전/월세"
                                        onChange={(e) => handleChange(e.target.value, 'pay_type')}
                                    >
                                        <MenuItem value={0}>월세</MenuItem>
                                        <MenuItem value={1}>전세</MenuItem>
                                    </Select>
                                </FormControl>
                                <InputComponet
                                    label={'보증금'}
                                    input_type={{
                                        placeholder: '숫자를 입력해 주세요.'
                                    }}
                                    class_name='deposit'
                                    is_divider={true}
                                    onChange={(e) => handleChange(e, 'deposit')}
                                    value={values.deposit}
                                    icon_label={<div style={{ fontSize: theme.size.font4 }}>만원</div>}
                                />
                                <InputComponet
                                    label={'월세'}
                                    input_type={{
                                        placeholder: '숫자를 입력해 주세요.'
                                    }}
                                    class_name='monthly'
                                    is_divider={true}
                                    onChange={(e) => handleChange(e, 'monthly')}
                                    value={values.monthly}
                                    icon_label={<div style={{ fontSize: theme.size.font4 }}>만원</div>}
                                />
                                <ImageContainer for={`document_src`} style={{ margin: '0', width: '100%' }}>

                                    {imgUrlObj[`document_src`] && imgUrlObj[`document_src`] != -1 ?
                                        <>
                                            <img src={imgUrlObj[`document_src`]} alt="#"
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
                                    <input type="file" id={`document_src`} onChange={addFile} style={{ display: 'none' }} />
                                </div>
                                {imgUrlObj[`document_src`] && imgUrlObj[`document_src`] != -1 ?
                                    <>
                                        <Explain style={{ margin: '8px auto 0px 0px' }}>
                                            <Button onClick={() => imgReset('document_src')}>초기화</Button>
                                        </Explain>
                                    </>
                                    :
                                    <>
                                    </>}
                            </motion.div>

                        </>
                        :
                        <>
                        </>}
                    {activeStep == 1 ?
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '250px' }}
                            >
                                <InputComponet
                                    label={'임대인'}
                                    input_type={{
                                        placeholder: '임대인 이름, 주민등록번호, 전화번호 검색가능.',
                                        disabled: values.landlord?.name
                                    }}
                                    class_name='landlord_search'
                                    is_divider={true}
                                    onChange={(e) => handleChange(e, 'landlord_search')}
                                    value={values.landlord_search}
                                    autoCompleteList={landlordList}
                                    onAutoCompleteClick={onSelectLandlord}
                                    icon_label={values.landlord?.name ? <Icon icon="zondicons:reload" /> : ''}
                                    onClickIcon={() => {
                                        Swal.fire({
                                            title: '임대인 초기화 하시겠습니까?',
                                            showCancelButton: true,
                                            confirmButtonText: '확인',
                                            cancelButtonText: '취소'
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                setValues({ ...values, ['landlord']: {}, ['landlord_search']: '' })
                                                $('.landlord_search').focus();
                                            }
                                            return;
                                        })
                                    }}
                                />
                                {values.landlord?.name ?
                                    <>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            lineHeight: '24px',
                                            fontSize: theme.size.font4
                                        }}>
                                            <div>성명: {values.landlord?.name}</div>
                                            <div>주민등록번호: {values.landlord?.id_number && values.landlord?.id_number.substring(0, 6)}-*******</div>
                                            <div>전화번호: {values.landlord?.phone}</div>
                                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                                <div />
                                                <Button sx={colorButtonStyle} onClick={() => { }}
                                                    startIcon={<Icon icon="material-symbols:approval-delegation" />}
                                                >동의구하기</Button>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <>
                                    </>}
                            </motion.div>

                        </>
                        :
                        <>
                        </>}
                    {activeStep == 2 ?
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '250px' }}
                            >
                                <InputComponet
                                    label={'임차인'}
                                    input_type={{
                                        placeholder: '임차인 이름, 주민등록번호, 전화번호 검색가능.',
                                        disabled: values.lessee?.name
                                    }}
                                    class_name='lessee_search'
                                    is_divider={true}
                                    onChange={(e) => handleChange(e, 'lessee_search')}
                                    value={values.lessee_search}
                                    autoCompleteList={lesseeList}
                                    onAutoCompleteClick={onSelectLessee}
                                    icon_label={values.landlord?.name ? <Icon icon="zondicons:reload" /> : ''}
                                    onClickIcon={() => {
                                        Swal.fire({
                                            title: '임차인 초기화 하시겠습니까?',
                                            showCancelButton: true,
                                            confirmButtonText: '확인',
                                            cancelButtonText: '취소'
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                setValues({ ...values, ['lessee']: {}, ['lessee_search']: '' })
                                                $('.lessee_search').focus();
                                            }
                                            return;
                                        })
                                    }}
                                />
                                {values.lessee?.name ?
                                    <>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            lineHeight: '24px',
                                            fontSize: theme.size.font4
                                        }}>
                                            <div>성명: {values.lessee?.name}</div>
                                            <div>주민등록번호: {values.lessee?.id_number && values.lessee?.id_number.substring(0, 6)}-*******</div>
                                            <div>전화번호: {values.lessee?.phone}</div>
                                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                                <div />
                                                <Button sx={colorButtonStyle} onClick={() => { }}
                                                    startIcon={<Icon icon="material-symbols:approval-delegation" />}
                                                >동의구하기</Button>
                                            </div>
                                        </div>

                                    </>
                                    :
                                    <>
                                    </>}
                            </motion.div>
                        </>
                        :
                        <>
                        </>}
                    {activeStep == 3 ?
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '250px' }}
                            >
                            </motion.div>
                        </>
                        :
                        <>
                        </>}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        marginTop: '1rem',
                    }}>
                        {activeStep == 0 ?
                            <>
                                <div />
                            </>
                            :
                            <>
                                <Button sx={colorButtonStyle} onClick={onPrevButton}>이전</Button>
                            </>}
                        <Button sx={colorButtonStyle} onClick={onNextButton} disabled={!canNextButton(activeStep)}>{activeStep == 3 ? '완료' : '다음'}</Button>
                    </div>
                    {isSeePostCode ?
                        <>
                            <Modal onClickXbutton={() => { setIsSeePostCode(false) }}>
                                <DaumPostcode style={postCodeStyle} onComplete={onSelectAddress} />
                            </Modal>
                        </>
                        :
                        <>
                        </>}
                </ContentWrappers>
            </Wrappers>
        </>
    )
}
export default AddContract;