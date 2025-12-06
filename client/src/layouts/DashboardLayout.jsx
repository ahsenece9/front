import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import ReminderWidget from '../components/ReminderWidget';
import '../styles/DashboardLayout.css';

const DashboardLayout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className="dashboard-container">
            <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />

            <div className="main-content">
                <Topbar />

                <div className="page-content">
                    <Outlet />
                </div>

                <ReminderWidget />
            </div>
        </div>
    );
};

export default DashboardLayout;
