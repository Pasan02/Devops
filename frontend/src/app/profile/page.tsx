"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";

// Mock data for user profile analytics
const mockUserProfile = {
  user: {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    avatar: null,
    joinDate: "2023-01-15",
    lastLogin: "2024-09-08T10:30:00Z",
  },
  statistics: {
    totalWatched: 147,
    totalWatchTime: 12450, // in minutes
    moviesWatched: 89,
    tvShowsWatched: 58,
    currentStreak: 12,
    longestStreak: 25,
  },
  statusStats: [
    { _id: "watched", count: 147, totalRuntime: 12450 },
    { _id: "watchlist", count: 32, totalRuntime: 0 },
    { _id: "watching", count: 5, totalRuntime: 850 },
    { _id: "dropped", count: 3, totalRuntime: 180 },
  ],
  genreStats: [
    { _id: 28, count: 25, name: "Action" },
    { _id: 35, count: 22, name: "Comedy" },
    { _id: 18, count: 19, name: "Drama" },
    { _id: 878, count: 15, name: "Science Fiction" },
    { _id: 53, count: 12, name: "Thriller" },
    { _id: 27, count: 10, name: "Horror" },
    { _id: 10749, count: 8, name: "Romance" },
    { _id: 16, count: 7, name: "Animation" },
  ],
  yearlyStats: [
    { _id: 2024, count: 67, totalRuntime: 5670 },
    { _id: 2023, count: 80, totalRuntime: 6780 },
  ],
  monthlyStats: [
    { _id: 1, count: 8, totalRuntime: 720 },
    { _id: 2, count: 12, totalRuntime: 980 },
    { _id: 3, count: 10, totalRuntime: 890 },
    { _id: 4, count: 7, totalRuntime: 630 },
    { _id: 5, count: 9, totalRuntime: 780 },
    { _id: 6, count: 6, totalRuntime: 540 },
    { _id: 7, count: 8, totalRuntime: 720 },
    { _id: 8, count: 7, totalRuntime: 630 },
    { _id: 9, count: 5, totalRuntime: 450 },
  ],
  recentActivity: [
    {
      _id: "1",
      title: "Dune: Part Two",
      mediaType: "movie",
      status: "watched",
      watchedDate: "2024-09-07T20:00:00Z",
      userRating: 9,
    },
    {
      _id: "2",
      title: "The Bear",
      mediaType: "tv",
      status: "watching",
      addedDate: "2024-09-05T15:30:00Z",
    },
    {
      _id: "3",
      title: "Oppenheimer",
      mediaType: "movie",
      status: "watched",
      watchedDate: "2024-09-03T19:00:00Z",
      userRating: 8,
    },
  ],
  favoriteGenres: [28, 35, 18, 878, 53],
};

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }
  
  return `${hours}h ${mins}m`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "watched": return "bg-green-100 text-green-800";
    case "watching": return "bg-blue-100 text-blue-800";
    case "watchlist": return "bg-yellow-100 text-yellow-800";
    case "dropped": return "bg-red-100 text-red-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(mockUserProfile);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);

  const totalWatchTimeFormatted = formatTime(profile.statistics.totalWatchTime);
  const avgRatingWatched = profile.statusStats.find(s => s._id === "watched")?.count || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile.user.firstName[0]}{profile.user.lastName[0]}
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.user.firstName} {profile.user.lastName}
              </h1>
              <p className="text-gray-600 mb-4">{profile.user.email}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>Joined: {new Date(profile.user.joinDate).toLocaleDateString()}</span>
                <span>Last active: {new Date(profile.user.lastLogin).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{profile.statistics.totalWatched}</div>
                <div className="text-sm text-gray-600">Total Watched</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{profile.statistics.currentStreak}</div>
                <div className="text-sm text-gray-600">Current Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "overview", label: "Overview" },
                { id: "analytics", label: "Analytics" },
                { id: "activity", label: "Recent Activity" },
                { id: "preferences", label: "Preferences" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Watch Statistics */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status Overview */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Watch Status Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {profile.statusStats.map((stat) => (
                    <div key={stat._id} className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
                      <div className={`inline-block px-2 py-1 rounded text-sm font-medium capitalize ${getStatusColor(stat._id)}`}>
                        {stat._id}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Watch Time Stats */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Watch Time Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{totalWatchTimeFormatted}</div>
                    <div className="text-sm text-gray-600">Total Watch Time</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{profile.statistics.moviesWatched}</div>
                    <div className="text-sm text-gray-600">Movies Watched</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{profile.statistics.tvShowsWatched}</div>
                    <div className="text-sm text-gray-600">TV Shows Watched</div>
                  </div>
                </div>
              </div>

              {/* Monthly Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">2024 Monthly Activity</h2>
                <div className="space-y-3">
                  {profile.monthlyStats.map((month) => (
                    <div key={month._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="w-12 text-sm text-gray-600">{monthNames[month._id - 1]}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${(month.count / 15) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 min-w-0 ml-4">
                        {month.count} items ({formatTime(month.totalRuntime)})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Favorite Genres */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Genres</h2>
                <div className="space-y-3">
                  {profile.genreStats.slice(0, 6).map((genre, index) => (
                    <div key={genre._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium">{genre.name}</span>
                      </div>
                      <span className="text-sm text-gray-600">{genre.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Streaks */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Viewing Streaks</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Streak</span>
                    <span className="text-2xl font-bold text-green-600">{profile.statistics.currentStreak} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Longest Streak</span>
                    <span className="text-2xl font-bold text-blue-600">{profile.statistics.longestStreak} days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Yearly Comparison */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Yearly Comparison</h2>
              <div className="space-y-4">
                {profile.yearlyStats.map((year) => (
                  <div key={year._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold">{year._id}</span>
                      <span className="text-sm text-gray-600">{formatTime(year.totalRuntime)}</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600 mb-1">{year.count} items watched</div>
                    <div className="text-sm text-gray-600">
                      Average: {Math.round(year.totalRuntime / year.count)} min per item
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Genre Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Genre Distribution</h2>
              <div className="space-y-3">
                {profile.genreStats.map((genre) => {
                  const percentage = Math.round((genre.count / profile.statistics.totalWatched) * 100);
                  return (
                    <div key={genre._id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{genre.name}</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {profile.recentActivity.map((activity) => (
                <div key={activity._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.mediaType === 'movie' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-gray-600 capitalize">
                        {activity.mediaType} • {activity.status}
                        {activity.userRating && ` • Rated ${activity.userRating}/10`}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {(() => {
                      if (activity.watchedDate) {
                        return new Date(activity.watchedDate).toLocaleDateString();
                      }
                      if (activity.addedDate) {
                        return new Date(activity.addedDate).toLocaleDateString();
                      }
                      return 'Unknown date';
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Preferences & Settings</h2>
            <div className="space-y-6">
              <div>
                <div className="block text-sm font-medium text-gray-700 mb-2">
                  Favorite Genres
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.genreStats.slice(0, 5).map((genre) => (
                    <span
                      key={genre._id}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Settings
                </div>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />{" "}
                    Email notifications for new releases
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />{" "}
                    Weekly watch time summary
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />{" "}
                    Recommendations based on viewing history
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
