// What is it going to look like 
// It's going to have a textbox where the job details are going to go to go
// It's going to have an insert file, where the pdf for the resume will go

import { useState } from "react";
import FileAttachment from "./Components/FileAttachment";
import TextField from "./Components/TextField";

// There will be a button that appears by default disabled until the cover letter is ready
function App() {
  const [responseData, setResponseData] = useState<string | null>(null);
  const [isTextEmpty, setIsTextEmpty] = useState<boolean>(true);

  const handleClick = () => {
    chrome.runtime.sendMessage({ action: "sendData"}, function(response) {
      console.log("Response from background script:", response);
      setResponseData(response.message);
    });
  }
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(responseData as string);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleTextEmptyChange = (isEmpty: boolean) => {
    setIsTextEmpty(isEmpty);
  };

  return (
    <div className="flex flex-col items-center justify-start overflow-y-auto bg-gray-100 w-72 h-72 p-4">
      <h1 className="text-3xl font-bold text-blue-600">
          Job copier
        </h1>
      <FileAttachment/>
      <TextField onTextEmptyChange={handleTextEmptyChange}/>
      <button disabled={isTextEmpty} onClick={handleClick} className="mt-4 btn btn-primary">Generate cover letter</button>
      {
      <div>
        <button onClick={handleCopy} className="mt-2 btn btn-secondary">Copy</button>
        </div>}
    </div>
  )
}

export default App
