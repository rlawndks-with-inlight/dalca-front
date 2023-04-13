import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"
import MItemEditComponent from "../../components/MItemEditComponent"
import { objManagerEditContent } from "../../data/Manager/ManagerContentData";
import $ from 'jquery';
import axios from "axios";
import { returnMoment } from "../../functions/utils";
import { GiUfo } from "react-icons/gi";
import { Card, Col, Explain, Input, Row, Select, Title } from "../../components/elements/ManagerTemplete";
import theme from "../../styles/theme";
import Breadcrumb from "../../common/manager/Breadcrumb";
import { toast } from "react-hot-toast";
import ButtonContainer from "../../components/elements/button/ButtonContainer";
import AddButton from "../../components/elements/button/AddButton";
import CancelButton from "../../components/elements/button/CancelButton";
import Swal from "sweetalert2";
const MPayEdit = () => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [classObj, setClassObj] = useState({})
    const [userObj, setUserObj] = useState({})
    const [post, setPost] = useState({})
    useEffect(() => {
        async function fetchPost() {
            const { data: response } = await axios.get(`/api/item?table=pay&pk=${params?.pk}`);
            setPost(response?.data);
            $('.pay_category').val(response?.data?.pay_category);
            $('.status').val(response?.data?.status);
        }
        if(params?.pk>0){
            fetchPost();
        }
    }, [])

    const editItem = async () => {
        if (
            !$('.contract_pk').val() ||
            !$('.pay_category').val() ||
            !$('.price').val() ||
            !$('.day').val() ||
            !$('.status').val()
        ) {
            toast.error('필수값이 비어 있습니다.');
            return;
        }
        let obj = {
            contract_pk: $('.contract_pk').val(),
            pay_category: $('.pay_category').val(),
            price: $('.price').val(),
            day: $('.day').val(),
            status: $('.status').val(),
        }
        if (params?.pk > 0) {
            obj['pk'] = params?.pk;
        }
        Swal.fire({
            title: '저장 하시겠습니까?',
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data: response } = await axios.post(`/api/pay/${params?.pk > 0 ? 'update' : 'add'}`,obj)
                if (response?.result > 0) {
                    toast.success("성공적으로 저장되었습니다.");
                    navigate(-1);
                } else {
                    toast.error(response?.message);
                }
            }
        })
    }
    return (
        <>
            <Breadcrumb title={params.pk == 0 ? '결제 추가' : '결제 수정'} />
            <Card>
                <Row>
                    <Col>
                        <Title>계약고유번호</Title>
                        <Input className="contract_pk" defaultValue={post?.contract_pk} disabled={params?.pk > 0} />
                    </Col>
                </Row>
                {params?.pk > 0 ?
                    <>
                        <Row>
                            <Col>
                                <Title style={{ margintop: '32px' }}>공인중개사 아이디</Title>
                                <Input className='realtor_id' defaultValue={post?.realtor_id} disabled={true} />
                            </Col>
                            <Col>
                                <Title style={{ margintop: '32px' }}>임대인 아이디</Title>
                                <Input className='landlord_id' defaultValue={post?.landlord_id} disabled={true} />
                            </Col>
                            <Col>
                                <Title style={{ margintop: '32px' }}>임차인 아이디</Title>
                                <Input className='lessee_id' defaultValue={post?.lessee_id} disabled={true} />
                            </Col>
                        </Row>
                    </>
                    :
                    <>
                    </>}
                <Row>
                    <Col>
                        <Title>종류</Title>
                        <Select className='pay_category'>
                            <option value={0}>월세</option>
                            <option value={1}>보증금</option>
                            <option value={2}>계약금</option>
                        </Select>
                    </Col>
                    <Col>
                        <Title>금액</Title>
                        <Input className='price' defaultValue={post?.price} placeholder='숫자를 입력해 주세요.' />
                    </Col>
                    <Col>
                        <Title>결제 예정일</Title>
                        <Input className='day' defaultValue={post?.day} type={'date'} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title>납부현황</Title>
                        <Select className='status'>
                            <option value={0}>납부안함</option>
                            <option value={1}>납부완료</option>
                        </Select>
                    </Col>
                </Row>
            </Card>
            <ButtonContainer>
                <CancelButton onClick={() => navigate(-1)}>x 취소</CancelButton>
                <AddButton onClick={editItem}>{params.pk == 0 ? '+ 추가' : '수정'}</AddButton>
            </ButtonContainer>
        </>
    )
}
export default MPayEdit;