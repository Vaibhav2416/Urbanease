
```md
# 🏠 UrbanEase – Service Marketplace Application

UrbanEase is a **full-stack service marketplace application** inspired by platforms like *Urban Company*.  
It allows customers to book home services and providers to manage service requests through role-based dashboards.

This project is built to demonstrate **real-world full-stack architecture**, secure authentication, and clean API design.



## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication (Login / Register)
- Role-based access (`Customer`, `Provider`)
- Protected frontend routes
- Secure backend APIs using `request.user`

### 🧑‍💼 Customer Features
- Browse service categories & services
- Book a service
- View booking history
- Edit or cancel **pending bookings**
- Track booking status (Pending → Accepted → Completed)

### 🛠 Provider Features
- Provider dashboard
- View incoming service requests based on skills
- Accept bookings
- Update booking status (Accepted → In Progress → Completed)

### 🧠 Backend Highlights
- Custom user model
- Secure ownership checks
- Business rule enforcement at API level
- Clean modular app structure

---

## 🧩 Tech Stack

### Backend
- **Python**
- **Django**
- **Django REST Framework**
- **JWT Authentication (SimpleJWT)**
- **SQLite (for development)**

### Frontend
- **React (Vite)**
- **Tailwind CSS**
- **Axios**
- **React Router**
- **Context API**

---

## 📁 Project Structure

### Backend
```

backend/
├── apps/
│   ├── users/
│   ├── services/
│   ├── bookings/
│   └── providers/
├── core/
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── manage.py

```

### Frontend
```

frontend/
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── pages/
│   │   ├── customer/
│   │   └── provider/
│   ├── router/
│   └── main.jsx

```

---

## 🔄 Booking Flow (High Level)

1. Customer logs in
2. Customer selects a service
3. Booking is created with status **Pending**
4. Provider sees booking in dashboard
5. Provider accepts booking → **Accepted**
6. Provider marks job **In Progress**
7. Provider completes job → **Completed**
8. Customer sees status updates in booking history

---

## 🔒 Security Design

- JWT token sent via `Authorization` header
- `IsAuthenticated` enforced on protected APIs
- Booking ownership validated using `request.user`
- Customers cannot modify accepted bookings
- Providers can only manage assigned bookings

---

## 🧪 API Highlights

### Authentication
```

POST /api/auth/register/
POST /api/auth/login/
GET  /api/auth/me/

```

### Services
```

GET /api/services/
GET /api/services/categories/

```

### Bookings
```

POST   /api/bookings/create/
GET    /api/bookings/            # Customer bookings
PATCH  /api/bookings/<id>/       # Edit booking
DELETE /api/bookings/<id>/delete/

```

### Provider
```

GET   /api/bookings/provider/
PATCH /api/bookings/<id>/accept/
PATCH /api/bookings/<id>/status/

````

---

## 🧠 Key Concepts Demonstrated

- RESTful API design
- Role-based access control
- Secure data filtering using `request.user`
- Separation of concerns
- Frontend & backend integration
- Real-world business logic

---

## 🧑‍💻 How to Run Locally

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
````

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🎯 Why This Project?

This project is designed to showcase:

* Production-like backend validation
* Clean frontend architecture
* Practical marketplace workflows
* Interview-ready full-stack skills

---

## 📌 Future Improvements

* Reviews & ratings
* Payments integration
* Notifications
* Deployment (Render / Vercel)

---

## 👤 Author

**Vaibhav Sultane**
Full Stack Developer (Python | Django | React)

---

⭐ If you like this project, feel free to star the repository!

```

---

```
