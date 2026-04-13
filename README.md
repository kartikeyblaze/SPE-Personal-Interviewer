# Personal Interviewer AI

An AI-driven personal interview preparation platform that uses Google Gemini AI to generate customized interview questions and simulate real-world interview scenarios.

## Features

- **AI Question Generation**: Uses Google Gemini 1.5 Flash to generate industry-standard questions based on a specific topic or syllabus.
- **Simulated Interview Environment**: Integrated with Speech-to-Text and Text-to-Voice for a natural interview experience.
- **Progress Tracking**: Users can save their interview sessions and review past performance on the results page.
- **Secure Authentication**: JWT-based authentication for secure user sessions and data management.
- **Responsive UI**: A modern, clean user interface built with React and Vite.

## Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Routing**: React Router DOM
- **Speech**: React Speech Recognition, Web Speech API
- **State Management**: React Context API
- **Communication**: Axios for API calls

### Backend
- **Server**: Node.js with Express.js
- **Database**: MongoDB (Mongoose ODM)
- **AI Integration**: Google Generative AI (Gemini 1.5 Flash)
- **Security**: JSON Web Tokens (JWT) & Bcrypt for password hashing

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance
- Google Gemini API Key (Get one from [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Personal-Interviewer
   ```

2. **Backend Setup:**
   - Navigate to the server directory:
     ```bash
     cd server
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `server` folder:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     API_KEY_GEMINI=your_gemini_api_key
     JWT_SECRET=your_jwt_secret_key
     ```
   - Start the server:
     ```bash
     npm run start
     ```

3. **Frontend Setup:**
   - Navigate to the frontend directory:
     ```bash
     cd ../my-vite-app
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the development server:
     ```bash
     npm run dev
     ```

---

## Directory Structure

```text
Personal-Interviewer/
├── my-vite-app/           # React frontend (Vite)
│   ├── src/
│   │   ├── components/    # UI components (Interview, Login, Results, etc.)
│   │   ├── api/           # API service layers
│   │   └── App.jsx        # Routing and entry point
├── server/                # Node.js backend
│   ├── controllers/       # Business logic (User & Interview management)
│   ├── models/            # MongoDB Schemas (User, Chat, Questions)
│   ├── routes/            # API Endpoints
│   ├── config/            # Database configuration
│   └── server.js          # Entry point
└── README.md
```

## How to Use

1. **Sign Up / Login**: Create an account or log in with your credentials.
2. **Start Interview**: Navigate to the interview section and specify a topic (e.g., OSI Models, React Hooks).
3. **Mock Interview**: The AI will generate questions. Use the voice input to respond.
4. **View Results**: Check the results section to see your performance history and saved interview data.

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the ISC License.
