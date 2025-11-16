import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NotFound from "../pages/Notfound";
import NavBar from "../components/NavBar";
import QuizPage from "../pages/QuizPage";
import QuizLoadingPage from "../pages/QuizLoadingPage";
import QuizCompletePage from "../pages/QuizCompletePage";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => (
    <div>
        <NavBar/>
        <Routes>
            <Route path="/loading/:quizId" element={
                <ProtectedRoute>
                    <QuizLoadingPage />
                </ProtectedRoute>
            } />
            <Route path="/complete" element={
                <ProtectedRoute>
                    <QuizCompletePage />
                </ProtectedRoute>
            } />
            <Route path="/quiz/:quizId" element={
                <ProtectedRoute>
                    <QuizPage />
                </ProtectedRoute>
            } />
            <Route path="/" element={
                <ProtectedRoute>
                    <HomePage />
                </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound/>}> </Route>
        </Routes>
    </div>
);

export default AppRoutes;