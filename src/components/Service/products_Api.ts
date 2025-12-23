import api from "@/lib/axios";
import { getUserId } from "../Helper/getUserId";
import { ProductFull } from "@/types";

/** ✅ FETCH */
export const fetchProducts = async (  companyId: number): Promise<ProductFull[]> => {
  const res = await api.get(`/product/?company_id=${companyId}`);
  return res.data.data;
};

export const deleteProduct = async (productId: number): Promise<void> => {
  const userId = getUserId();
  await api.delete(`/product/${productId}/?user_id=${userId}`);
};


export const createProduct = async (payload: FormData) => {
  //  payload.append('company_id', compnayId.toString());
  return api.post('/product/', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateProduct = async ( id: number, payload: FormData) => {
  return api.put(`/product/${id}/`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};




export const fetchCategories = async () => {
  const res = await api.get('/category/');
  return res.data.data; 
};

export const fetchGstRates = async () => {
  const res = await api.get('/gst/');
  return res.data.data;
};

export const fetchUnits = async () => {
  const res = await api.get('/unit_master/');
  return res.data.data;
};



