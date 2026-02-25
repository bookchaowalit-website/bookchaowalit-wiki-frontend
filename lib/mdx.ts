import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export interface WikiPage {
  title: string;
  category: string;
  tags: string[];
  last_updated: string;
  related_pages: string[];
  content: string;
  slug: string;
}

export async function getAllWikiPages() {
  const contentDir = path.join(process.cwd(), 'content', 'wiki');
  const files = await fs.readdir(contentDir);
  const mdxFiles = files.filter(file => file.endsWith('.mdx'));

  const pages = await Promise.all(
    mdxFiles.map(async (file) => {
      const filePath = path.join(contentDir, file);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const { data, content } = matter(fileContent);

      return {
        ...data,
        slug: file.replace('.mdx', ''),
        last_updated: data.last_updated || new Date().toISOString(),
        content
      } as WikiPage;
    })
  );

  return pages.sort((a, b) => {
    const dateA = new Date(a.last_updated);
    const dateB = new Date(b.last_updated);
    return dateB.getTime() - dateA.getTime();
  });
}

export async function getWikiPageBySlug(slug: string) {
  try {
    const contentDir = path.join(process.cwd(), 'content', 'wiki');
    const filePath = path.join(contentDir, `${slug}.mdx`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
      ...data,
      slug,
      last_updated: data.last_updated || new Date().toISOString(),
      content
    } as WikiPage;
  } catch (error) {
    return null;
  }
}

export async function searchWikiPages(query: string) {
  const pages = await getAllWikiPages();
  const lowercaseQuery = query.toLowerCase();

  return pages.filter(page =>
    page.title.toLowerCase().includes(lowercaseQuery) ||
    page.category.toLowerCase().includes(lowercaseQuery) ||
    page.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    page.content.toLowerCase().includes(lowercaseQuery)
  );
}

export async function getPagesByCategory(category: string) {
  const pages = await getAllWikiPages();
  return pages.filter(page => page.category === category);
}

export async function getPagesByTag(tag: string) {
  const pages = await getAllWikiPages();
  const lowercaseTag = tag.toLowerCase();
  return pages.filter(page =>
    page.tags.some(pageTag => pageTag.toLowerCase() === lowercaseTag)
  );
}

export async function getCategories() {
  const pages = await getAllWikiPages();
  const categories = [...new Set(pages.map(page => page.category))];
  return categories;
}

export async function getAllTags() {
  const pages = await getAllWikiPages();
  const allTags = pages.flatMap(page => page.tags);
  const uniqueTags = [...new Set(allTags)];
  return uniqueTags;
}