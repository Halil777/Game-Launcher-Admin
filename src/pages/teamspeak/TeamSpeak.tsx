import React, { useState } from "react";
import GetTeamSpeak from "./GetTeamSpeak";
import AddTeamSpeak from "./AddTeamSpeak";
// import EditTeamSpeak from "./EditTeamSpeak";

const TeamSpeak: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"view" | "add" | "edit">("view");
  // const [editId, setEditId] = useState<number | null>(null);

  const handleAddClick = () => {
    setActiveTab("add");
  };

  // const handleEditClick = (id: number) => {
  //   // setEditId(id);
  //   setActiveTab("edit");
  // };

  const handleBackToView = () => {
    setActiveTab("view");
    // setEditId(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">TeamSpeak Servers</h1>
        {activeTab === "view" && (
          <button
            onClick={handleAddClick}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Add TeamSpeak
          </button>
        )}
        {(activeTab === "add" || activeTab === "edit") && (
          <button
            onClick={handleBackToView}
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Back
          </button>
        )}
      </div>
      {activeTab === "view" && <GetTeamSpeak />}
      {activeTab === "add" && <AddTeamSpeak />}
      {/* {activeTab === "edit" && editId && <EditTeamSpeak id={editId} />} */}
    </div>
  );
};

export default TeamSpeak;
