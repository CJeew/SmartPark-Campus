# 🚗 SmartPark Campus - Login & Register Implementation

## ✅ Complete Implementation Guide

This document provides step-by-step instructions to set up and test the Login (P01) and Register (P02) functionality for the SmartPark Campus Parking System.

---

## 📋 Overview

### What's Implemented

#### **Backend (Spring Boot)**
- ✅ User, Vehicle, and Role entities with JPA relationships
- ✅ Authentication service with registration and login logic
- ✅ JWT token generation and validation
- ✅ User repository with unique constraints validation
- ✅ RESTful API endpoints for auth operations
- ✅ Google OAuth 2.0 setup
- ✅ CORS configuration

#### **Frontend (React)**
- ✅ Login page with Google OAuth integration
- ✅ Register page with comprehensive form validation
- ✅ Reusable components: InputField, Button, Toast, VehicleTypeBadge, FilterDropdown
- ✅ Client-side validation
- ✅ Token management and storage
- ✅ Role-based dashboard routing

---

## 🛠️ Prerequisites

Before setting up the project, ensure you have:

- **Java 17+** installed
- **Node.js 16+** and **npm** installed
- **MySQL Server 8.0+** running
- **Git** (optional)
- **Postman** (for API testing)

### Create Database

```bash
# Open MySQL CLI
mysql -u root -p

# Create database
CREATE DATABASE smartpark_campus;

# Verify
SHOW DATABASES;
```

---

## 🔧 Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Update Database Credentials (if needed)

Edit `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

### Step 3: Install Dependencies

```bash
# On Windows
mvnw clean install

# On macOS/Linux
./mvnw clean install
```

### Step 4: Run the Backend Server

```bash
# On Windows
mvnw spring-boot:run

