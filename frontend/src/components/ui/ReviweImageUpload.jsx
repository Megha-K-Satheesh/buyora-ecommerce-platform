import { useRef } from "react";

const ReviewImageUpload = ({ files, setFiles, max = 5 }) => {
  const inputRef = useRef(null);

 
  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);


    if (files.length + selectedFiles.length > max) {
      alert(`You can upload maximum ${max} images`);
      return;
    }

 
    setFiles((prev) => [...prev, ...selectedFiles]);

   
    e.target.value = "";
  };


  const removeImage = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4">
   
      <div
        onClick={() => inputRef.current.click()}
        className="border-2 border-dashed  rounded-lg p-4 text-center cursor-pointer border-text-light hover:border-primary transition"
      >
        <p className="text-text-muted text-sm">
          Click to upload images
        </p>
        <p className="text-xs text-text-light">
          Max {max} images
        </p>
      </div>

   
      <input
        type="file"
        multiple
        accept="image/*"
        ref={inputRef}
        onChange={handleChange}
        className="hidden"
      />

   
      <div className="flex gap-3 mt-4 flex-wrap">
        {files.map((file, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-20 h-20 object-cover rounded-md border border-border-light"
              onLoad={(e) => URL.revokeObjectURL(e.target.src)} // cleanup
            />

          
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-danger text-white 
                         rounded-full w-5 h-5 text-xs flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewImageUpload;
