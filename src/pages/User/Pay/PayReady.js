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
import PayItemCard from "../../../components/PayItemCard";

const PayReady = () => {
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
        if (params?.contract_pk) {
            getContract(user_data, true)
        }
    }, [])
    const getContract = async (user_data, is_render) => {
        try {
            setLoading(true);
            const { data: response } = await axios.get(`/api/item?table=contract&pk=${params?.contract_pk}`);
            let obj = response?.data;
            if (user_data?.pk != obj?.lessee_pk && user_data?.pk != obj?.landlord_pk) {
                toast.error("잘못된 접근입니다.")
                navigate(-1);
            }
            if (obj['landlord_appr'] != 1 || obj['lessee_appr'] != 1) {
                toast.error("아직 완료되지 않은 계약입니다.")
                navigate(-1);
            }
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
                            <PayItemCard item={values} />
                            </motion.div>
                        </ContentWrappers>
                    </>}

            </Wrappers>
        </>
    )
}
export default PayReady;