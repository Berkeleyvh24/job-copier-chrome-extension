// What is it going to look like 
// It's going to have a textbox where the job details are going to go to go
// It's going to have an insert file, where the pdf for the resume will go

import FileAttachment from "./Components/FileAttachment";
import TextField from "./Components/TextField";

// There will be a button that appears by default disabled until the cover letter is ready
function App() {
  
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 w-72 h-72">
      <FileAttachment/>
      <TextField/>
    </div>
  )
}

export default App
