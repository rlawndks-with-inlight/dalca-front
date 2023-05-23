import { AiOutlineSearch } from "react-icons/ai";
import styled from "styled-components";
import AddButton from "../../components/elements/button/AddButton";
import { Input, Row, Select } from "../../components/elements/ManagerTemplete";
import { objManagerListContent } from "../../data/Manager/ManagerContentData";
import $ from 'jquery';
import { excelDownload, makeQueryObj, returnMoment } from "../../functions/utils";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import { SiMicrosoftexcel } from "react-icons/si";
import { useEffect } from "react";
import { useState } from "react";

const OptionCardWrappers = styled.div`
width:95%;
margin:0.5rem auto;
border-spacing: 0 10px;
box-shadow:1px 1px 1px #00000029;
font-size:14px;
background:#fff;
color:${props => props.theme.color.manager.font2};
`
const SearchContainer = styled.div`
display: flex; 
align-items: center;
margin-left: auto;
@media screen and (max-width:700px) {
    margin-left: 0;
}
`
const RowContent = styled.div`
display:flex;
align-items:center;
margin:12px 24px 12px 24px;
`
const ReturnOptionContentBySchema = (props) => {
    const { schema, onChangeType } = props;
    const [list, setList] = useState({});
    const [yearList, setYearList] = useState([])
    const month_list = [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    const [statisticsType, setStatisticsType] = useState('month');

    useEffect(() => {
        fetchPost();
    }, [schema])
    async function fetchPost() {
        let list_ = { ...list };
        if (schema == 'subscribe' || schema == 'bag' || schema == 'review') {
            list_ = {
                master: [],
                academy_category: []
            }
            const { data: response } = await axios.get(`/api/items?table=user&level=30`);
            list_['master'] = response?.data.map((item) => {
                return {
                    title: item?.nickname,
                    val: item?.pk
                }
            });
            const { data: response2 } = await axios.get(`/api/items?table=academy_category`);
            list_['academy_category'] = response2?.data.map((item) => {
                return {
                    title: item?.title.substring(0, 10),
                    val: item?.pk
                }
            });
            setList(list_);
        }
        if (schema == 'user_statistics') {
            let year = parseInt(returnMoment().substring(0, 4));
            let year_list = [];
            for (var i = 0; i < 10; i++) {
                if (year - i >= 2022) {
                    year_list.push(year - i);
                }
            }
            setYearList(year_list);
        }
    }
    const onChangeStatisticsType = (e) => {
        setStatisticsType(e.target.value);
        onChangeType();
    }
    const onChangeStatisticsYear = (e) => {
        $('.statistics_month').val(1);
        onChangeType();
    }
    if (schema == 'user') {
        return (
            <>
                <Select className='level' style={{ margin: '12px 24px 12px 24px' }} onChange={onChangeType}>
                    <option value={'all'}>전체유저</option>
                    <option value={0}>임차인</option>
                    <option value={5}>임대인</option>
                    <option value={10}>공인중개사</option>
                    <option value={-10}>불량회원</option>
                    <option value={40}>관리자</option>
                </Select>
            </>
        )
    }
    if (schema == 'user_statistics') {
        return (
            <>
                <Select className='statistics_type' style={{ margin: '12px 24px 12px 24px' }} onChange={onChangeStatisticsType}>
                    <option value={'month'}>월별 요약</option>
                    <option value={'day'}>일차별 요약</option>
                </Select>
                <Select className='statistics_year' style={{ margin: '12px 24px 12px 24px' }} onChange={onChangeStatisticsYear}>
                    {yearList.map((item, index) => (
                        <>
                            <option value={item}>{`${item}년`}</option>
                        </>
                    ))}
                </Select>
                {statisticsType == 'day' ?
                    <>
                        <Select className='statistics_month' style={{ margin: '12px 24px 12px 24px' }} onChange={onChangeType}>
                            {month_list.map((item) => (
                                <>
                                    {`${$('.statistics_year').val()}-${item < 10 ? '0' + item : item}` <= returnMoment().substring(0, 7) ?
                                        <>
                                            <option value={item}>{`${item}월`}</option>
                                        </>
                                        :
                                        <>
                                        </>
                                    }
                                </>
                            ))}
                        </Select>
                    </>
                    :
                    <>
                    </>
                }
            </>
        )
    }

}
const ReturnSecondOptionContentBySchema = (props) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { schema, onChangeType, onClickType } = props;
    useEffect(() => {
        settingOptionCard();
    }, [])
    const settingOptionCard = () => {
        let start_date = returnMoment().substring(0, 10);
        start_date = start_date.split('-');
        start_date[2] = '01';
        start_date = start_date.join('-');
        setStartDate(start_date);
        setEndDate(returnMoment().substring(0, 10));
        onChangeType();
    }
    const calculDate = () => {

    }
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
    if (schema == 'pay') {
        return (
            <>
                <OptionCardWrappers>
                    <Row style={{flexWrap:'wrap'}}>
                        <RowContent>
                            <AddButton style={{ margin: '0 0 0 0' }} onClick={() => onClickDate(-1)}>어제</AddButton>
                            <AddButton style={{ margin: '0 0 0 12px' }} onClick={() => onClickDate(1)}>당일</AddButton>
                            <AddButton style={{ margin: '0 0 0 12px' }} onClick={() => onClickDate(3)}>3일전</AddButton>
                            <AddButton style={{ margin: '0 0 0 12px' }} onClick={() => onClickDate(30)}>1개월</AddButton>
                        </RowContent>
                        <RowContent>
                            <Input className="start_date" type={'date'} style={{ margin: '0 0 0 0' }} onChange={onChangeType} defaultValue={startDate} />
                            <div style={{ margin: '0 0 0 12px', display: 'flex' }}>
                                ~
                            </div>
                            <Input className="end_date" type={'date'} style={{ margin: '0 0 0 12px' }} onChange={onChangeType} defaultValue={endDate} />
                        </RowContent>
                        <RowContent>
                            <Select className="status" style={{ margin: '0 0 0 0' }} onChange={onChangeType}>
                                <option value={'all'}>전체납부현황</option>
                                <option value={0}>납부안함</option>
                                <option value={1}>납부완료</option>
                                <option value={-1}>결제취소</option>
                            </Select>
                            
                        </RowContent>
                        <RowContent>
                            <Select className="pay_category" style={{ margin: '0 0 0 0' }} onChange={onChangeType}>
                                <option value={'all'}>전체종류</option>
                                <option value={0}>월세</option>
                                <option value={1}>보증금</option>
                                <option value={2}>계약금</option>
                                <option value={3}>부동산 중개수수료</option>
                            </Select>
                        </RowContent>
                        <RowContent>
                            <Select className="is_auto" style={{ margin: '0 0 0 0' }} onChange={onChangeType}>
                                <option value={'all'}>전체납부종류</option>
                                <option value={0}>일반납부</option>
                                <option value={1}>정기납부</option>
                            </Select>
                        </RowContent>
                    </Row>
                </OptionCardWrappers>
            </>
        )
    }
    if (schema == 'commission') {
        return (
            <>
                <OptionCardWrappers>
                    <Row style={{flexWrap:'wrap'}}>
                        <RowContent>
                            <AddButton style={{ margin: '0 0 0 0' }} onClick={() => onClickDate(-1)}>어제</AddButton>
                            <AddButton style={{ margin: '0 0 0 12px' }} onClick={() => onClickDate(1)}>당일</AddButton>
                            <AddButton style={{ margin: '0 0 0 12px' }} onClick={() => onClickDate(3)}>3일전</AddButton>
                            <AddButton style={{ margin: '0 0 0 12px' }} onClick={() => onClickDate(30)}>1개월</AddButton>
                        </RowContent>
                        <RowContent>
                            <Input className="start_date" type={'date'} style={{ margin: '0 0 0 0' }} onChange={onChangeType} defaultValue={startDate} />
                            <div style={{ margin: '0 0 0 12px', display: 'flex' }}>
                                ~
                            </div>
                            <Input className="end_date" type={'date'} style={{ margin: '0 0 0 12px' }} onChange={onChangeType} defaultValue={endDate} />
                        </RowContent>
                        <RowContent>
                            <Select className="status" style={{ margin: '0 0 0 0' }} onChange={onChangeType}>
                                <option value={'all'}>전체발생현황</option>
                                <option value={1}>발생</option>
                                <option value={-1}>취소</option>
                            </Select>
                        </RowContent>
                    </Row>
                </OptionCardWrappers>
            </>
        )
    }
    if (schema == 'contract') {
        return (
            <>
                <OptionCardWrappers>
                    <Row>
                        <RowContent>
                            <AddButton style={{ margin: '0 0 0 0' }} onClick={() => onClickDate(-1)}>어제</AddButton>
                            <AddButton style={{ margin: '0 0 0 12px' }} onClick={() => onClickDate(1)}>당일</AddButton>
                            <AddButton style={{ margin: '0 0 0 12px' }} onClick={() => onClickDate(3)}>3일전</AddButton>
                            <AddButton style={{ margin: '0 0 0 12px' }} onClick={() => onClickDate(30)}>1개월</AddButton>
                        </RowContent>
                        <RowContent>
                            <Input className="start_date" type={'date'} style={{ margin: '0 0 0 0' }} onChange={onChangeType} defaultValue={startDate} />
                            <div style={{ margin: '0 0 0 12px', display: 'flex' }}>
                                ~
                            </div>
                            <Input className="end_date" type={'date'} style={{ margin: '0 0 0 12px' }} onChange={onChangeType} defaultValue={endDate} />
                        </RowContent>
                        <RowContent>
                            <Select className="is_contract" style={{ margin: '0 0 0 0' }} onChange={onChangeType}>
                                <option value={'all'}>전체상태</option>
                                <option value={1}>계약완료</option>
                                <option value={0}>완료전</option>
                            </Select>
                        </RowContent>
                    </Row>
                </OptionCardWrappers>
            </>
        )
    }
    if (schema == 'point') {
        return (
            <>
                <OptionCardWrappers>
                    <Row>
                        <RowContent>
                            <AddButton style={{ margin: '0 0 0 0' }} onClick={() => onClickDate(-1)}>어제</AddButton>
                            <AddButton style={{ margin: '0 0 0 12px' }} onClick={() => onClickDate(1)}>당일</AddButton>
                            <AddButton style={{ margin: '0 0 0 12px' }} onClick={() => onClickDate(3)}>3일전</AddButton>
                            <AddButton style={{ margin: '0 0 0 12px' }} onClick={() => onClickDate(30)}>1개월</AddButton>
                        </RowContent>
                        <RowContent>
                            <Input className="start_date" type={'date'} style={{ margin: '0 0 0 0' }} onChange={onChangeType} defaultValue={startDate} />
                            <div style={{ margin: '0 0 0 12px', display: 'flex' }}>
                                ~
                            </div>
                            <Input className="end_date" type={'date'} style={{ margin: '0 0 0 12px' }} onChange={onChangeType} defaultValue={endDate} />
                        </RowContent>
                        <RowContent>
                            <Select className="status" style={{ margin: '0 0 0 0' }} onChange={onChangeType}>
                                <option value={'all'}>전체포인트</option>
                                <option value={1}>추가포인트</option>
                                <option value={-1}>취소포인트</option>
                            </Select>
                        </RowContent>
                    </Row>
                </OptionCardWrappers>
            </>
        )
    }
}
const OptionBox = (props) => {
    const params = useParams();
    const [search, setSearch] = useState({});
    const { onChangeType, schema, changePage, onchangeSelectPageCut, apiStr, onClickType, onSearch } = props;
    const exportExcel = async () => {
        let obj = {};
        obj['table'] = objManagerListContent[schema].schema;
        obj['keyword'] = $('.search').val();
        if (objManagerListContent[schema].is_move) {
            obj['order'] = 'sort';
        }
        for (var i = 0; i < objManagerListContent[schema].queries.length; i++) {
            if (objManagerListContent[schema].queries[i].split("=")[1]) {
                obj[objManagerListContent[schema].queries[i].split("=")[0]] = objManagerListContent[schema].queries[i].split("=")[1];
            } else {
                if ($(`.${objManagerListContent[schema].queries[i].split("=")[0]}`).val() != 'all') {
                    obj[objManagerListContent[schema].queries[i].split("=")[0]] = $(`.${objManagerListContent[schema].queries[i].split("=")[0]}`).val();
                }
            }
        }
        const { data: response } = await axios.post(apiStr, obj);
        //setPosts(response?.data);
        await excelDownload(response.data ?? [], objManagerListContent, schema);
    }

    return (
        <>
            <div style={{ overflowX: 'auto' }}>
                <OptionCardWrappers>
                    <Row>
                        <ReturnOptionContentBySchema schema={schema} onChangeType={onChangeType} />
                        <SearchContainer>
                            <Input style={{ margin: '12px 0 12px 24px', border: 'none' }} className='search' placeholder='두 글자 이상 입력해주세요.' onKeyPress={(e) => { e.key == 'Enter' ? changePage(1) : console.log("") }} defaultValue={search?.keyword} />
                            <AiOutlineSearch className='search-button' style={{ padding: '14px', cursor: 'pointer' }} onClick={() => changePage(1)} />
                        </SearchContainer>
                        <Select className='page-cut' style={{ margin: '12px 24px 12px 24px' }} onChange={onchangeSelectPageCut} defaultValue={search?.page_cut}>
                            <option value={10}>10개</option>
                            <option value={20}>20개</option>
                            <option value={50}>50개</option>
                            <option value={100}>100개</option>
                        </Select>

                        <AddButton style={{ margin: '12px 24px 12px 24px', width: '96px', alignItems: 'center', display: 'flex', justifyContent: 'space-around' }} onClick={exportExcel}><SiMicrosoftexcel /> 엑셀추출</AddButton>

                    </Row>

                </OptionCardWrappers>
                <ReturnSecondOptionContentBySchema schema={schema} onChangeType={onChangeType} onClickType={onClickType} />
            </div>
        </>
    )
}
export default OptionBox;