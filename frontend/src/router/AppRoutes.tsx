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
            <Route path="/valvio-v4/loading/:quizId" element={<QuizLoadingPage />} />
            <Route path="/valvio-v4/complete" element={<QuizCompletePage />} />
            <Route path="/valvio-v4/quiz/:quizId" element={<QuizPage />} />
            <Route path="/valvio-v4" element={<HomePage />} />
            <Route path="*" element={<NotFound/>}> </Route>
        </Routes>
    </div>
);

export default AppRoutes;