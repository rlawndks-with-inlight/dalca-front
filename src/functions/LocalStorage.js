
export const LSO = {//Local Storage Object
    BRAND_INFO: "brand_info",//현재 브랜드 정보
    USER_INFO: "user_info",//로그인한 유저 정보
    AUTH: "auth",//로그인한 유저 정보
}
export const setLocalStorage = (key_, value_) => {
    let key = key_;
    let value = value_;
    if (typeof value == 'object') {
        value = JSON.stringify(value);
    }
    if (typeof value == 'number') {
        value = value.toString();
    }
    localStorage.setItem(key, value);
}
export const getLocalStorage =  (key) => {
    let value = localStorage.getItem(key);
    value = JSON.parse(value);
    if(value){
        return value;
    }else{
        return undefined;
    }
}