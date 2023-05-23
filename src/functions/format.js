const clearNumber = (value = '') => {
  return value.replace(/\D+/g, '')
}
export const formatCreditCardNumber = (value, Payment) => {
  if (!value) {
    return value
  }
  const issuer = Payment.fns.cardType(value)
  const clearValue = clearNumber(value)
  let nextValue
  switch (issuer) {
    case 'amex':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 15)}`
      break
    case 'dinersclub':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 10)} ${clearValue.slice(10, 14)}`
      break
    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(4, 8)} ${clearValue.slice(8, 12)} ${clearValue.slice(
        12,
        19
      )}`
      break
  }

  return nextValue.trim()
}

// Format expiration date in any credit card
export const formatExpirationDate = value => {
  const finalValue = value
    .replace(/^([1-9]\/|[2-9])$/g, '0$1/') // 3 > 03/
    .replace(/^(0[1-9]|1[0-2])$/g, '$1/') // 11 > 11/
    .replace(/^([0-1])([3-9])$/g, '0$1/$2') // 13 > 01/3
    .replace(/^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2') // 141 > 01/41
    .replace(/^([0]+)\/|[0]+$/g, '0') // 0/ > 0 and 00 > 0
    // To allow only digits and `/`
    .replace(/[^\d\/]|^[\/]*$/g, '')
    .replace(/\/\//g, '/') // Prevent entering more than 1 `/`

  return finalValue
}

// Format CVC in any credit card
export const formatCVC = (value, cardNumber, Payment) => {
  const clearValue = clearNumber(value)
  const issuer = Payment.fns.cardType(cardNumber)
  const maxLength = issuer === 'amex' ? 4 : 3

  return clearValue.slice(0, maxLength)
}

export const getPayStatus = (data) => {
  if (data?.status == 0)
    return "납부안함"
  else if (data?.status == 1)
    return "납부완료"
  else if (data?.status == -1)
    return "결제취소"
  else
    return "---"
}
export const getPayStatusColor = (data) => {
  if (data?.status == 0)
    return "red"
  else if (data?.status == 1)
    return "blue"
  else if (data?.status == -1)
    return "orange"
  else
    return "---"
}
export const getLoginTypeByNumber = (num) => {
  if (num == 0) {
    return "일반";
  } else if (num == 1) {
    return "카카오";
  } else if (num == 2) {
    return "네이버";
  } else if (num == 3) {
    return "애플";
  }
}
export const getUserLevelByNumber = (num, is_profile) => {
  if (num == -10) {
    return "불량회원";
  } else if (num == 0) {
    return "임차인";
  } else if (num == 5) {
    return "임대인";
  } else if (num == 10) {
    if (is_profile) {
      return "개업 공인중개사";
    }
    return "공인중개사";
  } else if (num == 40) {
    return "관리자";
  } else if (num == 50) {
    return "개발자";
  } else {
    return "잘못된레벨"
  }
}
export const getUserLevelColorByNumber = (num, is_profile) => {
  if (num == -10) {
    return 'red';
  } else if (num == 0) {
    return "orange";
  } else if (num == 5) {
    return "green";
  } else if (num == 10) {
    if (is_profile) {
      return "blue";
    }
    return "blue";
  } else if (num == 40) {
    return "indigo";
  } else if (num == 50) {
    return "purple";
  } else {
    return ""
  }
}
export const getPointHistoryByNum = (data) => {
  if (data.type == 0) {
    if (data.status == 1) {
      return "월세결제로 인해 발생"
    } else {
      return "월세결제 취소"
    }
  } else {
    return "---"

  }
}