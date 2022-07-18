import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as ROUTES from './Constants/routes';
import HomePage from './Pages/Home';
import { ProfilePage } from './Pages/Profile';
import { ChatPage } from './Pages/Chat';
import { ChatsListPage } from './Pages/ChatsList';
import { SingleChatPage } from './Pages/SingleChat';
import { LoginPage } from './Pages/Login';
import { SignUpPage } from './Pages/Signup';
import { LandingPage } from './Pages/Landing';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute.component';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<LandingPage />} />
            <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />
            <Route path={ROUTES.LOG_IN} element={<LoginPage />} />
            <Route
              path={ROUTES.HOME}
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTES.PROFILE}
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTES.HOME}
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTES.SINGLE_CHAT}
              element={
                <PrivateRoute>
                  <SingleChatPage />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTES.CHATS}
              element={
                <PrivateRoute>
                  <ChatsListPage />
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTES.CHAT}
              element={
                <PrivateRoute>
                  <ChatPage />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
