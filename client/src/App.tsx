import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./components/Home"
import Policies from "./components/Policies"
import PolicyForm from "./components/PolicyForm"
import { Toaster } from "react-hot-toast"

const App = () => {
  return (
    <BrowserRouter>
    <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/policies" element={<Policies />} />
        <Route path="/policies/new" element={<PolicyForm />} />
        <Route path="/policies/edit/:id" element={<PolicyForm />} />
        {/* <Route path="/alerts" element={<Alerts />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
