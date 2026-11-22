import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import RecipePage from "./pages/RecipePage";
import AddRecipePage from "./pages/AddRecipePage";
import EditRecipePage from "./pages/EditRecipePage";
import { ToastContainer, useToast } from "./components/Toast";

export default function App() {
  const { toasts } = useToast();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        <Route path="/add" element={<AddRecipePage />} />
        <Route path="/edit/:id" element={<EditRecipePage />} />
      </Routes>
      <ToastContainer toasts={toasts} />
    </BrowserRouter>
  );
}
