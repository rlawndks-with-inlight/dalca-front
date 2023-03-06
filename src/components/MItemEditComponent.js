import React from 'react'
import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../common/manager/Breadcrumb';
import ButtonContainer from './elements/button/ButtonContainer';
import AddButton from './elements/button/AddButton';
import $ from 'jquery';
import { Card, Title, Input, Row, Col, ImageContainer, Select, Textarea, Explain } from './elements/ManagerTemplete';
import { AiFillFileImage } from 'react-icons/ai'
import theme from '../styles/theme';
import { backUrl, objManagerEditContent, objManagerListContent } from '../data/Manager/ManagerContentData';
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "quill-image-resize-module-react";
import "react-quill/dist/quill.snow.css";
import quillEmoji from "react-quill-emoji";
import "react-quill-emoji/dist/quill-emoji.css";
import { useMemo } from 'react';
import { toast } from 'react-hot-toast';
const Font = ReactQuill.Quill.import('formats/font');
const MItemEditComponent = (props) => {
    const { editContent, schema, params_pk, add_list, breadcrumb, editItemByParent } = props;

    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [myNick, setMyNick] = useState("")
    const [loading, setLoading] = useState(false);
    const [imgContentObj, setImgContentObj] = useState({});
    const [imgUrlObj, setImgUrlObj] = useState({});
    const [optionListObj, setOptionListObj] = useState({})
    const [editorListObj, setEditorListObj] = useState({});
    const [breadcrumbText, setBreadcrumbText] = useState("");
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
    const editPageSetting = async () => {
        let option_list_obj = {};
        let editor_list_obj = {};
        if (breadcrumb) {
            setBreadcrumbText(breadcrumb);
        } else {
            setBreadcrumbText(objManagerEditContent[schema].breadcrumb + ' ' + `${params_pk > 0 ? '수정' : '추가'}`);
        }
        for (var i = 0; i < objManagerEditContent[schema].columns.length; i++) {
            for (var j = 0; j < objManagerEditContent[schema].columns[i].length; j++) {
                let content = objManagerEditContent[schema].columns[i][j];
                if (content.type == 'select') {
                    if (content?.type_option?.api_url) {
                        const { data: response } = await axios.get(content?.type_option?.api_url);
                        let option_list = [...response.data].map(item => {
                            return {
                                name: item[content?.type_option?.use_name_column] ?? "",
                                val: item[content?.type_option?.use_val_column] ?? "",
                            }
                        });
                        option_list_obj[content.class_name] = option_list;
                    } else {
                        option_list_obj[content.class_name] = content?.type_option?.option_list ?? [];
                    }
                }
                if (content.type == 'editor') {
                    editor_list_obj[content.class_name] = "";
                }
            }
        }
        setEditorListObj(editor_list_obj);
        setOptionListObj(option_list_obj);
    }

    async function getEditItem() {
        if (params_pk > 0) {
            const { data: response } = await axios.get(`/api/item?table=${objManagerEditContent[schema].schema}&pk=${params_pk}`);
            let item = { ...response?.data };
            let url_list_obj = { ...imgUrlObj };
            let editor_list_obj = { ...editorListObj };
            for (var i = 0; i < objManagerEditContent[schema].columns.length; i++) {
                for (var j = 0; j < objManagerEditContent[schema].columns[i].length; j++) {
                    let content = objManagerEditContent[schema].columns[i][j];
                    if (content.type == 'img') {
                        if (item[`${content.class_name}`]) {
                            url_list_obj[`${content.class_name}`] = backUrl + item[`${content.class_name}`];
                        }
                    }
                    if (content.type == 'select') {
                        setTimeout(function () {
                            $(`.${content.class_name}`).val(item[`${content.class_name}`]);
                        }, 500);
                    }
                    if (content.type == 'input') {
                        if (content?.type_option?.type == 'password') {
                        } else {
                            setTimeout(function () {
                                $(`.${content.class_name}`).val(item[`${content.class_name}`]);
                            }, 500);
                        }
                    }
                    if (content.type == 'textarea') {
                        setTimeout(function () {
                            $(`.${content.class_name}`).val(item[`${content.class_name}`]);
                        }, 500);
                    }
                    if (content.type == 'editor') {
                        item[`${content.class_name}`] = item[`${content.class_name}`].replaceAll('https://1st-academy.kr:8443', backUrl);
                        editor_list_obj[`${content.class_name}`] = item[`${content.class_name}`];
                    }
                }
            }
            setImgUrlObj(url_list_obj);
            setEditorListObj(editor_list_obj);
        }
        if (params_pk < 0) {
            navigate(-1);
        }
    }
    useEffect(() => {
        async function fetchPost() {
            setLoading(true);
            await editPageSetting();
            if (params_pk > 0) {
                await getEditItem();
            }
            if (params_pk < 0) {
                navigate(-1);
            }
            setLoading(false);
            await new Promise((r) => setTimeout(r, 500));
            await settingJquery();
        }
        fetchPost();
    }, [pathname]);
    const settingJquery = () => {

        $('.ql-editor').attr('style', 'max-height:300px !important');
        $('.ql-editor').attr('style', 'min-height:300px !important');
    }

    const editItem = async () => {
        try {
            if (window.confirm('저장 하시겠습니까?')) {
                let formData = new FormData();
                let obj = {};
                let img_count = 0;
                let key_field_connect_obj = {};
                for (var i = 0; i < objManagerEditContent[schema].columns.length; i++) {
                    for (var j = 0; j < objManagerEditContent[schema].columns[i].length; j++) {
                        let content = objManagerEditContent[schema].columns[i][j];
                        if (content.type == 'img' && imgContentObj[`${content?.class_name}`]) {
                            key_field_connect_obj[content?.type_option?.field_name] = content.class_name;
                            await formData.append(`${content?.type_option?.field_name}`, imgContentObj[`${content?.class_name}`]);
                            img_count++;
                        } else if (content.type == 'img' && imgUrlObj[`${content?.class_name}`] == -1) {//초기화시
                            obj[content.class_name] = '';
                        } else if (content.type == 'input') {
                            if ($(`.${content.class_name}`).val()) {
                                obj[content.class_name] = $(`.${content.class_name}`).val();
                            }
                        } else if (content.type == 'textarea') {
                            obj[content.class_name] = $(`.${content.class_name}`).val();
                        } else if (content.type == 'select') {
                            obj[content.class_name] = $(`.${content.class_name}`).val() ?? optionListObj[content.class_name][0]['val'];
                        } else if (content.type == 'editor') {
                            obj[content.class_name] = editorListObj[`${content.class_name}`];
                        }
                    }
                }
                if (img_count > 0) {
                    const { data: response_img } = await axios.post('/api/addimageitems', formData);
                    let img_list = [...response_img?.data];
                    for (var i = 0; i < img_list.length; i++) {
                        obj[key_field_connect_obj[img_list[i]['key']]] = img_list[i]['filename'];
                    }
                }
                let api_str = "";
                obj['table'] = objManagerEditContent[schema].schema;
                if (add_list && params_pk == 0) {
                    for (var i = 0; i < add_list.length; i++) {
                        obj[add_list[i]?.key] = add_list[i]?.value;
                    }
                }
                if (objManagerEditContent[schema]?.add_list && objManagerEditContent[schema]?.add_list?.length > 0 && params_pk == 0) {
                    for (var i = 0; i < objManagerEditContent[schema]?.add_list.length; i++) {
                        obj[objManagerEditContent[schema]?.add_list[i]?.key] = objManagerEditContent[schema]?.add_list[i]?.value;
                    }
                }
                if (objManagerEditContent[schema]?.update_list && objManagerEditContent[schema]?.update_list?.length > 0 && params_pk > 0) {
                    for (var i = 0; i < objManagerEditContent[schema]?.update_list.length; i++) {
                        obj[objManagerEditContent[schema]?.update_list[i]?.key] = objManagerEditContent[schema]?.update_list[i]?.value;
                    }
                }
                if (params_pk == 0) {
                    api_str = "/api/additem";
                } else {
                    api_str = "/api/updateitem";
                    obj['pk'] = params_pk;
                }
                const { data: response_item } = await axios.post(api_str, obj);
                if (response_item.result > 0) {
                    toast.success("성공적으로 저장 되었습니다.");
                    navigate(-1);
                } else {
                    toast.error(response_item?.message);
                }
            }

        } catch (err) {
            console.log(err);
        }
    }
    const addFile = (e) => {
        let { id, files } = e.target;
        if (e.target.files[0]) {
            let img_content_obj = { ...imgContentObj };
            let img_url_obj = { ...imgUrlObj };
            img_content_obj[`${id}`] = e.target.files[0];
            img_url_obj[`${id}`] = URL.createObjectURL(e.target.files[0]);
            setImgContentObj({ ...img_content_obj });
            setImgUrlObj({ ...img_url_obj });
        }
    };
    const imgReset = (column) => {
        let img_url_obj = { ...imgUrlObj };
        img_url_obj[column] = -1;
        setImgUrlObj({ ...img_url_obj });
    }
    function base64toFile(base_data, filename) {
        var arr = base_data.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], filename, { type: mime });
    }
    return (
        <>
            <Breadcrumb title={breadcrumbText} nickname={myNick} />
            <Card>
                {loading ?
                    <>

                    </>
                    :
                    <>
                        {objManagerEditContent[schema].columns.map((cols, index) => (
                            <>
                                <Row>
                                    {cols.map((item, idx) => (
                                        <>
                                            <Col>
                                                <Title style={{ width: `${item.type_option?.title_width ?? ""}` }}>{item.title}</Title>
                                                {item.type == 'input' ?
                                                    <>
                                                        <Input className={`${item.class_name}`} placeholder={`${item.type_option?.placeholder ?? ""}`} type={`${item.type_option?.type ?? ""}`} autoComplete={item.type_option?.type == 'password' ? 'new-password' : ''} disabled={item.type_option?.disabled ?? ""} />
                                                    </>
                                                    :
                                                    <>
                                                    </>}
                                                {item.type == 'select' ?
                                                    <>
                                                        <Select className={`${item.class_name}`}>
                                                            {optionListObj[`${item.class_name}`] && optionListObj[`${item.class_name}`]?.map((option_item, idx) => (
                                                                <option value={option_item?.val}>{option_item?.name}</option>
                                                            ))}
                                                        </Select>
                                                    </>
                                                    :
                                                    <>
                                                    </>}
                                                {item.type == 'img' ?
                                                    <>
                                                        <ImageContainer for={`${item.class_name}`}>

                                                            {imgUrlObj[`${item.class_name}`] && imgUrlObj[`${item.class_name}`] != -1 ?
                                                                <>
                                                                    <img src={imgUrlObj[`${item.class_name}`]} alt="#"
                                                                        style={{
                                                                            width: 'auto', height: '8rem',
                                                                            margin: '2rem'
                                                                        }} />
                                                                </>
                                                                :
                                                                <>
                                                                    <AiFillFileImage style={{ margin: '4rem', fontSize: '4rem', color: `${theme.color.manager.font3}` }} />
                                                                </>}
                                                        </ImageContainer>
                                                        <div>
                                                            <input type="file" id={`${item.class_name}`} onChange={addFile} style={{ display: 'none' }} />
                                                        </div>
                                                        {imgUrlObj[`${item.class_name}`] && imgUrlObj[`${item.class_name}`] != -1 ?
                                                            <>
                                                                <Explain style={{ margin: '8px auto 0px 24px' }}>
                                                                    <AddButton onClick={() => imgReset(item.class_name)}>초기화</AddButton>
                                                                </Explain>
                                                            </>
                                                            :
                                                            <>
                                                            </>}

                                                    </>
                                                    :
                                                    <>
                                                    </>}
                                                {item.type == 'editor' ?
                                                    <>
                                                        <div id='editor'>
                                                            <ReactQuill
                                                                modules={modules}
                                                                theme="snow"
                                                                defaultValue={editorListObj[`${item?.class_name}`]}
                                                                value={editorListObj[`${item?.class_name}`]}
                                                                onChange={async (e) => {
                                                                    try {
                                                                        let note = e;
                                                                        let editor_list_obj = await { ...editorListObj };
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
                                                                        editor_list_obj[`${item.class_name}`] = note;
                                                                        setEditorListObj(editor_list_obj);
                                                                    } catch (err) {
                                                                        console.log(err);
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                    </>}
                                                {item.type == 'textarea' ?
                                                    <>
                                                        <Textarea className={`${item.class_name}`} placeholder={`${item.type_option?.placeholder ?? ""}`} disabled={item.type_option?.disabled ?? ""} />
                                                    </>
                                                    :
                                                    <>
                                                    </>}
                                            </Col>
                                        </>
                                    ))}
                                </Row>
                            </>
                        ))}
                        {editContent}
                    </>}

            </Card>

            <ButtonContainer>
                <AddButton style={{ background: theme.color.red, marginRight: '8px' }} onClick={() => { navigate(-1) }}>{'취소'}</AddButton>
                <AddButton onClick={()=>{
                    if(editItemByParent){
                        editItemByParent();
                    }else{
                        editItem();
                    }
                    }}>{'저장'}</AddButton>
            </ButtonContainer>
            {/* {params_pk > 0 ?
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
                    } */}
        </>
    )
}
export default MItemEditComponent;
