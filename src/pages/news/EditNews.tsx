import { FC, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditNews: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [news, setNews] = useState({
    title_tm: "",
    title_en: "",
    title_ru: "",
    sub_title_tm: "",
    sub_title_en: "",
    sub_title_ru: "",
    desc_tm: "",
    desc_en: "",
    desc_ru: "",
    image: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (id) {
      const fetchNews = async () => {
        try {
          const response = await axios.get(
            `http://88.218.60.127:5678/news/${id}`
          );
          console.log("Fetched news data:", response.data); // Add this line to check the API response
          setNews(response.data);
          setImagePreview(`http://88.218.60.127:5678/${response.data.image}`);
        } catch (error) {
          console.error("Error fetching news:", error);
        }
      };

      fetchNews();
    }
  }, [id]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setNews((prevNews) => ({
      ...prevNews,
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
    formData.append("title_tm", news.title_tm);
    formData.append("title_en", news.title_en);
    formData.append("title_ru", news.title_ru);
    formData.append("sub_title_tm", news.sub_title_tm);
    formData.append("sub_title_en", news.sub_title_en);
    formData.append("sub_title_ru", news.sub_title_ru);
    formData.append("desc_tm", news.desc_tm);
    formData.append("desc_en", news.desc_en);
    formData.append("desc_ru", news.desc_ru);

    if (selectedFile) {
      formData.append("file", selectedFile);
    } else {
      formData.append("image", news.image);
    }

    try {
      const token = localStorage.getItem("token");
      await axios.patch(`http://88.218.60.127:5678/news/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/news");
    } catch (error) {
      console.error("Error updating news:", error);
    }
  };

  // Debugging: Log the news state
  useEffect(() => {
    console.log("News data:", news);
  }, [news]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit News</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="flex-1">
            <label className="block mb-2 font-medium">Title (TM)</label>
            <input
              type="text"
              name="title_tm"
              value={news.title_tm}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-medium">Title (EN)</label>
            <input
              type="text"
              name="title_en"
              value={news.title_en}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-medium">Title (RU)</label>
            <input
              type="text"
              name="title_ru"
              value={news.title_ru}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="flex-1">
            <label className="block mb-2 font-medium">Subtitle (TM)</label>
            <input
              type="text"
              name="sub_title_tm"
              value={news.sub_title_tm}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-medium">Subtitle (EN)</label>
            <input
              type="text"
              name="sub_title_en"
              value={news.sub_title_en}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-medium">Subtitle (RU)</label>
            <input
              type="text"
              name="sub_title_ru"
              value={news.sub_title_ru}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="flex-1">
            <label className="block mb-2 font-medium">Description (TM)</label>
            <textarea
              name="desc_tm"
              value={news.desc_tm}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-medium">Description (EN)</label>
            <textarea
              name="desc_en"
              value={news.desc_en}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-2 font-medium">Description (RU)</label>
            <textarea
              name="desc_ru"
              value={news.desc_ru}
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

export default EditNews;
