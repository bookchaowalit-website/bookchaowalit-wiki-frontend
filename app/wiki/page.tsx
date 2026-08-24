import Link from "next/link";
import { getAllWikiPages } from "@/lib/mdx";

function excerpt(content: string) {
  const line = content.split("\n").find((item) => item.trim() && !item.trim().startsWith("#"));
  return line?.replace(/[*_]/g, "").slice(0, 160) || "A page in the local knowledge archive.";
}
export default async function WikiPage() {
  const pages = await getAllWikiPages();
  const categories = [...new Set(pages.map((page) => page.category))];
  const tags = [...new Set(pages.flatMap((page) => page.tags))];

  return (
    <main className="wiki-shell">
      <header className="wiki-header">
        <Link href="/" className="wiki-mark">B/15</Link>
        <div className="wiki-brand"><strong>FIELD MANUAL</strong><span>COMPLETE KNOWLEDGE / LOCAL MDX</span></div>
        <Link href="/" className="wiki-back">← Home</Link>
      </header>
      <section className="full-index-hero"><p className="wiki-kicker">BOOKCHAOWALIT / COMPLETE INDEX</p><h1>Every page has<br /><em>a place.</em></h1><p>Browse the current local archive by section or tag. It is a read-only working shelf.</p></section>
      <section className="full-index-grid">
        <aside className="index-rail">
          <div><span>SECTIONS</span><strong>{String(categories.length).padStart(2, "0")}</strong></div>
          {categories.map((category) => <Link key={category} href={"/wiki?category=" + encodeURIComponent(category)}>{category}<b>{pages.filter((page) => page.category === category).length}</b></Link>)}
          <div className="rail-tags"><span>TAGS ON FILE</span><div>{tags.map((tag) => <Link key={tag} href={"/wiki?tag=" + encodeURIComponent(tag)}>{tag}</Link>)}</div></div>
        </aside>
        <div className="page-register full-register">
          <div className="register-heading"><div><span>ALL LEAVES</span><h2>The archive.</h2></div><span>{pages.length} PAGES</span></div>
          {pages.map((page, index) => <Link href={"/wiki/" + page.slug} className="page-row" key={page.slug}><span className="page-number">{String(index + 1).padStart(2, "0")}</span><div className="page-copy"><span>{page.category}</span><h3>{page.title}</h3><p>{excerpt(page.content)}</p><div className="tag-line">{page.tags.slice(0, 3).map((tag) => <em key={tag}>{tag}</em>)}</div></div><div className="page-meta"><time>{new Date(page.last_updated).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</time><b>OPEN ↗</b></div></Link>)}
        </div>
      </section>
      <footer className="wiki-footer"><span>BOOKCHAOWALIT / WIKI INDEX</span><span>READ ONLY · LOCAL MDX</span></footer>
    </main>
  );
}
