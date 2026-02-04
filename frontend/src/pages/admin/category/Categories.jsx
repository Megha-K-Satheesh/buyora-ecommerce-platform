import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import AdminOutletHead from "../../../components/Admin/AdminOutletHead"
import Button from "../../../components/ui/Button"
import { categoriesTable, deleteCategory } from "../../../Redux/slices/admin/categorySlice"

import { FiEdit, FiTrash2 } from "react-icons/fi"
import Swal from "sweetalert2"
import Pagination from "../../../components/ui/Pagination"
import { showError, showSuccess } from "../../../components/ui/Toastify"


const Category = ()=>{
  const navigate = useNavigate()
  const dispatch = useDispatch()
   const [currentPagePage,setCurrentPage] = useState(1)
    const { categoriesTable: tableData, loading,currentPage,totalPages,totalCategories } = useSelector(
    (state) => state.category
    )
 const handleClick = ()=>{
    navigate("/admin-dashboard/categories/add-category")
 }

  const handleEdit = (id) => {
  navigate(`/admin-dashboard/categories/edit-category/${id}`);
};

const handleDelete = async (categoryId) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you really want to delete this category?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });

  if (result.isConfirmed) {
    try {
      await dispatch(deleteCategory(categoryId)).unwrap();
      showSuccess("Category deleted successfully");
    } catch (err) {
      showError(err);
    }
  }
};

const handlePageChange = (page) => {
  setCurrentPage(page)
  dispatch(categoriesTable({ page, limit:10 }));
};


  useEffect(()=>{
     dispatch(categoriesTable({page:currentPage,limit:10}))
  },[dispatch,currentPage])

  return(
    <>
    <AdminOutletHead heading={"CATEGORIES"}/>
    <div>
      <Button 
       onClick = {handleClick}
      >ADD CATEGORY</Button>
    </div>
     
    <div className="mx-10 mt-10">
        <table className="w-full border border-gray-300 border-collapse">
          <thead>
            <tr className="bg-white text-black">
              <th className="border p-2 text-center">Category</th>
              <th className="border p-2 text-center">Parent</th>
              <th className="border p-2 text-center">Level</th>
              <th className="border p-2 text-center">Active</th>
              <th className="border p-2 text-center">Visible</th>
              <th className="border p-2 text-center">Actions</th>
              
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && tableData.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No categories found
                </td>
              </tr>
            )}

            {!loading &&
              tableData.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50 bg-white ">
                  <td className="border p-3 text-center">
                    {cat.name}
                  </td>

                  <td className="border p-2 text-center">
                    {cat.parentId?.name || "—"}
                  </td>

                  <td className="border p-2 text-center">
                    {cat.parentId ? "Child" : "Parent"}
                  </td>

                  <td className="border p-2 text-center">
                    {cat.status==="active"? "Active" : "Inactive"}
                  </td>

                  <td className="border p-2 text-center">
                    {cat.isVisible ? "Yes" : "No"}
                  </td>
                  <td className="border p-2 text-center">
                    <div className="flex justify-around">

                    <FiEdit
                      className="text-black cursor-pointer hover:text-blue-700"
                      size={20}
                      onClick={() => handleEdit(cat._id)}
                   />
                    <FiTrash2
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      size={20}
                      onClick={() => handleDelete(cat._id)}
                    />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
         <div className=" shadow-t">

        <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        />
         </div>
      </div>
    </>
  )
}
export default Category
