import { userRepository } from "./partners.repository";

export const partnerServices = {
  getPartnerIdService: async () => {
   return userRepository.fetchPartnerId;
  }
}