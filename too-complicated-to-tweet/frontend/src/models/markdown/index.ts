// Markdown docsのモデル

export type Markdown = Array<Component>
type Component = Heading | Paragraph

type Heading = {
  type: "heading"
  level: number
  text: string
}

type Paragraph = {
  type: "paragraph"
  text: string
}

export const fromText = (text: string): Markdown => {
  if (text.startsWith("#")) {
    const level = text.match(/#+/)?.[0].length
    const heading = text.replace(/#+/, "").trim()
    if (!level) {
      throw new MarkdownError("Invalid heading")
    }
    return [
      {
        type: "heading",
        level: level || 1,
        text: heading
      }
    ]
  }
  return [
    {
      type: "paragraph",
      text
    }
  ]
}

class MarkdownError extends Error {
  static {
    this.prototype.name = "MarkdownError"
  }
}