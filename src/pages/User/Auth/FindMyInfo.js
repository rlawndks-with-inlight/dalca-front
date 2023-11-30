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
            <Wrappers className="wrapper" style={{ minHeight: '100vh', background: "#fff", marginTop: '0' }}>
                <ContentWrappers>
                    <FindMyInfoCard />
                </ContentWrappers>
            </Wrappers>
        </>
    )
}
export default FindMyInfo