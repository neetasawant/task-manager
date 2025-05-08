Check out the site here:
https://task-manager-8tsr.vercel.app/

Setup Instructions:
1. Clone the Repo
git clone https://github.com/neetasawant/task-manager.git
cd task-manager

2. Backend Setup
	cd backend
npm install
Edit .env file to add mongodb uri

Start the backend locally: 
	node server.js
It should run on http://localhost:5000

3. Frontend Setup
cd ../frontend
npm install

Run the frontend locally:
	npm run dev
	It should run on http://localhost:3000

Approach Explanation
Frontend: Built with Next.js using the App Router and server components. Communicates with backend via environment-based API URLs.


Backend: Built with Express.js, connects to MongoDB Atlas, and exposes RESTful API endpoints (/api/tasks, etc.).


Data Handling: JSON-based communication with fetch or Axios from frontend to backend.
Features
Create, read, update, and delete tasks


Clean UI with responsive design


API integrated with real MongoDB Atlas database







