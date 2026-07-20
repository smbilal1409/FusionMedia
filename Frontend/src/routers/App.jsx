// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext.jsx";
import ProtectedRoute from "../routers/protectedroutes.jsx";
import MainLayout from "../components/layouts/Mainlayout.jsx";

// Auth pages (no layout)
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";
// Pages
import Home         from "../pages/Feed/Home.jsx";
import VideoPlayer  from "../pages/Video/VideoPlayer.jsx";
import UploadVideo  from "../pages/Video/UploadVideo.jsx";
import UserProfile  from "../pages/Profile/userprofile.jsx";
import ChannelDash  from "../pages/Dashboard/channeldash.jsx";
import Settings     from "../pages/Settings/Settings.jsx";
import LikedVideos  from "../pages/LIked/likedvideo.jsx";
import WatchHistory from "../pages/History/watchhistory.jsx";
import TweetFeed     from "../pages/Tweets/Tweetfeed.jsx";
import Subscriptions from "../pages/Subscription/subscription.jsx";
import PlaylistView  from "../pages/Playlist/playlistview.jsx";
import { ToastProvider } from "../components/UI/Toast.jsx";
import PlaylistsList from "../pages/Playlist/playlistlist.jsx";
import Search        from "../pages/Search/Search.jsx";
// import NotFound      from "./pages/NotFound";

const ProtectedPage = ({ children }) => (
  <ProtectedRoute>
    <MainLayout>{children}</MainLayout>
  </ProtectedRoute>
);

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected */}
            <Route path="/"                     element={<ProtectedPage><Home /></ProtectedPage>} />
            <Route path="/video/:videoId"        element={<ProtectedPage><VideoPlayer /></ProtectedPage>} />
            <Route path="/upload"               element={<ProtectedPage><UploadVideo /></ProtectedPage>} />
            <Route path="/profile/:username"    element={<ProtectedPage><UserProfile /></ProtectedPage>} />
            <Route path="/dashboard"            element={<ProtectedPage><ChannelDash /></ProtectedPage>} />
            <Route path="/settings"             element={<ProtectedPage><Settings /></ProtectedPage>} />
            <Route path="/liked"                element={<ProtectedPage><LikedVideos /></ProtectedPage>} />
            <Route path="/history"              element={<ProtectedPage><WatchHistory /></ProtectedPage>} />
            <Route path="/tweets"               element={<ProtectedPage><TweetFeed /></ProtectedPage>} />
            <Route path="/subscriptions"        element={<ProtectedPage><Subscriptions /></ProtectedPage>} />
            <Route path="/playlists" element={<ProtectedPage><PlaylistsList /></ProtectedPage>} />
          <Route path="/playlist/:playlistId" element={<ProtectedPage><PlaylistView /></ProtectedPage>} />
            <Route path="/search"               element={<ProtectedPage><Search /></ProtectedPage>} />

            {/* 404 */}
         <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
// const ProtectedPage = ({ children }) => (
//   <ProtectedRoute>
//     <MainLayout>{children}</MainLayout>
//   </ProtectedRoute>
// );
 
// export default function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <Routes>
//           {/* Public */}
//           <Route path="/login"    element={<Login />} />
//           <Route path="/register" element={<Register />} />
 
//           {/* Protected — all wrapped in Navbar + Sidebar */}
//           <Route path="/"                     element={<ProtectedPage><Home /></ProtectedPage>} />
//           <Route path="/video/:videoId"        element={<ProtectedPage><VideoPlayer /></ProtectedPage>} />
//           <Route path="/upload"               element={<ProtectedPage><UploadVideo /></ProtectedPage>} />
//           <Route path="/profile/:username"    element={<ProtectedPage><UserProfile /></ProtectedPage>} />
//           <Route path="/dashboard"            element={<ProtectedPage><ChannelDash /></ProtectedPage>} />
//           <Route path="/settings"             element={<ProtectedPage><Settings /></ProtectedPage>} />
//           <Route path="/liked"                element={<ProtectedPage><LikedVideos /></ProtectedPage>} />
//           <Route path="/history"              element={<ProtectedPage><WatchHistory /></ProtectedPage>} />
//           <Route path="/tweets"               element={<ProtectedPage><TweetFeed /></ProtectedPage>} />
//           <Route path="/subscriptions"        element={<ProtectedPage><Subscriptions /></ProtectedPage>} />
//           <Route path="/playlist/:playlistId" element={<ProtectedPage><PlaylistView /></ProtectedPage>} />
 
//           {/* Catch-all */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }
 // src/App.jsx — FINAL POLISHED VERSION