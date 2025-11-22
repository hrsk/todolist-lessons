import type { BaseResponse } from "@/common/types"
import type { GetTasksResponse, TaskOperationResponse, UpdateTaskModel } from "./tasksApi.types"
import { baseApi } from "@/app/baseApi.ts"
import { PAGE_SIZE } from "@/common/constants/constants.ts"

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query<GetTasksResponse, { todolistId: string; count: number; page: number }>({
      query: ({ todolistId, count, page }) => ({
        url: `/todo-lists/${todolistId}/tasks`,
        params: { count, page },
      }),
      // providesTags: (_res, _err, todolistId) => [{ type: "Task", id: todolistId }],
      providesTags: (result, _err, { todolistId }) =>
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
      async onQueryStarted({ todolistId, taskId, model }, { dispatch, queryFulfilled, getState }) {
        const cachedArgsForQuery = tasksApi.util.selectCachedArgsForQuery(getState(), "getTasks")

        let patchResults: any[] = []
        cachedArgsForQuery.forEach(({ count, page }) => {
          patchResults.push(
            dispatch(
              tasksApi.util.updateQueryData("getTasks", { todolistId, count, page }, (state) => {
                const index = state.items.findIndex((task) => task.id === taskId)
                if (index !== -1) {
                  state.items[index] = { ...state.items[index], ...model }
                }
              }),
            ),
          )
        })
        try {
          await queryFulfilled
        } catch {
          patchResults.forEach((patchResult) => {
            patchResult.undo()
          })
        }
      },
    }),
    deleteTask: build.mutation<BaseResponse, { todolistId: string; taskId: string }>({
      // invalidatesTags: ["Task"],
      invalidatesTags: (_res, _err, { taskId }) => [{ type: "Task", id: taskId }],
      query: ({ todolistId, taskId }) => ({
        method: "DELETE",
        url: `/todo-lists/${todolistId}/tasks/${taskId}`,
      }),
      async onQueryStarted({ todolistId, taskId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tasksApi.util.updateQueryData("getTasks", { todolistId, count: PAGE_SIZE, page: 1 }, (state) => {
            const index = state.items.findIndex((task) => task.id === taskId)
            if (index !== -1) {
              state.items.splice(index, 1)
            }
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
    }),
  }),
})

export const { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi
