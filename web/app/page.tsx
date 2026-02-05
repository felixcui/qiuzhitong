"use client";

import React, { useState, useMemo, useEffect } from 'react';
import sitesData from '../lib/sites.json';
import {
  BookOpen,
  Newspaper,
  Files,
  Landmark,
  Database,
  Search,
  X,
  ExternalLink,
  Star,
  Menu,
  Share2,
  Heart
} from 'lucide-react';
import clsx from 'clsx';

// --- Types ---
interface Site {
  id: number;
  name: string;
  url: string;
  category: string;
  desc: string;
  tags: string[];
  icon: string;
}

// --- Icons Mapping ---
// --- Icons Mapping ---
const getCategoryIconComponent = (category: string) => {
  if (category.includes('经典') || category.includes('著作')) return BookOpen;
  if (category.includes('报') || category.includes('刊') || category.includes('新闻')) return Newspaper;
  if (category.includes('资料') || category.includes('检索') || category.includes('数据库') || category.includes('图书馆')) return Database;
  if (category.includes('院') || category.includes('校') || category.includes('党校') || category.includes('研究')) return Landmark;
  if (category.includes('课') || category.includes('讲座')) return Files;
  return Star;
};

const getCategoryIcon = (category: string) => {
  const Icon = getCategoryIconComponent(category);
  return <Icon className="w-4 h-4" />;
};

// --- Components ---

const SiteIcon = ({ site, size = "normal" }: { site: Site, size?: "normal" | "large" }) => {
  const Icon = getCategoryIconComponent(site.category);

  const containerClass = size === 'large'
    ? "w-24 h-24 rounded-2xl mb-6 border border-red-100 shadow-sm"
    : "w-10 h-10 rounded-md mr-4 border border-red-100 shadow-sm";

  const iconSizeClass = size === 'large' ? "w-10 h-10" : "w-5 h-5";

  return (
    <div className={clsx("bg-red-50 text-party-red flex items-center justify-center flex-shrink-0", containerClass)}>
      <Icon className={iconSizeClass} />
    </div>
  );
};

const Sidebar = ({
  categories,
  activeCategory,
  onScrollTo
}: {
  categories: string[],
  activeCategory: string | null,
  onScrollTo: (c: string) => void
}) => {
  return (
    <nav className="space-y-1">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onScrollTo(cat)}
          className={clsx(
            "w-full flex items-center px-4 py-3 text-sm font-medium border-r-4 transition-colors text-left",
            activeCategory === cat
              ? "bg-red-50 text-party-red-dark border-party-red"
              : "text-gray-600 border-transparent hover:bg-gray-50 hover:text-gray-900 hover:border-gray-200"
          )}
        >
          <span className={clsx("mr-3", activeCategory === cat ? "text-party-red" : "text-gray-400")}>
            {getCategoryIcon(cat)}
          </span>
          {cat}
        </button>
      ))}
    </nav>
  );
};

