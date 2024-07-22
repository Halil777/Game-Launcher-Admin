import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EditTeamSpeak: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [port, setPort] = useState("");
  const [status, setStatus] = useState("active");
  const [error, setError] = useState<string | null>(null);

  // Fetch the server data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setError("Invalid ID parameter.");
        return;
      }

      try {
        const response = await axios.get(
          `http://88.218.60.127:5678/game-servers/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const server = response.data;
        setName(server.name);
        setIpAddress(server.ipAddress);
        setPort(server.port.toString());
        setStatus(server.status);
      } catch (error: any) {
        console.error("Error fetching server data:", error);
        setError(
          error.response?.data?.message || "Failed to load server data."
        );
      }
    };

    fetchData();
  }, [id]);

  const validateIpAddress = (ip: string): boolean => {
    const regex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate IP Address and Port
    if (!validateIpAddress(ipAddress)) {
      setError("Invalid IP Address format.");
      return;
    }

    if (!/^\d+$/.test(port) || parseInt(port) < 1 || parseInt(port) > 65535) {
      setError("Port must be a number between 1 and 65535.");
      return;
    }

    setError(null);

    try {
      await axios.patch(
        `http://88.218.60.127:5678/game-servers/${id}`,
        {
          name,
          ipAddress,
          port: parseInt(port),
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Redirect to GetTeamSpeak component after successful update
      window.location.reload();
    } catch (error: any) {
      console.error("Error updating TeamSpeak server:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update server. Please try again."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">
        Edit TeamSpeak Server {id}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="ipAddress" className="block text-gray-700 mb-1">
              IP Address
            </label>
            <input
              type="text"
              id="ipAddress"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="port" className="block text-gray-700 mb-1">
              Port
            </label>
            <input
              type="number"
              id="port"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
              required
            >
              <option value="active">Active</option>
              <option value="passive">Passive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Server
        </button>
      </form>
    </div>
  );
};

export default EditTeamSpeak;
