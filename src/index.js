import React from "react";
import { Container } from "react-bootstrap";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Homepage from "./components/main/Homepage";
import DetailedWriting from "./components/main/DetailedWriting";
import ReferencesPage from "./components/main/ReferencesPage";
import { ThemeProvider } from "./utils/ThemeContext";
import ThemeSwitcher from "./components/miscellaneous/ThemeSwitcher";

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