const SiteCard = ({ site, onClick }: { site: Site, onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer flex items-center h-20"
    >
      {/* Icon */}
      <SiteIcon site={site} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-gray-900 group-hover:text-party-red transition-colors truncate" title={site.name}>
          {site.name}
        </h3>
        <p className="text-xs text-gray-400 truncate mt-0.5">{site.desc || '暂无描述'}</p>
      </div>

      {/* External Link Action */}
      <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-gray-300 hover:text-party-red p-2 rounded-full hover:bg-red-50 transition-colors block"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

const DetailModal = ({ site, onClose }: { site: Site | null, onClose: () => void }) => {
  if (!site) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Drawer */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full overflow-y-auto animate-fade-in-up border-l border-gray-100 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur z-10 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors">
            <X className="w-5 h-5" />
            <span>关闭</span>
          </button>
          <div className="flex space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 md:p-12 flex-1">
          <div className="flex flex-col items-center text-center mb-10">
            <SiteIcon site={site} size="large" />

            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full mb-4">
              {site.category}
            </span>

            <h2 className="text-3xl font-bold text-gray-900 font-serif mb-6">{site.name}</h2>

            <a
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-party-red text-white font-medium rounded-lg hover:bg-red-800 transition-colors shadow-lg hover:-translate-y-0.5 transform duration-200"
            >
              <span>立即访问网站</span>
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>

          <div className="border-t border-gray-100 pt-10">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-party-red pl-3 font-serif">
              详细介绍
            </h3>
            <div className="prose prose-red text-gray-600 max-w-none leading-relaxed">
              <p>{site.desc || '暂无详细介绍。'}</p>
            </div>

            {/* Mock Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {['权威', '理论', '学习'].map(tag => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-500 rounded text-sm"># {tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 sm:p-8 animate-fade-in-up flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-serif text-gray-900 flex items-center">
            <BookOpen className="w-6 h-6 text-party-red mr-3" />
            关于我们
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 text-gray-600 leading-relaxed">
          <p>
            <strong className="text-gray-900">求知汇 (Qiuzhi Hui)</strong> 是一个专注于思想理论领域的垂直导航平台。
          </p>

          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <h3 className="font-bold text-party-red-dark mb-2 text-sm uppercase tracking-wide">核心价值</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="mr-2 text-party-red">•</span>
                <span><strong>高效获取：</strong>一站式直达权威理论资源，节省检索时间。</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-party-red">•</span>
                <span><strong>资源发现：</strong>打破信息茧房，发现同领域优质站点。</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-party-red">•</span>
                <span><strong>极简体验：</strong>无广告干扰，营造专注的学术研究环境。</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-2">适用人群</h3>
            <p className="text-sm">
              高校师生、社科院研究员、党政机关干部、理论宣传工作者以及广大思想理论爱好者。
            </p>
          </div>

          <div className="pt-6 border-t border-gray-100 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Qiuzhi Tong. All rights reserved.</p>
            <p className="mt-1">Designed for academic and theoretical research.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Category Section Component ---
const CategorySection = ({
  category,
  sites,
  onSelectSite
}: {
  category: string,
  sites: Site[],
  onSelectSite: (site: Site) => void
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // Limit to 20 unless expanded
  const displayedSites = isExpanded ? sites : sites.slice(0, 20);
  const hasMore = sites.length > 20;

  return (
    <div id={`cat-${category}`} className="mb-10 px-4 scroll-mt-24">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <div className="w-1.5 h-6 bg-party-red mr-3 rounded-full"></div>
          {category}
          <span className="ml-3 text-sm font-normal text-gray-400">({sites.length})</span>
        </h2>
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-party-red hover:text-party-red-dark font-medium hover:underline transition-colors"
          >
            {isExpanded ? '收起' : '查看更多 >'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {displayedSites.map(site => (
          <SiteCard
            key={site.id}
            site={site}
            onClick={() => onSelectSite(site)}
          />
        ))}
      </div>
    </div>
  );
};

// --- Main Page ---

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchEngine, setSearchEngine] = useState<'site' | 'baidu' | 'bing' | 'google'>('site');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  // Extract Categories
  const categories = useMemo(() => {
    const unique = Array.from(new Set(sitesData.map((s: Site) => s.category)));
    return unique;
  }, []);

  // Initialize active category
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // Scroll Spy to update active category based on scroll position
  useEffect(() => {
    if (searchEngine === 'site' && searchQuery) return; // Don't spy when searching site

    const container = document.getElementById('scroll-container');
    if (!container) return;

    const handleScroll = () => {
      // Logic: find the section that is closest to the top of the container
      for (const cat of categories) {
        const el = document.getElementById(`cat-${cat}`);
        if (el) {
          // Get position relative to the viewport/container
          const rect = el.getBoundingClientRect();
          // The container top is roughly at 64px (header height) from viewport top
          // We check if the element top is near the container top (header height)
          // rect.top is relative to viewport. Header is 64px (4rem).
          // So we check if rect.top is around 64-200px.
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveCategory(cat);
            break;
          }
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [categories, searchQuery]);


  // Logic for scrolling to category
  const scrollToCategory = (cat: string) => {
    setActiveCategory(cat);

    // Switch to site search and clear query if we want to jump to category? 
    // Actually, preserving context is fine, but usually clicking a category implies browsing.
    // Let's just reset search if it was a site search that was filtering things.
    if (searchEngine === 'site' && searchQuery) setSearchQuery('');

    const el = document.getElementById(`cat-${cat}`);
    const container = document.getElementById('scroll-container');

    if (el && container) {
      // We want to scroll the container so that 'el' is at the top.
      // el.offsetTop is relative to the nearest positioned ancestor (the main container usually if relative)
      // Actually, main is relative? No, let's use scrollIntoView for simplicity or calculation
      const headerOffset = 20; // minimal offset

      // Calculate position inside container
      // offsetTop is relative to the scroll-container if it is positioned.
      // better:
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const currentScroll = container.scrollTop;
      const relativeTop = elRect.top - containerRect.top;

      container.scrollTo({
        top: currentScroll + relativeTop - headerOffset,
        behavior: "smooth"
      });
    }
  };

  const handleLogoClick = () => {
    setSearchQuery('');
    setSearchEngine('site'); // Reset to site search
    const container = document.getElementById('scroll-container');
    if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    if (categories.length > 0) setActiveCategory(categories[0]);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    let url = '';
    switch (searchEngine) {
      case 'baidu':
        url = `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery)}`;
        break;
      case 'bing':
        url = `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`;
        break;
      case 'google':
        url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
        break;
      case 'site':
      default:
        return; // Site search is reactive
    }

    if (url) window.open(url, '_blank');
  };

  // Filter Sites logic for SEARCH only
  const searchResults = useMemo(() => {
    if (searchEngine !== 'site') return []; // Only filter for site search
    if (!searchQuery.trim()) return [];

    const q = searchQuery.toLowerCase();
    return sitesData.filter((s: Site) =>
      s.name.toLowerCase().includes(q) ||
      s.desc.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  }, [searchQuery, searchEngine]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 sm:px-6 lg:px-8 shadow-sm flex-shrink-0 z-40">
        <div
          className="flex items-center mr-8 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleLogoClick}
        >
          <div className="w-8 h-8 bg-party-red text-white rounded flex items-center justify-center mr-3 font-serif font-bold text-xl shadow-sm">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold font-serif tracking-wide text-gray-900 hidden sm:block">求知汇</span>
        </div>

        <div className="flex-1"></div>

        <div className="flex items-center space-x-4 ml-4">
          <button className="p-2 text-gray-500 hover:text-party-red lg:hidden">
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden lg:flex items-center space-x-4 text-sm font-medium text-gray-600">
            <button
              onClick={() => setShowAbout(true)}
              className="hover:text-party-red cursor-pointer focus:outline-none transition-colors"
            >
              关于我们
            </button>
            <button className="px-3 py-1.5 bg-gray-100 rounded text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer focus:outline-none">
              提交收录
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden w-full bg-gray-50">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 overflow-y-auto hidden lg:block h-full flex-shrink-0">
          <div className="py-4">
            <div className="px-6 mb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
              资源分类
            </div>
            <Sidebar
              categories={categories}
              activeCategory={searchQuery ? null : activeCategory}
              onScrollTo={scrollToCategory}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth" id="scroll-container">

          {/* Search Section */}
          <div className="mb-8 max-w-4xl mx-auto w-full">
            <div className="flex flex-col items-center">
              {/* Engine Selector */}
              <div className="flex items-center p-1 bg-gray-100 rounded-lg mb-4">
                {[
                  { id: 'site', label: '站内' },
                  { id: 'baidu', label: '百度' },
                  { id: 'bing', label: 'Bing' },
                  { id: 'google', label: 'Google' }
                ].map((engine) => (
                  <button
                    key={engine.id}
                    onClick={() => setSearchEngine(engine.id as any)}
                    className={clsx(
                      "px-6 py-1.5 text-sm font-medium rounded-md transition-all",
                      searchEngine === engine.id
                        ? "bg-white text-party-red shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    )}
                  >
                    {engine.label}
                  </button>
                ))}
              </div>

              {/* Input Box */}
              <div className="relative w-full shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className={clsx("w-5 h-5", searchQuery ? "text-party-red" : "text-gray-400")} />
                </div>
                <input
                  type="text"
                  className="block w-full pl-12 pr-24 py-4 text-base border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-party-red/20 focus:border-party-red transition-all"
                  placeholder={
                    searchEngine === 'site' ? "搜索资源名称、描述..." :
                      `在 ${searchEngine === 'baidu' ? '百度' : searchEngine === 'bing' ? 'Bing' : 'Google'} 搜索...`
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-2 text-gray-300 hover:text-gray-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={handleSearch}
                    className="bg-party-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors ml-2"
                  >
                    搜索
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 1. If Searching Site: Show Flat List */}
          {searchEngine === 'site' && searchQuery ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <Search className="w-5 h-5 text-party-red mr-2" />
                  搜索结果 ({searchResults.length})
                </h2>
              </div>
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                  {searchResults.map((site: Site) => (
                    <SiteCard
                      key={site.id}
                      site={site}
                      onClick={() => setSelectedSite(site)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <Search className="w-12 h-12 mb-4 text-gray-300" />
                  <p>未找到相关网站</p>
                </div>
              )}
            </>
          ) : (
            /* 2. If Not Searching: Show All Categories Vertically */
            <div className="space-y-2">
              {categories.map(cat => {
                const catSites = sitesData.filter((s: Site) => s.category === cat);
                return (
                  <CategorySection
                    key={cat}
                    category={cat}
                    sites={catSites}
                    onSelectSite={setSelectedSite}
                  />
                );
              })}

              <div className="text-center py-10 text-gray-400 text-sm">
                — 已经到底了 —
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Detail Modal */}
      {selectedSite && (
        <DetailModal site={selectedSite} onClose={() => setSelectedSite(null)} />
      )}

      {/* About Modal */}
      {showAbout && (
        <AboutModal onClose={() => setShowAbout(false)} />
      )}
    </div>
  );
}
