const getApiBaseUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  return isLocalhost ? 'http://localhost:9091' : 'http://141.144.226.68:9091';
};

const API_BASE_URL = getApiBaseUrl();

class AdminApiService {
  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/test`);
      return await response.text();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // User Management
  async createUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async createAdmin(adminData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/create-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create admin: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  }

  // Teacher Approval Workflow
  async getPendingTeachers() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/teachers/pending`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch pending teachers: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching pending teachers:', error);
      throw error;
    }
  }

  async approveTeacher(userId, approvalData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/teachers/approve/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(approvalData),
      });

      if (!response.ok) {
        throw new Error(`Failed to approve teacher: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error approving teacher:', error);
      throw error;
    }
  }

  // Additional utility methods for the frontend
  async getAllUsers() {
    // This would need to be implemented in the backend
    // For now, we'll use mock data or implement when the endpoint is available
    try {
      // Placeholder - implement when backend endpoint is ready
      throw new Error('Get all users endpoint not yet implemented');
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }
}

export default new AdminApiService();