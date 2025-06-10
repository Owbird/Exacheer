"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Camera,
  Check,
  ChevronDown,
  Edit,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Course, Program } from "@/types";
import { updateProile } from "@/app/actions/user";
import { AcademicLevel } from "@/lib/generated/prisma";

export default function ProfilePage() {
  const [institution, setInstitution] = useState("University of Ghana");
  const [academicLevel, setAcademicLevel] = useState<string|null>(null);
  const [institutionOpen, setInstitutionOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [editingProgram, setEditingProgram] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState<{ [key: string]: string }>({});

  const addProgram = () => {
    const newProgram: Program = {
      id: Date.now().toString(),
      name: "Bsc. Computer Science",
      courses: [
        { id: "1", name: "Introduction to Programming" },
        { id: "2", name: "Data Structures" },
      ],
    };
    setPrograms([...programs, newProgram]);
    setEditingProgram(newProgram.id);
  };

  const updateProgramName = (programId: string, name: string) => {
    setPrograms(programs.map((p) => (p.id === programId ? { ...p, name } : p)));
  };

  const deleteProgram = (programId: string) => {
    setPrograms(programs.filter((p) => p.id !== programId));
  };

  const addCourse = (programId: string) => {
    const courseName = newCourse[programId]?.trim();
    if (!courseName) return;

    const newCourseObj: Course = {
      id: Date.now().toString(),
      name: courseName,
    };

    setPrograms(
      programs.map((p) =>
        p.id === programId
          ? { ...p, courses: [...p.courses, newCourseObj] }
          : p,
      ),
    );
    setNewCourse({ ...newCourse, [programId]: "" });
  };

  const removeCourse = (programId: string, courseId: string) => {
    setPrograms(
      programs.map((p) =>
        p.id === programId
          ? { ...p, courses: p.courses.filter((c) => c.id !== courseId) }
          : p,
      ),
    );
  };

  const handleSave = async () => {
    console.log(
      "Saving profile data:",
      JSON.stringify({ institution, programs, academicLevel }),
    );

    alert("Saving...");

    await updateProile({
      institution,
      programs,
      academicLevel: academicLevel as AcademicLevel,
      userId: user?.id,
    });

    alert("Saved!");
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <DashboardShell>
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-slate-50 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Your Profile</h2>
            <p className="text-muted-foreground">
              Set your teaching context to personalize your Exacheer experience.
            </p>
          </div>
          <Button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={user?.imageUrl}
                    alt={`${user?.firstName}`}
                  />
                  <AvatarFallback className="text-lg">DM</AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-white"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <div>
                  <Label className="text-sm font-medium">Full Name</Label>
                  <p className="text-lg font-semibold">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email Address</Label>
                  <p className="text-muted-foreground">
                    {user?.emailAddresses[0].emailAddress}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Popover open={institutionOpen} onOpenChange={setInstitutionOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={institutionOpen}
                    className="w-full justify-between"
                  >
                    {institution || "Select institution..."}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search institutions..." />
                    <CommandList>
                      <CommandEmpty>No institution found.</CommandEmpty>
                      <CommandGroup>
                        {institutions.map((inst) => (
                          <CommandItem
                            key={inst}
                            value={inst}
                            onSelect={(currentValue) => {
                              setInstitution(
                                currentValue === institution
                                  ? ""
                                  : currentValue,
                              );
                              setInstitutionOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                institution === inst
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {inst}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Programs Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Programs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {programs.map((program) => (
              <div
                key={program.id}
                className="border rounded-lg p-4 space-y-4 bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  {editingProgram === program.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={program.name}
                        onChange={(e) =>
                          updateProgramName(program.id, e.target.value)
                        }
                        className="font-semibold bg-white"
                        autoFocus
                        onBlur={() => setEditingProgram(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setEditingProgram(null);
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingProgram(null)}
                        className="h-8 w-8"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{program.name}</h3>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingProgram(program.id)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Program</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{program.name}"? This
                          action cannot be undone and will remove all associated
                          courses.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteProgram(program.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Courses</Label>

                  {/* Course Tags */}
                  {program.courses.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {program.courses.map((course) => (
                        <Badge
                          key={course.id}
                          variant="secondary"
                          className="px-3 py-1 bg-white border hover:bg-slate-100"
                        >
                          {course.name}
                          <button
                            onClick={() => removeCourse(program.id, course.id)}
                            className="ml-2 text-muted-foreground hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Add Course Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a course..."
                      value={newCourse[program.id] || ""}
                      onChange={(e) =>
                        setNewCourse({
                          ...newCourse,
                          [program.id]: e.target.value,
                        })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          addCourse(program.id);
                        }
                      }}
                      className="bg-white"
                    />
                    <Button
                      onClick={() => addCourse(program.id)}
                      disabled={!newCourse[program.id]?.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {program.courses.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">
                      No courses added yet
                    </p>
                  )}
                </div>
              </div>
            ))}

            <Button
              onClick={addProgram}
              variant="outline"
              className="w-full border-dashed border-2 h-12 text-muted-foreground hover:text-foreground hover:border-solid"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Program
            </Button>
          </CardContent>
        </Card>

        {/* Academic Background Card */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Background</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="highest-degree">Highest Degree</Label>
                <Select defaultValue="phd" onValueChange={setAcademicLevel}>
                  <SelectTrigger id="highest-degree">
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="postdoc">Post-Doctoral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Save Button for Mobile */}
      <Button
        onClick={handleSave}
        className="fixed bottom-6 right-6 shadow-lg bg-indigo-600 hover:bg-indigo-700 rounded-full h-14 px-6 md:hidden"
      >
        <Save className="mr-2 h-5 w-5" />
        Save
      </Button>
    </DashboardShell>
  );
}

// Sample institutions data
const institutions = [
  "University of Ghana",
  "Kwame Nkrumah University of Science and Technology",
  "University of Cape Coast",
  "Ghana Institute of Management and Public Administration",
  "Ashesi University",
  "University of Professional Studies",
  "Central University",
  "Valley View University",
  "Presbyterian University College",
  "Methodist University College Ghana",
  "University of Development Studies",
  "University for Development Studies",
  "Accra Technical University",
  "Ho Technical University",
  "Kumasi Technical University",
  "Sunyani Technical University",
  "Tamale Technical University",
  "Takoradi Technical University",
];
