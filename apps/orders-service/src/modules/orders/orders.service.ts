
import { partnerClient } from "../../../index"
export const customersServices = {
  serviceNeedPartnerId: async () => {
    partnerClient.getPartnerId();
  },

};
