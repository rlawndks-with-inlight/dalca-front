import { ShadowContainer } from "./elements/UserContentTemplete";
import defaultImg from '../assets/images/icon/default-profile.png'
import { backUrl } from "../data/Data";
import styled from "styled-components";
import theme from "../styles/theme";

const ProfileImg = styled.img`
height: 125px;
width:125px;
border-radius: 50%;
background: #fff;
margin: 0 auto;
@media screen and (max-width:700px) {
    width:20vw;
    height:20vw;
    min-width:100px;
    min-height:100px;
}
`
const InfoContainer = styled.div`
width: 70%;
margin: 1rem auto 0 1rem;
height: 100%;
font-size:${theme.size.font4};
@media screen and (max-width:700px) {
    font-size:${theme.size.font5};
}
`
const UserCard = (props) => {
    const { data } = props;
    return (
        <>
            <ShadowContainer style={{
                display: 'flex', height: '150px', alignItems: 'center', margin: '0 auto 1rem auto', width: '96%', cursor: 'pointer'
            }}>
                <ProfileImg src={data?.profile_img ? data?.profile_img.substring(0, 4) == "http" ? data?.profile_img : backUrl + data?.profile_img : defaultImg} alt="#" onError={defaultImg} />
                <InfoContainer>
                    <div style={{ marginBottom: '8px' }}>이름: {data?.name}</div>
                    <div style={{ marginBottom: '8px' }}>전화번호: {data?.phone}</div>
                    <div>주민등록번호: {data?.id_number.substring(0, 7)}*******</div>
                </InfoContainer>
            </ShadowContainer>
        </>
    )
}
export default UserCard;