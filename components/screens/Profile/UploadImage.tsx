// components/ImageUpload.js
import { useState, useRef } from 'react';

import { icons } from '~/components/icons';
import Image from 'next/image';

interface IImageUploadProps {
  pfpUrl: string | undefined;
  isEditing: boolean;
  handleImageUpdate: (f: File) => void;
}
export const ImageUpload = ({
  pfpUrl,
  handleImageUpdate,
  isEditing,
}: IImageUploadProps) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<any>(null);

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    if (selectedFile) {
      handleImageUpdate(selectedFile);
    }
  };

  const handleButtonClick = () => {
    fileInputRef?.current.click();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!file) return;
    handleImageUpdate(file);
  };

  return (
    <form onSubmit={handleSubmit}>
      {preview ? (
        <div className='h-[130px] w-[130px]'>
          <Image
            width={200}
            height={200}
            src={preview}
            alt="Image Preview"
            className="object-cover rounded-full w-full h-full"
          />
        </div>
      ) : (
        <div className="bg-[#023340] rounded-full h-[130px] w-[130px] flex justify-center items-center ">
          {pfpUrl ? (
            <img src={pfpUrl} className="rounded-full w-full h-full object-cover" alt="profile image" />
          ) : (
            icons.user({className: 'text-[#0ADFDB]'})
          )}
        </div>
      )}
      {isEditing && (
        <button
          type="button"
          onClick={handleButtonClick}
          className="text-neon-blue underline text-base"
        >
          Upload image
        </button>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </form>
  );
};
