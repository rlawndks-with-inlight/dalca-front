//계약생성

import { colorButtonStyle, ContentWrappers, CustomSelect, InputComponent, postCodeStyle, smallButtonStyle, Wrappers } from "../../../components/elements/UserContentTemplete";
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
        pay_type: 0,
        deposit: 0,
        monthly: 0,
        address: '',
        address_detail: '',
        start_date: returnMoment().substring(0, 10),
        end_date: returnMoment().substring(0, 10),
        pay_day: 1,
    })
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
        if (obj['document_src']) {
            setImgUrlObj({ ...imgUrlObj, ['document_src']: backUrl + obj['document_src'] })
        }

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
            let response_img = undefined;
            if (imgContentObj?.document_src && imgUrlObj?.document_src != -1) {
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
                start_date: values?.start_date,
                end_date: values?.end_date,
                pay_day: values?.pay_day,

            }
            if (response_img) {
                obj['document_src'] = response_img?.filename;
            }
            if (imgUrlObj?.document_src == -1) {
                obj['document_src'] = -1;
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
                                        <FormControl sx={{ minWidth: 120, margin: '8px 1px' }} size="small">
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
                                        </FormControl>
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