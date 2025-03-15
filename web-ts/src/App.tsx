import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import TaskDetail from './pages/TaskDetail';
import Statistics from './pages/Statistics';
import NotFound from './pages/NotFound';
import { UserProvider } from './contexts/UserContext';
import { TaskProvider } from './contexts/TaskContext';
import { VoiceInputProvider } from './contexts/VoiceInputContext';
import NotificationProvider from './components/NotificationService';
import './styles/App.css';

function App() {
  return (
    <UserProvider>
      <TaskProvider>
        <VoiceInputProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="statistics" element={<Statistics />} />
                  <Route path="task/:id" element={<TaskDetail />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Router>
          </NotificationProvider>
        </VoiceInputProvider>
      </TaskProvider>
    </UserProvider>
  );
}

export default App; 