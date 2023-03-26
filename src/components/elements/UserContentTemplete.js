import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import $ from 'jquery';
import { useState } from "react";
import { MdNavigateNext } from 'react-icons/md';
import theme from "../../styles/theme";
import umziIcon from '../../assets/images/icon/umzi.svg';
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import { Button, Divider, IconButton, makeStyles, Select } from "@mui/material";
import { useRef } from "react";
import { Icon } from '@iconify/react';
import { logoSrc } from "../../data/Data";
import { motion } from "framer-motion";
export const WrappersStyle = styled.div`
position:relative;
display:flex;
flex-direction:column;
width:90%;
max-width:750px;
margin-top:10rem;
margin-left:auto;
margin-right:auto;
margin-bottom:6rem;
min-height:58vh;
@media screen and (max-width:1050px) { 
    margin-top:5rem;
}
`
export const postCodeStyle = {
    display: 'block',
    position: 'relative',
    top: '0%',
    width: '90%',
    height: '450px',
    margin: '16px auto'
};
export const Wrappers = (props) => {
    let { className, style } = props;
    const { pathname } = useLocation();
    useEffect(() => {
        if (!style?.minHeight) {
            $('.wrappers').css('min-height', `${$(window).height() - 410}px`);
        }
    }, [pathname])
    useEffect(() => {

    }, [])
    return (
        <>
            <WrappersStyle className={`wrappers ${className}`} style={style}>
                {props.children ?? ""}
            </WrappersStyle>
        </>
    )
}
export const TitleContainer = styled.div`
display:flex;
align-items:center;
margin-top:36px;
margin-bottom:24px;
justify-content:space-between;
position:relative;
`
export const TitleStyle = styled.div`
font-size:${props => props.theme.size.font2};
font-weight:bold;
margin-right:16px;
display:flex;
align-items:center;
`
export const Title = (props) => {
    let { not_line, line, text, text_link, is_thumb, onPrevious, onNext, id, is_more_small } = props;
    const navigate = useNavigate();
    const [containerStyle, setContainerStyle] = useState({});
    const [titleStyle, setTitleStyle] = useState({});
    const [content, setContent] = useState(undefined);
    useEffect(() => {
        if (not_line) {
            setContainerStyle();
            setContent();
        }
        if (line) {
            setContainerStyle({ justifyContent: 'unset' });
            setTitleStyle({ position: 'absolute', background: '#fff', paddingRight: `${is_thumb ? '8px' : '24px'}` });
            setContent(<div style={{ background: '#203864', height: '4px', width: '100%' }} />);
        }
        if (text) {
            setContent(<div style={{ fontSize: theme.size.font5, color: theme.color.blue, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate(text_link)}>{text}</div>);
        }
    }, [props]);
    return (
        <>
            <TitleContainer className="title" style={containerStyle} id={id}>
                <TitleStyle style={titleStyle}>
                    <div style={{ fontSize: `${is_more_small ? theme.size.font2_5 : ''}` }}>{props?.children ?? ""}</div>
                    {is_thumb ?
                        <>
                            <img src={umziIcon} style={{ height: '32px', width: 'auto', paddingLeft: '8px' }} />
                        </>
                        :
                        <></>}
                </TitleStyle>
                {content}
                {onPrevious ?
                    <>
                        <div style={{ display: 'flex' }}>
                            <div style={{ padding: '8px 9px 7px 8px', background: theme.color.font6, borderRadius: '50%', cursor: 'pointer', marginRight: '6px', marginLeft: '6px' }}>
                                <GrFormPrevious onClick={onPrevious} />
                            </div>
                            <div style={{ padding: '8px 8px 7px 9px', background: theme.color.font6, borderRadius: '50%', cursor: 'pointer' }}>
                                <GrFormNext onClick={onNext} />
                            </div>
                        </div>
                    </>
                    :
                    <></>}
                {/* <hr className="bar"/> */}

            </TitleContainer>

        </>
    )
}

export const ContentWrappers = styled.div`
display:flex;
flex-direction:column;
max-width:1050px;
width:75%;
margin:0 auto;
`

const HeaderContainer = styled.div`
position: fixed;
width: 100%;
top:0;
height:4rem;
display:flex;
justify-content:space-between;
align-items:center;
z-index:10;
background:#fff;
border
@media screen and (max-width:1050px) { 
    display:flex;
    
}
`
export const FakeHeaders = (props) => {
    const { label } = props;
    const navigate = useNavigate();
    return (
        <>
            <HeaderContainer>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%', margin: 'auto' }}>
                    <GrFormPrevious style={{ fontSize: theme.size.font2, cursor: 'pointer' }} onClick={() => navigate(-1)} />
                    <div style={{ fontWeight: 'bold' }}>{label}</div>
                    <div style={{ width: '25px' }} />
                </div>

            </HeaderContainer>
        </>
    )
}
export const smallButtonStyle = {
    position: 'absolute',
    right: '2px',
    minWidth: '12px',
    height: '45px',
    width: '55px',
    top: '10px',
    borderTopRightRadius: '4px',
    borderBottomRightRadius: '4px',
    borderBottomLeftRadius: '0',
    borderTopLeftRadius: '0',
    fontSize: `${theme.size.font5}`,
    fontWeight: 'bold',
    ml: 'auto',
    background: `${theme.color.background3}`,
    '&:hover': {
        background: `${theme.color.font4_5}`,
    },
    '&:active': {
        background: `${theme.color.background3}`,
    },
}
export const colorButtonStyle = {
    height: '43px',
    minWidth: '55px',
    fontSize: `${theme.size.font5}`,
    fontWeight: 'bold',
    color: '#fff',
    background: `${theme.color.background1}`,
    '&:hover': {
        background: `${theme.color.background1}`,
    },
    '&:active': {
        background: `${theme.color.background1}`,
    },
    '&:disabled': {
        background: `${theme.color.font4}`,
        fontWeight: 'bold',
        color: '#fff',
    },
}
export const borderButtonStyle = {
    height: '43px',
    minWidth: '53px',
    fontSize: `${theme.size.font5}`,
    fontWeight: 'bold',
    border: `2px solid ${theme.color.background1}`,
    color: `${theme.color.background1}`,
    background: `#fff`,
    '&:hover': {
        background: `#fff`,
    },
    '&:active': {
        background: `#fff`,
    },
}
export const Input = styled.input`
padding:14px 2%;
width:96%;
border:1px solid ${props => props.theme.color.font5};
background:#fff;
border-radius:4px;
font-size:${props => props.theme.size.font4};
outline:none;
margin:1px;
&::placeholder {
    color: ${props => props.theme.color.font4};
}
&:hover{  
    border:1px solid ${props => props.theme.color.font4_5};
}
&:focus{  
    border:2px solid ${props => props.theme.color.background1};
    margin:0;
}
`
const InputLabel = styled.div`
position:absolute;
font-size:${props => props.theme.size.font5};
left:2.5%;
top:25px;
padding:2px 4px;
background:#fff;
transition-duration: 200ms;
`
const PlaceholderLabel = styled.div`
position:absolute;
font-size:${props => props.theme.size.font6};
left:3%;
top:27px;
transition-duration: 200ms;
color: ${props => props.theme.color.font4};
opacity:${props => props.opacity};
`
const HalfTitleStyle = styled.div`
width:50%;
text-align:center;
padding:8px 0;
margin-right:auto;
max-width:250px;
border-bottom: 2px solid ${props => props.theme.color.background1};
`
export const LogoHeader = (props) => {
    const { link } = props;
    const navigate = useNavigate();
    return (
        <>
            <img src={logoSrc} style={{ maxWidth: '500px', width: '90%', margin: '16px auto' }} onClick={() => { navigate(link ?? '/home') }} />
        </>
    )
}
export const HalfTitle = (props) => {
    const { style, line_percent } = props;
    return (
        <>
            <div style={{ margin: '8px auto', width: '100%', ...style }} >
                <HalfTitleStyle>{props.children}</HalfTitleStyle>
                <div />
            </div>
        </>
    )
}

export const CustomSelect = styled(Select)(() => ({
    '& label.Mui-focused': {
        color: theme.color.background1,
    },
    "&.MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: theme.color.font5
      },
      "&:hover fieldset": {
        borderColor: theme.color.font4_5
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.color.background1
      }
    }
  }));
