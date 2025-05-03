import { Routes, Route, Router } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NotFound from "../pages/Notfound";
import NavBar from "../components/NavBar";
import QuizPage from "../pages/QuizPage";

const AppRoutes = () => (
    <div>
        <NavBar/>
        <Routes>
            <Route path="/valvio-v4/quiz/:quizId" element={<QuizPage />} />
            <Route path="/valvio-v4" element={<HomePage />} />
            <Route path="*" element={<NotFound/>}> </Route>
        </Routes>
    </div>
);

export default AppRoutes;