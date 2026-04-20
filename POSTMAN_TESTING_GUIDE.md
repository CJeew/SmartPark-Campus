# 🧪 Postman Testing Guide - SmartPark Campus Auth API

## 📖 Complete Step-by-Step Testing Instructions

This guide walks you through testing all authentication endpoints using Postman.

---

## 📦 Prerequisites

- ✅ Backend running on `http://localhost:8080`
- ✅ MySQL database `smartpark_campus` created
- ✅ Postman installed
- ✅ Collection file: `SmartPark_Campus_Auth_API.postman_collection.json`

---

## 🚀 Initial Setup (One Time)

### Step 1: Import Collection into Postman

1. **Open Postman**
2. **Click** "Import" (top-left corner)
3. **Select** the file from your computer:
   ```
   SmartPark_Campus_Auth_API.postman_collection.json
   ```
4. **Click** "Import"
5. You should see collection with 5 requests:
   - Register
   - Login
   - Register - Duplicate Email
   - Register - Duplicate University ID
   - Login - User Not Found

### Step 2: Create Environment (Optional but Recommended)

1. **Click** "Environments" (left sidebar)
2. **Click** "Create"
3. **Name**: `SmartPark Dev`
4. **Add Variables**:
   ```
   auth_token: (empty, will be filled by tests)
   user_id: (empty)
   api_url: http://localhost:8080
   ```
5. **Save**

---

## 🧪 Test Execution

### Test 1: Register a New User ✨

**Expected Duration**: 2 seconds

**Steps:**

1. **Open** "Register" request from collection
   - You should see:
     - Method: POST
     - URL: `http://localhost:8080/api/auth/register`
     - Body: JSON with user details

2. **Review** Request Body:
   ```json
   {
     "fullName": "John Doe",
     "email": "{{uniqueEmail}}",
     "universityId": "{{uniqueUniversityId}}",
     "phoneNumber": "0712345678",
     "faculty": "Faculty of Computing",
     "userType": "STUDENT",
     "vehicleType": "CAR",
     "vehicleRegistrationNumber": "{{uniqueRegistrationNumber}}",
     "googleId": "123456789",
     "fullName": "John Doe"
   }
   ```

3. **Click** "Send" button

4. **Verify Response** (Status should be 201):
   ```
   201 Created
   ```

5. **Check Response Body**:
   ```json
   {
     "success": true,
     "message": "Registration successful",
     "token": "eyJhbGciOiJIUzUxMiJ9...",
     "user": {
       "id": 1,
       "email": "user20260402163333@sliit.lk",
       "fullName": "John Doe",
       "universityId": "IT12345",
       "phoneNumber": "0712345678",
       "faculty": "Faculty of Computing",
       "userType": "STUDENT",
       "roles": ["USER"],
       "vehicles": [
         {
           "id": 1,
           "vehicleType": "CAR",
           "registrationNumber": "CAR-5678",
           "isActive": true
         }
       ]
     }
   }
   ```

6. **Check Tests Tab**:
   - ✅ Status code is 201 Created
   - ✅ Response indicates success
   - ✅ Response has required properties
   - ✅ Token is valid JWT format
   - ✅ User object has required fields
   - ✅ User has USER role assigned
   - ✅ User has vehicle registered

   All should show **green checkmarks** ✅

7. **Verify Environment Variables** are populated:
   - Open "Environments" → "SmartPark Dev"
   - `auth_token` should now have a JWT token value
   - `user_id` should be `1`

---

### Test 2: Login with Registered User

**Expected Duration**: 2 seconds

**Steps:**

1. **Open** "Login" request
   - You should see:
     - Method: POST
     - URL: `http://localhost:8080/api/auth/login`

2. **Review** Request Body:
   ```json
   {
     "googleId": "123456789",
     "email": "{{login_email}}",
     "fullName": "{{login_fullName}}",
     "imageUrl": "https://example.com/profile.jpg"
   }
   ```
   These variables are auto-populated from previous register response

3. **Click** "Send" button

4. **Verify Response** (Status should be 200):
   ```
   200 OK
   ```

