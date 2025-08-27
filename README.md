# 📸 Photogram - Instagram Clone

A full-stack Instagram clone built with React, Node.js, and MongoDB featuring modern UI/UX and real-time functionality.

## 🚀 Features

- **Authentication**: Secure JWT-based authentication
- **Real-time Messaging**: Socket.IO powered chat system
- **Story Feature**: 24-hour expiring stories with progress rings
- **Interactive Polls**: Create and vote on polls
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Mobile-first responsive layout
- **Image Upload**: Cloudinary integration for image storage
- **Real-time Notifications**: Live updates for likes, comments, messages
- **Analytics Dashboard**: User engagement metrics
- **Modern UI/UX**: Glass morphism, animations, and micro-interactions

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **Socket.IO Client** for real-time features
- **Radix UI** for accessible components
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Socket.IO** for real-time communication
- **JWT** for authentication
- **Cloudinary** for image storage
- **Multer** for file uploads

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB database

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Arpitrai073/Photogram.git
   cd Photogram
   ```

2. **Install dependencies**
   ```bash
   npm install
   npm install --prefix frontend
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PORT=3000
   URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🚀 Deployment

### Render Deployment

1. **Connect your GitHub repository** to Render
2. **Create a new Web Service**
3. **Configure the service**:
   - **Build Command**: `npm install && npm install --prefix frontend && npm run build --prefix frontend`
   - **Start Command**: `npm start`
   - **Environment**: Node

4. **Set Environment Variables**:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `NODE_ENV`: `production`
   - `URL`: Your Render deployment URL

5. **Deploy** and wait for the build to complete

### Alternative Deployment Options

- **Vercel**: Deploy frontend separately
- **Railway**: Full-stack deployment
- **Heroku**: Traditional deployment

## 📱 Features Overview

### Core Features
- ✅ User authentication and authorization
- ✅ Create, edit, and delete posts
- ✅ Like and comment on posts
- ✅ Follow/unfollow users
- ✅ Real-time messaging
- ✅ Story creation and viewing
- ✅ Poll creation and voting
- ✅ Dark mode toggle
- ✅ Responsive design

### Advanced Features
- ✅ Real-time notifications
- ✅ Image optimization
- ✅ Analytics dashboard
- ✅ Message reactions
- ✅ Double-tap to like
- ✅ Modern post detail modal
- ✅ Native sharing
- ✅ Haptic feedback

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/user/register` - User registration
- `POST /api/v1/user/login` - User login
- `POST /api/v1/user/logout` - User logout
- `GET /api/v1/user/profile/:id` - Get user profile

### Posts
- `POST /api/v1/post/addpost` - Create new post
- `GET /api/v1/post/all` - Get all posts
- `POST /api/v1/post/like/:id` - Like/unlike post
- `POST /api/v1/post/vote` - Vote on poll

### Messages
- `POST /api/v1/message/send/:id` - Send message
- `GET /api/v1/message/all/:id` - Get conversation messages

## 🎨 UI/UX Features

- **Glass Morphism**: Modern backdrop blur effects
- **Smooth Animations**: CSS transitions and keyframes
- **Micro-interactions**: Hover effects and feedback
- **Accessibility**: ARIA labels and keyboard navigation
- **Mobile-First**: Responsive design for all devices

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation and sanitization
- Secure file upload handling

## 📊 Performance Optimizations

- Image compression with Sharp
- Lazy loading for images
- Code splitting with Vite
- Optimized bundle size
- CDN integration for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Arpit Rai**
- GitHub: [@Arpitrai073](https://github.com/Arpitrai073)

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Socket.IO for real-time functionality
- Cloudinary for image management
- All contributors and supporters

---

**Built with ❤️ for the developer community**
