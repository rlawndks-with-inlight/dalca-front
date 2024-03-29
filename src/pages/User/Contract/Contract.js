//계약생성

import { colorButtonStyle, ContentWrappers, InputComponent, postCodeStyle, ShadowContainer, smallButtonStyle, Wrappers, twoOfThreeButtonStyle } from "../../../components/elements/UserContentTemplete";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useEffect, useState } from "react";
import { getLocalStorage } from "../../../functions/LocalStorage";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import theme from "../../../styles/theme";
import { Button } from "@mui/material";
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
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { CategoryName } from "../../../components/elements/AuthContentTemplete";

const GetContent = (props) => {
    const { title, content } = props;

    return (
        <>
            <InputComponent
                top_label={title}
                input_type={{
                    placeholder: '',
                    disabled: true,
                }}
                value={content}
            />

        </>
    )
}
const Contract = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [imgUrlObj, setImgUrlObj] = useState({});
    const [imgContentObj, setImgContentObj] = useState({});
    const [isSeePostCode, setIsSeePostCode] = useState(false);
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);
    const [imgList, setImgList] = useState([]);
    const [pdfList, setPdfList] = useState([]);
    const [wantSeeImg, setWantSeeImg] = useState("");
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
        brokerage_fee: 0,
        monthly: 0,
        address: '',
        address_detail: '',
        zip_code: '',
        start_date: '',
        end_date: '',
        pay_day: 1,
    })

    useEffect(() => {
        isAdmin();
    }, [])
    async function isAdmin() {
        const { data: response } = await axios.get('/api/auth', {
            headers: {
                'Content-type': 'application/json',
            }
        },
            { withCredentials: true });
        if (response.pk > 0) {
            setUserData(response)
            await localStorage.setItem('auth', JSON.stringify(response))
            if (params?.pk) {
                getContract(response, true)
            }
        } else {
            await localStorage.removeItem('auth')
            toast.error('로그인을 해주세요.');
            navigate('/', {
                state: {
                    redirect_url: location.pathname
                }
            })
        }
    }
    const getContract = async (user_data, is_render) => {
        try {
            setLoading(true);
            const { data: response } = await axios.get(`/api/item?table=contract&pk=${params?.pk}`);
            let obj = response?.data;
            if (user_data?.pk != obj?.lessee_pk && user_data?.pk != obj?.landlord_pk) {
                toast.error("잘못된 접근입니다.")
                navigate('/home');
            }
            obj['monthly'] = obj['monthly'] / 10000;
            obj['deposit'] = obj['deposit'] / 10000;
            obj['down_payment'] = obj['down_payment'] / 10000;
            obj['brokerage_fee'] = obj['brokerage_fee'] / 10000;

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
    const settings = {
        infinite: false,
        speed: 500,
        autoplay: false,
        autoplaySpeed: 2500,
        slidesToShow: 3,
        slidesToScroll: 1,
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
                        <ContentWrappers style={{ marginTop: '1rem' }}>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '250px' }}
                            >
                                <GetContent
                                    title={'계약주소'}
                                    content={values.address}
                                />
                                <GetContent
                                    title={'상세주소'}
                                    content={values.address_detail}
                                />
                                <GetContent
                                    title={'보증금'}
                                    content={values.deposit + ' 만원'}
                                />
                                <GetContent
                                    title={'계약금'}
                                    content={values.down_payment + ' 만원'}
                                />
                                <GetContent
                                    title={'월세'}
                                    content={values.monthly + ' 만원'}
                                />
                                <GetContent
                                    title={'중개수수료'}
                                    content={values.brokerage_fee + ' 만원'}
                                />
                                <GetContent
                                    title={'계약 시작일'}
                                    content={values.start_date}
                                />
                                <GetContent
                                    title={'계약 종료일'}
                                    content={values.end_date}
                                />
                                <GetContent
                                    title={'월세 납부일'}
                                    content={values.pay_day}
                                />
                                <GetContent
                                    title={'임대인'}
                                    content={values.landlord?.name}
                                />
                                <GetContent
                                    title={'임대인 전화번호'}
                                    content={values.landlord?.phone}
                                />
                                <GetContent
                                    title={'임차인'}
                                    content={values.lessee?.name}
                                />
                                <GetContent
                                    title={'임차인 전화번호'}
                                    content={values.lessee?.phone}
                                />
                                <GetContent
                                    title={'공인중개사'}
                                    content={values.realtor?.name}
                                />
                                <GetContent
                                    title={'공인중개사 전화번호'}
                                    content={values.realtor?.phone}
                                />
                                {imgList.length > 0 ?
                                    <>
                                        <CategoryName style={{ width: '100%', maxWidth: '1000px', marginBottom: '0.5rem', fontWeight: 'bold' }}>계약서이미지</CategoryName>
                                        <div style={{ display: 'flex', overflowX: 'auto' }}>
                                            {imgList.map((item, idx) => (
                                                <>
                                                    <div style={{
                                                        margin: 'auto 0',
                                                        position: 'relative'
                                                    }}

                                                    >
                                                        <img src={item?.url} alt="#"
                                                            style={{
                                                                height: '8rem', width: 'auto',
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={() => {
                                                                setWantSeeImg(item?.url)
                                                            }}
                                                        />
                                                    </div>

                                                </>
                                            ))}
                                        </div>
                                    </>
                                    :
                                    <>
                                    </>}

                                {pdfList.length > 0 ?
                                    <>
                                        <CategoryName style={{ width: '100%', maxWidth: '1000px', marginBottom: '0.5rem', fontWeight: 'bold' }}>PDF 파일</CategoryName>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                                                    >
                                                        <a href={item?.url} download={item?.content?.name || item?.name} style={{ textDecoration: 'none', color: theme.color.background1 }}>
                                                            {item?.content?.name || item?.name}
                                                        </a>
                                                    </div>

                                                </>
                                            ))}
                                        </div>
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
                                        sx={{ ...twoOfThreeButtonStyle, cursor: `${values[`${getEnLevelByNum(userData?.user_level)}_appr`] == 1 ? '' : 'pointer'}` }}
                                        onClick={() => {
                                            if (values[`${getEnLevelByNum(userData?.user_level)}_appr`] != 1) {
                                                confirmContractAppr();
                                            }
                                        }}
                                        disabled={values[`${getEnLevelByNum(userData?.user_level)}_appr`] == 1 ? true : false}
                                    >{values[`${getEnLevelByNum(userData?.user_level)}_appr`] == 1 ? '수락완료' : `${getKoLevelByNum(userData?.user_level)} 수락하기`}</Button>
                                </div>
                            </motion.div>
                            {wantSeeImg ?
                                <>
                                    <Modal onClickXbutton={() => { setWantSeeImg("") }}>
                                        <img src={wantSeeImg} style={{ width: '80%', maxHeight: '90vh' }} />
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

export default Contract;