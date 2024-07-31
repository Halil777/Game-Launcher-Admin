import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddGame: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    title_en: "",
    title_ru: "",
    title_tm: "",
    desc_en: "",
    desc_ru: "",
    desc_tm: "",
    location: "LOCAL", // Default to "LOCAL"
    site_url: "",
    star: "", // Initially a string, but will be converted to a number
    steam_id: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://88.218.60.127:5678/game/add-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formValues,
          star: parseFloat(formValues.star), // Convert star to a number
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Game added successfully!");
      navigate("/games");
    } catch (error) {
      alert("Failed to add the game. Please try again.");
      console.error("Error adding game:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Game</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="title_en">
            Title (English)
          </label>
          <input
            type="text"
            name="title_en"
            id="title_en"
            className="w-full p-2 border rounded"
            value={formValues.title_en}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="title_ru">
            Title (Russian)
          </label>
          <input
            type="text"
            name="title_ru"
            id="title_ru"
            className="w-full p-2 border rounded"
            value={formValues.title_ru}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="title_tm">
            Title (Turkmen)
          </label>
          <input
            type="text"
            name="title_tm"
            id="title_tm"
            className="w-full p-2 border rounded"
            value={formValues.title_tm}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="desc_en">
            Description (English)
          </label>
          <textarea
            name="desc_en"
            id="desc_en"
            className="w-full p-2 border rounded"
            value={formValues.desc_en}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="desc_ru">
            Description (Russian)
          </label>
          <textarea
            name="desc_ru"
            id="desc_ru"
            className="w-full p-2 border rounded"
            value={formValues.desc_ru}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="desc_tm">
            Description (Turkmen)
          </label>
          <textarea
            name="desc_tm"
            id="desc_tm"
            className="w-full p-2 border rounded"
            value={formValues.desc_tm}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="location">
            Location
          </label>
          <select
            name="location"
            id="location"
            className="w-full p-2 border rounded"
            value={formValues.location}
            onChange={handleChange}
            required
          >
            <option value="LOCAL">LOCAL</option>
            <option value="GLOBAL">GLOBAL</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="site_url">
            Site URL
          </label>
          <input
            type="text"
            name="site_url"
            id="site_url"
            className="w-full p-2 border rounded"
            value={formValues.site_url}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="star">
            Star Rating
          </label>
          <input
            type="number"
            name="star"
            id="star"
            className="w-full p-2 border rounded"
            value={formValues.star}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1" htmlFor="steam_id">
            Steam ID
          </label>
          <input
            type="text"
            name="steam_id"
            id="steam_id"
            className="w-full p-2 border rounded"
            value={formValues.steam_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className={`w-full py-2 bg-blue-500 text-white rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Game"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGame;
