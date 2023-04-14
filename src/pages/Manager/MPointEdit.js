import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"
import MItemEditComponent from "../../components/MItemEditComponent"
import { objManagerEditContent } from "../../data/Manager/ManagerContentData";
import $ from 'jquery';
import axios from "axios";
import { returnMoment } from "../../functions/utils";
import { GiUfo } from "react-icons/gi";
import { Col, Explain, Input, Row, Title, Card } from "../../components/elements/ManagerTemplete";
import theme from "../../styles/theme";
import Breadcrumb from "../../common/manager/Breadcrumb";
import ButtonContainer from "../../components/elements/button/ButtonContainer";
import CancelButton from "../../components/elements/button/CancelButton";
import AddButton from "../../components/elements/button/AddButton";

const MPointEdit = () => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [classObj, setClassObj] = useState({})
    const [userObj, setUserObj] = useState({})
    useEffect(() => {
        if (params?.pk > 0) {
            getItem();
        }
    }, [])
    const getItem = async () => {
        const { data: response } = await axios.get(`/api/item?table=point&pk=${params?.pk}`)
        $('.price').val(response?.data?.price)

        const { data: user_ } = await axios.get(`/api/item?table=user&pk=${response?.data?.user_pk}`);
        $('.user_id').val(user_?.data?.id)
    }
    const editItem = async () => {
        let obj = {
            price: $('.price').val(),
            status: ($('.price').val() > 0 ? 1 : -1),
            table: 'point'
        }
        if (params?.pk > 0) {
            obj['pk'] = params?.pk;
        } else {
            obj['type'] = 15;
        }
        const { data: response } = await axios.post('/api/checkexistidbymanager', {
            id: $('.user_id').val()
        })
        if (response?.result > 0) {
            obj['user_pk'] = response?.data?.pk;
        } else {
            alert(response?.message);
            return;
        }
        if (window.confirm("저장하시겠습니까?")) {
            const { data: response } = await axios.post(`/api/${params?.pk > 0 ? 'update' : 'add'}item`, obj)
            if (response?.result > 0) {
                alert("성공적으로 저장되었습니다.");
                navigate(-1);
            } else {
                alert("서버에러 발생");
            }
        }
    }
    return (
        <>
            <Breadcrumb title={'포인트 관리'} />
            <Card>
                <Row>
                    <Col>
                        <Title>유저아이디</Title>
                        <Input className="user_id" type={'text'} disabled={params?.pk > 0} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Title>{'금액'}</Title>
                        <Input className="price" type={'number'} />
                        <Explain>추가시 양수는 추가포인트, 음수는 취소포인트로 자동 적용됩니다.</Explain>
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
export default MPointEdit;