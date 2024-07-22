// utils/fetcher.ts
const fetcher = async (url: string) => {
  const token = localStorage.getItem("token"); // Replace 'token' with the actual key if different

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`, // Add the Authorization header with the token
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  }

  return response.json();
};

export default fetcher;
