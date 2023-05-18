import React from 'react'
import styled from 'styled-components'
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../../common/manager/Breadcrumb';
import DataTable from '../../common/manager/DataTable';
import MBottomContent from '../../components/elements/MBottomContent';
import PageContainer from '../../components/elements/pagination/PageContainer';
import PageButton from '../../components/elements/pagination/PageButton';
import { excelDownload, makeQueryObj, range } from '../../functions/utils';
import AddButton from '../../components/elements/button/AddButton';
import Loading from '../../components/Loading';
import theme from '../../styles/theme';
import { Row, Select, Input } from '../../components/elements/ManagerTemplete';
import { objManagerListContent } from '../../data/Manager/ManagerContentData';
import $ from 'jquery';
import { AiOutlineSearch } from 'react-icons/ai'
import { SiMicrosoftexcel } from 'react-icons/si'
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { returnColumn } from '../../common/manager/ColumnType';
import SideBar from '../../common/manager/SideBar';
import ManagerWrappers from '../../components/elements/ManagerWrappers';
import ManagerContentWrappers from '../../components/elements/ManagerContentWrappers';
import OptionBox from './OptionBox';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { socket } from '../../data/Data';
const OptionCardWrappers = styled.div`
width:95%;
margin:0.5rem auto;
border-spacing: 0 10px;
box-shadow:1px 1px 1px #00000029;
font-size:14px;
background:#fff;
color:${props => props.theme.color.manager.font2};
`

