import { useRef, useState } from "react";

const FileAttachment = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState<string | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click(); 
      }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setFileName(file ? file.name : null);
  };
  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-blue-600">
          Job copier
        </h1>
        <button
        onClick={handleButtonClick}
        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 w-64"
      >
        Choose File
      </button>
        <input
          title="fileReciever"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {fileName && (
        <p className="m-4 text-sm text-green-600">
          Selected file: {fileName}
        </p>
      )}
        </>
  );
};

export default FileAttachment;
