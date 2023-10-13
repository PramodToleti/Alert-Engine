import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { MdOutlineCreateNewFolder } from "react-icons/md"

const Policies = () => {
  return (
    <div className="h-screen w-screen p-10 md:px-20">
      <div className="flex justify-end">
        <Link to="/policies/new">
          <Button className="flex gap-2 text">
            <MdOutlineCreateNewFolder className="text-xl" />
            <p>Create</p>
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Policies
