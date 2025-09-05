import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Network,
  TrendingUp,
  Target,
  Award,
  Activity,
  BarChart3,
  Shield,
  Settings,
  Info,
  Database,
  GitBranch,
  Menu,
  X,
} from "lucide-react";
import ReferralNetwork from "../utils/ReferralNetwork";
import { FloatingDock } from "./ui/FloatingDock";
import {
  HomeIcon,
  NetworkIcon,
  ChartIcon,
  UserGroupIcon,
  SettingsIcon,
  ExpandIcon,
  CollapseIcon,
  SidebarIcon,
  GraphIcon,
} from "./ui/Icons";

// Add CSS keyframes
const animationStyles = `
  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.7; }
    25% { transform: translate(50px, -50px) scale(1.1); opacity: 1; }
    50% { transform: translate(-25px, -75px) scale(0.9); opacity: 0.8; }
    75% { transform: translate(-50px, 50px) scale(1.05); opacity: 0.9; }
  }
  
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.4); }
    50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.8); }
  }
  
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes shine {
    0% { left: -100%; }
    100% { left: 100%; }
  }
  
  @media (max-width: 768px) {
    .sidebar-controls {
      flex-direction: column;
      gap: 0.5rem;
    }
    .sidebar-controls button {
      padding: 0.6rem 1rem;
      font-size: 0.8rem;
    }
  }
  
  @media (max-width: 480px) {
    .dashboard-header h1 {
      font-size: 2rem !important;
    }
    .dashboard-header p {
      font-size: 1rem !important;
    }
  }
`;

