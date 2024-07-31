import React, { FC, useState } from "react";
import { FaTimes } from "react-icons/fa";

interface ImageUploadModalProps {
  gameId: number | null;
  onClose: () => void;
  onUpload: (image: File) => void;
}

const ImageUploadModal: FC<ImageUploadModalProps> = ({
  gameId,
  onClose,
  onUpload,
}) => {
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (image) {
      onUpload(image);
      onClose();
    }
  };

  if (!gameId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Upload Image for Game ID: {gameId}
          </h2>
          <button onClick={onClose} aria-label="Close modal">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            disabled={!image}
          >
            Upload Image
          </button>
        </form>
      </div>
    </div>
  );
};

export default ImageUploadModal;
