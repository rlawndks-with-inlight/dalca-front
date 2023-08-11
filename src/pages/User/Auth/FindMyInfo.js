import { useEffect, useState } from "react";
import { Title, Wrappers, ContentWrappers } from "../../../components/elements/UserContentTemplete";
import styled from "styled-components";
import theme from "../../../styles/theme";
import FindMyInfoCard from "../../../components/FindMyInfoCard";
import { logoSrc } from "../../../data/Data";
import { useNavigate } from "react-router-dom";

const FindMyInfo = () => {
    const navigate = useNavigate();
    return (
        <>
            <Wrappers className="wrapper" style={{ minHeight: '100vh', margin: '3rem auto', background: "#fff" }}>
                <ContentWrappers style={{ margin: 'auto' }}>
                    <img src={logoSrc} style={{ maxWidth: '250px', width: '50%', margin: 'auto auto 10vh auto' }} onClick={() => { navigate('/') }} />
                    <FindMyInfoCard />
                </ContentWrappers>
            </Wrappers>

        </>
    )
}
export default FindMyInfo