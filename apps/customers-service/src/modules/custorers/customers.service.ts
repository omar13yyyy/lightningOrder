import { userRepository } from "./customers.repository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const customersServices = {
  getCustomerTokenByIdService: async () => {
    userRepository.fetchCustomerTokenById;
  },

  loginService: async (number, reqPassword) => {
    if (await userRepository.isCustomerNumberUsed) {
      const { encrypted_password, customer_id } =
        await userRepository.fetchCustomerIdPasswordByNumber(number);
      if (await bcrypt.compare(reqPassword, encrypted_password)) {
        const token = jwt.sign(
          { customer_id: customer_id },
          process.env.TOKEN_SECRET_ADMIN
        );
        await userRepository.updateEffectiveToken(token, customer_id);
        return token;
      }
    }
    return null;
  },
  customerRegisterService: async (
    fullName,
    phoneNumber,
    email,
    password,
    birthDate,
    address,
    code
  ) => {
          console.log("code : ",code)

    if (
      await userRepository.isValidCode(
        phoneNumber,
        code )&& !(await userRepository.isCustomerNumberUsed(phoneNumber))
      
    ) {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const customerId = await userRepository.insertCustomer(
        fullName,
        phoneNumber,
        email,
        encryptedPassword,
        birthDate,
        address
      );
      const token = jwt.sign(
        { customer_id: customerId },
        process.env.TOKEN_SECRET_ADMIN
      );
      await userRepository.deleteCode(phoneNumber)

      return token;
    }
    return null;
  },
  confirmedCodeIsValidService: async (phoneNumber, code) => {
    return await userRepository.isValidCode(phoneNumber, code);
  },

  addRestConfirmationCodeService: async (phoneNumber) => {
    if ((await userRepository.isCustomerNumberUsed(phoneNumber))) {
      const codeString = Math.floor(1000 + Math.random() * 9000);
      const code = codeString.toString();

      console.log("code for ", phoneNumber, " is : ", code);
      await userRepository.insertConfirmationCode(phoneNumber, code);

      return true;
    }
    return false;
  },
    addConfirmationCodeService: async (phoneNumber) => {
    if (!(await userRepository.isCustomerNumberUsed(phoneNumber))) {
      const codeString = Math.floor(1000 + Math.random() * 9000);
      const code = codeString.toString();

      console.log("code for ", phoneNumber, " is : ", code);
      await userRepository.insertConfirmationCode(phoneNumber, code);

      return true;
    }
    return false;
  },
  customerResetPasswordService: async (phoneNumber, newPassword, code) => {
    if (await userRepository.isValidCode(phoneNumber, code)) {
      const encryptedPassword = await bcrypt.hash(newPassword, 10);
      if (await userRepository.isCustomerNumberUsed(phoneNumber)) {
        await userRepository.updateCustomerPassword(
          phoneNumber,
          encryptedPassword
        );
        await userRepository.deleteCode(phoneNumber)

        return true
      }
    }
    return false
  },
};
