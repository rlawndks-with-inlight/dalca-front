//계약생성

import { colorButtonStyle, ContentWrappers, HalfTitle, InputComponent, postCodeStyle, smallButtonStyle, Wrappers } from "../../../components/elements/UserContentTemplete";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import theme from "../../../styles/theme";
import { motion } from "framer-motion";
import axios from "axios";
import Loading from "../../../components/Loading";
import { commarNumber, makeMaxPage, range } from "../../../functions/utils";
import ContentTable from "../../../components/ContentTable";
import MBottomContent from "../../../components/elements/MBottomContent";
import PageButton from "../../../components/elements/pagination/PageButton";
import PageContainer from "../../../components/elements/pagination/PageContainer";
import { objHistoryListContent } from "../../../data/ContentData";
import { NaverMap, Marker } from 'react-naver-maps';
import { RenderAfterNavermapsLoaded } from 'react-naver-maps';

const AroundRealEstate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState([])
    const [lat, setLat] = useState(null)
    const [lng, setLng] = useState(null)
    const [status, setStatus] = useState(null)
    const [pageList, setPageList] = useState([])
    const [page, setPage] = useState(1);
    const [allPosts, setAllPosts] = useState([]);
    const [centerLat, setCenterLat] = useState(37.3595704);
    const [centerLng, setCenterLng] = useState(127.105399);
    function getLocation(is_first) {
        if (navigator.geolocation) {
            if (is_first) {
                setLoading(true);
            }
            // GPS를 지원하면
            return new Promise(resolve => {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        resolve({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    function (error) {
                        console.error(error);
                        resolve({
                            latitude: 37.3595704,
                            longitude: 127.105399,
                        });
                    },
                    {
                        enableHighAccuracy: false,
                        maximumAge: 0,
                        timeout: Infinity,
                    },
                );
            }).then(async coords => {
                if (is_first) {
                    setCenterLat(coords?.latitude);
                    setCenterLng(coords?.longitude);
                    setLat(coords?.latitude);
                    setLng(coords?.longitude);
                }
                return coords;
            });
        }
        console.info('GPS를 지원하지 않습니다');
        return {
            latitude: 37.3595704,
            longitude: 127.105399,
        };
    }
    useEffect(() => {
        getLocation(true);
        getRealEstate(1);
    }, [])
    function getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2) {
        function deg2rad(deg) {
            return deg * (Math.PI / 180)
        }
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = deg2rad(lng2 - lng1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }
    const getRealEstate = async (num) => {
        let coords = undefined;
        coords = await getLocation();
        const { data: response } = await axios.get(`/api/items?table=real_estate&order=pk`);
        const { data: response2 } = await axios.get(`/api/items?table=user&order=pk&level=10`);
        let users = response2?.data;
        for (var i = 0; i < users.length; i++) {
            users[i]['name'] = users[i]['office_name'];
            users[i]['phone'] = users[i]['office_phone'];
            users[i]['address'] = users[i]['office_address'];
            users[i]['address_detail'] = '---';
            users[i]['lat'] = users[i]['office_lat'];
            users[i]['lng'] = users[i]['office_lng'];
        }
        console.log(users)
        let items = [...response?.data, ...users];
        setPageList(range(1, makeMaxPage(items.length, 10)))
        for (var i = 0; i < items.length; i++) {
            items[i]['distance'] = await getDistanceFromLatLonInKm(coords?.latitude, coords?.longitude, items[i]?.lat ?? 37.3595704, items[i]?.lng ?? 127.105399);
        }
        items = items.sort((a, b) => {
            if (a.distance > b.distance) return 1;
            if (a.distance < b.distance) return -1;
            return 0;
        });
        for (var i = 0; i < items.length; i++) {
            items[i]['distance'] = commarNumber(items[i]['distance']) + ' km';
        }
        console.log(items)
        setPosts(items);
        setPage(num);
        setLoading(false);
    }
    const onClickList = (item, idx) => {
        setLat(item?.lat);
        setLng(item?.lng);
        getRealEstate(page)
    }
    return (
        <>
            <Wrappers>
                {loading ?
                    <>
                        <Loading />
                    </>
                    :
                    <>
                        <ContentWrappers style={{ marginTop: '1rem' }}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '250px' }}
                            >
                                <HalfTitle>달카페이 회원부동산</HalfTitle>

                                {/* 네이버 지도 */}

                                <RenderAfterNavermapsLoaded	   // render 후 지도 호출(비동기 랜더링)
                                    ncpClientId={'p8k25t57ye'} // 지도서비스 Client ID
                                    error={<p>error</p>}
                                    loading={<p>Maps Loading</p>}
                                    submodules={["geocoder"]} //추가로 사용할 서브모듈이 있는경우
                                >
                                    <NaverMap
                                        id="react-naver-maps"
                                        style={{ width: '100%', height: '300px', outline: 'none' }}
                                        center={{ lat: lat, lng: lng }}
                                        disabled
                                        zoom={15}
                                        minZoom={10}
                                        maxZoom={19}
                                        mapTypeControl={true}
                                        zoomControl={true}
                                    >
                                        {posts && posts.map((item, idx) => (
                                            <Marker
                                                position={{ lat: item?.lat, lng: item?.lng }}
                                                color={"red"}
                                                animation={2}
                                                title={item?.name}
                                            />
                                        ))}
                                    </NaverMap>
                                </RenderAfterNavermapsLoaded>
                                <ContentTable
                                    columns={objHistoryListContent['real_estate'] ?? []}
                                    data={posts.splice((page - 1) * 10, page * 10)}
                                    schema={'real_estate'}
                                    table={'real_estate'}
                                    onClickList={onClickList}
                                />
                                <MBottomContent>
                                    <div />
                                    <PageContainer>
                                        <PageButton onClick={() => getRealEstate(1)}>
                                            처음
                                        </PageButton>
                                        {pageList.map((item, index) => (
                                            <>
                                                <PageButton onClick={() => getRealEstate(item)} style={{ color: `${page == item ? '#fff' : ''}`, background: `${page == item ? theme.color.background1 : ''}`, display: `${Math.abs(index + 1 - page) > 4 ? 'none' : ''}` }}>
                                                    {item}
                                                </PageButton>
                                            </>
                                        ))}
                                        <PageButton onClick={() => getRealEstate(pageList.length ?? 1)}>
                                            마지막
                                        </PageButton>
                                    </PageContainer>
                                    <div />
                                </MBottomContent>
                            </motion.div>
                        </ContentWrappers>
                    </>}

            </Wrappers>
        </>
    )
}
export default AroundRealEstate;