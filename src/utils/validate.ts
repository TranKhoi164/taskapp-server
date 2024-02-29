export const validateEmail = (email: string) => {
  return String(email).toLowerCase().match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export const validatePassword = (password: string) => {
  // return String(password).match(
  //   /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  // )
  var regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

  if (regex.test(password)) {
    return true
  } else return false
}

export const validateStringLength = (username: string, len: number) => {
  return String(username).length < len
}

export const validatePhoneNumber = (phoneNumber: string) => {
  if ((phoneNumber[0] === '0' || phoneNumber?.slice(0, 2) == '84') && phoneNumber?.length <= 12) {
    return true
  } else return false
}