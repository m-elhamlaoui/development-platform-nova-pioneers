import React, { useState } from 'react';
import { Check, X, Eye, Download, Calendar, MapPin, GraduationCap, FileText, User, Mail, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const ConfirmTeachers = () => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const pendingTeachers = [
    {
      id: 1,
      user_id: 101,
      username: 'sarah_johnson',
      email: 'sarah.johnson@email.com',
      first_name: 'Sarah',
      last_name: 'Johnson',
      certification_info: 'PhD in Mathematics, MIT - Teaching Certificate #TC2024001',
      join_date: null, // Will be set when approved
      accumulated_xp: 0,
      title: 'Dr.',
    //   phone: '+1-555-0123',
      subject: 'Mathematics',
      experience: '8 years',
      location: 'Boston, MA',
      appliedDate: '2024-05-20',
      diploma_pdf: 'sarah_johnson_diploma.pdf',
      bio: 'Experienced mathematics educator with expertise in advanced calculus and statistics. Passionate about making complex mathematical concepts accessible to students.',
      status: 'pending'
    },
    {
      id: 2,
      user_id: 102,
      username: 'michael_chen',
      email: 'michael.chen@email.com',
      first_name: 'Michael',
      last_name: 'Chen',
      certification_info: 'MS Computer Science, Stanford - Software Development Certificate',
      join_date: null,
      accumulated_xp: 0,
      title: 'Prof.',
    //   phone: '+1-555-0456',
      subject: 'Computer Science',
      experience: '12 years',
      location: 'San Francisco, CA',
      appliedDate: '2024-05-18',
      diploma_pdf: 'michael_chen_diploma.pdf',
      bio: 'Full-stack developer turned educator, passionate about coding education and preparing students for tech careers.',
      status: 'pending'
    },
    {
      id: 3,
      user_id: 103,
      username: 'emily_rodriguez',
      email: 'emily.rodriguez@email.com',
      first_name: 'Emily',
      last_name: 'Rodriguez',
      certification_info: 'MA English Literature, Harvard - Teaching License #TL2023045',
      join_date: null,
      accumulated_xp: 0,
      title: 'Ms.',
    //   phone: '+1-555-0789',
      subject: 'English Literature',
      experience: '5 years',
      location: 'Cambridge, MA',
      appliedDate: '2024-05-22',
      diploma_pdf: 'emily_rodriguez_diploma.pdf',
      bio: 'Passionate about making literature accessible and engaging for all students. Specializes in creative writing and literary analysis.',
      status: 'pending'
    },
    {
      id: 4,
      user_id: 104,
      username: 'david_kim',
      email: 'david.kim@email.com',
      first_name: 'David',
      last_name: 'Kim',
      certification_info: 'PhD Physics, Caltech - Research & Teaching Certificate',
      join_date: null,
      accumulated_xp: 0,
      title: 'Dr.',
    //   phone: '+1-555-0321',
      subject: 'Physics',
      experience: '10 years',
      location: 'Los Angeles, CA',
      appliedDate: '2024-05-19',
      diploma_pdf: 'david_kim_diploma.pdf',
      bio: 'Former NASA researcher with extensive experience in theoretical physics and practical applications.',
      status: 'pending'
    }
  ];

  const handleApprove = (teacherId) => {
    console.log('Approving teacher:', teacherId);
    // Add approval logic here - update database and set join_date
  };

  const handleReject = (teacherId) => {
    console.log('Rejecting teacher:', teacherId);
    // Add rejection logic here
  };

  const handleViewDiploma = (diplomaFile) => {
    console.log('Viewing diploma:', diplomaFile);
    // Add logic to open PDF viewer or download
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
          Confirm Teachers
        </motion.h1>
        <p className="text-gray-600">Review and approve teacher applications with credential verification</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
        //   {label: 'Pending Applications', value: pendingTeachers.length, color: 'orange' },
        //   { label: 'With Credentials', value: pendingTeachers.filter(t => t.diploma_pdf).length, color: 'blue' },
        //   { label: 'Advanced Degrees', value: pendingTeachers.filter(t => t.title === 'Dr.' || t.title === 'Prof.').length, color: 'purple' },
        //   { label: 'Avg Experience', value: '8.8 yrs', color: 'green' }
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teachers List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {pendingTeachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-xl shadow-lg p-6 border cursor-pointer transition-all ${
                  selectedTeacher?.id === teacher.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTeacher(teacher)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {teacher.first_name.charAt(0)}{teacher.last_name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {teacher.title} {teacher.first_name} {teacher.last_name}
                      </h3>
                      <p className="text-sm text-gray-500">@{teacher.username}</p>
                      <p className="text-sm text-gray-500">{teacher.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      Pending Review
                    </span>
                    {teacher.diploma_pdf && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        Credentials
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    {teacher.subject}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {teacher.experience} experience
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {teacher.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Applied: {teacher.appliedDate}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Certification:</p>
                  <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded">{teacher.certification_info}</p>
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
                    {teacher.diploma_pdf && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDiploma(teacher.diploma_pdf);
                        }}
                        className="flex items-center text-green-600 hover:text-green-800 text-sm"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        View Diploma
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(teacher.id);
                      }}
                      className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(teacher.id);
                      }}
                      className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      <Check className="w-4 h-4" />
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
                    {selectedTeacher.first_name.charAt(0)}{selectedTeacher.last_name.charAt(0)}
                  </div>
                  <h4 className="font-semibold text-lg">
                    {selectedTeacher.title} {selectedTeacher.first_name} {selectedTeacher.last_name}
                  </h4>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Username
                  </label>
                  <p className="text-gray-800">@{selectedTeacher.username}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <p className="text-gray-800">{selectedTeacher.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-800">{selectedTeacher.phone}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    Subject
                  </label>
                  <p className="text-gray-800">{selectedTeacher.subject}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Experience</label>
                  <p className="text-gray-800">{selectedTeacher.experience}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    Certification
                  </label>
                  <p className="text-gray-800 text-sm bg-gray-50 p-2 rounded">{selectedTeacher.certification_info}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-gray-800">{selectedTeacher.location}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">Bio</label>
                  <p className="text-gray-800 text-sm">{selectedTeacher.bio}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 mb-2 block flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    Credential Documents
                  </label>
                  {selectedTeacher.diploma_pdf ? (
                    <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Diploma/Certificate</span>
                        </div>
                        <button
                          onClick={() => handleViewDiploma(selectedTeacher.diploma_pdf)}
                          className="text-green-600 hover:text-green-800 flex items-center gap-1 text-sm"
                        >
                          <Download className="w-4 h-4" />
                          View PDF
                        </button>
                      </div>
                      <p className="text-xs text-green-600 mt-1">{selectedTeacher.diploma_pdf}</p>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-center">
                      <p className="text-sm text-red-600">No credentials uploaded</p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">User ID:</span>
                      <p className="font-mono">{selectedTeacher.user_id}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">XP Points:</span>
                      <p>{selectedTeacher.accumulated_xp}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    onClick={() => handleReject(selectedTeacher.id)}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedTeacher.id)}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
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
    </div>
  );
};

export default ConfirmTeachers;