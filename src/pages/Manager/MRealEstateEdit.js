import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import ManagerWrappers from '../../components/elements/ManagerWrappers';
import SideBar from '../../common/manager/SideBar';
import ManagerContentWrappers from '../../components/elements/ManagerContentWrappers';
import axios from 'axios';
import Breadcrumb from '../../common/manager/Breadcrumb';
import ButtonContainer from '../../components/elements/button/ButtonContainer';
import AddButton from '../../components/elements/button/AddButton';
import CancelButton from '../../components/elements/button/CancelButton';
import $ from 'jquery';
import { addItem, base64toFile, updateItem } from '../../functions/utils';
import { Card, Title, Input, Row, Col, ImageContainer, Select } from '../../components/elements/ManagerTemplete';
import { backUrl } from '../../data/Data';
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";
import "react-quill/dist/quill.snow.css";
import quillEmoji from "react-quill-emoji";
import "react-quill-emoji/dist/quill-emoji.css";
import DaumPostcode from 'react-daum-postcode';
import Modal from '../../components/Modal';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

const Table = styled.table`
font-size:12px;
width:95%;
margin:0 auto;
text-align:center;
border-collapse: collapse;
color:${props => props.theme.color.font1};
background:#fff;
`
const Tr = styled.tr`
width:100%;
height:26px;
border-bottom:1px solid ${props => props.theme.color.font4};
`
const Td = styled.td`
border-bottom:1px solid ${props => props.theme.color.font4};
`
const MRealEstateEdit = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [myNick, setMyNick] = useState("")
    const [isSeePostCode, setIsSeePostCode] = useState(false);
    const [userLevel, setUserLevel] = useState(0);
    const [user, setUser] = useState({});
    useEffect(() => {

        async function fetchPost() {
            if (params.pk > 0) {
                const { data: response } = await axios.get(`/api/item?table=real_estate&pk=${params.pk}`)
                $('.name').val(response.data.name);
                $('.zip_code').val(response.data.zip_code);
                $('.hash').val(response.data.hash);
                $('.address').val(response.data.address);
                $('.address_detail').val(response.data.address_detail);
                $('.lat').val(response.data.lat);
                $('.lng').val(response.data.lng);
                $('.phone').val(response.data.phone);
            }
        }
        fetchPost();
    }, [])


    const editUser = async () => {
        if (
            !$(`.name`).val() ||
            !$(`.zip_code`).val() ||
            !$(`.address`).val() ||
            !$(`.address_detail`).val() ||
            !$(`.lat`).val() ||
            !$(`.lng`).val() ||
            !$(`.phone`).val()
        ) {
            toast.error('필요값이 비어있습니다.');
        } else {
            let obj = {
                name: $(`.name`).val(),
                hash: $(`.hash`).val(),
                zip_code: $(`.zip_code`).val(),
                address: $(`.address`).val(),
                address_detail: $(`.address_detail`).val(),
                lat: $(`.lat`).val(),
                lng: $(`.lng`).val(),
                phone: $(`.phone`).val(),
                table: 'real_estate'
            }
            if (params?.pk > 0) {
                obj['pk'] = params.pk;
            }
            Swal.fire({
                title: `${params.pk == 0 ? '추가하시겠습니까?' : '수정하시겠습니까?'}`,
                showCancelButton: true,
                confirmButtonText: '확인',
                cancelButtonText: '취소'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { data: response } = await axios.post(`/api/${params?.pk == 0 ? 'add' : 'update'}item`, obj);
                    if (response?.result > 0) {
                        toast.success("성공적으로 저장 되었습니다.");
                        navigate('/manager/list/real_estate');
                    } else {
                        toast.error(response.message);
                    }
                }
            })
        }


    }

    const onSelectAddress = async (data) => {
        setIsSeePostCode(false);
        console.log(data)
        const { data: response } = await axios.post('/api/getaddressbytext', {
            text: data?.jibunAddress
        })
        if (response?.data?.length > 0) {
            $('.address').val(data?.jibunAddress);
            $('.zip_code').val(data?.zonecode);
            $('.address_detail').val("");
            $('.address_detail').focus();
            $('.lng').val(response?.data[0]?.lng);
            $('.lat').val(response?.data[0]?.lat);
        } else {
            toast.error("위치추적 할 수 없는 주소입니다.");
        }

    }
    const onClickXbutton = () => {
        setIsSeePostCode(false);
    }
    const onChangeUserLevel = (e) => {
        setUserLevel(e.target.value)
    }
    return (
        <>
            <Breadcrumb title={params.pk == 0 ? '부동산 추가' : '부동산 수정'} nickname={myNick} />
            <Card>
                <Row>
                    <Col>
                        <Title style={{ margintop: '32px' }}>부동산명</Title>
                        <Input className='name' />
                    </Col>
                    <Col>
                        <Title style={{ margintop: '32px' }}>해시태그</Title>
                        <Input className='hash' />
                    </Col>
                    <Col>
                        <Title style={{ margintop: '32px' }}>전화번호</Title>
                        <Input className='phone' />
                    </Col>
                </Row>
                <Col>
                    <Title>우편번호</Title>
                    <div style={{ display: 'flex' }}>
                        <div onClick={() => { setIsSeePostCode(!isSeePostCode) }}>
                            <Input style={{ margin: '12px 0 6px 24px' }} className='zip_code' placeholder="예) 12345" disabled={true} />
                        </div>
                        <AddButton style={{ margin: '12px auto 6px 12px', width: '104px' }} onClick={() => { setIsSeePostCode(!isSeePostCode) }}>우편번호검색</AddButton>
                    </div>
                </Col>
                <Row>
                    <Col>
                        <Title>주소</Title>
                        <Input className='address' />
                    </Col>
                    <Col>
                        <Title>상세주소</Title>
                        <Input className='address_detail' />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title>경도</Title>
                        <Input className='lng' disabled={true} />
                    </Col>
                    <Col>
                        <Title>위도</Title>
                        <Input className='lat' disabled={true} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {isSeePostCode ?
                            <>
                                <Modal onClickXbutton={onClickXbutton}>
                                    <DaumPostcode style={postCodeStyle} onComplete={onSelectAddress} />
                                </Modal>
                            </>
                            :
                            <>
                            </>}
                    </Col>
                </Row>

            </Card>
            <ButtonContainer>
                <CancelButton onClick={() => navigate(-1)}>x 취소</CancelButton>
                <AddButton onClick={editUser}>{params.pk == 0 ? '+ 추가' : '수정'}</AddButton>
            </ButtonContainer>
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
export default MRealEstateEdit;