import './home.css';
import React from 'react';
import { AppSidebar } from '../../components/home/AppSidebar';
import { AppHeader } from '../../components/home/AppHeader';
import { HomeProvider } from '../../components/home/HomeContext';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <HomeProvider>
      <div className="admin-layout">
        <AppHeader />
        <div className="admin-container">
          <AppSidebar />
          <div className="admin-body">
            <main className="admin-main">
              {children}
            </main>
          </div>
        </div>
      </div>
    </HomeProvider>
  );
}
