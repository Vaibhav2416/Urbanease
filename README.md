
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
