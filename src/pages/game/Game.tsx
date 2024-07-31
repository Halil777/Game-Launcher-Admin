import { FC, useState } from "react";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ImageUploadModal from "./ImageUploadModal"; // Adjust the import path accordingly

const fetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token not found");
  }
  const response = await axios.post(
    url,
    { page: 1, sort: "sort_by_date_desc" }, // Hardcoded for now
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

interface GameItem {
  id: number;
  title_en: string;
  desc_en: string;
  site_url: string;
}

const Game: FC = () => {
  const { data, error } = useSWR<{ total: number; games: GameItem[] }>(
    "http://88.218.60.127:5678/game/admin/get-games",
    fetcher
  );
  const navigate = useNavigate();
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);

  if (error) return <div>Failed to load games</div>;
  if (!data) return <div>Loading...</div>;

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      await axios.delete(`http://88.218.60.127:5678/game/delete-game/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      mutate("http://88.218.60.127:5678/game/admin/get-games");
    } catch (error) {
      console.error("Error deleting game:", error);
      alert(`Failed to delete game with id ${id}`);
    }
  };

  const handleRowClick = (gameId: number) => {
    setSelectedGameId(gameId);
  };

  const handleImageUpload = async (image: File) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      const formData = new FormData();
      formData.append("file", image); // Use the correct field name

      await axios.put(
        `http://88.218.60.127:5678/game/add-game-image/${selectedGameId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Ensure this is set
          },
        }
      );

      alert("Image uploaded successfully!");
      setSelectedGameId(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      if (axios.isAxiosError(error) && error.response) {
        alert(`Failed to upload image: ${error.response.data.message}`);
      } else {
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Games Page</h1>
        <button
          onClick={() => navigate("/add-game")}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Game
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/4 py-2 px-4 text-left">Title</th>
              <th className="w-1/4 py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-center">Delete</th>
            </tr>
          </thead>
          <tbody>
            {data?.games?.map((game) => (
              <tr
                key={game.id}
                className="border-b"
                onClick={() => handleRowClick(game.id)}
              >
                <td className="py-2 px-4">
                  <a
                    href={game.site_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {game.title_en}
                  </a>
                </td>
                <td className="py-2 px-4">{game.desc_en.slice(0, 100)}...</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleDelete(game.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete Game"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedGameId && (
        <ImageUploadModal
          gameId={selectedGameId}
          onClose={() => setSelectedGameId(null)}
          onUpload={handleImageUpload}
        />
      )}
    </div>
  );
};

export default Game;
