import { Link } from "react-router-dom"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Alerts from "./Alerts"
import { Dispatch, useEffect, useState } from "react"
import { useAppDispatch } from "@/redux/hooks"
import { setOrganization } from "@/redux/slices/orgSlice"

interface Org {
  _id: string
  name: string
}

interface Props {
  orgs: Org[]
  loading: boolean
  dispatch: Dispatch<unknown>
}

const SelectBar = ({ orgs, loading, dispatch }: Props) => (
  <Select onValueChange={(val) => dispatch(setOrganization(val))}>
    <SelectTrigger className="w-[180px] focus:ring-0 focus:ring-offset-0">
      <SelectValue placeholder="Organisations" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {loading && <SelectItem value="Loading...">Loading...</SelectItem>}
        {orgs.map((org) => (
          <SelectItem value={org._id} key={org._id}>
            {org.name}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
)

const Navbar = () => {
  const [orgs, setOrgs] = useState([])
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const response = await fetch("http://localhost:5000/api/orgs")
      const data = await response.json()
      if (response.ok) {
        setLoading(false)
        console.log(data)
        setOrgs(data)
      }
    }
    fetchData()
  }, [])

  return (
    <nav className="flex justify-between px-10 md:px-20 py-4 bg-white shadow-md text-xl">
      <Link to="/">
        <div>Home</div>
      </Link>
      <ul className="flex gap-6 items-center">
        <SelectBar orgs={orgs} loading={loading} dispatch={dispatch} />
        <Link to="/policies">
          <li>Policies</li>
        </Link>
        <Alerts />
      </ul>
    </nav>
  )
}

export default Navbar
