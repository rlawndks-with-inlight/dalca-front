import { useNavigate, useParams } from "react-router-dom";
import { commarNumber, formatPhoneNumber, getKoLevelByNum, getKoPayCategoryByNum, getMoneyByCardPercent, returnCardInfoMask } from "../functions/utils";
import axios from "axios";
import { backUrl, socket } from "../data/Data";
import AddButton from "./elements/button/AddButton";
import theme from "../styles/theme";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ContentWrappers, InputComponent, MiniButton, RowContainer, RowContent, TextButton, twoOfThreeButtonStyle, borderButtonStyle } from "./elements/UserContentTemplete";
import { objHistoryListContent } from "../data/ContentData";
import { Button, Dialog, DialogContent, IconButton } from "@mui/material";
import { Icon } from "@iconify/react";
import { getLocalStorage } from "../functions/LocalStorage";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { getPayCategory, getPayStatus, getPointHistoryByNum, getUserLevelByNumber } from "../functions/format";
import NoneDataSrc from '../assets/images/test/none-data.svg'
import EyeIconSrc from '../assets/images/icon/eye.svg'
import DeleteIconSrc from '../assets/images/icon/delete.svg'
import HistoryIconSrc from '../assets/images/icon/history.svg'
import $ from 'jquery';

const Table = styled.div`
font-size:${props => props.theme.size.font4};
width:100%;
text-align:center;
min-width:350px;
row-gap: 1rem;
display: flex;
flex-direction: column;
`
const Tr = styled.div`
display: flex;
flex-wrap: wrap;
row-gap: 0.75rem;
align-items: center;
`
const Td = styled.div`
width: 25%;
font-size:${props => props.theme.size.font5};
text-align: left;
word-break: break-all;
`
const ContentTable = (props) => {
    const navigate = useNavigate();
    const params = useParams();
    const { data, click, schema, table, isPointer, addSubscribeMaster, columnsBold, marginBottom, fontSize, pageSetting, onClickList, onClickEditButton, checkOnlyOne, auth } = props;
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [setting, setSetting] = useState({});
    const [userData, setUserData] = useState({});
    const onClickEvent = (str) => {
        if (str) {
            navigate(str)
        }
    }
    useEffect(() => {
        setLoading(true);
        setColumns(objHistoryListContent[schema]?.columns);
        let user_data = getLocalStorage('auth');
        setUserData(user_data);
        if (table == 'pay') {
            getSetting();
        }
    }, [])

    const getSetting = async () => {
        const { data: res_setting } = await axios.get(`/api/item?table=setting&pk=1`);
        setSetting(res_setting?.data);

    }
    useEffect(() => {
        if (columns && columns.length > 0) {
            setLoading(false);
        }
    }, [columns])

    const deleteItem = async (pk, table, cha, page_pk) => {
        Swal.fire({
            title: `정말로 ${cha ?? '삭제'}하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (result.isConfirmed) {
                let obj = {
                    pk: pk,
                    table: table,
                    page_pk: page_pk ?? 0
                }
                const { data: response } = await axios.post(`/api/deleteitembyuser`, obj);
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

    const getPayMonth = (data) => {

    }
    const sendSmsOnMissPay = async (data) => {
        Swal.fire({
            title: `미납문자 발송 하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (result.isConfirmed) {

                let fix_phone = data?.lessee_phone;
                for (var i = 0; i < fix_phone.length; i++) {
                    if (isNaN(parseInt(fix_phone[i]))) {
                        alert("전화번호는 숫자만 입력해 주세요.");
                        return;
                    }
                }
                fix_phone = fix_phone.replaceAll('-', '');
                fix_phone = fix_phone.replaceAll(' ', '');
                let string = `\n${data?.pay_category == 0 ? `${data?.day} ` : ``}${getKoPayCategoryByNum(data?.pay_category)} 미납문자 알림 드립니다.\n\n-달카페이-`;
                try {
                    const { data: response } = await axios.post(`/api/sendsms`, {
                        receiver: [fix_phone, formatPhoneNumber(fix_phone)],
                        content: string
                    })
                    if (response?.result > 0) {
                        toast.success('성공적으로 발송되었습니다.');

                    } else {
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        })
    }
    const onWantPayCancel = async (pk) => {
        Swal.fire({
            title: `결제취소 요청을 하시겠습니까?`,
            showCancelButton: true,
            confirmButtonText: '요청하기',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { data: response } = await axios.post('/api/wantpaycancel', {
                    pay_pk: pk
                })
                if (response?.result > 0) {
                    socket.emit('message', {
                        method: 'want_pay_cancel',
                        data: {
                            pk: pk
                        }
                    });
                    toast.success('취소요청이 성공적으로 발송되었습니다.');
                } else {
                    toast.error(response?.message);
                }
            }
        })
    }

    const [openPayReady, setOpenPayReady] = useState(false);
    const [dialogPayItem, setDialogPayItem] = useState({});
    const onPayByDirect = () => {
        if (dialogPayItem?.status == 0) {
            Swal.fire({
                title: '결제 하시겠습니까?',
                showCancelButton: true,
                confirmButtonText: '확인',
                cancelButtonText: '취소'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    let obj = {
                        amount: (dialogPayItem?.pay_category == 1 || dialogPayItem?.pay_category == 2)
                            ?
                            dialogPayItem?.price
                            :
                            getMoneyByCardPercent(dialogPayItem?.price, setting?.card_percent),
                        ord_num: `${userData?.pk}${dialogPayItem?.pk}${new Date().getTime()}`,
                        item_name: `${dialogPayItem?.contract_pk}번 계약 ${dialogPayItem?.pay_category == 0 ? `${dialogPayItem?.day.substring(0, 7)} ` : ''} ${getKoPayCategoryByNum(dialogPayItem?.pay_category)}`,
                        buyer_name: userData?.name,
                        buyer_phone: userData?.phone,
                        return_url: `https://dalcapay.com:8443/api/payresult`,
                        temp: dialogPayItem?.pk,
                    }
                    let query = Object.entries(obj).map(e => e.join('=')).join('&');
                    window.location.href = `https://noti.payvery.kr/dalca/v2/pay/auth/koneps?${query}`;
                    // const { data: response } = await axios.post('/api/paydirect', {
                    //     item_pk: item?.pk
                    // });
                    // console.log(response);
                    // if (response?.result > 0) {
                    //     toast.success("성공적으로 결제 되었습니다.");
                    //     navigate(`/history/pay`, {
                    //         state: {
                    //             contract_pk: item?.contract_pk
                    //         }
                    //     })
                    // } else {
                    //     toast.error(response?.message);
                    // }
                }
            })
        } else {
            navigate('/history/pay')
        }
    }
    const returnPayStatus = () => {
        if (dialogPayItem?.pay_category == 1 || dialogPayItem?.pay_category == 2) {
            return '결제불가'
        }
        if (dialogPayItem?.status == 1) {
            return '결제완료'
        } else if (dialogPayItem?.status == 0) {
            return '결제하기'

        } else if (dialogPayItem?.status == -1) {
            return '취소완료'
        }
    }
    return (
        <>
            <Dialog open={openPayReady}
                sx={{
                    zIndex: '99'
                }}
                PaperProps={{
                    style: {
                        borderRadius: '1rem'
                    }
                }}
                onClose={() => {
                    setOpenPayReady(false);
                    setDialogPayItem({});
                }}>
                <DialogContent style={{ columnGap: '1rem', display: 'flex', width: `${window.innerWidth > 1000 ? '500px' : '70vw'}` }}>
                    <ContentWrappers style={{ fontSize: theme.size.font5, rowGap: '0.5rem', marginBottom: '0' }}>
                        <div style={{ margin: '0.5rem auto 1rem auto', fontSize: theme.size.font4, fontWeight: 'bold' }}>납부하기</div>
                        <RowContent style={{ justifyContent: 'space-between' }}>
                            <div style={{ color: theme.color.font5 }}>계약고유번호</div>
                            <div>{dialogPayItem?.contract_pk}</div>
                        </RowContent>
                        <RowContent style={{ justifyContent: 'space-between' }}>
                            <div style={{ color: theme.color.font5 }}>종류</div>
                            <div>{getKoPayCategoryByNum(dialogPayItem?.pay_category)}</div>
                        </RowContent>
                        <RowContent style={{ justifyContent: 'space-between', paddingBottom: '1rem' }}>
                            <div style={{ color: theme.color.font5 }}>결제예정일</div>
                            <div>{dialogPayItem?.day?.replaceAll('-', '.')}</div>
                        </RowContent>
                        <RowContent style={{ justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${theme.color.font5}`, paddingTop: '1rem' }}>
                            <div style={{ color: theme.color.font5 }}>금액</div>
                            <div style={{ fontSize: theme.size.font4, fontWeight: 'bold' }}>{commarNumber(
                                (dialogPayItem?.pay_category == 1 || dialogPayItem?.pay_category == 2)
                                    ?
                                    dialogPayItem?.price
                                    :
                                    getMoneyByCardPercent(dialogPayItem?.price, setting?.card_percent)
                            )}원</div>
                        </RowContent>
                        <Button variant="text" sx={{ ...twoOfThreeButtonStyle, marginTop: '2rem' }} disabled={dialogPayItem?.pay_category == 1 || dialogPayItem?.pay_category == 2} onClick={() => {
                            onPayByDirect();
                        }}>{returnPayStatus()}</Button>
                        <Button variant="text" sx={{ ...twoOfThreeButtonStyle, ...borderButtonStyle }} onClick={() => {
                            setOpenPayReady(false);
                            setDialogPayItem({});
                        }}>취소</Button>
                    </ContentWrappers>
                </DialogContent>
            </Dialog>
            {loading ?
                <>
                </>
                :
                <>
                    <div className='subtype-container' style={{ overflowX: 'auto', display: 'flex', width: '100%', margin: '8px auto', marginBottom: marginBottom }} >
                        <Table style={{ fontSize: `${fontSize ? fontSize : ''}` }}>
                            {/* <Tr style={{ fontWeight: `${columnsBold ? 'bold' : ''}` }}>
                                {columns && columns.map((item, idx) => (
                                    <>
                                        <Td style={{ width: item.width }}>{item.name}</Td>
                                    </>
                                ))}
                            </Tr> */}
                            {data && data.map((item, index) => (
                                <Tr onClick={() => {
                                    if (onClickList) {
                                        onClickList(item, index)
                                    }
                                }} style={{ cursor: `${onClickList ? 'pointer' : ''}` }}>
                                    {columns && columns.map((column, idx) => (
                                        <>
                                            {column.name &&
                                                <>
                                                    <Td style={{ width: item.width, color: theme.color.font5 }}>{column.name}</Td>
                                                </>}
                                            <Td style={{ width: column.width, color: `${column.color ? column.color : ''}`, cursor: `${isPointer ? 'pointer' : ''}`, fontWeight: `500`, textAlign: column?.text_align }}>
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
                                                {column.type == 'card_percent_add_price' ?
                                                    <>
                                                        {item?.card_percent ?
                                                            <>
                                                                {commarNumber(item?.price * (100 + item?.card_percent) / 100)}
                                                            </>
                                                            :
                                                            <>
                                                                ---
                                                            </>
                                                        }
                                                    </>
                                                    :
                                                    null}
                                                {column.type == 'change_pay_status' ?
                                                    <>
                                                        <RowContainer style={{ alignItems: 'center', columnGap: '0.5rem' }}>
                                                            {getPayStatus(item)}
                                                            {(item?.status == 0 || item?.status == 1) ?
                                                                <>
                                                                    <MiniButton style={{ background: theme.color.background0, color: '#B87A1D' }} onClick={() => {
                                                                        navigate(`/change_pay_status`, {
                                                                            state: item?.pk
                                                                        })
                                                                    }}>{`상태변경`}</MiniButton>
                                                                </>
                                                                :
                                                                <>
                                                                </>
                                                            }
                                                        </RowContainer>
                                                    </>
                                                    :
                                                    null}
                                                {column.type == 'title_link' ?
                                                    <>
                                                        <div style={{ textAlign: 'left', cursor: 'pointer', }} onClick={() => {
                                                            goToLink(item)
                                                        }}>{item.title}</div>
                                                    </>
                                                    :
                                                    <>
                                                    </>}
                                                {column.type == 'link' ?
                                                    <img src={EyeIconSrc} style={{ cursor: 'pointer' }} onClick={() => {
                                                        goToLink(item)
                                                    }} />
                                                    :
                                                    null}
                                                {column.type == 'check' ?
                                                    <input type={'checkbox'} id={`${schema}-${item?.pk}`} name={`${schema}-check`} onChange={(e) => checkOnlyOne(e.target)} />
                                                    :
                                                    null}
                                                {column.type == 'pay_check' ?
                                                    <input type={'checkbox'} id={`${schema}-${item?.pk}`} name={`${schema}-check`} onChange={(e) => checkOnlyOne(e.target)} />
                                                    :
                                                    null}
                                                {column.type == 'go_pay' ?
                                                    <>
                                                        {item?.lessee_pk == getLocalStorage('auth')?.pk ?
                                                            <>
                                                                <MiniButton style={{ background: theme.color.background2, color: '#fff' }} onClick={() => {
                                                                    setDialogPayItem(item);
                                                                    setOpenPayReady(true);
                                                                }}>{item?.status == 0 ? `납부하기` : `납부완료`}</MiniButton>
                                                            </>
                                                            :
                                                            <>
                                                                ---
                                                            </>}
                                                    </>
                                                    :
                                                    null}
                                                {column.type == 'pay_type' ?
                                                    item['type'] == 1 ?
                                                        <div>현금</div>
                                                        :
                                                        <div>카드</div>
                                                    :
                                                    null}
                                                {column.type == 'want_cancel' ?
                                                    <>

                                                        {item?.status == 1 && item?.is_want_cancel == 0 ?
                                                            <>
                                                                <MiniButton style={{ background: theme.color.background0, color: '#B87A1D' }} onClick={() => {
                                                                    onWantPayCancel(item?.pk)
                                                                }}>{`취소요청`}</MiniButton>
                                                            </>
                                                            :
                                                            <>
                                                                {item?.status == 1 ?
                                                                    <>
                                                                        {item?.is_want_cancel == 1 ? '취소요청완료' : ''}
                                                                        {item?.is_want_cancel == -1 ? '취소완료' : ''}
                                                                    </>
                                                                    :
                                                                    <>
                                                                    </>}
                                                            </>}
                                                    </>
                                                    :
                                                    null}
                                                {column.type == 'go_pay_list' ?
                                                    <img src={HistoryIconSrc} style={{ cursor: 'pointer' }} onClick={() => {
                                                        navigate(`/history/pay`, {
                                                            state: {
                                                                contract_pk: item?.pk
                                                            }
                                                        })
                                                    }} />
                                                    :
                                                    null}
                                                {column.type == 'send_miss_pay' ?
                                                    <>
                                                        {item?.status == 0 ?
                                                            <>
                                                                <MiniButton style={{ background: theme.color.background0, color: '#B87A1D' }} onClick={() => {
                                                                    sendSmsOnMissPay(item)

                                                                }}>{`발송하기`}</MiniButton>
                                                            </>
                                                            :
                                                            <>
                                                                ---
                                                            </>}
                                                    </>


                                                    :
                                                    null}
                                                {column.type == 'contract_comment' ?
                                                    getContactComment(item) ?? "---"
                                                    :
                                                    null}
                                                {column.type == 'pay_month' ?
                                                    getPayMonth(item) ?? "---"
                                                    :
                                                    null}
                                                {column.type == 'card_number' ?
                                                    returnCardInfoMask('cardNumber', item?.card_number ?? "")
                                                    :
                                                    null}
                                                {column.type == 'pay_status' ?
                                                    getPayStatus(item) ?? "---"
                                                    :
                                                    null}
                                                {column.type == 'point_history' ?
                                                    getPointHistoryByNum(item) ?? "---"
                                                    :
                                                    null}
                                                {column.type == 'pay_category' ?
                                                    getKoPayCategoryByNum(item?.pay_category) ?? "---"
                                                    :
                                                    null}
                                                {column.type == 'level' ?
                                                    getUserLevelByNumber(item[column.column])
                                                    :
                                                    null}
                                                {column.type == 'date' ?
                                                    <div style={{ textAlign: 'left', padding: '0', color: theme.color.font5 }}>
                                                        {item[column.column].substring(0, 10).replaceAll('-', '.')}
                                                    </div>
                                                    :
                                                    null}
                                                {column.type == 'contract_detail' ?
                                                    <img src={EyeIconSrc} style={{ cursor: 'pointer' }} onClick={() => {
                                                        goToContractDetail(item)
                                                    }} />
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
                                                {column.type == 'edit' ?
                                                    <IconButton onClick={() => {
                                                        if (onClickEditButton) {
                                                            onClickEditButton(item, index)
                                                        }
                                                    }}>
                                                        <Icon icon="material-symbols:edit-outline-rounded" />
                                                    </IconButton>
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
                                                    <>
                                                        {item[column.column] == 0 ?
                                                            <>
                                                                ---
                                                            </>
                                                            :
                                                            <>
                                                                {`${item[column.column] >= 0 ? '+' : '-'}` + commarNumber(item[column.column]) + '%'}
                                                            </>}
                                                    </>
                                                    :
                                                    null}
                                                {column.type == 'delete' ?
                                                    <img src={DeleteIconSrc} style={{ cursor: 'pointer' }} onClick={() => deleteItem(item.pk, table, column.name, params?.pk)} />
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
                                <img src={NoneDataSrc} style={{ margin: 'auto auto 8px auto' }} />
                                <div style={{ margin: '8px auto auto auto' }}>
                                    데이터가 없습니다
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