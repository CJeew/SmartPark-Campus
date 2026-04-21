# ⚡ Quick Start Checklist - 30 Minutes Setup

## 🎯 Get Up and Running in 30 Minutes

Follow this checklist to have everything working and tested.

---

## ✅ Pre-Setup Validation (2 minutes)

- [ ] MySQL is installed and running
- [ ] Java 17+ is installed (`java -version`)
- [ ] Node.js 16+ is installed (`node --version`)
- [ ] npm is installed (`npm --version`)
- [ ] Have a SLIIT Google account ready

**IMPORTANT: Start MySQL First!**
```bash
# Verify MySQL is running
mysql -u root -p
# Enter password: 9228
# You should see: mysql>
# Type: EXIT
```

**Create Database** (if not done):
```bash
mysql -u root -p
# Enter password: 9228
CREATE DATABASE smartpark_campus;
EXIT;
```

---

## 🔧 Backend Setup (8 minutes)

### Environment Setup (Recommended)

`application.properties` now reads secrets from environment variables.

1. Copy `backend/.env.example` to `backend/.env`
2. Fill your own values for OAuth, JWT, and database connection
3. Run backend using the helper script below

**Terminal 1 - Backend**:

```bash
# 1. Navigate to backend
cd backend

# 2. Clean and install dependencies
mvnw clean install

# 3. Run the server (loads backend/.env automatically)
powershell -ExecutionPolicy Bypass -File .\start-backend.ps1
```

**Wait for**:
```
Started SmartParkCampusApplication in X.XXX seconds
```

✅ **Backend is ready** when you see the above message
- Check: http://localhost:8080 (may show 404, that's OK)

---

## 🎨 Frontend Setup (5 minutes)

**Terminal 2 - Frontend** (keep Terminal 1 running):

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

✅ **Frontend is ready** when:
- Browser opens automatically to `http://localhost:3000`
- You see the login page

---

## 🧪 Test API Endpoints (10 minutes)

### Method 1: Postman (Recommended)

1. **Open Postman**
2. **Import**: `SmartPark_Campus_Auth_API.postman_collection.json`
3. **Run** "Register" request → Verify 201 status ✅
4. **Run** "Login" request → Verify 200 status ✅
5. **Run** "Duplicate Email" test → Verify 400 status ✅

✅ **All tests should pass (green checkmarks)**

### Method 2: Manual Browser Testing

1. **Register Page**: `http://localhost:3000/register`
   - [ ] Click "Sign in with Google"
   - [ ] Fill form
   - [ ] Submit
   - [ ] Verify redirect to dashboard

2. **Login Page**: `http://localhost:3000/login`
   - [ ] Click "Sign in with Google"
   - [ ] Verify redirect to dashboard

---

## 📊 Verify Setup

### Check Backend:

**Verify database tables created**:
```bash
mysql -u root -p
# password: 9228
USE smartpark_campus;
SHOW TABLES;
# Should show: roles, users, vehicles, user_roles
```

### Check Frontend:

**Open Browser DevTools** (F12):
- [ ] Go to Application → Local Storage
- [ ] After login, should see `token` and `user` keys
- [ ] No console errors (Console tab)

### Check API:

**Post a request in Postman**:
- [ ] Register request returns status 201
- [ ] Response has `success`, `token`, `user` fields
- [ ] Login request returns status 200

---

## 🎯 Success Indicators

### ✅ You're Done When:

1. **Backend Running**
   - [ ] Terminal shows "Started SmartParkCampusApplication"
   - [ ] No database errors

2. **Frontend Running**
   - [ ] Browser shows login page at localhost:3000
   - [ ] No red errors in DevTools Console

3. **API Working**
   - [ ] Postman collection imports without errors
   - [ ] All 5 requests return proper status codes
   - [ ] Tests tab shows all green checkmarks

4. **Manual Test Complete**
   - [ ] Can register new user
   - [ ] Can login with registered user
   - [ ] Duplicate email validation works
   - [ ] Form validation works

