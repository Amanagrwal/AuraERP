import api from "@/lib/axios";
import { getUserId } from "./getUserId";



export const fetchcustumer = async (companyId: number) => {
  const user_id = getUserId();
  const res = await api.get(
    `/customer/?user_id=${user_id}&company_id=${companyId}`
  );
  return {
    clients: res.data.data,
    nextInvoiceNo: res.data.next_invoice_no,
  };
};