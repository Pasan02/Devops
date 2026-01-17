"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { watchlistApi, authApi, movieApi } from "@/lib/api";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const formatTime = (minutes: number) => {
  if (!minutes) return "0m";
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
  const { userEmail, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [genreMap, setGenreMap] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      try {
        const [statsRes, userRes, genresRes] = await Promise.all([
          watchlistApi.getStats(),
          authApi.getProfile(),
          movieApi.getGenres()
        ]);
        
        setProfile(statsRes.data);
        setUserInfo(userRes.data.user);

        const gMap: Record<number, string> = {};
        if (genresRes && Array.isArray(genresRes)) {
           genresRes.forEach((g: any) => {
             gMap[g.id] = g.name;
           });
        }
        setGenreMap(gMap);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
     return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-xl">Please sign in to view your profile.</div>
        </div>
     );
  }

  if (isLoading || !profile || !userInfo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
           <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const totalWatchTimeFormatted = formatTime(profile.userStats?.totalWatchTime || 0);
  const avgRatingWatched = profile.statusStats?.find((s: any) => s._id === "watched")?.count || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold uppercase">
              {userInfo.firstName?.[0]}{userInfo.lastName?.[0]}
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {userInfo.firstName} {userInfo.lastName}
              </h1>
              <p className="text-gray-600 mb-4">{userInfo.email}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>Joined: {new Date(userInfo.createdAt || Date.now()).toLocaleDateString()}</span>
                {userInfo.lastLogin && (
                    <span>Last active: {new Date(userInfo.lastLogin).toLocaleDateString()}</span>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{profile.userStats?.totalWatched || 0}</div>
                <div className="text-sm text-gray-600">Total Watched</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{profile.userStats?.currentStreak || 0}</div>
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
                  {profile.statusStats?.map((stat: any) => (
                    <div key={stat._id} className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
                      <div className={`inline-block px-2 py-1 rounded text-sm font-medium capitalize ${getStatusColor(stat._id)}`}>
                        {stat._id}
                      </div>
                    </div>
                  ))}
                  {(!profile.statusStats || profile.statusStats.length === 0) && (
                    <div className="text-center col-span-4 text-gray-500">No activity yet</div>
                  )}
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
                    <div className="text-2xl font-bold text-red-600">{profile.userStats?.moviesWatched || 0}</div>
                    <div className="text-sm text-gray-600">Movies Watched</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{profile.userStats?.tvShowsWatched || 0}</div>
                    <div className="text-sm text-gray-600">TV Shows Watched</div>
                  </div>
                </div>
              </div>

              {/* Monthly Activity */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{new Date().getFullYear()} Monthly Activity</h2>
                <div className="space-y-3">
                  {profile.monthlyStats?.map((month: any) => (
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
                  {(!profile.monthlyStats || profile.monthlyStats.length === 0) && (
                    <div className="text-gray-500 text-center text-sm">No activity recorded this year</div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Favorite Genres */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Top Genres</h2>
                <div className="space-y-3">
                  {profile.genreStats?.slice(0, 6).map((genre: any, index: number) => (
                    <div key={genre._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium">{genreMap[genre._id] || "Unknown"}</span>
                      </div>
                      <span className="text-sm text-gray-600">{genre.count}</span>
                    </div>
                  ))}
                  {(!profile.genreStats || profile.genreStats.length === 0) && (
                    <div className="text-gray-500 text-center text-sm">No genres data available</div>
                  )}
                </div>
              </div>

              {/* Streaks */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Viewing Streaks</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Current Streak</span>
                    <span className="text-2xl font-bold text-green-600">{profile.userStats?.currentStreak || 0} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Longest Streak</span>
                    <span className="text-2xl font-bold text-blue-600">{profile.userStats?.longestStreak || 0} days</span>
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
                {profile.yearlyStats?.map((year: any) => (
                  <div key={year._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-semibold">{year._id}</span>
                      <span className="text-sm text-gray-600">{formatTime(year.totalRuntime)}</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600 mb-1">{year.count} items watched</div>
                    <div className="text-sm text-gray-600">
                      Average: {year.count > 0 ? Math.round(year.totalRuntime / year.count) : 0} min per item
                    </div>
                  </div>
                ))}
                {(!profile.yearlyStats || profile.yearlyStats.length === 0) && (
                    <div className="text-gray-500 text-center">No yearly data available</div>
                )}
              </div>
            </div>

            {/* Genre Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Genre Distribution</h2>
              <div className="space-y-3">
                {profile.genreStats?.map((genre: any) => {
                  const total = profile.userStats?.totalWatched || 1; 
                  const percentage = Math.round((genre.count / total) * 100);
                  return (
                    <div key={genre._id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{genreMap[genre._id] || "Unknown"}</span>
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
                {(!profile.genreStats || profile.genreStats.length === 0) && (
                   <div className="text-gray-500 text-center text-sm">No genre distribution data available</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {profile.recentActivity?.map((activity: any) => (
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
              {(!profile.recentActivity || profile.recentActivity.length === 0) && (
                <div className="text-center text-gray-500">No recent activity found. Start adding movies to your watchlist!</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Preferences & Settings</h2>
            <div className="space-y-6">
              <div>
                <div className="block text-sm font-medium text-gray-700 mb-2">
                  Top Genres (by Watch Count)
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.genreStats?.slice(0, 5).map((genre: any) => (
                    <span
                      key={genre._id}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {genreMap[genre._id] || "Unknown"}
                    </span>
                  ))}
                  {(!profile.genreStats || profile.genreStats.length === 0) && (
                    <span className="text-gray-500 text-sm">No watch history yet.</span>
                  )}
                </div>
              </div>
              
              <div>
                <div className="block text-sm font-medium text-gray-700 mb-2">
                  Notification Settings
                </div>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked={userInfo?.preferences?.notifications} disabled />{" "}
                    Email notifications (Global)
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" disabled />{" "}
                    Weekly watch time summary (Coming Soon)
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" disabled />{" "}
                    Recommendations based on viewing history (Coming Soon)
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
