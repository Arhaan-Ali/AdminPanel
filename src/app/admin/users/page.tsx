'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users as UsersIcon, Search, X, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "@/hooks/use-toast";

// Mock user data
export default function UsersPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const fetchUserdetails = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase 
        .from('users')
        .select('id , full_name, updated_at')
        .order('updated_at', {ascending: false});
        

        if (error) throw error;

        setUsers(data || []);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        toast({
          variant: "destructive",
          title: "Failed to fetch users",
          description: error?.message || "Unknown error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserdetails();
  }, []);

  const filteredUsers = users.filter(user =>
    searchQuery === "" ||
    user.full_name?.toLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleUsers = filteredUsers.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredUsers.length;
  const handleLoadMore = () => setVisibleCount((c) => c + 3);

  const handleRemoveUser =  async (userId: string) => {
    setActionLoading(userId);

    try {
      const { error } = await supabase 
      .from('users')
      .delete()
      .eq('id', userId);

      if (error) throw error;

      setUsers(users.filter(user => user.id !== userId));
      toast({ title: 'User deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Failed to fetch users",
        description: error?.message || "Unknown error",
      });
    } finally {
      setActionLoading(null);
    }
  };


  return (
    <div className="space-y-4 sm:space-y-6">
      
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <UsersIcon className="h-5 w-5" />
            Users
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Users"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchQuery && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg overflow-hidden">
              {/* Mobile View */}
              <div className="lg:hidden space-y-3 p-3">
                {visibleUsers.length > 0 ? (
                  visibleUsers.map((user) => (
                    <div key={user.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">{user.full_name}</div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveUser(user.id)}
                          disabled={actionLoading === user.id}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">ID: {user.id}</div>
                      <div className="text-xs text-muted-foreground">Updated: {user.updated_at}</div>
                      <div>
                        <Badge 
                          variant={user.status === "active" ? "secondary" : "destructive"}
                          className={user.status === "active" 
                            ? "bg-green-600 hover:bg-green-700 text-white" 
                            : "bg-red-600 hover:bg-red-700 text-white"
                          }
                        >
                          {user.status || "active"}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found
                  </div>
                )}
                {canLoadMore && (
                  <div className="pt-2">
                    <Button variant="outline" className="w-full" onClick={handleLoadMore}>Load more</Button>
                  </div>
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User ID</TableHead>
                      <TableHead>User Name</TableHead>
                      <TableHead>Date Updated</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Remove</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleUsers.length > 0 ? (
                      visibleUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell className="font-medium">{user.full_name}</TableCell>
                          <TableCell>{user.updated_at}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={user.status === "active" ? "secondary" : "destructive"}
                              className={user.status === "active" 
                                ? "bg-green-600 hover:bg-green-700 text-white" 
                                : "bg-red-600 hover:bg-red-700 text-white"
                              }
                            >
                              {user.status || "active"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveUser(user.id)}
                              disabled={actionLoading === user.id}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                {canLoadMore && (
                  <div className="p-3 border-t">
                    <Button variant="outline" className="w-full" onClick={handleLoadMore}>Load more</Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}