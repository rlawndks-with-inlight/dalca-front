import { Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { backUrl } from "../data/Data";
import { commarNumber } from "../functions/utils";
import theme from "../styles/theme";
import AddButton from "./elements/button/AddButton";
import { borderButtonStyle, colorButtonStyle, HalfTitle, TextButton, TextFillButton } from "./elements/UserContentTemplete";

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
    let { item, is_detail, not_price, column } = props;

    const navigate = useNavigate();
    const getPeriodByNumber = (num) => {
        let result = "";
        let period_list = [
            { name: '1일', val: 1 },
            { name: '3일', val: 3 },
            { name: '1주일', val: 7 },
            { name: '2주일', val: 14 },
            { name: '3주일', val: 21 },
            { name: '1개월', val: 30 },
            { name: '2개월', val: 60 },
            { name: '3개월', val: 90 },
            { name: '6개월', val: 180 },
            { name: '1년', val: 365 },
        ]
        for (var i = 0; i < period_list.length; i++) {
            if (num == period_list[i]?.val) {
                result = period_list[i]?.name;
            }
        }
        return result;
    }
    const onSubscribe = async (num) => {
        if (num == 1) {
            window.open('http://pf.kakao.com/_xgKMUb/chat');
            //navigate(`/payready/${item?.pk}`, { state: { item_pk: item?.pk } })
        }
        if (num == 0) {
            if (window.confirm("장바구니 등록 하시겠습니까?")) {
                const { data: response } = await axios.post('/api/onsubscribe', {
                    item_pk: item?.pk,
                    type_num: num
                })
                if (response?.result > 0) {
                    alert("성공적으로 등록 되었습니다.");
                } else {
                    alert(response?.message);
                    if (response?.result == -150) {
                        navigate('/login');
                    }
                }

            }
        }

    }
    const onPay = () => {

    }

    return (
        <>
            <HalfTitle>결제 상세내용</HalfTitle>
            <Container style={{ paddingBottom: `${not_price ? '16px' : ''}` }}>
                <ContentContainer style={{ flexDirection: `${(column && window.innerWidth <= 550) ? 'column' : ''}` }}>
                    <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '12px', width: 'auto' }}>
                    <div style={{ fontSize: theme.size.font4, margin: '0 auto 12px 12px' }}>계약고유번호: {commarNumber(item?.contract_pk)}</div>
                    <div style={{ fontSize: theme.size.font4, margin: '0 auto 12px 12px' }}>종류: {item?.pay_category == 1 ? '보증금' : '월세'}</div>
                        <div style={{ fontSize: theme.size.font4, margin: '0 auto 12px 12px' }}>금액: {commarNumber(item?.price)}원</div>
                    </div>
                </ContentContainer>
                {not_price ?
                    <>
                    </>
                    :
                    <>
                        <PriceContainer>
                            <div style={{ display: "flex", margin: 'auto 0 0 auto' }}>
                                <Button sx={{ ...colorButtonStyle, width: '81px' }} onClick={() => onPay()}>결제하기</Button>
                            </div>
                        </PriceContainer>
                    </>}
            </Container>
        </>
    )
}
export default PayItemCard;