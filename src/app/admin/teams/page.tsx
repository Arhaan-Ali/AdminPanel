'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users2 as TeamsIcon, Search, X, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "@/hooks/use-toast";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const fetchteamsdetails = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase 
          .from('teams')
          .select('id, name, is_recruiting, member_limit, created_at')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setTeams(data || []);
      } catch(error: any) {
        console.error('Error fetching teams:', error);
        toast({
          variant: "destructive",
          title: "Failed to fetch teams",
          description: error?.message || "Unknown error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchteamsdetails();
  }, []);

  const handleDeleteTeam = async (teamId: string) => {
    try {
      const { error } = await supabase 
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (error) throw error;

      setTeams(teams.filter(team => team.id !== teamId));
      toast({
        title: "Team deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting team:' , error);
      toast({
        variant: "destructive",
        title: "Failed to delete team",
        description: error?.message || "Unknown error",
      });
    }
  };

  const filteredTeams = teams.filter(team =>
    searchTerm === "" ||
    team.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleTeams = filteredTeams.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredTeams.length;
  const handleLoadMore = () => setVisibleCount((c) => c + 3);

  return (
    <div className="space-y-4 sm:space-y-6">
      
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <TeamsIcon className="h-5 w-5" />
            Teams Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Teams"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Teams Table */}
            <div className="bg-white rounded-lg overflow-hidden">
              {/* Mobile View */}
              <div className="lg:hidden space-y-3 p-3">
                {visibleTeams.length > 0 ? (
                  visibleTeams.map((team) => (
                    <div key={team.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">{team.name}</div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteTeam(team.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">ID: {team.id}</div>
                      <div className="text-xs text-muted-foreground">Members: {team.member_limit}</div>
                      <div className="text-xs text-muted-foreground">Created: {team.created_at}</div>
                      <div>
                        <Badge 
                          variant={team.is_recruiting ? "secondary" : "destructive"}
                          className={team.is_recruiting 
                            ? "bg-green-600 hover:bg-green-700 text-white" 
                            : "bg-red-600 hover:bg-red-700 text-white"
                          }
                        >
                          {team.is_recruiting ? "active" : "inactive"}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No teams found
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
                      <TableHead>Team ID</TableHead>
                      <TableHead>Team Name</TableHead>
                      <TableHead>Members</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleTeams.length > 0 ? (
                      visibleTeams.map((team) => (
                        <TableRow key={team.id}>
                          <TableCell>{team.id}</TableCell>
                          <TableCell className="font-medium">{team.name}</TableCell>
                          <TableCell>{team.member_limit}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={team.is_recruiting ? "secondary" : "destructive"}
                              className={team.is_recruiting 
                                ? "bg-green-600 hover:bg-green-700 text-white" 
                                : "bg-red-600 hover:bg-red-700 text-white"
                              }
                            >
                              {team.is_recruiting ? "active" : "inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>{team.created_at}</TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteTeam(team.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No teams found
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
