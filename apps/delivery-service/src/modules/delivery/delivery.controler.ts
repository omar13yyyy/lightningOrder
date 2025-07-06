
import { deliveryServices } from "./delivery.service";

export const deliveryController = {
  driverLogin: async (req, res) => {
    const {userName,password} = req.body;

    const token = await deliveryServices.loginService(userName,password);
    if (token != null) res.send({ token: token, message: "Done" });
    else res.status(401).send("The phone number or password is incorrect.");
  },

  logout: async (req, res) => {
    const driver_id: string = req.driver_id;

    await deliveryServices.logoutService(driver_id);
    res.status(200).send({ success: true, message: "Done" });
  },
}