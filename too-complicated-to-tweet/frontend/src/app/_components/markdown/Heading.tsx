import { Heading } from '@/models/markdown';

export default function Heading(props: Heading) {
  const { level, text } = props
  switch (level) {
    case 1:
      return <h1>{text}</h1>
    case 2:
      return <h2>{text}</h2>
    case 3:
      return <h3>{text}</h3>
    default:
      return <h4>{text}</h4>
  }
}