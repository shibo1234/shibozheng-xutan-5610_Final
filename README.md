# Final Project Report

## Team

- Xu Tan
- Shibo Zheng

## Repository

- [GitHub Repo](https://github.com/shibo1234/shibozheng-xutan-5610_Final)

## Deployment

- [Live App on Render](https://shibozheng-xutan-5610-final.onrender.com)

## Video Demo

_(Link to be added)_

## Bonus Features

- Password Encryption

---

## 🧩 Challenges Faced

One of the biggest challenges we faced was managing real-time synchronization and shared game state between two players. Initially, we tried handling the entire game logic and board state on the frontend using game context. However, this approach introduced many bugs, especially in scenarios like:

1. Two players joining at different times.
2. Maintaining synchronized board states across clients.
3. Preventing invalid states such as simultaneous turns.

After several hours of debugging, we refactored the game logic to the backend and implemented RESTful APIs to manage game creation, joining, turn-taking, and status transitions. This made the backend the source of truth and significantly improved multiplayer stability.

That said, transitioning to a fully backend-driven model introduced new bugs around user authentication and session handling. We spent a lot of time troubleshooting issues related to login states and session cookies—especially when refreshing or reloading the page—only to find that the backend logic, not the cookie handling, was the root cause. Eventually, we did a complete refactor, moving all core game logic from the frontend to the backend and streamlining the API for easier debugging and maintenance.

---

## 💡 Future Improvements

If given more time, we would:

1. Add an online/offline status indicator for players in the All Games page.
2. Add a notification system to alert users when someone joins their created game.
3. Add filters to view games by status (Open, Active, Completed).
4. Strengthen authentication and authorization for game visibility and account management.
5. Allow users to opt in/out of appearing on the high score leaderboard.
6. Improve UI/UX using modern CSS frameworks like Tailwind CSS.
7. Implement game history and replay viewing.

---

## 🔍 Assumptions Made

We assumed:

1. Players would access the app via desktop or mobile browsers with JavaScript enabled.
2. For a new game creation, each player could only create at most one "Open" status room.
3. Games are limited to two players and cannot be resumed once completed.

---

## ⏱ Time Spent

- Idea discussion and planning: ~4 hours (Lots of aggre and disagree)
- Individual coding and debugging: ~25 hours per team member
