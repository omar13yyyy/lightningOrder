import { userRepository } from "./customers.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  CustomerServeceParams,
  CustomerRepoParams,
  LoginServeceParams,
  PhoneOnlyRepoParams,
  updateEffectiveTokenRepoParams,
  RegisterServeceParams,
  CodeValidationRepoParams,
  PhoneOnlyServeceParams,
  insertCustomerRepoParams,
  CodeValidationServeceParams,
  ResetPasswordServeceParams,
  ResetPasswordRepoParams,
} from "../../../types/customers";

export const customersServices = {
  getCustomerTokenByIdService: async (params: CustomerServeceParams) => {
    return userRepository.fetchCustomerTokenById({
      customerId: params.customerId,
    } as CustomerRepoParams);

     
  },

  loginService: async (params: LoginServeceParams) => {
    if (await userRepository.isCustomerNumberUsed) {
      const { encrypted_password, customer_id } =
        await userRepository.fetchCustomerIdPasswordByNumber({
          phoneNumber: params.number,
        } as PhoneOnlyRepoParams);
      if (await bcrypt.compare(params.reqPassword, encrypted_password)) {
        const token = jwt.sign(
          { customer_id: customer_id },
          process.env.TOKEN_SECRET_CUSTOMER
        );
        console.log(process.env.TOKEN_SECRET_CUSTOMER)
        await userRepository.updateEffectiveToken({
          token: token,
          customerId: customer_id,
        } as updateEffectiveTokenRepoParams);
        return token;
      }
    }
    return null;
  },
  customerRegisterService: async (params: RegisterServeceParams) => {
    console.log("code : ", params.code);

    if (
      (await userRepository.isValidCode({
        phoneNumber: params.phoneNumber,
        code: params.code,
      } as CodeValidationRepoParams)) &&
      !(await userRepository.isCustomerNumberUsed({
        phoneNumber: params.phoneNumber,
      } as PhoneOnlyServeceParams))
    ) {
      const encryptedPassword = await bcrypt.hash(params.password, 10);
      const customerId = await userRepository.insertCustomer({
        fullName: params.fullName,
        phoneNumber: params.phoneNumber,
        email: params.email,
        encryptedPassword: encryptedPassword,
        birthDate: params.birthDate,
        address: params.address,
      } as insertCustomerRepoParams);
      const token = jwt.sign(
        { customer_id: customerId },
        process.env.TOKEN_SECRET_ADMIN
      );
      await userRepository.deleteCode({
        phoneNumber: params.phoneNumber,
      } as PhoneOnlyServeceParams);

      return token;
    }
    return null;
  },
  confirmedCodeIsValidService: async (params: CodeValidationServeceParams) => {
    return await userRepository.isValidCode({
      phoneNumber: params.phoneNumber,
      code: params.code,
    } as CodeValidationRepoParams);
  },

  addRestConfirmationCodeService: async (params: PhoneOnlyServeceParams) => {
    if (
      await userRepository.isCustomerNumberUsed({
        phoneNumber: params.phoneNumber,
      } as PhoneOnlyServeceParams)
    ) {
      const codeString = Math.floor(1000 + Math.random() * 9000);
      const code = codeString.toString();

      console.log("code for ", params.phoneNumber, " is : ", code);
      await userRepository.insertConfirmationCode({
        phoneNumber: params.phoneNumber,
        code: code,
      } as CodeValidationRepoParams);

      return true;
    }
    return false;
  },
  addConfirmationCodeService: async (params: PhoneOnlyServeceParams) => {
    if (
      !(await userRepository.isCustomerNumberUsed({
        phoneNumber: params.phoneNumber,
      } as PhoneOnlyServeceParams))
    ) {
      const codeString = Math.floor(1000 + Math.random() * 9000);
      const code = codeString.toString();

      console.log("code for ", params.phoneNumber, " is : ", code);
      await userRepository.insertConfirmationCode({
        phoneNumber: params.phoneNumber,
        code: code,
      } as CodeValidationRepoParams);

      return true;
    }
    return false;
  },
  customerResetPasswordService: async (params: ResetPasswordServeceParams) => {
    if (
      await userRepository.isValidCode({
        phoneNumber: params.phoneNumber,
        code: params.code,
      } as CodeValidationRepoParams)
    ) {
      const encryptedPassword = await bcrypt.hash(params.newPassword, 10);
      if (
        await userRepository.isCustomerNumberUsed({
          phoneNumber: params.phoneNumber,
        } as PhoneOnlyServeceParams)
      ) {
        await userRepository.updateCustomerPassword({
          phoneNumber: params.phoneNumber,
          newPassword: encryptedPassword,
        } as ResetPasswordRepoParams);
        await userRepository.deleteCode({
          phoneNumber: params.phoneNumber,
        } as PhoneOnlyServeceParams);

        return true;
      }
    }
    return false;
  },
    getCustomerProfileService : async (params : CustomerServeceParams)=> {
    return userRepository.getCustomerProfile(params);

  },
  getCustomerWalletService : async (params : CustomerServeceParams)=> {
    return userRepository.getCustomerWallet(params);

  },
  logoutService : async (params : CustomerServeceParams)=> {
    return userRepository.logout(params);

  }


};
