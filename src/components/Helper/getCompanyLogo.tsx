 export const getCompanyLogo = (logo?: string | null) =>
  logo ? `${import.meta.env.VITE_API_BASE_URL}${logo}` : null;
