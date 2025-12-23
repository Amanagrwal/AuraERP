 export const getUserId = (): number => {
  const authStr = localStorage.getItem("auth");

  if (!authStr) {
    throw new Error("User not authenticated");
  }

  const auth = JSON.parse(authStr);
  return auth.user.user_id;
};
