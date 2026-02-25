import { notFound } from "next/navigation";
import Link from "next/link";
import { getWikiPageBySlug } from "@/lib/mdx";
import React from "react";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const { getAllWikiPages } = await import('@/lib/mdx');
  const pages = await getAllWikiPages();
  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export default async function WikiPageDetail({ params }: PageProps) {
  const page = await getWikiPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/wiki"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            ← Back to Wiki
          </Link>
        </div>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <header className="mb-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {page.title}
                  </h1>
                  <div className="flex items-center space-x-4">
                    <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                      {page.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Updated: {new Date(page.last_updated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {page.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {page.related_pages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Related Pages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {page.related_pages.map((relatedPage, index) => (
                      <Link
                        key={index}
                        href={`/wiki/${relatedPage}`}
                        className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        {relatedPage}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </header>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>
        </article>
      </main>
    </div>
  );
}