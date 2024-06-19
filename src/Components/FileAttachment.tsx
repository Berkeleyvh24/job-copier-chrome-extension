import { useEffect, useRef, useState } from "react";

const FileAttachment = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [fileName, setFileName] = useState<string | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click(); 
      }
  }

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setFileName(file ? file.name : null);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const base64String = arrayBufferToBase64(arrayBuffer);

        const fileData = {
          name: file.name,
          type: file.type,
          content: base64String,
        };

        chrome.runtime.sendMessage({ action: 'saveFile', file: fileData }, (response) => {
          if (response.success) {
            console.log('File saved to local storage');
          } else {
            console.error('Failed to save file', response.error);
          }
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  useEffect(() => {
    // Retrieve values from local storage
    chrome.runtime.sendMessage({ action: 'getValues' }, (response) => {
      if (response.success && response.file) {
        setFileName(response.file.name);
      } else {
        console.error('Failed to retrieve file', response.error);
      }
    });
  }, []);


  return (
    <>
      <div className="text-center">
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
