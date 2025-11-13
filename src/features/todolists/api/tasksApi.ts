import type { BaseResponse } from "@/common/types"
import type { GetTasksResponse, TaskOperationResponse, UpdateTaskModel } from "./tasksApi.types"
import { baseApi } from "@/app/baseApi.ts"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksResponse, string>({
      providesTags: ["Task"],
      query: (todolistId) => `/todo-lists/${todolistId}/tasks`,
    }),
    createTask: build.mutation<TaskOperationResponse, { todolistId: string; title: string }>({
      invalidatesTags: ["Task"],
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
      invalidatesTags: ["Task"],
      query: ({ todolistId, taskId, model }) => ({
        method: "PUT",
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
        body: model,
      }),
    }),
    deleteTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      invalidatesTags: ["Task"],
      query: ({ todolistId, taskId }) => ({
        method: "DELETE",
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
      }),
    }),
  }),
})

export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi
