//계약생성

import { colorButtonStyle, ContentWrappers, CustomSelect, InputComponent, postCodeStyle, smallButtonStyle, Title, Wrappers } from "../../../components/elements/UserContentTemplete";
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
import Loading from "../../../components/Loading";
import { range, returnMoment } from "../../../functions/utils";
import { CategoryName } from "../../../components/elements/AuthContentTemplete";
import AddButton from "../../../components/elements/button/AddButton";
//./component/socket.js
import React from 'react';
import io from "socket.io-client";
import { useRef } from "react";
import useInterval from "../../../components/useInterval";
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
    const [imgList, setImgList] = useState([]);
    const [pdfList, setPdfList] = useState([]);
    const [isSeePostCode, setIsSeePostCode] = useState(false);
    const [userData, setUserData] = useState({});
    const [isComplete, setIsComplete] = useState(false);
    const [loading, setLoading] = useState(false);
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
        deposit: 0,
        monthly: 0,
        address: '',
        address_detail: '',
        start_date: returnMoment().substring(0, 10),
        end_date: returnMoment().substring(0, 10),
        pay_day: 1,
    })
    useInterval(async ()=>{
        if(activeStep==1 || activeStep ==2){
            getCheckContractAppr();
        }
    }, 5*1000);
    useEffect(() => {
        let user_data = getLocalStorage('auth');
        if (user_data?.user_level < 10 || !user_data?.pk) {
            toast.error("잘못된 접근입니다.");
            setTimeout(() => {
                navigate(-1);
            }, 1000);
        }
        setUserData(user_data);
        if (params?.pk) {
            getContract(user_data, true)
        }
    }, [params?.pk]);
    useEffect(() => {
        settingActiveStep(activeStep)
    }, [activeStep])
    const settingActiveStep = async (num) => {
        let obj = {};
        if (num == 1) {

        }
        if (num == 2) {

        }
        setValues({ ...values, ...obj });
    }
    const getContract = async (user_data, is_render) => {
        if (is_render) {
            setLoading(true);
        }
        const { data: response } = await axios.get(`/api/item?table=contract&pk=${params?.pk}`);
        if (response?.data?.realtor_pk != user_data?.pk) {
            toast.error('권한이 없습니다.');
            navigate(-1);
        }
        let obj = response?.data;
        obj['monthly'] = obj['monthly'] / 10000;
        obj['deposit'] = obj['deposit'] / 10000;

        let img_list = JSON.parse(obj['document_src']??'[]');
        for (var i = 0; i < img_list.length; i++) {
            img_list[i]['url'] = backUrl + img_list[i]['url'];
        }
        setImgList(img_list);
        let pdf_list = JSON.parse(obj['pdf_list']);
        for (var i = 0; i < pdf_list.length; i++) {
            pdf_list[i]['url'] = backUrl + pdf_list[i]['url'];
        }
        setPdfList(pdf_list);

        if (obj['landlord_pk'] > 0) {
            const { data: response_landlord } = await axios.get(`/api/item?table=user&pk=${obj['landlord_pk']}`);
            obj['landlord'] = response_landlord?.data;
            obj['landlord_search'] = response_landlord?.data?.name;
        } else {
            obj['landlord'] = {};
            obj['landlord_search'] = '';
        }
        if (obj['lessee_pk'] > 0) {
            const { data: response_lessee } = await axios.get(`/api/item?table=user&pk=${obj['lessee_pk']}`);
            obj['lessee'] = response_lessee?.data;
            obj['lessee_search'] = response_lessee?.data?.name;
        } else {
            obj['lessee'] = {};
            obj['lessee_search'] = '';
        }
        setValues({ ...values, ...obj });
        if (is_render) {
            if (!obj?.landlord_pk) {
                setActiveStep(1);
                setTimeout(() => setLoading(false), 500);
                return;
            }
            if (!obj?.lessee_pk) {
                setActiveStep(2);
                setTimeout(() => setLoading(false), 500);
                return;
            }
            if (obj['landlord_appr'] == 1 && obj['lessee_appr'] == 1) {
                setIsComplete(true);
                setActiveStep(3);
                setTimeout(() => setLoading(false), 500);
                return;
            }
            setActiveStep(2);
            setTimeout(() => setLoading(false), 500);
        }

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
    const requestContractAppr = async (level, pk) => {
        let obj = {};
        if (level == 5 || level == 0) {

        } else {
            toast.error("잘못된 레벨입니다.");
            return;
        }
        obj['user_pk'] = pk;
        obj['request_level'] = level;
        obj['contract_pk'] = params?.pk;
        const { data: response } = await axios.post('/api/requestcontractappr', obj);
        if (response?.result > 0) {
            toast.success("유저에게 동의확인 신호를 보내었습니다.");
            getContract(userData);
            setLandlordList([]);
            setLesseeList([]);
        } else {
            toast.error(response?.message);
        }

    }

    const isConfirm = async () => {
        try {
            if (
                !values?.address ||
                !values?.zip_code ||
                !values?.address_detail ||
                !values?.start_date ||
                !values?.end_date ||
                !values?.pay_day
            ) {
                toast.error("필수값이 비어 있습니다.");
                setActiveStep(0);
                return;
            }
            let img_list = [...imgList];
            for (var i = 0; i < img_list.length; i++) {
                if (img_list[i].content) {
                    let formData = new FormData();
                    formData.append('document_src', img_list[i].content);
                    const { data: response_image } = await axios.post('/api/addimageitems', formData);
                    img_list[i]['content'] = "";
                    img_list[i]['url'] = response_image?.data[0]?.filename;
                }
                img_list[i]['url'] = img_list[i]['url'].replaceAll(backUrl, "");
            }
            let pdf_list = [...pdfList];
            for (var i = 0; i < pdf_list.length; i++) {
                if (pdf_list[i].content) {
                    let formData = new FormData();
                    formData.append('pdf', pdf_list[i].content);
                    const { data: response_image } = await axios.post('/api/addimageitems', formData);
                    if(!pdf_list[i]['name']){
                        pdf_list[i]['name'] = pdf_list[i]['content']['name'];
                    }
                    pdf_list[i]['content'] = "";
                    pdf_list[i]['url'] = response_image?.data[0]?.filename;
                }
                pdf_list[i]['url'] = pdf_list[i]['url'].replaceAll(backUrl, "");
            }
          
            let obj = {
                address: values?.address,
                pdf_list: JSON.stringify(pdf_list),
                zip_code: values?.zip_code,
                address_detail: values?.address_detail,
                deposit: parseInt(values?.deposit) * 10000,
                monthly: parseInt(values?.monthly) * 10000,
                start_date: values?.start_date,
                end_date: values?.end_date,
                pay_day: values?.pay_day,
                is_user: true,
                document_src: JSON.stringify(img_list)
            }
            if (params?.pk) {
                obj['pk'] = params?.pk;
            }
            const { data: response } = await axios.post(`/api/${params?.pk ? 'update' : 'add'}contract`, obj);
            if (response?.result > 0) {
                if (!params?.pk) {
                    toast.success('등록되었습니다. 다음 절차를 진행해 주세요.');
                    navigate(`/addcontract/${response?.data?.result_pk}`)
                } else {
                    setActiveStep(1);
                }
            } else {
                toast.error(response?.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err?.message)
        }
    }
    const getCheckContractAppr = async () => {
        const { data: response } = await axios.get(`/api/item?table=contract&pk=${params?.pk}`);
        let obj = response?.data;
        let img_list = JSON.parse(obj['document_src']);
        for (var i = 0; i < img_list.length; i++) {
            img_list[i]['url'] = backUrl + img_list[i]['url'];
        }
        setImgList(img_list);
        let pdf_list = JSON.parse(obj['pdf_list']);
        for (var i = 0; i < pdf_list.length; i++) {
            pdf_list[i]['url'] = backUrl + pdf_list[i]['url'];
        }
        setPdfList(pdf_list);
        setValues({ ...values, landlord_appr: obj?.landlord_appr, lessee_appr: obj?.lessee_appr });
        if (obj['landlord_appr'] == 1 && obj['lessee_appr'] == 1) {
            setIsComplete(true);
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
                        isConfirm();
                        setLandlordList([]);
                        setLesseeList([]);
                    }

                })
            } else {
                isConfirm();
                setLandlordList([]);
                setLesseeList([]);
                getCheckContractAppr();
            }

        }
        if (activeStep == 1) {
            setActiveStep(activeStep + 1);
            setLandlordList([]);
            setLesseeList([]);
            getCheckContractAppr();
        }
        if (activeStep == 2) {
            if (isComplete) {
                setActiveStep(activeStep + 1);
                setLandlordList([]);
                setLesseeList([]);
            }
        }
        if (activeStep == 3) {
            navigate('/history/contract');
        }
    }
    const onPrevButton = () => {
        setActiveStep(activeStep - 1);
        setLandlordList([]);
        setLesseeList([]);
        if (activeStep == 2 || activeStep == 3) {
            getCheckContractAppr();
        }
    }
    const onSelectLandlord = async (obj) => {
        setValues({ ...values, ['landlord']: obj, ['landlord_search']: obj?.name });
        setLandlordList([]);
    }
    const onSelectLessee = async (obj) => {
        setValues({ ...values, ['lessee']: obj, ['lessee_search']: obj?.name });
        setLesseeList([]);
    }
    const canNextButton = (num) => {
        if (num == 0) {
            return true;
        }
        if (num == 1) {
            return true;

        }
        if (num == 2) {
            if (isComplete) {
                return true;
            }
        }
        if (num == 3) {
            return true;
        }
        return false;
    }
    const addContract = async () => {

    }
   
    const addFile = (e) => {
        let { id, files } = e.target;
        if (e.target.files[0]) {
            let img_list = [...imgList];
            img_list.push({
                url: URL.createObjectURL(e.target.files[0]),
                content: e.target.files[0]
            })
            setImgList(img_list);
        }
        $(`#${id}`).val("");
    };
    const addPdf = (e) => {
        let { id, files } = e.target;
        if (e.target.files[0]) {
            let pdf_list = [...pdfList];
            pdf_list.push({
                url: URL.createObjectURL(e.target.files[0]),
                content: e.target.files[0]
            })
            setPdfList(pdf_list);
        }
        $(`#${id}`).val("");
    };


    return (
        <>
            <Wrappers>
                {loading ?
                    <>
                        <Loading />
                    </>
                    :
                    <>
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
                                            <InputComponent
                                                label={'계약주소* '}
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
                                            onChange={(e) => handleChange(e, 'address_detail')}
                                            value={values.address_detail}
                                        />
                                        {/* <FormControl sx={{ minWidth: 120, margin: '8px 1px' }} size="small">
                                            <InputLabel id="demo-select-small">전/월세</InputLabel>
                                            <CustomSelect
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                value={values.pay_type}
                                                label="전/월세"

                                                onChange={(e) => handleChange(e.target.value, 'pay_type')}
                                            >
                                                <MenuItem value={0}>월세</MenuItem>
                                                <MenuItem value={1}>전세</MenuItem>
                                            </CustomSelect>
                                        </FormControl> */}
                                        <InputComponent
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
                                        <InputComponent
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
                                        <InputComponent
                                            label={'계약 시작일'}
                                            input_type={{
                                                placeholder: '',
                                                type: 'date'
                                            }}
                                            class_name='start_date'
                                            is_divider={true}
                                            onChange={(e) => handleChange(e, 'start_date')}
                                            value={values.start_date}
                                        />
                                        <InputComponent
                                            label={'계약 종료일'}
                                            input_type={{
                                                placeholder: '',
                                                type: 'date'
                                            }}
                                            class_name='end_date'
                                            is_divider={true}
                                            onChange={(e) => handleChange(e, 'end_date')}
                                            value={values.end_date}
                                        />
                                        <FormControl sx={{ minWidth: 120, margin: '8px 1px' }} size="small">
                                            <InputLabel id="demo-select-small">월세 납부일</InputLabel>
                                            <CustomSelect
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                value={values.pay_day}
                                                label="월세 납부일"
                                                onChange={(e) => handleChange(e.target.value, 'pay_day')}
                                            >
                                                {range(1, 28).map((item, idx) => {
                                                    return <MenuItem value={item}>{item} 일</MenuItem>
                                                })}
                                            </CustomSelect>
                                        </FormControl>
                                        <CategoryName style={{ width: '100%', maxWidth: '700px', marginBottom: '0.5rem', fontWeight: 'bold' }}>이미지업로드</CategoryName>
                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {imgList.map((item, idx) => (
                                                <>
                                                    <div style={{
                                                        margin: 'auto 0.25rem',
                                                        position: 'relative'
                                                    }}
                                                        onMouseOver={() => {
                                                            let img_list = [...imgList];
                                                            img_list[idx]['hover'] = true;
                                                            setImgList([...img_list]);
                                                        }}
                                                        onMouseLeave={() => {
                                                            let img_list = [...imgList];
                                                            img_list[idx]['hover'] = false;
                                                            setImgList([...img_list]);
                                                        }}
                                                    >
                                                        {item.hover ?
                                                            <>
                                                                <Icon icon="material-symbols:cancel" style={{
                                                                    position: 'absolute',
                                                                    top: '-0.5rem',
                                                                    right: '-0.5rem',
                                                                    color: theme.color.red,
                                                                    fontSize: theme.size.font2,
                                                                    cursor: 'pointer'
                                                                }}
                                                                    onClick={() => {
                                                                        let img_list = [...imgList];
                                                                        img_list.splice(idx, 1);
                                                                        setImgList([...img_list]);
                                                                    }}
                                                                />
                                                            </>
                                                            :
                                                            <>
                                                            </>}
                                                        <img src={item?.url} alt="#"
                                                            style={{
                                                                height: '8rem', width: 'auto'
                                                            }} />
                                                    </div>

                                                </>
                                            ))}
                                        </div>
                                        <div style={{ margin: '8px auto 0px 0px' }} for={`document_src`}>
                                            <label style={{ ...colorButtonStyle, cursor: 'pointer', padding: '8px 16px', borderRadius: '4px' }} for={`document_src`}>
                                                업로드
                                            </label>
                                        </div>
                                        <div>
                                            <input type="file" id={`document_src`} onChange={addFile} style={{ display: 'none' }} />
                                        </div>
                                        <CategoryName style={{ width: '100%', maxWidth: '700px', marginBottom: '0.5rem', fontWeight: 'bold' }}>PDF업로드</CategoryName>
                                        <div style={{ display: 'flex', flexDirection:'column' }}>
                                            {pdfList.map((item, idx) => (
                                                <>
                                                    <div style={{
                                                        margin: 'auto 0.25rem',
                                                        position: 'relative',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        cursor: 'pointer',
                                                        color: theme.color.background1,
                                                    }}
                                                        onMouseOver={() => {
                                                            let pdf_list = [...pdfList];
                                                            pdf_list[idx]['hover'] = true;
                                                            setPdfList([...pdf_list]);
                                                        }}
                                                        onMouseLeave={() => {
                                                            let pdf_list = [...pdfList];
                                                            pdf_list[idx]['hover'] = false;
                                                            setPdfList([...pdf_list]);
                                                        }}
                                                    >
                                                        <a href={item?.url} download={item?.content?.name || item?.name} style={{ textDecoration: 'none', color: theme.color.background1 }}>
                                                            {item?.content?.name || item?.name}
                                                        </a>
                                                        {item.hover ?
                                                            <>
                                                                <Icon icon="material-symbols:cancel" style={{
                                                                    position: 'absolute',
                                                                    top: '-0.5rem',
                                                                    left: '-0.5rem',
                                                                    color: theme.color.red,
                                                                    fontSize: theme.size.font2,
                                                                    cursor: 'pointer'
                                                                }}
                                                                    onClick={() => {
                                                                        let pdf_list = [...pdfList];
                                                                        pdf_list.splice(idx, 1);
                                                                        setPdfList([...pdf_list]);
                                                                    }}
                                                                />
                                                            </>
                                                            :
                                                            <>
                                                            </>}
                                                    </div>

                                                </>
                                            ))}
                                        </div>
                                        <div style={{ margin: '8px auto 0px 0px' }} for={`pdf_src`}>
                                            <label style={{ ...colorButtonStyle, cursor: 'pointer', padding: '8px 16px', borderRadius: '4px' }} for={`pdf_src`}>
                                                업로드
                                            </label>
                                        </div>
                                        <div>
                                            <input type="file" id={`pdf_src`} onChange={addPdf} style={{ display: 'none' }} />
                                        </div>
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
                                        <InputComponent
                                            label={'임대인'}
                                            input_type={{
                                                placeholder: '임대인 이름, 주민등록번호, 전화번호 검색가능.',
                                                disabled: values.landlord?.name
                                            }}
                                            class_name='landlord_search'
                                            is_divider={true}
                                            onChange={(e) => handleChange(e, 'landlord_search')}
                                            value={values.landlord_search}
                                            autoCompleteList={(values.landlord?.name ? [] : landlordList)}
                                            onAutoCompleteClick={onSelectLandlord}
                                            icon_label={!isComplete ? (values.landlord?.name ? <Icon icon="zondicons:reload" /> : '') : ''}
                                            onClickIcon={() => {
                                                if (!isComplete) {
                                                    Swal.fire({
                                                        title: '임대인 초기화 하시겠습니까?',
                                                        showCancelButton: true,
                                                        confirmButtonText: '확인',
                                                        cancelButtonText: '취소'
                                                    }).then(async (result) => {
                                                        if (result.isConfirmed) {
                                                            const { data: response } = await axios.post('/api/onresetcontractuser', {
                                                                contract_pk: params?.pk,
                                                                request_level: 5
                                                            })
                                                            if (response?.result > 0) {
                                                                setValues({ ...values, ['landlord']: {}, ['landlord_search']: '' })
                                                                $('.landlord_search').focus();
                                                                getContract(userData);
                                                            } else {
                                                                toast.error(response?.message);
                                                            }
                                                        }
                                                        return;
                                                    })
                                                }
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
                                                        <Button sx={colorButtonStyle} onClick={() => {
                                                            if (values?.landlord_pk > 0) {
                                                            } else {
                                                                requestContractAppr(5, values.landlord?.pk)
                                                            }
                                                        }}
                                                            startIcon={<Icon icon="material-symbols:approval-delegation" />}
                                                        >{values?.landlord_appr == 1 ? '동의완료' : (values?.landlord_pk > 0 ? '동의 기다리는 중...' : '동의구하기')}</Button>
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
                                        <InputComponent
                                            label={'임차인'}
                                            input_type={{
                                                placeholder: '임차인 이름, 주민등록번호, 전화번호 검색가능.',
                                                disabled: values.lessee?.name
                                            }}
                                            class_name='lessee_search'
                                            is_divider={true}
                                            onChange={(e) => handleChange(e, 'lessee_search')}
                                            value={values.lessee_search}
                                            autoCompleteList={(values.lessee?.name ? [] : lesseeList)}
                                            onAutoCompleteClick={onSelectLessee}
                                            icon_label={!isComplete ? (values.landlord?.name ? <Icon icon="zondicons:reload" /> : '') : ''}
                                            onClickIcon={() => {
                                                if (!isComplete) {
                                                    Swal.fire({
                                                        title: '임차인 초기화 하시겠습니까?',
                                                        showCancelButton: true,
                                                        confirmButtonText: '확인',
                                                        cancelButtonText: '취소'
                                                    }).then(async (result) => {
                                                        if (result.isConfirmed) {
                                                            const { data: response } = await axios.post('/api/onresetcontractuser', {
                                                                contract_pk: params?.pk,
                                                                request_level: 0
                                                            })
                                                            if (response?.result > 0) {
                                                                setValues({ ...values, ['lessee']: {}, ['lessee_search']: '' })
                                                                $('.lessee_search').focus();
                                                                getContract(userData);
                                                            } else {
                                                                toast.error(response?.message);
                                                            }
                                                        }
                                                        return;
                                                    })
                                                }
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
                                                        <Button sx={colorButtonStyle} onClick={() => {
                                                            if (values?.lessee_pk > 0) {
                                                            } else {
                                                                requestContractAppr(0, values.lessee?.pk)
                                                            }
                                                        }}
                                                            startIcon={<Icon icon="material-symbols:approval-delegation" />}
                                                        >{values?.lessee_appr == 1 ? '동의완료' : (values?.lessee_pk > 0 ? '동의 기다리는 중...' : '동의구하기')}</Button>
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
                                        style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '250px', alignItems: 'center' }}
                                    >
                                        <div style={{ margin: 'auto auto 8px auto' }}>
                                            <Icon icon="line-md:confirm-circle" style={{ fontSize: '52px', color: theme.color.background1 }} />
                                        </div>
                                        <div style={{ margin: '8px auto auto auto' }}>
                                            계약이 성사되었습니다.<br />
                                        </div>
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
                    </>}
            </Wrappers>
        </>
    )
}
export default AddContract;