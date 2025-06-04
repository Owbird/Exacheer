import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Bell,
  BookOpen,
  ChevronRight,
  Clock,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  ThumbsUp,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DashboardShell } from "@/components/dashboard-shell"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] lg:w-[300px] pl-8"
            />
          </div>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[10px] text-white">
              3
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt="Dr. Mensah"
                  />
                  <AvatarFallback>DM</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Dr. Mensah</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    dr.mensah@university.edu
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Welcome Banner */}
      <Card className="mt-6 border-purple-100 bg-gradient-to-r from-purple-50 to-slate-50">
        <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between p-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Welcome back, Dr. Mensah 👋</h3>
            <p className="text-muted-foreground">
              Let's create something brilliant today. Your AI co-pilot is ready.
            </p>
          </div>
          <Button className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700">
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Questions with AI
          </Button>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Exams Created This Month
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
            <Progress value={75} className="mt-3 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Time to Create an Exam
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28 min</div>
            <p className="text-xs text-muted-foreground">
              -15 min with AI assistance
            </p>
            <Progress value={65} className="mt-3 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Student Engagement Score
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              +5% from previous exams
            </p>
            <Progress value={92} className="mt-3 h-1" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Recent Activity */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest exam activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`rounded-full p-2 ${activity.bgColor}`}>
                  <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full mt-2">
              View all activity
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* AI Suggestions Panel */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CardTitle>📌 AI Drafts Waiting</CardTitle>
              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                3 New
              </Badge>
            </div>
            <CardDescription>
              AI-generated content ready for review
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiSuggestions.map((suggestion, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{suggestion.title}</p>
                  <Badge variant="outline">{suggestion.type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {suggestion.preview}
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    Review & Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Add to Bank
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Insights Panel */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Insights</CardTitle>
            <CardDescription>Performance analytics</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="mt-auto space-y-2">
              <p className="text-sm font-medium">Most Missed Questions</p>
              <div className="space-y-1">
                {mostMissedQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <p className="text-xs truncate max-w-[200px]">
                      {question.text}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {question.percentage}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Exams */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Upcoming Exams</CardTitle>
          <CardDescription>
            Manage your scheduled and draft exams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium">
                    Exam Title
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium">
                    Students
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {upcomingExams.map((exam, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{exam.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{exam.date}</td>
                    <td className="py-3 px-4 text-sm">{exam.students}</td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          exam.status === "Scheduled"
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                            : exam.status === "Draft"
                            ? "bg-slate-100 text-slate-800 hover:bg-slate-100"
                            : "bg-green-100 text-green-800 hover:bg-green-100"
                        }
                      >
                        {exam.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem>Preview</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Floating CTA Button */}
      <Button className="fixed bottom-6 right-6 shadow-lg bg-purple-600 hover:bg-purple-700 rounded-full h-14 px-6">
        <Plus className="mr-2 h-5 w-5" />
        New Exam
      </Button>
    </DashboardShell>
  );
}

// Data
const recentActivities = [
  {
    title: "Created 'Biology Midterm' exam",
    time: "Today at 10:30 AM",
    icon: FileText,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Added 15 questions to Question Bank",
    time: "Yesterday at 2:45 PM",
    icon: BookOpen,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    title: "AI generated 25 questions for review",
    time: "Yesterday at 11:20 AM",
    icon: Sparkles,
    bgColor: "bg-amber-100",
    iconColor: "text-amber-600",
  },
]

const aiSuggestions = [
  {
    title: "Biology Exam Questions",
    type: "Questions",
    preview:
      "A set of 15 multiple-choice questions on cellular respiration and photosynthesis with varying difficulty levels.",
  },
  {
    title: "Physics Problem Set",
    type: "Problems",
    preview: "10 calculation-based problems on kinematics and Newton's laws with step-by-step solutions.",
  },
  {
    title: "Literature Essay Prompts",
    type: "Prompts",
    preview: "5 analytical essay prompts on Shakespeare's Macbeth focusing on themes of ambition and moral corruption.",
  },
]

const chartData = [
  {
    month: "Jan",
    completion: 65,
  },
  {
    month: "Feb",
    completion: 72,
  },
  {
    month: "Mar",
    completion: 78,
  },
  {
    month: "Apr",
    completion: 74,
  },
  {
    month: "May",
    completion: 85,
  },
  {
    month: "Jun",
    completion: 92,
  },
]

const mostMissedQuestions = [
  {
    text: "Explain the process of cellular respiration",
    percentage: 68,
  },
  {
    text: "Calculate the acceleration of an object given...",
    percentage: 54,
  },
  {
    text: "Analyze the theme of power in Macbeth",
    percentage: 42,
  },
]

const upcomingExams = [
  {
    title: "Advanced Biology Final",
    date: "May 25, 2025",
    students: 32,
    status: "Scheduled",
  },
  {
    title: "Physics Midterm",
    date: "June 3, 2025",
    students: 28,
    status: "Scheduled",
  },
  {
    title: "Literature Quiz",
    date: "June 10, 2025",
    students: 45,
    status: "Draft",
  },
  {
    title: "Chemistry Lab Assessment",
    date: "May 20, 2025",
    students: 18,
    status: "Completed",
  },
]
