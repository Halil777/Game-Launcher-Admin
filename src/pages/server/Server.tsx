import { FC, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LocalServers from "./local/LocalServers";
import GlobalServers from "./global/GlobalServers";

const fetcher = async (url: string) => {
  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.get(url, { headers });
  return response.data;
};

const Server: FC = () => {
  const [activeTab, setActiveTab] = useState("local");
  const navigate = useNavigate();

  const {
    data: globalData,
    error: globalError,
    mutate: mutateGlobal,
  } = useSWR(
    "http://88.218.60.127:5678/server/get-servers?location=GLOBAL",
    fetcher
  );
  const {
    data: localData,
    error: localError,
    mutate: mutateLocal,
  } = useSWR(
    "http://88.218.60.127:5678/server/get-servers?location=LOCAL",
    fetcher
  );

  const handleDelete = async (serverId: number, location: string) => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      await axios.delete(
        `http://88.218.60.127:5678/server/delete-server/${serverId}`,
        { headers }
      );
      if (location === "LOCAL") {
        mutateLocal(); // Revalidate local servers data
      } else {
        mutateGlobal(); // Revalidate global servers data
      }
    } catch (error) {
      console.error("Error deleting server:", error);
    }
  };

  if (globalError || localError) return <div>Failed to load servers</div>;
  if (!globalData || !localData) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Servers Page</h1>
        <div className="flex border-b border-gray-300 mb-4">
          <button
            className={`py-2 px-4 ${
              activeTab === "local" ? "bg-blue-500 text-white" : "bg-gray-200"
            } rounded-t`}
            onClick={() => setActiveTab("local")}
          >
            Local Servers
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "global" ? "bg-blue-500 text-white" : "bg-gray-200"
            } rounded-t`}
            onClick={() => setActiveTab("global")}
          >
            Global Servers
          </button>
        </div>
        <div className="p-4 bg-white border border-gray-300 rounded-b">
          {activeTab === "local" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Local Servers</h2>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                  onClick={() => navigate("/add-local-server")}
                >
                  Add Local Server
                </button>
              </div>
              <LocalServers
                servers={localData}
                onDelete={(serverId: number) => handleDelete(serverId, "LOCAL")}
              />
            </>
          )}
          {activeTab === "global" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Global Servers</h2>
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                  onClick={() => navigate("/add-global-server")}
                >
                  Add Global Server
                </button>
              </div>
              <GlobalServers
                servers={globalData}
                onDelete={(serverId: number) =>
                  handleDelete(serverId, "GLOBAL")
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Server;
