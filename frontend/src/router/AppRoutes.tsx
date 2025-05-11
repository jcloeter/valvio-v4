import { Routes, Route, Router } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NotFound from "../pages/Notfound";
import NavBar from "../components/NavBar";
import QuizPage from "../pages/QuizPage";
import QuizLoadingPage from "../pages/QuizLoadingPage";
import QuizCompletePage from "../pages/QuizCompletePage";

const AppRoutes = () => (
    <div>
        <NavBar/>
        <Routes>
            <Route path="/loading/:quizId" element={<QuizLoadingPage />} />
            <Route path="/complete" element={<QuizCompletePage />} />
            <Route path="/quiz/:quizId" element={<QuizPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFound/>}> </Route>
        </Routes>
    </div>
);

export default AppRoutes;