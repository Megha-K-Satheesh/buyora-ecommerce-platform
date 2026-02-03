import { useNavigate } from "react-router-dom"
import AdminOutletHead from "../../../components/Admin/AdminOutletHead"
import Button from "../../../components/ui/Button"




const Category = ()=>{
  const navigate = useNavigate()
 const handleClick = ()=>{
    navigate("/admin-dashboard/categories/add-category")
 }
  return(
    <>
    <AdminOutletHead heading={"CATEGORIES"}/>
    <div>
      <Button 
       onClick = {handleClick}
      >ADD CATEGORY</Button>
    </div>
     
    </>
  )
}
export default Category
