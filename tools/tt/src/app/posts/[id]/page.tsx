import { Metadata, NextPage } from "next";
import { Article, getArticle, listArticles } from "@/lib/gateway";
import { unified } from "unified";
import remarkParse from "remark-parse";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkRehype from "remark-rehype";
import { Node } from "unist";
import * as yaml from "yaml";

type Props = {
  params: {
    id: string;
  };
};
const Post: NextPage<Props> = async ({ params }) => {
  const { id } = params;
  const a = getArticle({ articleId: id });
  const rendered: RenderResult = await render(a);

  return (
    <>
      <article>
        <h1>{rendered.title}</h1>
        <time>{rendered.date}</time>
        <div
          dangerouslySetInnerHTML={{ __html: rendered.rawBody.toString() }}
        ></div>
      </article>
    </>
  );
};

export default Post;
export async function generateStaticParams() {
  return listArticles().map((a) => ({
    id: a.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const a = getArticle({ articleId: id });
  const r = await render(a);
  return {
    title: r.title,
  };
}

type RenderResult = {
  rawBody: string;
  date: string;
  title: string;
};

async function render(a: Article): Promise<RenderResult> {
  let frontmatter: Node | null = null;
  const result = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkExtractFrontmatter, { yaml: yaml.parse })
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(a.content);
  return {
    rawBody: result.toString(),
    date: result.data.date as string,
    title: result.data.title as string,
  };
}
