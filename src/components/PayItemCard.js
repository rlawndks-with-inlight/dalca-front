import { Button, Card } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { backUrl } from "../data/Data";
import { commarNumber, getKoPayCategoryByNum, getMoneyByCardPercent, makeQueryObj } from "../functions/utils";
import theme from "../styles/theme";
import AddButton from "./elements/button/AddButton";
import { borderButtonStyle, colorButtonStyle, HalfTitle, ShadowContainer, TextButton, TextFillButton } from "./elements/UserContentTemplete";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import $ from 'jquery';
import { useEffect, useState } from "react";
const Container = styled.div`
display: flex; 
padding: 32px 0;
width: 100%;
min-height: 120px;
flex-direction:column;
@media screen and (max-width:550px) { 
    height:auto;
}
`
const ContentContainer = styled.div`
display:flex;
width:100%;
flex-direction:column;
@media screen and (max-width:550px) { 
    width:100%;
    border-right:none;
}
`
const PriceContainer = styled.div`
display: flex;
flex-direction: column;
width:100%;
@media screen and (max-width:550px) {  
    margin-left:auto;
}
`
const PayItemCard = (props) => {
    let { item, is_detail, not_price, column, user, setting, payList } = props;

    const navigate = useNavigate();
    const [price, setPrice] = useState(0);

    useEffect(() => {
        if (item?.pay_category == 1 || item?.pay_category == 2) {
            setPrice(item?.price)
        } else {
            setPrice(getMoneyByCardPercent(item?.price, setting?.card_percent))
        }
    }, [item])
    const onPayByDirect = () => {
        if (item?.status == 0) {
            Swal.fire({
                title: '결제 하시겠습니까?',
                showCancelButton: true,
                confirmButtonText: '확인',
                cancelButtonText: '취소'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let obj = {
                        amount: 100,
                        ord_num: `${user?.pk}${item?.pk}${new Date().getTime()}`,
                        item_name: `${item?.contract_pk}번 계약 ${item?.pay_category == 0 ? `${item?.day.substring(0, 7)} ` : ''} ${getKoPayCategoryByNum(item?.pay_category)}`,
                        buyer_name: user?.name,
                        buyer_phone: user?.phone,
                        return_url:`https://dalcapay.com:8443/api/payresult`,
                        temp: item?.pk,
                    }
                    let query = Object.entries(obj).map(e => e.join('=')).join('&');
                    window.location.href = `https://noti.payvery.kr/dalca/v2/pay/auth/koneps?${query}`;
                    // const { data: response } = await axios.post('/api/paydirect', {
                    //     item_pk: item?.pk
                    // });
                    // console.log(response);
                    // if (response?.result > 0) {
                    //     toast.success("성공적으로 결제 되었습니다.");
                    //     navigate(`/history/pay`, {
                    //         state: {
                    //             contract_pk: item?.contract_pk
                    //         }
                    //     })
                    // } else {
                    //     toast.error(response?.message);
                    // }
                }
            })
        } else {
            navigate('/history/pay')
        }
    }
    const returnPayStatus = () => {
        if (item?.pay_category == 1 || item?.pay_category == 2) {
            return '결제불가'
        }
        if (item?.status == 1) {
            return '결제완료'
        } else if (item?.status == 0) {
            return '결제하기'

        } else if (item?.status == -1) {
            return '취소완료'
        }
    }
    const onPayCancel = () => {
        if (item?.status == 1) {
            Swal.fire({
                title: '결제 취소 하시겠습니까?',
                showCancelButton: true,
                confirmButtonText: '확인',
                cancelButtonText: '취소',
                html: `<input class="swal-input password"  type="password" placeholder="비밀번호를 입력해 주세요." /><br />`,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { data: response } = await axios.post('/api/paycanceldirect', {
                        item_pk: item?.pk,
                        password: $('.password').val()
                    });
                    if (response?.result > 0) {
                        toast.success("결제가 취소 되었습니다.");
                        navigate(`/history/pay`, {
                            state: {
                                contract_pk: item?.contract_pk
                            }
                        })
                    } else {
                        toast.error(response?.message);
                    }
                }
            })
        }
    }
    return (
        <>
            <HalfTitle>결제 상세내용</HalfTitle>
            <Container>
                <ContentContainer>
                    {payList && payList.length > 0 ?
                        <>
                            {payList.map((itm, idx) => (
                                <>
                                    <ShadowContainer style={{
                                        display: 'flex', height: '150px', alignItems: 'center', margin: '0 auto 1rem auto', width: '98%'
                                    }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '12px', width: 'auto' }}>
                                            <div style={{ fontSize: theme.size.font4, margin: '0 auto 12px 12px' }}>계약고유번호: {commarNumber(itm?.contract_pk)}</div>
                                            <div style={{ fontSize: theme.size.font4, margin: '0 auto 12px 12px' }}>종류: {getKoPayCategoryByNum(itm?.pay_category)}</div>
                                            {itm?.pay_category == 0 ?
                                                <>
                                                    <div style={{ fontSize: theme.size.font4, margin: '0 auto 12px 12px' }}>결제예정일: {itm?.day}</div>
                                                </>
                                                :
                                                <>
                                                </>}
                                            <div style={{ fontSize: theme.size.font4, margin: '0 auto 12px 12px' }}>금액: {commarNumber(price)}원</div>
                                        </div>
                                    </ShadowContainer>
                                </>
                            ))}
                        </>
                        :
                        <>
                            <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '12px', width: 'auto' }}>
                                <div style={{ fontSize: theme.size.font4, margin: '0 auto 12px 12px' }}>계약고유번호: {commarNumber(item?.contract_pk)}</div>
                                <div style={{ fontSize: theme.size.font4, margin: '0 auto 12px 12px' }}>종류: {getKoPayCategoryByNum(item?.pay_category)}</div>
                                {item?.pay_category == 0 ?
                                    <>
                                        <div style={{ fontSize: theme.size.font4, margin: '0 auto 12px 12px' }}>결제예정일: {item?.day}</div>
                                    </>
                                    :
                                    <>
                                    </>}
                                <div style={{ fontSize: theme.size.font4, margin: '0 auto 12px 12px' }}>금액: {commarNumber(price)}원</div>
                            </div>
                        </>}
                </ContentContainer>
                {not_price ?
                    <>
                    </>
                    :
                    <>
                        <PriceContainer>
                            <div style={{ display: "flex", margin: '0 0 0 auto' }}>
                                <Button sx={{ ...colorButtonStyle, width: '81px' }} onClick={() => onPayByDirect()}
                                    disabled={item?.pay_category == 1 || item?.pay_category == 2}
                                >{returnPayStatus()}</Button>
                                {/* {item?.status == -1 || item?.status == 1 ?
                                    <>
                                        <Button sx={{ ...borderButtonStyle, width: '81px', marginLeft: '1rem' }} onClick={() => onPayCancel()}>{item?.status == 1 ? '결제취소' : '취소완료'}</Button>
                                    </>
                                    :
                                    <>
                                    </>} */}
                            </div>
                        </PriceContainer>
                    </>}
            </Container>
        </>
    )
}
export default PayItemCard;