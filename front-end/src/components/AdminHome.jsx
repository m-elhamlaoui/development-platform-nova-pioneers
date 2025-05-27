import React, { useState, useEffect } from 'react';
import { Users, UserCheck, AlertTriangle, TrendingUp, Activity, Shield, ArrowUpRight, Clock, CheckCircle, Settings, BarChart3, FileText, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import adminApi from '../services/adminApi';

const AdminHome = () => {
  const [stats, setStats] = useState([

   
  ]);

  const [loading, setLoading] = useState(true);
  const [systemHealth, setSystemHealth] = useState('Checking...');
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Check system health
      try {
        await adminApi.healthCheck();
        setSystemHealth('Healthy');
      } catch (error) {
        setSystemHealth('Error');
        console.error('Health check failed:', error);
      }

      // Fetch pending teachers count
      try {
        const pendingTeachers = await adminApi.getPendingTeachers();
        setStats(prevStats => 
          prevStats.map(stat => 
            stat.label === 'Pending Teachers' 
              ? { ...stat, value: pendingTeachers.length.toString() }
              : stat
          )
        );

        // Create recent activities from pending teachers
        const activities = pendingTeachers.slice(0, 3).map(teacher => ({
          action: 'New teacher registration',
          user: `${teacher.firstName} ${teacher.lastName}`,
          time: new Date(teacher.createdAt).toLocaleDateString(),
          type: 'teacher',
          status: 'pending'
        }));

        setRecentActivities(activities);

      } catch (error) {
        console.error('Error fetching pending teachers:', error);
        toast.error('Failed to load pending teachers count');
      }


    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Review Pending Teachers',
      description: 'Approve or reject teacher applications',
      color: 'blue',
      icon: UserCheck,
      link: '/admin/confirm-teachers',
      urgent: true,
      gradient: 'from-blue-500 to-blue-600'
    },
    
  ];

  const getCardGradient = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-gradient-to-br from-blue-500 to-blue-600';
      case 'orange':
        return 'bg-gradient-to-br from-orange-500 to-orange-600';
      case 'red':
        return 'bg-gradient-to-br from-red-500 to-red-600';
      default:
        return 'bg-gradient-to-br from-gray-500 to-gray-600';
    }
  };

  const getIconColor = (color) => {
    switch (color) {
      case 'blue':
        return 'text-blue-600';
      case 'orange':
        return 'text-orange-600';
      case 'red':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-lg">Welcome back! Here's what's happening in your system.</p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  systemHealth === 'Healthy' ? 'bg-green-500' : 
                  systemHealth === 'Error' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <span className="text-sm font-medium text-gray-700">
                  System {systemHealth}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} to={stat.link}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative overflow-hidden ${getCardGradient(stat.color)} rounded-2xl shadow-xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 group cursor-pointer text-white`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white rounded-full"></div>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white rounded-xl">
                      <Icon className={`w-7 h-7 ${getIconColor(stat.color)}`} />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-white opacity-70 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                  </div>
                  
                  <div className="mb-2">
                    <h3 className="text-3xl font-bold text-white mb-1">
                      {loading ? '...' : stat.value}
                    </h3>
                    <p className="text-white text-opacity-90 font-medium">
                      {stat.label}
                    </p>
                  </div>
                  
                  <p className="text-white text-opacity-70 text-sm">
                    {stat.description}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Activity className="w-4 h-4 text-white" />
              </div>
              Recent Activities
            </h2>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'teacher' ? 'bg-blue-100' :
                      activity.type === 'alert' ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      <Clock className={`w-5 h-5 ${
                        activity.type === 'teacher' ? 'text-blue-600' :
                        activity.type === 'alert' ? 'text-red-600' : 'text-green-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-800 transition-colors">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">
                        by <span className="font-medium">{activity.user}</span> • {activity.time}
                      </p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {activity.status}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No recent activities</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Zap className="w-4 h-4 text-white" />
              </div>
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link key={index} to={action.link}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    {action.urgent && (
                      <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse z-10"></div>
                    )}
                    
                    <div className={`relative overflow-hidden bg-gradient-to-r ${action.gradient} rounded-2xl p-5 text-white hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer`}>
                      {/* Background decorative elements */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -translate-y-6 translate-x-6"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-5 rounded-full translate-y-4 -translate-x-4"></div>
                      
                      {/* Content */}
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 bg-white rounded-xl">
                            <Icon className={`w-6 h-6 ${action.color === 'blue' ? 'text-blue-600' : 
                              action.color === 'red' ? 'text-red-600' : 
                              action.color === 'purple' ? 'text-purple-600' : 
                              action.color === 'green' ? 'text-green-600' : 'text-gray-600'}`} />
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-lg mb-1">
                              {action.title}
                            </h3>
                            <p className="text-white text-opacity-80 text-sm">
                              {action.description}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-6 h-6 text-white opacity-80 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                      </div>
                      
                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminHome;