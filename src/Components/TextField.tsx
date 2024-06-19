import { useEffect, useRef, useState } from "react";

interface textFieldOnChange {
  onTextEmptyChange : (isEmpty: boolean) => void;
}

const TextField = ({ onTextEmptyChange }: textFieldOnChange) => {
  const textInputRef = useRef<HTMLTextAreaElement | null>(null);
  const [text, setText] = useState<string>('');

  // Update the state when the user types in the textarea
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    setText(newText);
    // Notify parent component whether text is empty
    onTextEmptyChange(newText === '');
    // Send text to background script
    chrome.runtime.sendMessage(
      { action: "saveText", text: newText },
      (response) => {
        if (response.success) {
          console.log("Text saved to local storage");
        } else {
          console.error("Failed to save text", response.error);
        }
      }
    );
  };

  useEffect(() => {
    // Retrieve values from local storage
    chrome.runtime.sendMessage({ action: "getValues" }, (response) => {
      if (response.success) {
        const retrievedText = response.text || '';
        setText(retrievedText);
        // onTextEmptyChange(retrievedText === '');
      } else {
        console.error("Failed to retrieve text", response.error);
      }
    });
  }, [onTextEmptyChange]);

  return (
    <div>
      <textarea
        ref={textInputRef}
        value={text}
        onChange={handleTextChange}
        className="mt-4 p-2 border border-gray-300 rounded w-64 h-32"
        placeholder="Enter your text here..."
      />
    </div>
  );
};

export default TextField;
