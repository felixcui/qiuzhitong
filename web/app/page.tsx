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
  ChevronRight,
  Globe,

  ArrowRight
} from 'lucide-react';
import clsx from 'clsx';
import { createPortal } from 'react-dom';

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

type SearchEngineType = 'site' | 'baidu' | 'bing' | 'google';

// --- Icons Mapping ---
// 使用更抽象、更具学术感的图标映射逻辑
const getCategoryIconComponent = (category: string) => {
  if (category.includes('经典') || category.includes('著作')) return BookOpen;
  if (category.includes('报') || category.includes('刊') || category.includes('新闻')) return Newspaper;
  if (category.includes('资料') || category.includes('检索') || category.includes('数据库') || category.includes('图书馆')) return Database;
  if (category.includes('院') || category.includes('校') || category.includes('党校') || category.includes('研究')) return Landmark;
  if (category.includes('课') || category.includes('讲座')) return Files;
  return Globe; // Default to Globe for general sites
};

// --- Portal for Modals ---
// 为了保证 Modal 层级正确，使用 Portal
const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;
  // Check if document is defined (SSR safety, though mounted check handles it usually)
  if (typeof document === 'undefined') return null;

  return createPortal(children, document.body);
};


// --- Components ---

// 1. Sidebar Item - Refined with indicator line
const SidebarItem = ({
  category,
  isActive,
  onClick
}: {
  category: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "group w-full flex items-center justify-between px-4 py-3.5 text-sm transition-all duration-200 outline-none relative",
        isActive
          ? "text-party-red font-semibold bg-red-50/50"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
    >
      <div className="flex items-center">
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-party-red rounded-r-full shadow-sm" />
        )}
        <span className={clsx("ml-2 transition-colors", isActive ? "text-party-red" : "text-gray-400 group-hover:text-gray-500")}>
          {React.createElement(getCategoryIconComponent(category), { size: 16 })}
        </span>
        <span className="ml-3 tracking-wide">{category}</span>
      </div>
      {isActive && <ChevronRight size={14} className="text-party-red/60" />}
    </button>
  );
};

