
# MERN E‑Learning Platform

A **full-stack e‑learning web application** built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Enables instructors to create courses and students to register, learn, and interact via quizzes and discussions.

---

## 🛠️ Features

* **User Authentication & Roles**

  * Secure sign-up/login with JWT
  * Role-based access (Admin, Instructor, Student)

* **Course Management**

  * Instructors can **create**, **edit**, and **delete** courses and lessons
  * Student enrollment workflow with course dashboards

* **Content Delivery**

  * Support for video lessons, documents, quizzes, and rich-text content

* **Interactive Tools**

  * Discussion forums per course
  * Quizzes and progress tracking

* **Admin Panel**

  * View/manage users (add/remove/block)
  * Approve or reject course submissions

* **Payment Integration (optional)**

  * Stripe/PayPal integration for paid courses

* **Responsive Design**

  * Adaptable UI for desktop and mobile

---

## 📚 Tech Stack

| Layer        | Stack                                                                                           |
| ------------ | ----------------------------------------------------------------------------------------------- |
| **Frontend** | React.js, Redux (or Context), React Router, Tailwind CSS |
| **Backend**  | Node.js, Express.js REST API                                                                    |
| **Database** | MongoDB with Mongoose                                                                           |
| **Auth**     | JWT and Passport.js (or custom middleware)                                                      |
| **Other**    | Bcrypt.js (password hashing), Nodemailer (email verification), Multer (uploads)                 |

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org) (v14+)
* [MongoDB](https://www.mongodb.com/) instance (local or Atlas)
* (Optional) API keys for Stripe/PayPal if implementing payments

### Quick Start

1. **Clone the repo**

   ```bash
   git clone https://github.com/LaxmanGhimire7/MERN-E_learning.git
   cd MERN-E_learning
   ```

2. **Setup Server**

   ```bash
   cd backend
   npm install
   
   # Edit .env with DB URI, JWT secret
   npm run dev
   ```

   Server will run at `http://localhost:5173 or 9000`

3. **Setup Client**

   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   npm start
   ```

   App accessible at `http://localhost:9000`

---

## 📦 Available Scripts

### Backend

* `npm run dev` – Run with Nodemon (auto-reload)
* `npm start` – Production start
* `npm test` – Run unit/integration tests

### Frontend

* `npm start` – Launch dev server with hot-reload
* `npm run build` – Create production build in `/build`

---

## 🗂️ Folder Structure

```
/
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middlewares
│   ├── uploads
│   ├── .env.example
│   └── app.js
└── frontend
    ├── src
    │   ├── admin
    │   ├── context (redux)
    │   ├── images
    │   ├── navbar etc.
    │   └── app.jsx
    └── .gitignore
```

---

## 🔧 Environment Variables

Make `.env` files by copying `.env.example` and filling in:

```env
# backend/.env
PORT: Port no in which the server is running
JWT_SECRET=your_jwt_secret


---

## 🧪 Testing

* Backend: `npm test` in `/backend` folder (Jest + Supertest)
* Frontend: `npm test` in `/frontend` (React Testing Library)

---

## 🖼️ Screenshots

![image](https://github.com/user-attachments/assets/f43b14d2-4fa1-43c3-a6b2-c5a4321b7de8)

![image](https://github.com/user-attachments/assets/f7879f6b-7d8a-435f-9a42-b9e5380f5ef2)

![image](https://github.com/user-attachments/assets/606bf902-27e3-498d-8c2d-6ec9115bdd3d)

![image](https://github.com/user-attachments/assets/92fc99ba-3a24-482a-9e25-60f4344378c0)

![image](https://github.com/user-attachments/assets/4ee81094-5fcc-4747-9234-5d9b47f0a2b9)

![image](https://github.com/user-attachments/assets/677b2ff3-6c5b-4ed1-9910-625600433ffd)




---

## 🚢 Deployment

### Production Build

* Build frontend:

  ```bash
  cd frontend
  npm run build
  ```
* Serve from backend:

  ```javascript
  app.use(express.static(path.join(__dirname, '../frontend/build')))
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html')))
  ```

### Platforms

* **Heroku**, **DigitalOcean App Platform**, **Render.com** can host full-stack apps easily.
* For file uploads/videos, combine with **Cloudinary** or **S3**.

---

## 🤝 Contributing

1. Fork this repository.
2. Create a feature branch: `git checkout -b feat/YourFeature`.
3. Commit your changes: `git commit -m 'feat: Description'`.
4. Push: `git push origin feat/YourFeature`.
5. Submit a Pull Request and link the related issue.

---

## 📄 License

This project is licensed under the **[MIT License](LICENSE)**—freely usable and modifiable.

---

## 👤 Maintainer

**\[Laxman B. Ghimire]** 

* GitHub: (https://github.com/LaxmanGhimire7))
* Email: [ghimirelaxman2155@gmail.com](mailto:ghimirelaxman2155@gmail.com)

---

### 🎉 Kudos

Inspired by multiple MERN e‑learning tutorials (e.g., SavajaPurva’s leveraging backend APIs and client setups) ([github.com][1], [github.com][2], [github.com][3]). Contributions welcome!

---

This README provides users and contributors a clear overview, setup instructions, and guidance to extend or deploy your platform. Let me know if you want it customized further!

[1]: https://github.com/savajapurva/E-Learning-MERN?utm_source=chatgpt.com "savajapurva/E-Learning-MERN - GitHub"
[2]: https://github.com/Sai-Chakradhar-Mahendrakar/Elearning-Platform-Using-MERN?utm_source=chatgpt.com "Sai-Chakradhar-Mahendrakar/Elearning-Platform-Using-MERN"
[3]: https://github.com/topics/mern?utm_source=chatgpt.com "mern · GitHub Topics"
