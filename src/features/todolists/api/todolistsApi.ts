import { DomainTodolist } from "@/features/todolists/model/todolists-slice.ts"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { BaseResponse } from "@/common/types"
import { baseApi } from "@/app/api/baseApi.ts"

export const todolistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTodolists: build.query<DomainTodolist[], void>({
      query: () => "todo-lists",
      transformResponse: (todolists: Todolist[]): DomainTodolist[] =>
        todolists.map((todolist) => ({ ...todolist, filter: "all", entityStatus: "idle" })),
      providesTags: ["Todolist"],
    }),
    createTodolist: build.mutation<BaseResponse<{ item: Todolist }>, string>({
      query: (title: string) => ({ method: "post", url: "todo-lists", body: { title } }),
      invalidatesTags: ["Todolist"],
    }),
    deleteTodolist: build.mutation<BaseResponse, string>({
      query: (todolistId: string) => ({ method: "delete", url: `todo-lists/${todolistId}` }),
      async onQueryStarted(id: string, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todolistsApi.util.updateQueryData("getTodolists", undefined, (state) => {
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
      invalidatesTags: ["Todolist"],
    }),
    changeTodolistTitle: build.mutation<BaseResponse, { todolistId: string; title: string }>({
      query: ({ todolistId, title }) => ({
        method: "put",
        url: `todo-lists/${todolistId}`,
        body: { title },
      }),
      invalidatesTags: ["Todolist"],
    }),
  }),
})

export const {
  useGetTodolistsQuery,
  useCreateTodolistMutation,
  useDeleteTodolistMutation,
  useChangeTodolistTitleMutation,
  useLazyGetTodolistsQuery,
} = todolistsApi
