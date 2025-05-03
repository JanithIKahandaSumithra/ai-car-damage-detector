# 🚗  AI-Powered Car Damage Detection and Garage Recommendation System
> A Final Year Research Project – Bachelor of Information Technology  
> Developed by K.P. Janith Induwara Kahanda Sumithra

---

## 🧩 Overview

This project addresses the real-world problem faced by vehicle owners in Sri Lanka: the **difficulty of identifying and locating suitable garages or repair centers for exterior car damages**. The system leverages **machine learning** and a modern **web application** to streamline this process and deliver a more intelligent, efficient, and user-friendly experience.

---

## 🎯 Problem Statement

Car owners often face challenges when trying to find garages that can repair specific types of exterior car damages. This results in wasted time, lack of transparency, and delays in repairs. The lack of an automated system that can:
- **Identify the type of damage** from an image,
- **Recommend suitable garages**, and
- **Provide online communication and booking** facilities  
  is a major gap in the current ecosystem.

---

## 💡 Solution

The proposed solution is a web-based system that allows users to:
- Upload an image of their damaged car,
- Identify multiple types of exterior damages using a trained ML model,
- View garages that can fix those specific damages,
- Book appointments online, and
- Chat with garages to clarify repair details.

Garage owners can also register on the platform, define their service types, manage appointments, and respond to users.

---

## ⚙️ Key Features

### For Car Owners:
- ✅ User Registration & Login  
- 📷 Upload Car Images  
- 🧠 Automatic Damage Detection using ML  
- 🏪 View Recommended Garages  
- 📅 Book Repair Appointments  
- 💬 Real-Time Chat with Garages  

### For Garage Owners:
- 🛠️ Register Garage Profile & Services  
- 📥 Manage Appointment Requests  
- 🟢 Accept / 🔴 Reject Appointments  
- 💬 Communicate with Users  

---

## 🧠 Machine Learning Model

A custom-trained **multi-label image classification** model using **PyTorch** and **ResNet50** architecture. The model is capable of identifying 14 types of exterior car damage from a single image.

### Supported Damage Types:
1. Bonnet Dent  
2. Boot Dent  
3. Door Outer Dent  
4. Fender Dent  
5. Front Bumper Dent  
6. Front Windscreen Damage  
7. Headlight Damage  
8. Quarter Panel Dent  
9. Rear Bumper Dent  
10. Rear Windscreen Damage  
11. Roof Dent  
12. Running Board Damage  
13. Side Mirror Damage  
14. Taillight Damage  

---

## 🧱 Tech Stack

| Layer        | Technology                       |
|--------------|----------------------------------|
| Frontend     | React + Vite + Tailwind CSS      |
| Backend      | Node.js + Express.js             |
| Database     | MySQL                            |
| Machine Learning | PyTorch + ResNet50           |
| Authentication | JWT (JSON Web Tokens)          |
| Chat System  | Socket.IO                        |

---

## 🔧 System Architecture

1. **Frontend**: React app with secure login, image upload, and dynamic UI.
2. **Backend**: Node.js API handles auth, database operations, ML inference, and chat.
3. **ML Inference**: Car image is sent to a model endpoint which returns predicted damage labels.
4. **Recommendation Engine**: Backend matches predicted labels with garages' capabilities.
5. **Database**: Stores user data, garage info, repair types, appointments, and chat history.



