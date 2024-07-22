import { FC, useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface Category {
  id: number;
  name_tm: string;
  name_ru: string;
  name_en: string;
  desc_tm: string;
  desc_en: string;
  desc_ru: string;
  image: string;
  created_at: string;
  update_at: string;
}

interface CategoryData {
  category: Category;
  games: {
    id: number;
    title_tm: string;
    title_en: string;
    title_ru: string;
    assets: {
      url: string;
      type: string;
    }[];
  }[];
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const AddGlobalServer: FC = () => {
  const { data, error } = useSWR<CategoryData[]>(
    "http://88.218.60.127:5678/category",
    fetcher
  );

  const [formData, setFormData] = useState({
    server_name: "",
    server_port: 0,
    server_host: "",
    server_username: "",
    server_password: "",
    display_host: "",
    display_port: "",
    speed: 0,
    categoryId: 0,
    type: "BUISNESS",
    location: "GLOBAL",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "server_port" || name === "speed" || name === "categoryId"
          ? parseInt(value)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      await axios.post(
        "http://88.218.60.127:5678/server/add-server",
        formData,
        { headers }
      );
      navigate("/servers");
    } catch (error) {
      console.error("Error adding server:", error);
    }
  };

  if (error) return <div>Failed to load categories</div>;
  if (!data) return <div>Loading categories...</div>;

  const categories = data.map((item) => item.category);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Global Server</h1>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Server Name
            </label>
            <input
              type="text"
              name="server_name"
              value={formData.server_name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Server Port
            </label>
            <input
              type="number"
              name="server_port"
              value={formData.server_port}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Server Host
            </label>
            <input
              type="text"
              name="server_host"
              value={formData.server_host}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Server Username
            </label>
            <input
              type="text"
              name="server_username"
              value={formData.server_username}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Server Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="server_password"
              value={formData.server_password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <div
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Display Host
            </label>
            <input
              type="text"
              name="display_host"
              value={formData.display_host}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Display Port
            </label>
            <input
              type="text"
              name="display_port"
              value={formData.display_port}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Speed
            </label>
            <input
              type="number"
              name="speed"
              value={formData.speed}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select a Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name_en}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="BASIC">Basic</option>
              <option value="BUISNESS">Business</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Server
        </button>
      </form>
    </div>
  );
};

export default AddGlobalServer;
