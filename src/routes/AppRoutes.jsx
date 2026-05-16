import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Animals from "../pages/Animals";
import AddAnimal from "../pages/AddAnimal";
import Sightings from "../pages/Sightings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/animals" element={<Animals />} />
      <Route path="/add-animal" element={<AddAnimal />} />
      <Route path="/sightings" element={<Sightings />} />
      </Routes>
  );
}