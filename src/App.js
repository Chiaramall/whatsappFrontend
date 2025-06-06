import "./App.css";
import {BrowserRouter as Router, Route, Routes, useNavigate} from "react-router-dom";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";


function App() {



    return (

            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/chats" element={<ChatPage />} />
                </Routes>


            </div>

    );
}

export default App;
