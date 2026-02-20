// import { memo } from "react";



// const ProductImageUpload =memo(({files,setFiles,max=2})=>{

//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files);
//     const totalFiles = [...files, ...selectedFiles];


//     if (totalFiles.length > max) {
//       alert(`You can only upload ${max} images`);
//       return;
//     }

//     setFiles(totalFiles);
//   };

//  const removeImage = (index) => {
//     const newFiles = files.filter((_, i) => i !== index);
//     setFiles(newFiles);
//   };
  
//   return (
//     <div className="mb-4">
//       <label className="block font-medium mb-1">
//         Product Images (Max {max})
//       </label>

//       <input
//         type="file"
//         multiple
//         accept="image/*"
//         onChange={handleFileChange}
//         className="border p-2 rounded-md w-full"
//       />

//       <div className="flex gap-2 flex-wrap mt-2">
//         {files.map((file, index) => (
//            <div key={index} className="relative">
//             <img
//               src={URL.createObjectURL(file)}
//               alt="preview"
//               className="w-20 h-20 object-cover rounded-md"
//             />

//             <button
//               type="button"
//               onClick={() => removeImage(index)}
//               className="absolute -top-2 -right-2 bg-red-600 text-white 
//                          rounded-full w-5 h-5 text-xs flex items-center justify-center"
//             >
//               ✕
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// })

// export default ProductImageUpload;


import { memo } from "react";

const ProductImageUpload = memo(({
  files,
  setFiles,
  existingImages = [],
  setExistingImages,
  max = 5
}) => {

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const totalCount =
      existingImages.length + files.length + selectedFiles.length;

    if (totalCount > max) {
      alert(`You can only upload ${max} images`);
      return;
    }

    setFiles([...files, ...selectedFiles]);
  };

  const removeNewImage = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const removeExistingImage = (index) => {
    const updatedImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedImages);
  };

  return (
    <div className="mb-4">
      <label className="block font-medium mb-2">
        Product Images (Max {max})
      </label>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="border p-2 rounded-md w-full"
      />

      <div className="flex gap-3 flex-wrap mt-4">

        {/* EXISTING IMAGES */}
        {existingImages?.map((img, index) => (
          <div key={`existing-${index}`} className="relative">
            <img
              src={img}
              alt="existing"
              className="w-24 h-24 object-cover rounded-md border"
            />

            <button
              type="button"
              onClick={() => removeExistingImage(index)}
              className="absolute -top-2 -right-2 bg-red-600 text-white
                         rounded-full w-6 h-6 text-xs flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ))}

        {/* NEWLY UPLOADED IMAGES */}
        {files?.map((file, index) => (
          <div key={`new-${index}`} className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-24 h-24 object-cover rounded-md border"
            />

            <button
              type="button"
              onClick={() => removeNewImage(index)}
              className="absolute -top-2 -right-2 bg-red-600 text-white
                         rounded-full w-6 h-6 text-xs flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ))}

      </div>
    </div>
  );
});

export default ProductImageUpload;

