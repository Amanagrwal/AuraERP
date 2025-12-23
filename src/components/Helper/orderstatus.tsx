export const OrderStatus = (order_status) => {
  if (order_status === true) return "paid";
  if (order_status === false) return "pending";
  return "draft";
};
