import { type ChangeEvent, type KeyboardEvent, useState } from "react"
import TextField from "@mui/material/TextField"
import AddBoxIcon from "@mui/icons-material/AddBox"
import IconButton from "@mui/material/IconButton"

type Props = {
  onCreateItem: (title: string) => void
  disabled?: boolean
}

export const CreateItemForm = ({ onCreateItem, disabled = false }: Props) => {
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

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
        label={"Enter a title"}
        variant={"outlined"}
        value={title}
        size={"small"}
        error={!!error}
        helperText={error}
        disabled={disabled}
        onChange={changeTitleHandler}
        onKeyDown={createItemOnEnterHandler}
      />
      <IconButton onClick={createItemHandler} color={"primary"} disabled={disabled}>
        <AddBoxIcon />
      </IconButton>
    </div>
  )
}
