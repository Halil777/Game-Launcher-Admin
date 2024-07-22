import { FC } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Server {
  id: number;
  server_name: string;
  server_port: number;
  server_host: string;
  display_port: string;
  speed: number;
}

interface GlobalServersProps {
  servers: Server[];
  onDelete: (serverId: number) => void;
}

const GlobalServers: FC<GlobalServersProps> = ({ servers, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Server Name</th>
            <th className="py-2 px-4 text-left">Port</th>
            <th className="py-2 px-4 text-left">Host</th>
            <th className="py-2 px-4 text-left">Display Port</th>
            <th className="py-2 px-4 text-left">Speed</th>
            <th className="py-2 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {servers.map((server) => (
            <tr key={server.id} className="border-b">
              <td className="py-2 px-4">{server.server_name}</td>
              <td className="py-2 px-4">{server.server_port}</td>
              <td className="py-2 px-4">{server.server_host}</td>
              <td className="py-2 px-4">{server.display_port}</td>
              <td className="py-2 px-4">{server.speed}</td>
              <td className="py-2 px-4 text-center">
                <button
                  className="text-blue-500 hover:text-blue-700 mr-2"
                  title="Edit"
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  title="Delete"
                  onClick={() => onDelete(server.id)}
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

export default GlobalServers;
