//카드변경

import { CustomSelect, HalfTitle, InputComponent, RowContent, Wrappers, colorButtonStyle, twoOfThreeButtonStyle } from "../../../components/elements/UserContentTemplete";
// ** React Imports
import { useState } from 'react'




import { useEffect } from "react";
import axios from "axios";

import { toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getLocalStorage } from "../../../functions/LocalStorage";

import Loading from "../../../components/Loading";

import PayItemCard from "../../../components/PayItemCard";
import styled from "styled-components";
import { motion } from "framer-motion";
import theme from "../../../styles/theme";
import { commarNumber, getKoPayCategoryByNum, getMoneyByCardPercent } from "../../../functions/utils";
import { Button, FormControl, InputLabel, MenuItem } from "@mui/material";
import Swal from "sweetalert2";

const Container = styled.div`
display: flex; 
padding: 32px 0;
width: 100%;
height: 153px;
@media screen and (max-width:550px) { 
    flex-direction:column;
    height:auto;
}
`
const ContentContainer = styled.div`
display:flex;
width:60%;
@media screen and (max-width:550px) { 
    width:100%;
    border-right:none;
    padding-bottom:16px;
}
`
const PriceContainer = styled.div`
display: flex;
flex-direction: column;
width:40%;
height:120px;
@media screen and (max-width:550px) {  
    width:100%;
    margin-left:auto;
}
`
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
const ChangePayStatus = () => {

    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [pay, setPay] = useState({});
    const [userData, setUserData] = useState({})
    const [setting, setSetting] = useState({});
    const [payStatus, setPayStatus] = useState(undefined);
    const [payType, setPayType] = useState(0);
    const [price, setPrice] = useState(0);
    useEffect(() => {
        getPay();
    }, [])
    useEffect(() => {
        if (pay?.pay_category == 1 || pay?.pay_category == 2) {
            setPrice(pay?.price)
        } else {
            setPrice(getMoneyByCardPercent(pay?.price, setting?.card_percent))
        }
    }, [pay])
    const getPay = async () => {
        setLoading(true);
        if (!location.state) {
            navigate('/home')
            return;
        }
        let user_data = getLocalStorage('auth');
        setUserData(user_data);
        const { data: response } = await axios.get(`/api/item?table=pay&pk=${location?.state}`);
        const { data: res_setting } = await axios.get(`/api/item?table=setting&pk=1`);
        setSetting(res_setting?.data);
        if (user_data?.user_level != 10 || response?.data?.realtor_pk != user_data?.pk) {
            toast.error("잘못된 접근입니다.");
            navigate('/home')
            return;
        }
        let pay = response?.data;
        setPay(pay)
        setPayStatus(response?.data?.status)
        setLoading(false);
    }
    const onChangePayStatus = async () => {
        Swal.fire({
            title: '저장 하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data: response } = await axios.post(`/api/changepaystatus`, {
                    pay_pk: pay?.pk,
                    status: payStatus,
                    type: (pay?.pay_category == 1 || pay?.pay_category == 2) ? 1 : 0
                })
                if (response?.result > 0) {
                    toast.success("성공적으로 저장 되었습니다.");
                    navigate(-1);
                } else {
                    toast.error(response?.message);
                }
            }
        })
    }

    return (
        <>
            <Wrappers className="wrapper" style={{ minHeight: '100vh', margin: '0 auto', background: "#fff" }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '250px', margin: '0 auto 2rem auto', paddingTop: '4rem' }}
                >
                    {loading ?
                        <>
                            <Loading />
                        </>
                        :
                        <>
                            <Container style={{ paddingBottom: '16px' }}>
                                <ContentContainer style={{ flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', width: 'auto', rowGap: '0.5rem', fontSize: theme.size.font5 }}>
                                        <RowContent>
                                            <div style={{ width: '25%' }}>{commarNumber(pay?.contract_pk)}</div>
                                        </RowContent>
                                        <RowContent style={{ borderBottom: `1px solid #ccc`, paddingBottom: '1rem' }}>
                                            <div style={{ width: '25%', color: theme.color.font5 }}>종류</div>
                                            <div style={{ width: '25%' }}>{getKoPayCategoryByNum(pay?.pay_category)}</div>
                                            <div style={{ width: '25%', color: theme.color.font5 }}>결제금액</div>
                                            <div style={{ width: '25%' }}>{`${commarNumber(price)}원`}</div>
                                        </RowContent>
                                        <div style={{ fontSize: theme.size.font5, fontWeight: '400', color: theme.color.font5 }}>납부상태</div>
                                        <CustomSelect
                                            labelId="demo-select-small"
                                            id="demo-select-small"
                                            value={payStatus}
                                            label="납부상태"
                                            onChange={(e) => setPayStatus(e.target.value)}
                                        >
                                            <MenuItem value={1}>납부함 {(pay?.pay_category == 1 || pay?.pay_category == 2) && '(현금)'}</MenuItem>
                                            <MenuItem value={0}>납부안함</MenuItem>
                                        </CustomSelect>
                                    </div>
                                </ContentContainer>
                            </Container>
                            <Button sx={twoOfThreeButtonStyle} onClick={onChangePayStatus}>{'변경완료'}</Button>
                        </>}

                </motion.div>

            </Wrappers>
        </>
    )
}
export default ChangePayStatus;