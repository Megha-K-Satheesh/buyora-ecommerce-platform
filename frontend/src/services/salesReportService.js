import adminApiClient from "../utils/adminApiClient";

export const adminSalesReportService = {
  getSalesReport(filters = {}) {
    return adminApiClient.get("/sales/sales-report", { params: filters });
  },

  exportSalesReportPDF(filters = {}) {
    return adminApiClient.get("/sales/sales-report/export", { 
      params: filters,
      responseType: "blob"
    });
  },

  exportSalesReportCSV(filters = {}) {
    return adminApiClient.get("/sales-report/export/csv", { 
      params: filters,
      responseType: "blob"
    });
  }
};
