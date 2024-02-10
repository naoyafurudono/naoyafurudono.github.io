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
  return [
    {
      type: "paragraph",
      text
    }
  ]
}
