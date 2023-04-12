//내역

import { Icon } from "@iconify/react";
import { Button } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ContentTable from "../../../components/ContentTable";
import MBottomContent from "../../../components/elements/MBottomContent";
import PageButton from "../../../components/elements/pagination/PageButton";
import PageContainer from "../../../components/elements/pagination/PageContainer";
import { colorButtonStyle, HalfTitle, Wrappers } from "../../../components/elements/UserContentTemplete";
import Loading from "../../../components/Loading";
import { mainPhone, objHistoryListContent } from "../../../data/ContentData";
import { getLocalStorage } from "../../../functions/LocalStorage";
import { range } from "../../../functions/utils";
import theme from "../../../styles/theme";
import { motion } from "framer-motion";
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
        return 'FAQ'
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
        const { data: response } = await axios.get(`/api/items?table=${params?.category}&page=${num}&order=pk${state_query_str}`);
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
                <HalfTitle style={{ maxWidth: '1050px' }}>{getTitle(params?.category)}</HalfTitle>
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