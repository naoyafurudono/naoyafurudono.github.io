import { Paragraph } from '@/models/markdown';

export default function Paragraph(props: Paragraph) {
  const { text } = props
  return <p>{text}</p>
}