# On macOS/Linux
./mvnw spring-boot:run
```

The backend should start on **http://localhost:8080**

You should see output like:
```
Started SmartParkCampusApplication in X.XXX seconds
```

### Verify Backend is Running

Visit: **http://localhost:8080/api/auth/login**

Expected: Browser might show error page (this is normal) - it means the server is running.

---

## 🎨 Frontend Setup

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the Development Server

```bash
npm start
```

The frontend will open automatically at **http://localhost:3000**

---

## 🧪 Testing with Postman

### Step 1: Import Postman Collection

1. Open **Postman**
2. Click **Import**
3. Select the file: `SmartPark_Campus_Auth_API.postman_collection.json`
4. Click **Import**

### Step 2: Configure Environment Variables

The collection has pre-configured variables that will automatically populate:

- `auth_token` - JWT token from login/register responses
- `user_id` - User ID from responses
- `uniqueEmail` - Auto-generated unique email
- `uniqueUniversityId` - Auto-generated unique university ID
- `uniqueRegistrationNumber` - Auto-generated vehicle registration number

### Step 3: Run the Tests

#### Test 1: Register New User

1. **Open**: `Register` request
2. **Click**: Send
3. **Expected Response**:
   ```json
   {
     "success": true,
     "message": "Registration successful",
     "token": "eyJhbGciOiJIUzUxMi...",
     "user": {
       "id": 1,
       "email": "user..@sliit.lk",
       "fullName": "John Doe",
       "universityId": "IT...",
       "phoneNumber": "0712345678",
       "faculty": "Faculty of Computing",
       "userType": "STUDENT",
       "roles": ["USER"],
       "vehicles": [
         {
           "id": 1,
           "vehicleType": "CAR",
           "registrationNumber": "CAR-...",
           "isActive": true
         }
       ]
     }
   }
   ```
4. **Verify**: Status code is **201 Created**
5. **Check Tests**: All test cases pass (green checkmarks)

#### Test 2: Login

1. **Open**: `Login` request
2. **Click**: Send
3. **Expected Response**: Similar to register, with status **200 OK**
4. **Verify**: Token is stored in the environment
5. **Check Tests**: All test cases pass

#### Test 3: Duplicate Email Validation

1. **Open**: `Register - Duplicate Email` request
2. **Click**: Send
3. **Expected Response**:
   ```json
   {
     "success": false,
     "message": "Email already registered",
     "token": null,
     "user": null
   }
   ```
4. **Verify**: Status code is **400 Bad Request**

#### Test 4: Duplicate University ID Validation

1. **Open**: `Register - Duplicate University ID` request
2. **Click**: Send
3. **Expected Response**: Error message about University ID
4. **Verify**: Status code is **400 Bad Request**

#### Test 5: Login with Non-existent User

1. **Open**: `Login - User Not Found` request
2. **Click**: Send
3. **Expected Response**: "User not found" message
4. **Verify**: Status code is **401 Unauthorized**

---

## 🌐 Frontend Manual Testing

### Test 1: Register Page

1. Navigate to: **http://localhost:3000/register**
2. **Complete the form**:
   - Full Name: John Doe
   - University ID: IT001234
   - Phone: 0712345678
   - Faculty: Faculty of Computing
   - User Type: STUDENT
   - Vehicle Type: CAR
   - Registration Number: ABC-2024
3. **Click**: "Sign in with Google" button
4. **Select**: Your Google account (SLIIT account recommended)
5. **Verify**: Google account is linked
6. **Click**: "Create Account"
7. **Expected**: Redirect to dashboard with success message

### Test 2: Login Page

1. Navigate to: **http://localhost:3000/login**
2. **Click**: "Sign in with Google"
3. **Select**: The same Google account used in registration
4. **Expected**: 
   - USER → Redirect to `/dashboard`
   - ADMIN → Redirect to `/admin/dashboard`
5. **Verify**: Token is stored in localStorage

### Test 3: Form Validation

Try these on the Register page:

- **Empty fields**: Should show validation errors
- **Invalid email**: Should reject malformed emails
- **Invalid phone**: Should require 10 digits
- **Duplicate email**: Should show "Email already registered"
- **Duplicate University ID**: Should show "University ID already registered"

---

## 📁 Project Structure

```
SmartPark-Campus/
├── backend/
│   ├── src/main/java/com/SmartPark/Campus/SmartPark/Campus/
│   │   ├── controller/
│   │   │   └── AuthController.java          # Auth endpoints
│   │   ├── service/
│   │   │   └── AuthService.java             # Business logic
│   │   ├── entity/
│   │   │   ├── User.java                    # User entity
│   │   │   ├── Role.java                    # Role entity
│   │   │   └── Vehicle.java                 # Vehicle entity
│   │   ├── dto/
│   │   │   ├── RegisterRequest.java         # Register DTO
│   │   │   ├── LoginRequest.java            # Login DTO
│   │   │   └── AuthResponse.java            # Auth response DTO
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── RoleRepository.java
│   │   │   └── VehicleRepository.java
│   │   ├── util/
│   │   │   └── JwtTokenProvider.java        # JWT utilities
│   │   └── SmartParkCampusApplication.java  # Main app
│   ├── pom.xml                              # Dependencies
│   └── src/main/resources/
│       └── application.properties           # Configuration
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js                     # Login page
│   │   │   └── Register.js                  # Register page
│   │   ├── components/
│   │   │   ├── InputField.js                # Text input component
│   │   │   ├── Button.js                    # Button component
│   │   │   ├── Toast.js                     # Toast notification
│   │   │   ├── VehicleTypeBadge.js          # Vehicle type selector
│   │   │   └── FilterDropdown.js            # Dropdown component
│   │   ├── services/
│   │   │   └── authService.js               # API service
│   │   ├── App.js                           # Main app with routing
│   │   └── index.js                         # Entry point
│   └── package.json                         # Dependencies
│
└── SmartPark_Campus_Auth_API.postman_collection.json  # API tests
```

---

## 🔑 API Endpoints

### 1. Register User

**POST** `/api/auth/register`

**Request**:
```json
{
  "fullName": "John Doe",
  "email": "john@sliit.lk",
  "universityId": "IT001234",
  "phoneNumber": "0712345678",
  "faculty": "Faculty of Computing",
  "userType": "STUDENT",
  "vehicleType": "CAR",
  "vehicleRegistrationNumber": "ABC-2024",
  "googleId": "123456789",
  "fullName": "John Doe"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "jwt_token_here",
  "user": { ... }
}
```

### 2. Login User

**POST** `/api/auth/login`

**Request**:
```json
{
  "googleId": "123456789",
  "email": "john@sliit.lk",
  "fullName": "John Doe",
  "imageUrl": "https://example.com/profile.jpg"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": { ... }
}
```

### 3. Get Current User

**GET** `/api/auth/me`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User found",
  "user": { ... }
}
```

