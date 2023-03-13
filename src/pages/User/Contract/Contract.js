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
import Loading from "../../../components/Loading";
import { getEnLevelByNum, getKoLevelByNum } from "../../../functions/utils";

const Contract = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [imgUrlObj, setImgUrlObj] = useState({});
    const [imgContentObj, setImgContentObj] = useState({});
    const [isSeePostCode, setIsSeePostCode] = useState(false);
    const [userData, setUserData] = useState({});
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
        zip_code: ''
    })

    useEffect(() => {
        let user_data = getLocalStorage('auth');
        if (!user_data?.pk) {
            toast.error("잘못된 접근입니다.");
            setTimeout(() => {
                navigate(-1);
            }, 1000);
        }
        setUserData(user_data);
        if (params?.pk) {
            getContract(user_data, true)
        }
    }, [])
    const getContract = async (user_data, is_render) => {
        try {
            setLoading(true);
            const { data: response } = await axios.get(`/api/item?table=contract&pk=${params?.pk}`);
            let obj = response?.data;
            if (user_data?.pk != obj?.lessee_pk && user_data?.pk != obj?.landlord_pk) {
                toast.error("잘못된 접근입니다.")
                navigate(-1);
            }
            obj['monthly'] = obj['monthly'] / 10000;
            obj['deposit'] = obj['deposit'] / 10000;
           
            if (obj['document_src']) {
                setImgUrlObj({ ...imgUrlObj, ['document_src']: backUrl + obj['document_src'] })
            }
            if (obj['landlord_pk'] > 0) {
                const { data: response_landlord } = await axios.get(`/api/item?table=user&pk=${obj['landlord_pk']}`);
                obj['landlord'] = response_landlord?.data;
            } else {
                obj['landlord'] = {};
            }
            if (obj['lessee_pk'] > 0) {
                const { data: response_lessee } = await axios.get(`/api/item?table=user&pk=${obj['lessee_pk']}`);
                obj['lessee'] = response_lessee?.data;
            } else {
                obj['lessee'] = {};
            }
            if (obj['realtor_pk'] > 0) {
                const { data: response_lessee } = await axios.get(`/api/item?table=user&pk=${obj['realtor_pk']}`);
                obj['realtor'] = response_lessee?.data;
            } else {
                obj['realtor'] = {};
            }
            setValues({ ...values, ...obj });
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    }
    const confirmContractAppr = async () => {
        Swal.fire({
            title: '정말 수락 하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let obj = {};
                obj['contract_pk'] = params?.pk;
                const { data: response } = await axios.post(`/api/confirmcontractappr`, obj);
                if (response?.result > 0) {
                    toast.success('성공적으로 수락 되었습니다.');
                    getContract(userData);
                } else {
                    toast.error(response?.message);
                }
            }
        })
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
                        <ContentWrappers style={{ marginTop: '1rem' }}>

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
                                        value={values.address}
                                    />
                                </div>
                                <InputComponet
                                    label={'상세주소'}
                                    input_type={{
                                        placeholder: '',
                                        disabled: "true"
                                    }}
                                    class_name='address_detail'
                                    is_divider={true}
                                    value={values.address_detail}
                                />
                                <InputComponet
                                    label={'전/월세'}
                                    input_type={{
                                        placeholder: '',
                                        disabled: "true"
                                    }}
                                    class_name='pay_type'
                                    is_divider={true}
                                    value={values.pay_type == 0 ? '월세' : '전세'}
                                />
                                <InputComponet
                                    label={'보증금'}
                                    input_type={{
                                        placeholder: '숫자를 입력해 주세요.',
                                        disabled: "true"
                                    }}
                                    class_name='deposit'
                                    is_divider={true}
                                    value={values.deposit}
                                    icon_label={<div style={{ fontSize: theme.size.font4 }}>만원</div>}
                                />
                                <InputComponet
                                    label={'월세'}
                                    input_type={{
                                        placeholder: '숫자를 입력해 주세요.',
                                        disabled: "true"
                                    }}
                                    class_name='monthly'
                                    is_divider={true}
                                    value={values.monthly}
                                    icon_label={<div style={{ fontSize: theme.size.font4 }}>만원</div>}
                                />
                                <InputComponet
                                    label={'임대인'}
                                    input_type={{
                                        placeholder: '숫자를 입력해 주세요.',
                                        disabled: "true"
                                    }}
                                    class_name='landlord'
                                    is_divider={true}
                                    value={values.landlord?.name}
                                />
                                <InputComponet
                                    label={'임차인'}
                                    input_type={{
                                        placeholder: '숫자를 입력해 주세요.',
                                        disabled: "true"
                                    }}
                                    class_name='lessee'
                                    is_divider={true}
                                    value={values.lessee?.name}
                                />
                                <InputComponet
                                    label={'공인중개사'}
                                    input_type={{
                                        placeholder: '숫자를 입력해 주세요.',
                                        disabled: "true"
                                    }}
                                    class_name='realtor'
                                    is_divider={true}
                                    value={values.realtor?.name}
                                />
                                {imgUrlObj[`document_src`] ?
                                    <>
                                        <ImageContainer for={`document_src`} style={{ margin: '0', width: '100%' }}>
                                            <img src={imgUrlObj[`document_src`]} alt="#"
                                                style={{
                                                    width: 'auto', maxHeight: '8rem',
                                                    maxWidth: '80%',
                                                    margin: 'auto'
                                                }} />
                                        </ImageContainer>
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
                                    <div />
                                    <Button
                                        sx={{ ...colorButtonStyle, cursor: `${values[`${getEnLevelByNum(userData?.user_level)}_appr`] == 1 ? '' : 'pointer'}` }}
                                        startIcon={values[`${getEnLevelByNum(userData?.user_level)}_appr`] == 1 ? <Icon icon="line-md:confirm" /> : <Icon icon="material-symbols:approval-delegation" />}
                                        onClick={() => {
                                            if (values[`${getEnLevelByNum(userData?.user_level)}_appr`] != 1) {
                                                confirmContractAppr();
                                            }
                                        }}
                                    >{values[`${getEnLevelByNum(userData?.user_level)}_appr`] == 1 ? '수락완료' : `${getKoLevelByNum(userData?.user_level)} 수락`}</Button>
                                </div>
                            </motion.div>
                        </ContentWrappers>
                    </>}

            </Wrappers>
        </>
    )
}
export default Contract;