import { FilterValues } from "@/features/todolists/model/todolists-slice.ts"
import { RequestStatus } from "@/common/types"

export type Todolist = {
  id: string
  title: string
  addedDate: string
  order: number
}

export type DomainTodolist = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}