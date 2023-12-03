# art98 🎨
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%236FDFFF)
![Mantine](https://img.shields.io/badge/Mantine-16B7FB?style=for-the-badge&logo=mantine&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

A real-time collaborative pixel art creation website inspired by [`r/place`](https://en.wikipedia.org/wiki/R/place).

![Screenshot of website](image.png)

[Live Preview ▶]()

> 🟡 **Note**: Website will take some time to load initially because the backend is hosted on the free tier of Render which causes the server shut down after 15 minutes of inactivity. Website may also not work properly on mobile.

> 🔴 **Disclaimer**: The artwork displayed on this website is user-generated and collaborative. Some content might be inappropriate or offensive. Please be aware that the images presented do not necessarily reflect my views.

## Features
- Canvas user interaction: zoom, pan, pinch
- Web sockets for real-time drawing
- Jamstack architecture
- Session-based user authentication and authorization
- Password hashing with bcrypt
- Supports 3 types of users (basic, premium, admin):
    | Privilege                                                | Basic             | Premium             | Admin     |
    | -------------------------------------------------------- | ----------------- | ------------------- | --------- |
    | Number of pixels that can be drawn                       | 1 every 5 minutes | 30  every 5 minutes | Unlimited |
    | Inspect identity of online users                         | ❌                 | ✅                   | ✅         |
    | Inspect individual tiles to see who placed them and when | ❌                 | ✅                   | ✅         |
    | Reset board                                              | ❌                 | ❌                   | ✅         |

## Architecture
Jamstack architecture
Built with MERN stack.

### Frontend
Frontend is hosted on Vercel free tier.
canvas API for drawing

### Backend
Database is hosted using MongoDB Atlas.
Backend in hosted on Render free tier. Server is shut down after 15 minutes of inactivity
- Only hashed passwords are stored in database

#### API Endpoints

| Endpoint            | Meaning                                                                     |
| ------------------- | --------------------------------------------------------------------------- |
| `GET /canvas`       | Get an array of colors representing the colors of each pixel on the canvas. |
| `GET /user` | Get data of currently authenticated user data.                                                              |

## Installation
> 🔴 **Prerequisites**: Git, Node.js, a cluster on MongoDB Atlas.

Install the project:
```bash
git clone git@github.com:creme332/art98.git
```

Navigate to the `client` directory and install dependencies:
```bash
npm install
```

Navigate to the `server` directory and install dependencies:
```bash
npm install
```

### Database setup
Create a database `art98` on MongoDB Atlas. Make your cluster available from any IP address.

In the `server` folder, create a `.env` file with the following contents:
```python
# Replace with mongo connection string
MONGO_STRING="mongodb+srv://cooluser:coolpassword@cluster.mongodb.net/art98?retryWrites=true&w=majority"
```

With your present working directory set to `server`, populate your database:
```bash
node populatedb
```

## Usage
To run the project locally, follow these instructions:

On one terminal, start frontend:

```bash
cd art98/client
npm run dev
```

On another terminal, start backend:

```bash
cd art98/server
npm run dev
```

Frontend is hosted on port 3000 and backend is hosted on port 4000. Open [http://localhost:3000](http://localhost:3000) in your browser to see running website.

## How to play
Select a color.
Right click on canvas to place a pixel.
Left click to move pan canvas.

## To-do
- [ ] Create API routes
  - [x] canvas reset
  - [x] get user data
  - [ ] test routes with Postman
- [x] Save user info to App.tsx upon login (fetch from database).
- [ ] save timestamp and username when pixel is updated
- [ ] Show reset canvas button only to admin
- [ ] Add ratelimiting for pixels
- [ ] Allow premium users to inspect identity of tile
- [ ] Add use demo account option in regiser and login page
- [ ] add a confirmPassword field to your sign-up form and then validate it using a custom validator


- [ ] complete my own middleware
- [ ] Add `upgrade` button
- [ ] Use my middleware to secure API
- [ ] Ensure that form validation matches model validation on server
- [ ] Update backend URL value on server and client before deploying
- [ ] Run lighthouse report
- [ ] Download canvas option
- [ ] Remove any unused libraries

- [ ] Rewrite backend using typescript
## References
- https://josephg.com/blog/rplace-in-a-weekend/
- https://www.redditinc.com/blog/how-we-built-rplace/
- https://dev.to/novu/building-a-chat-app-with-socketio-and-react-2edj
- https://github.com/rknoll/draw
