# AssetDrop Testing Guide

## 🚀 Quick Start

### Starting the Application

1. **Start Backend Server**
```bash
cd backend
npm start
```
Server runs on: `http://localhost:3001`

2. **Start Frontend Server**
```bash
cd frontend
npm start
```
Frontend runs on: `http://localhost:3000`

---

## 🧪 Test Scenarios

### Test 1: New User Registration ✅

**Steps:**
1. Navigate to `http://localhost:3000/signup`
2. Fill in the form:
   - **Name:** John Smith
   - **Email:** john@example.com
   - **Password:** password123
   - **Role:** Submitter
3. Click **"Sign Up"**

**Expected Result:**
- ✅ User is automatically logged in
- ✅ Redirected to Client Dashboard
- ✅ Welcome message shows "Welcome back, John Smith!"
- ✅ Dashboard displays personal statistics

---

### Test 2: Admin Login ✅

**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Enter credentials:
   - **Email:** admin@heyalec.com
   - **Password:** admin123
3. Click **"Login"**

**Expected Result:**
- ✅ Redirected to Admin Dashboard
- ✅ See "Admin Control Panel" header with shield icon
- ✅ Tabbed interface visible (Overview, Submissions, Users, Analytics, Files)
- ✅ Can see all submissions and users

---

### Test 3: Client Login ✅

**Steps:**
1. Logout if currently logged in
2. Navigate to `http://localhost:3000/login`
3. Enter credentials:
   - **Email:** john@example.com
   - **Password:** password123
4. Click **"Login"**

**Expected Result:**
- ✅ Redirected to Client Dashboard
- ✅ See "Welcome back, John Smith!"
- ✅ Only see personal submissions
- ✅ Personal progress tracking visible

---

### Test 4: Data Persistence ✅

**Steps:**
1. Register a new user
2. Create a submission from Submission Page
3. View it in Dashboard
4. Logout
5. Close browser
6. Reopen browser and login again

**Expected Result:**
- ✅ Previous submission still visible
- ✅ User data intact
- ✅ Statistics updated correctly

---

### Test 5: Admin User Management ✅

**Steps:**
1. Login as admin (admin@heyalec.com / admin123)
2. Click on **"Users"** tab
3. View all registered users

**Expected Result:**
- ✅ See list of all users
- ✅ View user roles, emails, and registration dates
- ✅ See last login timestamps
- ✅ Can see submission counts

---

### Test 6: Role-Based Dashboards ✅

**Steps:**
1. Login as admin
2. Note the dashboard design (red theme, admin tools)
3. Logout
4. Login as regular user
5. Note the dashboard design (blue/purple theme, personal focus)

**Expected Result:**
- ✅ Admin sees tabbed control panel interface
- ✅ Admin has system management tools
- ✅ Client sees personal progress dashboard
- ✅ Client has simplified interface
- ✅ Completely different user experiences

---

### Test 7: Protected Routes ✅

**Steps:**
1. Open a new incognito window
2. Try to access `http://localhost:3000/dashboard`

**Expected Result:**
- ✅ Redirected to login page
- ✅ Must authenticate to access dashboard

---

### Test 8: Duplicate User Prevention ✅

**Steps:**
1. Navigate to signup page
2. Try to register with email: admin@heyalec.com

**Expected Result:**
- ✅ Error message: "User already exists with this email"
- ✅ Registration prevented

---

### Test 9: Invalid Login ✅

**Steps:**
1. Navigate to login page
2. Enter wrong password for existing user

**Expected Result:**
- ✅ Error message: "Invalid email or password"
- ✅ User not logged in

---

### Test 10: Session Persistence ✅

**Steps:**
1. Login to the application
2. Refresh the page (F5)
3. Navigate to different pages

**Expected Result:**
- ✅ User stays logged in
- ✅ No need to re-authenticate
- ✅ Session persists across page refreshes

---

## 🔐 Test Accounts

### Pre-configured Admin Account
```
Email: admin@heyalec.com
Password: admin123
Role: Admin
```

### Create Your Own Test Accounts
Use the signup page to create:
- Submitter accounts
- Host accounts
- Additional admin accounts (if needed)

---

## 🌐 API Testing with cURL

### Register New User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "submitter"
  }'
```

### Login User
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@heyalec.com",
    "password": "admin123"
  }'
```

### Get All Users (Admin Only)
```bash
# First get token from login response, then:
curl -X GET http://localhost:3001/api/auth/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Submission
```bash
curl -X POST http://localhost:3001/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "bio": "I am a talented musician",
    "role": "musician"
  }'
```

### Get All Submissions
```bash
curl -X GET http://localhost:3001/api/submissions
```

---

## ✅ Expected Behaviors

### Registration
- ✅ Unique emails only
- ✅ Minimum 6 character passwords
- ✅ Valid email format required
- ✅ Automatic login after registration
- ✅ JWT token generated and stored

### Login
- ✅ Case-insensitive email matching
- ✅ Secure password comparison
- ✅ Last login timestamp updated
- ✅ Token expiry after 7 days
- ✅ Session persists in localStorage

### Dashboards
- ✅ Admin sees all data
- ✅ Clients see only their data
- ✅ Different UI/UX per role
- ✅ Real-time data updates
- ✅ Responsive design

### Security
- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ Protected API endpoints
- ✅ Role-based access control
- ✅ CORS protection enabled

---

## 🐛 Troubleshooting

### Issue: Can't connect to backend
**Solution:** Make sure backend server is running on port 3001
```bash
cd backend
npm start
```

### Issue: "User already exists" error
**Solution:** This email is already registered. Use a different email or login instead.

### Issue: Dashboard shows no data
**Solution:** 
1. Check if you're logged in
2. Create a submission first
3. Refresh the page

### Issue: Token expired
**Solution:** Logout and login again. Tokens expire after 7 days.

### Issue: Can't see Users tab
**Solution:** Only admin users can see the Users tab. Login with admin@heyalec.com

---

## 📊 What to Verify

### ✅ Functionality Checklist

- [ ] New users can register
- [ ] Existing users can login
- [ ] Admin can login
- [ ] Data persists after logout
- [ ] Admin sees all users
- [ ] Clients see only their data
- [ ] Different dashboards per role
- [ ] Submissions are saved
- [ ] Status can be updated
- [ ] Session persists on refresh

### ✅ Security Checklist

- [ ] Passwords are hashed
- [ ] Tokens are generated
- [ ] Protected routes require auth
- [ ] Admin routes check role
- [ ] Duplicate emails prevented
- [ ] Invalid credentials rejected

### ✅ UX Checklist

- [ ] Clear error messages
- [ ] Smooth transitions
- [ ] Responsive design
- [ ] Intuitive navigation
- [ ] Loading states visible
- [ ] Success confirmations

---

## 🎯 Success Metrics

If all tests pass, you should see:

✅ **100% Authentication Success**
- Users can register and login
- Data persists correctly
- Sessions work properly

✅ **100% Data Persistence**
- All submissions saved
- User data maintained
- No data loss on refresh

✅ **100% Security**
- Passwords encrypted
- Tokens validated
- Routes protected

✅ **100% Role Differentiation**
- Admin sees control panel
- Clients see personal dashboard
- Proper access control

---

## 📞 Support

If you encounter any issues:
1. Check console for errors (F12)
2. Verify both servers are running
3. Clear localStorage and try again
4. Check network tab for API responses

---

**Last Updated:** September 30, 2025  
**Version:** 2.0  
**Status:** ✅ All Systems Operational
