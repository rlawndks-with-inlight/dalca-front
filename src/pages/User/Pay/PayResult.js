import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ShadowContainer, TextButton, TextFillButton, Wrappers } from "../../../components/elements/UserContentTemplete"
import { commarNumber, makeDiscountPrice } from "../../../functions/utils";
import styled from "styled-components";
import { BsCheck2All } from 'react-icons/bs';
import { MdOutlineCancel } from 'react-icons/md'
import theme from "../../../styles/theme";
const RowContent = styled.div`
display:flex;
width:100%;
margin:24px 0;
@media screen and (max-width:700px) { 
}
`
const PayResult = () => {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [posts, setPosts] = useState({});
    
    return (
        <>
            <Wrappers>
                <ShadowContainer style={{ display: 'flex', flexDirection: 'column', height: '60vh', }}>
                    {params?.status == 1 ?
                        <>
                            <div style={{ margin: 'auto auto 8px auto' }}>결제가 완료되었습니다.</div>
                            <BsCheck2All style={{ margin: '8px auto auto auto', fontSize: theme.size.font2 }} />
                        </>
                        :
                        <>
                            <div style={{ margin: 'auto auto 8px auto' }}>결제에 실패하였습니다.</div>
                            <div style={{ margin: '8px auto 8px auto' }}>{decodeURIComponent(location.search.split('?')[1].split('=')[1])}</div>
                            <MdOutlineCancel style={{ margin: '8px auto auto auto', fontSize: theme.size.font2 }} />
                        </>}
                </ShadowContainer>
                <RowContent style={{ marginTop: '32px' }}>
                    <TextFillButton style={{ margin: '0 3% 0 0', width: '47%', height: '48px' }} onClick={() => navigate('/home')}>메인 화면으로</TextFillButton>
                    <TextButton style={{ margin: '0 0 0 3%', width: '47%', height: '48px' }} onClick={() => navigate('/history/pay')}>결제내역 확인</TextButton>
                </RowContent>
            </Wrappers>
        </>
    )
}
export default PayResult;