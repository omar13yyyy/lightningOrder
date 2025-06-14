import {
  LoginReqBody,
  LoginServeceParams,
  RegisterReqBody,
  RegisterServeceParams,
  PhoneOnlyReqBody,
  PhoneOnlyServeceParams,
  CodeValidationReqBody,
  CodeValidationServeceParams,
  ResetPasswordReqBody,
  ResetPasswordServeceParams,
} from "../../../types/customers";
import { customersServices } from "./customers.service";

export const customersController = {
  customerLogin: async (req, res) => {
    const body: LoginReqBody = req.body;

    const token = await customersServices.loginService({
      number: body.number,
      reqPassword: body.password,
    } as LoginServeceParams);
    if (token != null) res.send({ token: token, message: "Done" });
    else res.status(401).send("The phone number or password is incorrect.");
  },
  customerRegister: async (req, res) => {
    const body: RegisterReqBody = req.body;

    const token = await customersServices.customerRegisterService({
      fullName: body.fullName,
      phoneNumber: body.phoneNumber,
      email: body.email,
      password: body.password,
      birthDate: body.birthDate,
      address: body.address,
      code: body.code,
    } as RegisterServeceParams);

    if (token != null) {
      res.send({ token: token, message: "Done" });
    }
    //TODO CODE 401
    else res.status(401).send({ token: null, message: "not Register " });
  },

  confirmation: async (req, res) => {
    const body: PhoneOnlyReqBody = req.body;
    let isNotExist = await customersServices.addConfirmationCodeService({
      phoneNumber: body.phoneNumber,
    } as PhoneOnlyServeceParams);
    if (isNotExist) res.send({ success: true, message: "Done" });
    //TODO CODE 400 ??
    else
      res
        .status(400)
        .send({ success: false, message: "phone number is exist" });
  },
  resetConfirmation: async (req, res) => {
    const body: PhoneOnlyReqBody = req.body;
    let isExist = await customersServices.addRestConfirmationCodeService({
      phoneNumber: body.phoneNumber,
    } as PhoneOnlyServeceParams);
    if (isExist) res.send({ success: true, message: "Done" });
    //TODO CODE 400 ??
    else
      res
        .status(400)
        .send({ success: false, message: "phone number is exist" });
  },
  checkCodeValidity: async (req, res) => {
    const body: CodeValidationReqBody = req.body;
    const isValid = await customersServices.confirmedCodeIsValidService({
      phoneNumber: body.phoneNumber,
      code: body.code,
    } as CodeValidationServeceParams);
    if (isValid)
      res.send({
        success: true,
        message: `Valid Code for phone number : ${body.phoneNumber}`,
      });
    //TODO CODE 400 ??
    else
      res
        .status(400)
        .send({ success: false, message: "Not Valid Code for phone number" });
  },
  resetPassword: async (req, res) => {
    const body: ResetPasswordReqBody = req.body;
    let isReset = await customersServices.customerResetPasswordService({
      phoneNumber: body.phoneNumber,
      newPassword: body.newPassword,
      code: body.code,
    } as ResetPasswordServeceParams);
    if (isReset != null) {
      res.send({ success: true, message: "Done" });
    }
    //TODO CODE 401
    else
      res.status(401).send({
        success: false,
        message: "code not valid or  phone number not exist ",
      });
  },
};
