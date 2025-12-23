import api from "@/lib/axios";
import { getUserId } from "../Helper/getUserId";

// export const fetchCompanies = async () => {
//   const authStr = localStorage.getItem("auth");

//   if (!authStr) {
//     throw new Error("User not authenticated");
//   }

//   const auth = JSON.parse(authStr) as {
//     user: { user_id: number };
//   };

//   const response = await api.get(
//     `/company/?user_id=${auth.user.user_id}`
//   );

//   return response.data.data;
// };


export const fetchCompanies = async () => {
  const userId = getUserId();

  const response = await api.get(`/company/?user_id=${userId}`);
  return response.data.data;
};


// export const createCompany = async (company: any) => {
//    const res = await api.post("/company/", company);
//     return res.data.data;
// };

// export const createCompany = async (company: any) => {
//   const userId = getUserId();

//   return api.post(`/company/`, {
//     ...company,
//     user_id: userId,
//   }).then(res => res.data);
// };

export const createCompany = async (company: FormData) => {
  const userId = getUserId();
  company.append('user_id', userId.toString());

  return api.post(`/company/`, company, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(res => res.data);
};

export const updateCompany = async (companyId: number, company: FormData) => {
    const userId = getUserId();
  company.append('user_id', userId.toString());
  
  return api.put(`/company/${companyId}/`, company, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(res => res.data);
};

// export const deleteCompany = async (companyId: number) => {
//   return api.delete(`/company/${companyId}/`).then(res => res.data);
// };

export const deleteCompany = async (companyId: number) => {
  const userId = getUserId();
console.log("companyId",companyId ,"userId",userId )
  return api.delete(`/company/${companyId}/?user_id=${userId}`, {
  }).then(res => res.data);
};


export const fetchCompanyType = async () => {
  const res = await api.get("/company_type/");
  return res.data.data;
};

export const fetchstate = async () => {
  const res = await api.get("/state/");
  return res.data.data;
};






