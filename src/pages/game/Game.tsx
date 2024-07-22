import { FC } from "react";
import useSWR from "swr";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Fetcher function for SWR with token included
const fetcher = async (url: string) => {
  const token = localStorage.getItem("token"); // Retrieve the token from local storage
  if (!token) {
    throw new Error("Token not found");
  }
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Interfaces for game data
interface GameAsset {
  id: number;
  url: string;
  type: string;
}

interface GameCategory {
  id: number;
  name_tm: string;
  name_ru: string;
  name_en: string;
}

interface GameServer {
  id: number;
  server_name: string;
  server_port: number;
  server_host: string;
  server_username: string;
  server_password: string;
  display_host: string;
  display_port: string;
  speed: number;
  type: string;
  location: string;
}

interface GameItem {
  id: number;
  title_tm: string;
  title_en: string;
  title_ru: string;
  desc_tm: string;
  desc_en: string;
  desc_ru: string;
  site_url: string;
  star: number;
  steam_id: string;
  location: string;
  created_at: string;
  updated_at: string;
  assets: GameAsset[];
  category: GameCategory;
  server: GameServer[];
}

// Main Game Component
const Game: FC = () => {
  const { data, error } = useSWR<{ total: number; games: GameItem[] }>(
    "http://88.218.60.127:5678/game/admin/get-games",
    fetcher
  );
  const navigate = useNavigate();

  if (error) return <div>Failed to load games</div>;
  if (!data) return <div>Loading...</div>;

  // const handleDelete = async (id: number) => {
  //   try {
  //     const token = localStorage.getItem("token"); // Get the token from localStorage
  //     if (!token) {
  //       throw new Error("Token not found");
  //     }

  //     await axios.delete(`http://88.218.60.127:5678/game/delete-game/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     mutate(); // Re-fetch the data to update the list
  //   } catch (error) {
  //     console.error("Error deleting game:", error);
  //     alert(`Failed to delete game with id ${id}`);
  //   }
  // };

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
              <th className="w-1/4 py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.games?.map((game) => (
              <tr key={game.id} className="border-b">
                <td className="py-2 px-4">
                  <a
                    href={game.site_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {game.title_en}
                  </a>
                </td>
                <td className="py-2 px-4">{game.desc_en}</td>
                <td className="py-2 px-4">{game.category.name_en}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => navigate(`/edit-game/${game.id}`)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    // onClick={() => handleDelete(game.id)}
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

export default Game;
