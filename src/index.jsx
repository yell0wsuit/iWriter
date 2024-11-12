import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Container } from "react-bootstrap";
import ReactDOM from "react-dom/client";
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import DetailedWriting from "./components/main/DetailedWriting";
import Homepage from "./components/main/Homepage";
import ReferencesPage from "./components/main/ReferencesPage";
import ThemeSwitcher from "./components/miscellaneous/ThemeSwitcher";
import { ThemeProvider } from "./utils/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Container className="p-4 mb-5">
        <React.StrictMode>
            <Router>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/writing/:folder/:file" element={<DetailedWriting />} />
                    <Route path="/writing/*" element={<Navigate replace to="/" />} />
                    <Route path="/references" element={<ReferencesPage />} />
                </Routes>
            </Router>
        </React.StrictMode>
        <ThemeProvider>
            <ThemeSwitcher />
        </ThemeProvider>
    </Container>
);
