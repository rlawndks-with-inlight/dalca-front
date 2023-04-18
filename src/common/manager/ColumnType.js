import { BiEditAlt } from "react-icons/bi";
import { getPayStatus, getUserLevelByNumber } from "../../functions/format";
import { commarNumber, dateFormat, getKoPayCategoryByNum } from "../../functions/utils";
import theme from "../../styles/theme";
import { AiFillCreditCard, AiOutlineUnorderedList } from "react-icons/ai";
import { RiDeleteBinLine, RiMoneyDollarCircleLine } from "react-icons/ri";
import Swal from "sweetalert2";
import { backUrl } from "../../data/Data";
import { CgToggleOff, CgToggleOn } from "react-icons/cg";
import { GrLinkTop } from "react-icons/gr";
import { GiCancel } from "react-icons/gi";

export const returnColumn = (data_, type_, column_, schema, is_list, func) => {
    let data = { ...data_ };
    const {
        navigate,
        deleteItem,
        changeStatus,
        opTheTopItem,
        onPayCancel,
    } = func;
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
        result = getUserLevelByNumber(data[`${column}`])
    } else if (type == 'pay_category') {
        result = getKoPayCategoryByNum(data?.pay_category)
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
        if (is_list) {
            result = <>
                <img alt={`${column}`} src={backUrl + data[`${column}`]} style={{ height: '5rem' }} />
            </>
        }
    } else if (type == 'top') {
        result = "맨위로";
        if (is_list) {
            result = <>
                <GrLinkTop style={{ color: '#aaaaaa', cursor: 'pointer', fontSize: theme.size.font3 }} onClick={() => opTheTopItem(data.pk, data.sort, schema)} />
            </>
        }
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
        if (is_list) {
            result = <>
                {data[`${column}`] > 0 ?
                    <CgToggleOn style={{ color: `${theme.color.background1}`, cursor: 'pointer', fontSize: theme.size.font1 }} onClick={() => { changeStatus(0, data, column) }} /> :
                    <CgToggleOff style={{ color: '#aaaaaa', cursor: 'pointer', fontSize: theme.size.font1 }} onClick={() => { changeStatus(1, data, column) }} />}
            </>
        }
    }else if(type=='want_pay_cancel'){  
        if(data['is_want_cancel']==1){
            result = '취소요청';
        }else if(data['is_want_cancel']==-1){
            result = '취소완료';
        }
    }else if (type == 'request_status') {
        if (data[`status`] == 1) {
            result = "답변완료";
        } else {
            result = "확인대기";
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
        if (is_list) {
            result = <>
                <BiEditAlt style={{ cursor: 'pointer', color: '#546de5', fontSize: theme.size.font3 }} onClick={() => navigate(`/manager/edit/${data.table || schema}/${data.pk}`)} />
            </>
        }
    } else if (type == 'pay_list') {
        result = "---";
        if (is_list) {
            result = <>
                <AiOutlineUnorderedList style={{ cursor: 'pointer', color: '#546de5', fontSize: theme.size.font3 }} onClick={() => navigate(`/manager/list/pay/${data.pk}`, { state: { breadcrumb: data.title + ' 결제 내역' } })} />

            </>
        }
    } else if (type == 'pay_edit') {
        result = "---";
        if (is_list) {
            result = <>
                <BiEditAlt style={{ cursor: 'pointer', color: '#546de5', fontSize: theme.size.font3 }} onClick={() => navigate(`/manager/edit/pay_edit/${data.pk}`)} />
            </>
        }
    } else if (type == 'delete') {
        result = "---";
        if (is_list) {
            result = <>
                <RiDeleteBinLine style={{ cursor: 'pointer', color: '#e15f41', fontSize: theme.size.font3 }} onClick={() => {
                    Swal.fire({
                        title: '정말로 삭제하시겠습니까?',
                        showCancelButton: true,
                        confirmButtonText: '확인',
                        cancelButtonText: '취소'
                    }).then(async (result) => {
                        if (result.isConfirmed) {
                            deleteItem(data.pk, schema)

                        }
                    })
                }} />
            </>
        }
    } else if (type == 'pay_cancel') {
        result = "---";
        if (is_list) {
            result = <>
                 <GiCancel style={{ cursor: 'pointer', color: '#546de5', fontSize: theme.size.font3 }} onClick={() =>{
                   onPayCancel(data);
                 }} />
            </>
        }
    }else if (type == 'user_pay_list') {
        result = "---";
        if (is_list) {
            result = <>
                <RiMoneyDollarCircleLine style={{ cursor: 'pointer', color: '#546de5', fontSize: theme.size.font3 }} onClick={() => navigate(`/manager/list/pay/${data.pk}`, { state: { breadcrumb: `${data?.id} 회원 결제 내역` } })} />
            </>
        }
    }else if (type == 'pay_card') {
        result = "---";
        if (is_list) {
            result = <>
                <AiFillCreditCard style={{ cursor: 'pointer', color: '#546de5', fontSize: theme.size.font3 }} onClick={() => navigate(`/manager/edit/user_card/${data.pk}`, { state: { breadcrumb: `${data?.id} 회원 결제 카드` } })} />
            </>
        }
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

    } else if (type == 'pay_status') {
        result = getPayStatus(data);
    }
    return result;
}