const ReferralNetworkDashboard = () => {
  const [network] = useState(() => new ReferralNetwork());
  const [stats, setStats] = useState(null);
  const [simulationData, setSimulationData] = useState([]);
  const [activeTab, setActiveTab] = useState("graph-structure");
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [selectedReferrers, setSelectedReferrers] = useState([]);
  const [scrollY, setScrollY] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    totalUsers: 0,
    totalReferrals: 0,
    avgReferrals: 0,
    networkDensity: 0,
  });

  // Toggle referrer selection function
  const toggleReferrerSelection = (userId) => {
    setSelectedReferrers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Scroll effect handler
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax scroll effect
  const parallaxOffset = scrollY * 0.5;

  //  navigation Bar
  const navigationItems = [
    { id: "graph-structure", label: "Graph Structure", icon: GitBranch },
    { id: "network-reach", label: "Network Reach", icon: Network },
    { id: "influencers", label: "Influencers", icon: Users },
    { id: "simulation", label: "Simulation", icon: Activity },
    { id: "optimization", label: "Optimization", icon: Target },
  ];

  useEffect(() => {
    // Inject CSS animations
    const styleElement = document.createElement("style");
    styleElement.textContent = animationStyles;
    document.head.appendChild(styleElement);

    const initializeNetwork = async () => {
      try {
        const users = Array.from(
          { length: 100 },
          (_, i) => `user_${String(i + 1).padStart(3, "0")}`
        );

        // Build hierarchical referral structure
        for (let i = 0; i < 20; i++) {
          const rootUser = users[i];
          for (let j = 0; j < Math.floor(Math.random() * 4) + 1; j++) {
            const candidateIndex = 20 + i * 4 + j;
            if (candidateIndex < users.length) {
              try {
                network.addReferral(rootUser, users[candidateIndex]);
              } catch (error) {
                continue;
              }
            }
          }
        }

        // Add second level referrals
        for (let i = 20; i < 60; i++) {
          if (Math.random() > 0.6) {
            const candidateIndex = 60 + Math.floor(Math.random() * 20);
            if (candidateIndex < users.length) {
              try {
                network.addReferral(users[i], users[candidateIndex]);
              } catch (error) {
                continue;
              }
            }
          }
        }

        // Add random referrals
        for (let i = 0; i < 30; i++) {
          try {
            const referrerIndex = Math.floor(Math.random() * 80);
            const candidateId = `new_candidate_${i + 1}`;
            network.addReferral(users[referrerIndex], candidateId);
          } catch (error) {
            continue;
          }
        }

        const networkStats = network.getNetworkStats();
        setStats(networkStats);

        // Generate simulation data
        const simulations = {
          conservative: network.simulate(0.2, 30),
          moderate: network.simulate(0.35, 30),
          aggressive: network.simulate(0.5, 30),
        };

        const simulationChartData = simulations.conservative.map(
          (conservative, index) => ({
            day: index + 1,
            conservative: conservative,
            moderate: simulations.moderate[index] || 0,
            aggressive: simulations.aggressive[index] || 0,
            growth:
              index > 0
                ? conservative - simulations.conservative[index - 1]
                : conservative,
          })
        );

        setSimulationData(simulationChartData);
        setLoading(false);
      } catch (error) {
        console.error("Error initializing network:", error);
        setLoading(false);
      }
    };

    initializeNetwork();
  }, [network]);

  // Animate counter values with staggered timing
  useEffect(() => {
    if (!stats) return;

    const animateValue = (key, target, delay = 0) => {
      setTimeout(() => {
        const duration = 2500;
        const steps = 60;
        const stepValue = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += stepValue;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }

          setAnimatedStats((prev) => ({
            ...prev,
            [key]:
              key === "avgReferrals" || key === "networkDensity"
                ? parseFloat(current.toFixed(1))
                : Math.floor(current),
          }));
        }, duration / steps);
      }, delay);
    };

    // Staggered animations for better visual effect
    animateValue("totalUsers", stats.totalUsers, 0);
    animateValue("totalReferrals", stats.totalReferrals, 300);
    animateValue("avgReferrals", stats.avgReferralsPerUser, 600);
    animateValue(
      "networkDensity",
      (stats.totalReferrals / (stats.totalUsers || 1)) * 10,
      900
    );
  }, [stats]);

  const COLORS = ["#000000", "#333333", "#666666", "#999999", "#cccccc"];
  const GRADIENT_COLORS = [
    "#667eea",
    "#764ba2",
    "#f093fb",
    "#f5576c",
    "#4facfe",
    "#00f2fe",
  ];
  const CHART_COLORS = {
    primary: "#1a1a1a",
    secondary: "#4a5568",
    accent: "#667eea",
    success: "#48bb78",
    warning: "#ed8936",
    error: "#f56565",
    gradient1: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    gradient2: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    gradient3: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    gradient4: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    gradient5: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "graph-structure":
        return renderGraphStructure();
      case "network-reach":
        return renderNetworkReach();
      case "influencers":
        return renderInfluencers();
      case "simulation":
        return renderSimulation();
      case "optimization":
        return renderOptimization();
      default:
        return renderGraphStructure();
    }
  };

  // Graph Structure Tab
  const renderGraphStructure = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2rem",
        padding: "1rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
          delay: 0.1,
        }}
        whileHover={{
          scale: 1.03,
          y: -8,
          rotateX: 5,
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        }}
        whileTap={{ scale: 0.98 }}
        style={{
          background: "#ffffff",
          padding: "0",
          borderRadius: "30px",
          boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.08)",
          border: "3px solid #000000",
          color: "#000000",
          position: "relative",
          overflow: "hidden",
          transformStyle: "preserve-3d",
          cursor: "pointer",
        }}
      >
        {/* Animated background shimmer effect */}
        <motion.div
          animate={{
            background: [
              "linear-gradient(45deg, transparent 0%, rgba(0,0,0,0.03) 25%, transparent 50%, rgba(0,0,0,0.03) 75%, transparent 100%)",
              "linear-gradient(45deg, rgba(0,0,0,0.03) 0%, transparent 25%, rgba(0,0,0,0.03) 50%, transparent 75%, rgba(0,0,0,0.03) 100%)",
            ],
            backgroundSize: ["200% 200%", "200% 200%"],
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse",
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}
        />

        {/* Header Section */}
        <div
          style={{
            padding: "2rem 2rem 1rem 2rem",
            borderBottom: "2px solid #000000",
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.h3
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              color: "#000000",
              marginBottom: "0.5rem",
              fontSize: "1.6rem",
              fontWeight: "800",
              textAlign: "center",
              letterSpacing: "-0.5px",
            }}
          >
            📊 Network Statistics
          </motion.h3>
        </div>

        {/* Content Section */}
        <div
          style={{
            padding: "2rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {[
              {
                label: "Total Users",
                value: animatedStats.totalUsers,
                icon: "👥",
                bgColor: "#3b82f6",
              },
              {
                label: "Total Referrals",
                value: animatedStats.totalReferrals,
                icon: "🔗",
                bgColor: "#10b981",
              },
              {
                label: "Average Referrals",
                value: animatedStats.avgReferrals,
                icon: "📈",
                bgColor: "#f59e0b",
              },
              {
                label: "Network Density",
                value: `${animatedStats.networkDensity}%`,
                icon: "🌐",
                bgColor: "#8b5cf6",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: -40, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{
                  delay: 0.5 + index * 0.15,
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1],
                }}
                whileHover={{
                  scale: 1.05,
                  x: 10,
                  boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                  border: "2px solid #000000",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  cursor: "pointer",
                }}
              >
                {/* Animated border glow */}
                <motion.div
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2,
                  }}
                  style={{
                    position: "absolute",
                    top: "-2px",
                    left: "-2px",
                    right: "-2px",
                    bottom: "-2px",
                    background: `linear-gradient(45deg, ${stat.bgColor}, transparent, ${stat.bgColor})`,
                    borderRadius: "22px",
                    zIndex: -1,
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "1.5rem",
                    gap: "1.25rem",
                  }}
                >
                  {/* Icon */}
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "15px",
                      background: stat.bgColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.8rem",
                      boxShadow: `0 8px 20px ${stat.bgColor}40`,
                      flexShrink: 0,
                    }}
                  >
                    {stat.icon}
                  </motion.div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        color: "#64748b",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                        marginBottom: "0.5rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {stat.label}
                    </div>

                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        color: ["#000000", stat.bgColor, "#000000"],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: index * 0.2,
                      }}
                      style={{
                        color: "#000000",
                        fontWeight: "900",
                        fontSize: "2.2rem",
                        lineHeight: "1",
                      }}
                    >
                      {stat.value}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
          delay: 0.3,
        }}
        whileHover={{
          scale: 1.03,
          y: -8,
          rotateX: 5,
          boxShadow:
            "0 30px 80px rgba(0, 0, 0, 0.25), 0 12px 35px rgba(0, 0, 0, 0.15)",
          transition: {
            duration: 0.3,
            ease: "easeOut",
          },
        }}
        whileTap={{ scale: 0.98 }}
        style={{
          background: "#ffffff",
          borderRadius: "30px",
          boxShadow:
            "0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.08)",
          border: "3px solid #000000",
          overflow: "hidden",
          position: "relative",
          transformStyle: "preserve-3d",
          cursor: "pointer",
          minHeight: "500px",
        }}
      >
        {/* Animated background shimmer effect */}
        <motion.div
          animate={{
            background: [
              "linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.02) 25%, transparent 50%, rgba(0,0,0,0.02) 75%, transparent 100%)",
              "linear-gradient(135deg, rgba(0,0,0,0.02) 0%, transparent 25%, rgba(0,0,0,0.02) 50%, transparent 75%, rgba(0,0,0,0.02) 100%)",
            ],
            backgroundSize: ["300% 300%", "300% 300%"],
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse",
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}
        />

        {/* Decorative corner elements */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "20px",
            height: "20px",
            border: "3px solid #000000",
            borderRadius: "50%",
            zIndex: 2,
          }}
        />

        {/* Header Section */}
        <div
          style={{
            padding: "2rem 2rem 1rem 2rem",
            borderBottom: "2px solid #000000",
            position: "relative",
            zIndex: 1,
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          }}
        >
          <motion.h3
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{
              color: "#000000",
              fontSize: "1.6rem",
              fontWeight: "800",
              textAlign: "center",
              margin: "0",
              letterSpacing: "-0.5px",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            📊 Top Referrers Chart
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            style={{
              color: "#666666",
              fontSize: "0.9rem",
              textAlign: "center",
              margin: "0.5rem 0 0 0",
              fontWeight: "500",
            }}
          >
            Performance ranking by referral count
          </motion.p>
        </div>

        {/* Chart Section - Enhanced with Scroll Effects */}
        <div
          style={{
            padding: "2rem",
            minHeight: "400px",
            background: "#ffffff",
            position: "relative",
            zIndex: 1,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            style={{ 
              height: "350px", 
              width: "100%",
              transform: `translateY(${-scrollY * 0.1}px)`,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { user: "User_001", referrals: 25, name: "Alex Smith", performance: "🔥 Top" },
                  { user: "User_002", referrals: 20, name: "Sarah Johnson", performance: "⭐ High" },
                  { user: "User_003", referrals: 18, name: "Mike Chen", performance: "📈 Rising" },
                  { user: "User_004", referrals: 15, name: "Emma Davis", performance: "✨ Good" },
                  { user: "User_005", referrals: 12, name: "David Wilson", performance: "🚀 New" },
                  { user: "User_006", referrals: 10, name: "Lisa Brown", performance: "💪 Strong" },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#000000"
                  strokeOpacity={0.2}
                />
                <XAxis
                  dataKey="user"
                  axisLine={{ stroke: "#000000", strokeWidth: 2 }}
                  tickLine={{ stroke: "#000000", strokeWidth: 1 }}
                  tick={{ 
                    fill: "#000000", 
                    fontSize: 11, 
                    fontWeight: "700" 
                  }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  axisLine={{ stroke: "#000000", strokeWidth: 2 }}
                  tickLine={{ stroke: "#000000", strokeWidth: 1 }}
                  tick={{ 
                    fill: "#000000", 
                    fontSize: 12, 
                    fontWeight: "700" 
                  }}
                  label={{ 
                    value: 'Referrals', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fill: '#000000', fontWeight: '700' }
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "2px solid #000000",
                    borderRadius: "12px",
                    color: "#000000",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    fontWeight: "600",
                  }}
                  formatter={(value, name, props) => [
                    `🎯 ${value} referrals`,
                    `${props.payload.name} - ${props.payload.performance}`
                  ]}
                  labelFormatter={(label) => `📊 User: ${label}`}
                />
                <Bar 
                  dataKey="referrals" 
                  radius={[8, 8, 0, 0]}
                  stroke="#000000"
                  strokeWidth={2}
                >
                  {[
                    "#ff6b6b", // Vibrant Red
                    "#4ecdc4", // Turquoise  
                    "#45b7d1", // Sky Blue
                    "#96ceb4", // Mint Green
                    "#feca57", // Golden Yellow
                    "#ff9ff3", // Pink
                  ].map((color, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={color}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Chart Labels with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "1rem",
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "🔥 Top Performer", color: "#ff6b6b" },
              { label: "⭐ High Performer", color: "#4ecdc4" },
              { label: "📈 Rising Star", color: "#45b7d1" },
              { label: "✨ Good Performer", color: "#96ceb4" },
              { label: "🚀 Newcomer", color: "#feca57" },
              { label: "💪 Strong Player", color: "#ff9ff3" },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.1, y: -2 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "20px",
                  background: "#f8f9fa",
                  border: "1px solid #e5e7eb",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: item.color,
                  }}
                />
                {item.label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );

  // Network Reach Tab  
  const renderNetworkReach = () => {
    // Get network reach data with fallback data
    const reachData = Array.from(network.users.size > 0 ? network.users : [
      "user_001", "user_002", "user_003", "user_004", "user_005", 
      "user_006", "user_007", "user_008", "user_009", "user_010",
      "user_011", "user_012", "user_013", "user_014", "user_015"
    ])
      .map((userId, index) => ({
        userId,
        directReferrals: network.users.size > 0 ? network.getDirectReferrals(userId).length : Math.floor(Math.random() * 8) + 2,
        totalReach: network.users.size > 0 ? network.getTotalReferralCount(userId) : Math.floor(Math.random() * 15) + 5,
        reachExpansion: network.users.size > 0 ? 
          network.getTotalReferralCount(userId) - network.getDirectReferrals(userId).length :
          Math.floor(Math.random() * 8) + 1,
      }))
      .filter((user) => user.totalReach > 0)
      .sort((a, b) => b.totalReach - a.totalReach);

    // Generate sample top referrers if network is empty
    const topReferrersByReach = network.users.size > 0 ? 
      network.getTopReferrersByReach(10) : 
      reachData.map((user, index) => ({
        userId: user.userId,
        referralCount: user.totalReach,
        totalReach: user.totalReach,
        rank: index + 1
      }));

    // Debug log
    console.log("Network Reach Data:", { reachData: reachData.slice(0, 5), topReferrersByReach: topReferrersByReach.slice(0, 5) });

    return (
      <div style={{ width: "100%" }}>
        {/* Full width header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background:
              "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
            backgroundSize: "200% 200%",
            animation: "gradient-shift 12s ease infinite",
            padding: "2rem",
            borderRadius: "25px",
            boxShadow: "0 25px 50px rgba(102, 126, 234, 0.4)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            marginBottom: "2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background particles */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              animation: "float 20s ease-in-out infinite",
              zIndex: 0,
            }}
          ></div>

          <h3
            style={{
              background:
                "linear-gradient(90deg, #fff 0%, #f0f8ff 50%, #fff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% 100%",
              animation: "gradient-shift 8s ease infinite",
              marginBottom: "1rem",
              fontSize: "2rem",
              fontWeight: "800",
              letterSpacing: "-0.5px",
              position: "relative",
              zIndex: 1,
              textAlign: "center",
            }}
          >
            🌐 Full Network Reach Analysis (Part 2)
          </h3>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "1.1rem",
              textAlign: "center",
              margin: 0,
              position: "relative",
              zIndex: 1,
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            Total referral count including direct and indirect referrals using
            BFS traversal
          </p>
        </motion.div>

        {/* Main grid layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "2rem",
            width: "100%",
          }}
        >
          {/* Network Reach Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.01, y: -3 }}
            style={{
              background: "#ffffff",
              borderRadius: "25px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Top 20% Header Section */}
            <div
              style={{
                height: "20%",
                minHeight: "80px",
                background: "linear-gradient(135deg, #43e97b, #38f9d7)",
                padding: "1.5rem 2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "relative",
              }}
            >
              {/* Animated background */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundImage:
                    "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)",
                  animation: "float 18s ease-in-out infinite reverse",
                }}
              ></div>

              <h4
                style={{
                  color: "#ffffff",
                  fontSize: "1.5rem",
                  fontWeight: "700",
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  position: "relative",
                  zIndex: 1,
                  margin: 0,
                }}
              >
                📈 Reach vs Direct Referrals Comparison
              </h4>

              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.6)",
                  position: "relative",
                  zIndex: 1,
                }}
              ></div>
            </div>

            {/* Bottom 80% Content Section */}
            <div
              style={{
                height: "80%",
                minHeight: "400px",
                padding: "2rem",
                background: "#ffffff",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reachData.slice(0, 12)} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(0,0,0,0.2)"
                  />
                  <XAxis
                    dataKey="userId"
                    stroke="#000000"
                    fontSize={11}
                    fontWeight="600"
                    tickFormatter={(value) => value.slice(-6)}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="#000000" 
                    fontSize={12}
                    fontWeight="600"
                    label={{ 
                      value: 'Referrals', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fill: '#000000', fontWeight: '600' }
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "2px solid #000000",
                      borderRadius: "12px",
                      color: "#000000",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                      fontWeight: "600",
                    }}
                    formatter={(value, name) => [
                      value,
                      name === "directReferrals"
                        ? "🎯 Direct Referrals"
                        : "🌐 Total Network Reach",
                    ]}
                    labelFormatter={(userId) => `👤 User: ${userId}`}
                  />
                  <Legend 
                    wrapperStyle={{
                      fontWeight: "600",
                      color: "#000000"
                    }}
                  />
                  <Bar
                    dataKey="directReferrals"
                    fill="#4ecdc4"
                    name="Direct Referrals"
                    radius={[4, 4, 0, 0]}
                    stroke="#000000"
                    strokeWidth={1}
                  />
                  <Bar
                    dataKey="totalReach"
                    fill="#ff6b6b"
                    name="Total Network Reach"
                    radius={[4, 4, 0, 0]}
                    stroke="#000000"
                    strokeWidth={1}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Top Referrers by Reach - Enhanced White Design */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -3 }}
            style={{
              background: "#ffffff",
              borderRadius: "25px",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)",
              border: "3px solid #000000",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "2rem 2rem 1rem 2rem",
                borderBottom: "2px solid #000000",
                background: "#ffffff",
              }}
            >
              <h4
                style={{
                  color: "#000000",
                  marginBottom: "0.5rem",
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  textAlign: "center",
                  margin: 0,
                }}
              >
                🏆 Top Referrers by Total Reach
              </h4>
              <p
                style={{
                  color: "#666666",
                  fontSize: "0.9rem",
                  textAlign: "center",
                  margin: "0.5rem 0 0 0",
                  fontWeight: "500",
                }}
              >
                Click to select top performers
              </p>
            </div>

            {/* Selection Info */}
            {selectedReferrers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "linear-gradient(135deg, #000000 0%, #333333 100%)",
                  color: "#ffffff",
                  padding: "1rem 2rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: "700" }}>
                  {selectedReferrers.length} referrer{selectedReferrers.length > 1 ? 's' : ''} selected
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedReferrers([])}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "#ffffff",
                    padding: "0.5rem 1rem",
                    borderRadius: "8px",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Clear All
                </motion.button>
              </motion.div>
            )}

            {/* Referrer Cards */}
            <div
              style={{
                padding: "2rem",
                background: "#ffffff",
                maxHeight: "500px",
                overflowY: "auto",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {topReferrersByReach.slice(0, 8).map((user, index) => {
                  const isSelected = selectedReferrers.includes(user.userId);
                  const isTopPerformer = index < 3;
                  
                  return (
                    <motion.div
                      key={user.userId}
                      initial={{ opacity: 0, x: 30, scale: 0.9 }}
                      animate={{ 
                        opacity: 1, 
                        x: 0, 
                        scale: isSelected ? 1.03 : 1,
                        y: isSelected ? -2 : 0
                      }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      whileHover={{ 
                        scale: isSelected ? 1.05 : 1.02, 
                        y: -4,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleReferrerSelection(user.userId)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "1.5rem",
                        background: isSelected 
                          ? "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)"
                          : "#ffffff",
                        borderRadius: "20px",
                        border: isSelected 
                          ? "3px solid #000000" 
                          : isTopPerformer 
                            ? "2px solid #ffd700"
                            : "2px solid #e5e7eb",
                        boxShadow: isSelected
                          ? "0 15px 35px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 0, 0, 0.2)"
                          : isTopPerformer
                            ? "0 10px 25px rgba(255, 215, 0, 0.3)"
                            : "0 8px 20px rgba(0, 0, 0, 0.08)",
                        cursor: "pointer",
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {/* Selection Indicator */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: isSelected ? 1 : 0,
                          opacity: isSelected ? 1 : 0
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        style={{
                          position: "absolute",
                          top: "1rem",
                          right: "1rem",
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: isSelected ? "#ffffff" : "#10b981",
                          color: isSelected ? "#000000" : "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.9rem",
                          fontWeight: "900",
                          zIndex: 3,
                        }}
                      >
                        ✓
                      </motion.div>

                      {/* Main Content */}
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        {/* Rank Badge */}
                        <motion.div
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            background: isSelected 
                              ? "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)"
                              : index === 0
                                ? "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)"
                                : index === 1
                                  ? "linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)"
                                  : index === 2
                                    ? "linear-gradient(135deg, #cd7f32 0%, #daa520 100%)"
                                    : "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
                            color: isSelected ? "#000000" : "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.1rem",
                            fontWeight: "800",
                            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)",
                            border: isSelected ? "2px solid #000000" : "none",
                          }}
                        >
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </motion.div>

                        {/* User Info */}
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              color: isSelected ? "#ffffff" : "#000000",
                              fontWeight: "700",
                              fontSize: "1.1rem",
                              marginBottom: "0.3rem",
                            }}
                          >
                            {user.userId.slice(-8)}
                          </div>
                          <div
                            style={{
                              color: isSelected ? "#cccccc" : "#666666",
                              fontSize: "0.85rem",
                              fontWeight: "500",
                            }}
                          >
                            {isSelected ? "Selected Referrer" : "Network Specialist"}
                          </div>
                        </div>
                      </div>

                      {/* Reach Count */}
                      <motion.div
                        animate={{ 
                          scale: [1, 1.05, 1],
                          color: isSelected 
                            ? ["#ffffff", "#cccccc", "#ffffff"]
                            : ["#000000", "#333333", "#000000"]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                        style={{
                          fontSize: "1.6rem",
                          fontWeight: "900",
                          textAlign: "center",
                          minWidth: "60px",
                        }}
                      >
                        {user.referralCount || user.totalReach || 0}
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* BFS Algorithm Explanation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            background:
              "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
            backgroundSize: "200% 200%",
            animation: "gradient-shift 20s ease infinite",
            padding: "2rem",
            borderRadius: "25px",
            boxShadow: "0 25px 50px rgba(102, 126, 234, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            marginTop: "2rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "radial-gradient(circle at 15% 85%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 85% 15%, rgba(255,255,255,0.08) 0%, transparent 50%)",
              animation: "float 25s ease-in-out infinite reverse",
              zIndex: 0,
            }}
          ></div>

          <h4
            style={{
              color: "#ffffff",
              fontSize: "1.3rem",
              fontWeight: "700",
              marginBottom: "1rem",
              position: "relative",
              zIndex: 1,
              background:
                "linear-gradient(90deg, #fff 0%, #f0f8ff 50%, #fff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% 100%",
              animation: "gradient-shift 6s ease infinite",
            }}
          >
            🧠 BFS Algorithm Implementation
          </h4>
          <p
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              lineHeight: "1.6",
              fontSize: "1rem",
              margin: 0,
              position: "relative",
              zIndex: 1,
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            <strong>Total Referral Count:</strong> Uses Breadth-First Search
            (BFS) to traverse the entire referral tree and count all direct and
            indirect referrals. The algorithm starts from a user and explores
            all connected nodes level by level, ensuring we capture the complete
            downstream network reach.
            <br />
            <br />
            <strong>Top Referrers by Reach:</strong> Ranks users based on their
            total referral count (direct + indirect). Choose k based on your
            analysis needs: k=5-10 for executive summaries, k=20-50 for detailed
            analysis.
          </p>
        </motion.div>
      </div>
    );
  };

  // Influencers Tab
  const renderInfluencers = () => {
    // Create simple, guaranteed pie chart data
    const pieChartData = [
      { name: "er_001", value: 25, fill: "#FF6B6B" },
      { name: "er_002", value: 20, fill: "#4ECDC4" },
      { name: "er_005", value: 18, fill: "#FFE66D" },
      { name: "er_012", value: 15, fill: "#FF8A80" },
      { name: "er_032", value: 22, fill: "#81C784" }
    ];

    console.log("Pie Chart Data:", pieChartData);

    return (
    <div
      style={{ 
        display: "grid", 
        gridTemplateColumns: "1fr 1fr", 
        gap: "2rem",
        padding: "1rem"
      }}
    >
      {/* Top Influencers Chart - White with Black Border */}
      <motion.div
        initial={{ opacity: 0, x: -30, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        whileHover={{ 
          scale: 1.02, 
          y: -5,
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
        }}
        style={{
          background: "#ffffff",
          borderRadius: "25px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          border: "3px solid #000000",
          overflow: "hidden",
          position: "relative"
        }}
      >
        {/* Header Section */}
        <div
          style={{
            padding: "2rem 2rem 1rem 2rem",
            borderBottom: "2px solid #000000",
            background: "#ffffff",
          }}
        >
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              color: "#000000",
              marginBottom: "0.5rem",
              fontSize: "1.6rem",
              fontWeight: "800",
              textAlign: "center",
              margin: 0,
            }}
          >
            🌟 Top Influencers
          </motion.h3>
          <p
            style={{
              color: "#666666",
              fontSize: "0.9rem",
              textAlign: "center",
              margin: "0.5rem 0 0 0",
              fontWeight: "500",
            }}
          >
            Performance distribution by influence
          </p>
        </div>

        {/* Chart Section */}
        <div
          style={{
            padding: "2rem",
            background: "#ffffff",
            minHeight: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={40}
                paddingAngle={5}
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} stroke="#000" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value} referrals`, `User ${name}`]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "2px solid #000000",
                  borderRadius: "12px",
                  color: "#000000",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                  fontWeight: "600",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Influencer Rankings - White with Black Border */}
      <motion.div
        initial={{ opacity: 0, x: 30, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        whileHover={{ 
          scale: 1.02, 
          y: -5,
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
        }}
        style={{
          background: "#ffffff",
          borderRadius: "25px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          border: "3px solid #000000",
          overflow: "hidden",
          position: "relative"
        }}
      >
        {/* Header Section */}
        <div
          style={{
            padding: "2rem 2rem 1rem 2rem",
            borderBottom: "2px solid #000000",
            background: "#ffffff",
          }}
        >
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{
              color: "#000000",
              marginBottom: "0",
              fontSize: "1.5rem",
              fontWeight: "800",
              textAlign: "center",
            }}
          >
            🏆 Influencer Rankings
          </motion.h3>
        </div>

        {/* Rankings Section */}
        <div
          style={{
            padding: "2rem",
            background: "#ffffff",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            {(stats?.topReferrers?.slice(0, 8) || [
              { userId: "user_001", referralCount: 25 },
              { userId: "user_002", referralCount: 20 },
              { userId: "user_003", referralCount: 18 },
              { userId: "user_004", referralCount: 15 },
              { userId: "user_005", referralCount: 12 },
              { userId: "user_006", referralCount: 10 },
              { userId: "user_007", referralCount: 8 },
              { userId: "user_008", referralCount: 6 },
            ]).map((user, index) => (
              <motion.div
                key={user.userId}
                initial={{ opacity: 0, x: -30, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.08 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -3,
                  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)"
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1.5rem",
                  background: "#ffffff",
                  borderRadius: "15px",
                  border: `2px solid ${
                    index === 0 ? "#ffd700" :
                    index === 1 ? "#c0c0c0" :
                    index === 2 ? "#cd7f32" : "#000000"
                  }`,
                  boxShadow: `0 8px 20px ${
                    index === 0 ? "rgba(255, 215, 0, 0.3)" :
                    index === 1 ? "rgba(192, 192, 192, 0.3)" :
                    index === 2 ? "rgba(205, 127, 50, 0.3)" : "rgba(0, 0, 0, 0.08)"
                  }`,
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Rank Badge */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background: 
                        index === 0 ? "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)" :
                        index === 1 ? "linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)" :
                        index === 2 ? "linear-gradient(135deg, #cd7f32 0%, #daa520 100%)" :
                        "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      fontWeight: "800",
                      boxShadow: "0 6px 18px rgba(0, 0, 0, 0.2)",
                      textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </motion.div>

                  {/* User Info */}
                  <div>
                    <div
                      style={{
                        color: "#000000",
                        fontWeight: "800",
                        fontSize: "1.1rem",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {user.userId}
                    </div>
                    <div
                      style={{
                        color: "#666666",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                      }}
                    >
                      💎 Score: {(user.referralCount * 10).toFixed(1)} ⭐
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    color: [
                      index === 0 ? "#ffd700" : "#000000", 
                      index === 0 ? "#ffed4e" : "#333333", 
                      index === 0 ? "#ffd700" : "#000000"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3,
                  }}
                  style={{
                    textAlign: "right",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: "900",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {user.referralCount}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      color: "#666666",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    referrals
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
    );
  };

  // Simulation Tab
  const renderSimulation = () => (
    <div
      style={{ 
        display: "grid", 
        gridTemplateColumns: "2fr 1fr", 
        gap: "2rem",
        padding: "1rem"
      }}
    >
      {/* Main Simulation Chart - White with Black Border */}
      <motion.div
        initial={{ opacity: 0, x: -30, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        whileHover={{ 
          scale: 1.02, 
          y: -5,
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
        }}
        style={{
          background: "#ffffff",
          borderRadius: "25px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          border: "3px solid #000000",
          overflow: "hidden",
          position: "relative"
        }}
      >
        {/* Header Section */}
        <div
          style={{
            padding: "2rem 2rem 1rem 2rem",
            borderBottom: "2px solid #000000",
            background: "#ffffff",
          }}
        >
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              color: "#000000",
              marginBottom: "0.5rem",
              fontSize: "1.6rem",
              fontWeight: "800",
              textAlign: "center",
              margin: 0,
            }}
          >
            📈 Growth Simulation
          </motion.h3>
          <p
            style={{
              color: "#666666",
              fontSize: "0.9rem",
              textAlign: "center",
              margin: "0.5rem 0 0 0",
              fontWeight: "500",
            }}
          >
            Network growth projections over time
          </p>
        </div>

        {/* Chart Section */}
        <div
          style={{
            padding: "1rem",
            background: "#ffffff",
            height: "450px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={simulationData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#000000"
                  strokeOpacity={0.2}
                />
                <XAxis
                  dataKey="day"
                  stroke="#000000"
                  fontSize={12}
                  fontWeight="700"
                  axisLine={{ stroke: "#000000", strokeWidth: 2 }}
                  tickLine={{ stroke: "#000000", strokeWidth: 1 }}
                />
                <YAxis 
                  stroke="#000000" 
                  fontSize={12} 
                  fontWeight="700"
                  axisLine={{ stroke: "#000000", strokeWidth: 2 }}
                  tickLine={{ stroke: "#000000", strokeWidth: 1 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "2px solid #000000",
                    borderRadius: "12px",
                    color: "#000000",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
                    fontWeight: "600",
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    color: "#000000",
                    fontWeight: "600"
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="conservative"
                  stroke="#10b981"
                  strokeWidth={4}
                  name="Conservative (20%)"
                  dot={{ fill: "#10b981", r: 5, stroke: "#000000", strokeWidth: 1 }}
                  activeDot={{
                    r: 8,
                    fill: "#10b981",
                    stroke: "#000000",
                    strokeWidth: 2,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="moderate"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  name="Moderate (35%)"
                  dot={{ fill: "#3b82f6", r: 5, stroke: "#000000", strokeWidth: 1 }}
                  activeDot={{
                    r: 8,
                    fill: "#3b82f6",
                    stroke: "#000000",
                    strokeWidth: 2,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="aggressive"
                  stroke="#ef4444"
                  strokeWidth={4}
                  name="Aggressive (50%)"
                  dot={{ fill: "#ef4444", r: 5, stroke: "#000000", strokeWidth: 1 }}
                  activeDot={{
                    r: 8,
                    fill: "#ef4444",
                    stroke: "#000000",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </motion.div>

      {/* Simulation Controls - White with Black Border */}
      <motion.div
        initial={{ opacity: 0, x: 30, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        whileHover={{ 
          scale: 1.02, 
          y: -5,
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
        }}
        style={{
          background: "#ffffff",
          borderRadius: "25px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
          border: "3px solid #000000",
          overflow: "hidden",
          position: "relative"
        }}
      >
        {/* Header Section */}
        <div
          style={{
            padding: "2rem 2rem 1rem 2rem",
            borderBottom: "2px solid #000000",
            background: "#ffffff",
          }}
        >
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            style={{
              color: "#000000",
              marginBottom: "0",
              fontSize: "1.5rem",
              fontWeight: "800",
              textAlign: "center",
            }}
          >
            🎮 Simulation Controls
          </motion.h3>
        </div>

        {/* Controls Section */}
        <div
          style={{
            padding: "2rem",
            background: "#ffffff",
          }}
        >
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {[
              {
                label: "Growth Rate",
                value: "35%",
                desc: "Current simulation rate",
                icon: "📊",
                color: "#3b82f6"
              },
              {
                label: "Time Horizon",
                value: "30 days",
                desc: "Projection period",
                icon: "⏰",
                color: "#10b981"
              },
              {
                label: "Expected Users",
                value: simulationData[simulationData.length - 1]?.moderate || 1074,
                desc: "Projected total",
                icon: "👥",
                color: "#f59e0b"
              },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                style={{
                  background: "#ffffff",
                  padding: "1.5rem",
                  borderRadius: "15px",
                  border: "2px solid #000000",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Animated border glow */}
                <motion.div
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.3,
                  }}
                  style={{
                    position: "absolute",
                    top: "-2px",
                    left: "-2px",
                    right: "-2px",
                    bottom: "-2px",
                    background: `linear-gradient(45deg, ${item.color}, transparent, ${item.color})`,
                    borderRadius: "17px",
                    zIndex: -1,
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <motion.span 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.5,
                    }}
                    style={{ fontSize: "1.5rem" }}
                  >
                    {item.icon}
                  </motion.span>
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      color: ["#000000", item.color, "#000000"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                    style={{
                      fontWeight: "800",
                      fontSize: "1.3rem",
                    }}
                  >
                    {typeof item.value === "number"
                      ? item.value.toLocaleString()
                      : item.value}
                  </motion.div>
                </div>
                <div
                  style={{
                    color: "#000000",
                    fontSize: "0.9rem",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "0.25rem",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    color: "#666666",
                    fontSize: "0.8rem",
                    fontWeight: "500",
                  }}
                >
                  {item.desc}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scenario Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            style={{
              marginTop: "2rem",
              background: "#ffffff",
              padding: "1.5rem",
              borderRadius: "15px",
              border: "2px solid #000000",
              boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
            }}
          >
            <h4
              style={{
                color: "#000000",
                fontSize: "1.1rem",
                fontWeight: "800",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              🎯 Scenario Analysis
            </h4>
            <div style={{ display: "grid", gap: "0.8rem" }}>
              {[
                { scenario: "Best Case", growth: "+127%", color: "#10b981" },
                { scenario: "Realistic", growth: "+89%", color: "#3b82f6" },
                { scenario: "Conservative", growth: "+45%", color: "#ef4444" },
              ].map((item, index) => (
                <motion.div
                  key={item.scenario}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.75rem",
                    borderRadius: "10px",
                    border: `1px solid ${item.color}`,
                    background: `${item.color}10`,
                  }}
                >
                  <span
                    style={{
                      color: "#000000",
                      fontWeight: "700",
                    }}
                  >
                    {item.scenario}
                  </span>
                  <motion.span
                    animate={{
                      scale: [1, 1.1, 1],
                      color: [item.color, "#000000", item.color],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.3,
                    }}
                    style={{
                      fontWeight: "800",
                      fontSize: "1rem",
                    }}
                  >
                    {item.growth}
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );

  // Optimization Tab
  const renderOptimization = () => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
      {/* Strategy Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "2rem",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <h3
          style={{
            background: "linear-gradient(45deg, #ffffff, #f0f0f0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "2rem",
            fontSize: "1.4rem",
            fontWeight: "700",
            letterSpacing: "-0.5px",
            textAlign: "center",
          }}
        >
          🎯 Optimization Strategies
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {[
            {
              title: "Target High-Value Users",
              description:
                "Focus on users with the highest referral potential and conversion rates",
              score: "92%",
              gradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
              icon: "🎯",
            },
            {
              title: "Improve Conversion Rate",
              description:
                "Optimize the referral process to increase success and engagement rates",
              score: "87%",
              gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
              icon: "📈",
            },
            {
              title: "Expand Network Reach",
              description:
                "Identify and connect isolated user clusters to maximize network effect",
              score: "81%",
              gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
              icon: "🌐",
            },
            {
              title: "Incentive Optimization",
              description:
                "Adjust rewards and motivations to maximize user participation",
              score: "76%",
              gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              icon: "💎",
            },
          ].map((strategy, index) => (
            <motion.div
              key={strategy.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{
                scale: 1.05,
                rotateY: 5,
                rotateX: 5,
              }}
              style={{
                background: strategy.gradient,
                padding: "2rem",
                borderRadius: "16px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                position: "relative",
                backdropFilter: "blur(10px)",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  background: "rgba(255, 255, 255, 0.3)",
                  color: "#4a5568",
                  padding: "0.5rem 1rem",
                  borderRadius: "25px",
                  fontSize: "0.85rem",
                  fontWeight: "800",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                }}
              >
                {strategy.score}
              </motion.div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ fontSize: "2rem" }}>{strategy.icon}</div>
                <h4
                  style={{
                    color: "#4a5568",
                    fontWeight: "700",
                    fontSize: "1.1rem",
                    margin: 0,
                    textShadow: "0 1px 2px rgba(255, 255, 255, 0.5)",
                  }}
                >
                  {strategy.title}
                </h4>
              </div>

              <p
                style={{
                  color: "#5a5a5a",
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                  margin: 0,
                  fontWeight: "500",
                  textShadow: "0 1px 1px rgba(255, 255, 255, 0.3)",
                }}
              >
                {strategy.description}
              </p>

              {/* Progress Bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: strategy.score }}
                transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
                style={{
                  marginTop: "1rem",
                  height: "4px",
                  background: "rgba(74, 85, 104, 0.3)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: strategy.score,
                    background: "linear-gradient(90deg, #4a5568, #2d3748)",
                    borderRadius: "2px",
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Results Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          padding: "2rem",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(240, 147, 251, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <h3
          style={{
            background: "linear-gradient(45deg, #ffffff, #f0f0f0)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "2rem",
            fontSize: "1.4rem",
            fontWeight: "700",
            letterSpacing: "-0.5px",
            textAlign: "center",
          }}
        >
          📊 Optimization Results
        </h3>

        <motion.div
          style={{
            height: "350px",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            borderRadius: "15px",
            padding: "1rem",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { metric: "Conversion Rate", before: 45, after: 67 },
                { metric: "Network Reach", before: 78, after: 89 },
                { metric: "User Engagement", before: 56, after: 73 },
                { metric: "Referral Success", before: 62, after: 81 },
              ]}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.3)"
              />
              <XAxis
                dataKey="metric"
                stroke="#ffffff"
                fontSize={12}
                fontWeight="600"
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#ffffff" fontSize={12} fontWeight="600" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(240, 147, 251, 0.3)",
                  borderRadius: "12px",
                  color: "#4a5568",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend
                wrapperStyle={{
                  color: "#ffffff",
                  fontWeight: "600",
                }}
              />
              <Bar
                dataKey="before"
                fill="rgba(255, 255, 255, 0.4)"
                name="Before Optimization"
                radius={[6, 6, 0, 0]}
                animationDuration={1500}
              />
              <Bar
                dataKey="after"
                fill="#ffffff"
                name="After Optimization"
                radius={[6, 6, 0, 0]}
                animationDuration={2000}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{
            marginTop: "2rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            { label: "Overall Improvement", value: "+28%", icon: "🚀" },
            { label: "ROI Increase", value: "+156%", icon: "💰" },
            { label: "User Satisfaction", value: "+34%", icon: "😊" },
            { label: "Network Health", value: "+42%", icon: "💪" },
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                padding: "1rem",
                borderRadius: "12px",
                textAlign: "center",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                {metric.icon}
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "800",
                  color: "#ffffff",
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  marginBottom: "0.25rem",
                }}
              >
                {metric.value}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255, 255, 255, 0.8)",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {metric.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        width: "100vw",
        overflow: "auto",
        position: "relative",
      }}
    >
      {/* Animated Background Elements */}
      <motion.div
        animate={{
          opacity: [0.02, 0.05, 0.02],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `
            radial-gradient(circle at ${20 + scrollY * 0.01}% ${30 + scrollY * 0.02}%, rgba(59, 130, 246, 0.03) 0%, transparent 60%),
            radial-gradient(circle at ${80 - scrollY * 0.01}% ${70 - scrollY * 0.02}%, rgba(16, 185, 129, 0.03) 0%, transparent 60%)
          `,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Scroll Progress Indicator */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "4px",
          backgroundColor: "#3b82f6",
          zIndex: 1000,
          originX: 0,
        }}
        initial={{ scaleX: 0 }}
        animate={{ 
          scaleX: Math.min(scrollY / 1000, 1),
          width: "100%"
        }}
        transition={{ duration: 0.1 }}
      />
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{
          x: !sidebarVisible ? -250 : sidebarOpen ? 0 : -200,
          opacity: sidebarVisible ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          width: sidebarOpen ? "250px" : "50px",
          backgroundColor: "#000000",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          zIndex: 1000,
          overflow: "hidden",
          transition: "width 0.3s ease",
          display: sidebarVisible ? "block" : "none",
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid #333",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {sidebarOpen && (
            <h2
              style={{
                color: "#ffffff",
                fontSize: "1.2rem",
                fontWeight: "600",
                margin: 0,
              }}
            >
              Referral Network
            </h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none",
              border: "none",
              color: "#ffffff",
              cursor: "pointer",
              padding: "0.5rem",
            }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: "1rem 0" }}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ backgroundColor: "#333" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  backgroundColor: isActive ? "#333" : "transparent",
                  border: "none",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  borderLeft: isActive
                    ? "3px solid #ffffff"
                    : "3px solid transparent",
                }}
              >
                <Icon size={20} />
                {sidebarOpen && (
                  <span style={{ marginLeft: "0.75rem", fontSize: "0.9rem" }}>
                    {item.label}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: !sidebarVisible ? "0" : sidebarOpen ? "250px" : "50px",
          flex: 1,
          transition: "margin-left 0.3s ease",
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          width: !sidebarVisible
            ? "100vw"
            : `calc(100vw - ${sidebarOpen ? "250px" : "50px"})`,
        }}
      >
        {/* Header */}
        <div
          className="dashboard-header"
          style={{
            background:
              "linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%)",
            backgroundSize: "200% 200%",
            animation: "gradient-shift 10s ease infinite",
            padding: "2rem 2rem",
            borderBottom: "1px solid #e5e7eb",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated background elements */}
          <div
            style={{
              position: "absolute",
              top: "-50%",
              right: "-50%",
              width: "200%",
              height: "200%",
              background:
                "radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 50%)",
              animation: "pulse 4s ease-in-out infinite",
            }}
          />

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: "2.5rem",
              fontWeight: "800",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: 0,
              textTransform: "capitalize",
              position: "relative",
              zIndex: 1,
            }}
          >
            {navigationItems.find((item) => item.id === activeTab)?.label ||
              "Dashboard"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              margin: "0.5rem 0 0 0",
              fontSize: "1.1rem",
              fontWeight: "500",
              position: "relative",
              zIndex: 1,
            }}
          >
            Analyze and optimize your referral network performance with advanced
            analytics
          </motion.p>

          {/* Dashboard Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{
              position: "absolute",
              top: "2rem",
              right: "2rem",
              display: "flex",
              gap: "1rem",
              zIndex: 10,
              className: "sidebar-controls",
            }}
          >
            {/* Sidebar Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                borderRadius: "12px",
                padding: "0.8rem 1.2rem",
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                backdropFilter: "blur(10px)",
                display: sidebarVisible ? "block" : "none",
              }}
              title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {sidebarOpen ? "← Collapse" : "→ Expand"}
            </motion.button>

            {/* Full Screen Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarVisible(!sidebarVisible)}
              style={{
                background: sidebarVisible
                  ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                  : "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                border: "none",
                borderRadius: "12px",
                padding: "0.8rem 1.2rem",
                color: "#ffffff",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: sidebarVisible
                  ? "0 4px 15px rgba(240, 147, 251, 0.3)"
                  : "0 4px 15px rgba(67, 233, 123, 0.3)",
                backdropFilter: "blur(10px)",
              }}
              title={sidebarVisible ? "Full Screen Mode" : "Show Sidebar"}
            >
              {sidebarVisible ? "⛶ Full Screen" : "☰ Show Menu"}
            </motion.button>

            {/* View Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
                border: "none",
                borderRadius: "12px",
                padding: "0.8rem 1.2rem",
                color: "#8B4513",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(255, 236, 210, 0.3)",
                backdropFilter: "blur(10px)",
              }}
              title="Adjust Layout"
            >
              ⚙ Layout
            </motion.button>
          </motion.div>

          {/* Enhanced floating gradient orbs with CSS animations */}
          <motion.div
            style={{
              position: "absolute",
              top: "15%",
              right: "8%",
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              borderRadius: "50%",
              opacity: 0.15,
              zIndex: 0,
              animation:
                "float 8s ease-in-out infinite, pulse-glow 4s ease-in-out infinite alternate",
            }}
          />
          <motion.div
            style={{
              position: "absolute",
              bottom: "15%",
              right: "3%",
              width: "60px",
              height: "60px",
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              borderRadius: "50%",
              opacity: 0.12,
              zIndex: 0,
              animation:
                "float 10s ease-in-out infinite reverse, pulse-glow 5s ease-in-out infinite alternate-reverse",
              animationDelay: "2s",
            }}
          />
          <motion.div
            style={{
              position: "absolute",
              top: "50%",
              right: "15%",
              width: "45px",
              height: "45px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "50%",
              opacity: 0.1,
              zIndex: 0,
              animation:
                "float 12s ease-in-out infinite, pulse-glow 6s ease-in-out infinite",
              animationDelay: "4s",
            }}
          />
          <motion.div
            style={{
              position: "absolute",
              top: "30%",
              left: "3%",
              width: "70px",
              height: "70px",
              background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
              borderRadius: "50%",
              opacity: 0.08,
              zIndex: 0,
              animation:
                "float 9s ease-in-out infinite reverse, pulse-glow 3.5s ease-in-out infinite",
              animationDelay: "1s",
            }}
          />
          <motion.div
            style={{
              position: "absolute",
              bottom: "25%",
              left: "8%",
              width: "55px",
              height: "55px",
              background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
              borderRadius: "50%",
              opacity: 0.1,
              zIndex: 0,
              animation:
                "float 11s ease-in-out infinite, pulse-glow 4.5s ease-in-out infinite alternate",
              animationDelay: "3s",
            }}
          />
        </div>

        {/* Floating Control Panel (when sidebar is hidden) */}
        {!sidebarVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: "50%",
              left: "20px",
              transform: "translateY(-50%)",
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.9) 100%)",
              borderRadius: "20px",
              padding: "1rem",
              zIndex: 1001,
              backdropFilter: "blur(15px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {/* Navigation in floating panel */}
            {navigationItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(item.id)}
                style={{
                  background:
                    activeTab === item.id
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "transparent",
                  border: "none",
                  borderRadius: "12px",
                  padding: "0.8rem",
                  color: "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s ease",
                  width: "50px",
                  height: "50px",
                }}
                title={item.label}
              >
                <item.icon size={20} />
              </motion.button>
            ))}

            {/* Show Sidebar Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarVisible(true)}
              style={{
                background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                border: "none",
                borderRadius: "12px",
                padding: "0.8rem",
                color: "#ffffff",
                cursor: "pointer",
                marginTop: "0.5rem",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Show Sidebar"
            >
              ☰
            </motion.button>
          </motion.div>
        )}

        {/* Content Area with Scroll Effects */}
        <motion.div 
          style={{ 
            padding: "2rem", 
            width: "100%", 
            maxWidth: "100%",
            transform: `translateY(${parallaxOffset}px)`,
          }}
          animate={{
            backgroundPosition: [`0% ${50 + scrollY * 0.05}%`, `100% ${50 + scrollY * 0.05}%`],
          }}
          transition={{ duration: 0 }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "500px",
                flexDirection: "column",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "20px",
                margin: "2rem",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              }}
            >
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                  scale: { duration: 2, repeat: Infinity },
                }}
                style={{
                  width: "60px",
                  height: "60px",
                  border: "4px solid rgba(255,255,255,0.3)",
                  borderTop: "4px solid #ffffff",
                  borderRadius: "50%",
                  marginBottom: "2rem",
                }}
              />
              <motion.p
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  color: "#ffffff",
                  fontSize: "1.3rem",
                  fontWeight: "600",
                  textAlign: "center",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Initializing Network Analytics...
              </motion.p>
              <motion.div
                animate={{ width: ["0%", "100%", "0%"] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  height: "4px",
                  background: "rgba(255,255,255,0.5)",
                  borderRadius: "2px",
                  marginTop: "1rem",
                  width: "200px",
                }}
              />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>

      {/* Floating Dock */}
      <FloatingDock
        items={[
          {
            title: "Dashboard",
            icon: <HomeIcon />,
            onClick: () => setActiveTab("overview"),
          },
          {
            title: "Network Graph",
            icon: <NetworkIcon />,
            onClick: () => setActiveTab("structure"),
          },
          {
            title: "Analytics",
            icon: <ChartIcon />,
            onClick: () => setActiveTab("bfs"),
          },
          {
            title: "Influencers",
            icon: <UserGroupIcon />,
            onClick: () => setActiveTab("influencers"),
          },
          {
            title: "Growth Simulation",
            icon: <GraphIcon />,
            onClick: () => setActiveTab("simulation"),
          },
          {
            title: "Toggle Sidebar",
            icon: <SidebarIcon />,
            onClick: () => setSidebarVisible(!sidebarVisible),
          },
          {
            title: sidebarOpen ? "Collapse" : "Expand",
            icon: sidebarOpen ? <CollapseIcon /> : <ExpandIcon />,
            onClick: () => setSidebarOpen(!sidebarOpen),
          },
        ]}
        desktopClassName="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        mobileClassName="fixed bottom-8 right-8 z-50"
      />
    </div>
  );
};

export default ReferralNetworkDashboard;
