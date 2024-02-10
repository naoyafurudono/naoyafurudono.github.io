import { Markdown } from "@/models/markdown";
import Heading from "./Heading";
import Paragraph from "./Paragraph";
import Button from "@mui/material/Button";

type MdProps = {
  markdown: Markdown
}
export const Md = (props: MdProps) => {
  const { markdown } = props
  return (
    <>
      <Button variant="text">リンクぽいボタン</Button>
      <Button variant="outlined">無害なボタン</Button>
      <Button variant="contained">有害なボタン</Button>
      {
        markdown.map((c, i) => {
          switch (c.type) {
            case "heading":
              return <Heading key={i} {...c} />
            case "paragraph":
              return <Paragraph key={i} {...c} />
            default:
              return <Button></Button>
          }
        })
      }
    </>
  )
}