---

## 📐 Quick Reference

| Service | URL | Status |
|---------|-----|--------|
| Backend API | http://localhost:8080 | Running ✅ |
| Frontend App | http://localhost:3000 | Running ✅ |
| Database | MySQL Local | Running ✅ |
| Google OAuth | Configured | Ready ✅ |

---

## 📚 Documentation Quick Links

| Document | Purpose |
|----------|---------|
| SETUP_AND_TESTING_GUIDE.md | Complete setup instructions |
| IMPLEMENTATION_SUMMARY.md | Overview of what was built |
| POSTMAN_TESTING_GUIDE.md | Step-by-step Postman tests |
| FRONTEND_TESTING_GUIDE.md | Manual browser testing |

---

## 🐛 If Something's Wrong

| Problem | Solution |
|---------|----------|
| **Backend won't start (Hibernate error)** | **MySQL is not running!** Start MySQL first with `mysql -u root -p`, then restart backend |
| Backend won't start | Check MySQL is running, database exists |
| Frontend won't start | Run `npm install` first |
| Port 8080/3000 in use | Kill process, check other apps |
| Google OAuth fails | Check Client ID in App.js matches config |
| API returns 500 error | Check backend console for stack trace |
| Postman import fails | Verify JSON file is valid |
| "Cannot connect to database" error | MySQL service is stopped - start it and restart backend |

---

## 📋 Testing Checklist

### Postman Tests (5 total):
- [ ] Register New User (201)
- [ ] Login (200)
- [ ] Duplicate Email (400)
- [ ] Duplicate University ID (400)
- [ ] User Not Found (401)

### Frontend Manual Tests:
- [ ] Register page loads
- [ ] Form validation works
- [ ] Google OAuth works
- [ ] Form submission succeeds
- [ ] Redirect to dashboard works
- [ ] Login page loads
- [ ] Can login with registered user
- [ ] localStorage has token after login

---

## 🎓 What You Have Implemented

**Backend** (Java Spring Boot):
- ✅ User, Role, Vehicle entities
- ✅ Authentication API endpoints
- ✅ JWT token generation
- ✅ Unique constraint validation
- ✅ Google OAuth support

**Frontend** (React):
- ✅ Login page with Google OAuth
- ✅ Register page with full form
- ✅ Form validation components
- ✅ Toast notifications
- ✅ Token & user storage

**Testing**:
- ✅ 5 Postman test cases
- ✅ Comprehensive validation testing
- ✅ Error handling verification

---

## ⏱️ Time Breakdown

- Database setup: 2 min
- Backend startup: 5 min
- Frontend startup: 3 min
- Postman testing: 10 min
- Manual testing: 10 min
- **Total: 30 minutes** ⚡

---

## 🚀 What's Next

After completing this setup:

1. ✅ Login and Register working (P01, P02)
2. ⏭️ Profile page (P03)
3. ⏭️ User dashboard (P04)
4. ⏭️ Admin dashboard (P05)
5. ⏭️ Parking zones (P06)
6. ⏭️ Booking system (P07-P10)
7. ⏭️ Incident reporting (P12-P14)
8. ⏭️ Admin features (P15-P19)

---

## 💡 Pro Tips

1. **Keep terminals visible** - Watch backend logs while testing
2. **Use incognito mode** - Easier to test multiple accounts
3. **Bookmark pages** - localhost:3000/login and /register
4. **Check console** - DevTools (F12) shows useful errors
5. **Postman collection** - Run all tests at once with Collection Runner

---

## 🎉 You're All Set!

Everything is configured and ready to test. Start with the backend, then frontend, then run Postman tests.

**Questions?** Check the detailed guides:
- SETUP_AND_TESTING_GUIDE.md
- POSTMAN_TESTING_GUIDE.md
- FRONTEND_TESTING_GUIDE.md

---

**Status**: ✅ READY TO DEPLOY  
**Last Check**: April 2, 2026  
**Version**: 1.0
