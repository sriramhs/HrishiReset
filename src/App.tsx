import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import ChatBot from "./ChatBot";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="chatbot" element={<ChatBot />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
