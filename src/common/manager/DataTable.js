import React from 'react'
import styled from 'styled-components'
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BiEditAlt } from 'react-icons/bi'
import { RiDeleteBinLine } from 'react-icons/ri'
import { CgToggleOn, CgToggleOff } from 'react-icons/cg'
import axios from 'axios';
import theme from '../../styles/theme';
import { objManagerListContent } from '../../data/Manager/ManagerContentData';
import $ from 'jquery'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper'
import DataTr from './DataTr';
const Table = styled.table`
width:95%;
margin:0 auto;
border-spacing: 0 10px;
min-width:900px;
`
const Tr = styled.tr`
box-shadow:1px 1px 1px #00000029;
font-size:14px;
background:#fff;
color:${props => props.theme.color.manager.font2};
`
const Td = styled.td`
text-align:center;
padding:14px 0;
margin-bottom:6px;
`
const DataTable = (props) => {
    const { column, data, schema, opTheTopItem, changeItemSequence, deleteItem, changeStatus, width, onPayCancel } = props;
    const navigate = useNavigate();
    const [zStatus, setZStatus] = useState([]);
    const [posts, setPosts] = useState([]);
    const [firstPosts, setFirstPosts] = useState([])
    const [isChange, setIsChange] = useState(false)
    useEffect(() => {
        setPosts(data)
        setFirstPosts(data)
    }, [])

    useEffect(() => {
        if (!isChange) {
            setIsChange(true)
        } else {
        }
    }, [posts])

    const moveCard = useCallback((dragIndex, hoverIndex, itemPk) => {
        setPosts((prevCards) =>
            update(prevCards, {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, prevCards[dragIndex]],
                ],
            }),
        )
    }, [])
    const renderCard = useCallback((card, index, column, list) => {
        return (
            <DataTr
                key={card.pk}
                index={index}
                id={card.pk}
                sort={card.sort}
                data={card}
                moveCard={moveCard}
                column={column}
                schema={objManagerListContent[`${schema}`].schema}
                list={list}
                opTheTopItem={opTheTopItem}
                deleteItem={deleteItem}
                changeItemSequence={changeItemSequence}
                changeStatus={changeStatus}
                onPayCancel={onPayCancel}
                obj={objManagerListContent[`${schema}`]}
            />
        )
    }, [])

    return (
        <>
            <div style={{ marginBottom: '16px',width:`${width?'95%':'100%'}`,margin:'0 auto', overflowX: 'auto' }} className='scroll-table'>
                <Table style={{ width: `${width ? width : ''}` }}>
                    <Tr style={{ fontWeight: 'bold', background: `${theme.color.manager.background1}18`, fontSize: '16px' }}>
                        {column.map((item, index) => (
                            <>
                                <Td key={index} style={{ width: `${item.width}%` }}>{item.name}</Td>
                            </>
                        ))}
                    </Tr>
                    <DndProvider backend={HTML5Backend}>
                        {posts && posts.map((data, idx) =>
                            renderCard(data, idx, column, posts)
                        )}
                    </DndProvider>
                </Table>
            </div>

        </>
    )
}
export default DataTable;