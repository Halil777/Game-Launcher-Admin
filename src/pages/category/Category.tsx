import { FC } from "react";
import useSWR from "swr";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Define the fetcher function for SWR
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

// Define the interface for category data
interface GameAsset {
  url: string;
  type: string;
}

interface GameItem {
  id: number;
  title_tm: string;
  title_en: string;
  title_ru: string;
  assets: GameAsset[];
}

interface CategoryData {
  category: {
    id: number;
    name_tm: string;
    name_en: string;
    name_ru: string;
    desc_tm: string;
    desc_en: string;
    desc_ru: string;
    image: string;
  };
  games: GameItem[];
}

// Category component
const Category: FC = () => {
  const { data, error, mutate } = useSWR<CategoryData[]>(
    "http://88.218.60.127:5678/category",
    fetcher
  );
  const navigate = useNavigate();

  if (error) return <div>Failed to load categories</div>;
  if (!data) return <div>Loading...</div>;

  // Handle delete category
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://88.218.60.127:5678/category/delete-category/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      mutate(); // Re-fetch the data to update the list
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button
          onClick={() => navigate("/add-category")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Category
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/4 py-2 px-4 text-left">Name (RU)</th>
              <th className="w-1/4 py-2 px-4 text-left">Image</th>
              <th className="w-1/2 py-2 px-4 text-left">Description (RU)</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ category }) => (
              <tr key={category.id} className="border-b">
                <td className="py-2 px-4">{category.name_ru}</td>
                <td className="py-2 px-4">
                  <img
                    src={category.image}
                    alt={category.name_tm}
                    className="w-16 h-16 object-cover"
                  />
                </td>
                <td className="py-2 px-4">
                  {category.desc_ru.slice(0, 100)}...
                </td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => navigate(`/edit-category/${category.id}`)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Category;
