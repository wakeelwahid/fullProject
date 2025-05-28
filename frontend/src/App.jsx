import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton";
import GameAnimations from "./components/GameAnimations";
import Header from "./components/header/Header";
import Footer from "./components/Footer/Footer";
import TopSection from "./components/top-section/Top_Section";
import Boxes from "./components/Boxes/Boxes";
import MyProfile from "./components/pages/MyProfile/MyProfile";
import WalletPage from "./components/pages/WalletPage/WalletPage";
import Refers from "./components/pages/Refers/Refers";
import SupportPage from "./components/pages/SupportPage/SupportPage";
import PrivacyPolicy from "./components/pages/PrivacyPolicy/PrivacyPolicy";
import RefundPolicy from "./components/pages/RefundPolicy/RefundPolicy";
import TransactionsPage from "./components/pages/Transactions/Transactions";
import GameHistory from "./components/pages/GameHistory/GameHistory";
import TermsConditions from "./components/pages/TermsConditions/TermsConditions";
import GameRules from "./components/pages/GameRules/GameRules";
import AddChips from "./components/pages/WalletPage/Add-withdraw/AddChips";
import WithdrawChips from "./components/pages/WalletPage/Add-withdraw/WithdrawChips";
import PaymentPage from "./components/pages/WalletPage/Payment/PaymentPage";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import NumberPage from "./components/pages/Numbers/NumberPage";
import BetSuccessPage from "./components/pages/BetSuccess/BetSuccessPage";
import MyBet from "./components/pages/MyBet/MyBet";
import Verification from "./components/pages/Verification/KYCVerification";
import AddChipsSuccess from "./components/pages/AddChipsSuccess/AddChipsSuccess";
import WithdrawalChipsSuccess from "./components/pages/WithdrawalChipsSuccess/WithdrawalChipsSuccess";
import Login from "./components/pages/Auth/Login";
import Register from "./components/pages/Auth/Register";
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminLogin from './components/Admin/AdminLogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
        <Route
          path="/*"
          element={
            <>
              <GameAnimations />
              <Header />
              <Routes>
                <Route path="/" element={<><TopSection /><Boxes /></>} />
                <Route path="/boxes" element={<Boxes />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<MyProfile />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/refer" element={<Refers />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/refund" element={<RefundPolicy />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route path="/history" element={<GameHistory />} />
                <Route path="/terms" element={<TermsConditions />} />
                <Route path="/addchips" element={<AddChips />} />
                <Route path="/withdrawchips" element={<WithdrawChips />} />
                <Route path="/purchasechips" element={<PaymentPage />} />
                <Route path="/numbers" element={<NumberPage />} />
                <Route path="/ordersuccess" element={<BetSuccessPage />} />
                <Route path="/mychips" element={<MyBet />} />
                <Route path="/play" element={<Boxes />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/addchipssuccess" element={<AddChipsSuccess />} />
                <Route path="/withdrawalchipssuccess" element={<WithdrawalChipsSuccess />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/game-rules" element={<GameRules />} />
              </Routes>
              <Footer />
              <WhatsAppButton />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;