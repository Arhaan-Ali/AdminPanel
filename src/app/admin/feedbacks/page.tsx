'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Search, X, Trash2, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch("");
        const data = await res.json();

        setFeedbacks((data || []).map((f: any) => ({ ...f, status: f?.status || 'unread' })));
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };
  
    fetchFeedbacks();
  }, []);
  

  const handleDeleteFeedback = async (email: string) => {
    console.log("Deleting feedback with email:", email);
    if (!email) {
      console.error("Email is empty or undefined");
      return;
    }
    try {
      const url = `https://sheetdb.io/api/v1/9herpd5f3vmh0/email/${encodeURIComponent(email)}`;
      console.log("DELETE URL:", url);
      await fetch(url, { method: "DELETE" });
      setFeedbacks((prev) => prev.filter((f) => f.email !== email));
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
  };

  const handleStatusChange = async (email: string, newStatus: string) => {
    // Remember previous status for rollback
    const previous = feedbacks.find((f: any) => f.email === email)?.status;

    
    setFeedbacks(prev => prev.map((f: any) => 
      f.email === email ? { ...f, status: newStatus } : f
    ));

    try {
      const url = `https://sheetdb.io/api/v1/9herpd5f3vmh0/email/${encodeURIComponent(email)}`;
      const res = await fetch(url, {
        method: "PUT", // or "PATCH" if preferred
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { status: newStatus } }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update status (${res.status})`);
      }
    } catch (err) {
      console.error("Error updating feedback status:", err);
      // Rollback on failure
      setFeedbacks(prev => prev.map((f: any) => 
        f.email === email ? { ...f, status: previous } : f
      ));
    }
  };

  const filteredFeedbacks = feedbacks.filter((feedback) =>
    feedback.feedback?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'in-progress':
        return 'bg-yellow-600 hover:bg-yellow-700 text-white';
      case 'resolved':
        return 'bg-green-600 hover:bg-green-700 text-white';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <MessageSquare className="h-5 w-5" />
            Feedback Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Feedbacks"
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

            {/* Feedbacks Table */}
            <div className="bg-white rounded-lg overflow-hidden">
              {/* Mobile View */}
              <div className="lg:hidden space-y-3 p-3">
                {filteredFeedbacks.length > 0 ? (
                  filteredFeedbacks.map((feedback) => (
                    <div key={feedback.email} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">{feedback.name}</div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteFeedback(feedback.email)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">{feedback.email}</div>
                      <div className="text-sm truncate">{feedback.Bugs}</div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">{feedback.Timestamp}</div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 px-2">
                              <Badge 
                                variant="secondary"
                                className={getStatusColor(feedback.status)}
                              >
                                {feedback.status}
                              </Badge>
                              <ChevronDown className="h-3 w-3 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleStatusChange(feedback.email, 'unread')}>
                              <Badge variant="secondary" className="bg-red-600 hover:bg-red-700 text-white">
                                unread
                              </Badge>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(feedback.email, 'in-progress')}>
                              <Badge variant="secondary" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                                in-progress
                              </Badge>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(feedback.email, 'resolved')}>
                              <Badge variant="secondary" className="bg-green-600 hover:bg-green-700 text-white">
                                resolved
                              </Badge>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No feedbacks found
                  </div>
                )}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeedbacks.length > 0 ? (
                      filteredFeedbacks.map((feedback) => (
                        <TableRow key={feedback.email}>
                          <TableCell className="font-medium">{feedback.name}</TableCell>
                          <TableCell>{feedback.email}</TableCell>
                          <TableCell className="max-w-xs truncate">{feedback.Bugs}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-6 px-2">
                                  <Badge 
                                    variant="secondary"
                                    className={getStatusColor(feedback.status)}
                                  >
                                    {feedback.status}
                                  </Badge>
                                  <ChevronDown className="h-3 w-3 ml-1" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleStatusChange(feedback.email, 'unread')}>
                                  <Badge variant="secondary" className="bg-red-600 hover:bg-red-700 text-white">
                                    unread
                                  </Badge>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(feedback.email, 'in-progress')}>
                                  <Badge variant="secondary" className="bg-yellow-600 hover:bg-yellow-700 text-white">
                                    in-progress
                                  </Badge>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(feedback.email, 'resolved')}>
                                  <Badge variant="secondary" className="bg-green-600 hover:bg-green-700 text-white">
                                    resolved
                                  </Badge>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell>{feedback.Timestamp}</TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteFeedback(feedback.email)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No feedbacks found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}