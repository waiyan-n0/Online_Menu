import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu';
import SubMenu from './pages/SubMenu';
import Login from './pages/Login';
import AdminLogin from "./pages/AdminLogin.jsx";
import CreateShop from './pages/CreateShop.jsx';
import Error from './pages/Error.jsx';
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/menu/:slug" element={<Menu />} />
                <Route path="menu/:slug/:submenu" element={<SubMenu />} />
                <Route path="/menu/login" element={<Login />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/create-shop" element={<CreateShop />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    );
}