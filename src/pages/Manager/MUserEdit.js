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
import { AiFillFileImage } from 'react-icons/ai';
import theme from '../../styles/theme';

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
const MUserEdit = () => {
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
    const [userLevel, setUserLevel] = useState(0);
    const [user, setUser] = useState({});
    useEffect(() => {

        async function fetchPost() {
            if (params.pk > 0) {
                const { data: response } = await axios.get(`/api/item?table=user&pk=${params.pk}`)
                $('.id').val(response.data.id)
                $('.pw').val("")
                $('.name').val(response.data.name)
                $('.nickname').val(response.data.nickname)
                $('.phone').val(response.data.phone)
                $('.id_number').val(response.data.id_number)
                $('.level').val(response.data.user_level)
                setUserLevel(response.data.user_level)
                $('.address').val(response.data.address)
                $('.address_detail').val(response.data.address_detail)
                $('.zip_code').val(response.data.zip_code)
                $('.account_holder').val(response.data.account_holder)
                $('.bank_name').val(response.data.bank_name)
                $('.account_number').val(response.data.account_number)
                setUser(response?.data);
            }
        }
        fetchPost();
    }, [])


    const editUser = async () => {
        if (
            !$(`.id`).val() ||
            !$(`.name`).val() ||
            !$(`.phone`).val() ||
            (!$(`.pw`).val() && params.pk == 0) ||
            !$(`.id_number`).val() ||
            !$(`.level`).val() ||
            !$(`.address`).val() ||
            !$(`.address_detail`).val() ||
            !$(`.zip_code`).val()
        ) {
            toast.error('필요값이 비어있습니다.');
        } else {
            let obj = {
                id: $(`.id`).val(),
                pw: $(`.pw`).val(),
                name: $(`.name`).val(),
                phone: $(`.phone`).val(),
                id_number: $(`.id_number`).val(),
                user_level: $(`.level`).val(),
                address: $(`.address`).val(),
                address_detail: $(`.address_detail`).val(),
                zip_code: $(`.zip_code`).val(),
                office_name: user?.office_name,
                company_number: user?.company_number,
                office_address: user?.office_address,
                office_phone: user?.office_phone,
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
                    let realtor_src_list = [
                        'company_number_src',
                        'office_src',
                        'bank_book_src',
                        'id_number_src',
                    ];
                    let realtor_src_obj = {};
                    if ($(`.level`).val() == 10) {

                        let num = 1;
                        for (var i = 0; i<realtor_src_list.length; i++) {
                            if (typeof user[realtor_src_list[i]] == 'string') {
                                realtor_src_obj[realtor_src_list[i]] = user[realtor_src_list[i]]
                            } else {
                                let formData = new FormData();
                                formData.append(`content${num}`, user[realtor_src_list[i]]);
                                const { data: add_image } = await axios.post('/api/addimageitems', formData);
                                if (add_image.result < 0) {
                                    toast.error(add_image?.message);
                                    return;
                                }
                                num++;
                                realtor_src_obj[realtor_src_list[i]] = add_image?.data[0]?.filename;
                            }
                        }
                    }
                    obj = { ...obj, ...realtor_src_obj };
                    const { data: response } = await axios.post(`/api/${params?.pk == 0 ? 'add' : 'update'}user`, obj);
                    if (response?.result > 0) {
                        toast.success(response.message);
                        navigate(-1);
                    } else {
                        toast.error(response.message);
                    }
                }
            })
        }


    }
    const getAddressByText = async () => {
        const { data: response } = await axios.post('/api/getaddressbytext', {
            text: $('.address').val()
        })
        if (response?.result > 0) {
            setIsSelectAddress(false);
            setAddressList(response?.data);
        } else {
            alert(response?.message);
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
    const onChangeUserLevel = (e) => {
        setUserLevel(e.target.value)
    }
    const addFile = (e) => {
        let { name, files } = e.target;
        if (files[0]) {
            setUser({ ...user, [name]: files[0] });
            $(`.${name}`).val("");
        }
    };
    return (
        <>
            <Breadcrumb title={params.pk == 0 ? '회원 추가' : '회원 수정'} nickname={myNick} />
            <Card>
                <Row>
                    <Col>
                        <Title style={{ margintop: '32px' }}>아이디</Title>
                        <Input className='id' />
                    </Col>
                    <Col>
                        <Title style={{ margintop: '32px' }}>비밀번호</Title>
                        <Input className='pw' type={'password'} placeholder='****' autoComplete={'new-password'} />
                    </Col>
                    <Col>
                        <Title style={{ margintop: '32px' }}>이름</Title>
                        <Input className='name' />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title style={{ margintop: '32px' }}>주민등록번호</Title>
                        <Input className='id_number' />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title style={{ margintop: '32px' }}>폰번호</Title>
                        <Input className='phone' />
                    </Col>
                    <Col>
                        <Title style={{ margintop: '32px' }}>유저레벨</Title>
                        <Select className='level' onChange={onChangeUserLevel}>
                            <option value={0}>임차인</option>
                            <option value={5}>임대인</option>
                            <option value={10}>공인중개사</option>
                            <option value={40}>관리자</option>
                        </Select>
                    </Col>
                </Row>
                {userLevel == 10 ?
                    <>
                        <Row>
                            <Col>
                                <Title style={{ margintop: '32px' }}>중개업소명칭</Title>
                                <Input className='office_name' defaultValue={user?.office_name} onChange={(e) => { setUser({ ...user, office_name: e.target.value }) }} />
                            </Col>
                            <Col>
                                <Title style={{ margintop: '32px' }}>사업자등록번호</Title>
                                <Input className='company_number' defaultValue={user?.company_number} onChange={(e) => { setUser({ ...user, company_number: e.target.value }) }} />
                            </Col>
                            <Col>
                                <Title style={{ margintop: '32px' }}>사무실주소</Title>
                                <Input className='office_address' defaultValue={user?.office_address} onChange={(e) => { setUser({ ...user, office_address: e.target.value }) }} />
                            </Col>
                            <Col>
                                <Title style={{ margintop: '32px' }}>사무실연락처</Title>
                                <Input className='office_phone' defaultValue={user?.office_phone} onChange={(e) => { setUser({ ...user, office_phone: e.target.value }) }} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Title>사업자등록증사진</Title>
                                <ImageContainer for="company_number_src">

                                    {user?.company_number_src ?
                                        <>
                                            <img src={(typeof user?.company_number_src == 'string') ? (backUrl + user?.company_number_src) : URL.createObjectURL(user?.company_number_src)} alt="#"
                                                style={{
                                                    height: '150px',
                                                    width: 'auto',
                                                    margin: 'auto'
                                                }} />
                                        </>
                                        :
                                        <>
                                            <AiFillFileImage style={{ margin: '4rem', fontSize: '4rem', color: `${theme.color.manager.font3}` }} />
                                        </>}
                                </ImageContainer>
                                <div>
                                    <input type="file" id="company_number_src" name={'company_number_src'} onChange={addFile} style={{ display: 'none' }} />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Title>중개업소등록증사진</Title>
                                <ImageContainer for="office_src">

                                    {user?.office_src ?
                                        <>
                                            <img src={(typeof user?.office_src == 'string') ? (backUrl + user?.office_src) : URL.createObjectURL(user?.office_src)} alt="#"
                                                style={{
                                                    height: '150px',
                                                    width: 'auto',
                                                    margin: 'auto'
                                                }} />
                                        </>
                                        :
                                        <>
                                            <AiFillFileImage style={{ margin: '4rem', fontSize: '4rem', color: `${theme.color.manager.font3}` }} />
                                        </>}
                                </ImageContainer>
                                <div>
                                    <input type="file" id="office_src" name={'office_src'} onChange={addFile} style={{ display: 'none' }} />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Title>통장사본사진</Title>
                                <ImageContainer for="bank_book_src">

                                    {user?.bank_book_src ?
                                        <>
                                            <img src={(typeof user?.bank_book_src == 'string') ? (backUrl + user?.bank_book_src) : URL.createObjectURL(user?.bank_book_src)} alt="#"
                                                style={{
                                                    height: '150px',
                                                    width: 'auto',
                                                    margin: 'auto'
                                                }} />
                                        </>
                                        :
                                        <>
                                            <AiFillFileImage style={{ margin: '4rem', fontSize: '4rem', color: `${theme.color.manager.font3}` }} />
                                        </>}
                                </ImageContainer>
                                <div>
                                    <input type="file" id="bank_book_src" name={'bank_book_src'} onChange={addFile} style={{ display: 'none' }} />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Title>신분증사진</Title>
                                <ImageContainer for="id_number_src">

                                    {user?.id_number_src ?
                                        <>
                                            <img src={(typeof user?.id_number_src == 'string') ? (backUrl + user?.id_number_src) : URL.createObjectURL(user?.id_number_src)} alt="#"
                                                style={{
                                                    height: '150px',
                                                    width: 'auto',
                                                    margin: 'auto'
                                                }} />
                                        </>
                                        :
                                        <>
                                            <AiFillFileImage style={{ margin: '4rem', fontSize: '4rem', color: `${theme.color.manager.font3}` }} />
                                        </>}
                                </ImageContainer>
                                <div>
                                    <input type="file" id="id_number_src" name={'id_number_src'} onChange={addFile} style={{ display: 'none' }} />
                                </div>
                            </Col>

                        </Row>
                    </>
                    :
                    <>
                    </>}
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
export default MUserEdit;