export const InputComponent = (props) => {
    const { label, button_label, class_name, input_type, is_divider, on_focus, on_blur, onKeyPress, onClickButton, isButtonAble, icon_label, onClickIcon, onClick, onChange, value, divStyle, isSeeButton, autoCompleteList, onAutoCompleteClick } = props;
    const focusRef = useRef();
    const [focused, setFocused] = useState(false);
    const [isPlaceholder, setIsPlaceholder] = useState(false);
    const [isValue, setIsValue] = useState(false);
    const [isSeePassword, setIsSeePassword] = useState(false);
    const onFocus = () => {
        setFocused(true);
        // setTimeout(()=>{
        //     setIsPlaceholder(true);
        // },100);
    }
    const onBlur = () => {
        setIsPlaceholder(false);
        setFocused(false);
    }
    const onChangeValue = (e) => {
        onChange(e.target.value)
        if (e.target.value) {
            setIsValue(true);
        } else {
            setIsValue(false);
        }
    }
    useEffect(() => {
        if ($(`.${class_name}`).val()) {
            setIsValue(true);
        }
    }, [$(`.${class_name}`).val()])

    const getInputType = () =>{
        if((input_type?.type == 'password' && !isSeePassword)){
            return 'password'
        }
        if(input_type?.type){
            return input_type?.type
        }
        return '';
    }
    return (
        <>
            <div style={{
                display: 'flex',
                position: 'relative',
                alignItems: 'center',
                margin: '0 auto',
                padding: '8px 0',
                width: '100%',
                ...divStyle
            }}
                onClick={onClick}
            >
                {/* <div style={{ width: '22%', fontSize: theme.size.font5,whiteSpace:'pre',wordBreak:'break-all' }}>{label}</div> */}
                <div style={{ width: '100%', display: 'flex' }}
                    onClick={onClick}
                >
                    <InputLabel
                        style={{
                            top: `${(focused || isValue) ? '2px' : '24px'}`,
                            fontSize: `${(focused || isValue) ? theme.size.font6 : theme.size.font5}`,
                            color: `${focused ? theme.color.background1 : theme.color.font4}`,
                        }}
                        onClick={() => $(`.${class_name}`).focus()}>{label}</InputLabel>
                    <PlaceholderLabel opacity={(focused && !isValue) ? 1 : 0} >
                        {(focused && !isValue) ?
                            <>
                                {input_type?.placeholder}
                            </>
                            :
                            <>
                            </>}
                    </PlaceholderLabel>
                    <Input
                        {...props}
                        className={class_name}
                        {...input_type}
                        placeholder={''}
                        ref={focusRef}
                        value={value}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        onChange={onChangeValue}
                        onClick={onClick}
                        type={getInputType()}
                        style={{
                            padding: `${(button_label
                                || isSeeButton
                                || icon_label
                            )
                                ?
                                '14px 60px 14px 2%' : ''}`,
                        }}
                        onKeyPress={(e) => {
                            if (e.key == 'Enter' && onKeyPress) {
                                onKeyPress();
                            }
                        }}
                    />
                    {icon_label ?
                        <>
                            <div style={isImgIconStyle} onClick={onClickIcon}>
                                {icon_label}
                            </div>
                        </>
                        :
                        <>
                        </>}
                    {button_label ?
                        <>
                            <Button variant="text" sx={smallButtonStyle}
                                onClick={onClickButton} disabled={!isButtonAble}>{button_label}</Button>
                        </>
                        :
                        <>
                        </>}
                    {isSeeButton ?
                        <>
                            {isSeeButton ?
                                <>
                                    <IconButton style={isSeeIconStyle} onClick={() => {
                                        setIsSeePassword(!isSeePassword);
                                    }}>
                                        {isSeePassword ?
                                            <>
                                                <Icon icon="ph:eye" />
                                            </>
                                            :
                                            <>
                                                <Icon icon="ph:eye-slash" />
                                            </>}
                                    </IconButton>
                                </>
                                :
                                <>
                                </>}
                        </>
                        :
                        <>
                        </>}
                    {autoCompleteList && autoCompleteList.length > 0 ?
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    position: 'absolute',
                                    top: '60px',
                                    maxWidth: '560px',
                                    width: '92%',
                                    padding: '4%',
                                    background: '#fff',
                                    borderRadius: '8px',
                                    boxShadow: theme.boxShadow,
                                    height: '130px',
                                    overflowY: 'auto',
                                }}>
                                {autoCompleteList.map((item, idx) => (
                                    <>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            padding: '6px 0',
                                            background: '#fff',
                                            borderBottom: `1px solid ${theme.color.font3}`,
                                            width: '100%',
                                            '&:hover': {
                                                background: `${theme.color.background1}`,
                                            },
                                            '&:active': {
                                                background: `${theme.color.background1}`,
                                            },
                                            cursor: 'pointer'
                                        }}
                                            onClick={() => onAutoCompleteClick(item)}
                                        >
                                            <div style={{
                                                fontSize: theme.size.font4,
                                                marginBottom: `6px`
                                            }}>{item.name}</div>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: theme.size.font5,
                                                color: theme.color.font3
                                            }}>
                                                <div>{item.id_number && item.id_number.substring(0, 6)}-*******</div>
                                                <div>{item.phone}</div>
                                            </div>
                                        </div>
                                    </>
                                ))}
                            </motion.div>
                        </>
                        :
                        <>
                        </>}
                </div>
            </div>
        </>
    )
}
const isSeeIconStyle = {
    position: 'absolute',
    fontSize: theme.size.font3,
    right: '12px',
    top: '15px',
    color:'rgba(0, 0, 0, 0.54)'
}
const isImgIconStyle = {
    position: 'absolute',
    fontSize: theme.size.font3,
    right: '21px',
    top: '23px',
    color:'rgba(0, 0, 0, 0.54)'
}
export const TitleInputComponent = (props) => {
    const { label, icon, class_name, input_type, is_blue, onKeyPress } = props;
    return (
        <>
            <div style={{ display: 'flex', position: 'relative', flexDirection: 'column', margin: '0 auto', width: '100%' }}>
                <div style={{ color: `${is_blue ? '#fff' : ''}`, fontSize: theme.size.font4, margin: '6px 0' }}>{label}</div>
                <Input
                    className={class_name}
                    {...input_type}
                    style={icon ? { width: '88%', padding: '16px 10% 16px 2%' } : {}}
                    onKeyPress={(e) => {
                        if (e.key == 'Enter') {
                            onKeyPress();
                        }
                    }}
                />
                {icon ?
                    <>
                        <img src={icon} style={{ position: 'absolute', height: '20px', right: '3%', bottom: '17px' }} />
                    </>
                    :
                    <>
                    </>}
            </div>
        </>
    )
}
export const FullButton = styled.button`

`
export const TwoOfThreeButton = styled.button`
cursor:pointer;
width:70%;
max-width:400px;
border:3px solid ${props => props.theme.color.background2};
background: ${props => props.theme.color.background1};
border-radius:10px;
margin:0 auto;
color:#fff;
font-size:${props => props.theme.size.font3};
height:78px;
font-weight:bold;
`
export const twoOfThreeButtonStyle = {
    height: '48px',
    border: `3px solid ${theme.color.background2}`,
    margin: '0 auto',
    background: `${theme.color.background1}`,
    color: `#fff`,
    width: '70%',
    maxWidth: '400px',
    borderRadius: '10px',
    minWidth: '160px',
    fontSize: `${theme.size.font4}`,
    fontWeight: 'bold',
    '&:hover': {
        background: `${theme.color.background1}`,
    },
    '&:active': {
        background: `${theme.color.background1}`,
    },
}
export const MarginBottom = (props) => {
    const { value } = props;
    return (
        <>
            <div style={{ marginBottom: `${value}` }} />
        </>
    )
}
export const Content = styled.div`
margin:0 auto 1rem 0;
width:100%;
font-size:${props => props.theme.size.font3};
display:flex;
flex-direction:column;
font-weight:normal;
@media screen and (max-width:700px) { 
}
`
export const Img = styled.img`
width: 100%;
height:320px;
background:#fff;
background-size: cover;
background-repeat: no-repeat;
background-position: center center;
background-blend-mode: multiply;
@media screen and (max-width:1100px) {
    height: 28.8vw;
}
@media screen and (max-width:600px) {
    height: 52.2222222222vw;
}
`
export const Card = styled.div`
width: 48%; 
margin-bottom:16px;
background: ${props => props.theme.color.background3};
cursor:pointer;
@media screen and (max-width:600px) {
    width:100%;
}
`
export const WrapDiv = styled.div`
display: flex;
justify-content: space-between;
flex-wrap: wrap;
@media screen and (max-width:600px) { 
    display:none;
}
`
export const SliderDiv = styled.div`
display:none;
@media screen and (max-width:602px) { 
    display:flex;
}
`
export const ViewerContainer = styled.div`
margin:0 auto;
width:100%;
`
export const SelectType = styled.div`
display:flex;
width:100%;
z-index:5;
background:#fff;
margin:16px 0;
`
export const ShadowContainer = styled.div`
background:#FAFAFA;
border-radius:${props => props.theme.borderRadius};
padding:6px;
box-shadow:${props => props.theme.boxShadow};
`
export const RowContent = styled.div`
display:flex;
width:100%;
`
export const TextButton = styled.button`
width:124px;
height:28px;
border-radius:12px;
border:1px solid ${props => props.theme.color.font2};
color:${props => props.theme.color.font2};
background:#fff;
font-size:${props => props.theme.size.font4};
cursor:pointer;
@media screen and (max-width:700px) { 
    font-size:${props => props.theme.size.font5};
}
`
export const TextFillButton = styled.button`
width:124px;
height:28px;
border-radius:12px;
border:1px solid ${props => props.theme.color.font2};
color:#fff;
background:${props => props.theme.color.font2};
font-size:${props => props.theme.size.font4};
cursor:pointer;
@media screen and (max-width:700px) { 
    font-size:${props => props.theme.size.font5};
}
`