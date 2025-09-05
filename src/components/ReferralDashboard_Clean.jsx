import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  Users, Network, TrendingUp, Target, Award, 
  Activity, BarChart3, Shield, Settings, Info, Database, GitBranch,
  Menu, X
} from 'lucide-react';
import ReferralNetwork from '../utils/ReferralNetwork';

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
`;

const ReferralDashboard = () => {
  const [network] = useState(() => new ReferralNetwork());
  const [stats, setStats] = useState(null);
  const [simulationData, setSimulationData] = useState([]);
  const [activeTab, setActiveTab] = useState('graph-structure');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [animatedStats, setAnimatedStats] = useState({
    totalUsers: 0,
    totalReferrals: 0,
    avgReferrals: 0,
    networkDensity: 0
  });



  //  navigation Bar 
  const navigationItems = [
    { id: 'graph-structure', label: 'Graph Structure', icon: GitBranch },
    { id: 'network-reach', label: 'Network Reach', icon: Network },
    { id: 'influencers', label: 'Influencers', icon: Users },
    { id: 'simulation', label: 'Simulation', icon: Activity },
    { id: 'optimization', label: 'Optimization', icon: Target }
  ];





  useEffect(() => {
    // Inject CSS animations
    const styleElement = document.createElement('style');
    styleElement.textContent = animationStyles;
    document.head.appendChild(styleElement);
    
    const initializeNetwork = async () => {
      try {
        const users = Array.from({ length: 100 }, (_, i) => `user_${String(i + 1).padStart(3, '0')}`);
        
        // Build hierarchical referral structure
        for (let i = 0; i < 20; i++) {
          const rootUser = users[i];
          for (let j = 0; j < Math.floor(Math.random() * 4) + 1; j++) {
            const candidateIndex = 20 + (i * 4) + j;
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
          aggressive: network.simulate(0.5, 30)
        };

        const simulationChartData = simulations.conservative.map((conservative, index) => ({
          day: index + 1,
          conservative: conservative,
          moderate: simulations.moderate[index] || 0,
          aggressive: simulations.aggressive[index] || 0,
          growth: index > 0 ? conservative - simulations.conservative[index - 1] : conservative
        }));

        setSimulationData(simulationChartData);
        setLoading(false);
      } catch (error) {
        console.error('Error initializing network:', error);
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
          
          setAnimatedStats(prev => ({
            ...prev,
            [key]: key === 'avgReferrals' || key === 'networkDensity' 
              ? parseFloat(current.toFixed(1)) 
              : Math.floor(current)
          }));
        }, duration / steps);
      }, delay);
    };

    // Staggered animations for better visual effect
    animateValue('totalUsers', stats.totalUsers, 0);
    animateValue('totalReferrals', stats.totalReferrals, 300);
    animateValue('avgReferrals', stats.avgReferralsPerUser, 600);
    animateValue('networkDensity', (stats.totalReferrals / (stats.totalUsers || 1)) * 10, 900);
  }, [stats]);

  const COLORS = ['#000000', '#333333', '#666666', '#999999', '#cccccc'];
  const GRADIENT_COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
  const CHART_COLORS = {
    primary: '#1a1a1a',
    secondary: '#4a5568',
    accent: '#667eea',
    success: '#48bb78',
    warning: '#ed8936',
    error: '#f56565',
    gradient1: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    gradient2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    gradient3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    gradient4: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    gradient5: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'graph-structure':
        return renderGraphStructure();
      case 'network-reach':
        return renderNetworkReach();
      case 'influencers':
        return renderInfluencers();
      case 'simulation':
        return renderSimulation();
      case 'optimization':
        return renderOptimization();
      default:
        return renderGraphStructure();
    }
  };

  // Graph Structure Tab
  const renderGraphStructure = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.02, y: -5 }}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 8s ease infinite',
          padding: '2rem',
          borderRadius: '25px',
          boxShadow: '0 25px 50px rgba(102, 126, 234, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated background particles */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          animation: 'float 12s ease-in-out infinite',
          zIndex: 0
        }}></div>
        
        <h3 style={{ 
          color: '#ffffff', 
          marginBottom: '2rem', 
          fontSize: '1.5rem', 
          fontWeight: '700',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          background: 'linear-gradient(90deg, #fff 0%, #f0f8ff 50%, #fff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '200% 100%',
          animation: 'gradient-shift 6s ease infinite',
          position: 'relative',
          zIndex: 1
        }}>
          📊 Network Statistics
        </h3>
        <div style={{ display: 'grid', gap: '1rem', position: 'relative', zIndex: 1 }}>
          {[
            { label: 'Total Users', value: animatedStats.totalUsers, icon: '👥', gradient: 'linear-gradient(90deg, #ff9a9e 0%, #fecfef 50%, #ff9a9e 100%)', bgGradient: 'linear-gradient(135deg, rgba(255,154,158,0.2) 0%, rgba(254,207,239,0.2) 100%)' },
            { label: 'Total Referrals', value: animatedStats.totalReferrals, icon: '🔗', gradient: 'linear-gradient(90deg, #a8edea 0%, #fed6e3 50%, #a8edea 100%)', bgGradient: 'linear-gradient(135deg, rgba(168,237,234,0.2) 0%, rgba(254,214,227,0.2) 100%)' },
            { label: 'Average Referrals', value: animatedStats.avgReferrals, icon: '📈', gradient: 'linear-gradient(90deg, #ffecd2 0%, #fcb69f 50%, #ffecd2 100%)', bgGradient: 'linear-gradient(135deg, rgba(255,236,210,0.2) 0%, rgba(252,182,159,0.2) 100%)' },
            { label: 'Network Density', value: `${animatedStats.networkDensity}%`, icon: '🌐', gradient: 'linear-gradient(90deg, #a8edea 0%, #fed6e3 50%, #a8edea 100%)', bgGradient: 'linear-gradient(135deg, rgba(168,237,234,0.2) 0%, rgba(254,214,227,0.2) 100%)' }
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '1.5rem', 
                background: stat.bgGradient, 
                borderRadius: '18px',
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden'
              }}
              whileHover={{ 
                scale: 1.03, 
                background: 'rgba(255,255,255,0.3)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                y: -2
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Card shine effect */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                animation: `shine ${3 + index}s ease-in-out infinite`,
                animationDelay: `${index * 0.5}s`
              }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 1 }}>
                <motion.span 
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  style={{ fontSize: '1.8rem' }}
                >
                  {stat.icon}
                </motion.span>
                <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '1.1rem', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>{stat.label}</span>
              </div>
              <motion.span 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                style={{ 
                  background: stat.gradient,
                  backgroundSize: '200% 100%',
                  animation: 'gradient-shift 4s ease infinite',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: '800', 
                  fontSize: '1.8rem',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {stat.value}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        whileHover={{ scale: 1.02, y: -5 }}
        style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #f093fb 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 10s ease infinite',
          padding: '2rem',
          borderRadius: '25px',
          boxShadow: '0 25px 50px rgba(240, 147, 251, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'radial-gradient(circle at 30% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          animation: 'float 15s ease-in-out infinite reverse',
          zIndex: 0
        }}></div>
        <h3 style={{ 
          color: '#ffffff', 
          marginBottom: '2rem', 
          fontSize: '1.5rem', 
          fontWeight: '700',
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          background: 'linear-gradient(90deg, #fff 0%, #f0f8ff 50%, #fff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundSize: '200% 100%',
          animation: 'gradient-shift 6s ease infinite',
          position: 'relative',
          zIndex: 1
        }}>
          🏆 Top Referrers
        </h3>
        <div style={{ 
          height: '350px', 
          background: 'rgba(255,255,255,0.2)', 
          borderRadius: '18px', 
          padding: '1rem', 
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255,255,255,0.3)',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats ? stats.topReferrers.slice(0, 5).map(user => ({ 
              user: user.userId.slice(-6), 
              referrals: user.referralCount 
            })) : []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
              <XAxis 
                dataKey="user" 
                stroke="#ffffff" 
                fontSize={12}
                fontWeight="600"
              />
              <YAxis 
                stroke="#ffffff" 
                fontSize={12}
                fontWeight="600"
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#ffffff',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                }}
              />
              <Bar 
                dataKey="referrals" 
                fill="url(#colorGradient)" 
                radius={[8, 8, 0, 0]}
              >
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );


  const renderNetworkReach = () => {
    // Get network reach data
    const reachData = Array.from(network.users).map(userId => ({
      userId,
      directReferrals: network.getDirectReferrals(userId).length,
      totalReach: network.getTotalReferralCount(userId),
      reachExpansion: network.getTotalReferralCount(userId) - network.getDirectReferrals(userId).length
    })).filter(user => user.totalReach > 0).sort((a, b) => b.totalReach - a.totalReach);

    const topReferrersByReach = network.getTopReferrersByReach(10);

    return (
      <div style={{ width: '100%' }}>
        {/* Full width header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradient-shift 12s ease infinite',
            padding: '2rem',
            borderRadius: '25px',
            boxShadow: '0 25px 50px rgba(102, 126, 234, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background particles */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            animation: 'float 20s ease-in-out infinite',
            zIndex: 0
          }}></div>

          <h3 style={{ 
            background: 'linear-gradient(90deg, #fff 0%, #f0f8ff 50%, #fff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 100%',
            animation: 'gradient-shift 8s ease infinite',
            marginBottom: '1rem', 
            fontSize: '2rem', 
            fontWeight: '800',
            letterSpacing: '-0.5px',
            position: 'relative',
            zIndex: 1,
            textAlign: 'center'
          }}>
            🌐 Full Network Reach Analysis (Part 2)
          </h3>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: '1.1rem',
            textAlign: 'center',
            margin: 0,
            position: 'relative',
            zIndex: 1,
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}>
            Total referral count including direct and indirect referrals using BFS traversal
          </p>
        </motion.div>

        {/* Main grid layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', width: '100%' }}>
          {/* Network Reach Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.01, y: -3 }}
            style={{
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 50%, #43e97b 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradient-shift 15s ease infinite',
              padding: '2rem',
              borderRadius: '25px',
              boxShadow: '0 25px 50px rgba(67, 233, 123, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Animated background */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)',
              animation: 'float 18s ease-in-out infinite reverse',
              zIndex: 0
            }}></div>

            <h4 style={{ 
              color: '#ffffff', 
              marginBottom: '1.5rem', 
              fontSize: '1.5rem', 
              fontWeight: '700',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              position: 'relative',
              zIndex: 1,
              background: 'linear-gradient(90deg, #fff 0%, #f0f8ff 50%, #fff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 100%',
              animation: 'gradient-shift 6s ease infinite'
            }}>
              📈 Reach vs Direct Referrals Comparison
            </h4>
            
            <div style={{ 
              height: '400px', 
              backgroundColor: 'rgba(255, 255, 255, 0.2)', 
              borderRadius: '18px', 
              padding: '1rem',
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              position: 'relative',
              zIndex: 1,
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
            }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reachData.slice(0, 12)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.4)" />
                  <XAxis 
                    dataKey="userId" 
                    stroke="#ffffff" 
                    fontSize={12}
                    tickFormatter={(value) => value.slice(-6)}
                  />
                  <YAxis stroke="#ffffff" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: '1px solid rgba(67, 233, 123, 0.3)',
                      borderRadius: '12px',
                      color: '#43e97b',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value, name) => [
                      value, 
                      name === 'directReferrals' ? 'Direct Referrals' : 'Total Reach'
                    ]}
                    labelFormatter={(userId) => `User: ${userId}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="directReferrals" 
                    fill="url(#directGradient)"
                    name="Direct Referrals"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="totalReach" 
                    fill="url(#reachGradient)"
                    name="Total Network Reach"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="directGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff6b6b" />
                      <stop offset="100%" stopColor="#ee5a52" />
                    </linearGradient>
                    <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4ecdc4" />
                      <stop offset="100%" stopColor="#44a08d" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Top Referrers by Reach */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -3 }}
            style={{
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #f093fb 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradient-shift 18s ease infinite',
              padding: '2rem',
              borderRadius: '25px',
              boxShadow: '0 25px 50px rgba(240, 147, 251, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.12) 0%, transparent 60%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.12) 0%, transparent 60%)',
              animation: 'float 22s ease-in-out infinite',
              zIndex: 0
            }}></div>

            <h4 style={{ 
              color: '#ffffff', 
              marginBottom: '1.5rem', 
              fontSize: '1.5rem', 
              fontWeight: '700',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              position: 'relative',
              zIndex: 1,
              background: 'linear-gradient(90deg, #fff 0%, #f0f8ff 50%, #fff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundSize: '200% 100%',
              animation: 'gradient-shift 7s ease infinite'
            }}>
              🏆 Top Referrers by Total Reach
            </h4>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxHeight: '400px',
              overflowY: 'auto',
              paddingRight: '0.5rem',
              position: 'relative',
              zIndex: 1
            }}>
              {topReferrersByReach.slice(0, 8).map((user, index) => (
                <motion.div 
                  key={user.userId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, x: 5 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.2rem',
                    background: index === 0 ? 
                      'linear-gradient(135deg, #ffd700, #ffed4e)' : 
                      'rgba(255, 255, 255, 0.25)',
                    borderRadius: '18px',
                    border: index === 0 ? '2px solid #ffd700' : '1px solid rgba(255, 255, 255, 0.3)',
                    backdropFilter: 'blur(15px)',
                    boxShadow: index === 0 ? '0 12px 30px rgba(255, 215, 0, 0.5)' : '0 8px 20px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Rank badge with enhanced styling */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '50%',
                        background: index === 0 ? 
                          'linear-gradient(135deg, #ff6b6b, #ee5a52)' : 
                          'linear-gradient(135deg, #4ecdc4, #44a08d)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.1rem',
                        fontWeight: '800',
                        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.3)',
                        position: 'relative',
                        zIndex: 1
                      }}
                    >
                      #{index + 1}
                    </motion.div>
                    <div>
                      <div style={{ 
                        color: index === 0 ? '#b8860b' : 'rgba(255, 255, 255, 0.95)', 
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        marginBottom: '0.2rem'
                      }}>
                        {user.userId.slice(-8)}
                      </div>
                      <div style={{ 
                        color: index === 0 ? '#b8860b' : 'rgba(255, 255, 255, 0.7)', 
                        fontSize: '0.8rem' 
                      }}>
                        Network Reach
                      </div>
                    </div>
                  </div>
                  
                  {/* Total reach count */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    style={{
                      background: index === 0 ?
                        'linear-gradient(90deg, #b8860b 0%, #daa520 50%, #b8860b 100%)' :
                        'linear-gradient(90deg, #fff 0%, #f0f8ff 50%, #fff 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundSize: '200% 100%',
                      animation: 'gradient-shift 5s ease infinite',
                      fontWeight: '800',
                      fontSize: '1.4rem',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    {user.referralCount}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* BFS Algorithm Explanation Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradient-shift 20s ease infinite',
            padding: '2rem',
            borderRadius: '25px',
            boxShadow: '0 25px 50px rgba(102, 126, 234, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginTop: '2rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 15% 85%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 85% 15%, rgba(255,255,255,0.08) 0%, transparent 50%)',
            animation: 'float 25s ease-in-out infinite reverse',
            zIndex: 0
          }}></div>
          
          <h4 style={{
            color: '#ffffff',
            fontSize: '1.3rem',
            fontWeight: '700',
            marginBottom: '1rem',
            position: 'relative',
            zIndex: 1,
            background: 'linear-gradient(90deg, #fff 0%, #f0f8ff 50%, #fff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundSize: '200% 100%',
            animation: 'gradient-shift 6s ease infinite'
          }}>
            🧠 BFS Algorithm Implementation
          </h4>
          <p style={{
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: '1.6',
            fontSize: '1rem',
            margin: 0,
            position: 'relative',
            zIndex: 1,
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}>
            <strong>Total Referral Count:</strong> Uses Breadth-First Search (BFS) to traverse the entire referral tree and count all direct and indirect referrals. 
            The algorithm starts from a user and explores all connected nodes level by level, ensuring we capture the complete downstream network reach.
            <br /><br />
            <strong>Top Referrers by Reach:</strong> Ranks users based on their total referral count (direct + indirect). 
            Choose k based on your analysis needs: k=5-10 for executive summaries, k=20-50 for detailed analysis.
          </p>
        </motion.div>
      </div>
    );
  };

  // Influencers Tab
  const renderInfluencers = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      {/* Pie Chart Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <h3 style={{ 
          background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: '1.5rem', 
          fontSize: '1.4rem', 
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}>
          🌟 Top Influencers
        </h3>
        <motion.div 
          style={{ height: '400px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '15px', padding: '1rem' }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats?.topReferrers?.slice(0, 5).map((user, index) => ({ 
                  name: user.userId.slice(-6), 
                  value: user.referralCount,
                  fill: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff8a80', '#81c784'][index % 5]
                })) || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#000000"
                dataKey="value"
                animationDuration={1500}
              >
                {stats?.topReferrers?.slice(0, 5).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff8a80', '#81c784'][index % 5]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  borderRadius: '10px',
                  color: '#667eea',
                  backdropFilter: 'blur(10px)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      {/* Rankings Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(255, 154, 158, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <h3 style={{ 
          background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: '2rem', 
          fontSize: '1.3rem', 
          fontWeight: '700'
        }}>
          🏆 Influencer Rankings
        </h3>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem',
          maxHeight: '400px',
          overflowY: 'auto',
          paddingRight: '0.5rem'
        }}>
          {stats?.topReferrers?.slice(0, 8).map((user, index) => (
            <motion.div 
              key={user.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, x: 10 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.2rem',
                background: index === 0 ? 
                  'linear-gradient(135deg, #ffd700, #ffed4e)' : 
                  'rgba(255, 255, 255, 0.25)',
                borderRadius: '15px',
                border: index === 0 ? '2px solid #ffd700' : '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                boxShadow: index === 0 ? '0 10px 30px rgba(255, 215, 0, 0.4)' : '0 5px 15px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: index === 0 ? 
                      'linear-gradient(135deg, #ff6b6b, #ee5a52)' : 
                      'linear-gradient(135deg, #4ecdc4, #44a08d)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    fontWeight: '700',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
                  }}
                >
                  #{index + 1}
                </motion.div>
                <div>
                  <div style={{ 
                    color: index === 0 ? '#b8860b' : 'rgba(255, 255, 255, 0.95)', 
                    fontWeight: '700', 
                    fontSize: '1rem',
                    marginBottom: '0.25rem'
                  }}>
                    {user.userId}
                  </div>
                  <div style={{ 
                    color: index === 0 ? 'rgba(184, 134, 11, 0.8)' : 'rgba(255, 255, 255, 0.7)', 
                    fontSize: '0.85rem',
                    fontWeight: '500'
                  }}>
                    Score: {(user.referralCount * 10).toFixed(1)} ⭐
                  </div>
                </div>
              </div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                style={{ 
                  color: index === 0 ? '#b8860b' : 'rgba(255, 255, 255, 0.95)', 
                  fontWeight: '800', 
                  fontSize: '1.2rem',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
                {user.referralCount} refs
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  // Simulation Tab
  const renderSimulation = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
      {/* Main Simulation Chart */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(168, 237, 234, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <h3 style={{ 
          background: 'linear-gradient(45deg, #4a5568, #2d3748)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: '1.5rem', 
          fontSize: '1.4rem', 
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}>
          📈 Growth Simulation
        </h3>
        <motion.div 
          style={{ height: '400px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '15px', padding: '1rem' }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={simulationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74, 85, 104, 0.3)" />
              <XAxis dataKey="day" stroke="#4a5568" fontSize={12} fontWeight="600" />
              <YAxis stroke="#4a5568" fontSize={12} fontWeight="600" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid rgba(168, 237, 234, 0.3)',
                  borderRadius: '12px',
                  color: '#4a5568',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="conservative" 
                stroke="#38a169" 
                strokeWidth={4} 
                name="Conservative (20%)"
                dot={{ fill: '#38a169', r: 6 }}
                activeDot={{ r: 8, fill: '#38a169', stroke: '#ffffff', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="moderate" 
                stroke="#3182ce" 
                strokeWidth={4} 
                name="Moderate (35%)"
                dot={{ fill: '#3182ce', r: 5 }}
                activeDot={{ r: 8, fill: '#3182ce', stroke: '#ffffff', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="aggressive" 
                stroke="#e53e3e" 
                strokeWidth={4} 
                name="Aggressive (50%)"
                dot={{ fill: '#e53e3e', r: 5 }}
                activeDot={{ r: 8, fill: '#e53e3e', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </motion.div>

      {/* Simulation Controls */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <h3 style={{ 
          background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: '2rem', 
          fontSize: '1.3rem', 
          fontWeight: '700'
        }}>
          🎮 Simulation Controls
        </h3>
        
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {[
            { label: 'Growth Rate', value: '35%', desc: 'Current simulation rate', icon: '📊' },
            { label: 'Time Horizon', value: '30 days', desc: 'Projection period', icon: '⏰' },
            { label: 'Expected Users', value: simulationData[simulationData.length - 1]?.moderate || 0, desc: 'Projected total', icon: '👥' }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '1.5rem',
                borderRadius: '15px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.95)', 
                  fontWeight: '700', 
                  fontSize: '1.1rem' 
                }}>
                  {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                </div>
              </div>
              <div style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {item.label}
              </div>
              <div style={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '0.8rem',
                marginTop: '0.25rem'
              }}>
                {item.desc}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Simulation Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{
            marginTop: '2rem',
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '1.5rem',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <h4 style={{
            color: '#ffffff',
            fontSize: '1rem',
            fontWeight: '700',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            🚀 Scenario Analysis
          </h4>
          <div style={{ display: 'grid', gap: '0.8rem' }}>
            {[
              { scenario: 'Best Case', growth: '+127%', color: '#38a169' },
              { scenario: 'Realistic', growth: '+89%', color: '#3182ce' },
              { scenario: 'Conservative', growth: '+45%', color: '#e53e3e' }
            ].map((item, index) => (
              <motion.div
                key={item.scenario}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.1)'
                }}
              >
                <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600' }}>
                  {item.scenario}
                </span>
                <span style={{ 
                  fontWeight: '700', 
                  color: item.color,
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                }}>
                  {item.growth}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );

  // Optimization Tab
  const renderOptimization = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
      {/* Strategy Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <h3 style={{ 
          background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: '2rem', 
          fontSize: '1.4rem', 
          fontWeight: '700',
          letterSpacing: '-0.5px',
          textAlign: 'center'
        }}>
          🎯 Optimization Strategies
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              title: 'Target High-Value Users',
              description: 'Focus on users with the highest referral potential and conversion rates',
              score: '92%',
              gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
              icon: '🎯'
            },
            {
              title: 'Improve Conversion Rate',
              description: 'Optimize the referral process to increase success and engagement rates',
              score: '87%',
              gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              icon: '📈'
            },
            {
              title: 'Expand Network Reach',
              description: 'Identify and connect isolated user clusters to maximize network effect',
              score: '81%',
              gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
              icon: '🌐'
            },
            {
              title: 'Incentive Optimization',
              description: 'Adjust rewards and motivations to maximize user participation',
              score: '76%',
              gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              icon: '💎'
            }
          ].map((strategy, index) => (
            <motion.div
              key={strategy.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                rotateX: 5 
              }}
              style={{
                background: strategy.gradient,
                padding: '2rem',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                position: 'relative',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer'
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255, 255, 255, 0.3)',
                  color: '#4a5568',
                  padding: '0.5rem 1rem',
                  borderRadius: '25px',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)'
                }}
              >
                {strategy.score}
              </motion.div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>{strategy.icon}</div>
                <h4 style={{ 
                  color: '#4a5568', 
                  fontWeight: '700', 
                  fontSize: '1.1rem',
                  margin: 0,
                  textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
                }}>
                  {strategy.title}
                </h4>
              </div>
              
              <p style={{ 
                color: '#5a5a5a', 
                fontSize: '0.9rem', 
                lineHeight: '1.6', 
                margin: 0,
                fontWeight: '500',
                textShadow: '0 1px 1px rgba(255, 255, 255, 0.3)'
              }}>
                {strategy.description}
              </p>

              {/* Progress Bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: strategy.score }}
                transition={{ duration: 1.5, delay: 0.5 + index * 0.1 }}
                style={{
                  marginTop: '1rem',
                  height: '4px',
                  background: 'rgba(74, 85, 104, 0.3)',
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  height: '100%',
                  width: strategy.score,
                  background: 'linear-gradient(90deg, #4a5568, #2d3748)',
                  borderRadius: '2px'
                }} />
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
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(240, 147, 251, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <h3 style={{ 
          background: 'linear-gradient(45deg, #ffffff, #f0f0f0)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: '2rem', 
          fontSize: '1.4rem', 
          fontWeight: '700',
          letterSpacing: '-0.5px',
          textAlign: 'center'
        }}>
          📊 Optimization Results
        </h3>
        
        <motion.div 
          style={{ 
            height: '350px', 
            backgroundColor: 'rgba(255, 255, 255, 0.15)', 
            borderRadius: '15px', 
            padding: '1rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { metric: 'Conversion Rate', before: 45, after: 67 },
              { metric: 'Network Reach', before: 78, after: 89 },
              { metric: 'User Engagement', before: 56, after: 73 },
              { metric: 'Referral Success', before: 62, after: 81 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.3)" />
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
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: '1px solid rgba(240, 147, 251, 0.3)',
                  borderRadius: '12px',
                  color: '#4a5568',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend 
                wrapperStyle={{
                  color: '#ffffff',
                  fontWeight: '600'
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
            marginTop: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}
        >
          {[
            { label: 'Overall Improvement', value: '+28%', icon: '🚀' },
            { label: 'ROI Increase', value: '+156%', icon: '💰' },
            { label: 'User Satisfaction', value: '+34%', icon: '😊' },
            { label: 'Network Health', value: '+42%', icon: '💪' }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{metric.icon}</div>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: '800', 
                color: '#ffffff',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                marginBottom: '0.25rem'
              }}>
                {metric.value}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {metric.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );

  return (
    <div style={{ 
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -250 }}
        animate={{ 
          x: !sidebarVisible ? -250 : (sidebarOpen ? 0 : -200),
          opacity: sidebarVisible ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          width: sidebarOpen ? '250px' : '50px',
          backgroundColor: '#000000',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 1000,
          overflow: 'hidden',
          transition: 'width 0.3s ease',
          display: sidebarVisible ? 'block' : 'none'
        }}
      >
        {/* Sidebar Header */}
        <div style={{
          padding: '1rem',
          borderBottom: '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {sidebarOpen && (
            <h2 style={{
              color: '#ffffff',
              fontSize: '1.2rem',
              fontWeight: '600',
              margin: 0
            }}>
              Referral Network
            </h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '1rem 0' }}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ backgroundColor: '#333' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: isActive ? '#333' : 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderLeft: isActive ? '3px solid #ffffff' : '3px solid transparent'
                }}
              >
                <Icon size={20} />
                {sidebarOpen && (
                  <span style={{ marginLeft: '0.75rem', fontSize: '0.9rem' }}>
                    {item.label}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div style={{
        marginLeft: !sidebarVisible ? '0' : (sidebarOpen ? '250px' : '50px'),
        flex: 1,
        transition: 'margin-left 0.3s ease',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        width: !sidebarVisible ? '100vw' : `calc(100vw - ${sidebarOpen ? '250px' : '50px'})`
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 10s ease infinite',
          padding: '2rem 2rem',
          borderBottom: '1px solid #e5e7eb',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animated background elements */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 50%)',
            animation: 'pulse 4s ease-in-out infinite'
          }} />
          
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
              textTransform: 'capitalize',
              position: 'relative',
              zIndex: 1
            }}
          >
            {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: '0.5rem 0 0 0',
              fontSize: '1.1rem',
              fontWeight: '500',
              position: 'relative',
              zIndex: 1
            }}
          >
            Analyze and optimize your referral network performance with advanced analytics
          </motion.p>
          
          {/* Enhanced floating gradient orbs with CSS animations */}
          <motion.div
            style={{
              position: 'absolute',
              top: '15%',
              right: '8%',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '50%',
              opacity: 0.15,
              zIndex: 0,
              animation: 'float 8s ease-in-out infinite, pulse-glow 4s ease-in-out infinite alternate'
            }}
          />
          <motion.div
            style={{
              position: 'absolute',
              bottom: '15%',
              right: '3%',
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              borderRadius: '50%',
              opacity: 0.12,
              zIndex: 0,
              animation: 'float 10s ease-in-out infinite reverse, pulse-glow 5s ease-in-out infinite alternate-reverse',
              animationDelay: '2s'
            }}
          />
          <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              right: '15%',
              width: '45px',
              height: '45px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              opacity: 0.1,
              zIndex: 0,
              animation: 'float 12s ease-in-out infinite, pulse-glow 6s ease-in-out infinite',
              animationDelay: '4s'
            }}
          />
          <motion.div
            style={{
              position: 'absolute',
              top: '30%',
              left: '3%',
              width: '70px',
              height: '70px',
              background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
              borderRadius: '50%',
              opacity: 0.08,
              zIndex: 0,
              animation: 'float 9s ease-in-out infinite reverse, pulse-glow 3.5s ease-in-out infinite',
              animationDelay: '1s'
            }}
          />
          <motion.div
            style={{
              position: 'absolute',
              bottom: '25%',
              left: '8%',
              width: '55px',
              height: '55px',
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              borderRadius: '50%',
              opacity: 0.1,
              zIndex: 0,
              animation: 'float 11s ease-in-out infinite, pulse-glow 4.5s ease-in-out infinite alternate',
              animationDelay: '3s'
            }}
          />
        </div>

        {/* Content Area */}
        <div style={{ padding: '2rem', width: '100%', maxWidth: '100%' }}>
          {loading ? (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '500px',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              margin: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}>
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity, 
                  ease: "linear",
                  scale: { duration: 2, repeat: Infinity }
                }}
                style={{
                  width: '60px',
                  height: '60px',
                  border: '4px solid rgba(255,255,255,0.3)',
                  borderTop: '4px solid #ffffff',
                  borderRadius: '50%',
                  marginBottom: '2rem'
                }}
              />
              <motion.p 
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ 
                  color: '#ffffff', 
                  fontSize: '1.3rem', 
                  fontWeight: '600',
                  textAlign: 'center',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                Initializing Network Analytics...
              </motion.p>
              <motion.div
                animate={{ width: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  height: '4px',
                  background: 'rgba(255,255,255,0.5)',
                  borderRadius: '2px',
                  marginTop: '1rem',
                  width: '200px'
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
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboard;
