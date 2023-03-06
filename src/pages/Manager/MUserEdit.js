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

    useEffect(() => {

        async function fetchPost() {
            if (params.pk > 0) {
                const { data: response } = await axios.get(`/api/item?table=user&pk=${params.pk}`)
                $('.id').val(response.data.id)
                $('.pw').val("")
                $('.name').val(response.data.name)
                $('.nickname').val(response.data.nickname)
                $('.phone').val(response.data.phone)
                $('.level').val(response.data.user_level)
                $('.address').val(response.data.address)
                $('.address_detail').val(response.data.address_detail)
                $('.zip_code').val(response.data.zip_code)
                $('.account_holder').val(response.data.account_holder)
                $('.bank_name').val(response.data.bank_name)
                $('.account_number').val(response.data.account_number)
                setManagerNote(response?.data?.manager_note);

            }
            settingJquery();
        }
        fetchPost();
    }, [])
    const settingJquery = () => {

        $('.ql-editor').attr('style', 'max-height:300px !important');
        $('.ql-editor').attr('style', 'min-height:300px !important');
    }
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [
                    { header: [1, 2, 3, 4, 5, 6] },
                    { font: [] }
                ],
                [{ size: [] }],
                [{ color: [] }, { background: [] }],
                ["bold", "italic", "underline", "strike", "blockquote", "regular"],
                [{ align: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image", "video"],
                ["emoji"],
                ["clean"],
                ["code-block"]
            ],
        },
        "emoji-toolbar": true,
        "emoji-textarea": true,
        "emoji-shortname": true
    }), [])
    const formats = [
        'font',
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image',
        'align', 'color', 'background',
    ]
    Quill.register("modules/imageResize", ImageResize);
    Quill.register(
        {
            "formats/emoji": quillEmoji.EmojiBlot,
            "modules/emoji-toolbar": quillEmoji.ToolbarEmoji,
            "modules/emoji-textarea": quillEmoji.TextAreaEmoji,
            "modules/emoji-shortname": quillEmoji.ShortNameEmoji
        },
        true
    );
    const editUser = async () => {
        if (!$(`.id`).val() || !$(`.name`).val() ||  !$(`.phone`).val() || (!$(`.pw`).val() && params.pk == 0)) {
            alert('필요값이 비어있습니다.');
        } else {
            let obj = {
                id: $(`.id`).val(),
                pw: $(`.pw`).val(),
                name: $(`.name`).val(),
                phone: $(`.phone`).val(),
                user_level: $(`.level`).val(),
                address: $(`.address`).val(),
                address_detail: $(`.address_detail`).val(),
                zip_code: $(`.zip_code`).val(),
                account_holder: $(`.account_holder`).val(),
                bank_name: $(`.bank_name`).val(),
                account_number: $(`.account_number`).val(),
                manager_note: managerNote,
            }
            if (params?.pk > 0) {
                obj['pk'] = params.pk;
            }
            if (window.confirm(`${params.pk == 0 ? '추가하시겠습니까?' : '수정하시겠습니까?'}`)) {
                const { data: response } = await axios.post(`/api/${params?.pk == 0 ? 'add' : 'update'}user`, obj);
                if (response?.result > 0) {
                    toast.success(response.message);
                    navigate(-1);
                } else {
                    toast.error(response.message);
                }
            }

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
                        <Title style={{ margintop: '32px' }}>폰번호</Title>
                        <Input className='phone' />
                    </Col>
                    <Col>
                        <Title style={{ margintop: '32px' }}>유저레벨</Title>
                        <Select className='level'>
                            <option value={0}>일반유저</option>
                            <option value={-10}>불량회원</option>
                            <option value={40}>관리자</option>
                        </Select>
                    </Col>
                </Row>
                <Col>
                    <Title>우편번호</Title>
                    <div style={{ display: 'flex' }}>
                        <Input style={{ margin: '12px 0 6px 24px' }} className='zip_code'  placeholder="예) 12345" />
                        <AddButton style={{ margin: '12px auto 6px 12px', width: '104px' }} onClick={() => { setIsSeePostCode(!isSeePostCode) }}>우편번호검색</AddButton>
                    </div>
                </Col>
                <Row>
                    <Col>
                        <Title>주소</Title>
                        <Input className='address'/>
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
                        <Title>예금주</Title>
                        <Input className='account_holder' />
                    </Col>
                    <Col>
                        <Title>은행명</Title>
                        <Input className='bank_name' />
                    </Col>
                    <Col>
                        <Title>계좌번호</Title>
                        <Input className='account_number' />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title>상담내용</Title>
                        <div id='editor'>
                            <ReactQuill
                                modules={modules}
                                theme="snow"
                                defaultValue={managerNote}
                                value={managerNote}
                                onChange={async (e) => {
                                    try {
                                        let note = e;
                                        console.log(e)
                                        if (e.includes('<img src="') && e.includes('base64,')) {
                                            let base64_list = e.split('<img src="');
                                            for (var i = 0; i < base64_list.length; i++) {
                                                if (base64_list[i].includes('base64,')) {
                                                    let img_src = base64_list[i];
                                                    img_src = await img_src.split(`"></p>`);
                                                    let base64 = img_src[0];
                                                    img_src = await base64toFile(img_src[0], 'note.png');
                                                    let formData = new FormData();
                                                    await formData.append('note', img_src);
                                                    const { data: response } = await axios.post('/api/addimageitems', formData);
                                                    note = await note.replace(base64, `${backUrl + response?.data[0]?.filename}`)
                                                }
                                            }
                                        }
                                        setManagerNote(note);
                                    } catch (err) {
                                        console.log(err);
                                    }
                                }}
                            />
                        </div>
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