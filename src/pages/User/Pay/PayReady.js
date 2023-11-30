//계약생성

import { colorButtonStyle, ContentWrappers, InputComponent, postCodeStyle, smallButtonStyle, Wrappers } from "../../../components/elements/UserContentTemplete";
import { useEffect, useState } from "react";
import { getLocalStorage } from "../../../functions/LocalStorage";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { backUrl } from "../../../data/Data";
import Loading from "../../../components/Loading";
import PayItemCard from "../../../components/PayItemCard";

const PayReady = () => {
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();

    const [imgUrlObj, setImgUrlObj] = useState({});
    const [imgContentObj, setImgContentObj] = useState({});
    const [isSeePostCode, setIsSeePostCode] = useState(false);
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);
    const [setting, setSetting] = useState({});
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
        down_payment: 0,
        monthly: 0,
        address: '',
        address_detail: '',
        zip_code: ''
    })
    const [payList, setPayList] = useState([]);
    useEffect(() => {
        setLoading(true);
        let user_data = getLocalStorage('auth');
        if (!user_data?.pk) {
            toast.error("잘못된 접근입니다.");
            setTimeout(() => {
                navigate(-1);
            }, 1000);
        }
        setUserData(user_data);
        if (params?.pay_pk) {
            getPayInfo(user_data, true)
        } else {
            if (location.state?.pay_list) {
                if (location.state?.pay_list.length > 0) {
                    setPayList(location.state?.pay_list)
                    setValues({ ...values, ['status']: 0 })
                    getSetting();
                    setLoading(false);
                } else {
                    toast.error("선택한 결제중에 유효한 결제가 없습니다.");
                    setTimeout(() => {
                        navigate(-1);
                    }, 1000);
                }
            } else {
                toast.error("잘못된 접근입니다.");
                setTimeout(() => {
                    navigate(-1);
                }, 1000);
            }
        }
    }, [location])
    useEffect(() => {
        if (values?.realtor_pk > 0) {
            setLoading(false);
        }
    }, [values])
    const getSetting = async () => {
        const { data: res_setting } = await axios.get(`/api/item?table=setting&pk=1`);
        setSetting(res_setting?.data);
    }
    const getPayInfo = async (user_data, is_render) => {
        try {
            getSetting();
            const { data: response } = await axios.get(`/api/item?table=pay&pk=${params?.pay_pk}`);
            let obj = response?.data;
            if (user_data?.pk != obj?.lessee_pk && user_data?.pk != obj?.landlord_pk) {
                toast.error("잘못된 접근입니다.")
                navigate(-1);
            }
            if (obj['document_src']) {
                setImgUrlObj({ ...imgUrlObj, ['document_src']: backUrl + obj['document_src'] })
            }
            // if (obj['landlord_pk'] > 0) {
            //     const { data: response_landlord } = await axios.get(`/api/item?table=user&pk=${obj['landlord_pk']}`);
            //     obj['landlord'] = response_landlord?.data;
            // } else {
            //     obj['landlord'] = {};
            // }
            // if (obj['lessee_pk'] > 0) {
            //     const { data: response_lessee } = await axios.get(`/api/item?table=user&pk=${obj['lessee_pk']}`);
            //     obj['lessee'] = response_lessee?.data;
            // } else {
            //     obj['lessee'] = {};
            // }
            // if (obj['realtor_pk'] > 0) {
            //     const { data: response_lessee } = await axios.get(`/api/item?table=user&pk=${obj['realtor_pk']}`);
            //     obj['realtor'] = response_lessee?.data;
            // } else {
            //     obj['realtor'] = {};
            // }
            setValues({ ...values, ...obj });
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
                                <PayItemCard item={values} user={userData} setting={setting} payList={payList} />
                            </motion.div>
                        </ContentWrappers>
                    </>}

            </Wrappers>
        </>
    )
}
export default PayReady;