import { Routes, Route } from "react-router-dom"
import Homepage from "./components/Homepage.jsx"
import Loginpage from "./components/Loginpage.jsx"
import Signuppage from "./components/Signuppage.jsx"
import Blogpage from "./components/Blogpage.jsx"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Loginpage />} />
      <Route path="/signup" element={<Signuppage />} />
      <Route path="/blog" element={<Blogpage />} />
    </Routes>
  )
}

export default App
