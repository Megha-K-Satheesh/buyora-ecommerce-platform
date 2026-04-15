import adminApiClient from "../utils/adminApiClient";

export const adminUserService = {
  getUsersList({ page = 1, limit = 10, status = "", search = "" }) {
    return adminApiClient.get("/user-list", {
      params: { page, limit, status, search },
    });
  },

 banUser(Id, reason = "") {
  return adminApiClient.post(`/user-list/${Id}/ban`, { reason });
},

unbanUser(Id) {
  return adminApiClient.post(`/user-list/${Id}/unban`);
},
  getUserById(Id) {
    return adminApiClient.get(`/user-list/${Id}`);
  },
};
