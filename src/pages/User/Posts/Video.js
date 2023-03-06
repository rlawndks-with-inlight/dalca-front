import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Title, Wrappers, ViewerContainer } from "../../../components/elements/UserContentTemplete";
import { axiosInstance, backUrl, slideSetting } from "../../../data/Data";
import theme from "../../../styles/theme";
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { categoryToNumber, commarNumber, getIframeLinkByLink, getViewerAlignByNumber, getViewerMarginByNumber } from "../../../functions/utils";
import $ from 'jquery';
import { Content, SliderDiv, WrapDiv } from "../../../components/elements/UserContentTemplete";
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import VideoCard from "../../../components/VideoCard";
import styled from "styled-components";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { Viewer } from '@toast-ui/react-editor';
import Loading from '../../../components/Loading'
import CommentComponent from "../../../components/CommentComponent";
import MetaTag from "../../../components/MetaTag";
import { BsFillShareFill } from 'react-icons/bs';
import ZoomButton from "../../../components/ZoomButton";
import youtubeIcon from '../../../assets/images/icon/youtube.svg'
export const Img = styled.div`
width: 700px;
height: 525px;
background:#fff;
background-size: cover;
background-repeat: no-repeat;
background-position: center center;
background-blend-mode: multiply;
margin:2rem auto;
display:flex;
@media screen and (max-width:800px) {
    width: 100%;
    height: 67.5vw;
}
`
const Iframe = styled.iframe`
width: 100%;
height: auto;
height: 80vw;
max-height: 500px;
max-width: 750px;
margin: 0 auto;
`
const Progress = styled.progress`

    appearance: none;
    position: fixed;
    bottom: 0;
    width: 100%;
    left: 0;
    right: 0;
    height:16px;

::-webkit-progress-bar {
    background: #f0f0f0;
    border-radius: 0;
}

::-webkit-progress-value {
    background:transparent;
    border-bottom: 16px solid #4CDAD8;
    border-right: 10px solid transparent;
}
`
const NextArrow = ({ onClick }) => {
    return (
        <div className="nextArrow" onClick={onClick}>
            <MdNavigateNext style={{ color: '#fff' }} />
        </div>
    );
};

const PrevArrow = ({ onClick }) => {
    return (
        <div className="prevArrow" onClick={onClick}>
            <MdNavigateBefore style={{ color: '#fff' }} />
        </div>
    );
};

