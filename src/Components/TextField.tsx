import { useRef } from "react";

const TextField = () => {

    const textInputRef = useRef<HTMLTextAreaElement | null>(null);

    
    return ( <div>
        <textarea
        ref={textInputRef}
        className="mt-4 p-2 border border-gray-300 rounded w-64 h-32"
        placeholder="Enter your text here..."
      />

    </div> );
}
 
export default TextField;