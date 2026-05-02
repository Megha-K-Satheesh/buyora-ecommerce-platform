import adminApiClient from "../utils/adminApiClient";

export const brandService = {
  addBrand(data) {
    return adminApiClient.post("/brand/add-brand", data);
  },

  getBrandsByCategoryId(categoryId) {
    return adminApiClient.get(`/brand/get-brands/${categoryId}`);
  },

  getAllBrands({ page = 1, limit = 10, search = "" }) {
    return adminApiClient.get("/brand/brands", {
      params: {
        page,
        limit,
        search,
      },
    });
  },

  getBrandById(brandId) {
    return adminApiClient.get(`/brand/brands/${brandId}`);
  },

  updateBrand(brandId, data) {
    return adminApiClient.put(`/brand/brands/update-brand/${brandId}`, data);
  },

  deleteBrand(brandId) {
    return adminApiClient.delete(`/brand/brands/delete-brand/${brandId}`);
  },
};
