import React from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useSWR, { mutate } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const clientTypeStyles = {
  ADVANCED: "bg-blue-100 text-blue-800 border border-blue-300",
  BASIC: "bg-green-100 text-green-800 border border-green-300",
  BUISNESS: "bg-red-100 text-red-800 border border-red-300",
  DEFAULT: "bg-gray-100 text-gray-800 border border-gray-300",
};

type ClientType = keyof typeof clientTypeStyles;

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { data, error } = useSWR("http://88.218.60.127:5678/pricing", fetcher);

  const handleAddPlan = () => {
    navigate("/add-plan");
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    await fetch(`http://88.218.60.127:5678/pricing/delete-pricing/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    mutate("http://88.218.60.127:5678/pricing");
  };

  if (error) return <div>Error loading data.</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="overflow-x-auto p-6 bg-white rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Pricing Plans</h2>
        <button
          onClick={handleAddPlan}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Plan
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="w-1/4 py-2 px-4 text-left">Title</th>
            <th className="w-1/4 py-2 px-4 text-left">Description</th>
            <th className="w-1/4 py-2 px-4 text-left">Price</th>
            <th className="w-1/4 py-2 px-4 text-left">Client Type</th>
            <th className="py-2 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(
            (plan: {
              id: number;
              title_en: string;
              desc_en: string;
              price: number;
              clientType: ClientType;
            }) => (
              <tr key={plan.id} className="border-b">
                <td className="py-2 px-4">{plan.title_en}</td>
                <td className="py-2 px-4">{plan.desc_en}</td>
                <td className="py-2 px-4">{plan.price} TMT</td>
                <td
                  className={`py-2 px-4 rounded ${
                    clientTypeStyles[plan.clientType] ||
                    clientTypeStyles.DEFAULT
                  }`}
                >
                  {plan.clientType}
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDelete(plan.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Pricing;
