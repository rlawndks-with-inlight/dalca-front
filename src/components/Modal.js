import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import '../styles/style.css'
import logo from '../assets/images/test/test_logo.png'
const ModalContainer = styled.div`

position: fixed;
top:0;
left:0;
width:100%;
height: 100%;
justify-content: center;
align-items: center;
z-index:10;
display:flex;
`
const ModalOverlay = styled.div`
background-color: black;
width:100%;
height: 100vh;
position: absolute;
opacity: 0.4;
`
const ModalContent = styled.div`
box-shadow: 0px 10px 40px #00000029;
background-color:white;
padding:32px 0;
position: relative;
border-radius: 12px;
width:50%;
margin:auto;
align-items: center;
display:flex;
flex-direction:column;
@media screen and (max-width:950px) {
width:90%;
}
`

const XButton = styled.button`
width: 28px;
height: 28px;
color: #000;
border: none;
border-radius: 16px;
font-size: 16px;
right: 0px;
top: 0px;
background-color: rgba( 255, 255, 255, 0 );
position: absolute;
font-family: ${({ theme }) => theme.font.thin};
cursor: ${({ background }) => background === 'disabled' ? 'arrow' : 'pointer'};
&:focus {
outline: none;
}
@media screen and (max-width:950px) {
width: 36px;
height: 36px;
}
`
const Modal = (props) => {
    let {children, onClickXbutton} = props;

    return (
        <>
            <ModalContainer>
                <ModalOverlay onClick={onClickXbutton} />
                <ModalContent>
                    <XButton onClick={onClickXbutton}>
                        X
                    </XButton>
                        {children}
                </ModalContent>
            </ModalContainer>
        </>
    )
}
export default Modal;