5. **Check Response Body**:
   ```json
   {
     "success": true,
     "message": "Login successful",
     "token": "eyJhbGciOiJIUzUxMiJ9...",
     "user": {
       "id": 1,
       "email": "user20260402163333@sliit.lk",
       "fullName": "John Doe",
       "universityId": "IT12345",
       "phoneNumber": "0712345678",
       "faculty": "Faculty of Computing",
       "userType": "STUDENT",
       "roles": ["USER"],
       "vehicles": [...]
     }
   }
   ```

6. **Check Tests Tab**:
   - ✅ Status code is 200 OK
   - ✅ Response indicates success
   - ✅ Response has required properties
   - ✅ Token is valid JWT format
   - ✅ User object has required fields
   - ✅ Response time is less than 1000ms

   All should show **green checkmarks** ✅

---

### Test 3: Try Registering Duplicate Email

**Expected Duration**: 2 seconds

**Steps:**

1. **Open** "Register - Duplicate Email" request
   - This uses the same email from the first register

2. **Check** Request Body:
   ```json
   {
     "fullName": "Jane Doe",
     "email": "{{uniqueEmail}}",  // Same email as previous user!
     "universityId": "IT99999",
     ...
   }
   ```

3. **Click** "Send" button

4. **Verify Response** (Status should be 400):
   ```
   400 Bad Request
   ```

5. **Check Response Body**:
   ```json
   {
     "success": false,
     "message": "Email already registered",
     "token": null,
     "user": null
   }
   ```

6. **Check Tests Tab**:
   - ✅ Status code is 400 Bad Request
   - ✅ Response indicates failure
   - ✅ Error message is appropriate

---

### Test 4: Try Registering Duplicate University ID

**Expected Duration**: 2 seconds

**Steps:**

1. **Open** "Register - Duplicate University ID" request
   - This uses the same university ID from first register

2. **Check** Request Body:
   ```json
   {
     "fullName": "Another Person",
     "email": "another@sliit.lk",
     "universityId": "{{uniqueUniversityId}}",  // Same as first!
     ...
   }
   ```

3. **Click** "Send" button

4. **Verify Response** (Status should be 400):
   ```
   400 Bad Request
   ```

5. **Check Response Body**:
   ```json
   {
     "success": false,
     "message": "University ID already registered",
     "token": null,
     "user": null
   }
   ```

---

### Test 5: Login with Non-existent User

**Expected Duration**: 2 seconds

**Steps:**

1. **Open** "Login - User Not Found" request
   - This tries to login with a Google ID that was never registered

2. **Check** Request Body:
   ```json
   {
     "googleId": "nonexistent-google-id",
     "email": "nonexistent@sliit.lk",
     "fullName": "Non Existent User",
     "imageUrl": "https://example.com/profile.jpg"
   }
   ```

3. **Click** "Send" button

4. **Verify Response** (Status should be 401):
   ```
   401 Unauthorized
   ```

5. **Check Response Body**:
   ```json
   {
     "success": false,
     "message": "User not found. Please register first.",
     "token": null,
     "user": null
   }
   ```

6. **Check Tests Tab**:
   - ✅ Status code is 401 Unauthorized
   - ✅ Response indicates failure
   - ✅ Error message mentions user not found

---

## 🔄 Running All Tests at Once

**Run Entire Collection**:

1. **Right-click** on collection name: "SmartPark Campus - Authentication API"
2. **Select** "Run Collection"
3. In the **Collection Runner**:
   - Select all requests
   - Click "Run SmartPark Campus - Authentication API"
4. The runner will execute all requests in sequence
5. View results with details about passes/failures

---

## 🔍 Inspecting Responses

### For Each Test:

1. **Response Section** (Bottom half):
   - **Status**: See HTTP status code and message
   - **Body**: Raw JSON response
   - **Headers**: Response headers (Content-Type, etc.)
   - **Cookies**: Any cookies set by server

2. **Tests Tab**:
   - See all assertions run
   - Green = passed ✅
   - Red = failed ❌

3. **Variables Tab**:
   - See environment variables populated by tests
   - Verify `auth_token`, `user_id` are set

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot POST /api/auth/register"

**Reason**: Backend not running
**Solution**: 
```bash
cd backend
mvnw spring-boot:run
```

### Issue: "Database connection refused"

**Reason**: MySQL not running or wrong credentials
**Solution**:
1. Start MySQL
2. Verify credentials in `application.properties`
3. Ensure database `smartpark_campus` exists

