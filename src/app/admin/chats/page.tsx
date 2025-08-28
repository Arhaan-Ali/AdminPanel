'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Search, X, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "@/hooks/use-toast";

export default function ChatsPage() {
  const [chats, setChats] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {

    const fetchchatdetails = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase 
          .from('messages')
          .select('id, conversation_id, sender_id, content, created_at')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setChats(data || []);
      } catch(error: any) {
        console.error('Error fetching chats:', error.message || error);
        toast({
          variant: "destructive",
          title: "Failed to fetch chats",
          description: error.message || "Unknown error",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchchatdetails();
  }, []);

  const handleDeleteChat = async (conversationId: string) => {
    try {
      const { error } = await supabase 
        .from('messages')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;

      setChats(chats.filter(chat => chat.id !== conversationId));
      toast({
        title: "chat deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting chat:' , error);
      toast({
        variant: "destructive",
        title: "Failed to delete chat",
        description: error?.message || "Unknown error",
      });
    }
  };

  const filteredChats = chats.filter((chat: any) => {
    const term = searchTerm.trim().toLowerCase();
    if (term === "") return true;
    return (
      chat.content?.toLowerCase().includes(term) ||
      String(chat.conversation_id)?.toLowerCase().includes(term) ||
      String(chat.sender_id)?.toLowerCase().includes(term)
    );
  });
  const visibleChats = filteredChats.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredChats.length;
  const handleLoadMore = () => setVisibleCount((c) => c + 3);
  
  return (
    <div className="space-y-4 sm:space-y-6">
      
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <MessageSquare className="h-5 w-5" />
            Chat Management
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="bg-gray-100 p-3 sm:p-4 rounded-lg space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Chats"
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

            {/* Chats Table */}
            <div className="bg-white rounded-lg overflow-hidden">
              {/* Mobile View */}
              <div className="lg:hidden space-y-3 p-3">
                {visibleChats.length > 0 ? (
                  visibleChats.map((chat: any) => (
                    <div key={chat.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-sm">Conversation {chat.conversation_id}</div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteChat(chat.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">Sender: {chat.sender_id}</div>
                      <div className="text-xs text-muted-foreground">Created: {chat.created_at}</div>
                      <div className="text-sm truncate">{chat.content}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No chats found
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
                      <TableHead>ID</TableHead>
                      <TableHead>Sender</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visibleChats.length > 0 ? (
                      visibleChats.map((chat: any) => (
                        <TableRow key={chat.id}>
                          <TableCell>{chat.id}</TableCell>
                          <TableCell className="font-medium">{chat.sender_id}</TableCell>
                          <TableCell className="max-w-xs truncate">{chat.content}</TableCell>
                          <TableCell className="text-sm">{chat.created_at}</TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteChat(chat.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No chats found
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
