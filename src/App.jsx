import React, { useState } from "react";
import ReferralDashboard from "./components/ReferralDashboard_Clean";
import { AnimatedHomeScreen } from "./components/AnimatedHomeScreen";
import "./App.css";

function App() {
  const [showHomeScreen, setShowHomeScreen] = useState(true);

  const handleHomeComplete = () => {
    setShowHomeScreen(false);
  };

  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      {showHomeScreen ? (
        <AnimatedHomeScreen onComplete={handleHomeComplete} />
      ) : (
        <div style={{ width: "100%", height: "100vh" }}>
          <ReferralDashboard />
        </div>
      )}
    </div>
  );
}

export default App;
