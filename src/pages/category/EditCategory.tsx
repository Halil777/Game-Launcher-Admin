import { FC, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditCategory: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name_tm: "",
    name_en: "",
    name_ru: "",
    desc_tm: "",
    desc_en: "",
    desc_ru: "",
    image: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          const response = await axios.get(
            `http://88.218.60.127:5678/category/${id}`
          );
          console.log("Fetched category data:", response.data); // Debugging
          setCategory(response.data);
          setImagePreview(`http://88.218.60.127:5678/${response.data.image}`);
        } catch (error) {
          console.error("Error fetching category:", error);
        }
      };

      fetchCategory();
    }
  }, [id]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name_tm", category.name_tm);
    formData.append("name_en", category.name_en);
    formData.append("name_ru", category.name_ru);
    formData.append("desc_tm", category.desc_tm);
    formData.append("desc_en", category.desc_en);
    formData.append("desc_ru", category.desc_ru);

    if (selectedFile) {
      formData.append("image", selectedFile);
    } else {
      formData.append("image", category.image); // If no new file, keep existing
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in local storage");
        return;
      }

      await axios.patch(
        `http://88.218.60.127:5678/category/update-category/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/category");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Category</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="flex-1">
            <label className="block mb-2 font-medium">Name (TM)</label>
            <input
              type="text"
              name="name_tm"
              value={category.name_tm}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-medium">Name (EN)</label>
            <input
              type="text"
              name="name_en"
              value={category.name_en}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-medium">Name (RU)</label>
            <input
              type="text"
              name="name_ru"
              value={category.name_ru}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="flex-1">
            <label className="block mb-2 font-medium">Description (TM)</label>
            <textarea
              name="desc_tm"
              value={category.desc_tm}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-medium">Description (EN)</label>
            <textarea
              name="desc_en"
              value={category.desc_en}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-medium">Description (RU)</label>
            <textarea
              name="desc_ru"
              value={category.desc_ru}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="flex-1">
            <label className="block mb-2 font-medium">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover"
              />
            )}
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
