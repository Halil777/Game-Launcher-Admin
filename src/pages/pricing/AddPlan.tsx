import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddPlan: React.FC = () => {
  const [titleEn, setTitleEn] = useState("");
  const [descEn, setDescEn] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [clientType, setClientType] = useState("BASIC");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const newPlan = {
      title_tm: titleEn, // Assuming title_tm is same as title_en for simplicity
      title_en: titleEn,
      title_ru: titleEn, // Assuming title_ru is same as title_en for simplicity
      desc_tm: descEn, // Assuming desc_tm is same as desc_en for simplicity
      desc_en: descEn,
      desc_ru: descEn, // Assuming desc_ru is same as desc_en for simplicity
      price: typeof price === "number" ? price : 0, // Defaulting to 0 if price is not a number
      clientType,
    };

    const response = await fetch("http://88.218.60.127:5678/pricing/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newPlan),
    });

    if (response.ok) {
      navigate("/pricing");
    } else {
      console.error("Failed to add new plan");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Add New Plan</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="titleEn" className="block text-gray-700 mb-2">
            Title (EN)
          </label>
          <input
            type="text"
            id="titleEn"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="descEn" className="block text-gray-700 mb-2">
            Description (EN)
          </label>
          <textarea
            id="descEn"
            value={descEn}
            onChange={(e) => setDescEn(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 mb-2">
            Price (TMT)
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.valueAsNumber)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="clientType" className="block text-gray-700 mb-2">
            Client Type
          </label>
          <select
            id="clientType"
            value={clientType}
            onChange={(e) => setClientType(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="BASIC">BASIC</option>
            <option value="ADVANCED">ADVANCED</option>
            <option value="BUISNESS">BUISNESS</option>
          </select>
        </div>
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlan;
