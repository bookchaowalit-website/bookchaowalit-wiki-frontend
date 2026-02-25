import Link from "next/link";
import { getAllWikiPages } from "@/lib/mdx";

export default async function WikiPage() {
  const pages = await getAllWikiPages();

  const categories = [...new Set(pages.map(page => page.category))];
  const tags = [...new Set(pages.flatMap(page => page.tags))];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            All Wiki Pages
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Browse and search through the complete knowledge base
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Categories
              </h2>
              <div className="space-y-2">
                {categories.map((category) => {
                  const categoryPages = pages.filter(p => p.category === category);
                  return (
                    <Link
                      key={category}
                      href={`/wiki?category=${encodeURIComponent(category)}`}
                      className="block px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      {category} ({categoryPages.length})
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  const tagPages = pages.filter(p => p.tags.includes(tag));
                  return (
                    <Link
                      key={tag}
                      href={`/wiki?tag=${encodeURIComponent(tag)}`}
                      className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      {tag} ({tagPages.length})
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/wiki/${page.slug}`}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {page.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {page.category}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {page.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {page.tags.length > 3 && (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-full">
                          +{page.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Updated: {new Date(page.last_updated).toLocaleDateString()}
                    </div>

                    {page.related_pages.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          Related:
                        </span>
                        <span className="ml-2 text-gray-500 dark:text-gray-400">
                          {page.related_pages[0]}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}