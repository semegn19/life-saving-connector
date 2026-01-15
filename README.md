# 🌍 Life-Saving Connector - Full Stack Application - In development

A comprehensive Node.js + Express + React application for managing volunteers, blood donations, and organ donor registrations for International Volunteers Day.

## 🚀 Features

### 🤝 Volunteer Management
- Browse volunteer opportunities
- Apply for opportunities with availability
- Track volunteer hours
- Earn badges and recognition
- View impact statistics
- Filter by category, urgency, location

### 🩸 Blood Donation
- Register as a blood donor
- Track blood type and donation frequency
- Record donation history
- View blood needs by type
- Find nearby donation centers
- Track next eligible donation date

### 🫀 Organ Donation
- Register as an organ donor
- Select organs willing to donate
- Admin approval workflow
- Status tracking
- View registered donors
- Manage pending requests

### 📊 Dashboard & Analytics
- Real-time impact statistics
- Personal contribution summary
- Badge/achievement system
- User profiles
- Donation history
- Application status tracking

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT 
- **Security**: CORS

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Router**: React Router v6
- **Styling**: CSS3 with design system

---

## 📚 API Documentation

### Authentication Endpoints

#### Register
```
POST /api/auth/register
Body: {
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "userTypes": ["volunteer", "blood-donor"]
}
Response: { token, user }
```

#### Login
```
POST /api/auth/login
Body: { "email": "john@example.com", "password": "password123" }
Response: { token, user }
```

#### Get Current User
```
GET /api/auth/me
Headers: { "Authorization": "Bearer TOKEN" }
Response: { user object }
```

### Volunteer Endpoints

#### Get All Opportunities
```
GET /api/volunteers/opportunities
Response: [{ id, title, description, ... }]
```

#### Apply for Opportunity
```
POST /api/volunteers/apply
Headers: { "Authorization": "Bearer TOKEN" }
Body: {
  "opportunityId": "60d5ec49c1234567890abcde",
  "motivation": "I want to help",
  "availability": "Weekends"
}
```

#### Get My Applications
```
GET /api/volunteers/my-applications
Headers: { "Authorization": "Bearer TOKEN" }
Response: [{ application objects }]
```

### Blood Donation Endpoints

#### Register as Blood Donor
```
POST /api/blood/register
Headers: { "Authorization": "Bearer TOKEN" }
Body: {
  "bloodType": "O+",
  "donationFrequency": "Every 6 weeks",
  "preferredCenter": "Central Blood Bank"
}
```

#### Record Donation
```
POST /api/blood/donation
Headers: { "Authorization": "Bearer TOKEN" }
Body: {
  "location": "Central Blood Bank",
  "bagCount": 1
}
```

#### Get Blood Needs
```
GET /api/blood/needs
Response: [{
  "bloodType": "O-",
  "urgency": "high",
  "needed": 150
}]
```

### Organ Donation Endpoints

#### Register as Organ Donor
```
POST /api/organ/register
Headers: { "Authorization": "Bearer TOKEN" }
Body: {
  "organs": ["Heart", "Liver", "Kidneys"]
}
```

#### Get Pending Registrations (Admin)
```
GET /api/organ/pending
Headers: { "Authorization": "Bearer ADMIN_TOKEN" }
```

#### Approve Donor (Admin)
```
POST /api/organ/approve/:id
Headers: { "Authorization": "Bearer ADMIN_TOKEN" }
```

### Dashboard Endpoints

#### Get Statistics
```
GET /api/dashboard/stats
Response: {
  "volunteers": 1247,
  "bloodDonations": 3891,
  "organDonors": 47,
  "totalHours": 12300
}
```

#### Get My Profile
```
GET /api/dashboard/my-profile
Headers: { "Authorization": "Bearer TOKEN" }
```

---


