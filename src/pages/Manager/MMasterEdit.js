import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import ManagerWrappers from '../../components/elements/ManagerWrappers';
import SideBar from '../../common/manager/SideBar';
import ManagerContentWrappers from '../../components/elements/ManagerContentWrappers';
import axios from 'axios';
import Breadcrumb from '../../common/manager/Breadcrumb';
import { AiFillFileImage } from 'react-icons/ai'
import ButtonContainer from '../../components/elements/button/ButtonContainer';
import AddButton from '../../components/elements/button/AddButton';
import CancelButton from '../../components/elements/button/CancelButton';
import $ from 'jquery';
import { addItem, updateItem } from '../../functions/utils';
import { Card, Title, Input, Select, Row, Col, ImageContainer } from '../../components/elements/ManagerTemplete';
import { backUrl } from '../../data/Data';
import theme from '../../styles/theme';
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";
import "react-quill/dist/quill.snow.css";
import quillEmoji from "react-quill-emoji";
import "react-quill-emoji/dist/quill-emoji.css";

const MMasterEdit = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [myNick, setMyNick] = useState("")
    const [url, setUrl] = useState('')
    const [content, setContent] = useState(undefined)
    const [channelUrl, setChannelUrl] = useState('')
    const [channelContent, setChannelContent] = useState(undefined)
    const [formData] = useState(new FormData())
    useEffect(() => {
        async function fetchPost() {
            if (params.pk > 0) {
                const { data: response } = await axios.get(`/api/item?table=user&pk=${params.pk}`)
                $('.id').val(response.data.id)
                $('.pw').val("")
                $('.name').val(response.data.name)
                $('.nickname').val(response.data.nickname)
                setUrl(response.data.profile_img ? (backUrl + response.data.profile_img) : "")
                setChannelUrl(response.data.channel_img ? (backUrl + response.data.channel_img) : "")
            }
        }
        fetchPost();
    }, [])
    const editMaster = async () => {
        if ((!$(`.id`).val() || !$(`.name`).val() || !$(`.pw`).val() || !content || !channelContent) && params.pk == 0) {
            alert('???????????? ??????????????????.');
        } else {

            formData.append("id", $(`.id`).val());
            formData.append("pw", $(`.pw`).val());
            formData.append("name", $(`.name`).val());
            formData.append("nickname", $(`.nickname`).val());
            formData.append("user_level", 30);
            formData.append("master", content);
            formData.append("channel", channelContent);
            if (params.pk > 0) formData.append("pk", params.pk)
            if (window.confirm(`${params.pk == 0 ? '?????????????????????????' : '?????????????????????????'}`)) {
                if (params.pk <= 0) {
                    const { data: response } = await axios.post('/api/addmaster', formData);
                    alert(response.message);
                    if (response.result > 0) {
                        navigate('/manager/list/master');
                    }

                } else {
                    const { data: response } = await axios.post('/api/updatemaster', formData);
                    alert(response.message);
                    if (response.result > 0) {
                        navigate('/manager/list/master');
                    }
                }
            }
        }


    }
    const addFile = (e) => {
        if (e.target.files[0]) {
            setContent(e.target.files[0]);
            setUrl(URL.createObjectURL(e.target.files[0]))
        }
    };
    const addChannelFile = (e) => {
        if (e.target.files[0]) {
            setChannelContent(e.target.files[0]);
            setChannelUrl(URL.createObjectURL(e.target.files[0]))
        }
    };
    return (
        <>
            <Breadcrumb title={params.pk == 0 ? '????????? ??????' : '????????? ??????'} nickname={myNick} />
            <Card>
                <Row>
                    <Col>
                        <Title>?????????</Title>
                        <Input className='id' />
                    </Col>
                    <Col>
                        <Title>????????????</Title>
                        <Input className='pw' placeholder='****' type={'password'} autoComplete={'new-password'} />
                    </Col>

                </Row>
                <Row>
                    <Col>
                        <Title>??????</Title>
                        <Input className='name' />
                    </Col>
                    <Col>
                        <Title>?????????(?????????)</Title>
                        <Input className='nickname' />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title>????????? ?????????</Title>
                        <ImageContainer for="file1">

                            {url ?
                                <>
                                    <img src={url} alt="#"
                                        style={{
                                            width: 'auto', height: '150px',
                                            margin: '24px'
                                        }} />
                                </>
                                :
                                <>
                                    <AiFillFileImage style={{ margin: '4rem', fontSize: '4rem', color: `${theme.color.manager.font3}` }} />
                                </>}
                        </ImageContainer>
                        <div>
                            <input type="file" id="file1" onChange={addFile} style={{ display: 'none' }} />
                        </div>
                    </Col>
                    <Col>
                        <Title>??????</Title>
                    </Col>
                </Row>

            </Card>
            <ButtonContainer>
                <CancelButton onClick={() => navigate(-1)}>x ??????</CancelButton>
                <AddButton onClick={editMaster}>{params.pk == 0 ? '+ ??????' : '??????'}</AddButton>
            </ButtonContainer>
        </>
    )
}
export default MMasterEdit;