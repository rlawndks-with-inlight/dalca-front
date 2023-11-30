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
import { colorButtonStyle, HalfTitle, InputComponent, RowContent, SelectType, borderButtonStyle, twoOfThreeButtonStyle, Type, Wrappers } from "../../../components/elements/UserContentTemplete";
import Loading from "../../../components/Loading";
import { mainPhone, objHistoryListContent } from "../../../data/ContentData";
import { getLocalStorage } from "../../../functions/LocalStorage";
import { commarNumber, range, returnMoment } from "../../../functions/utils";
import theme from "../../../styles/theme";
import { motion } from "framer-motion";
import styled from "styled-components";
import { Col, Input, Row, Title } from "../../../components/elements/ManagerTemplete";
import TelAlertIconSrc from '../../../assets/images/icon/tel-alert.svg'
import KakaoTalkBigIconSrc from '../../../assets/images/icon/kakao-talk-big.svg'
import $ from 'jquery';
const Post = styled.div`
padding:0 8px;
transition: 0.3s;
font-size:${props => props.theme.size.font5};
`
const ButtonContainer = styled.div`
display:flex;
margin-top:1rem;
@media screen and (max-width:700px) {
    margin-top:0.5rem;
}
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
    else if (param_category == 'commission')
        return '정산내역'
}

const returnTopContent = (data, func) => {
    let { userData, table, optionObj } = data;
    const { onChangeType } = func;
    const onClickDate = (num) => {
        if (num == 1) {
            $('.start_date').val(returnMoment().substring(0, 10));
            $('.end_date').val(returnMoment().substring(0, 10));
        } else if (num == -1) {
            $('.start_date').val(returnMoment(-1).substring(0, 10));
            $('.end_date').val(returnMoment(-1).substring(0, 10));
        } else if (num == 3) {
            $('.start_date').val(returnMoment(-3).substring(0, 10));
            $('.end_date').val(returnMoment(-1).substring(0, 10));
        } else if (num == 30) {
            let moment = returnMoment().substring(0, 10);
            moment = moment.split('-');
            if (moment[1] == '01') {
                moment[1] = '12';
                moment[0] = moment[0] - 1;
            } else {
                moment[1] = moment[1] - 1;
            }
            $('.start_date').val(`${moment[0]}-${moment[1] >= 10 ? moment[1] : `0${moment[1]}`}-01`);
            $('.end_date').val(returnMoment(undefined, new Date(moment[0], moment[1], 0)).substring(0, 10))
        } else {
            return;
        }
        onChangeType();
    }
    if (table == 'commission') {
        return (
            <>
                <Row>
                    <RowContent style={{ columnGap: '0.5rem', alignItems: 'center' }}>
                        <Col style={{ width: '50%' }}>
                            <InputComponent
                                top_label={'시작일'}
                                input_type={{
                                    placeholder: '',
                                    type: 'date'
                                }}
                                class_name='start_date'
                                is_divider={true}
                                onChange={onChangeType}
                            />
                        </Col>
                        <Col style={{ width: '50%' }}>
                            <InputComponent
                                top_label={'종료일'}
                                input_type={{
                                    placeholder: '',
                                    type: 'date'
                                }}
                                class_name='end_date'
                                is_divider={true}
                                onChange={onChangeType}
                            />
                        </Col>
                    </RowContent>
                    <ButtonContainer style={{ columnGap: '0.5rem' }}>
                        <Button sx={{ ...borderButtonStyle, width: '25%', }} onClick={() => {
                            onClickDate(-1)
                        }}
                        >어제</Button>
                        <Button sx={{ ...borderButtonStyle, width: '25%', }} onClick={() => {
                            onClickDate(1)
                        }}
                        >당일</Button>
                        <Button sx={{ ...borderButtonStyle, width: '25%', }} onClick={() => {
                            onClickDate(3)
                        }}
                        >3일전</Button>
                        <Button sx={{ ...borderButtonStyle, width: '25%', }} onClick={() => {
                            onClickDate(30)
                        }}
                        >1개월</Button>
                    </ButtonContainer>
                </Row>
            </>
        )
    }
    if (table == 'point') {
        return (
            <>
                <Row>
                    <div> 총 포인트: </div>
                    <div style={{ marginLeft: '0.5rem' }}>{commarNumber(optionObj?.point_sum)}P</div>
                </Row>
            </>
        )
    }
}
const returnOptionBox = (data, func) => {
    let { table, optionObj } = data;
    const { goToManyPayReady } = func;
    if (table == 'commission') {
        return (
            <>
                <div style={{ marginLeft: 'auto' }}>
                    <RowContent style={{ columnGap: '0.5rem', alignItems: 'center' }}>
                        <div style={{ fontSize: theme.size.font5 }}>{optionObj?.pay_sum?.title}</div>
                        <div style={{ fontSize: theme.size.font4, fontWeight: 'bold' }}>{optionObj?.pay_sum?.content}</div>
                    </RowContent>
                </div>
            </>
        )
    }
    if (table == 'pay') {
        return (
            <>
                {/* <div style={{ marginLeft: 'auto' }}>
                    <Button sx={{ ...colorButtonStyle }} onClick={goToManyPayReady}
                    >선택한 계약 일괄 결제하기</Button>
                </div> */}
            </>
        )
    }
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
    const [optionObj, setOptionObj] = useState({})
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
            if (user_data?.user_level == 0) {
                setSchema(`pay_${user_data?.user_level}_detail`);
            } else {
                setSchema(`pay_${user_data?.user_level}`);
            }
        } else if (params?.category == 'point') {
            setSchema(`point_${user_data?.user_level}`);
        } else {
            setSchema(params?.category);
        }
        changePage(1);
    }
    const getOrderByTable = (table) => {
        if (table == 'notice' || table == 'faq' || table == 'request') {
            return 'sort'
        }
        return 'pk'
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
        let api_str = `/api/items?table=${params?.category}&page=${num}&order=${getOrderByTable(params?.category)}${state_query_str}&keyword=${searchKeyword}`
        if (getLocalStorage('auth')?.user_level == 5 && params?.category == 'pay') {
            api_str += `&is_landlord=1`
        }
        if (params?.category == 'commission') {
            if ($('.start_date').val()) {
                api_str += `&start_date=${$('.start_date').val()}`;
            } else {
                api_str += `&start_date=${returnMoment().substring(0, 10)}`;
                $('.start_date').val(returnMoment().substring(0, 10))
            }
            if ($('.end_date').val()) {
                api_str += `&end_date=${$('.end_date').val()}`;
            } else {
                api_str += `&end_date=${returnMoment().substring(0, 10)}`;
                $('.end_date').val(returnMoment().substring(0, 10))
            }
        }
        const { data: response } = await axios.get(api_str);
        if (response?.result < 0) {
            toast.error(response?.message);
        } else {
            setOptionObj(response?.data?.option_obj)
            setData(response?.data?.data);
            setPageList(range(1, response?.data?.maxPage ?? 0));
        }
        setLoading(false);
    }
    const onChangeType = () => {
        changePage(1);
    }
    const returnRightButton = () => {
        if (params?.category == 'contract') {
            if (userData?.user_level == 10) {
                return {
                    item: <Button sx={twoOfThreeButtonStyle} onClick={() => {
                        navigate('/addcontract');
                    }}
                    >계약생성</Button>,
                    width: '89px'
                }
            }
        }
        if (params?.category == 'request') {
            return {
                item: <Button sx={twoOfThreeButtonStyle} onClick={() => {
                    navigate('/request');
                }}
                >문의하기</Button>,
                width: '89px'
            }
        }
        if (params?.category == 'point') {
            return {
                item: <a href={`tel:${mainPhone}`} style={{ textDecoration: 'none' }}>
                    <Button sx={twoOfThreeButtonStyle} onClick={() => {
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
    const getTitleForm = () => {
        if (params?.category == 'pay' || params?.category == 'contract') {
            return <SelectType>
                <Type style={{ border: `1px solid ${params?.category == 'contract' ? theme.color.background2 : '#fff'}`, color: `${params?.category == 'contract' ? theme.color.background2 : '#ccc'}` }} onClick={() => { navigate(`/history/contract`) }}>계약내역</Type>
                <Type style={{ border: `1px solid ${params?.category == 'pay' ? theme.color.background2 : '#fff'}`, color: `${params?.category == 'pay' ? theme.color.background2 : '#ccc'}` }} onClick={() => { navigate(`/history/pay`) }}>결제내역</Type>
            </SelectType>
        } else if (params?.category == 'notice' || params?.category == 'faq' || params?.category == 'request') {
            return <SelectType>
                <Type style={{ border: `1px solid ${params?.category == 'notice' ? theme.color.background2 : '#fff'}`, color: `${params?.category == 'notice' ? theme.color.background2 : '#ccc'}` }} onClick={() => { navigate(`/list/notice`) }}>공지사항</Type>
                <Type style={{ border: `1px solid ${params?.category == 'faq' ? theme.color.background2 : '#fff'}`, color: `${params?.category == 'faq' ? theme.color.background2 : '#ccc'}` }} onClick={() => { navigate(`/list/faq`) }}>자주하는 질문</Type>
                <Type style={{ border: `1px solid ${params?.category == 'request' ? theme.color.background2 : '#fff'}`, color: `${params?.category == 'request' ? theme.color.background2 : '#ccc'}` }} onClick={() => { navigate(`/list/request`) }}>문의하기</Type>
            </SelectType>
        } else if (params?.category == 'point') {
            return <SelectType>
                <Type style={{ border: `1px solid ${location.pathname == '/mypage' ? theme.color.background2 : '#fff'}`, color: `${location.pathname == '/mypage' ? theme.color.background2 : '#ccc'}` }} onClick={() => { navigate(`/mypage`) }}>내정보</Type>
                <Type style={{ border: `1px solid ${location.pathname == '/history/point' ? theme.color.background2 : '#fff'}`, color: `${location.pathname == '/history/point' ? theme.color.background2 : '#ccc'}` }} onClick={() => { navigate(`/history/pay`) }}>포인트 적립내역 및 사용하기</Type>
            </SelectType>
        } else {
            return <HalfTitle style={{ maxWidth: '1050px' }}>{getTitle(params?.category)}</HalfTitle>
        }
    }
    const checkOnlyOne = (e) => {
    }
    const goToManyPayReady = () => {
        let pay_list = [];
        for (var i = 0; i < data.length; i++) {
            if ($(`#${schema}-${data[i]?.pk}`).is(':checked') && data[i]?.status == 0) {
                pay_list.push(data[i]);
            }
        }
        navigate(`/payready`, {
            state: {
                pay_list
            }
        })
    }
    return (
        <>
            <Wrappers style={{ marginBottom: '2rem' }}>

                {getTitleForm()}
                {returnTopContent({
                    userData,
                    table: params?.category,
                    optionObj
                }, {
                    onChangeType
                })}
                {params?.category != 'point' &&
                    <>
                        <InputComponent
                            label={'검색어를 입력해주세요.'}
                            input_type={{
                                placeholder: ''
                            }}
                            class_name='keyword'
                            is_divider={true}
                            icon_label={
                                <Icon icon='ic:outline-search' style={{ cursor: 'pointer', marginBottom: '8px' }} />
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
                    </>}

                {loading ?
                    <>
                        <Loading />
                    </>
                    :
                    <>
                        {returnOptionBox({
                            userData,
                            optionObj,
                            table: params?.category
                        }, {
                            onChangeType,
                            goToManyPayReady
                        })}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '250px' }}
                        >
                            <ContentTable
                                columns={objHistoryListContent[schema] ?? []}
                                data={data}
                                schema={schema}
                                pageSetting={getAuth}
                                table={params?.category}
                                checkOnlyOne={checkOnlyOne}
                            />
                        </motion.div>
                    </>}
                <MBottomContent style={{ width: '100%' }}>
                    <div />
                    {pageList.length > 0 ?
                        <>
                            <PageContainer>
                                <PageButton onClick={() => changePage(1)} style={{ color: '#000', background: '#fff', border: '1px solid #ccc' }}>
                                    처음
                                </PageButton>
                                {pageList.map((item, index) => (
                                    <>
                                        <PageButton onClick={() => changePage(item)} style={{ color: `${page == item ? '#000' : ''}`, background: `${page == item ? theme.color.background1 : ''}`, display: `${Math.abs(index + 1 - page) > 4 ? 'none' : ''}` }}>
                                            {item}
                                        </PageButton>
                                    </>
                                ))}
                                <PageButton onClick={() => changePage(pageList.length ?? 1)} style={{ color: '#000', background: '#fff', border: '1px solid #ccc' }}>
                                    마지막
                                </PageButton>
                            </PageContainer>
                        </>
                        :
                        <>
                        </>}
                    <div />
                </MBottomContent>
                {returnRightButton().item}
                {location?.pathname.includes('/list/') &&
                    <>
                        <Col style={{ rowGap: '1rem', fontSize: theme.size.font5, marginTop: '2rem' }}>
                            <RowContent style={{ justifyContent: 'space-around' }}>
                                <img src={TelAlertIconSrc} />
                                <div style={{ borderRight: '1px solid #ccc' }} />
                                <img src={KakaoTalkBigIconSrc} style={{ cursor: 'pointer' }} onClick={() => {
                                    window.location.href = `https://pf.kakao.com/_pqZxkxj`;
                                }} />
                            </RowContent>
                            <RowContent style={{ columnGap: '0.5rem' }}>
                                <div style={{ color: theme.color.font5 }}>상담시간</div>
                                <div>오전 11시~오후 5시 (점심시간 오후 12시~1시)</div>
                            </RowContent>
                            <RowContent style={{ columnGap: '0.5rem' }}>
                                <div style={{ color: theme.color.font5 }}>팩스번호</div>
                                <div>031) 624-4396</div>
                                <div style={{ borderRight: '1px solid #ccc' }} />
                                <div style={{ color: theme.color.font5 }}>휴무일</div>
                                <div>주말 및 공휴일</div>
                            </RowContent>
                        </Col>
                    </>}
            </Wrappers>
        </>
    )
}
export default History;