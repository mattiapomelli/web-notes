type FormatType = "md" | "html" | "txt"

type MessageType = {
  type: "new-session" | "reset-session",
}

type NotesType = {
  plain: string,
  html: string
}

export { MessageType, FormatType, NotesType }