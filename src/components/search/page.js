import { useState, useEffect } from "react";
import QueryCell from "../sql_query/page";

import {

  PlusCircle,
  Search,
  Trash,
} from "lucide-react";

import {
  Breadcrumb,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export const description =
  "A chatbot admin dashboard where admins can input examples for questions and SQL queries, search a question, and view the top K similar questions from the Pinecone embedding database.";




export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newSQLQuery, setNewSQLQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

  if (!API_BASE_URL) {
    console.error("API_URL not set");
  }

  // Fetch top K similar questions from the Flask backend
  async function fetchTopKSimilarQuestions(query, k=5) {
    setLoading(true);
    console.log(query);
    try {
      const response = await fetch(
        `${API_BASE_URL}/search?question=${encodeURIComponent(query)}&k=${k}`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
      } else {
        console.error("Failed to fetch data");
        setResults([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTopKSimilarQuestions(" ", k=100);
    }, []);

  useEffect(() => {
    if (searchQuery) {
      fetchTopKSimilarQuestions(searchQuery);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  // Handle deletion of an embedding
  async function handleDelete(indexId) {
    try {
        console.log("Deleting index_id:", indexId);
      const response = await fetch(`${API_BASE_URL}/delete/${indexId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // Successfully deleted
        setResults((prevResults) =>
          prevResults.filter((item) => item.index_id !== indexId)
        );
      } else {
        console.error("Failed to delete data");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }

  // Handle form submission for adding new entry
  async function handleSubmit(e) {
    e.preventDefault();

    // Prepare the data
    const data = {
      question: newQuestion,
      sql_query: newSQLQuery,
    };

    try {
      // Make API call to upload the data
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Successfully uploaded
        console.log("Data uploaded successfully");
        // Reset the form
        setNewQuestion("");
        setNewSQLQuery("");
        // Close the modal
        setDialogOpen(false);
        // Optionally, refresh the search results if needed
        if (searchQuery) {
          fetchTopKSimilarQuestions(searchQuery);
        }
      } else {
        // Handle errors
        console.error("Failed to upload data");
      }
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        {/* Sidebar navigation */}
        {/* ... (No changes needed here) */}
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* Mobile menu button */}
          {/* ... (No changes needed here) */}
          <Breadcrumb className="hidden md:flex">
            {/* Breadcrumb navigation */}
            {/* ... (Adjust as needed) */}
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for a question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
          {/* User dropdown menu */}
          {/* ... (No changes needed here) */}
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              {/* Tabs (you can adjust or remove them as needed) */}
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                {/* Create Button with Modal */}
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-7 gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Create
                      </span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Entry</DialogTitle>
                      <DialogDescription>
                        Enter the question and SQL query to add to the caching
                        embedding system.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 py-4">
                        <div>
                          <label
                            htmlFor="question"
                            className="block text-sm font-medium"
                          >
                            Question
                          </label>
                          <Input
                            id="question"
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="sqlQuery"
                            className="block text-sm font-medium"
                          >
                            SQL Query
                          </label>
                          <textarea
                            id="sqlQuery"
                            value={newSQLQuery}
                            onChange={(e) => setNewSQLQuery(e.target.value)}
                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            required
                            rows={5}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Submit</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Similar Questions</CardTitle>
                  <CardDescription>
                    View and manage similar questions from the embedding
                    database.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center items-center">
                      <p>Loading...</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Question</TableHead>
                          <TableHead>SQL Query</TableHead>
                          <TableHead>Date Added</TableHead>
                          <TableHead>Index ID</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((item) => (
                          <TableRow key={item.index_id}>
                            <TableCell className="font-medium">
                              {item.question}
                            </TableCell>
                            <TableCell>
                              <pre className="whitespace-pre-wrap">
                                
                                <QueryCell sqlQuery={item.sql_query} />



                              </pre>
                            </TableCell>
                            <TableCell>{item.date_added}</TableCell>
                            <TableCell>{item.index_id}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(item.index_id)}
                              >
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>{results.length}</strong> results
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
