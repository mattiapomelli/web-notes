interface MessageType {
  type: "download" | "notes" | "new-session",
  format?: "md" | "html" | "txt",
  text?: string,
  html?: string
}

export { MessageType }