### Issue: "400 Bad Request - JSON parse error"

**Reason**: Invalid request body format
**Solution**:
1. Check request body is valid JSON
2. Ensure all required fields are present
3. Verify data types match (string, array, etc.)

### Issue: "Variables not populating"

**Reason**: Tests in previous requests didn't run successfully
**Solution**:
1. Run requests in order: Register → Login
2. Check if first request returned success
3. Check Tests tab to see if all tests passed

### Issue: "Email/UniversityID already registered" at first try

**Reason**: Previous records in database
**Solution**:
1. Drop and recreate database:
   ```sql
   DROP DATABASE smartpark_campus;
   CREATE DATABASE smartpark_campus;
   ```
2. Restart backend (creates tables automatically)
3. Run tests again

---

## 📊 Success Criteria

All tests passing means:

✅ Backend API is working correctly  
✅ Authentication logic is functioning  
✅ Database operations succeed  
✅ Validation rules enforced  
✅ JWT token generation works  
✅ CORS is properly configured  
✅ Error handling is appropriate  

---

## 📝 Example Test Output

```
SmartPark Campus - Authentication API

[PASS] Register
  - POST http://localhost:8080/api/auth/register
  - Status: 201 Created
  - ✅ Status code is 201 Created
  - ✅ Response indicates success
  - ✅ Response has required properties
  - ✅ Token is valid JWT format
  - ✅ User object has required fields
  - ✅ User has USER role assigned
  - ✅ User has vehicle registered
  - Result: PASS (7/7 tests passed)

[PASS] Login
  - POST http://localhost:8080/api/auth/login
  - Status: 200 OK
  - ✅ Status code is 200 OK
  - ✅ Response indicates success
  - ✅ Response has required properties
  - ✅ Token is valid JWT format
  - ✅ User object has required fields
  - ✅ Response time is less than 1000ms
  - Result: PASS (6/6 tests passed)

[PASS] Register - Duplicate Email
  - POST http://localhost:8080/api/auth/register
  - Status: 400 Bad Request
  - ✅ Status code is 400 Bad Request
  - ✅ Response indicates failure
  - ✅ Error message is appropriate
  - Result: PASS (3/3 tests passed)

[PASS] Register - Duplicate University ID
  - POST http://localhost:8080/api/auth/register
  - Status: 400 Bad Request
  - ✅ Error message mentions University ID
  - Result: PASS (1/1 tests passed)

[PASS] Login - User Not Found
  - POST http://localhost:8080/api/auth/login
  - Status: 401 Unauthorized
  - ✅ Status code is 401 Unauthorized
  - ✅ Response indicates failure
  - ✅ Error message mentions user not found
  - Result: PASS (3/3 tests passed)

═══════════════════════════════════════════════════
Total Tests: 20
Passed: 20 ✅
Failed: 0
Success Rate: 100%
═══════════════════════════════════════════════════
```

---

## 🎥 Quick Video Guide

1. **Register User** (30 seconds)
   - Open Register request
   - Click Send
   - Verify 201 status
   - Check all tests pass

2. **Login User** (30 seconds)
   - Open Login request
   - Click Send
   - Verify 200 status
   - Check token is set

3. **Test Validation** (30 seconds)
   - Open duplicate email test
   - Click Send
   - Verify 400 status
   - Check error message

---

## 🎓 Learning Points

### What the Tests Verify:

1. **Registration**:
   - User account creation works
   - Vehicle is registered
   - User role is assigned
   - Token is generated correctly

2. **Login**:
   - Authentication is secure
   - Correct user is retrieved
   - Token is valid
   - Response is fast

3. **Validation**:
   - Duplicate detection works
   - Error messages are clear
   - Appropriate HTTP status codes
   - Database constraints enforced

---

## ✨ Next Steps After Testing

1. ✅ Confirm all tests pass
2. ✅ Test with Postman collection (this guide)
3. ✅ Manually test frontend pages
4. ✅ Test email validation rules
5. ✅ Verify database records created
6. ✅ Check browser localStorage for token

Then move on to:
- P03 Profile Page
- P04 User Dashboard
- P05 Admin Dashboard

---

**Document Version**: 1.0  
**Last Updated**: April 2, 2026  
**Status**: Ready for Testing ✅
