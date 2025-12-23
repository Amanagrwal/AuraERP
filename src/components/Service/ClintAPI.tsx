import api from "@/lib/axios";
import { getUserId } from "../Helper/getUserId";
import { useApp } from "@/context/AppContext";

/** ✅ FETCH */
//    const  currentCompany = localStorage.getItem("currentCompanyId");

// console.log("currentCompany",currentCompany)
// export const fetchClint = async (currentCompany) => {
//     const user_id = getUserId();
//   const res = await api.get(`/customer/?user_id=${user_id}&company_id=${currentCompany}`);
//   return res.data.data;
// };

export const fetchClint = async (companyId: number) => {
  const user_id = getUserId();
  const res = await api.get(
    `/customer/?user_id=${user_id}&company_id=${companyId}`
  );
  return res.data.data;
};


export const deleteClint = async (productId: number): Promise<void> => {
  const userId = getUserId();
  await api.delete(`/customer/${productId}/?user_id=${userId}`);
};


export const createClint = async ( payload: FormData) => {
    const userId = getUserId();
  payload.append('user_id', userId.toString());
  // payload.append('company_id', compnayId.toString());
  return api.post('/customer/', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateClint = async (id: number, payload: FormData) => {
   const userId = getUserId();
  payload.append('user_id', userId.toString());
  return api.put(`/customer/${id}/`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};




export const fetchstate = async () => {
  const res = await api.get('/state/');
  return res.data.data; 
};

// export const fetchGstRates = async () => {
//   const res = await api.get('/gst/');
//   return res.data.data;
// };

// export const fetchUnits = async () => {
//   const res = await api.get('/unit_master/');
//   return res.data.data;
// };



