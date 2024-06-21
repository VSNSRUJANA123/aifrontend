import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Chatbot from "./components/Chatbot";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/:search" element={<Chatbot />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
