//내역
import axios from "axios";
import { useEffect, useState } from "react";
import { HalfTitle, SelectType, Type, Wrappers } from "../../../components/elements/UserContentTemplete";
import { getLocalStorage } from "../../../functions/LocalStorage";
import styled from "styled-components";
import theme from "../../../styles/theme";
import { range } from "../../../functions/utils";
import MBottomContent from "../../../components/elements/MBottomContent";
import PageButton from "../../../components/elements/pagination/PageButton";
import PageContainer from "../../../components/elements/pagination/PageContainer";
import { toast } from "react-hot-toast";
import UserCard from "../../../components/UserCard";
import { motion } from "framer-motion";
import Loading from "../../../components/Loading";


const CustomerInfo = () => {

    const [levelList, setLevelList] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(-1);
    const [page, setPage] = useState(1);
    const [pageList, setPageList] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const default_level_list = [
        { level: 10, name: '공인중개사' },
        { level: 5, name: '임대인' },
        { level: 0, name: '임차인' },
    ]
    useEffect(() => {
        setting();
    }, [])
    const setting = async () => {
        let user_data = getLocalStorage('auth');
        let level_list = [];
        for (var i = 0; i < default_level_list.length; i++) {
            if (default_level_list[i].level != user_data?.user_level) {
                level_list.push(default_level_list[i]);
            }
        }
        setLevelList(level_list);
        getCustomerInfo(level_list[0].level, 1);
    }
    const getCustomerInfo = async (level, page) => {
        setLoading(true);
        setCurrentLevel(level);
        setPage(page);
        const { data: response } = await axios.get(`/api/customer-info?level=${level}&page=${page}`);
        if (response?.result < 0) {
            toast.error(response?.message);
            return;
        }
        setUsers(response?.data?.data);
        setPageList(range(1, response?.data?.maxPage));
        setLoading(false);
    }
    return (
        <>
            <Wrappers>

                <HalfTitle>고객정보조회</HalfTitle>
                <SelectType className="select-type">
                    {levelList && levelList.map((item, idx) => (
                        <>
                            <Type style={{ border: `1px solid ${currentLevel == item?.level ? theme.color.background2 : '#fff'}`, color: `${currentLevel == item?.level ? theme.color.background2 : (localStorage.getItem('dark_mode') ? '#fff' : '#ccc')}` }} onClick={() => {
                                getCustomerInfo(item?.level, 1)
                            }}>{item.name}</Type>
                        </>
                    ))}
                </SelectType>
                {loading ?
                    <>
                        <Loading />
                    </>
                    :
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '250px' }}
                        >
                            {users && users.map((item, idx) => (
                                <>
                                    <UserCard
                                        data={item}
                                    />
                                </>
                            ))}
                        </motion.div>
                    </>}
                <MBottomContent>
                    <div />
                    <PageContainer>
                        <PageButton onClick={() => getCustomerInfo(currentLevel, 1)} style={{ color: '#000', background: '#fff', border: '1px solid #ccc' }}>
                            처음
                        </PageButton>
                        {pageList.map((item, index) => (
                            <>
                                <PageButton onClick={() => getCustomerInfo(currentLevel, item)} style={{ color: `${page == item ? '#000' : ''}`, background: `${page == item ? theme.color.background1 : ''}`, display: `${Math.abs(index + 1 - page) > 4 ? 'none' : ''}` }}>
                                    {item}
                                </PageButton>
                            </>
                        ))}
                        <PageButton onClick={() => getCustomerInfo(currentLevel, pageList.length ?? 1)} style={{ color: '#000', background: '#fff', border: '1px solid #ccc' }}>
                            마지막
                        </PageButton>
                    </PageContainer>
                    <div />
                </MBottomContent>
            </Wrappers>
        </>
    )
}
export default CustomerInfo;