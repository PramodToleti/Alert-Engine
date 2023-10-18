import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { MdOutlineCreateNewFolder } from "react-icons/md"
import { useEffect, useRef, useState } from "react"
import { useAppSelector } from "@/redux/hooks"
import { PolicyData } from "@/types/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import toast from "react-hot-toast"

const Policies = () => {
  const organization = useAppSelector((state) => state.organization.value)
  const [policies, setPolicies] = useState<PolicyData[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const fetchRef = useRef(() => {})

  useEffect(() => {
    async function fetchPolicies() {
      setLoading(true)
      const res = await fetch(
        `http://localhost:5000/api/policies/${organization}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      const data = await res.json()
      setLoading(false)
      if (res.ok) {
        setPolicies(data)
      }
    }
    fetchRef.current = fetchPolicies
    fetchPolicies()
  }, [organization])

  const handleDelete = async (id: string | undefined) => {
    const res = await fetch(`http://localhost:5000/api/policies/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (res.ok) {
      console.log("Policy deleted")
      toast.success("Policy deleted")
      fetchRef.current()
    } else {
      console.log("Error deleting policy")
      toast.error("Error deleting policy")
    }
  }

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
      <div className="flex flex-wrap gap-4 mt-10">
        {policies &&
          policies?.map((policy: PolicyData) => {
            return (
              <div
                className="flex flex-col justify-between gap-2 border border-gray-200 rounded-md p-4 w-full md:max-w-[400px] h-40 bg-gradient-to-tl from-[#f89b29]  to-[#ff0f7b]"
                key={policy._id}
              >
                <p className="text-lg font-medium text-white">{policy.name}</p>
                <div className="flex gap-2">
                  <Link to={`/policies/edit/${policy._id}`} state={policy}>
                    <Button variant="secondary">Edit</Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="secondary" className="text-red-500">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your policy and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(policy._id)}
                        >
                          {loading ? (
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              ></path>
                            </svg>
                          ) : (
                            "Delete"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )
          })}
        {policies.length === 0 && (
          <div className="flex flex-col justify-center items-center gap-4 w-screen h-44">
            <p className="text-2xl font-medium text-gray-400">
              No policies found
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Policies
