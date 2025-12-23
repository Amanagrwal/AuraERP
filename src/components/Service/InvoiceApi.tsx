import api from "@/lib/axios";
import { getUserId } from "../Helper/getUserId";

/** ✅ FETCH */
export const fetchinvoice = async (companyId: number) => {
  const res = await api.get(`/invoice/?company_id=${companyId}`);
  return res.data;
};

export const fetchInvoiceById = async (id: string , companyId : number) => {
  const res = await api.get(`/invoice/${id}?company_id=${companyId}`);
  return res.data;
};


export const updateInvoice = async ({ id, payload }) => {
  const res = await api.put(`/invoice/${id}/`, payload);
  return res.data;
};

export const createinvoice = async (payload) => {
  const userId = getUserId();

  const finalPayload = {
    ...payload,
    user_id: userId,
  };

  return api.post("/invoice/", finalPayload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteInvoice = async (id: number, companyId: number) => {
  const res = await api.delete(`/invoice/${id}/?company_id=${companyId}/`);
  return res.data;
};


