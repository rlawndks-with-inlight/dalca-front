import { useNavigate } from "react-router-dom";
import { commarNumber } from "../functions/utils";
import { RiDeleteBinLine } from 'react-icons/ri'
import axios from "axios";
import { backUrl } from "../data/Data";
import AddButton from "./elements/button/AddButton";
import theme from "../styles/theme";
import { useEffect } from "react";
import styled from "styled-components";
import { TextButton } from "./elements/UserContentTemplete";

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
`
const ContentTable = (props) => {
    const navigate = useNavigate();
    const { columns, data, click, schema, isPointer, addSubscribeMaster, columnsBold, marginBottom, fontSize, pageSetting } = props;
    const onClickEvent = (str) => {
        if (str) {
            navigate(str)
        }
    }
    useEffect(()=>{

    },[data])
    const deleteItem = async (pk, schema, cha) => {
        if (window.confirm(`정말로 ${cha ?? '삭제'}하시겠습니까?`)) {
            let obj = {
                pk: pk,
                table: schema
            }
            const { data: response } = await axios.post(`/api/deleteitem`, obj)

            if (response.result > 0) {
                alert('삭제되었습니다.');
                pageSetting();
            } else {
                alert('error')
            }
        }
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
    return (
        <>
            <div className='subtype-container' style={{ overflowX: 'auto', display: 'flex', width: '100%', margin: '8px auto', marginBottom: marginBottom }} >
                <Table style={{ fontSize: `${fontSize ? fontSize : ''}` }}>
                    <Tr style={{ fontWeight: `${columnsBold ? 'bold' : ''}`, fontWeight: `${schema == 'master_subscribe' ? 'bold' : ''}` }}>
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
                                        {column.type == 'text' ?
                                            item[column.column] ?? "---"
                                            :
                                            null}
                                           {column.type == 'class_status' ?
                                           <TextButton style={{height:'22px'}} onClick={()=>{onSubscribe(item?.academy_category_pk)}}>수강신청</TextButton>
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
                                            `${item['start_date'] && item['start_date'].substring(0,10)} ~ ${item[column.column] && item[column.column].substring(0,10)}`
                                            :
                                            null}
                                        {column.type == 'percent' ?
                                            `${item[column.column] >= 0 ? '+' : '-'}` + commarNumber(item[column.column]) + '%'
                                            :
                                            null}
                                        {column.type == 'delete' ?
                                            <RiDeleteBinLine style={{ cursor: 'pointer',fontSize:theme.size.font4 }} onClick={() => deleteItem(item.pk, schema, column.name)} />
                                            :
                                            null}
                                    </Td>
                                </>
                            ))}
                        </Tr>
                    ))}

                </Table>
            </div>
        </>
    )
}
export default ContentTable;