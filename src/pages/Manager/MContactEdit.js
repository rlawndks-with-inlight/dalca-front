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
import { addItem, base64toFile, range, updateItem } from '../../functions/utils';
import { Card, Title, Input, Row, Col, ImageContainer, Select, Explain } from '../../components/elements/ManagerTemplete';
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
const MContactEdit = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [myNick, setMyNick] = useState("")
    const [url, setUrl] = useState('')
    const [content, setContent] = useState(undefined)
    const [formData] = useState(new FormData())
    const [addressList, setAddressList] = useState([])
    const [isSelectAddress, setIsSelectAddress] = useState(false);
    const [managerNote, setManagerNote] = useState("");
    const [isSeePostCode, setIsSeePostCode] = useState(false);

    useEffect(() => {

        async function fetchPost() {
            if (params.pk > 0) {
                const { data: response } = await axios.get(`/api/item?table=contract&pk=${params.pk}`)
                $('.realtor_id').val(response.data.realtor_id)
                $('.landlord_id').val(response.data.landlord_id)
                $('.lessee_id').val(response.data.lessee_id)
                $('.landlord_appr').val(response.data.landlord_appr)
                $('.lessee_appr').val(response.data.lessee_appr)
                $('.address').val(response.data.address)
                $('.address_detail').val(response.data.address_detail)
                $('.zip_code').val(response.data.zip_code)
                $('.pay_type').val(response.data.pay_type)
                $('.deposit').val(response.data.deposit)
                $('.monthly').val(response.data.monthly)
                $('.start_date').val(response.data.start_date)
                $('.end_date').val(response.data.end_date)
                $('.pay_day').val(response.data.pay_day)
                $('.is_auto_pay').val(response.data.is_auto_pay)
            }
        }
        fetchPost();
    }, [])
   
  
    const editContract = async () => {
        if (
            !$(`.realtor_id`).val() || 
            !$(`.landlord_id`).val() || 
            !$(`.lessee_id`).val() || 
            !$(`.landlord_appr`).val() || 
            !$(`.lessee_appr`).val() || 
            !$(`.zip_code`).val() || 
            !$(`.address`).val() || 
            !$(`.address_detail`).val() || 
            !$(`.pay_type`).val() || 
            !$(`.deposit`).val() || 
            !$(`.monthly`).val() || 
            !$(`.start_date`).val() || 
            !$(`.end_date`).val() || 
            !$(`.pay_day`).val()
           ) {
            toast.error('필요값이 비어있습니다.');
        } else {
            let obj = {
                realtor_id: $(`.realtor_id`).val(),
                landlord_id: $(`.landlord_id`).val(),
                lessee_id: $(`.lessee_id`).val(),
                landlord_appr: $(`.landlord_appr`).val(),
                lessee_appr: $(`.lessee_appr`).val(),
                zip_code: $(`.zip_code`).val(),
                address: $(`.address`).val(),
                address_detail: $(`.address_detail`).val(),
                pay_type: $(`.pay_type`).val(),
                is_auto_pay: $(`.is_auto_pay`).val(),
                deposit: $(`.deposit`).val(),
                monthly: $(`.monthly`).val(),
                start_date: $(`.start_date`).val(),
                end_date: $(`.end_date`).val(),
                pay_day: $(`.pay_day`).val(),
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
                    const { data: response } = await axios.post(`/api/contract/${params?.pk == 0 ? 'add' : 'update'}`, obj);
                    if (response?.result > 0) {
                        toast.success('성공적으로 저장 되었습니다.');
                        navigate(-1);
                    } else {
                        toast.error(response.message);
                    }
                }
            })
        }


    }
    const onSelectAddress = (data) => {
        setIsSeePostCode(false);
        $('.address').val(data?.address);
        $('.zip_code').val(data?.zonecode);
        $('.address_detail').val("");
        $('.address_detail').focus();
    }
    const onClickXbutton = () => {
        setIsSeePostCode(false);
    }
    return (
        <>
            <Breadcrumb title={params.pk == 0 ? '계약 추가' : '계약 수정'} nickname={myNick} />
            <Card>
                <Row>
                    <Col>
                        <Title style={{ margintop: '32px' }}>공인중개사 아이디</Title>
                        <Input className='realtor_id' />
                    </Col>
                    <Col>
                        <Title style={{ margintop: '32px' }}>임대인 아이디</Title>
                        <Input className='landlord_id' />
                    </Col>
                    <Col>
                        <Title style={{ margintop: '32px' }}>임차인 아이디</Title>
                        <Input className='lessee_id' />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title style={{ margintop: '32px' }}>임대인 동의</Title>
                        <Select className='landlord_appr'>
                            <option value={0}>동의안함</option>
                            <option value={1}>동의완료</option>
                        </Select>
                    </Col>
                    <Col>
                        <Title style={{ margintop: '32px' }}>임차인 동의</Title>
                        <Select className='lessee_appr'>
                            <option value={0}>동의안함</option>
                            <option value={1}>동의완료</option>
                        </Select>
                    </Col>
                    <Col>
                        <Title style={{ margintop: '32px' }}>자동결제설정</Title>
                        <Select className='is_auto_pay'>
                            <option value={0}>자동결제안함</option>
                            <option value={1}>자동결제설정</option>
                        </Select>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    
                    <Explain>
                    처음 임대인동의 및 임차인동의를 동의하는 것은 계약 완료로 판단되므로 계약 시작일 및 계약 종료일에 따라서 결제 내역에 데이터가 추가됩니다.
                    </Explain>
                    </Col>
                </Row>
                <Col>
                    <Title>우편번호</Title>
                    <div style={{ display: 'flex' }}>
                        <Input style={{ margin: '12px 0 6px 24px' }} className='zip_code' placeholder="예) 12345" />
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
                <Row>
                    <Col>
                        <Title>전/월세</Title>
                        <Select className='pay_type'>
                            <option value={0}>월세</option>
                            <option value={1}>전세</option>
                        </Select>
                    </Col>
                    <Col>
                        <Title>보증금</Title>
                        <Input className='deposit' placeholder='숫자를 입력해 주세요.' />
                    </Col>
                    <Col>
                        <Title>월세</Title>
                        <Input className='monthly' placeholder='숫자를 입력해 주세요.' />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title>계약 시작일</Title>
                        <Input className='start_date' type={'date'} />
                    </Col>
                    <Col>
                        <Title>계약 종료일</Title>
                        <Input className='end_date' type={'date'} />
                    </Col>
                    <Col>
                        <Title>월세 납부일</Title>
                        <Select className='pay_day'>
                            {range(1, 28).map((item, idx) => (
                                <>
                                    <option value={item}>{item} 일</option>
                                </>
                            ))}
                        </Select>
                    </Col>

                </Row>
            </Card>
            <ButtonContainer>
                <CancelButton onClick={() => navigate(-1)}>x 취소</CancelButton>
                <AddButton onClick={editContract}>{params.pk == 0 ? '+ 추가' : '수정'}</AddButton>
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
export default MContactEdit;