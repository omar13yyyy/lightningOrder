import { deliveryRepository } from "./delivery.repository";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const deliveryServices = {
  loginService: async (username, password) => {
    const { encrypted_password, driver_id } =
      await deliveryRepository.fetchDriverIdPasswordByUserName(username);
    if (await bcrypt.compare(password, encrypted_password)) {
      const token = jwt.sign(
        { driver_id: driver_id },
        process.env.TOKEN_SECRET_TOKEN_SECRET_DRIVER
      );
      await deliveryRepository.updateEffectiveToken(token, driver_id);

      return token;
    }

    return null;
  },
  getDriverTokenByIdService: async (driverId) => {
    return deliveryRepository.fetchDriverTokenById(driverId);

  },
  logoutService: async (driverId) => {
    return deliveryRepository.logout(driverId);
  },
  getDriverProfileService: async (driverId) => {
    return deliveryRepository.getDriverProfile(driverId);
  },
  
};
