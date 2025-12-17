import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../features/account/pages/RegisterPage";
import LoginPage from "../features/account/pages/LoginPage";
import AuthGuard from "./AuthGuard";
import MainLayout from "../layout/MainLayout";
import ProfilePage from "../features/profile/pages/ProfilePage";
import ChatPage from "../features/chat/pages/ChatPage";
import PetitionFormPage from "../features/petition/pages/PetitionFormPage";
import PetitionPreviewPage from "../features/petition/pages/PetitionPreviewPage";
import PetitionTemplatesPage from "../features/petition/pages/PetitionTemplatesPage";
import MyPetitionsPage from "../features/petition/pages/MyPetitionsPage";
import DocumentAnalysisPage from "../features/document/pages/DocumentAnalysisPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "register", element: <RegisterPage /> },
      { path: "login", element: <LoginPage /> },

      {
        element: <AuthGuard />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { path: "", element: <Navigate to="/home" /> },
              { path: "home", element: <ChatPage /> },
              { path: "profile", element: <ProfilePage /> },
              {
                path: "/petition",
                element: <PetitionTemplatesPage />,
              },
              {
                path: "/petition/form/:id",
                element: <PetitionFormPage />,
              },
              {
                path: "/petition/preview/:id",
                element: <PetitionPreviewPage />,
              },
              {
                path: "/petition/my-petitions",
                element: <MyPetitionsPage />,
              },
              {
                path: "/document/analyze",
                element: <DocumentAnalysisPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
