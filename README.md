![App Banner](https://cwb-video-demos.s3.us-east-2.amazonaws.com/general/banner+for+repo.png)

# Local-First Shopping List App

A cross-platform shopping list application built with modern technologies that enables real-time synchronization while maintaining local-first functionality.

🔍 Explore more innovative projects and tutorials at [codewithbeto.dev/projects](https://codewithbeto.dev/projects)

## 🚀 Video, Demo & Links

  <a href="https://youtu.be/HqOiB2tDM8Q">
    <img src="https://i.ytimg.com/vi_webp/HqOiB2tDM8Q/maxresdefault.webp" height="380" alt="YouTube Video Preview">
  </a>

- 📱 [iOS App Store](https://apps.apple.com/us/app/shopping-list-sync-share/id6739513017)
- 🌐 [Web Demo](https://quicksynclist.com/)
- 💻 [Project Details](https://codewithbeto.dev/projects/shopping-list-app)
- 📺 [Video Tutorial](https://youtu.be/HqOiB2tDM8Q)

## ⚡ Tech Stack

- [Expo](https://expo.dev/) - React Native framework
- [TinyBase](https://tinybase.org/) - Local-first database
- [Clerk](https://clerk.dev/) - Authentication & user management
- [Cloudflare](https://cloudflare.com/) - Edge computing & hosting

## 🛠️ Setup & Installation

### Client Setup (Expo)

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Configure environment variables:

   - Copy `.env.example` to `.env`
   - Fill in required values (see Environment Variables section)

4. Start the development server:
   ```bash
   npx expo start
   ```
   The app can be run on iOS, Android or Web using Expo Go.

### Server Setup (Synchronization)

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Start local development server:

   ```bash
   bun dev
   ```

4. Deploy to Cloudflare Workers:
   ```bash
   bun run deploy
   ```
