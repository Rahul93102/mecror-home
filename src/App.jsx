import React, { useState } from "react";
import ReferralNetworkDashboard from "./components/ReferralNetworkDashboard";
import { SplashScreen } from "./components/SplashScreen";
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
        <SplashScreen onComplete={handleHomeComplete} />
      ) : (
        <div style={{ width: "100%", height: "100vh" }}>
          <ReferralNetworkDashboard />
        </div>
      )}
    </div>
  );
}

export default App;
