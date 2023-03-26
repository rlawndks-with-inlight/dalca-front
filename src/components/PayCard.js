import { useEffect, useState } from "react";
import styled from "styled-components";
import theme from "../styles/theme";

const RowComponent = styled.div`
display:flex;
align-items:center;
@media screen and (max-width:500px) {
    flex-direction:column;
    align-items:flex-start;
}
`
const OneCard = styled.div`
background:#fff;
background:${props=>props.background};
color:${props=>props.theme.font1};
color:${(props=>props.color)};
box-shadow:${props => props.theme.boxShadow};
padding:2%;
border-radius:8px;
display:flex;
flex-direction:column;
${(props=>props.is_hover?('cursor:pointer'):'')};
height:48px;
width:${(props => props.width) ?? "100"}%;
transition-duration: 0.3s;
&:hover{  
    background : ${(props=>props.is_hover?(props=>props.theme.color.background1+'29'):'')};
}
@media screen and (max-width:400px) { 
    height:56px;
}
`

const PayCard = (props) => {
    let { data } = props;
    let [returnType, setReturnType] = useState({});
    useEffect(() => {
        setReturnType(return_obj_by_type[data?.type]);
    }, [props])
    const returnTypeFormat = (name, color, s_cal, s_per, p_cal, p_per, r_cal, r_per, e_cal, e_per) => {
        return {
            name: name,
            color: color,
            s_cal: s_cal,
            s_per: s_per,
            p_cal: p_cal,
            p_per: p_per,
            r_cal: r_cal,
            r_per: r_per,
            e_cal: e_cal,
            e_per: e_per,
        }
    }
    let return_obj_by_type = {
        0: returnTypeFormat(`쇼핑몰 ${data?.s_t_price > 0 ? '반환' : '구매'}`, 'rgb(0, 210, 211)'),
        1: returnTypeFormat(`쿠폰 ${data?.s_t_price > 0 ? '반환' : '구매'}`, ''),
        2: returnTypeFormat('랜덤박스 변환', 'rgb(243, 104, 224)'),
        3: returnTypeFormat('선물', 'rgb(243, 156, 18)'),
        4: returnTypeFormat('출금', 'rgb(95, 39, 205)'),
        5: returnTypeFormat('관리자 수정', 'rgb(52, 73, 94)'),
        6: returnTypeFormat(`데일리자동 ${data?.s_t_price > 0 ? '적립' : '차감'}`, 'rgb(22, 160, 133)'),
        7: returnTypeFormat('출석보너스', 'rgb(252, 66, 123)'),
        8: returnTypeFormat('청약예치금', 'rgb(211, 84, 0)'),
        9: returnTypeFormat('ESGW(P) 변환', 'rgb(16, 172, 132)'),
        10: returnTypeFormat(`${data?.s_t_explain_obj?.introduced_id?'추천수당':'매출등록'}`, 'rgb(125, 95, 255)'),
        11: returnTypeFormat('이벤트보너스', 'rgb(234, 181, 67)'),
        12: returnTypeFormat(`직대회원 아울렛 ${data.r_t_price > 0 ? '구매' : '구매취소'}`, 'rgb(196, 229, 56)'),
        13: returnTypeFormat(''),
        14: returnTypeFormat('월결산', 'rgb(205, 132, 241)'),
        15: returnTypeFormat('주결산', 'rgb(197, 108, 240)'),
        16: returnTypeFormat('경매이벤트', '#000'),
    }
    return (
        <>
            <OneCard style={{ marginTop: '8px', boxShadow: '0px 2px 2px #00000029', height: 'auto', minHeight: '56px', fontSize: theme.size.font4, lineHeight: '30px', padding: '16px',minWidth:'300px' }}>
                <RowComponent>
                    <button style={{ background: returnType?.color, width: 'auto', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>{returnType?.name}</button>
                    <div style={{ marginLeft: '8px', color: 'rgb(27, 20, 100)', fontWeight: 'bold' }}>{data?.date}</div>
                </RowComponent>
                {data?.type==11 || data?.type==12?
                <>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                    <div style={{ fontSize: theme.size.font5, color: theme.color.font5, width: '64px' }}>From</div>
                    <div>{data?.r_t_explain_obj?.user_id}</div>
                </div>
                </>
                :
                <>
                </>}
                {data?.type==3?
                <>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                    <div style={{ fontSize: theme.size.font5, color: theme.color.font5, width: '64px' }}>{(data?.s_t_price>0 || data?.p_t_price>0 || data?.e_t_price>0)?'From':'To'}</div>
                    <div>{data?.s_t_explain_obj?.user_id}</div>
                </div>
                </>
                :
                <>
                </>}
                {data?.type==10 && data?.s_t_explain_obj?.introduced_id ?
                <>
                <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                    <div style={{ fontSize: theme.size.font5, color: theme.color.font5, width: '64px' }}>From</div>
                    <div>{data?.s_t_explain_obj?.introduced_id}</div>
                </div>
                </>
                :
                <>
                </>}
                <div style={{ width: '100%', borderBottom: `1px solid ${theme.color.font6}`, display: 'flex', alignItems: 'center' }}>
                    <div style={{ fontSize: theme.size.font5, color: theme.color.font5, width: '64px' }}>적용</div>
                </div>
                <RowComponent>
                    <div style={{ fontSize: theme.size.font5, color: theme.color.font5, width: '64px' }}>스타</div>
                </RowComponent>
                <RowComponent>
                    <div style={{ fontSize: theme.size.font5, color: theme.color.font5, width: '64px' }}>포인트</div>
                </RowComponent>
                <RowComponent>
                    <div style={{ fontSize: theme.size.font5, color: theme.color.font5, width: '64px' }}>랜덤박스</div>
                </RowComponent>
                <RowComponent>
                    <div style={{ fontSize: theme.size.font5, color: theme.color.font5, width: '64px' }}>ESGWP</div>
                </RowComponent>
            </OneCard>
        </>
    )
}
export default PayCard;