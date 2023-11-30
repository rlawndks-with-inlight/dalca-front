import { RowContent, ShadowContainer } from "./elements/UserContentTemplete";
import defaultImg from '../assets/images/icon/default-profile.png'
import { backUrl } from "../data/Data";
import styled from "styled-components";
import theme from "../styles/theme";
import { Avatar } from "@mui/material";

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
display: flex;
flex-direction: column;
row-gap: 0.25rem;
font-size:${theme.size.font4};
@media screen and (max-width:700px) {
    font-size:${theme.size.font5};
}
`
const UserCard = (props) => {
    const { data } = props;
    return (
        <>
            <RowContent style={{ alignItems: 'center', columnGap: '1rem' }}>
                <Avatar src={backUrl + data?.profile_img} style={{ width: '56px', height: '56px' }} />
                <InfoContainer>
                    <RowContent style={{ columnGap: '0.5rem' }}>
                        <div style={{ fontWeight: 'bold' }}>{data?.name}</div>
                        <div style={{ color: theme.color.font5, borderLeft: `${data?.user_level == 10 ? `1px solid ${theme.color.font5}` : ''}` }}>{data?.user_level == 10 ? data?.office_name : ''}</div>
                    </RowContent>
                    <RowContent>
                        {data?.phone}
                    </RowContent>
                    <RowContent>
                        {data?.id_number.substring(0, 7)}*******
                    </RowContent>
                </InfoContainer>
            </RowContent>
        </>
    )
}
export default UserCard;