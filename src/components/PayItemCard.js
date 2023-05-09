import { Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { backUrl } from "../data/Data";
import { commarNumber, getKoPayCategoryByNum, getMoneyByCardPercent, makeQueryObj } from "../functions/utils";
import theme from "../styles/theme";
import AddButton from "./elements/button/AddButton";
import { borderButtonStyle, colorButtonStyle, HalfTitle, TextButton, TextFillButton } from "./elements/UserContentTemplete";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import $ from 'jquery';
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
const PayItemCard = (props) => {
    let { item, is_detail, not_price, column, user, setting } = props;

    const navigate = useNavigate();

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
                        mid: 'welcometst',
                        temp: item?.pk,
                        ord_nm: `${user?.pk}${item?.pk}${new Date().getTime()}`,
                        name: `${item?.contract_pk}번 계약 ${item?.pay_category == 0 ? `${item?.day.substring(0, 7)} ` : ''} ${getKoPayCategoryByNum(item?.pay_category)}`,
                        price: getMoneyByCardPercent(item?.price, setting?.card_percent),
                        buyer: user?.name,
                        tel: user?.phone,
                        is_mobile: window.innerWidth >= 700 ? 0 : 1
                    }
                    let query = Object.entries(obj).map(e => e.join('=')).join('&');
                    window.location.href = `https://worker1.payvery.kr/payment/welcome/auth?${query}`;
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
        } else if (item?.status == 1) {
            navigate('/history/pay')
        }
    }
    const returnPayStatus = () => {
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
            <Container style={{ paddingBottom: `${not_price ? '16px' : ''}` }}>
                <ContentContainer style={{ flexDirection: `${(column && window.innerWidth <= 550) ? 'column' : ''}` }}>
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
                        <div style={{ fontSize: theme.size.font4, margin: '0 auto 12px 12px' }}>금액: {commarNumber(getMoneyByCardPercent(item?.price, setting?.card_percent))}원</div>
                    </div>
                </ContentContainer>
                {not_price ?
                    <>
                    </>
                    :
                    <>
                        <PriceContainer>
                            <div style={{ display: "flex", margin: 'auto 0 0 auto' }}>
                                {item?.status == 0 || item?.status == 1 ?
                                    <>
                                        <Button sx={{ ...colorButtonStyle, width: '81px' }} onClick={() => onPayByDirect()}>{returnPayStatus()}</Button>

                                    </>
                                    :
                                    <>
                                    </>}

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