import { z } from "zod";

export const formSchema = z.object({
  question: z.string().min(1, "Question text is required"),
  subject: z.string().min(1, "Subject is required"),
  difficulty: z.string().min(1, "Difficulty is required"),
  options: z.array(z.string().min(1, "Option cannot be empty")).min(2),
  correctIndex: z.number().int().min(0),
});

export type FormValues = z.infer<typeof formSchema>;
