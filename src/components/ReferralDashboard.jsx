import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Users, Network, TrendingUp, Target, GitBranch, Activity, Menu, X } from 'lucide-react';
import ReferralNetwork from '../utils/ReferralNetwork';

const ReferralDashboard = () => {
  const [network] = useState(() => new ReferralNetwork());
  const [stats, setStats] = useState(null);
  const [simulationData, setSimulationData] = useState([]);
  const [activeTab, setActiveTab] = useState('graph-structure');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationItems = [
    { id: 'graph-structure', label: 'Graph Structure', icon: GitBranch },
    { id: 'network-reach', label: 'Network Reach', icon: Network },
    { id: 'influencers', label: 'Influencers', icon: Users },
    { id: 'simulation', label: 'Simulation', icon: Activity },
    { id: 'optimization', label: 'Optimization', icon: Target }
  ];

  useEffect(() => {
    const initializeNetwork = async () => {
      try {
        const users = Array.from({ length: 100 }, (_, i) => `user_${String(i + 1).padStart(3, '0')}`);
        
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

        const simulations = {
          conservative: network.simulate(0.2, 30),
          moderate: network.simulate(0.35, 30),
          aggressive: network.simulate(0.5, 30)
        };

        const simulationChartData = simulations.conservative.map((conservative, index) => ({
          day: index + 1,
          conservative: conservative,
          moderate: simulations.moderate[index] || 0,
          aggressive: simulations.aggressive[index] || 0
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

  const COLORS = ['#000000', '#333333', '#666666', '#999999', '#cccccc'];

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', flexDirection: 'column' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{ width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTop: '4px solid #000000', borderRadius: '50%', marginBottom: '1rem' }}
          />
          <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>Loading network data...</p>
        </div>
      );
    }

    if (!stats) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#ef4444', fontSize: '1.1rem' }}>Failed to load network data. Please refresh the page.</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'graph-structure':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
              <h3>Network Statistics</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>Total Users: {stats.totalUsers}</div>
                <div>Total Referrals: {stats.totalReferrals}</div>
                <div>Average Referrals: {stats.avgReferralsPerUser.toFixed(1)}</div>
                <div>Network Density: {((stats.totalReferrals / (stats.totalUsers || 1)) * 10).toFixed(1)}%</div>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', border: '1px solid #e5e7eb' }}>
              <h3>Top Referrers</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.topReferrers.slice(0, 5).map(user => ({ user: user.userId.slice(-6), referrals: user.referralCount }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="user" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Bar dataKey="referrals" fill="#000000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      
      case 'network-reach':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3>Network Reach Analysis</h3>
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simulationData.slice(0, 15)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="conservative" stroke="#000000" strokeWidth={3} name="Conservative" />
                    <Line type="monotone" dataKey="moderate" stroke="#666666" strokeWidth={2} name="Moderate" />
                    <Line type="monotone" dataKey="aggressive" stroke="#999999" strokeWidth={2} name="Aggressive" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3>Reach Metrics</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>Total Reach: {network.calculateNetworkReach('user_001')}</div>
                <div>Average Reach: {Math.floor(stats.totalReferrals / (stats.totalUsers || 1))}</div>
                <div>Max Depth: {network.getMaxDepth()}</div>
                <div>Connectivity: {Math.min(100, Math.floor((stats.totalReferrals / (stats.totalUsers * (stats.totalUsers - 1))) * 10000))}%</div>
              </div>
            </div>
          </div>
        );

      case 'influencers':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3>Top Influencers Distribution</h3>
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.topReferrers.slice(0, 5).map((user, index) => ({ 
                        name: user.userId.slice(-6), 
                        value: user.referralCount,
                        fill: COLORS[index % COLORS.length]
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#000000"
                      dataKey="value"
                    >
                      {stats.topReferrers.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3>Influencer Rankings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stats.topReferrers.slice(0, 8).map((user, index) => (
                  <div key={user.userId} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>#{index + 1} {user.userId}</div>
                      <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Influence Score: {(user.referralCount * 10).toFixed(1)}</div>
                    </div>
                    <div style={{ fontWeight: '700' }}>{user.referralCount} refs</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'simulation':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3>Growth Simulation (30 Days)</h3>
              <div style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={simulationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="conservative" stroke="#000000" strokeWidth={3} name="Conservative" />
                    <Line type="monotone" dataKey="moderate" stroke="#666666" strokeWidth={2} name="Moderate" />
                    <Line type="monotone" dataKey="aggressive" stroke="#999999" strokeWidth={2} name="Aggressive" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3>Simulation Parameters</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>Growth Rate: 35%</div>
                <div>Time Horizon: 30 days</div>
                <div>Expected Users: {simulationData[simulationData.length - 1]?.moderate || 0}</div>
                <div>Confidence: 89%</div>
              </div>
            </div>
          </div>
        );

      case 'optimization':
        return (
          <div style={{ display: 'grid', gap: '2rem' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3>Optimization Strategies</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
                  <h4>Target High-Value Users</h4>
                  <p>Focus on users with the highest referral potential based on network analysis</p>
                  <div style={{ color: '#059669' }}>Impact: High (92% effectiveness)</div>
                </div>
                <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
                  <h4>Improve Conversion Rate</h4>
                  <p>Optimize the referral process to increase success rate and user engagement</p>
                  <div style={{ color: '#d97706' }}>Impact: Medium (87% effectiveness)</div>
                </div>
                <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
                  <h4>Expand Network Reach</h4>
                  <p>Identify and connect isolated user clusters to maximize network effect</p>
                  <div style={{ color: '#059669' }}>Impact: High (81% effectiveness)</div>
                </div>
                <div style={{ padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
                  <h4>Incentive Optimization</h4>
                  <p>Adjust rewards and incentives to maximize participation and ROI</p>
                  <div style={{ color: '#d97706' }}>Impact: Medium (76% effectiveness)</div>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <h3>Optimization Results Comparison</h3>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { metric: 'Conversion Rate', before: 45, after: 67 },
                    { metric: 'Network Reach', before: 78, after: 89 },
                    { metric: 'User Engagement', before: 56, after: 73 },
                    { metric: 'Referral Success', before: 62, after: 81 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="metric" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="before" fill="#cccccc" name="Before" />
                    <Bar dataKey="after" fill="#000000" name="After" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
      <motion.div 
        initial={{ x: -250 }}
        animate={{ x: sidebarOpen ? 0 : -200 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ width: sidebarOpen ? '250px' : '50px', backgroundColor: '#000000', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 1000, overflow: 'hidden' }}
      >
        <div style={{ padding: '1rem', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {sidebarOpen && (
            <h2 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: '600', margin: 0 }}>Referral Network</h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '0.5rem' }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

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
                  width: '100%', padding: '0.75rem 1rem', backgroundColor: isActive ? '#333' : 'transparent', border: 'none', color: '#ffffff', display: 'flex', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s ease', borderLeft: isActive ? '3px solid #ffffff' : '3px solid transparent'
                }}
              >
                <Icon size={20} />
                {sidebarOpen && (
                  <span style={{ marginLeft: '0.75rem', fontSize: '0.9rem' }}>{item.label}</span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </motion.div>

      <div style={{ marginLeft: sidebarOpen ? '250px' : '50px', flex: 1, transition: 'margin-left 0.3s ease', backgroundColor: '#f8f9fa' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem 2rem', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#000000', margin: 0, textTransform: 'capitalize' }}>
            {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h1>
          <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0', fontSize: '1rem' }}>
            Analyze and optimize your referral network performance
          </p>
        </div>

        <div style={{ padding: '2rem' }}>
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
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboard;
