import React, { useState } from 'react';
import { Eye, MessageCircle, Check, X, AlertTriangle, Clock, User, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const ManageAlerts = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const reports = [
    {
      id: 1,
      title: 'Inappropriate Content in Math Course',
      description: 'The lesson contains content that is not suitable for children',
      reportType: 'content',
      priority: 'high',
      status: 'pending',
      reportedBy: 'Sarah Johnson',
      userRole: 'parent',
      courseName: 'Advanced Mathematics',
      courseId: 'MATH101',
      teacher: 'Dr. Michael Smith',
      reportedAt: '2024-05-24 10:30',
      details: 'Found inappropriate language in lesson 5. This needs immediate attention as it affects multiple students.',
      evidence: ['screenshot1.png', 'video_clip.mp4']
    },
    {
      id: 2,
      title: 'Course Content Quality Issue',
      description: 'Low quality videos and unclear explanations',
      reportType: 'quality',
      priority: 'medium',
      status: 'investigating',
      reportedBy: 'Emily Davis',
      userRole: 'student',
      courseName: 'English Literature',
      courseId: 'ENG201',
      teacher: 'Prof. Jane Wilson',
      reportedAt: '2024-05-23 15:45',
      details: 'Video quality is very poor, audio is unclear, and the explanations are hard to follow.',
      evidence: ['audio_sample.mp3']
    },
    {
      id: 3,
      title: 'Technical Issues with Course',
      description: 'Course videos not loading properly',
      reportType: 'technical',
      priority: 'high',
      status: 'pending',
      reportedBy: 'Mark Thompson',
      userRole: 'student',
      courseName: 'Computer Science Basics',
      courseId: 'CS101',
      teacher: 'Dr. Alex Chen',
      reportedAt: '2024-05-23 09:20',
      details: 'Multiple students unable to access course videos. Issue persists across different browsers.',
      evidence: ['error_log.txt']
    },
    {
      id: 4,
      title: 'Incorrect Course Information',
      description: 'Course description does not match actual content',
      reportType: 'misinformation',
      priority: 'medium',
      status: 'resolved',
      reportedBy: 'Lisa Anderson',
      userRole: 'parent',
      courseName: 'Science for Kids',
      courseId: 'SCI001',
      teacher: 'Ms. Rachel Green',
      reportedAt: '2024-05-22 14:15',
      details: 'Course was advertised for ages 8-10 but content is too advanced for that age group.',
      evidence: ['course_description.pdf'],
      resolution: 'Course description updated and age recommendation adjusted'
    },
    {
      id: 5,
      title: 'Billing Issue with Course',
      description: 'Charged for course but no access provided',
      reportType: 'billing',
      priority: 'high',
      status: 'pending',
      reportedBy: 'Robert Brown',
      userRole: 'parent',
      courseName: 'Art & Creativity',
      courseId: 'ART101',
      teacher: 'Ms. Sofia Martinez',
      reportedAt: '2024-05-21 11:30',
      details: 'Payment was processed but student account shows no enrollment in the course.',
      evidence: ['payment_receipt.pdf']
    }
  ];

  const getReportIcon = (type) => {
    switch (type) {
      case 'content': return <AlertTriangle className="w-5 h-5" />;
      case 'quality': return <BookOpen className="w-5 h-5" />;
      case 'technical': return <MessageCircle className="w-5 h-5" />;
      case 'misinformation': return <Eye className="w-5 h-5" />;
      case 'billing': return <User className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getReportColors = (type) => {
    switch (type) {
      case 'content': return 'bg-red-100 text-red-800 border-red-200';
      case 'quality': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'technical': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'misinformation': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'billing': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-200 text-red-800';
      case 'medium': return 'bg-yellow-200 text-yellow-800';
      case 'low': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-orange-200 text-orange-800';
      case 'investigating': return 'bg-blue-200 text-blue-800';
      case 'resolved': return 'bg-green-200 text-green-800';
      case 'rejected': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const filteredReports = reports.filter(report => 
    filterStatus === 'all' || report.status === filterStatus
  );

  const handleResolve = (reportId) => {
    console.log('Resolving report:', reportId);
    // Add resolution logic here
  };

  const handleReject = (reportId) => {
    console.log('Rejecting report:', reportId);
    // Add rejection logic here
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-2"
        >
          Course Reports & Issues
        </motion.h1>
        <p className="text-gray-600">Review and manage user reports about courses and platform issues</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {[{label: 'Total Reports', value: '5', color: 'blue' },
          { label: 'Pending', value: '3', color: 'orange' },
          { label: 'Investigating', value: '1', color: 'blue' },
          { label: 'Resolved', value: '1', color: 'green' },
          { label: 'High Priority', value: '3', color: 'red' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-4 border border-gray-100"
          >
            <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Reports</option>
            <option value="pending">Pending</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-lg p-6 border cursor-pointer transition-all ${
                  selectedReport?.id === report.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedReport(report)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getReportColors(report.reportType)}`}>
                      {getReportIcon(report.reportType)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{report.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Course:</span>
                    <p className="font-medium">{report.courseName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Teacher:</span>
                    <p className="font-medium">{report.teacher}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Reported by:</span>
                    <p className="font-medium">{report.reportedBy} ({report.userRole})</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <p className="font-medium">{report.reportedAt}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                      {report.priority} priority
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReject(report.id);
                          }}
                          className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors text-sm"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResolve(report.id);
                          }}
                          className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors text-sm"
                        >
                          <Check className="w-4 h-4" />
                          Resolve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Report Details Panel */}
        <div className="lg:col-span-1">
          {selectedReport ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 sticky top-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Report Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Report Title</label>
                  <p className="text-gray-800 font-medium">{selectedReport.title}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Course Information</label>
                  <p className="text-gray-800">{selectedReport.courseName}</p>
                  <p className="text-sm text-gray-600">Course ID: {selectedReport.courseId}</p>
                  <p className="text-sm text-gray-600">Teacher: {selectedReport.teacher}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Reported By</label>
                  <p className="text-gray-800">{selectedReport.reportedBy}</p>
                  <p className="text-sm text-gray-600">Role: {selectedReport.userRole}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Report Type</label>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getReportColors(selectedReport.reportType)}`}>
                    {selectedReport.reportType}
                  </span>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Detailed Description</label>
                  <p className="text-gray-800 text-sm">{selectedReport.details}</p>
                </div>

                {selectedReport.evidence && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">Evidence Files</label>
                    <div className="space-y-2">
                      {selectedReport.evidence.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <span className="text-sm text-gray-700">{file}</span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedReport.resolution && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Resolution</label>
                    <p className="text-gray-800 text-sm">{selectedReport.resolution}</p>
                  </div>
                )}

                {selectedReport.status === 'pending' && (
                  <div className="flex gap-2 mt-6">
                    <button
                      onClick={() => handleReject(selectedReport.id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleResolve(selectedReport.id)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Resolve
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select a report to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAlerts;