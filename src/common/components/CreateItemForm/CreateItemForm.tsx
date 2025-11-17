import { type ChangeEvent, type KeyboardEvent, useState } from "react"
import TextField from "@mui/material/TextField"
import AddBoxIcon from "@mui/icons-material/AddBox"
import IconButton from "@mui/material/IconButton"
import { useAppSelector } from "@/common/hooks"
import { selectAppStatus } from "@/app/app-slice.ts"

type Props = {
  onCreateItem: (title: string) => void
}

export const CreateItemForm = ({ onCreateItem }: Props) => {
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  const requestStatus = useAppSelector(selectAppStatus)

  const createItemHandler = () => {
    const trimmedTitle = title.trim()
    if (trimmedTitle !== "") {
      onCreateItem(trimmedTitle)
      setTitle("")
    } else {
      setError("Title is required")
    }
  }

  const changeTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value)
    setError(null)
  }

  const createItemOnEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      createItemHandler()
    }
  }

  return (
    <div>
      <TextField
        disabled={requestStatus === "pending"}
        label={"Enter a title"}
        variant={"outlined"}
        value={title}
        size={"small"}
        error={!!error}
        helperText={error}
        onChange={changeTitleHandler}
        onKeyDown={createItemOnEnterHandler}
      />
      <IconButton onClick={createItemHandler} color={"primary"} disabled={requestStatus === "pending"}>
        <AddBoxIcon />
      </IconButton>
    </div>
  )
}
