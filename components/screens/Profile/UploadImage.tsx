// components/ImageUpload.js
import { useState, useRef } from 'react';
import axios from 'axios';
import { icons } from '~/components/icons';
import Image from 'next/image';

export const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<any>(null);

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleButtonClick = () => {
    fileInputRef?.current.click();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Image uploaded successfully');
    } catch (error) {
      setMessage('Error uploading image');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {preview ? (
        <Image
          width={200}
          height={200}
          src={preview}
          alt="Image Preview"
          className="h-[130px] w-[130px] object-cover rounded-full"
        />
      ) : (
        <div className="bg-[#023340] rounded-full h-[130px] w-[130px] flex justify-center items-center ">
          {icons.user()}
        </div>
      )}
      <button
        type="button"
        onClick={handleButtonClick}
        className="text-neon-blue underline text-base"
      >
        Upload image
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </form>
  );
};
