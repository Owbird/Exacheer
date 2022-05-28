import LandingPage from "./pages/LandingPage";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import AuthPage from "./pages/AuthPage";
import VerificationWrapper from "./pages/VerificationWrapper";
import Dashboard from "./pages/Dashboard";
import AddQuestions from "./pages/AddQuestions";
import AddExams from "./pages/AddExams";
import InitQuestionBank from "./pages/InitQuestionBank";
import InitExam from "./pages/InitExam";
import ViewQuestions from "./pages/ViewQuestions";
import { useState, useEffect } from "react";
import { getUserData, signOut } from './utils/firebase';
import TakeExams from "./pages/TakeExams";
import ReportCard from "./pages/ReportCard";
import ExamStats from "./pages/ExamStats";


function App() {

  const [userData, setUserData] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      <Router >
        <Routes >
          <Route element={<LandingPage />} exact path='/' />
          <Route element={<AuthPage />} path='/auth' />
          <Route element={<VerificationWrapper />} exact path='/verification/' />
          <Route element={<Dashboard />} path='/dashboard' />
          <Route element={<InitQuestionBank />} path='/questions/init' />
          <Route element={<InitExam />} path='/exams/init' />
          <Route element={<AddQuestions />} path='/questions/:id/add' />
          <Route element={<AddExams />} path='/exams/:id/add' />
          <Route element={<TakeExams />} path='/exams/:id/online' />
          <Route element={<ExamStats />} path='/exams/:id/stats' />
          <Route element={<ViewQuestions />} path='/questions/:id/view' />
          <Route element={<ReportCard />} path='/reports/:examId/:indexNumber' />
        </Routes>
      </Router>
    </>
  );
}

export default App;
