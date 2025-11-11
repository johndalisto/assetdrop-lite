# AssetDrop Lite - Asset Submission Platform

A professional asset submission platform for musicians, speakers, and film presenters built for Hey Alec Productions.

## 🚀 Features

- **Role-based Submissions**: Support for Musicians, Speakers, and Film Presenters
- **File Upload**: Upload images, audio, video, and PDF files
- **Social Media Integration**: Collect social media profiles and online presence
- **Admin Dashboard**: Review and manage submissions with approval workflow
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Authentication**: Simple login system with role-based access

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Font Awesome for icons

### Backend
- Node.js with Express
- Airtable integration for data persistence
- Multer for file uploads
- Joi for validation
- Helmet for security

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Airtable account (optional - fallback to in-memory storage)

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Airtable (Optional)

1. Create an Airtable base with the following fields:
   - Name (Single line text)
   - Email (Email)
   - Phone (Phone number)
   - Bio (Long text)
   - Role (Single select: musician, speaker, film-presenter)
   - Status (Single select: Submitted, Approved, Rejected)
   - Instagram URL (URL)
   - Twitter URL (URL)
   - LinkedIn URL (URL)
   - Website URL (URL)
   - YouTube URL (URL)
   - TikTok URL (URL)
   - Created At (Date)

2. Copy `backend/config.example.js` to `backend/config.js` and fill in your Airtable credentials

### 3. Start the Application

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🔐 Demo Credentials

- **Admin Access**: admin@heyalec.com / admin123
- **User Access**: Any email / any password

## 📁 Project Structure

```
assetdrop-lite/
├── backend/
│   ├── src/
│   │   ├── config/          # Airtable configuration
│   │   ├── routes/          # API routes
│   │   ├── services/        # File upload service
│   │   ├── storage/         # Data storage abstraction
│   │   └── server.js        # Express server
│   └── uploads/             # File upload directory
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   └── types/           # TypeScript types
│   └── public/              # Static assets
└── shared/                  # Shared utilities
```

## 🎯 Usage

### For Submitters
1. Visit the homepage
2. Click "Start Your Submission"
3. Select your role (Musician, Speaker, or Film Presenter)
4. Fill out the form with your information
5. Upload your assets (headshots, music, videos, etc.)
6. Add your social media profiles
7. Submit your application

### For Administrators
1. Login with admin credentials
2. Visit the Dashboard
3. Review submitted applications
4. Approve or reject submissions
5. View detailed submission information

## 🔧 API Endpoints

- `GET /api/submissions` - Get all submissions
- `POST /api/submissions` - Create new submission
- `PUT /api/submissions/:id` - Update submission status
- `POST /api/files/upload` - Upload single file
- `POST /api/files/upload-multiple` - Upload multiple files
- `DELETE /api/files/:filename` - Delete file

## 🚀 Deployment

### Quick Deployment (Recommended)

**For 24/7 availability without local setup:**

1. **Deploy Frontend to Vercel (FREE)**
   - Go to [vercel.com](https://vercel.com)
   - Connect GitHub repository
   - Set root directory to `frontend`
   - Add environment variable: `REACT_APP_API_URL=https://your-backend-url.railway.app`
   - Deploy automatically

2. **Deploy Backend to Railway (FREE tier)**
   - Go to [railway.app](https://railway.app)
   - Connect GitHub repository
   - Set root directory to `backend`
   - Add environment variables (see below)
   - Generate domain

3. **Connect Services**
   - Update Vercel environment variable with Railway backend URL
   - Redeploy frontend

**See `DEPLOYMENT_GUIDE.md` for detailed instructions.**

### Environment Variables

**Backend (Railway):**
```
PORT=3001
NODE_ENV=production
JWT_SECRET=your-secret-key-here
CORS_ORIGINS=https://your-frontend.vercel.app
```

**Frontend (Vercel):**
```
REACT_APP_API_URL=https://your-backend.railway.app
```

### Manual Deployment

#### Backend Deployment
1. Set environment variables for production
2. Configure Airtable credentials (optional)
3. Deploy to your preferred platform (Heroku, Railway, etc.)

#### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy the `build` folder to your hosting platform

## 🛡️ Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation with Joi
- File type and size validation

## 📝 Development Notes

- The application uses in-memory storage as a fallback when Airtable is not configured
- File uploads are stored locally in the `uploads` directory
- Authentication is simplified for demo purposes
- All form validation is handled both client and server-side

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for Hey Alec Productions.

## 🆘 Support

For support or questions, please contact the development team.
# assetdrop-lite
