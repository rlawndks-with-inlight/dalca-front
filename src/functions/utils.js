import axios from 'axios';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { returnColumn } from '../common/manager/ColumnType';

// 웹뷰에서 RN으로 데이터를 보낼때 사용합니다.
export function sendToRN(num) {
    if (window.ReactNativeWebView) {
        // RN에서 데이터는 반드시 문자열로 받을 수 있기 때문에 
        // JSON.stringify를 사용합니다.
        window.ReactNativeWebView.postMessage(
            JSON.stringify({ data: num })
        );
    } else {
        // -- 
    }
};
export function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}
export function range(start, end) {
    let array = [];
    for (let i = start; i <= end; ++i) {
        array.push(i);
    }
    return array;
}
export const addItem = async (type, obj) => {
    const { data: response } = await axios.post(`/api/add${type}`, obj)
    alert(response.message);
    if (response.result > 0) {
        window.history.back();
    }
}
export const overString = (str_, cut_count) =>{
    let str = str_;
    if(!str){
        return "";
    }
    if(str.length<=cut_count){
        return str;
    }else{
        return str.substring(0, cut_count) + '...'
    }
}
export const updateItem = async (type, obj) => {
    const { data: response } = await axios.post(`/api/update${type}`, obj)
    alert(response.message);
    if (response.result > 0) {
        window.history.back();
    }
}
export const deleteItem = async (type, obj) => {

}
export const commarNumber = (num) => {
    if(num > 0 && num < 0.000001){
        return "0.00";
    }
    if (!num && num != 0) {
        return undefined;
    }
    let str = "";
    if (typeof num == "string") {
        str = num;
    } else {
        str = num.toString();
    }

    let decimal = "";
    if (str.includes(".")) {
        decimal = "." + str.split(".")[1].substring(0, 2);
        str = str.split(".")[0];
    } else {
        decimal = "";
    }
    if (str?.length <= 3) {
        return str + decimal;
    }
    let result = "";
    let count = 0;
    for (var i = str?.length - 1; i >= 0; i--) {
        if (count % 3 == 0 && count != 0 && !isNaN(parseInt(str[i]))) result = "," + result;
        result = str[i] + result;
        count++;
    }
    return result + decimal;
}
export const makeMaxPage = (num, page_cut) => {
    if (num % page_cut == 0) {
        return num / page_cut;
    } else {
        return parseInt(num / page_cut) + 1;
    }
}
export const formatPhoneNumber = (input) => {
    const cleanInput = String(input).replaceAll(/[^0-9]/g, "");
    let result = "";
    const length = cleanInput.length;
    if (length === 8) {
        result = cleanInput.replace(/(\d{4})(\d{4})/, '$1-$2');
    } else if (cleanInput.startsWith("02") && (length === 9 || length === 10)) {
        result = cleanInput.replace(/(\d{2})(\d{3,4})(\d{4})/, '$1-$2-$3');
    } else if (!cleanInput.startsWith("02") && (length === 10 || length === 11)) {
        result = cleanInput.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
    } else {
        result = undefined;
    }
    return result;
}
export const returnMoment = (num, date) => {//num 0: 오늘, num -1: 어제 , date->new Date() 인자로 받음
    try{
        var today = new Date();
        if (num) {
            let new_date = new Date(today.setDate(today.getDate() + num));
            today = new_date;
        }
        if(date){
            today = date; 
        }
        var year = today.getFullYear();
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var day = ('0' + today.getDate()).slice(-2);
        var dateString = year + '-' + month + '-' + day;
        var hours = ('0' + today.getHours()).slice(-2);
        var minutes = ('0' + today.getMinutes()).slice(-2);
        var seconds = ('0' + today.getSeconds()).slice(-2);
        var timeString = hours + ':' + minutes + ':' + seconds;
        let moment = dateString + ' ' + timeString;
        return moment;
    }catch(err){
        console.log(err);
        return false;
    }
    
}
export const getIframeLinkByLink = (str) => {
    let ans = "";
    for (var i = 0; i < str.length; i++) {
        if (str[i] == 'v' && str[i + 1] == '=') {
            for (var j = i + 2; j < str.length; j++) {
                if (str[j] == '&') break;
                ans += str[j];
            }
        }
    }

    return ans;
}
export const categoryToNumber = (str) => {
    if (str == 'event') {
        return 0;
    } else if (str == 'academy') {
        return 1;
    } else if (str == 'notice') {
        return 2;
    } else if (str == 'review') {
        return 3;
    } else {
        return -1;
    }
}
export const numberToCategory = (num) => {
    if (num == 0) {
        return { schema: 'event', name: '이벤트' };
    } else if (num == 1) {
        return { schema: 'academy', name: '강의' };
    } else if (num == 2) {
        return { schema: 'notice', name: '공지사항' };
    } else if (num == 3) {
        return { schema: 'review', name: '이용후기' };
    } else {
        return { schema: '---', name: '---' };
    }

}
export const getEnLevelByNum = (num) => {
    if (num == 0)
        return 'lessee';
    else if (num == 5)
        return 'landlord';
    else if (num == 10)
        return 'realtor';
    else if (num == 40)
        return 'manager';
    else if (num == 50)
        return 'developer';
}
export const getIsUser = (level) =>{
    let user_level_list = [0, 5, 10];
    if(user_level_list.includes(level)){
        return true;
    }
    return false;
}
export const getKoLevelByNum = (num) => {
    if (num == 0)
        return '임차인';
    else if (num == 5)
        return '임대인';
    else if (num == 10)
        return '공인중개사';
    else if (num == 40)
        return '관리자';
    else if (num == 50)
        return '개발자';
}
export const regExp = (type, str) => {//id,pw,nickname,name
    let reg = undefined;
    if (type == 'id') {
        reg = /^[a-z]+[a-z0-9]{4,19}$/g;
    } else if (type == 'pw') {
        reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~`!@#$%^&*()_+-=,./;'<>?:"])[A-Za-z\d~`!@#$%^&*()_+-=,./;'<>?:"]{8,15}$/;
    } else if (type == 'name') {
        reg = /^[가-힣|a-z|A-Z]{2,5}$/;
    } else if (type == 'nickname') {
        reg = /^[가-힣|a-z|A-Z|0-9|]{2,8}$/;
    } else {
        return false;
    }
    return reg.test(str)
}
export const onClickExternalLink = (link_) => {//외부링크이동
    let link = link_ ?? "";
    if (!link) {
        return;
    }
    if (link[0] == '/') {
        window.location.href = link;
    }
    if (link.includes('http')) {
        window.location.href = link;
    } else {
        window.location.href = 'https://' + link;
    }
}
export const onClickWindowOpen = (link_) => {
    let link = link_ ?? "";
    if (!link) {
        return;
    }
    if (link.includes('http')) {
        window.open(link);
    } else {
        window.open('https://' + link);
    }
}
export const makeDiscountPrice = (num, percent) => {
    if (!num) {
        return 0;
    }
    if (!percent) {
        return num;
    }
    let result = num * (100 - percent) / 100;
    return result;
}
export const makeQueryObj = (query_) =>{
    let obj = {};
    if(!query_ || query_[0] != '?'){
        return obj;
    }
    let query = query_.substring(1, query_.length);
    query = query.split('&');
    for(var i = 0;i<query.length;i++){
        let content = query[i].split('=');
        obj[content[0]] = content[1];
    }
    return obj;
}
export function base64toFile(base_data, filename) {
    var arr = base_data.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}
