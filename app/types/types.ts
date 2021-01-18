type FormatType = "md" | "html" | "txt"

interface MessageType {
  type: "download" | "notes" | "new-session",
  format?: FormatType,
  text?: string,
  html?: string
}

export { MessageType, FormatType }