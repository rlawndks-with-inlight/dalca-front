import { backUrl } from "../Data";
import { EditorState } from "draft-js"
import { columnObjFormat, editColumnObjFormat, editContentFormat, sidebarContentFormat, sidebarObjFormat, sidebarObjListFormat } from "./ManagerContentFormat";
import { BsPerson, BsCameraVideo, BsAlarm } from 'react-icons/bs'
import { AiTwotoneSetting, AiOutlineUnorderedList } from 'react-icons/ai'
import { RiMoneyDollarCircleLine } from "react-icons/ri";
export const editorState = {
    editorState: EditorState.createEmpty()
}

export const cardDefaultColor = {
    font: "#000",
    background: "#f4f4f4"
}
export const needTwoImage = ['issue', 'theme', 'feature'];

export const zSidebar = [
    sidebarContentFormat('회원관리', [
        sidebarObjListFormat('회원관리', '/manager/list/user', 40, ['/manager/list/user']),//edit
        // sidebarObjListFormat('회원통계', '/manager/list/user_statistics', 40, ['/manager/list/user_statistics']),//edit
        //sidebarObjListFormat('댓글관리', '/manager/list/comment', 40, ['/manager/list/comment']),//edit
        //sidebarObjListFormat('장바구니관리', '/manager/list/bag', 40, ['/manager/list/bag']),//edit
        // sidebarObjListFormat('결제내역관리', '/manager/list/subscribe', 40, ['/manager/list/subscribe']),//list
        //sidebarObjListFormat('결제엑셀업로드', '/manager/edit/pay_excel', 40, ['/manager/edit/pay_excel']),//list
    ], <BsPerson />),
    sidebarContentFormat('운영관리', [
        sidebarObjListFormat('계약관리', '/manager/list/contract', 40, ['/manager/list/contract']),//list
        sidebarObjListFormat('결제관리', '/manager/list/pay', 40, ['/manager/list/pay']),//list
        sidebarObjListFormat('공인중개사 정산관리', '/manager/list/commission', 40, ['/manager/list/commission']),//list
        sidebarObjListFormat('부동산관리', '/manager/list/real_estate', 40, ['/manager/list/real_estate']),//list
        sidebarObjListFormat('카드수수료관리', '/manager/edit/card_percent_setting/1', 40, ['/manager/edit/card_percent_setting/1']),
        sidebarObjListFormat('공인중개사수수료관리', '/manager/edit/commission_percent_setting/1', 40, ['/manager/edit/commission_percent_setting/1']),//commission_percent_setting
        sidebarObjListFormat('포인트관리', '/manager/edit/point_setting/1', 40, ['/manager/edit/point_setting/1']),//list
        sidebarObjListFormat('포인트내역관리', '/manager/list/point', 40, ['/manager/list/point']),//list
    ], <RiMoneyDollarCircleLine />),
    sidebarContentFormat('기본설정', [
        sidebarObjListFormat('메인배너', '/manager/edit/home_setting/1', 40, ['/manager/edit/home_setting/1']),//list
        sidebarObjListFormat('팝업관리', '/manager/list/popup', 40, ['/manager/list/popup']),//list
    ], <AiTwotoneSetting />),
    sidebarContentFormat('게시판관리', [
        sidebarObjListFormat('문의관리', '/manager/list/request', 40, ['/manager/list/request']),//list
        sidebarObjListFormat('자주 하는 질문 관리', '/manager/list/faq', 40, ['/manager/list/faq']),//list
        //sidebarObjListFormat('이벤트관리', '/manager/list/event', 40, ['/manager/list/event']),//list
        sidebarObjListFormat('공지사항', '/manager/list/notice', 40, ['/manager/list/notice']),//list
        sidebarObjListFormat('공인중개사 이용가이드', '/manager/edit/guide/3', 40, ['/manager/edit/guide/3']),//list
        sidebarObjListFormat('임대인 이용가이드', '/manager/edit/guide/2', 40, ['/manager/edit/guide/2']),//list
        sidebarObjListFormat('임차인 이용가이드', '/manager/edit/guide/1', 40, ['/manager/edit/guide/1']),//list
        //sidebarObjListFormat('후기관리', '/manager/list/review', 40, ['/manager/list/review']),//list
    ], <AiOutlineUnorderedList />),
    sidebarContentFormat('푸시알림', [
        sidebarObjListFormat('푸시알림', '/manager/list/alarm', 40, ['/manager/list/alarm']),//list
    ], <BsAlarm />),
];

