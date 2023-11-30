
export const columnObjFormat = (name, width, type, column, text_align) => {
    return {
        name: name,
        width: width,
        type: type,
        column: column,
        text_align: text_align,
    }
}

export const sidebarContentFormat = (main_title, list, main_icon) => {
    return {
        main_title: main_title,
        list: list,
        main_icon: main_icon
    }
}
export const sidebarObjListFormat = (name, link, level, allow_list) => {
    return {
        name: name,
        link: link,
        level: level,
        allow_list: allow_list,
    }
}
export const sidebarObjFormat = (breadcrumb, schema, zColumn, queries, is_edit, is_move, width, if_use_pk) => {
    return {
        breadcrumb: breadcrumb,
        schema: schema,
        zColumn: zColumn,
        queries: queries,
        is_edit: is_edit,
        is_move: is_move,
        width: width,
        if_use_pk: if_use_pk
    }
}
export const editContentFormat = (columns) => {
    return {
        columns: columns
    }
}
export const editColumnObjFormat = (title, type, type_option, class_name, is_only_add, is_only_update) => {
    return {
        title: title,//제목
        type: type,//타입 -> input, select, editor, img
        type_option: type_option,
        class_name: class_name,
        is_only_add: is_only_add,//추가할때만 사용할때
        is_only_update: is_only_update,//수정할때만 사용할때
    }
}
export const inputOption = () => {
    return {
    }
}
