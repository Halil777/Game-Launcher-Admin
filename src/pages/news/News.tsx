import { FC } from "react";
import useSWR from "swr";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

interface NewsItem {
  id: number;
  title_ru: string;
  desc_ru: string;
  image: string;
}

const News: FC = () => {
  const { data, error, mutate } = useSWR<NewsItem[]>(
    "http://88.218.60.127:5678/news",
    fetcher
  );
  const navigate = useNavigate();

  if (error) return <div>Failed to load news</div>;
  if (!data) return <div>Loading...</div>;

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      if (!token) {
        throw new Error("Authentication token not found");
      }

      await axios.delete(`http://88.218.60.127:5678/news/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      mutate(); // Re-fetch the data to update the list
    } catch (error) {
      console.error("Error deleting news:", error);
      alert(`Failed to delete news item with id ${id}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">News Page</h1>
        <button
          onClick={() => navigate("/add-news")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Добавить новость
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/4 py-2 px-4 text-left">Название</th>
              <th className="w-1/4 py-2 px-4 text-left">Изображение</th>
              <th className="w-1/2 py-2 px-4 text-left">Описание</th>
              <th className="py-2 px-4 text-center">Действия</th>
            </tr>
          </thead>
          <tbody>
            {data.map((news) => (
              <tr key={news.id} className="border-b">
                <td className="py-2 px-4">{news.title_ru}</td>
                <td className="py-2 px-4">
                  <img
                    src={`http://88.218.60.127:5678/${news.image}`}
                    alt={news.title_ru}
                    className="w-16 h-16 object-cover"
                  />
                </td>
                <td className="py-2 px-4">{news.desc_ru}</td>
                <td className="py-2 px-4 text-center">
                  {/* Removed Edit button */}
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this news item?"
                        )
                      ) {
                        handleDelete(news.id);
                      }
                    }}
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

export default News;
