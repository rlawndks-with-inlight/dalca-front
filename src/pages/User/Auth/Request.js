import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Textarea } from "../../../components/elements/ManagerTemplete";
import { borderButtonStyle, colorButtonStyle, Content, TextButton, TextFillButton, Title, Wrappers } from "../../../components/elements/UserContentTemplete"
import theme from "../../../styles/theme";
import $ from 'jquery';
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
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
            $('.title').val(response?.data?.title);
            $('.note').val(response?.data?.note);
            $('.reply').val(response?.data?.reply_note);
        }
        if (params?.pk > 0) {
            fetchPost();
        }
    }, [])
    const onRequest = async () => {
        if (!$('.title_').val() || !$('.note').val()) {
            alert("필수 값이 비어있습니다.");
            return;
        }
        Swal.fire({
            title: `저장 하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then(async (result) => {
            const { data: response } = await axios.post('/api/additembyuser', {
                table: 'request',
                title: $('.title_').val(),
                note: $('.note').val(),
            })
            if (response?.result > 0) {
                toast.success("성공적으로 저장되었습니다.");
                navigate('/history/request', { state: { type_num: 1 } })
            } else {
                toast.error(response?.message);
            }
        })
    }
    return (
        <Wrappers>
            <Content>
                <Title>문의하기</Title>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ maxWidth: '48px', fontSize: theme.size.font4, fontWeight: 'bold', width: '10%' }}>제목</div>
                    <Input style={{ margin: '0 0 0 8px', width: '80%', maxWidth: '650px', padding: '14px 8px' }} className='title' disabled={params?.pk > 0 ? true : false} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: '16px', justifyContent: 'space-between' }}>
                    <div style={{ maxWidth: '48px', fontSize: theme.size.font4, fontWeight: 'bold', width: '10%' }}>내용</div>
                    <Textarea style={{ margin: '0 0 0 8px', width: '85%', height: '360px', maxWidth: '600px' }} className='note' disabled={params?.pk > 0 ? true : false} />
                </div>
                {post?.status == 1 ?
                    <>
                        <div style={{ display: 'flex', alignItems: 'flex-start', marginTop: '16px', justifyContent: 'space-between' }}>
                            <div style={{ maxWidth: '48px', fontSize: theme.size.font4, fontWeight: 'bold', width: '10%' }}>답변</div>
                            <Textarea style={{ margin: '0 0 0 8px', width: '85%', height: '360px', maxWidth: '600px' }} className='reply' disabled={params?.pk > 0 ? true : false} />
                        </div>
                        <div style={{ display: "flex", marginTop: '16px', marginLeft: 'auto' }}>
                            <Button sx={borderButtonStyle} onClick={() => navigate(-1)}>뒤로가기</Button>
                        </div>
                    </>
                    :
                    <>
                        <div style={{ display: "flex", marginTop: '16px', marginLeft: 'auto' }}>
                            <Button sx={borderButtonStyle} onClick={() => navigate(-1)}>취소</Button>
                            {params?.pk > 0 ?
                                <>
                                </>
                                :
                                <>
                                    <Button sx={{ ...colorButtonStyle, margin: '0 0 0 8px' }} onClick={onRequest}>완료</Button>
                                </>}
                        </div>
                    </>}

            </Content>
        </Wrappers>
    )
}
export default Request;