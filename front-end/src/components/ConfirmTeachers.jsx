import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Download, Calendar, MapPin, GraduationCap, FileText, User, Mail, Award, Loader2, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import adminApi from '../services/adminApi';

const ConfirmTeachers = () => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPendingTeachers();
  }, []);

  const fetchPendingTeachers = async () => {
    try {
      setLoading(true);
      const teachers = await adminApi.getPendingTeachers();
      setPendingTeachers(teachers);
    } catch (error) {
      console.error('Error fetching pending teachers:', error);
      toast.error('Failed to load pending teachers');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (teacher) => {
    try {
      setActionLoading(teacher.userId);
      
      const approvalData = {
        certificationInfo: prompt('Enter certification info (optional):') || 'Pending verification',
        title: prompt('Enter teacher title (optional):') || 'Beginner'
      };

      await adminApi.approveTeacher(teacher.userId, approvalData);
      
      toast.success(`${teacher.firstName} ${teacher.lastName} has been approved as a teacher!`);
      
      // Remove from pending list
      setPendingTeachers(prev => prev.filter(t => t.userId !== teacher.userId));
      
      // Clear selection if this teacher was selected
      if (selectedTeacher?.userId === teacher.userId) {
        setSelectedTeacher(null);
      }
      
    } catch (error) {
      console.error('Error approving teacher:', error);
      toast.error('Failed to approve teacher. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (teacher) => {
    if (!window.confirm(`Are you sure you want to reject ${teacher.firstName} ${teacher.lastName}'s application?`)) {
      return;
    }

    try {
      setActionLoading(teacher.userId);
      
      // TODO: Implement reject endpoint in backend
      // For now, just remove from local state
      setPendingTeachers(prev => prev.filter(t => t.userId !== teacher.userId));
      
      if (selectedTeacher?.userId === teacher.userId) {
        setSelectedTeacher(null);
      }
      
      toast.success(`${teacher.firstName} ${teacher.lastName}'s application has been rejected.`);
      
    } catch (error) {
      console.error('Error rejecting teacher:', error);
      toast.error('Failed to reject teacher. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDiploma = (diplomaFile) => {
    // TODO: Implement diploma viewing when file upload is available
    toast.info('Diploma viewing will be available when file upload is implemented');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading pending teachers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-2"
        >
          Confirm Teachers
        </motion.h1>
        <p className="text-gray-600">Review and approve teacher applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-4 border border-gray-100"
        >
          <div className="text-2xl font-bold text-orange-600">{pendingTeachers.length}</div>
          <div className="text-sm text-gray-600">Pending Applications</div>
        </motion.div>
      </div>

      {pendingTeachers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-12 text-center"
        >
          <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pending Teachers</h3>
          <p className="text-gray-500">All teacher applications have been processed.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teachers List */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {pendingTeachers.map((teacher, index) => (
                <motion.div
                  key={teacher.userId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl shadow-lg p-6 border cursor-pointer transition-all ${
                    selectedTeacher?.userId === teacher.userId 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTeacher(teacher)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {teacher.firstName?.charAt(0)}{teacher.lastName?.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {teacher.firstName} {teacher.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{teacher.email}</p>
                        <p className="text-sm text-gray-500">Applied: {formatDate(teacher.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Pending Review
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTeacher(teacher);
                        }}
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(teacher);
                        }}
                        disabled={actionLoading === teacher.userId}
                        className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors text-sm disabled:opacity-50"
                      >
                        {actionLoading === teacher.userId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        Reject
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(teacher);
                        }}
                        disabled={actionLoading === teacher.userId}
                        className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors text-sm disabled:opacity-50"
                      >
                        {actionLoading === teacher.userId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        Approve
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Teacher Details Panel */}
          <div className="lg:col-span-1">
            {selectedTeacher ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 sticky top-6"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Teacher Profile</h3>
                
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">
                      {selectedTeacher.firstName?.charAt(0)}{selectedTeacher.lastName?.charAt(0)}
                    </div>
                    <h4 className="font-semibold text-lg">
                      {selectedTeacher.firstName} {selectedTeacher.lastName}
                    </h4>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Email
                    </label>
                    <p className="text-gray-800">{selectedTeacher.email}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Applied On
                    </label>
                    <p className="text-gray-800">{formatDate(selectedTeacher.createdAt)}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">
                      User ID
                    </label>
                    <p className="text-gray-800 font-mono text-sm bg-gray-50 p-2 rounded">
                      {selectedTeacher.userId}
                    </p>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={() => handleReject(selectedTeacher)}
                      disabled={actionLoading === selectedTeacher.userId}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === selectedTeacher.userId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(selectedTeacher)}
                      disabled={actionLoading === selectedTeacher.userId}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {actionLoading === selectedTeacher.userId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Approve
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Select a teacher to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmTeachers;