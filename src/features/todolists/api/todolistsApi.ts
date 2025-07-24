// Во избежание ошибок импорт должен быть из `@reduxjs/toolkit/query/react`
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AUTH_TOKEN } from "@/common/constants"
import { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { BaseResponse } from "@/common/types"

// `createApi` - функция из `RTK Query`, позволяющая создать объект `API`
// для взаимодействия с внешними `API` и управления состоянием приложения
export const todolistsApi = createApi({
  // `reducerPath` - имя `slice`, куда будут сохранены состояние и экшены для этого `API`
  reducerPath: "todolistsApi",
  tagTypes: ['Todolist'],
  // `baseQuery` - конфигурация для `HTTP-клиента`, который будет использоваться для отправки запросов
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("API-KEY", import.meta.env.VITE_API_KEY)
      headers.set("Authorization", `Bearer ${localStorage.getItem(AUTH_TOKEN)}`)
    },
  }),
  // `endpoints` - метод, возвращающий объект с эндпоинтами для `API`, описанными
  // с помощью функций, которые будут вызываться при вызове соответствующих методов `API`
  // (например `get`, `post`, `put`, `patch`, `delete`)
  endpoints: (build) => ({
    // Типизация аргументов (<возвращаемый тип, тип query аргументов (`QueryArg`)>)
    // `query` по умолчанию создает запрос `get` и указание метода необязательно
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => "todo-lists",
      transformResponse: (todolists: Todolist[]): DomainTodolist[] =>
        todolists.map((todolist) => ({ ...todolist, filter: "all", entityStatus: "idle" })),
      providesTags: ['Todolist'],
    }),
    createTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
      query: (title: string) => ({ method: "post", url: "todo-lists", body: { title } }),
      invalidatesTags: ['Todolist'],
    }),
    deleteTodolist: build.mutation<BaseResponse, string>({
      query: (todolistId: string) => ({ method: "delete", url: `todo-lists/${todolistId}` }),
      invalidatesTags: ['Todolist'],
    }),
    changeTodolistTitle: build.mutation<BaseResponse, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => ({
        method: "put",
        url: `todo-lists/${todolistId}`,
        body: { title },
      }),
      invalidatesTags: ['Todolist'],
    }),
  }),
})

// `createApi` создает объект `API`, который содержит все эндпоинты в виде хуков,
// определенные в свойстве `endpoints`
export const { useGetTodolistsQuery, useCreateTodolistMutation, useDeleteTodolistMutation, useChangeTodolistTitleMutation, useLazyGetTodolistsQuery } =
  todolistsApi
