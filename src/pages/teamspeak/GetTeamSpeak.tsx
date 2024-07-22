import React from "react";
import useSWR, { mutate } from "swr";
import { FaTrash } from "react-icons/fa";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// interface GetTeamSpeakProps {
//   onEdit: (id: number) => void;
// }

const GetTeamSpeak: React.FC = () => {
  const { data, error } = useSWR(
    "http://88.218.60.127:5678/game-servers",
    fetcher
  );

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this server?")) {
      try {
        await fetch(`http://88.218.60.127:5678/game-servers/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        // Refetch the data after deletion
        mutate("http://88.218.60.127:5678/game-servers");
      } catch (error) {
        console.error("Error deleting server:", error);
      }
    }
  };

  if (error) return <div>Error loading data.</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="w-1/4 py-2 px-4 text-left">Name</th>
            <th className="w-1/4 py-2 px-4 text-left">IP Address</th>
            <th className="w-1/4 py-2 px-4 text-left">Port</th>
            <th className="w-1/4 py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((server: any) => (
            <tr key={server.id} className="border-b">
              <td className="py-2 px-4">{server.name}</td>
              <td className="py-2 px-4">{server.ipAddress}</td>
              <td className="py-2 px-4">{server.port}</td>
              <td className="py-2 px-4">
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      server.status === "active"
                        ? "bg-green-500"
                        : server.status === "passive"
                        ? "bg-red-500"
                        : server.status === "pending"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  />
                  <span>
                    {server.status.charAt(0).toUpperCase() +
                      server.status.slice(1)}
                  </span>
                </div>
              </td>
              <td className="py-2 px-4 text-center">
                {/* <button
                  className="text-blue-500 hover:text-blue-700 mr-2"
                  onClick={() => onEdit(server.id)}
                >
                  <FaEdit />
                </button> */}
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(server.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GetTeamSpeak;