export const getViewerMarginByNumber = (num) => {
    if (num == 0) {
        return " 0 auto ";
    } else if (num == 1) {
        return " 0 auto 0 0 ";
    } else if (num == 2) {
        return " 0 0 0 auto ";
    } else {
        return " 0 auto ";
    }
}
export const getViewerAlignByNumber = (num) => {
    if (num == 0) {
        return "center";
    } else if (num == 1) {
        return "left";

    } else if (num == 2) {
        return "end";
    } else {
        return "center";
    }
}
export const excelDownload = async (excelData, objManagerListContent, schema) => {
    const excelFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const excelFileExtension = '.xlsx';
    const excelFileName = schema;
    let ignore_name_list = ['맨위로', '수정', '삭제', '관리'];
    let name_list = [];
    let column_list = [];
    for (var i = 0; i < objManagerListContent[schema].zColumn.length; i++) {
        if (!ignore_name_list.includes(objManagerListContent[schema].zColumn[i].name)) {
            name_list.push(objManagerListContent[schema].zColumn[i].name)
            column_list.push(objManagerListContent[schema].zColumn[i])
        }
    }
    const ws = XLSX.utils.aoa_to_sheet([
        ['퍼스트 아카데미']
        , []
        , name_list
    ]);

    let result = [...excelData];
    let excel_list = [];
    for (var i = 0; i < result.length; i++) {
        excel_list[i] = [];
        for (var j = 0; j < column_list.length; j++) {
            let data = await returnColumn(result[i], column_list[j]?.type, column_list[j]?.column, objManagerListContent[schema].schema);;
            await excel_list[i].push(data);
        }
    }
    await excel_list.map(async (data, idx) => {
        XLSX.utils.sheet_add_aoa(
            ws,
            [
                data
            ],
            { origin: -1 }
        );
        ws['!cols'] = [
            { wpx: 50 },
            { wpx: 50 }
        ]
        return false;
    });
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelButter = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const excelFile = new Blob([excelButter], { type: excelFileType });
    FileSaver.saveAs(excelFile, excelFileName + excelFileExtension);
}
export const dateFormat = (date, is_minus) => {//두날짜의 시간차
    if (!date) {
        return "---";
    }
    let f_d = new Date(returnMoment()).getTime();
    let s_d = new Date(date).getTime();
    let hour = (f_d - s_d) / (1000 * 3600);
    let minute = (f_d - s_d) / (1000 * 60);
    let day = (f_d - s_d) / (1000 * 3600 * 24);
    if (minute <= 1) {
        return "방금 전";
    } else if (hour < 1) {
        if (is_minus) {
            return `${parseInt(minute)}분`;
        } else {
            return `${parseInt(minute)}분 전`;
        }
    } else if (hour < 24) {
        if (is_minus) {
            return `${parseInt(hour)}시간`;
        } else {
            return `${parseInt(hour)}시간 전`;
        }
    } else if (day < 7) {
        if (is_minus) {
            return `${parseInt(day)} Days`;
        } else {
            return `${parseInt(day)}일 전`;
        }
    } else {
        if (is_minus) {
            return `${parseInt(day)} Days`;
        } else {
            return date.substring(0, 10);
        }
    }
}