const Video = () => {
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname } = useLocation();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [latests, setLatests] = useState([]);
    const [relates, setRelates] = useState([]);
    const [percent, setPercent] = useState(0);
    const [auth, setAuth] = useState({})
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState("")

    const settings = {
        infinite: false,
        speed: 500,
        autoplay: false,
        autoplaySpeed: 2500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow onClick />,
        prevArrow: <PrevArrow onClick />,
    };
    useEffect(() => {
        window.addEventListener('scroll', function (el) {
            let per = Math.floor(($(window).scrollTop() / ($(document).height() - $(window).height())) * 100);
            setPercent(per);
        })
    }, [])
    useEffect(() => {
        async function isLogined() {
            await window.flutter_inappwebview.callHandler('native_app_logined', {}).then(async function (result) {
                //result = "{'code':100, 'message':'success', 'data':{'login_type':1, 'id': 1000000}}"
                // JSON.parse(result)
                let obj = JSON.parse(result);
                if (obj['is_ios']) {
                    await localStorage.setItem('is_ios', '1');
                }
                if(obj?.data?.id){
                    await onLoginBySns(obj.data);
                }else{
                    alert("로그인 해주세요.");
                    navigate('/login');
                }
            });
        }

        async function fetchPost() {
            setLoading(true)
            if (window && window.flutter_inappwebview && !localStorage.getItem('auth')) {
                setLoadingText("로그인 정보 확인중 입니다...");
                await isLogined();
            }
            try {
                setLoadingText("콘텐츠를 불러오는 중입니다...");
                const { data: response } = await axiosInstance.get(`/api/getvideocontent?pk=${params.pk}&views=1`);
                if (response.result < 0) {
                    alert(response.message);
                    if (response.result == -150) {
                        navigate('/login')
                    } else {
                        navigate(-1);
                    }
                }
                let obj = response.data.video;
                obj.link = getIframeLinkByLink(obj.link);
                if(obj?.note && (typeof obj?.note == 'string')){
                    obj.note = obj?.note.replaceAll('http://localhost:8001', backUrl);
                    obj.note = obj?.note.replaceAll('https://weare-first.com:8443', backUrl);
                }
                setPost(obj);
                let relate_list = response.data?.relates ?? [];
                for (var i = 0; i < relate_list.length; i++) {
                    relate_list[i].link = getIframeLinkByLink(relate_list[i].link);
                }
                setRelates(relate_list);
                let video_list = response.data?.latests ?? []
                for (var i = 0; i < video_list.length; i++) {
                    video_list[i].link = getIframeLinkByLink(video_list[i].link);
                }
                setLatests(video_list);
                await new Promise((r) => setTimeout(r, 100));
                setTimeout(() => setLoading(false), 1000);
                await new Promise((r) => setTimeout(r, 1100));
                if (localStorage.getItem('dark_mode')) {
                    $('body').addClass("dark-mode");
                    $('p').addClass("dark-mode");
                    $('.toastui-editor-contents p').attr("style", "color:#ffffff !important");
                    $('.toastui-editor-contents span').attr("style", "color:#ffffff !important");
                    $('.toastui-editor-contents h1').attr("style", "color:#ffffff !important");
                    $('.toastui-editor-contents h2').attr("style", "color:#ffffff !important");
                    $('.toastui-editor-contents h3').attr("style", "color:#ffffff !important");
                    $('.toastui-editor-contents h4').attr("style", "color:#ffffff !important");
                    $('.toastui-editor-contents h5').attr("style", "color:#ffffff !important");
                    $('.menu-container').addClass("dark-mode");
                    $('.header').addClass("dark-mode");
                    $('.select-type').addClass("dark-mode");
                    $('.wrappers > .viewer > p').addClass("dark-mode");
                    $('.footer').addClass("dark-mode");
                    $('.viewer > div > div > div > p').addClass("dark-mode");
                }
            } catch (err) {
                if (err?.message?.includes('timeout of')) {
                    if (window.confirm('요청시간이 초과되었습니다. (인터넷 환경을 확인해주시기 바랍니다.)')) {

                    }
                }
            }
        }
        if (localStorage.getItem('auth')) {
            setAuth(JSON.parse(localStorage.getItem('auth')));

        }
        fetchPost();
        fetchComments();

    }, [pathname])
    const onLoginBySns = async (obj) => {
        let nick = "";
        if (obj.login_type == 1) {
            nick = "카카오" + new Date().getTime();
        } else if (obj.login_type == 2) {
            nick = "네이버" + new Date().getTime();
        }
        let objs = {
            id: obj.id,
            name: obj.legal_name,
            nickname: nick,
            phone: obj.phone_number,
            user_level: 0,
            typeNum: obj.login_type,
            profile_img: obj.profile_image_url
        }
        const { data: response } = await axios.post('/api/loginbysns', objs);
        if (response.result > 0) {
            await localStorage.setItem('auth', JSON.stringify(response.data));
            setAuth(response.data);

        } else {
            //alert(response.message);
        }
    }
    const fetchComments = async () => {
        const { data: response } = await axios.get(`/api/getcommnets?pk=${params.pk}&category=${categoryToNumber('video')}`);
        setComments(response.data);
    }

    const addComment = async (parent_pk) => {
        if (!auth.pk) {
            alert("로그인 후 이용 가능합니다.")
            return;
        }
        if (!$(`.comment-${parent_pk ?? 0}`).val()) {
            alert('필수 값을 입력해 주세요.');
            return;

        }
        const { data: response } = await axios.post('/api/addcomment', {
            userPk: auth.pk,
            userNick: auth.nickname,
            pk: params.pk,
            parentPk: parent_pk ?? 0,
            title: post.title,
            note: $(`.comment-${parent_pk ?? 0}`).val(),
            category: categoryToNumber('video')
        })

        if (response.result > 0) {
            $(`.comment-${parent_pk ?? 0}`).val("")
            fetchComments();
        } else {
            alert(response.message)
        }
    }
    const updateComment = async (pk) => {
        if (!$(`.update-comment-${pk ?? 0}`).val()) {
            alert('필수 값을 입력해 주세요.');
        }
        const { data: response } = await axios.post('/api/updatecomment', {
            pk: pk,
            note: $(`.update-comment-${pk ?? 0}`).val()
        })

        if (response.result > 0) {
            $(`.update-comment-${pk ?? 0}`).val("")
            fetchComments();
        } else {
            alert(response.message)
        }
    }
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: post.title,
                url: 'https://weare-first.com' + location.pathname,
            });
        } else {
            alert("공유하기가 지원되지 않는 환경 입니다.")
        }
    }
    const onClickYoutubeIcon = async () => {
        if (window && window.flutter_inappwebview) {
            let obj = { url: `https://www.youtube.com/watch?v=${post.link}`, company: 'com.google.android.youtube' };
            await window.flutter_inappwebview.callHandler('native_app_open_youtube', obj).then(async function (result) {

            });
        } else {
            window.open(`https://www.youtube.com/watch?v=${post.link}`);
        }
    }
    return (
        <>
            <Wrappers className="post-container">
                <MetaTag title={'dalca-pay / ' + post?.title ?? ""} />

                {loading ?
                    <>
                        <Loading text={loadingText}/>
                    </>
                    :
                    <>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'end', fontSize: `${theme.size.font4}` }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ margin: '0 4px' }}>{post.nickname}</div> /
                                <div style={{ margin: '0 4px' }}>{post?.date?.substring(0, 10)}</div> /
                                <div style={{ margin: '0 8px 0 4px' }}>조회수 {commarNumber(post?.views ?? 0)}</div>
                                <BsFillShareFill style={{ cursor: 'pointer' }} onClick={handleShare} />
                            </div>
                        </div>
                        <Title not_arrow={true}>{post.title}</Title>
                        {/* <Img style={{ backgroundImage: `url(${`https://img.youtube.com/vi/${post?.link}/0.jpg`})` }} alt="#">
                            <img src={youtubeIcon} style={{width:'124px',height:'auto',margin:'auto',cursor:'pointer'}} onClick={onClickYoutubeIcon} />
                        </Img> */}

                        <Iframe src={`https://www.youtube.com/embed/${post.link}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>

                        </Iframe>
                        <div style={{ fontSize: `${theme.size.font4}`, color: `${theme.color.font2}` }}>{post?.hash}</div>
                        <ViewerContainer className="viewer" style={{ margin: `${getViewerMarginByNumber(post?.note_align)}` }}>
                            <Viewer initialValue={post?.note ?? `<body></body>`} />
                        </ViewerContainer>
                        <Title>관련 영상</Title>
                        <Content>
                            <WrapDiv>
                                {relates.map((item, idx) => (
                                    <>
                                        <VideoCard item={item} />
                                    </>
                                ))}
                            </WrapDiv>
                            <SliderDiv>
                                <Slider {...slideSetting(1)} className='board-container slider1'>
                                    {relates.map((item, idx) => (
                                        <>
                                            <VideoCard item={item} isSlide={true} isImgPadding={true} />
                                        </>
                                    ))}
                                </Slider>
                            </SliderDiv>
                        </Content>
                        <Title>최신 영상</Title>
                        <Content>
                            <WrapDiv>
                                {latests.map((item, idx) => (
                                    <>
                                        <VideoCard item={item} />
                                    </>
                                ))}
                            </WrapDiv>
                            <SliderDiv>
                                <Slider {...slideSetting(2)} className='board-container slider2'>
                                    {latests.map((item, idx) => (
                                        <>
                                            <VideoCard item={item} isSlide={true} isImgPadding={true} />
                                        </>
                                    ))}
                                </Slider>
                            </SliderDiv>
                        </Content>
                        {/* <ZoomButton/> */}
                        <CommentComponent addComment={addComment} data={comments} fetchComments={fetchComments} updateComment={updateComment} auth={auth} />

                    </>
                }

                <Progress value={`${percent}`} max="100"></Progress>
                {/* <Logo src={logo} style={{left:`${percent*0.94}%`}}/> */}
            </Wrappers>
        </>
    )
}
export default Video;