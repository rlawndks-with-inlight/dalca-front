import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Textarea } from "../../../components/elements/ManagerTemplete";
import { borderButtonStyle, colorButtonStyle, Content, InputComponent, RowContent, TextButton, TextFillButton, Title, Wrappers, twoOfThreeButtonStyle } from "../../../components/elements/UserContentTemplete"
import theme from "../../../styles/theme";
import $ from 'jquery';
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { socket } from "../../../data/Data";
const Request = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [post, setPost] = useState({});
    useEffect(() => {
        async function myAuth() {
            const { data: response } = await axios.get(`/api/auth`);
            if (response?.pk > 0) {

            } else {
                alert("로그인이 필요합니다.");
                navigate('/login')
            }
        }
        myAuth();
        async function fetchPost() {
            const { data: response } = await axios.post('/api/myitem', {
                table: 'request',
                pk: params?.pk
            })
            setPost(response?.data);
            await new Promise((r) => setTimeout(r, 400));
            $('.title_').val(response?.data?.title);
            $('.note').val(response?.data?.note);
            $('.reply').val(response?.data?.reply_note);
        }
        if (params?.pk > 0) {
            fetchPost();
        }
    }, [])
    const onRequest = async () => {
        if (!$('.title_').val() || !$('.note').val()) {
            toast.error("필수 값이 비어있습니다.");
            return;
        }
        Swal.fire({
            title: `저장 하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (!result.isConfirmed) {
                return;
            }
            let obj = {
                table: 'request',
                title: $('.title_').val(),
                note: $('.note').val(),
            };
            if (post?.pk) {
                obj.pk = post?.pk;
            }
            const { data: response } = await axios.post(`/api/${post?.pk ? 'updateitem' : 'additembyuser'}`, obj)
            if (response?.result > 0 && !post?.pk) {
                socket.emit('message', {
                    method: 'add_request',
                    data: {
                        title: $('.title_').val(),
                    }
                });
                toast.success("성공적으로 저장되었습니다.");
                navigate('/history/request', { state: { type_num: 1 } })
            } else if (response?.result > 0 && post?.pk) {
                toast.success("성공적으로 저장되었습니다.");
                navigate('/history/request', { state: { type_num: 1 } })
            } else {
                toast.error(response?.message);
            }
        })
    }
    const onCancel = () => {
        Swal.fire({
            title: `작성중인 글은 모두 지워집니다.\n문의하기를 취소하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '네, 취소할게요.',
            cancelButtonText: '아니오, 계속 작성할게요.'
        }).then(async (result) => {
            if (!result.isConfirmed) {
                return;
            }
            navigate(-1);
        })
    }
    const onDelete = async () => {
        Swal.fire({
            title: `글을 삭제하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '네, 삭제할게요.',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (!result.isConfirmed) {
                return;
            }
            const { data: response } = await axios.post(`/api/deleteitembyuser`, {
                table: 'request',
                pk: post?.pk
            })
            if (response?.result > 0) {
                toast.success("성공적으로 삭제되었습니다.");
                navigate('/history/request', { state: { type_num: 1 } })
            }
        })
    }
    return (
        <Wrappers style={{ marginBottom: '1rem' }}>
            <Content>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '500px' }}
                >
                    <InputComponent
                        label={'제목을 입력해주세요.'}
                        top_label={'제목'}
                        input_type={{
                            placeholder: ''
                        }}
                        class_name='title_'
                    />
                    <InputComponent
                        label={'내용을 입력해주세요.'}
                        top_label={'내용'}
                        input_type={{
                            placeholder: ''
                        }}
                        class_name='note'
                        rows={6}
                    />
                    {post?.pk > 0 ?
                        <>
                            <InputComponent
                                label={''}
                                top_label={'답변'}
                                input_type={{
                                    placeholder: ''
                                }}
                                class_name='reply'
                                rows={6}
                                disabled={params?.pk > 0 ? true : false}
                            />
                            <RowContent style={{ columnGap: '0.5rem', marginTop: 'auto' }}>
                                <Button sx={{ ...borderButtonStyle, width: '50%' }} onClick={onDelete}>삭제</Button>
                                <Button sx={{ ...colorButtonStyle, width: '50%' }} onClick={onRequest}>수정</Button>
                            </RowContent>
                        </>
                        :
                        <>
                            <RowContent style={{ columnGap: '0.5rem', marginTop: 'auto' }}>
                                <Button sx={{ ...borderButtonStyle, width: '50%' }} onClick={onCancel}>취소</Button>
                                <Button sx={{ ...colorButtonStyle, width: '50%' }} onClick={onRequest}>완료</Button>
                            </RowContent>
                        </>}
                </motion.div>


            </Content>
        </Wrappers>
    )
}
export default Request;