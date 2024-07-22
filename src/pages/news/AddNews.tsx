import { FC, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface FormData {
  title_tm: string;
  title_en: string;
  title_ru: string;
  sub_title_tm: string;
  sub_title_en: string;
  sub_title_ru: string;
  desc_tm: string;
  desc_en: string;
  desc_ru: string;
  image: File | null;
}

const AddNews: FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title_tm: "",
    title_en: "",
    title_ru: "",
    sub_title_tm: "",
    sub_title_en: "",
    sub_title_ru: "",
    desc_tm: "",
    desc_en: "",
    desc_ru: "",
    image: null,
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prevState) => ({
      ...prevState,
      image: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.image) {
      setError("Image file is required.");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof FormData];
      if (value !== null) {
        if (key === "image" && value instanceof File) {
          formDataToSend.append("file", value); // Append the file as "file"
        } else {
          formDataToSend.append(key, value as string);
        }
      }
    });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://88.218.60.127:5678/news",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 204) {
        // Successfully added the news item, navigate to news list
        navigate("/news");
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error adding news:", error);
      setError("Failed to add news. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add News</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title_tm"
            placeholder="Title (TM)"
            value={formData.title_tm}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
          />
          <input
            type="text"
            name="title_en"
            placeholder="Title (EN)"
            value={formData.title_en}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
          />
          <input
            type="text"
            name="title_ru"
            placeholder="Title (RU)"
            value={formData.title_ru}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
          />
          <input
            type="text"
            name="sub_title_tm"
            placeholder="Subtitle (TM)"
            value={formData.sub_title_tm}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
          />
          <input
            type="text"
            name="sub_title_en"
            placeholder="Subtitle (EN)"
            value={formData.sub_title_en}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
          />
          <input
            type="text"
            name="sub_title_ru"
            placeholder="Subtitle (RU)"
            value={formData.sub_title_ru}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
          />
          <textarea
            name="desc_tm"
            placeholder="Description (TM)"
            value={formData.desc_tm}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            rows={3}
          />
          <textarea
            name="desc_en"
            placeholder="Description (EN)"
            value={formData.desc_en}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            rows={3}
          />
          <textarea
            name="desc_ru"
            placeholder="Description (RU)"
            value={formData.desc_ru}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded"
            rows={3}
          />
        </div>
        <div className="mt-4">
          <label className="block mb-2">Upload Image:</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="border border-gray-300 p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddNews;
