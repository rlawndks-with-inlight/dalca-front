import { useState } from "react";
import { useEffect } from "react";
import { GrFormPrevious } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { ContentWrappers, FakeHeaders, HalfTitle, InputComponet, Title, TwoOfThreeButton, twoOfThreeButtonStyle, Wrappers } from "../../components/elements/UserContentTemplete";
import theme from "../../styles/theme";
import Button from '@mui/material/Button';
import { Divider } from "@mui/material";
import { toast } from "react-hot-toast";
import Modal from '../../components/Modal';
import DaumPostcode from 'react-daum-postcode';
import $ from 'jquery';
import axios from "axios";
import { regExp } from "../../functions/utils";
import Swal from "sweetalert2";
import { logoSrc } from "../../data/Data";
const InsertInfo = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [signUpCount, setSignUpCount] = useState(0);
    const [isSeePostCode, setIsSeePostCode] = useState(false);
    const [isCheckId, setIsCheckId] = useState(false);
    const [isCheckPhone, setIsCheckPhone] = useState(false);
    const [isCheckNickname, setIsCheckNickname] = useState(false);
   
    return (
        <>
            <FakeHeaders label='회원가입' />
            <Wrappers className="wrapper" style={{ width: '100%' }}>
                <ContentWrappers>
                    <InputComponet
                        label={'ID*'}
                        input_type={{
                            placeholder: '특수문자 제외한 6자리 이상 20자리 이하',
                            disabled: isCheckId
                        }}
                        class_name='id'
                        button_label={isCheckId ? '완료' : '확인'}
                        isButtonAble={!isCheckId}
                        is_divider={true}
                    />
                    <InputComponet
                        label={'PW*'}
                        input_type={{
                            placeholder: '영문, 숫자, 특수문자조합 8~20자',
                            type: 'password'
                        }}
                        class_name='pw'
                        is_divider={true}
                        onKeyPress={() => $('.pw_check').focus()}
                    />
                    
                  
                    <Button variant="text" sx={{ ...twoOfThreeButtonStyle, marginTop: '32px' }}>회원가입</Button>
                </ContentWrappers>
            </Wrappers>
        </>
    )
}
const postCodeStyle = {
    display: 'block',
    position: 'relative',
    top: '0%',
    width: '90%',
    height: '450px',
    margin: '16px auto'
};
export default InsertInfo;