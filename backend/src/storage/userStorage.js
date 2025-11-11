// User storage service - uses in-memory storage with persistence option
let users = [];
let nextId = 1;

class UserStorage {
  constructor() {
    // Initialize with admin user if empty
    if (users.length === 0) {
      this.createUser({
        name: 'Admin User',
        email: 'admin@heyalec.com',
        password: '$2b$10$nAqyeSrysIsyXP94Z1OyAOkaTtVzYwu8y0.cXpkmoAngOTQO0n5z6', // hashed 'admin123'
        role: 'admin'
      });
    }
  }

  async createUser(userData) {
    const user = {
      id: `usr_${nextId++}`,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'submitter',
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    users.push(user);
    return user;
  }

  async getUserByEmail(email) {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  async getUserById(id) {
    return users.find(u => u.id === id);
  }

  async getAllUsers() {
    return users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin
    }));
  }

  async updateLastLogin(id) {
    const user = users.find(u => u.id === id);
    if (user) {
      user.lastLogin = new Date().toISOString();
    }
    return user;
  }

  async updateUser(id, updates) {
    const user = users.find(u => u.id === id);
    if (user) {
      Object.assign(user, updates);
    }
    return user;
  }

  async deleteUser(id) {
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users.splice(index, 1);
      return true;
    }
    return false;
  }

  // Get submission count for a user
  async getUserSubmissionCount(userId) {
    // This will be integrated with submission storage
    return 0;
  }
}

module.exports = new UserStorage();