const MItemList = () => {

    const { pathname, state } = useLocation();
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [zColumn, setZColumn] = useState([])
    const [posts, setPosts] = useState([])
    const [page, setPage] = useState(1)
    const [pageList, setPageList] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")
    const [apiStr, setApiStr] = useState("/api/items");
    const [breadcrumbText, setBreadcrumbText] = useState("");
    const [optionObj, setOptionObj] = useState({});
    const notAddList = [
        'comment'
    ]
    const use_user_pk_list = [];
    const use_contract_pk_list = ['contract_pay'];
    const use_pay_user_pk_list = ['pay'];
    useEffect(() => {
        socket.on('message', (msg) => {
            if (msg?.site == 'manager') {
                if (msg?.table == 'user' && msg?.signup_user_level == 10) {
                    toast.success(`새로운 공인중개사가 회원가입 하였습니다.`)
                }
            }
        });
    }, [])
    useEffect(() => {
        setZColumn(objManagerListContent[`${params.table}`].zColumn ?? {})
        async function fetchPost() {
            if (state?.breadcrumb) {
                setBreadcrumbText(state?.breadcrumb);
            } else {
                setBreadcrumbText(`${objManagerListContent[params.table]?.breadcrumb}`);
            }
            let api_str = "/api/items";
            if (objManagerListContent[`${params.table}`]?.api_str) {
                setApiStr(objManagerListContent[`${params.table}`]?.api_str);
                api_str = objManagerListContent[`${params.table}`]?.api_str;
            } else {
                setApiStr("/api/items");
                api_str = "/api/items";
            }
        }
        fetchPost();
    }, [location.pathname, location.search])
    useEffect(() => {
        $('.search').val("");
        if (!location.search.includes('page=')) {
            changePage(1);
        }
    }, [location.pathname])
    useEffect(() => {
        if (location.search.includes('page=')) {
            getItems();
        }
    }, [location.search])
    const changePage = async (num) => {
        setLoading(true)
        setPage(num ?? 1)
        let obj = {};
        obj['page'] = num ?? 1;
        obj['page_cut'] = $('.page-cut').val();
        obj['keyword'] = $('.search').val();
        if (objManagerListContent[`${params.table}`].is_move) {
            obj['order'] = 'sort';
        }
        if (use_user_pk_list.includes(params?.table) && params?.pk) {
            obj['user_pk'] = params?.pk;
        }
        if (use_pay_user_pk_list.includes(params?.table) && params?.pk) {
            obj['pay_user_pk'] = params?.pk;
        }
        if (use_contract_pk_list.includes(params?.table) && params?.pk) {
            obj['contract_pk'] = params?.pk;
        }
        for (var i = 0; i < objManagerListContent[`${params.table}`].queries.length; i++) {
            if (objManagerListContent[`${params.table}`].queries[i].split("=")[1]) {
                obj[objManagerListContent[`${params.table}`].queries[i].split("=")[0]] = objManagerListContent[`${params.table}`].queries[i].split("=")[1];
            } else {
                if ($(`.${objManagerListContent[`${params.table}`].queries[i].split("=")[0]}`).val() != 'all') {
                    obj[objManagerListContent[`${params.table}`].queries[i].split("=")[0]] = $(`.${objManagerListContent[`${params.table}`].queries[i].split("=")[0]}`).val();
                }
            }
        }
        if (objManagerListContent[`${params.table}`]?.if_use_pk && params?.pk) {
            obj[objManagerListContent[`${params.table}`]?.if_use_pk] = params?.pk;
        }
        let query = "";
        for (var i = 0; i < Object.keys(obj).length; i++) {
            if (i == 0) {
                query += `?`;
            }
            let key = Object.keys(obj)[i];
            if (obj[key]) {
                query += `${key}=${obj[key]}&`;
            }
        }
        query = query.substring(0, query.length - 1);
        if (decodeURI(`${location.pathname}${location.search}`) == `${location.pathname.split('?')[0]}${query}`) {
            getItems();
        } else {
            navigate(`${location.pathname.split('?')[0]}${query}`);
        }
    }
    const getItems = async () => {
        setLoading(true)
        let search = await makeQueryObj(decodeURI(location.search));
        let keys = Object.keys(search);
        for (var i = 0; i < keys.length; i++) {
            $(`.${keys[i]}`).val(search[keys[i]]);
        }
        search['table'] = objManagerListContent[`${params.table}`].schema;
        search['page'] = search['page'] ?? 1;
        search['page_cut'] = search['page_cut'] ?? 10;
        const { data: response } = await axios.post(apiStr, search);

        setPage(search['page']);
        setPosts(response.data.data);
        setOptionObj(response?.data?.option_obj);
        setPageList(range(1, response.data.maxPage));
        await new Promise((r) => setTimeout(r, 100));
        setLoading(false)
    }
    const onchangeSelectPageCut = (e) => {
        changePage(page)
    }
    const opTheTopItem = useCallback(async (pk, sort, schema) => {
        if (window.confirm('가장 위로 올리겠습니까?')) {
            const { data: response } = await axios.post('/api/onthetopitem', { table: schema, pk: pk, sort: sort });
            if (response.result > 0) {
                changePage(page)
            } else {
                alert(response.message)
            }
        }
    })
    const changeItemSequence = useCallback(async (pk, sort, schema, idx) => {
        if (posts[idx].pk == pk) {
            return;
        } else {
            const { data: response } = await axios.post('/api/changeitemsequence', {
                pk: pk,
                sort: sort,
                table: schema,
                change_pk: posts[idx].pk,
                change_sort: posts[idx].sort
            });
            if (response.result > 0) {
                changePage(page)
            } else {
                alert('잘못된 값입니다.')
                changePage(page)
            }
        }
    })
    const deleteItem = useCallback(async (pk, schema) => {
        let obj = {
            pk: pk,
            table: schema
        }
        if (schema == 'master' || schema == 'channel') {
            obj.table = 'user';
        }
        const { data: response } = await axios.post(`/api/deleteitem`, obj)

        if (response.result > 0) {
            toast.success('삭제 되었습니다.')
            changePage(page)
        } else {
            toast.error(response?.message)

        }
    })
    const changeStatus = useCallback(async (num, data, column) => {
        const { data: response } = await axios.post('/api/updatestatus', {
            table: data?.table || objManagerListContent[params.table].schema,
            column: column,
            pk: data?.pk,
            num: num,
        })
        changePage(page)
    });

    const onClickType = (key, value) => {
        changePage(1);
    }
    const onChangeType = (e) => {
        changePage(1);
    }
    const onSearch = () => {

    }
    const onPayCancel = (item) => {
        if (item?.status == 1) {
            Swal.fire({
                title: '결제 취소 하시겠습니까?',
                showCancelButton: true,
                confirmButtonText: '확인',
                cancelButtonText: '취소',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const { data: response } = await axios.post('/api/paycanceldirect', {
                        item_pk: item?.pk,
                        password: $('.password').val()
                    });
                    if (response?.result > 0) {
                        toast.success("결제가 취소 되었습니다.");
                        changePage(page)
                    } else {
                        toast.error(response?.message);
                    }
                }
            })
        }
    }
    return (
        <>
            <Breadcrumb title={breadcrumbText} nickname={``} />
            <OptionBox
                schema={params?.table}
                onChangeType={onChangeType}
                changePage={changePage}
                onchangeSelectPageCut={onchangeSelectPageCut}
                apiStr={apiStr}
                onClickType={onClickType}
                onSearch={onSearch}
            />
            {Object.keys(optionObj).length > 0 ?
                <>
                    <OptionCardWrappers>
                        <Row>
                            {Object.keys(optionObj).map((item) => (
                                <>
                                    <div style={{ padding: '12px 24px' }}>{optionObj[item]?.title}: {optionObj[item]?.content}</div>
                                </>
                            ))}
                        </Row>
                    </OptionCardWrappers>
                </>
                :
                <>
                </>}

            {loading ?
                <>
                    <Loading text={loadingText} />
                </>
                :
                <>
                    <DataTable
                        width={objManagerListContent[`${params.table}`]?.width}
                        data={posts}
                        column={zColumn}
                        schema={params.table}
                        opTheTopItem={opTheTopItem}
                        changeItemSequence={changeItemSequence}
                        deleteItem={deleteItem}
                        changeStatus={changeStatus}
                        changePage={changePage}
                        page={page}
                        onPayCancel={onPayCancel}
                    />
                </>}

            <MBottomContent>
                <div />
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
                {objManagerListContent[`${params.table}`].is_edit ?
                    <>
                        <AddButton onClick={() => navigate(`/manager/edit/${params.table}/0`)}>+ 추가</AddButton>
                    </>
                    :
                    <>
                        <div />
                    </>
                }
            </MBottomContent>
        </>
    )
}
export default MItemList;