// 2. SiteCard - "Index Card" Aesthetic (Updated: Icon + Title in one row)
const SiteCard = ({ site, onClick }: { site: Site, onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-xl p-5 cursor-pointer 
                 border border-gray-100 shadow-card hover:shadow-card-hover hover:border-red-100/50
                 transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden"
    >
      <div className="flex items-center mb-3">
        {/* Icon Container - Subtle & Elegant */}
        <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-600 group-hover:bg-party-red-soft group-hover:text-party-red 
                        flex items-center justify-center transition-colors duration-300 flex-shrink-0">
          {React.createElement(getCategoryIconComponent(site.category), { size: 20 })}
        </div>

        {/* Title */}
        <h3 className="ml-3 text-base font-bold text-gray-900 group-hover:text-party-red transition-colors duration-200 truncate font-serif tracking-tight flex-1">
          {site.name}
        </h3>

        {/* External Link Hint */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 ml-1">
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-1 text-gray-300 group-hover:text-party-red hover:bg-red-50 rounded transition-colors block"
            title="直接访问"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Description */}
      <div className="">
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed h-11">
          {site.desc || '暂无详细描述'}
        </p>
      </div>

      {/* Bottom Decoration line for visual weight */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-party-red/0 to-transparent group-hover:via-party-red/40 transition-all duration-500" />
    </div>
  );
};

// 3. Search Bar - "Hero" Style
const SearchBar = ({
  value,
  onChange,
  onSearch,
  engine,
  setEngine
}: {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  engine: SearchEngineType;
  setEngine: (e: SearchEngineType) => void;
}) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto group">
      {/* Engine Tabs */}
      <div className="absolute -top-10 left-0 flex space-x-1 p-1">
        {[
          { id: 'site', label: '站内检索' },
          { id: 'baidu', label: '百度' },
          { id: 'bing', label: 'Bing' },
          { id: 'google', label: 'Google' }
        ].map(e => (
          <button
            key={e.id}
            onClick={() => setEngine(e.id as SearchEngineType)}
            className={clsx(
              "px-3 py-1 text-xs font-medium rounded-md transition-all duration-200",
              engine === e.id
                ? "bg-party-red text-white shadow-sm"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            )}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="relative flex items-center bg-white rounded-2xl shadow-card hover:shadow-float transition-shadow duration-300 border border-gray-100 focus-within:border-party-red/30 focus-within:ring-4 focus-within:ring-party-red/5">
        <div className="pl-5 text-gray-400 group-focus-within:text-party-red transition-colors">
          <Search size={22} />
        </div>
        <input
          type="text"
          className="w-full h-14 pl-4 pr-32 bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400 text-lg font-medium"
          placeholder={engine === 'site' ? "搜索理论资源名称、关键词..." : "输入关键词搜索全网..."}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <div className="absolute right-2.5 flex items-center">
          {value && (
            <button onClick={() => onChange('')} className="p-2 text-gray-300 hover:text-gray-500 transition-colors mr-1">
              <X size={16} />
            </button>
          )}
          <button
            onClick={onSearch}
            className="h-9 px-5 bg-party-red text-white rounded-xl text-sm font-medium hover:bg-party-red-hover active:scale-95 transition-all duration-200 shadow-sm flex items-center gap-1"
          >
            搜索
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. Detail Modal - Professional & Clean
const DetailModal = ({ site, onClose }: { site: Site | null, onClose: () => void }) => {
  if (!site) return null;

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
        <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity" onClick={onClose} />
        <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">

          {/* Header Bar */}
          <div className="h-1.5 w-full bg-party-red" />
          <div className="absolute top-4 right-4 z-10">
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 bg-white/50 hover:bg-gray-100 rounded-full transition-colors backdrop-blur">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 md:p-10 overflow-y-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-party-red-soft text-party-red rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                {React.createElement(getCategoryIconComponent(site.category), { size: 40 })}
              </div>

              <h2 className="text-3xl font-bold font-serif text-gray-900 mb-2">{site.name}</h2>
              <div className="flex items-center gap-2 mb-8">
                <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-medium border border-gray-200">
                  {site.category}
                </span>
              </div>

              <div className="w-full max-w-lg mb-10">
                <p className="text-gray-600 leading-relaxed text-base">
                  {site.desc || "暂无详细介绍，请直接访问网站获取更多信息。"}
                </p>
              </div>

              <a
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 px-10 py-3.5 bg-party-red text-white text-base font-medium rounded-xl hover:bg-party-red-hover transition-all duration-200 shadow-lg shadow-party-red/20 hover:-translate-y-0.5 w-full sm:w-auto"
              >
                <span>访问官方网站</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>


          </div>
        </div>
      </div>
    </ModalPortal>
  );
};


// 5. About Modal - Elegant Typography
const AboutModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-float w-full max-w-lg p-8 animate-fade-in-up">

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-party-red text-white rounded-lg flex items-center justify-center font-serif font-bold text-xl shadow-md">
                求
              </div>
              <h2 className="text-2xl font-bold font-serif text-gray-900">求知汇</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6 text-gray-600">
            <p className="text-lg leading-relaxed font-serif text-gray-800">
              专注于思想理论领域的垂直导航平台。
            </p>
            <p className="leading-relaxed">
              在一个信息碎片化的时代，我们将<strong className="text-party-red font-medium">权威</strong>、<strong className="text-party-red font-medium">经典</strong>与<strong className="text-party-red font-medium">深度</strong>重新聚合。为高校师生、研究员及理论爱好者提供一方纯净的学术检索天地。
            </p>

            <div className="grid grid-cols-3 gap-4 py-4">
              {[
                { l: '权威', d: '严选官方信源' },
                { l: '极致', d: '零广告干扰' },
                { l: '高效', d: '一键直达' }
              ].map(i => (
                <div key={i.l} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-party-red font-bold mb-1">{i.l}</div>
                  <div className="text-xs text-gray-400">{i.d}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
            <span>Version 1.0.0 (Beta)</span>
            <span>Designed for Academic Research</span>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};


// --- Main Page Skeleton ---

export default function Home() {
  // Derive Categories once
  const categories = useMemo(() => Array.from(new Set(sitesData.map((s: Site) => s.category))), []);

  const [activeCategory, setActiveCategory] = useState<string>(() => {
    // Initialize with first category
    const cats = Array.from(new Set(sitesData.map((s: Site) => s.category)));
    return cats.length > 0 ? cats[0] : '';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchEngine, setSearchEngine] = useState<SearchEngineType>('site');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  // Scroll Spy
  useEffect(() => {
    if (searchEngine === 'site' && searchQuery) return;
    const container = document.getElementById('main-scroll');
    if (!container) return;

    const handleScroll = () => {
      // Find visible category
      let currentCat = activeCategory;
      let minDiff = Infinity;

      for (const cat of categories) {
        const el = document.getElementById(`cat-${cat}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          // We want the category that is near the top (e.g., top is between 0 and 300)
          const diff = Math.abs(rect.top - 150);
          if (diff < minDiff) {
            minDiff = diff;
            currentCat = cat;
          }
        }
      }
      // Only update if changed
      setActiveCategory(prev => (prev !== currentCat ? currentCat : prev));
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [categories, activeCategory, searchQuery, searchEngine]);


  // Scroll Handler
  const scrollToCategory = (cat: string) => {
    setActiveCategory(cat);
    if (searchEngine === 'site' && searchQuery) setSearchQuery('');

    // Slight delay to allow state update/rendering if needed (though synch here)
    // Use requestAnimationFrame for smoothness if needed, but direct is fine
    setTimeout(() => {
      const el = document.getElementById(`cat-${cat}`);
      const container = document.getElementById('main-scroll');
      if (el && container) {
        // Sticky header height allowance
        const topOffset = el.offsetTop - 24;
        container.scrollTo({ top: topOffset, behavior: 'smooth' });
      }
    }, 0);
  };

  // Search Logic
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    if (searchEngine !== 'site') {
      const urls = {
        baidu: `https://www.baidu.com/s?wd=${encodeURIComponent(searchQuery)}`,
        bing: `https://www.bing.com/search?q=${encodeURIComponent(searchQuery)}`,
        google: `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`
      };
      window.open(urls[searchEngine], '_blank');
    }
  };

  // Filtered Sites
  const filteredSites = useMemo(() => {
    if (searchEngine !== 'site' || !searchQuery) return [];
    const q = searchQuery.toLowerCase();
    return sitesData.filter((s: Site) =>
      s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    );
  }, [searchQuery, searchEngine]);

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col text-gray-900 font-sans selection:bg-red-100 selection:text-party-red overflow-hidden">

      {/* 1. Global Header - Glassmorphism */}
      <header className="flex-none h-16 px-6 lg:px-10 flex items-center justify-between border-b border-gray-200/60 bg-white/80 backdrop-blur-md z-30">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setSearchQuery(''); if (categories.length) scrollToCategory(categories[0]); }}>
          <div className="w-8 h-8 rounded-lg bg-party-red text-white flex items-center justify-center shadow-lg shadow-party-red/20 group-hover:scale-105 transition-transform duration-200">
            <BookOpen size={18} />
          </div>
          <span className="font-serif font-bold text-xl tracking-tight text-gray-900 group-hover:text-party-red transition-colors">
            求知汇 <span className="text-xs font-sans font-normal text-gray-400 ml-1 tracking-normal">Qiuzhi Hui</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAbout(true)}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            关于我们
          </button>
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
            <span>提交收录</span>
          </button>
        </div>
      </header>


      {/* 2. Main Layout - Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">

        {/* Sidebar - Fixed width, refined scroll */}
        <aside className="w-64 flex-none border-r border-gray-200 bg-white/50 backdrop-blur-sm hidden lg:flex flex-col h-full z-20">
          <div className="p-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-4 mb-2">资源目录</h3>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 pb-6 space-y-0.5 custom-scrollbar">
            {categories.map(cat => (
              <SidebarItem
                key={cat}
                category={cat}
                isActive={!searchQuery && activeCategory === cat}
                onClick={() => scrollToCategory(cat)}
              />
            ))}
          </nav>
          <div className="p-4 border-t border-gray-100 text-center">
            <span className="text-xs text-gray-300 font-serif italic">Seeking Truth from Facts</span>
          </div>
        </aside>

        {/* Content Area */}
        <main id="main-scroll" className="flex-1 overflow-y-auto bg-[#FAFAFA] scroll-smooth">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-10 min-h-full">

            {/* Search Hero */}
            <div className="mb-16 mt-4 md:mt-6">
              <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 tracking-tight">
                  探索思想理论的<span className="text-party-red inline-block relative">
                    海洋
                    <svg className="absolute w-full h-2 bottom-0 left-0 text-party-red/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                  </span>
                </h1>
                <p className="text-gray-500 max-w-lg mx-auto text-base md:text-lg leading-relaxed">
                  汇集权威机构、核心期刊、经典著作与前沿数据库
                </p>
              </div>
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                engine={searchEngine}
                setEngine={setSearchEngine}
              />
            </div>

            {/* Conditional Content */}
            {searchEngine === 'site' && searchQuery ? (
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-2 mb-6 text-gray-800 font-bold text-lg">
                  <Search size={20} className="text-party-red" />
                  <span>检索结果</span>
                  <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{filteredSites.length}</span>
                </div>
                {filteredSites.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-5">
                    {filteredSites.map(site => (
                      <SiteCard key={site.id} site={site} onClick={() => setSelectedSite(site)} />
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                    <Search size={48} className="mx-auto mb-4 text-gray-200" />
                    <p>未找到相关资源，请尝试缩短关键词</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-16 pb-20">
                {categories.map(cat => {
                  const catSites = sitesData.filter((s: Site) => s.category === cat);
                  return (
                    <div key={cat} id={`cat-${cat}`} className="scroll-mt-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-6 bg-party-red rounded-full" />
                        <h2 className="text-xl font-bold text-gray-900 font-serif tracking-tight">{cat}</h2>
                        <div className="h-px flex-1 bg-gray-100" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-5">
                        {catSites.map(site => (
                          <SiteCard key={site.id} site={site} onClick={() => setSelectedSite(site)} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

      </div>

      {/* Modals */}
      <DetailModal site={selectedSite} onClose={() => setSelectedSite(null)} />
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
    </div>
  );
}
