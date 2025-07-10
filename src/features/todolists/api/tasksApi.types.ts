import { TaskPriority, TaskStatus } from "@/common/enums/enums"
import { z } from "zod/v4"

export const domainTaskSchema = z.object({
  description: z.string().nullable(),
  deadline: z.string().nullable(),
  startDate: z.string().nullable(),
  title: z.string(),
  id: z.string(),
  todoListId: z.string(),
  order: z.int(),
  addedDate: z.iso.datetime({ local: true }),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
})

export type DomainTask = z.infer<typeof domainTaskSchema>

export const getTasksSchema = z.object({
  error: z.string().nullable(),
  totalCount: z.number().int().nonnegative(),
  items: z.array(domainTaskSchema),
})

export type GetTasksResponse = z.infer<typeof getTasksSchema>

export const updateTaskModelSchema = z.object({
  description: z.string().nullable(),
  title: z.string(),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
  startDate: z.string().nullable(),
  deadline: z.string().nullable(),
})

export type UpdateTaskModel = z.infer<typeof updateTaskModelSchema>
// export type UpdateTaskModel = {
//   description: Nullable<string>
//   title: string
//   status: TaskStatus
//   priority: TaskPriority
//   startDate: Nullable<string>
//   deadline: Nullable<string>
// }

// export type Nullable<T> = T | null
