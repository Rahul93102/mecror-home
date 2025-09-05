import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Users, Network, TrendingUp, Target, GitBranch, Activity, Menu, X } from 'lucide-react';
import ReferralNetwork from '../utils/ReferralNetwork';

const ReferralDashboard = () => {
  const [activeTab, setActiveTab] = useState('graph-structure');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigationItems = [
    { id: 'graph-structure', label: 'Graph Structure', icon: GitBranch },
    { id: 'network-reach', label: 'Network Reach', icon: Network },
    { id: 'influencers', label: 'Influencers', icon: Users },
    { id: 'simulation', label: 'Simulation', icon: Activity },
    { id: 'optimization', label: 'Optimization', icon: Target }
  ];

  return (
    <div style={{ 
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        width: sidebarOpen ? '250px' : '50px',
        backgroundColor: '#000000',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #333' }}>
          {sidebarOpen && (
            <h2 style={{ color: '#ffffff', margin: 0 }}>Referral Network</h2>
          )}
        </div>
        <nav style={{ padding: '1rem 0' }}>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: isActive ? '#333' : 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <Icon size={20} />
                {sidebarOpen && <span style={{ marginLeft: '0.75rem' }}>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
      
      <div style={{
        marginLeft: sidebarOpen ? '250px' : '50px',
        flex: 1,
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <h1 style={{ fontSize: '2rem', color: '#000000', margin: 0 }}>
            {navigationItems.find(item => item.id === activeTab)?.label}
          </h1>
          <p style={{ color: '#6b7280', margin: '0.5rem 0 0 0' }}>
            Analyze and optimize your referral network performance
          </p>
        </div>
        
        <div style={{ padding: '2rem' }}>
          <div style={{
            backgroundColor: '#ffffff',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ color: '#000000', fontSize: '1.3rem', fontWeight: '600' }}>
              {activeTab === 'graph-structure' && 'Network Structure'}
              {activeTab === 'network-reach' && 'Network Reach Analysis'}
              {activeTab === 'influencers' && 'Top Influencers'}
              {activeTab === 'simulation' && 'Growth Simulation'}
              {activeTab === 'optimization' && 'Optimization Strategies'}
            </h3>
            <p style={{ color: '#6b7280', marginTop: '1rem' }}>
              Content for {activeTab} tab will be displayed here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboard;