---

## 🐛 Troubleshooting

### Issue: "CORS error" in frontend

**Solution**: Check that backend is running on port 8080 with CORS enabled

### Issue: "Database connection failed"

**Solution**: 
1. Ensure MySQL is running
2. Check database credentials in `application.properties`
3. Verify database `smartpark_campus` exists

### Issue: Google login not working

**Solution**:
1. Verify Google Client ID in both frontend App.js and backend
2. Check that Google OAuth is properly configured
3. Ensure redirect URI matches configuration

### Issue: "Module not found" in frontend

**Solution**:
```bash
cd frontend
npm install
npm start
```

### Issue: Port 8080 or 3000 already in use

**Solution**:
```bash
# Windows - Find process using port
netstat -ano | findstr :8080

# Kill process
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8080
kill -9 <PID>
```

---

## 📝 Testing Checklist

- ✅ Backend starts without errors
- ✅ Database tables are created automatically
- ✅ Frontend loads at localhost:3000
- ✅ Register page displays correctly
- ✅ Google OAuth button works
- ✅ Form validation works
- ✅ Register API endpoint works (Postman)
- ✅ Login API endpoint works (Postman)
- ✅ Duplicate email validation works
- ✅ Duplicate university ID validation works
- ✅ Non-existent user login fails
- ✅ Token is generated and stored
- ✅ User data is returned correctly
- ✅ Dashboard redirects work

---

## 🔐 Security Notes

- **Passwords**: Not implemented in this version (OAuth only)
- **JWT Secret**: Change `jwt.secret` in properties before production
- **CORS**: Currently allows all origins - restrict in production
- **Google OAuth**: Keep Client Secret safe - don't commit to version control

---

## 📦 Dependencies

### Backend
- Spring Boot 4.0.5
- Spring Security
- Spring Data JPA
- MySQL Connector
- JWT (jjwt) 0.12.3

### Frontend
- React 19.2.4
- React Router 6.20.0
- Google OAuth (@react-oauth/google) 0.12.1
- Tailwind CSS 3.4.19

---

## 🚀 Next Steps

After completing login and register:

1. Implement dashboard pages (P03-P10)
2. Add user profile page with vehicle management
3. Implement parking zone listing
4. Add booking functionality
5. Implement admin dashboard
6. Add incident reporting

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API logs in backend console
3. Check browser console for frontend errors
4. Verify Postman collection for API specification

---

## ✨ Features Implemented

### P01 - Login Page
- ✅ Google OAuth 2.0 integration
- ✅ Role-based redirection
- ✅ Error handling
- ✅ Clean UI with Tailwind CSS
- ✅ Toast notifications

### P02 - Register Page
- ✅ Comprehensive form with validation
- ✅ Google OAuth integration
- ✅ Vehicle information collection
- ✅ Real-time validation
- ✅ Duplicate checking
- ✅ Error messages
- ✅ Success notifications

---

**Last Updated**: April 2, 2026  
**Version**: 1.0  
**Status**: Ready for Testing ✅
