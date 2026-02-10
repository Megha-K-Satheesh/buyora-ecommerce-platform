import { memo } from "react";



const ProductImageUpload =memo(({files,setFiles,max=2})=>{

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const totalFiles = [...files, ...selectedFiles];


    if (totalFiles.length > max) {
      alert(`You can only upload ${max} images`);
      return;
    }

    setFiles(totalFiles);
  };

 const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };
  
  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">
        Product Images (Max {max})
      </label>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="border p-2 rounded-md w-full"
      />

      <div className="flex gap-2 flex-wrap mt-2">
        {files.map((file, index) => (
           <div key={index} className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-20 h-20 object-cover rounded-md"
            />

            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-600 text-white 
                         rounded-full w-5 h-5 text-xs flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
})

export default ProductImageUpload;
