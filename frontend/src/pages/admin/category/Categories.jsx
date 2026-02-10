import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import AdminOutletHead from "../../../components/Admin/AdminOutletHead"
import Button from "../../../components/ui/Button"
import { categoriesTable, deleteCategory, setCurrentPage } from "../../../Redux/slices/admin/categorySlice"

import Swal from "sweetalert2"
import CategoryTable from "../../../components/Admin/CategoryTable"
import Pagination from "../../../components/ui/Pagination"
import SearchInput from "../../../components/ui/SearchInput"
import { showError, showSuccess } from "../../../components/ui/Toastify"


const Category = ()=>{
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [level,setLevel] = useState("");
  const [status,setStatus] = useState("");
  const [search,setSearch] = useState("");
    const { categoriesTable: tableData, loading,currentPage,totalPages,totalCategories:Total } = useSelector(
    (state) => state.category
    )
 const handleClick = ()=>{
    navigate("/admin-dashboard/categories/add-category")
 }

  const handleEdit = (id) => {
  navigate(`/admin-dashboard/categories/update-category/${id}`);
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

  dispatch(categoriesTable({ page, limit:10,
      level,
      status,search }));
};



  useEffect(()=>{
     dispatch(categoriesTable({page:currentPage,limit:10,level,
      status,
      search}))
  },[dispatch,currentPage,level,status,search])


 useEffect(() => {
  dispatch(setCurrentPage(1));
}, [level, status, search]);


  return(
    <>
    <AdminOutletHead heading={"CATEGORIES"}/>
    <div className="flex justify-end mr-20 mt-10">
      <Button 
       onClick = {handleClick}
      >ADD CATEGORY</Button>
    </div>
     
    <div className="flex ml-20   gap-5 mt-10">
        <div className="flex-1 ">
          <SearchInput
           value={search}
           onChange={(e)=>setSearch(e.target.value)}
           placeholder="Search Category ..."
          />
        </div>
        <div className=" flex-2 flex gap-5 ">
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className=" px-3 py-2 rounded-lg shadow-sm bg-white w-[25%] font-medium"
            >
              <option value="">All Levels</option>
              <option value="1">Level 1</option>
              <option value="2">Level 2</option>
              <option value="3">Level 3</option>
            </select>
       
             <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className=" bg-white shadow px-3 py-2 rounded-lg w-[25%] font-medium"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

        </div>
    </div>


          <CategoryTable
          loading={loading}
          tableData={tableData}
          total={Total}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
         <div className=" my-10">

        <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        />
         </div>
      
    </>
  )
}
export default Category
