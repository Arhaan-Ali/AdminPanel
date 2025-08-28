'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  User, 
  Trophy, 
  TrendingUp,
  PieChart, 
  Activity,
  Loader2,
  RefreshCw
} from "lucide-react";
import Link from "next/link";


const mockStats = [
  { title: "Total Users", value: 1250, icon: Users, href: "/admin/users", color: "#0891B2" },
  { title: "Active Users", value: 87, icon: User, href: "/admin/users", color: "#0E7490" },
  { title: "Total Teams", value: 42, icon: PieChart, href: "/admin/teams", color: "#06B6D4" },
];

const mockActivities = [
  {
    id: 1,
    action: "Logged in",
    created_at: new Date().toISOString(),
    user: { full_name: "Arhaan Ali", avatar_url: "" },
  },
  {
    id: 2,
    action: "Created a new team",
    created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    user: { full_name: "Vishal", avatar_url: "" },
  },
  {
    id: 3,
    action: "Updated profile",
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    user: { full_name: "Guest User", avatar_url: "" },
  },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<any[]>(mockStats);
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<any[]>(mockActivities);

 /* useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);

      try {
        const { count: totalUsers } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        const active = new Date();
        active.setMinutes(active.getMinutes() - 5); 
        
        const { data: activeUserData } = await supabase
          .from('activity_log')
          .select('user_id')
          .gte('created_at', active.toISOString());
        
        // Get unique user count
        const activeUsers = activeUserData ? new Set(activeUserData.map(log => log.user_id)).size : 0;

        const { count: totalTeams } = await supabase
          .from('teams')
          .select('*', { count: 'exact'});

        setStats([
          {
            title: "Total Users",
            value: totalUsers || 0,
            icon: Users,
            href: "/admin/users",
            color: "#0891B2"
          },
          {
            title: "Active Users",
            value: activeUsers || 0,
            icon: User,
            href: "/admin/users",
            color: "#0E7490"
          },
          {
            title: "Total Teams",
            value: totalTeams || 0,
            icon: PieChart,
            href: "/admin/teams",
            color: "#06B6D4"
          },
        ]);

        const {data: { user }} = await supabase.auth.getUser();
        if (user) {
          const {data, error} = await supabase
            .from('activity_log')
            .select('*, user:users(full_name, avatar_url)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          if (error) {
            console.error("Error fetching activities", error);
          } else {
            setActivities(data || []);
          }
        }

      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setStats([
          {
            title: "Total Users",
            value: "Error",
            icon: Users,
            href: "/admin/users",
            color: "#374151"
          },
          {
            title: "Active Users",
            value: "Error",
            icon: User,
            href: "/admin/users",
            color: "#374151"
          },
          {
            title: "Total Teams",
            value: "Error",
            icon: PieChart,
            href: "/admin/teams",
            color: "#374151"
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []); */

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const { count: totalUsers } = await supabase.from('users').select('*', { count: 'exact', head: true });
      
      const active = new Date();
      active.setMinutes(active.getMinutes() - 5);
      const { count: activeUsers } = await supabase.from('users').select('*', { count: 'exact', head: true }).gte('last_seen', active.toISOString());
      
      const { count: totalTeams } = await supabase.from('teams').select('*', { count: 'exact', head: true });

      setStats([
        { title: "Total Users", value: totalUsers || 0,  icon: Users, href: "/admin/users", color: "#DC2626" },
        { title: "Active Users", value: activeUsers || 0,  icon: User, href: "/admin/users", color: "#28A745" },
        { title: "Total Teams", value: totalTeams || 0,  icon: PieChart, href: "/admin/teams", color: "#FFC107" },
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome to your admin dashboard</p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {loading ? (
          // Loading skeleton
          Array.from({length: 3}).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-2 p-4 sm:p-6">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-8 bg-gray-400 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="h-3 bg-gray-300 rounded w-full"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 h-full"
                style={{ backgroundColor: stat.color }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl font-semibold text-white truncate">
                    {stat.title}
                  </CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white">{stat.value}</div>
                  <p className="text-xs text-white/80 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 sm:gap-6">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="space-y-3 sm:space-y-4">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 sm:gap-4">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{activity.action || 'Activity'}</p>
                      <p className="text-xs text-muted-foreground break-words">
                        {activity.user?.full_name || 'Unknown'} • {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}