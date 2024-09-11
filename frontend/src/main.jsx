/* eslint-disable no-nested-ternary */
import React, { useContext, useEffect } from "react";

import Aos from "aos";
import "aos/dist/aos.css";
import ReactDOM from "react-dom/client";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import App from "./App";
// import AuthenticatedAppAdmin from "./AuthenticatedAppAdmin";
// import Payment from "./components/DashBoard/Payment/Payment";
import Layout from "./components/layout/Layout";
import { UserContext, UserProvider } from "./context/UserContext";
import "./index.css";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import TicketPage from "./pages/Ticket/TicketPage";

// import About from "./pages/About/About";
// import BackOfficePages from "./pages/BackOfficePages/BackOfficePages";
// import CodePromo from "./pages/BackOfficePages/CodePromo";
// import EventBackoffice from "./pages/BackOfficePages/EventBackoffice";
// import Notes from "./pages/BackOfficePages/Notes";
// import Product from "./pages/BackOfficePages/Product";
// import ScoreCard from "./pages/BackOfficePages/ScoreCard";
// import User from "./pages/BackOfficePages/User";
// import Contact from "./pages/Contact/Contact";
// import CopilotContactPage from "./pages/CopilotPages/CopilotContactPage";
// import CopilotGiftPage from "./pages/CopilotPages/CopilotGiftPage";
// import CopilotMissionPage from "./pages/CopilotPages/CopilotMissionPage";
// import CopilotPages from "./pages/CopilotPages/CopilotPages";
// import CopilotProfilePage from "./pages/CopilotPages/CopilotProfilePage";
// import CopilotTrainingPage from "./pages/CopilotPages/CopilotTrainingPage";
// import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
// import Giveaway from "./pages/Giveaway/Giveaway";
// import Legal from "./pages/Legal/Legal";
// import Login from "./pages/Login/Login";
// import NotFound from "./pages/NotFound/NotFound";
// import Participate from "./pages/Paticipate/Participate";
// import Privacy from "./pages/Privacy/Privacy";
// import Signup from "./pages/Signup/Signup";
// import Workshop from "./pages/Workshop/Workshop";

const App = React.lazy(() => import("./App"));
const About = React.lazy(() => import("./pages/About/About"));
const Contact = React.lazy(() => import("./pages/Contact/Contact"));
const Workshop = React.lazy(() => import("./pages/Workshop/Workshop"));
const Giveaway = React.lazy(() => import("./pages/Giveaway/Giveaway"));
const Legal = React.lazy(() => import("./pages/Legal/Legal"));
const Privacy = React.lazy(() => import("./pages/Privacy/Privacy"));
const BackOfficePages = React.lazy(
  () => import("./pages/BackOfficePages/BackOfficePages")
);

const User = React.lazy(() => import("./pages/BackOfficePages/User"));
const EventBackoffice = React.lazy(
  () => import("./pages/BackOfficePages/EventBackoffice")
);
const Notes = React.lazy(() => import("./pages/BackOfficePages/Notes"));
const ScoreCard = React.lazy(() => import("./pages/BackOfficePages/ScoreCard"));
const Payment = React.lazy(() => import("./pages/BackOfficePages/Payment"));
const Product = React.lazy(() => import("./pages/BackOfficePages/Product"));
const CodePromo = React.lazy(() => import("./pages/BackOfficePages/CodePromo"));
const Mission = React.lazy(() => import("./pages/BackOfficePages/Missions"));
const Role = React.lazy(() => import("./pages/BackOfficePages/Role"));
const CopilotPages = React.lazy(
  () => import("./pages/CopilotPages/CopilotPages")
);
const CopilotPagesMobile = React.lazy(
  () => import("./pages/CopilotPages/CopilotPagesMobile")
);
const CopilotProfilePage = React.lazy(
  () => import("./pages/CopilotPages/CopilotProfilePage")
);
const CopilotTrainingPage = React.lazy(
  () => import("./pages/CopilotPages/CopilotTrainingPage")
);
const CopilotMissionPage = React.lazy(
  () => import("./pages/CopilotPages/CopilotMissionPage")
);
const CopilotContactPage = React.lazy(
  () => import("./pages/CopilotPages/CopilotContactPage")
);
const CopilotEventPage = React.lazy(
  () => import("./pages/CopilotPages/CopilotEventPage")
);
const CopilotScoreCard = React.lazy(
  () => import("./pages/CopilotPages/CopilotScoreCardPage")
);
const Participate = React.lazy(() => import("./pages/Paticipate/Participate"));
const ForgotPassword = React.lazy(
  () => import("./pages/ForgotPassword/ForgotPassword")
);
const Signup = React.lazy(() => import("./pages/Signup/Signup"));
const Login = React.lazy(() => import("./pages/Login/Login"));
const NotFound = React.lazy(() => import("./pages/NotFound/NotFound"));

export default function AppLayout() {
  const { user } = useContext(UserContext);
  useEffect(() => {
    Aos.init();
  }, []);
  return (
    <Layout>
      <React.Suspense
        fallback={
          <h1 className="text-white font-secondary-font">Loading ... </h1>
        }
      >
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/workshops" element={<Workshop />} />
          <Route path="/giveaway" element={<Giveaway />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/ticket/:token" element={<TicketPage />} />

          {user?.isLogged ? (
            user.data?.is_admin === "admin" ||
            user.data?.is_admin === "superAdmin" ? (
              <>
                <Route path="/backoffice" element={<BackOfficePages />} />
                <Route path="/backoffice/users" element={<User />} />
                <Route
                  path="/backoffice/events"
                  element={<EventBackoffice />}
                />
                <Route path="/backoffice/notes" element={<Notes />} />
                <Route path="/backoffice/scorecard" element={<ScoreCard />} />
                <Route path="/backoffice/payment" element={<Payment />} />
                <Route path="/backoffice/product" element={<Product />} />
                <Route path="/backoffice/codepromo" element={<CodePromo />} />
                <Route path="/backoffice/missions" element={<Mission />} />
                {user.data?.is_admin === "superAdmin" && (
                  <Route path="/backoffice/role" element={<Role />} />
                )}
              </>
            ) : (
              <>
                <Route path="/copilot" element={<CopilotPages />} />
                <Route
                  path="/copilot/copilothome"
                  element={<CopilotPagesMobile />}
                />
                <Route
                  path="/copilot/copilotprofile"
                  element={<CopilotProfilePage />}
                />
                <Route
                  path="/copilot/copilotentrainements"
                  element={<CopilotTrainingPage />}
                />
                <Route
                  path="/copilot/copilotmissions"
                  element={<CopilotMissionPage />}
                />
                <Route
                  path="/copilot/copilotcontact"
                  element={<CopilotContactPage />}
                />
                <Route
                  path="/copilot/copilotevenements"
                  element={<CopilotEventPage />}
                />
                <Route
                  path="/copilot/copilot_score_card"
                  element={<CopilotScoreCard />}
                />

                <Route path="/copilot/participate" element={<Participate />} />
              </>
            )
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="forgot/password" element={<ForgotPassword />} />
              <Route path="/reset" element={<ResetPassword />} />
            </>
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </Layout>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <UserProvider>
        <AppLayout />
      </UserProvider>
    </Router>
  </React.StrictMode>
);
