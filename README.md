# 🌍 Life-Saving Connector - Full Stack Application

A comprehensive Node.js + Express + React application for managing volunteers, blood donations, and organ donor registrations for International Volunteers Day 2025.

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
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs, CORS
- **Validation**: express-validator
- **File Upload**: multer
- **Email**: nodemailer

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Router**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Styling**: CSS3 with design system

---

## 📁 Project Structure

```
life-saving-connector/
├── server/                          # Backend (Node.js + Express)
│   ├── config/                      # Configuration files
│   ├── models/                      # MongoDB schemas
│   │   ├── User.js
│   │   ├── VolunteerProfile.js
│   │   ├── BloodDonor.js
│   │   ├── OrganDonor.js
│   │   ├── Opportunity.js
│   │   └── Application.js
│   ├── routes/                      # API routes
│   │   ├── auth.js                 # Authentication
│   │   ├── volunteers.js           # Volunteer operations
│   │   ├── blood.js                # Blood donation
│   │   ├── organ.js                # Organ donation
│   │   └── dashboard.js            # Dashboard stats
│   ├── controllers/                 # Business logic
│   ├── middleware/                  # Authentication, error handling
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/                       # Utility functions
│   ├── server.js                    # Main server file
│   ├── package.json
│   └── .env                         # Environment variables
│
└── client/                          # Frontend (React + Vite)
    ├── src/
    │   ├── components/             # Reusable components
    │   │   ├── LoginForm.jsx
    │   │   └── RegisterForm.jsx
    │   ├── pages/                  # Page components
    │   │   ├── Dashboard.jsx
    │   │   ├── VolunteerPage.jsx
    │   │   ├── BloodDonationPage.jsx
    │   │   └── OrganDonationPage.jsx
    │   ├── api/                    # API calls
    │   │   └── api.js
    │   ├── store/                  # Zustand stores
    │   │   ├── authStore.js
    │   │   ├── volunteerStore.js
    │   │   ├── bloodStore.js
    │   │   └── organStore.js
    │   ├── App.jsx                 # Main app component
    │   ├── App.css                 # Global styles
    │   └── main.jsx                # Entry point
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── .env
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v16+ and npm
- MongoDB (Atlas or local)
- Git

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/life-saving-connector.git
cd life-saving-connector
```

**2. Setup Backend**
```bash
cd server
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/life-saver
JWT_SECRET=your_super_secret_jwt_key_change_in_production
NODE_ENV=development
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EOF

npm run dev
```

**3. Setup Frontend** (in new terminal)
```bash
cd client
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

npm run dev
```

**4. Access Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health

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

## 🔐 Security Features

✅ Password Hashing (bcrypt - 10 rounds)
✅ JWT Token Authentication
✅ CORS Protection
✅ Input Validation
✅ Environment Variables for Secrets
✅ MongoDB Injection Prevention
✅ Secure Headers

---

## 📦 Environment Variables

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_secret_key_here
NODE_ENV=development
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration
- [ ] User login
- [ ] Volunteer opportunity browsing
- [ ] Volunteer application
- [ ] Blood donor registration
- [ ] Organ donor registration
- [ ] Admin approval workflow
- [ ] Dashboard statistics
- [ ] Responsive design

### cURL Examples
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@test.com","password":"test123","userTypes":["volunteer"]}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"test123"}'
```

---

## 🚀 Deployment

### Deploy to Railway (Backend)
```bash
railway login
cd server
railway init
railway variables set MONGODB_URI="..."
railway up
```

### Deploy to Vercel (Frontend)
```bash
vercel
# Set VITE_API_URL in Vercel dashboard
```

### Docker Deployment
```bash
docker-compose up --build
```

---

## 📊 Database Schema

### Users Collection
- `_id`: ObjectId
- `firstName`, `lastName`: String
- `email`: String (unique)
- `password`: String (hashed)
- `phone`: String
- `userTypes`: [String]
- `isAdmin`: Boolean
- `createdAt`, `updatedAt`: Date

### Volunteer Profiles
- `userId`: ObjectId (ref: User)
- `skills`: [String]
- `volunteeredHours`: Number
- `badges`: [String]
- `applications`: [ObjectId]

### Blood Donors
- `userId`: ObjectId
- `bloodType`: String
- `donationHistory`: [Object]
- `totalDonations`: Number
- `nextEligibleDate`: Date

### Organ Donors
- `userId`: ObjectId
- `organs`: [String]
- `registrationStatus`: String (pending/approved/rejected)
- `adminApprovedBy`: String
- `adminApprovedAt`: Date

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support

- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join community discussions
- **Email**: support@life-saving-connector.com

---

## 🌟 Acknowledgments

Built for **International Volunteers Day 2025** with the theme **"Every Contribution Matters"**

- Inspired by real volunteer management systems
- Blood donation data from health organizations
- Organ donation information from medical authorities

---

## 📈 Roadmap

- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] SMS alerts for urgent needs
- [ ] Real-time notifications (Socket.io)
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Gamification enhancements
- [ ] Integration with health systems
- [ ] AI-powered volunteer matching
- [ ] Blockchain for donation records

---

**Made with ❤️ for life-saving contributions worldwide.**

Happy Volunteering! 🌍
