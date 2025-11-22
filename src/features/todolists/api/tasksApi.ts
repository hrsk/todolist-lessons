import type { BaseResponse } from "@/common/types"
import type { GetTasksResponse, TaskOperationResponse, UpdateTaskModel } from "./tasksApi.types"
import { baseApi } from "@/app/baseApi.ts"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksResponse, string>({
      query: (todolistId) => `/todo-lists/${todolistId}/tasks`,
      // providesTags: (_res, _err, todolistId) => [{ type: "Task", id: todolistId }],
      providesTags: (result, _err, todolistId) =>
        result
          ? [...result.items.map(({ id }) => ({ type: "Task", id }) as const), { type: "Task", id: todolistId }]
          : ["Task"],
    }),
    createTask: build.mutation<TaskOperationResponse, { todolistId: string; title: string }>({
      // invalidatesTags: (res) => [{ type: "Task", id: res ? res.data.item.id : "LIST" }],
      invalidatesTags: (_res, _err, { todolistId }) => [{ type: "Task", id: todolistId }],
      // invalidatesTags: ["Task"],
      query: ({ todolistId, title }) => ({
        method: "POST",
        url: `/todo-lists/${todolistId}/tasks`,
        body: { title },
      }),
    }),
    updateTask: build.mutation<
      TaskOperationResponse,
      { todolistId: string; taskId: string; model: Partial<UpdateTaskModel> }
    >({
      invalidatesTags: (_res, _err, { taskId }) => [{ type: "Task", id: taskId }],
      // invalidatesTags: ["Task"],
      query: ({ todolistId, taskId, model }) => ({
        method: "PUT",
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        body: model,
      }),
    }),
    deleteTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      // invalidatesTags: ["Task"],
      invalidatesTags: (_res, _err, { taskId }) => [{ type: "Task", id: taskId }],
      query: ({ todolistId, taskId }) => ({
        method: "DELETE",
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
      }),
    }),
  }),
})

export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi
