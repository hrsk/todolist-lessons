import { TaskPriority, TaskStatus } from "@/common/enums"
import { z } from "zod/v4"
import { createBaseResponseSchema } from "@/common/types"

export const domainTaskSchema = z.object({
  description: z.string().nullable(),
  deadline: z.string().nullable(),
  startDate: z.string().nullable(),
  title: z.string(),
  id: z.string(),
  todoListId: z.string(),
  order: z.number(),
  addedDate: z.iso.datetime({ local: true }),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
})

export type DomainTask = z.infer<typeof domainTaskSchema>

export const getTasksResponseSchema = z.object({
  error: z.nullable(z.string()),
  totalCount: z.number(),
  items: z.array(domainTaskSchema),
})

export type GetTasksResponse = z.infer<typeof getTasksResponseSchema>

export const updateTaskModelSchema = z.object({
  description: z.nullable(z.string()),
  title: z.string(),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
  startDate: z.nullable(z.string()),
  deadline: z.nullable(z.string()),
})

export type UpdateTaskModel = z.infer<typeof updateTaskModelSchema>

export const taskOperationSchema = createBaseResponseSchema(
  z.object({
    item: domainTaskSchema,
  }),
)

export type TaskOperationResponse = z.infer<typeof taskOperationSchema>
