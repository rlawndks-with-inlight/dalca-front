import { getPayStatus } from "../../functions/format";
import { commarNumber, dateFormat} from "../../functions/utils";

export const returnColumn = (data_, type_, column_, schema) => {
    let data = { ...data_ };
    let type = type_;
    let column = column_;
    let result = "---";

    if (type == 'text') {
        result = data[`${column}`] ?? "---";
    } else if (type == 'number') {
        result = commarNumber(data[`${column}`] ?? 0);
    } else if (type == 'minus_number') {
        result = commarNumber((data[`${column}`] ?? 0) * (-1));
    } else if (type == 'date') {
        result = dateFormat(data[`${column}`]);
    } else if (type == 'abs') {
        result = commarNumber(Math.abs(data[`${column}`]));
    } else if (type == 'link') {
        result = data[`${column}`];
    } else if (type == 'login_type') {
        if (data[`${column}`] == 0) {
            result = "일반";
        } else if (data[`${column}`] == 1) {
            result = "카카오";
        } else if (data[`${column}`] == 2) {
            result = "네이버";
        } else if (data[`${column}`] == 3) {
            result = "애플";
        }
    } else if (type == 'level') {
        if (data[`${column}`] == 0) {
            result = "일반유저";
        } else if (data[`${column}`] == 40) {
            result = "관리자";
        } else if (data[`${column}`] == 50) {
            result = "개발자";
        }
    } else if (type == 'prider') {
        if (data[`${column}`] == 0) {
            result = "없음";
        } else if (data[`${column}`] == 1) {
            result = "그린리더";
        } else if (data[`${column}`] == 2) {
            result = "프라이더";
        } else if (data[`${column}`] == 3) {
            result = "로얄프라이더";
        }
    } else if (type == 'img') {
        result = data[`${column}`];
    } else if (type == 'top') {
        result = "맨위로";
    } else if (type == 'target') {
        if (data[`${column}`] == 0) {
            result = "현재창";
        } else if (data[`${column}`] == 1) {
            result = "새창";
        }
    } else if (type == 'status') {
        if (data[`${column}`] > 0) {
            result = "on";
        } else {
            result = "off";
        }
    } else if (type == 'alarm_type') {
        if (data[`${column}`] == 1) {
            result = "스케줄링";
        } else {
            result = "즉시실행";
        }
    } else if (type == '---') {
        result = "---";
    } else if (type == 'increase') {
        result = data[`${column}`] > 0 ? "+" : "-";
    } else if (type == 'minus_increase') {
        result = data[`${column}`] < 0 ? "+" : "-";
    } else if (type == 'edit') {
        result = "---";
    } else if (type == 'user_money_edit') {
        result = "---";
    } else if (type == 'user_marketing') {
        result = "---";
    } else if (type.includes('exchange')) {
        data['explain_obj'] = JSON.parse(data['explain_obj']);
        if (type.split('_')[1] == 'star') {
            if (data[`explain_obj`]?.star) {
                result = commarNumber(data[`explain_obj`]?.star);
            } else {
                result = "---";
            }
        } else if (type.split('_')[1] == 'money') {
            if (data[`explain_obj`]?.star) {
                result = commarNumber(data[`explain_obj`]?.star * 100);
            } else {
                result = "---";
            }
        } else if (type.split('_')[1] == 'moneycommission') {
            if (data[`explain_obj`]?.star) {
                result = commarNumber(data[`explain_obj`]?.star * data[`explain_obj`]?.withdraw_commission_percent / 100);
            } else {
                result = "---";
            }
        } else if (type.split('_')[1] == 'moneypayment') {
            if (data[`explain_obj`]?.star) {
                result = commarNumber(data[`explain_obj`]?.star * 100);
            } else {
                result = "---";
            }
        } else if (type.split('_')[1] == 'status') {
            if (data?.status == -1) {
                result = "반송";
            } else if (data?.status == 0) {
                result = "접수대기";
            } else if (data?.status == 1) {
                result = "접수완료";
            } else if (data?.status == 2) {
                result = "지급완료";
            }
        } else if (type.split('_')[1] == 'date') {
            if (data[`explain_obj`]?.date) {
                result = data['explain_obj']?.date;
            } else {
                result = "---";
            }
        } else if (type.split('_')[1] == 'edit') {
            result = "---";
        }

    }else if(type == 'pay_status'){
        result = getPayStatus(data);
    }
    return result;
}