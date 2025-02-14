import { z } from "zod";

const createTaskZodSchema = z.object({
  body: z.object({
    title: z.string().nonempty("Title is required"),
  }),
});
export const TaskValidation = {
  createTaskZodSchema,
};
