import { useNavigate } from "react-router-dom"
import AdminOutletHead from "../../../components/Admin/AdminOutletHead"
import Button from "../../../components/ui/Button"

function Products() {
  const navigate = useNavigate()
  return (

<>

<AdminOutletHead heading={"PRODUCTS"}/>
 <Button
   onClick = {()=>navigate('/admin-dashboard/products/add-products')}
 >
  Add Products
 </Button>
<div></div>
</>

  )
}

export default Products
