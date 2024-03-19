import React from "react";
import { Container } from "react-bootstrap";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Homepage from "./Homepage";
import { ThemeProvider } from "./ThemeContext";
import ThemeSwitcher from "./ThemeSwitcher";
import DetailedWriting from "./DetailedWriting";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Container className="p-4 mb-5">
        <React.StrictMode>
            <Router>
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/writing/:folder/:file" element={<DetailedWriting />} />
                    <Route path="/writing/*" element={<Navigate replace to="/" />} />
                </Routes>
            </Router>
        </React.StrictMode>
        <ThemeProvider>
            <ThemeSwitcher />
        </ThemeProvider>
    </Container>
);
