import type { DomainTodolist, Todolist } from "./todolistsApi.types"
import { BaseResponse } from "@/common/types"
import { baseApi } from "@/app/baseApi.ts"

export const todolistsApi = baseApi.injectEndpoints({
  // reducerPath: "todolists",
  // tagTypes: ["Todolist"],
  // baseQuery: fetchBaseQuery({
  //   baseUrl: `https://social-network.samuraijs.com/api/1.1`,
  //   headers: {
  //     "API-KEY": import.meta.env.VITE_API_KEY,
  //   },
  //   prepareHeaders: (headers) => headers.set("Authorization", `Bearer ${localStorage.getItem(AUTH_TOKEN)}`),
  // }),
  endpoints: (build) => ({
    getTodos: build.query<DomainTodolist[], void>({
      providesTags: ["Todolist"],
      query: () => `todo-lists`,
      transformResponse: (response: Todolist[]): DomainTodolist[] => {
        return response.map((todolist) => ({ ...todolist, filter: "all", entityStatus: "idle" }))
      },
    }),
    addTodolist: build.mutation<DomainTodolist, string>({
      invalidatesTags: ["Todolist"],
      query: (title) => ({
        url: `todo-lists`,
        method: "POST",
        body: { title },
      }),
    }),
    removeTodolist: build.mutation<BaseResponse, string>({
      invalidatesTags: ["Todolist"],
      query: (id) => ({
        url: `todo-lists/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(id: string, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todolistsApi.util.updateQueryData("getTodos", undefined, (state) => {
            const index = state.findIndex((todolist) => todolist.id === id)
            if (index !== -1) {
              state.splice(index, 1)
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
    updateTodolist: build.mutation<BaseResponse, { todolistId: string; title: string }>({
      invalidatesTags: ["Todolist"],
      query: ({ todolistId, title }) => ({
        url: `todo-lists/${todolistId}`,
        method: "PUT",
        body: { title },
      }),
      async onQueryStarted({ todolistId, title }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todolistsApi.util.updateQueryData("getTodos", undefined, (state) => {
            const todolist = state.find((todolist) => todolist.id === todolistId)
            if (todolist) {
              todolist.title = title
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

export const { useGetTodosQuery, useAddTodolistMutation, useRemoveTodolistMutation, useUpdateTodolistMutation } =
  todolistsApi