export const objManagerListContent = {
    user: sidebarObjFormat(
        '회원 리스트',
        'user',
        [
            columnObjFormat('로그인타입', '', 'login_type', 'type'),
            columnObjFormat('아이디', '', 'text', 'id'),
            columnObjFormat('이름', '', 'text', 'name'),
            //columnObjFormat('닉네임', '', 'text', 'nickname'),
            columnObjFormat('폰번호', '', 'text', 'phone'),
            columnObjFormat('접근권한', '', 'level', 'user_level'),
            columnObjFormat('포인트', '', 'number', 'point_sum'),
            columnObjFormat('주소', '', 'text', 'address'),
            columnObjFormat('상세주소', '', 'text', 'address_detail'),
            columnObjFormat('우편번호', '', 'text', 'zip_code'),
            columnObjFormat('가입일', '', 'text', 'date'),
            columnObjFormat('로그인시간', '', 'text', 'last_login'),
            columnObjFormat('승인여부', '', 'status', 'status'),
            columnObjFormat('복비승인여부', '', 'status', 'is_agree_brokerage_fee'),
            columnObjFormat('결제수수료', '', 'commission_percent', 'commission_percent'),
            columnObjFormat('결제카드', '', 'pay_card', 'pay_card'),
            columnObjFormat('결제내역', '', 'user_pay_list', 'user_pay_list'),
            columnObjFormat('수정', '', 'edit', 'edit'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ],
        ['level='],
        true,
        false,
        '100%'),
    real_estate: sidebarObjFormat(
        '부동산 관리',
        'real_estate',
        [
            columnObjFormat('부동산명', '', 'text', 'name'),
            columnObjFormat('전화번호', '', 'text', 'phone'),
            columnObjFormat('주소', '', 'text', 'address'),
            columnObjFormat('우편번호', '', 'text', 'zip_code'),
            columnObjFormat('생성일', '', 'text', 'date'),
            columnObjFormat('승인여부', '', 'status', 'status'),
            columnObjFormat('수정', '', 'edit', 'edit'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ],
        ['order=pk'],
        true,
        false),
    // user_statistics: sidebarObjFormat(
    //     '회원 통계',
    //     'user_statistics',
    //     [
    //         columnObjFormat('일자', '', 'text', 'date'),
    //         columnObjFormat('가입', '', 'number', 'user_count'),
    //         columnObjFormat('방문', '', 'number', 'visit_count'),
    //         columnObjFormat('새글', '', 'number', 'post_count'),
    //         columnObjFormat('댓글', '', 'number', 'comment_count'),
    //         columnObjFormat('페이지뷰', '', 'number', 'views_count'),
    //     ],
    //     ['statistics_type=','statistics_year=','statistics_month='],
    //     false,
    //     false),
    comment: sidebarObjFormat(
        '댓글 관리',
        'comment',
        [
            columnObjFormat('카테고리', '', 'category_type', 'category_pk'),
            columnObjFormat('제목', '', 'text', 'item_title'),
            columnObjFormat('닉네임', '', 'text', 'nickname'),
            columnObjFormat('생성일', '', 'text', 'date'),
            columnObjFormat('댓글', '', 'text', 'note'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ],
        [],
        false,
        false),
    commission: sidebarObjFormat(
        '정산 관리',
        'commission',
        [
            columnObjFormat('공인중개사아이디', '', 'text', 'user_id'),
            columnObjFormat('공인중개사명', '', 'text', 'user_name'),
            columnObjFormat('금액', '', 'number', 'price'),
            columnObjFormat('퍼센트', '', 'percent', 'percent'),
            columnObjFormat('비고', '', 'text', 'note'),
            columnObjFormat('생성일', '', 'text', 'date'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ],
        ['order=pk', 'start_date=', 'end_date=', 'status='],
        true,
        false,
        '100%'),
    contract: sidebarObjFormat(
        '계약 관리',
        'contract',
        [
            columnObjFormat('고유번호', '', 'number', 'pk'),
            columnObjFormat('주소', '', 'text', 'address'),
            columnObjFormat('상세주소', '', 'text', 'address_detail'),
            columnObjFormat('보증금', '', 'number', 'deposit'),
            columnObjFormat('계약금', '', 'number', 'down_payment'),
            columnObjFormat('월세', '', 'number', 'monthly'),
            columnObjFormat('부동산중개수수료', '', 'number', 'brokerage_fee'),
            columnObjFormat('임차인아이디', '', 'text', 'lessee_id'),
            columnObjFormat('임차인명', '', 'text', 'lessee_name'),
            columnObjFormat('임차인동의여부', '', 'is_appr', 'lessee_appr'),
            columnObjFormat('임대인아이디', '', 'text', 'landlord_id'),
            columnObjFormat('임대인명', '', 'text', 'landlord_name'),
            columnObjFormat('임대인동의여부', '', 'is_appr', 'landlord_appr'),
            columnObjFormat('공인중개사아이디', '', 'text', 'realtor_id'),
            columnObjFormat('공인중개사명', '', 'text', 'realtor_name'),
            columnObjFormat('생성일', '', 'text', 'date'),
            columnObjFormat('결제내역', '', 'pay_list', 'pay_list'),
            columnObjFormat('수정', '', 'edit', 'edit'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ],
        ['order=pk', 'start_date=', 'end_date=', 'is_contract='],
        true,
        false,
        '100%'),
    pay: sidebarObjFormat(
        '결제 내역 관리',
        'pay',
        [
            columnObjFormat('결제고유번호', '', 'number', 'pk'),
            columnObjFormat('계약고유번호', '', 'number', 'contract_pk'),
            columnObjFormat('임차인아이디', '', 'text', 'lessee_id'),
            columnObjFormat('임차인명(결제인명)', '', 'text', 'lessee_name'),
            columnObjFormat('임대인아이디', '', 'text', 'landlord_id'),
            columnObjFormat('임대인명', '', 'text', 'landlord_name'),
            columnObjFormat('공인중개사아이디', '', 'text', 'realtor_id'),
            columnObjFormat('공인중개사명', '', 'text', 'realtor_name'),
            columnObjFormat('결제예정일', '', 'text', 'day'),
            columnObjFormat('생성일', '', 'text', 'date'),
            columnObjFormat('결제일', '', 'text', 'trade_date'),
            columnObjFormat('금액', '', 'number', 'price'),
            columnObjFormat('결제타입', '', 'pay_type', 'type'),
            columnObjFormat('카드수수료', '', 'percent', 'card_percent'),
            columnObjFormat('종류', '', 'pay_category', 'pay_category'),
            columnObjFormat('납부종류', '', 'is_auto_pay', 'is_auto_pay'),
            columnObjFormat('납부현황', '', 'pay_status', 'pay_status'),
            columnObjFormat('취소요청현황', '', 'want_pay_cancel', 'want_pay_cancel'),
            columnObjFormat('취소', '', 'pay_cancel', 'pay_cancel'),
            columnObjFormat('수정', '', 'pay_edit', 'pay_edit'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ],
        ['status=', 'order=pk', 'start_date=', 'end_date=', 'pay_category=', 'is_auto='],
        true,
        false,
        '100%'),
    contract_pay: sidebarObjFormat(
        '결제 내역 관리',
        'pay',
        [
            columnObjFormat('계약고유번호', '', 'number', 'contract_pk'),
            columnObjFormat('임차인아이디', '', 'text', 'lessee_id'),
            columnObjFormat('임차인명(결제인명)', '', 'text', 'lessee_name'),
            columnObjFormat('임대인아이디', '', 'text', 'landlord_id'),
            columnObjFormat('임대인명', '', 'text', 'landlord_name'),
            columnObjFormat('공인중개사아이디', '', 'text', 'realtor_id'),
            columnObjFormat('공인중개사명', '', 'text', 'realtor_name'),
            columnObjFormat('결제예정일', '', 'text', 'day'),
            columnObjFormat('생성일', '', 'text', 'date'),
            columnObjFormat('금액', '', 'number', 'price'),
            columnObjFormat('카드수수료', '', 'percent', 'card_percent'),
            columnObjFormat('종류', '', 'pay_category', 'pay_category'),
            columnObjFormat('납부종류', '', 'is_auto_pay', 'is_auto_pay'),
            columnObjFormat('납부현황', '', 'pay_status', 'pay_status'),
            columnObjFormat('취소요청현황', '', 'want_pay_cancel', 'want_pay_cancel'),
            columnObjFormat('취소', '', 'pay_cancel', 'pay_cancel'),
            columnObjFormat('수정', '', 'pay_edit', 'pay_edit'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ],
        ['status=', 'order=pk', 'start_date=', 'end_date=', 'pay_category=', 'is_auto='],
        true,
        false,
        '100%'),
    point: sidebarObjFormat(
        '포인트 내역 관리',
        'point',
        [
            columnObjFormat('유저아이디', '', 'text', 'user_id'),
            columnObjFormat('유저명', '', 'text', 'user_name'),
            columnObjFormat('발생금액', '', 'number', 'price'),
            columnObjFormat('비고', '', 'text', 'manager_note'),
            columnObjFormat('발생일', '', 'text', 'date'),
            columnObjFormat('수정', '', 'edit', 'edit'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ],
        ['status=', 'order=pk', 'start_date=', 'end_date='],
        true,
        false,
        '100%'),
    request: sidebarObjFormat(
        '문의 관리',
        'request',
        [
            columnObjFormat('문의자아이디', '', 'text', 'id'),
            columnObjFormat('문의자명', '', 'text', 'name'),
            // columnObjFormat('문의자주민번호', '', 'text', 'id_number'),
            columnObjFormat('제목', '', 'text', 'title'),
            columnObjFormat('확인여부', '', 'request_status', 'request_status'),
            columnObjFormat('문의날짜', '', 'text', 'date'),
            columnObjFormat('답변하기', '', 'edit', 'edit'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ],
        [],
        false,
        false),
    faq: sidebarObjFormat(
        '자주 하는 질문 관리',
        'faq',
        [
            columnObjFormat('제목', '', 'text', 'title'),
            columnObjFormat('등록일', '', 'text', 'date'),
            columnObjFormat('맨위로', '', 'top', 'top'),
            columnObjFormat('노출여부', '', 'status', 'status'),
            columnObjFormat('수정', '', 'edit', 'edit'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ],
        [],
        true,
        true),
    event: sidebarObjFormat(
        '이벤트 관리',
        'event',
        [
            columnObjFormat('배너이미지', '', 'img', 'main_img'),
            columnObjFormat('제목', '', 'text', 'title'),
            columnObjFormat('시작일', '', 'text', 'start_date'),
            columnObjFormat('종료일', '', 'text', 'end_date'),
            columnObjFormat('등록일', '', 'text', 'date'),
            columnObjFormat('맨위로', '', 'top', 'top'),
            columnObjFormat('노출여부', '', 'status', 'status'),
            columnObjFormat('수정', '', 'edit', 'edit'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ],
        [],
        true,
        true),
    notice: sidebarObjFormat(
        '공지 관리',
        'notice',
        [
            columnObjFormat('메인이미지', '', 'img', 'main_img'),
            columnObjFormat('제목', '', 'text', 'title'),
            columnObjFormat('등록일', '', 'text', 'date'),
            columnObjFormat('맨위로', '', 'top', 'top'),
            columnObjFormat('노출여부', '', 'status', 'status'),
            columnObjFormat('수정', '', 'edit', 'edit'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ],
        [],
        true,
        true),
    review: sidebarObjFormat(
        '후기 관리',
        'review',
        [
            columnObjFormat('강의제목', '', 'text', 'item_title'),
            columnObjFormat('제목', '', 'text', 'title'),
            columnObjFormat('닉네임', '', 'text', 'nickname'),
            columnObjFormat('생성일', '', 'text', 'date'),
            columnObjFormat('BEST', '', 'status', 'is_best'),
            columnObjFormat('자세히보기', '', 'edit', 'edit'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ],
        ['master_pk=', 'academy_category_pk='],
        false,
        false),
    alarm: sidebarObjFormat(
        '푸시알림 관리',
        'alarm',
        [
            columnObjFormat('제목', '', 'text', 'title'),
            columnObjFormat('타입', '', 'alarm_type', 'type'),
            columnObjFormat('생성시간', '', 'text', 'date'),
            columnObjFormat('노출여부', '', 'status', 'status'),
            columnObjFormat('수정', '', 'edit', 'edit'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ],
        [],
        true,
        false),
    popup: sidebarObjFormat(
        '팝업 관리',
        'popup',
        [
            columnObjFormat('이미지', '', 'img', 'img_src'),
            columnObjFormat('링크', '', 'text', 'link'),
            columnObjFormat('맨위로', '', 'top', 'top'),
            columnObjFormat('노출여부', '', 'status', 'status'),
            columnObjFormat('수정', '', 'edit', 'edit'),
            columnObjFormat('삭제', '', 'delete', 'delete'),
        ],
        [],
        true,
        true),
}
export const objManagerOptionCardContent = {

}
export const objManagerEditContent = {


    request: {
        schema: 'request',
        breadcrumb: '문의',
        add_list: [],
        update_list: [{ key: 'status', value: '1' }],
        columns: [//img, select, input, 
            [
                editColumnObjFormat('제목', 'input', { disabled: true }, 'title'),
            ],
            [
                editColumnObjFormat('내용', 'textarea', { disabled: true }, 'note'),
            ],
            [
                editColumnObjFormat('답변', 'textarea', {}, 'reply_note'),
            ],
        ],
    },

    common_setting: {
        schema: 'setting',
        breadcrumb: '상단띠배너',
        add_list: [],
        columns: [//img, select, input, 
            [
                editColumnObjFormat('탑 띠배너 전문가명', 'input', {}, 'top_banner_manager_name'),
                editColumnObjFormat('탑 띠배너 글', 'input', {}, 'top_banner_note'),
                editColumnObjFormat('탑 띠배너 링크', 'input', { placeholder: '/home' }, 'top_banner_link'),
            ],
        ],
    },
    subscribe: {
        schema: 'subscribe',
        breadcrumb: '결제 내역',
        add_list: [],
        columns: [//img, select, input, 
            [
                editColumnObjFormat('유저아이디', 'input', {}, 'user_id'),
            ],
            [
                editColumnObjFormat('강의명', 'select', {
                    api_url: '/api/items?table=academy_category', option_list: [], use_name_column: 'title', use_val_column: 'pk'
                }, 'academy_category_pk'),
            ],
            [
                editColumnObjFormat('승인금액', 'input', {}, 'price'),

            ],
            [
                editColumnObjFormat('결제타입', 'select', {
                    api_url: false, option_list: [
                        { name: '카드결제', val: 0 },
                        { name: '무통장입금', val: 1 },
                        { name: '기타', val: 2 },
                    ]
                }, 'type'),
            ],
        ],
    },
    pay_edit: {
        schema: 'subscribe',
        breadcrumb: '결제 내역',
        add_list: [],
        columns: [//img, select, input, 
        ],
    },
    pay_cancel: {
        schema: 'subscribe',
        breadcrumb: '결제 내역 취소',
        add_list: [],
        columns: [//img, select, input, 
        ],
    },
    home_setting: {
        schema: 'setting',
        breadcrumb: '메인배너',
        add_list: [],
        columns: [//img, select, input, 
            [
                editColumnObjFormat('광고 이미지 (500x100)', 'img', { field_name: 'content1' }, 'home_banner_img_1'),
            ],
            [
                editColumnObjFormat('링크', 'input', { placeholder: 'https://example.com' }, 'home_banner_link_1'),
            ],
        ],
    },
    point_setting: {
        schema: 'setting',
        breadcrumb: '포인트설정',
        add_list: [],
        columns: [
            [
                editColumnObjFormat('포인트 적립퍼센트 (%)', 'input', { placeholder: '숫자를 입력해 주세요 1~100' }, 'point_percent'),
            ],
        ],
    },
    card_percent_setting: {
        schema: 'setting',
        breadcrumb: '카드 수수료 설정',
        add_list: [],
        columns: [
            [
                editColumnObjFormat('카드수수료 (%)', 'input', { placeholder: '숫자를 입력해 주세요 0~100' }, 'card_percent'),
            ],
        ],
    },
    commission_percent_setting: {
        schema: 'setting',
        breadcrumb: '공인중개사 수수료 설정',
        add_list: [],
        columns: [
            [
                editColumnObjFormat('수수료 (%)', 'input', { placeholder: '숫자를 입력해 주세요 0~100' }, 'commission_percent'),
            ],
        ],
    },
    event: {
        schema: 'event',
        breadcrumb: '이벤트',
        add_list: [],
        columns: [//img, select, input, 
            [
                editColumnObjFormat('메인이미지 (300x200)', 'img', { field_name: 'content' }, 'main_img'),
            ],
            [
                editColumnObjFormat('제목', 'input', { placeholder: '제목을 입력해 주세요.' }, 'title'),
            ],
            [
                editColumnObjFormat('시작일', 'input', { type: 'date' }, 'start_date'),
                editColumnObjFormat('종료일', 'input', { type: 'date' }, 'end_date'),
            ],
            [
                editColumnObjFormat('내용', 'editor', {}, 'note'),
            ],
        ],
    },
    faq: {
        schema: 'faq',
        breadcrumb: '자주 하는 질문',
        add_list: [],
        columns: [//img, select, input, 
            [
                editColumnObjFormat('제목', 'input', { placeholder: '제목을 입력해 주세요.' }, 'title'),
            ],
            [
                editColumnObjFormat('내용', 'editor', {}, 'note'),
            ],
        ],
    },

    notice: {
        schema: 'notice',
        breadcrumb: '공지사항',
        columns: [//img, select, input, 
            [
                editColumnObjFormat('메인이미지 (150x100)', 'img', { field_name: 'content' }, 'main_img'),
            ],
            [
                editColumnObjFormat('제목', 'input', { placeholder: '제목을 입력해 주세요.' }, 'title'),
            ],
            [
                editColumnObjFormat('내용', 'editor', {}, 'note'),
            ],
        ],
    },
    guide: {
        schema: 'guide',
        breadcrumb: '공지사항',
        columns: [//img, select, input, 
            [
                editColumnObjFormat('제목', 'input', { placeholder: '제목을 입력해 주세요.' }, 'title'),
            ],
            [
                editColumnObjFormat('내용', 'editor', {}, 'note'),
            ],
        ],
    },
    review: {
        schema: 'review',
        breadcrumb: '후기',
        columns: [//img, select, input, 
            [
                editColumnObjFormat('제목', 'input', { placeholder: '제목을 입력해 주세요.' }, 'title'),
            ],
            [
                editColumnObjFormat('내용', 'editor', {}, 'note'),
            ],
        ],
    },
    app: {
        schema: 'app',
        breadcrumb: '퍼스트앱',
        add_list: [],
        columns: [//img, select, input, 
            [
                editColumnObjFormat('앱이미지 (150x150)', 'img', { field_name: 'content' }, 'main_img'),
            ],
            [
                editColumnObjFormat('앱이름', 'input', { placeholder: '' }, 'name'),
                editColumnObjFormat('링크', 'input', { placeholder: '' }, 'link'),
            ],
        ],
    },
    popup: {
        schema: 'popup',
        breadcrumb: '팝업',
        add_list: [],
        columns: [//img, select, input, 
            [
                editColumnObjFormat('이미지 (자율)', 'img', { field_name: 'content' }, 'img_src'),
            ],
            [
                editColumnObjFormat('링크', 'input', { placeholder: '/home' }, 'link'),
            ],
        ],
    },
}
export const getManagerListApi = (table, num) => {
    let str = "";
    return str;
}
export const slideSetting = {
    infinite: false,
    dots: true,
    speed: 500,
    autoplay: false,
    autoplaySpeed: 2500,
    slidesToShow: 1.15,
    slidesToScroll: 1,
    breakpoint: 480,
    beforeChange: (current, next) => { console.log(current) },
    afterChange: current => { console.log(current) },
}

export { backUrl };