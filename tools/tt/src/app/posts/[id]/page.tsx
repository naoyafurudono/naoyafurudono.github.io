import { NextPage } from "next";
import { Article, getArticle, listArticles } from "@/lib/gateway";
import { unified } from "unified";
import remarkParse from "remark-parse";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkStringify from "remark-stringify";
import remarkRehype from "remark-rehype";

type Props = {
  params: {
    id: string;
  };
};
const Post: NextPage<Props> = async ({ params }) => {
  const { id } = params;
  const a = getArticle({ articleId: id });
  const rendered = await render(a);

  return (
    <>
      <article>
        <h1>{id}</h1>
        <div dangerouslySetInnerHTML={{ __html: rendered.toString() }}></div>
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

async function render(a: Article): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(a.content);
  return String(result);
}
