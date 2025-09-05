import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  TrendingUp,
  Network,
  Award,
  BarChart3,
  Target,
  Activity,
  Zap,
  DollarSign,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import ReferralNetwork from "../utils/ReferralNetwork";
import "./Dashboard.css";

const Dashboard = () => {
  const [network] = useState(() => new ReferralNetwork());
  const [stats, setStats] = useState(null);
  const [simulationData, setSimulationData] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [animatedStats, setAnimatedStats] = useState({
    totalUsers: 0,
    totalReferrals: 0,
    avgReferrals: 0,
  });

  // Sample adoption probability function for bonus optimization
  const adoptionProb = (bonus) => {
    return Math.min(0.9, 0.1 + (bonus / 1000) * 0.8);
  };

  // Initialize sample data
  useEffect(() => {
    const initializeData = () => {
      try {
        // Add sample users and referrals to create a meaningful network
        const users = Array.from({ length: 50 }, (_, i) => `user_${i + 1}`);

        // Create referral chains
        for (let i = 0; i < users.length - 1; i++) {
          try {
            if (Math.random() > 0.3) {
              // 70% chance of referral
              const referrer =
                users[Math.floor(Math.random() * Math.min(i + 1, 10))];
              network.addReferral(referrer, users[i + 1]);
            }
          } catch (error) {
            // Skip if would create cycle or duplicate
            continue;
          }
        }

        // Add some additional random referrals
        for (let i = 0; i < 30; i++) {
          try {
            const referrer = users[Math.floor(Math.random() * users.length)];
            const candidate = `new_user_${i + 1}`;
            network.addReferral(referrer, candidate);
          } catch (error) {
            continue;
          }
        }

        const networkStats = network.getNetworkStats();
        setStats(networkStats);

        // Generate simulation data
        const simData = network.simulate(0.3, 30).map((value, index) => ({
          day: index + 1,
          referrals: value,
          growth:
            index > 0 ? value - network.simulate(0.3, 30)[index - 1] : value,
        }));
        setSimulationData(simData);

        setLoading(false);
      } catch (error) {
        console.error("Error initializing data:", error);
        setLoading(false);
      }
    };

    initializeData();
  }, [network]);

  // Animate stats counters
  useEffect(() => {
    if (!stats) return;

    const animateValue = (key, target) => {
      const duration = 2000;
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
            key === "avgReferrals" ? current.toFixed(1) : Math.floor(current),
        }));
      }, duration / steps);
    };

    animateValue("totalUsers", stats.totalUsers);
    animateValue("totalReferrals", stats.totalReferrals);
    animateValue("avgReferrals", stats.avgReferralsPerUser);
  }, [stats]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const StatCard = ({ icon: Icon, title, value, change, color, delay }) => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={`stat-card ${color}`}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(0,0,0,0.1)" }}
    >
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <motion.div
          className="stat-value"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.2, type: "spring", stiffness: 200 }}
        >
          {value}
        </motion.div>
        {change && (
          <div
            className={`stat-change ${change > 0 ? "positive" : "negative"}`}
          >
            <TrendingUp size={16} />
            {change > 0 ? "+" : ""}
            {change}%
          </div>
        )}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Activity size={48} />
        </motion.div>
        <p>Initializing Referral Network...</p>
      </div>
    );
  }

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe"];

  return (
    <motion.div
      className="dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header className="dashboard-header" variants={itemVariants}>
        <h1>
          <Network className="header-icon" />
          Referral Network Analytics
        </h1>
        <p>Advanced insights into your referral ecosystem</p>
      </motion.header>

      <div className="tab-navigation">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "influencers", label: "Influencers", icon: Award },
          { id: "simulation", label: "Simulation", icon: Activity },
          { id: "optimization", label: "Optimization", icon: Target },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <tab.icon size={20} />
            {tab.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="tab-content"
          >
            <div className="stats-grid">
              <StatCard
                icon={Users}
                title="Total Users"
                value={animatedStats.totalUsers}
                change={12}
                color="blue"
                delay={0}
              />
              <StatCard
                icon={Network}
                title="Total Referrals"
                value={animatedStats.totalReferrals}
                change={8}
                color="green"
                delay={0.1}
              />
              <StatCard
                icon={TrendingUp}
                title="Avg Referrals/User"
                value={animatedStats.avgReferrals}
                change={5}
                color="orange"
                delay={0.2}
              />
              <StatCard
                icon={Zap}
                title="Network Density"
                value={
                  (
                    (stats?.totalReferrals / (stats?.totalUsers || 1)) *
                    100
                  ).toFixed(1) + "%"
                }
                change={15}
                color="purple"
                delay={0.3}
              />
            </div>

            <div className="charts-grid">
              <motion.div
                className="chart-container"
                variants={itemVariants}
                transition={{ delay: 0.4 }}
              >
                <h3>Top Referrers by Reach</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats?.topReferrers || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="userId" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalReferrals" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                className="chart-container"
                variants={itemVariants}
                transition={{ delay: 0.5 }}
              >
                <h3>Network Growth Simulation</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={simulationData.slice(0, 20)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="referrals"
                      stroke="#8884d8"
                      strokeWidth={3}
                      dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeTab === "influencers" && (
          <motion.div
            key="influencers"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="tab-content"
          >
            <div className="influencers-grid">
              <motion.div
                className="influencer-section"
                variants={itemVariants}
              >
                <h3>
                  <Award className="section-icon" />
                  Unique Reach Influencers
                </h3>
                <div className="influencer-list">
                  {stats?.uniqueInfluencers?.map((influencer, index) => (
                    <motion.div
                      key={influencer.userId}
                      className="influencer-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="influencer-rank">#{index + 1}</div>
                      <div className="influencer-info">
                        <h4>{influencer.userId}</h4>
                        <p>Unique Reach: {influencer.uniqueReach}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="influencer-section"
                variants={itemVariants}
                transition={{ delay: 0.2 }}
              >
                <h3>
                  <Network className="section-icon" />
                  Flow Centrality Leaders
                </h3>
                <div className="influencer-list">
                  {stats?.flowInfluencers?.map((influencer, index) => (
                    <motion.div
                      key={influencer.userId}
                      className="influencer-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="influencer-rank">#{index + 1}</div>
                      <div className="influencer-info">
                        <h4>{influencer.userId}</h4>
                        <p>Centrality Score: {influencer.centralityScore}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              className="chart-container"
              variants={itemVariants}
              transition={{ delay: 0.4 }}
            >
              <h3>Influence Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats?.topReferrers?.slice(0, 5) || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ userId, totalReferrals }) =>
                      `${userId}: ${totalReferrals}`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="totalReferrals"
                  >
                    {stats?.topReferrers?.slice(0, 5).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.div>
        )}

        {activeTab === "simulation" && (
          <motion.div
            key="simulation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="tab-content"
          >
            <motion.div className="simulation-controls" variants={itemVariants}>
              <h3>Network Growth Simulation</h3>
              <p>
                Modeling referral network expansion over 30 days with 30% daily
                probability
              </p>
            </motion.div>

            <div className="simulation-stats">
              <StatCard
                icon={Calendar}
                title="Simulation Days"
                value="30"
                color="blue"
                delay={0}
              />
              <StatCard
                icon={Activity}
                title="Daily Probability"
                value="30%"
                color="green"
                delay={0.1}
              />
              <StatCard
                icon={Users}
                title="Initial Referrers"
                value="100"
                color="orange"
                delay={0.2}
              />
              <StatCard
                icon={Target}
                title="Max Referrals/User"
                value="10"
                color="purple"
                delay={0.3}
              />
            </div>

            <motion.div
              className="chart-container full-width"
              variants={itemVariants}
              transition={{ delay: 0.4 }}
            >
              <h3>Cumulative Referral Growth</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={simulationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      name === "referrals" ? "Total Referrals" : "Daily Growth",
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="referrals"
                    stroke="#8884d8"
                    strokeWidth={3}
                    name="Total Referrals"
                    dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="growth"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Daily Growth"
                    dot={{ fill: "#82ca9d", strokeWidth: 1, r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.div>
        )}

        {activeTab === "optimization" && (
          <motion.div
            key="optimization"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="tab-content"
          >
            <motion.div className="optimization-header" variants={itemVariants}>
              <h3>
                <DollarSign className="section-icon" />
                Referral Bonus Optimization
              </h3>
              <p>
                Finding the optimal bonus structure to achieve hiring targets
              </p>
            </motion.div>

            <div className="optimization-scenarios">
              {[
                {
                  target: 500,
                  days: 30,
                  result: network.minBonusForTarget(30, 500, adoptionProb),
                },
                {
                  target: 1000,
                  days: 45,
                  result: network.minBonusForTarget(45, 1000, adoptionProb),
                },
                {
                  target: 2000,
                  days: 60,
                  result: network.minBonusForTarget(60, 2000, adoptionProb),
                },
              ].map((scenario, index) => (
                <motion.div
                  key={index}
                  className="scenario-card"
                  variants={itemVariants}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h4>Scenario {index + 1}</h4>
                  <div className="scenario-details">
                    <div className="detail-item">
                      <Target size={16} />
                      <span>Target: {scenario.target} hires</span>
                    </div>
                    <div className="detail-item">
                      <Calendar size={16} />
                      <span>Timeline: {scenario.days} days</span>
                    </div>
                    <div className="detail-item">
                      <DollarSign size={16} />
                      <span>
                        Min Bonus:{" "}
                        {scenario.result
                          ? `$${scenario.result}`
                          : "Unachievable"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="chart-container"
              variants={itemVariants}
              transition={{ delay: 0.3 }}
            >
              <h3>Bonus vs Adoption Probability</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={Array.from({ length: 11 }, (_, i) => ({
                    bonus: i * 100,
                    probability: (adoptionProb(i * 100) * 100).toFixed(1),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bonus" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Adoption Probability"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="probability"
                    stroke="#ff7300"
                    strokeWidth={3}
                    dot={{ fill: "#ff7300", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
