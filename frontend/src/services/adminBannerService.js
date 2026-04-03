import adminApiClient from "../utils/adminApiClient";

export const adminBannerService = {
  addBanner(formData) {
    return adminApiClient.post("/banner/add-banner", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getBanners({ page = 1, limit = 10, pageType = "", section = "" }) {
    return adminApiClient.get("/banner/get-banners", {
      params: { page, limit, pageType, section },
    });
  },
  getBannersUser({ page = 1,  section = "" }) {
    return adminApiClient.get("/banner/get-banners-user", {
      params: { page, section },
    });
  },

  getBannerById(id) {
    return adminApiClient.get(`/banner/get-banner-id/${id}`);
  },

  updateBanner(id, formData) {
    return adminApiClient.put(`/banner/update-banner/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteBanner(id) {
    return adminApiClient.delete(`/banner/delete-banner/${id}`);
  },
};
