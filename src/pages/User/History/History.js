//내역

import { Icon } from "@iconify/react";
import { Button, IconButton } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ContentTable from "../../../components/ContentTable";
import MBottomContent from "../../../components/elements/MBottomContent";
import PageButton from "../../../components/elements/pagination/PageButton";
import PageContainer from "../../../components/elements/pagination/PageContainer";
import { colorButtonStyle, HalfTitle, InputComponent, Wrappers } from "../../../components/elements/UserContentTemplete";
import Loading from "../../../components/Loading";
import { mainPhone, objHistoryListContent } from "../../../data/ContentData";
import { getLocalStorage } from "../../../functions/LocalStorage";
import { range } from "../../../functions/utils";
import theme from "../../../styles/theme";
import { motion } from "framer-motion";
import styled from "styled-components";

const Post = styled.div`
padding:0 8px;
transition: 0.3s;
font-size:${props => props.theme.size.font5};
// &:hover{  
//     color : ${props => props.theme.color.background1};
//   }
//   @media screen and (max-width:400px) {
//     font-size:${props => props.theme.size.font5};
//     padding:2px;
// }
`
const getTitle = (param_category) => {
    if (param_category == 'contract')
        return '계약내역'
    else if (param_category == 'point')
        return '포인트 적립내역 및 사용'
    else if (param_category == 'pay')
        return '결제내역'
    else if (param_category == 'request')
        return '문의내역'
    else if (param_category == 'notice')
        return '공지사항'
    else if (param_category == 'faq')
        return '자주 하는 질문'
}

const History = () => {

    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(false);
    const [schema, setSchema] = useState("");
    const [data, setData] = useState([]);
    const [pageList, setPageList] = useState([]);
    const [page, setPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState("")
    useEffect(() => {
        if (params?.category) {
            getAuth();
        } else {
            setLoading(true);
        }
    }, [params])
    const getAuth = async () => {
        setLoading(true);
        let user_data = getLocalStorage('auth');
        setUserData(user_data);
        if (params?.category == 'contract') {
            setSchema(`contract_${user_data?.user_level}`);
        } else if (params?.category == 'pay') {
            setSchema(`pay_${user_data?.user_level}`);
        } else {
            setSchema(params?.category);
        }
        changePage(1);
    }
    const changePage = async (num) => {
        let state_query_str = "";
        if (location.state) {
            for (var i = 0; i < Object.keys(location.state).length; i++) {
                state_query_str += `&${Object.keys(location.state)[i]}=${location.state[Object.keys(location.state)]}`
            }
        }
        setLoading(true);
        setPage(num);
        let api_str = `/api/items?table=${params?.category}&page=${num}&order=pk${state_query_str}&keyword=${searchKeyword}`
        if(userData?.user_level==5){
            api_str += `&is_landlord=1`
        }
        const { data: response } = await axios.get(api_str);
        if (response?.result < 0) {
            toast.error(response?.message);
        } else {
            setData(response?.data?.data);
            setPageList(range(1, response?.data?.maxPage ?? 0));
        }
        setLoading(false);
    }
    const returnRightButton = () => {
        if (params?.category == 'contract') {
            if (userData?.user_level == 10) {
                return {
                    item: <Button sx={colorButtonStyle} onClick={() => {
                        navigate('/addcontract');
                    }}
                        startIcon={<Icon icon="material-symbols:add" />}
                    >계약생성</Button>,
                    width: '89px'
                }
            }
        }
        if (params?.category == 'request') {
            return {
                item: <Button sx={colorButtonStyle} onClick={() => {
                    navigate('/request');
                }}
                    startIcon={<Icon icon="carbon:request-quote" />}
                >문의하기</Button>,
                width: '89px'
            }
        }
        if (params?.category == 'point') {
            return {
                item: <a href={`tel:${mainPhone}`} style={{ textDecoration: 'none' }}>
                    <Button sx={colorButtonStyle} onClick={() => {
                    }}
                    >사용하기</Button>
                </a>,
                width: '65px'
            }
        }
        return {
            item: <div />,
            width: ''
        }
    }

    return (
        <>
            <Wrappers>
                {location?.pathname.includes('/list/') ?
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <Post>대표번호  1533-8643</Post>
                            <Post>팩스번호  031) 624-4396</Post>
                            <Post style={{ borderRight: 'none' }}>
                                상담시간 오전 11시~오후 5시 / 점심시간 오후 12시~1시 / 휴무일: 주말 및 공휴일
                            </Post>
                        </div>
                    </>
                    :
                    <>
                    </>}
                <HalfTitle style={{ maxWidth: '1050px' }}>{getTitle(params?.category)}</HalfTitle>
                {location?.pathname.includes('/list/') ?
                    <>
                        <InputComponent
                            label={'검색어를 입력해 주세요.'}
                            input_type={{
                                placeholder: ''
                            }}
                            class_name='keyword'
                            is_divider={true}
                            icon_label={
                                <Icon icon='ic:outline-search' style={{ cursor: 'pointer' }} />
                            }
                            onChange={(e) => setSearchKeyword(e)}
                            value={searchKeyword}
                            onClickIcon={() => {
                                changePage(1)
                            }}
                            onKeyPress={() => {
                                changePage(1)
                            }}
                        />
                    </>
                    :
                    <>
                    </>
                }
                {loading ?
                    <>
                        <Loading />
                    </>
                    :
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '350px' }}
                        >

                            <ContentTable
                                columns={objHistoryListContent[schema] ?? []}
                                data={data}
                                schema={schema}
                                pageSetting={getAuth}
                                table={params?.category}
                            />
                        </motion.div>
                    </>}
                <MBottomContent style={{ width: '100%' }}>
                    <div style={{ width: returnRightButton().width }} />
                    <PageContainer>
                        <PageButton onClick={() => changePage(1)}>
                            처음
                        </PageButton>
                        {pageList.map((item, index) => (
                            <>
                                <PageButton onClick={() => changePage(item)} style={{ color: `${page == item ? '#fff' : ''}`, background: `${page == item ? theme.color.background1 : ''}`, display: `${Math.abs(index + 1 - page) > 4 ? 'none' : ''}` }}>
                                    {item}
                                </PageButton>
                            </>
                        ))}
                        <PageButton onClick={() => changePage(pageList.length ?? 1)}>
                            마지막
                        </PageButton>
                    </PageContainer>
                    {returnRightButton().item}
                </MBottomContent>
            </Wrappers>
        </>
    )
}
export default History;