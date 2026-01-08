import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../App";
import AuthGuard from "./AuthGuard";
import MainLayout from "../layout/MainLayout";
import ProfilePage from "../features/profile/pages/ProfilePage";
import ChatPage from "../features/chat/pages/ChatPage";
import PetitionFormPage from "../features/petition/pages/PetitionFormPage";
import PetitionPreviewPage from "../features/petition/pages/PetitionPreviewPage";
import PetitionTemplatesPage from "../features/petition/pages/PetitionTemplatesPage";
import MyPetitionsPage from "../features/petition/pages/MyPetitionsPage";
import DocumentAnalysisPage from "../features/document/pages/DocumentAnalysisPage";
import PaymentFailedPage from "../features/payment/pages/PaymentFailedPage";
import PaymentSuccessPage from "../features/payment/pages/PaymentSuccessPage";
import PricingPage from "../features/payment/pages/PricingPage";
import SubscriptionManagement from "../features/payment/components/SubscriptionManagement";
import HomePage from "../pages/HomePage";
import ContactPage from "../pages/ContactPage";
import GuidancePage from "../features/guidance/pages/GuidancePage";
import RoadmapPage from "../features/guidance/pages/RoadmapPage";
import DashboardPage from "../pages/DashboardPage";
import PrivacyPage from "../pages/PrivacyPage";
import TermsPage from "../pages/TermsPage";
import NotFoundPage from "../pages/NotFoundPage";
import ErrorPage from "../pages/ErrorPage";
import FAQPage from "../pages/FAQPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "", element: <Navigate to="/home" /> },
      { path: "home", element: <HomePage /> },
      { path: "login", element: <Navigate to="/home" replace /> },
      { path: "iletisim", element: <ContactPage /> },
      { path: "gizlilik-politikasi", element: <PrivacyPage /> },
      { path: "kullanim-sartlari", element: <TermsPage /> },
      { path: "sss", element: <FAQPage /> },

      {
        element: <AuthGuard />,
        children: [
          {
            element: <MainLayout />,
            children: [
              { path: "panel", element: <DashboardPage /> },
              { path: "sohbet", element: <ChatPage /> },
              { path: "profil", element: <ProfilePage /> },
              { path: "/rehber", element: <GuidancePage /> },
              { path: "/rehber/yol-haritasi", element: <RoadmapPage /> },
              {
                path: "/dilekce",
                element: <PetitionTemplatesPage />,
              },
              {
                path: "/dilekce/olustur/:id/:slug?",
                element: <PetitionFormPage />,
              },
              {
                path: "/dilekce/onizleme/:id/:slug?",
                element: <PetitionPreviewPage />,
              },
              {
                path: "/dilekce/arsivim",
                element: <MyPetitionsPage />,
              },
              {
                path: "/belge/analiz",
                element: <DocumentAnalysisPage />,
              },
              {
                path: "/paketler",
                element: <PricingPage />,
              },
              {
                path: "/odeme/basarili",
                element: <PaymentSuccessPage />,
              },
              {
                path: "/payment-success",
                element: <PaymentSuccessPage />,
              },
              {
                path: "/odeme/basarisiz",
                element: <PaymentFailedPage />,
              },
              {
                path: "/payment-failed",
                element: <PaymentFailedPage />,
              },
              {
                path: "/aboneliklerim",
                element: <SubscriptionManagement />,
              },
            ],
          },
        ],
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
