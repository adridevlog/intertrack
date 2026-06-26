const API_URL = "https://img.logo.dev/";
const KEY = "pk_JLBgtCTsQsCxXe-ifd2CkA";
export const getLogoUrl = async (companyName) => {
  const response = await fetch(`${API_URL}${companyName}?token=${KEY}`);
  const data = await response.json();
  return data;
};
