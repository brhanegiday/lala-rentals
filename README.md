# 🏠 LALA Rental Booking Platform

A **Next.js** rental booking platform with **Google Authentication (NextAuth.js)**, **Prisma & PostgreSQL**, and a clean UI using **ShadCN**.  
Users can sign in with Google, list properties (Hosts), and book rentals (Renters).

---

## 🚀 **Features**

✅ **Google Sign-In** using NextAuth  
✅ **User Roles** (`HOST` and `RENTER`)  
✅ **Property Listings** (Create, Update, Delete)  
✅ **Booking System** (Prevents double booking)  
✅ **Secure API with NextAuth & Prisma**  
✅ **Modern UI with ShadCN & TailwindCSS**

---

## 📂 **Project Structure**

```
/rental-app
│── prisma/ # Prisma database schema & migrations
│── public/img/ # Property images
│── app/ # App Router (Next.js 13+)
│   │── api/ # API routes
│   │   ├── auth/ # NextAuth authentication
│   │   ├── properties/ # Property listing API
│   │   ├── bookings/ # Booking API
│── components/ # UI Components (ShadCN)
│── lib/ # Utility functions & Prisma Client
│── pages/ # (If using Pages Router)
│── styles/ # Global styles
│── .env # Environment variables
│── next.config.js # Next.js configuration
│── tailwind.config.js # TailwindCSS configuration
│── README.md # Project documentation
```

---

## 🛠 **Tech Stack**

-   **Frontend**: Next.js 14, TypeScript, ShadCN, TailwindCSS
-   **Backend**: Next.js API Routes, Prisma ORM
-   **Database**: PostgreSQL
-   **Authentication**: NextAuth (Google Sign-In)
-   **Deployment**: Vercel (Frontend), Railway/Supabase (DB)

---

## 🔧 **Setup & Installation**

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/brhanegiday/lala-rentals.git
cd lala-rentals
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Configure Environment Variables**

Create a `.env` file in the root directory and add the following:

```ini
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/lala_rentals"
NEXTAUTH_SECRET="your_secret_key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### **4️⃣ Set Up PostgreSQL**

If PostgreSQL is installed locally, create the database manually:

```sh
psql -U postgres -c "CREATE DATABASE lala_rentals;"
```

Or, if using Docker, start a PostgreSQL container:

```sh
docker run --name postgres-container -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=lala_rentals -p 5432:5432 -d postgres
```

### **5️⃣ Run Database Migrations**

```sh
npx prisma migrate dev --name init
```

### **6️⃣ Seed the Database**

```sh
npx prisma db:seed
```
