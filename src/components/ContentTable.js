import { useNavigate } from "react-router-dom";
import { commarNumber } from "../functions/utils";
import { RiDeleteBinLine } from 'react-icons/ri'
import axios from "axios";
import { backUrl } from "../data/Data";
import AddButton from "./elements/button/AddButton";
import theme from "../styles/theme";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { TextButton } from "./elements/UserContentTemplete";
import { objHistoryListContent } from "../data/ContentData";
import { Button, IconButton } from "@mui/material";
import { Icon } from "@iconify/react";
import { getLocalStorage } from "../functions/LocalStorage";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
const Table = styled.table`
font-size:${props => props.theme.size.font4};
width:100%;
text-align:center;
border-collapse: collapse;
min-width:350px;
`
const Tr = styled.tr`
width:100%;
height:26px;
border-bottom:1px solid ${props => props.theme.color.font4};
`
const Td = styled.td`
border-bottom:1px solid ${props => props.theme.color.font4};
font-size:${props => props.theme.size.font5};
white-space:pre;
`
const ContentTable = (props) => {
    const navigate = useNavigate();
    const { data, click, schema, table, isPointer, addSubscribeMaster, columnsBold, marginBottom, fontSize, pageSetting } = props;
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);
    const onClickEvent = (str) => {
        if (str) {
            navigate(str)
        }
    }
    useEffect(() => {
        setLoading(true);
        setColumns(objHistoryListContent[schema]?.columns);
    }, [])
    useEffect(() => {
        if (columns && columns.length > 0) {
            setLoading(false);
        }
    }, [columns])
    useEffect(() => {
    }, [data])
    const deleteItem = async (pk, table, cha) => {
        Swal.fire({
            title: `정말로 ${cha ?? '삭제'}하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let obj = {
                    pk: pk,
                    table: table
                }
                const { data: response } = await axios.post(`/api/deleteitem`, obj)
                if (response.result > 0) {
                    toast.success('삭제되었습니다.');
                    pageSetting();
                } else {
                    toast.error(response?.message);
                }
            }
        })
    }
    const getStarBynum = (num) => {
        let str = '';
        for (var i = 0; i < num; i++) {
            str += '★';
        }
        return str;
    }
    const onSubscribe = async (num) => {
        window.open('http://pf.kakao.com/_xgKMUb/chat');
        //navigate(`/payready/${num}`, { state: { item_pk: num } });
    }
    const getExistingPossessionByNumber = (num) => {
        if (num == 0) {
            return "신규";
        } else if (num == 1) {
            return "보유중";
        } else if (num == 2) {
            return "매도";
        } else {
            return "---";
        }
    }
    const getContactComment = (data) => {
        let user_data = getLocalStorage('auth');
        if (user_data?.user_level == 0) {
            if (!data?.landlord_pk) {
                return "임대인 선택 전";
            }
            if (data?.lessee_appr < 1) {
                return "수락 대기중";
            }
            if (data?.landlord_appr < 1) {
                return "임대인 수락 대기중";
            }
            return "완료";
        }
        if (user_data?.user_level == 5) {
            if (!data?.lessee_pk) {
                return "임차인 선택 전";
            }
            if (data?.lessee_appr < 1) {
                return "임차인 수락 대기중";
            }
            if (data?.landlord_appr < 1) {
                return "수락 대기중";
            }
            return "완료";
        }
        if (user_data?.user_level == 10) {
            if (!data?.landlord_pk) {
                return "임대인 선택 전";
            }
            if (!data?.lessee_pk) {
                return "임차인 선택 전";
            }
            if (data?.landlord_appr < 1) {
                return "임대인 수락 대기중";
            }
            if (data?.lessee_appr < 1) {
                return "임차인 수락 대기중";
            }
            return "완료";
        }
        return "";
    }
    const goToContractDetail = (data) => {
        let user_data = getLocalStorage('auth');
        if (user_data?.user_level == 10) {
            navigate(`/addcontract/${data?.pk}`);
        } else {
            navigate(`/contract/${data?.pk}`);
        }
    }
    const goToLink = (data) => {
        let user_data = getLocalStorage('auth');
        if (table == 'request')
            navigate(`/request/${data?.pk}`);
        if (table == 'notice')
            navigate(`/post/notice/${data?.pk}`);
        if (table == 'faq')
            navigate(`/post/faq/${data?.pk}`);

    }
    return (
        <>
            {loading ?
                <>
                </>
                :
                <>
                    <div className='subtype-container' style={{ overflowX: 'auto', display: 'flex', width: '100%', margin: '8px auto', marginBottom: marginBottom }} >
                        <Table style={{ fontSize: `${fontSize ? fontSize : ''}` }}>
                            <Tr style={{ fontWeight: `${columnsBold ? 'bold' : ''}` }}>
                                {columns && columns.map((item, idx) => (
                                    <>
                                        <Td style={{ width: item.width }}>{item.name}</Td>
                                    </>
                                ))}
                            </Tr>
                            {data && data.map((item, idx) => (
                                <Tr onClick={() => { click ? onClickEvent(`${click + '/' + item.pk}`) : onClickEvent(``) }}>
                                    {columns && columns.map((column, idx) => (
                                        <>
                                            <Td style={{ width: column.width, color: `${column.color ? column.color : ''}`, cursor: `${isPointer ? 'pointer' : ''}`, fontWeight: `${column.bold ? 'bold' : ''}` }}>
                                                {column.type == 'img' ?
                                                    <img src={backUrl + item[column.column]} alt="#" style={{ height: '36px' }} /> ?? "---"
                                                    :
                                                    null}
                                                {column.type == 'is_subscribe' ?
                                                    <AddButton style={{ width: '84px', background: `${item[column.column] ? theme.color.background1 : '#fff'}`, color: `${item[column.column] ? '#fff' : theme.color.font1}`, border: `1px solid ${theme.color.background1}` }}
                                                        onClick={() => (item[column.column] ? null : addSubscribeMaster(item.pk))}>
                                                        {item[column.column] ? '구독완료' : '구독'}
                                                    </AddButton> ?? "---"
                                                    :
                                                    null}
                                                {column.type == 'is_request_com' ?
                                                    item['status'] == 1 ?
                                                        <div style={{ color: theme.color.blue }}>답변완료</div>
                                                        :
                                                        <div style={{ color: theme.color.red }}>답변대기</div>
                                                    :
                                                    null}
                                                {column.type == 'text' ?
                                                    item[column.column] ?? "---"
                                                    :
                                                    null}
                                                {column.type == 'link' ?
                                                    <IconButton onClick={() => {
                                                        goToLink(item)
                                                    }}>
                                                        <Icon icon="ph:eye" />
                                                    </IconButton>
                                                    :
                                                    null}
                                                {column.type == 'go_pay' ?
                                                    <IconButton onClick={() => {
                                                        navigate(`/payready/${item?.pk}`)
                                                    }}>
                                                        <Icon icon="ri:money-dollar-circle-line" style={{ color: theme.color.background1 }} />
                                                    </IconButton>
                                                    :
                                                    null}
                                                {column.type == 'contract_comment' ?
                                                    getContactComment(item) ?? "---"
                                                    :
                                                    null}
                                                {column.type == 'date' ?
                                                    item[column.column].substring(0, 10)
                                                    :
                                                    null}
                                                {column.type == 'contract_detail' ?
                                                    <IconButton onClick={() => {
                                                        goToContractDetail(item)
                                                    }}>
                                                        <Icon icon="ph:eye" />
                                                    </IconButton>
                                                    :
                                                    null}
                                                {column.type == 'class_status' ?
                                                    <TextButton style={{ height: '22px' }} onClick={() => { onSubscribe(item?.academy_category_pk) }}>수강신청</TextButton>
                                                    :
                                                    null}
                                                {column.type == 'star' ?
                                                    getStarBynum(parseInt(item[column.column])) ?? "---"
                                                    :
                                                    null}

                                                {column.type == 'number' ?
                                                    commarNumber(item[column.column]) ?? "---"
                                                    :
                                                    null}
                                                {column.type == 'won' ?
                                                    `${commarNumber(item[column.column])}원` ?? "---"
                                                    :
                                                    null}
                                                {column.type == 'month' ?
                                                    commarNumber(item[column.column]) + '月'
                                                    :
                                                    null}
                                                {column.type == 'subscribe_date' ?
                                                    item[column?.column] ? item[column?.column].substring(5, 10).replaceAll("-", ".") : "---"
                                                    :
                                                    null}
                                                {column.type == 'existing_possession' ?
                                                    getExistingPossessionByNumber(item[column.column])
                                                    :
                                                    null}
                                                {column.type == 'day' ?
                                                    commarNumber(item[column.column]) + '일'
                                                    :
                                                    null}
                                                {column.type == 'end_date' ?
                                                    `${item['start_date'] && item['start_date'].substring(0, 10)} ~ ${item[column.column] && item[column.column].substring(0, 10)}`
                                                    :
                                                    null}
                                                {column.type == 'percent' ?
                                                    `${item[column.column] >= 0 ? '+' : '-'}` + commarNumber(item[column.column]) + '%'
                                                    :
                                                    null}
                                                {column.type == 'delete' ?
                                                    <RiDeleteBinLine style={{ cursor: 'pointer', fontSize: theme.size.font4 }} onClick={() => deleteItem(item.pk, table, column.name)} />
                                                    :
                                                    null}
                                            </Td>
                                        </>
                                    ))}
                                </Tr>
                            ))}

                        </Table>
                    </div>
                    {data.length == 0 ?
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '250px', alignItems: 'center' }}
                            >
                                <div style={{ margin: 'auto auto 8px auto' }}>
                                    <Icon icon="material-symbols:cancel-outline" style={{ fontSize: '52px', color: theme.color.background1 }} />
                                </div>
                                <div style={{ margin: '8px auto auto auto' }}>
                                    데이터가 없습니다.
                                </div>
                            </motion.div>
                        </>
                        :
                        <>
                        </>}
                </>}

        </>
    )
}
export default ContentTable;