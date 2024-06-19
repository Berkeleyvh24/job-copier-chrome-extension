// import  {fetchCoverLetterGenerator }from './api/handleInputPost';

// chrome.runtime.onInstalled.addListener(details => {
//     fetchCoverLetterGenerator()
// })

// background.js

//What I want to do from now on:
// 1. Get the file content from the upload file button in background.js
// 2. Send the text for the job content to the background.js
// 3. Send data to the backend api 
// 4. first upload file in the backend
// 5. Then create an assistant based off the job content text 
// Function to convert base64 to Uint8Array
function base64ToUint8Array(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
  
  // Function to convert base64 string to File object
  function base64ToFile(base64, fileName, fileType) {
    const byteArray = base64ToUint8Array(base64);
    const blob = new Blob([byteArray], { type: fileType });
    return new File([blob], fileName, { type: fileType });
  }

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log("Message received from content script:", message);
  
    // Handle different types of messages
    if (message.action === "sendData") {
        chrome.storage.local.get(['textInput', 'fileData'], (result) => {
            if (chrome.runtime.lastError) {
              sendResponse({ success: false, error: chrome.runtime.lastError.message });
            }else{
                const { name, type, content } = result.fileData;
                const file = base64ToFile(content, name, type);
                const text = result.textInput;
                const formData = new FormData();
                formData.append('file', file);
                formData.append('text', text);
                fetchCoverLetterGenerator(formData, sendResponse).then((data) => {
                    
                    sendResponse({ status: "success", message: data });
                });    
            }
        });
      // Send a response back to the content script
    //   sendResponse({ status: "success", message: "Hello from background script!" });
    } else if (message.action === 'saveText') {
        chrome.storage.local.set({ textInput: message.text }, () => {
          if (chrome.runtime.lastError) {
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            sendResponse({ success: true });
          }
        });
      } else if (message.action === 'saveFile') {
        chrome.storage.local.set({ fileData: message.file }, () => {
          if (chrome.runtime.lastError) {
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            sendResponse({ success: true });
          }
        });
      } else if (message.action === 'getValues') {
        chrome.storage.local.get(['textInput', 'fileData'], (result) => {
          if (chrome.runtime.lastError) {
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            sendResponse({ success: true, text: result.textInput, file: result.fileData });
          }
        });
      }else{
        console.log('------')
      }
    // Return true to indicate you want to send a response asynchronously
    return true;
  });

async function fetchCoverLetterGenerator(formData, sendResponse) {
    
    const url = 'http://localhost:3000/process-data';

    const requestOptions = {
        method: 'POST',
        body: formData
    };

    try {

        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('File and text uploaded successfully:', data);
        return data;
    } catch (error) {
        console.error('Error uploading file and text:', error);
        console.log('Error uploading file and text:');

        sendResponse({ success: false, error: error.message });
    }
}