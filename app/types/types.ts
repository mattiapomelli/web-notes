type FormatType = "md" | "html" | "txt"

interface MessageType {
  type: "download" | "notes" | "new-session",
  format?: FormatType,
  text?: string,
  html?: string,
  title?: string
}

type NotesType = {
  plain: string,
  html: string
}

export { MessageType, FormatType, NotesType }