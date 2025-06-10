export type Course = {
  id: string;
  name: string;
};

export type Program = {
  id: string;
  name: string;
  courses: Course[];
};
