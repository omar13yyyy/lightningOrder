export interface CustomerReqBody {
  customerId: string;
}
export interface CustomerServeceParams {
  customerId: number;
}
export interface CustomerRepoParams {
  customerId: number;
}

//-----------------------------
export interface LoginReqBody {
  number: string;
  password: string;
}

export interface LoginServeceParams {
  number: string;
  reqPassword: string;
}

export interface LoginRepoParams {
  number: string;
  reqPassword: string;
}
export interface updateEffectiveTokenRepoParams {
  token: string;
  customerId: string;
}


//-----------------------------

export interface RegisterReqBody {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  birthDate: string;
  address: string;
  code: string;
}
export interface RegisterServeceParams {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  birthDate: string;
  address: string;
  code: string;
}

export interface insertCustomerRepoParams {
  fullName: string;
  phoneNumber: string;
  email: string;
  encryptedPassword: string;
  birthDate: string;
  address: string;
  code: string;
}
//-----------------------------

export interface CodeValidationReqBody {
  phoneNumber: string;
  code: string;
}
export interface CodeValidationServeceParams {
  phoneNumber: string;
  code: string;
}
export interface CodeValidationRepoParams {
  phoneNumber: string;
  code: string;
}

//-----------------------------
export interface PhoneOnlyReqBody {
  phoneNumber: string;
}
export interface PhoneOnlyServeceParams {
  phoneNumber: string;
}

export interface PhoneOnlyRepoParams {
  phoneNumber: string;
}
//-------------------------------------------------
export interface ResetPasswordReqBody {
  phoneNumber: string;
  newPassword: string;
  code: string;
}
export interface ResetPasswordServeceParams {
  phoneNumber: string;
  newPassword: string;
  code: string;
}


export interface ResetPasswordRepoParams {
  phoneNumber: string;
  newPassword: string;
}
//-----------------------------------



