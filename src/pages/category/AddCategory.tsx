import { FC, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface FormData {
  name_tm: string;
  name_en: string;
  name_ru: string;
  desc_tm: string;
  desc_en: string;
  desc_ru: string;
  image: File | null;
}

const AddCategory: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name_tm: "",
    name_en: "",
    name_ru: "",
    desc_tm: "",
    desc_en: "",
    desc_ru: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
    setLoading(true);
    setError(null);

    if (!formData.image) {
      setError("Image file is required.");
      return;
    }

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
        "http://88.218.60.127:5678/category/add-category",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 204) {
        navigate("/category");
      } else {
        setError("Unexpected response from the server.");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Failed to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add Category</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name (TM)
            </label>
            <input
              type="text"
              name="name_tm"
              value={formData.name_tm}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name (EN)
            </label>
            <input
              type="text"
              name="name_en"
              value={formData.name_en}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name (RU)
            </label>
            <input
              type="text"
              name="name_ru"
              value={formData.name_ru}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description (TM)
            </label>
            <textarea
              name="desc_tm"
              value={formData.desc_tm}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description (EN)
            </label>
            <textarea
              name="desc_en"
              value={formData.desc_en}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description (RU)
            </label>
            <textarea
              name="desc_ru"
              value={formData.desc_ru}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              rows={4}
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
