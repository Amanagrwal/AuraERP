import  { authApi } from "@/lib/axios";

export const loginApi = async(payload: {
  login_id: string;
  password: string;
}) => {
  const { data } = await authApi.post("/login/", payload);
  return data;
};
