import styled from "styled-components";

export const Col = styled.div`
display:flex;
flex-direction:column;
`

export const Row = styled.div`
display:flex;
@media screen and (max-width:700px) {
    flex-direction:column;
}
`

export const Card = styled.div`
background:#fff;
display:flex;
flex-direction:column;
width:95%;
margin:12px auto;
box-shadow:${props=>props.theme.boxShadow};
border-radius:3px;
padding: 24px 0;
min-height:640px;
`
export const Title = styled.div`
margin:12px auto 6px 24px;
width:90%;
color:${props=>props.theme.color.manager.font2};
font-weight:bold;
margin-top:32px;
`
export const Input = styled.input`
margin:12px auto 6px 24px;
width:200px;
padding:8px;
border:1px solid #dadde6;
border-radius:4px;
outline:none;
::placeholder {
    color: #cccccc;
}
`
export const Textarea = styled.textarea`
margin:12px auto 6px 24px;
width:400px;
padding:8px;
border:1px solid #dadde6;
border-radius:4px;
outline:none;
resize:none;
height:126px;
::placeholder {
    color: #cccccc;
}
@media screen and (max-width:700px) {
    width:80% !important;
}
`
export const Select = styled.select`
margin:12px auto 6px 24px;
width:218px;
padding:8px;
outline:none;
border:1px solid #dadde6;
border-radius:4px;
`
export const ImageContainer = styled.label`
border: 1px dashed ${props=>props.theme.color.font4};
margin:12px auto 6px 24px;
width:100%;
min-height:12rem;
border-radius:4px;
text-align:center;
display:flex;
@media screen and (max-width:700px) {
    width:90%;
}
`
export const Explain = styled.div`
font-size: ${props=>props.theme.size.font5};
margin:0px auto 0px 24px;
color: ${props=>props.theme.color.font2};
`
export const Table = styled.table`
width:770px;
text-align:center;
border-spacing: 0px;
border-style: none;
padding: 0px;
background:#fff;

`
export const Tr = styled.tr`
display:flex;
`
export const Td = styled.td`
border:1px solid ${props => props.theme.color.font4};
width:40%;
`
export const SectorInput = styled.input`
width:90%;
outline:none;
border:none;
::placeholder {
    color: #cccccc;
}
`
export const Container = styled.div`
margin:12px auto 6px 24px;
width:90%;
color:${props => props.theme.color.manager.font2};
font-weight:bold;
margin-top:32px;
@media screen and (max-width:650px) {
    overflow-x:auto;
}
`