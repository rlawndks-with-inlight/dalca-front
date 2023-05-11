//카드변경

import { CustomSelect, HalfTitle, Wrappers, colorButtonStyle } from "../../../components/elements/UserContentTemplete";
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
height: 120px;
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
const ChangePayStatus = () => {

    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [pay, setPay] = useState({});
    const [userData, setUserData] = useState({})
    const [setting, setSetting] = useState({});
    const [payStatus, setPayStatus] = useState(undefined);
    useEffect(() => {
        getPay();
    }, [])

    const getPay = async () => {
        setLoading(true);
        if (!location.state) {
            navigate('/home')
            return;
        }
        let user_data = getLocalStorage('auth');
        setUserData(user_data);
        const { data: response } = await axios.get(`/api/item?table=pay&pk=${location?.state}`);
        console.log(response)
        const { data: res_setting } = await axios.get(`/api/item?table=setting&pk=1`);
        setSetting(res_setting?.data);
        console.log(user_data)
        if (user_data?.user_level != 10 || response?.data?.realtor_pk != user_data?.pk) {
            toast.error("잘못된 접근입니다.");
            navigate('/home')
            return;
        }
        setPay(response?.data)
        setPayStatus(response?.data?.status)
        setLoading(false);
    }
    const onChangePayStatus =  async () =>{
        Swal.fire({
            title: '저장 하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const {data:response} = await axios.post(`/api/changepaystatus`,{
                    pay_pk:pay?.pk,
                    status:payStatus
                })
                if(response?.result>0){
                    toast.success("성공적으로 저장 되었습니다.");
                    navigate(-1);
                }else{
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
                    style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '250px', margin: '2rem auto', paddingTop: '4rem' }}
                >
                    {loading ?
                        <>
                            <Loading />
                        </>
                        :
                        <>
                            <HalfTitle>결제 상태변경</HalfTitle>
                            <Container style={{ paddingBottom: '16px' }}>
                                <ContentContainer style={{ flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '12px', width: 'auto' }}>
                                        <div style={{ fontSize: theme.size.font4, margin: '0 auto 12px 12px' }}>계약고유번호: {commarNumber(pay?.contract_pk)}</div>
                                        <div style={{ fontSize: theme.size.font4, margin: '0 auto 12px 12px' }}>종류: {getKoPayCategoryByNum(pay?.pay_category)}</div>
                                        {pay?.pay_category == 0 ?
                                            <>
                                                <div style={{ fontSize: theme.size.font4, margin: '0 auto 12px 12px' }}>결제예정일: {pay?.day}</div>
                                            </>
                                            :
                                            <>
                                            </>}
                                        <div style={{ fontSize: theme.size.font4, margin: '0 auto 12px 12px' }}>금액: {commarNumber(getMoneyByCardPercent(pay?.price, setting?.card_percent))}원</div>
                                        <FormControl sx={{ minWidth: 120, margin: '8px 1px' }} size="small">
                                            <InputLabel id="demo-select-small">납부상태</InputLabel>
                                            <CustomSelect
                                                labelId="demo-select-small"
                                                id="demo-select-small"
                                                value={payStatus}
                                                label="납부상태"
                                                onChange={(e) => setPayStatus(e.target.value)}
                                            >
                                                <MenuItem value={1}>납부함</MenuItem>
                                                <MenuItem value={0}>납부안함</MenuItem>
                                            </CustomSelect>
                                        </FormControl>
                                    </div>
                                </ContentContainer>
                            </Container>
                            <div style={{ display: "flex", margin: 'auto 0 0 auto' }}>
                                <Button sx={{ ...colorButtonStyle, width: '81px' }} onClick={onChangePayStatus}>{'저장'}</Button>
                            </div>
                        </>}

                </motion.div>

            </Wrappers>
        </>
    )
}
export default ChangePayStatus;