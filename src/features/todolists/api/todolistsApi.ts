import type { DomainTodolist, Todolist } from "./todolistsApi.types"

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AUTH_TOKEN } from "@/common/constants"

export const todolistsApi = createApi({
  reducerPath: "todolists",
  baseQuery: fetchBaseQuery({
    baseUrl: `https://social-network.samuraijs.com/api/1.1`,
    headers: {
      "API-KEY": import.meta.env.VITE_API_KEY,
    },
    prepareHeaders: (headers) => headers.set("Authorization", `Bearer ${localStorage.getItem(AUTH_TOKEN)}`),
  }),
  endpoints: (build) => ({
    getTodos: build.query<DomainTodolist[], void>({
      query: () => `todo-lists`,
      transformResponse: (response: Todolist[]): DomainTodolist[] => {
        return response.map((todolist) => ({ ...todolist, filter: "all" }))
      },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetTodosQuery } = todolistsApi
//
// export const _todolistsApi = {
//   getTodolists() {
//     return instance.get<Todolist[]>("/todo-lists")
//   },
//   changeTodolistTitle(payload: { id: string; title: string }) {
//     const { id, title } = payload
//     return instance.put<BaseResponse>(`/todo-lists/${id}`, { title })
//   },
//   createTodolist(title: string) {
//     return instance.post<BaseResponse<{ item: Todolist }>>("/todo-lists", { title })
//   },
//   deleteTodolist(id: string) {
//     return instance.delete<BaseResponse>(`/todo-lists/${id}`)
//   },
// }
