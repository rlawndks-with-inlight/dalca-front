import React from 'react'
import styled from 'styled-components'
import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import ManagerWrappers from '../../components/elements/ManagerWrappers';
import SideBar from '../../common/manager/SideBar';
import ManagerContentWrappers from '../../components/elements/ManagerContentWrappers';
import axios from 'axios';
import Breadcrumb from '../../common/manager/Breadcrumb';
import ButtonContainer from '../../components/elements/button/ButtonContainer';
import AddButton from '../../components/elements/button/AddButton';
import $ from 'jquery';
import { addItem, updateItem } from '../../functions/utils';
import { Card, Title, Input, Row, Col, ImageContainer, Select } from '../../components/elements/ManagerTemplete';
import theme from '../../styles/theme';
import youtubeShare from '../../assets/images/test/youtube_share.PNG'
import relateExplain from '../../assets/images/test/relate_explain.png'
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import '@toast-ui/editor/dist/i18n/ko-kr';
import Picker from 'emoji-picker-react';
import fontSize from "tui-editor-plugin-font-size";
import "tui-editor-plugin-font-size/dist/tui-editor-plugin-font-size.css";
import { backUrl, cardDefaultColor } from '../../data/Data';
import { objManagerListContent } from '../../data/Manager/ManagerContentData';
import { categoryToNumber } from '../../functions/utils';
import CommentComponent from '../../components/CommentComponent';
const MVideoEdit = () => {
    const { pathname } = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    const editorRef = useRef();
    const [comments, setComments] = useState([]);
    const [myNick, setMyNick] = useState("")
    const [auth, setAuth] = useState({});
    const [noteFormData] = useState(new FormData());
    const [channelList, setChannelList] = useState([]);
    useEffect(() => {
        let authObj = JSON.parse(localStorage.getItem('auth'));
        setAuth(authObj);
        async function fetchPost() {
            if (authObj?.user_level >= 40) {
                const { data: channelResponse } = await axios.get(`/api/getchannel`)
                setChannelList(channelResponse.data);
            }
            if (params.pk > 0) {
                const { data: response } = await axios.get(`/api/getvideocontent?pk=${params.pk}`);
                let obj = response.data.video??{};
                $(`.title`).val(response.data.video.title);
                $(`.link`).val(response.data.video.link);
                $(`.channel`).val(response.data.video.user_pk);
                $('.font-color').val(response.data.video.font_color);
                $('.background-color').val(response.data.video.background_color);
                $('.note-align').val(response.data.video.note_align);
                let relate_list = response.data.relates ?? [];
                let relate_str = "";
                for (var i = 0; i < relate_list.length; i++) {
                    if (i != 0) {
                        relate_str += "/"
                    }
                    relate_str += relate_list[i].pk;
                }
                $('.relate').val(relate_str);
                obj.note = obj?.note.replaceAll('http://localhost:8001', backUrl);
                obj.note = obj?.note.replaceAll('https://weare-first.com:8443', backUrl);
                
                editorRef.current.getInstance().setHTML(obj.note);
                $('br').removeClass('ProseMirror-trailingBreak');
                
            } else {
                $('.font-color').val(cardDefaultColor.font)
                $('.background-color').val(cardDefaultColor.background)
            }

        }
        $('div.toastui-editor-defaultUI-toolbar > div:nth-child(4)').append(`<button type="button" class='emoji' aria-label='이모티콘' style='font-size:18px;'>🙂</button>`);
        fetchPost();
        fetchComments();
    }, [pathname])
    useEffect(() => {
        $('html').on('click', function (e) {
            if ($(e.target).parents('.emoji-picker-react').length < 1 && $('.emoji-picker-react').css('display') == 'flex' && $(e.target).attr('class') != 'emoji') {
                $('.emoji-picker-react').attr('style', 'display: none !important')
            }
        });
        $('button.emoji').on('click', function () {
            if ($('.emoji-picker-react').css('display') == 'none') {
                $('.emoji-picker-react').attr('style', 'display: flex !important')
            } else {
                $('.emoji-picker-react').attr('style', 'display: none !important')
            }
        })
        $('.toastui-editor-toolbar-icons').on('click', function () {
            $('.emoji-picker-react').attr('style', 'display: none !important')
        })
    }, [])
    const [chosenEmoji, setChosenEmoji] = useState(null);

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        editorRef.current.getInstance().insertText(emojiObject.emoji)
    };
    const fetchComments = async () => {
        const { data: response } = await axios.get(`/api/getcommnets?pk=${params.pk}&category=${categoryToNumber('video')}`);
        setComments(response.data);
    }
    const editItem = async () => {
        if (!$(`.title`).val() || !$(`.link`).val()) {
            alert('필요값이 비어있습니다.');
        } else {
            $('br').removeClass('ProseMirror-trailingBreak')
            await new Promise((r) => setTimeout(r, 100));
            let str = $('.relate').val().split("/");
            let relate_results = [];
            for (var i = 0; i < str.length; i++) {
                if (!isNaN(parseInt(str[i]))) {
                    relate_results.push(parseInt(str[i]));
                }
            }
            relate_results = JSON.stringify(relate_results);
            let obj = {
                user_pk: auth.user_level < 40 ? auth.pk : $('.channel').val(),
                title: $('.title').val(),
                link: $('.link').val(),
                font_color: $('.font-color').val(),
                background_color: $('.background-color').val(),
                relate_video: relate_results,
                note_align: $('.note-align').val(),
                want_push: $(`.want-push`).val(),
                note: editorRef.current.getInstance().getHTML()
            }
            if (params.pk > 0) obj.pk = params.pk;
            if (window.confirm(`저장하시겠습니까?`)) {

                if (params.pk > 0) {
                    updateItem('video', obj);
                } else {
                    addItem('video', obj);
                }



            }
        }
    }
    const onChangeEditor = (e) => {
        const data = editorRef.current.getInstance().getHTML();
    }
    const addComment = async (parent_pk) => {
        if (!$(`.comment-${parent_pk ?? 0}`).val()) {
            alert('필수 값을 입력해 주세요.');
            return;

        }
        const { data: response } = await axios.post('/api/addcomment', {
            userPk: auth.pk,
            userNick: auth.nickname,
            pk: params.pk,
            parentPk: parent_pk ?? 0,
            note: $(`.comment-${parent_pk ?? 0}`).val(),
            category: categoryToNumber('video')
        })

        if (response.result > 0) {
            $(`.comment-${parent_pk ?? 0}`).val("")
            fetchComments();
        } else {
            alert(response.message)
        }
    }
    const updateComment = async (pk) => {
        if (!$(`.update-comment-${pk ?? 0}`).val()) {
            alert('필수 값을 입력해 주세요.');
        }
        const { data: response } = await axios.post('/api/updatecomment', {
            pk: pk,
            note: $(`.update-comment-${pk ?? 0}`).val(),
        })

        if (response.result > 0) {
            $(`.update-comment-${pk ?? 0}`).val("")
            fetchComments();
        } else {
            alert(response.message)
        }
    }
    return (
        <>
            <ManagerWrappers>
                <SideBar />
                <ManagerContentWrappers>
                    <Breadcrumb title={objManagerListContent[`video`].breadcrumb} nickname={myNick} />
                    <Card>
                        <Row>
                            <Col>
                                <Title>제목</Title>
                                <Input className='title' placeholder='[주식용어] 유상증자' />
                            </Col>
                            <Col>
                                <Title>유튜브 링크</Title>
                                <Input className='link' placeholder='https://www.youtube.com/watch?v=9kaCAbIXuyg&list=RDVWbYRiF44Dc&index=2' />
                            </Col>
                            {auth.user_level >= 40 ?
                                <>
                                    <Col>
                                        <Title>채널명</Title>
                                        <Select className='channel'>
                                            {channelList.map((item, idx) => (
                                                <>
                                                    <option value={item.pk} key={idx}>{item.nickname}{item.user_level >= 30 ? ' ' + item.name + '(전문가)' : ''}</option>
                                                </>
                                            ))}
                                        </Select>
                                    </Col>
                                </>
                                :
                                <>
                                </>
                            }

                        </Row>
                        <Row>
                            <Col>
                                <Title><img src={youtubeShare} style={{ width: '100%', maxWidth: '500px' }} alt="#" /></Title>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Title style={{ maxWidth: '300px' }}>관련영상(동영상 번호를 '/'을 기준으로 분류)</Title>
                                <Input className='relate' placeholder='1/2/33/55' />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Title><img src={relateExplain} style={{ width: '100%', maxWidth: '500px' }} alt="#" /></Title>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Title>카드 글자색</Title>
                                <Input type={'color'} className='font-color' style={{ background: '#fff', height: '36px', width: '220px' }} />
                            </Col>
                            <Col>
                                <Title>카드 배경색</Title>
                                <Input type={'color'} className='background-color' style={{ background: '#fff', height: '36px', width: '220px' }} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Title>내용 정렬</Title>
                                <Select className='note-align'>
                                    <option value={0}>가운데</option>
                                    <option value={1}>왼쪽</option>
                                    <option value={2}>오른쪽</option>
                                </Select>
                            </Col>
                            {params.pk == 0 ?
                                <>
                                    <Col>
                                        <Title>푸쉬 발송</Title>
                                        <Select className='want-push'>
                                            <option value={1}>발송</option>
                                            <option value={0}>발송 안함</option>
                                        </Select>
                                    </Col>
                                </>
                                :
                                <>
                                </>
                            }
                        </Row>
                        <Row>
                            <Col>
                                <Title>내용</Title>
                                <div id="editor">
                                    <Picker onEmojiClick={onEmojiClick} />
                                    <Editor
                                        placeholder="내용을 입력해주세요."
                                        previewStyle="vertical"
                                        height="600px"
                                        initialEditType="wysiwyg"
                                        useCommandShortcut={false}
                                        hideModeSwitch={true}
                                        plugins={[colorSyntax, fontSize]}
                                        language="ko-KR"
                                        ref={editorRef}
                                        onChange={onChangeEditor}
                                        hooks={{
                                            addImageBlobHook: async (blob, callback) => {

                                                noteFormData.append('note', blob);
                                                const { data: response } = await axios.post('/api/addimage', noteFormData);
                                                if (response.result > 0) {
                                                    callback(backUrl + response.data.filename)
                                                    noteFormData.delete('note');
                                                } else {
                                                    noteFormData.delete('note');
                                                    return;
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </Col>
                        </Row>

                    </Card>
                    <ButtonContainer>
                        <AddButton onClick={editItem}>{'저장'}</AddButton>
                    </ButtonContainer>
                    {params.pk > 0 ?
                        <>
                            <Card style={{ minHeight: '240px' }}>
                                <Row>
                                    <Col>
                                        <Title>댓글 관리</Title>
                                    </Col>
                                </Row>
                                <CommentComponent addComment={addComment} data={comments} fetchComments={fetchComments} updateComment={updateComment} />
                            </Card>
                        </>
                        :
                        <></>
                    }
                </ManagerContentWrappers>
            </ManagerWrappers>
        </>
    )
}
export default MVideoEdit;