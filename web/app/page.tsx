"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  onClick,
  count
}: {
  category: string;
  isActive: boolean;
  onClick: () => void;
  count?: number;
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-current={isActive ? 'true' : 'false'}
      aria-label={`跳转到 ${category} 分类`}
      className={clsx(
        "group w-full flex items-center justify-between px-4 py-3 text-sm transition-all duration-200 relative focus-visible:ring-2 focus-visible:ring-party-red focus-visible:ring-offset-2 rounded-lg mx-0",
        isActive
          ? "text-party-red font-semibold bg-red-50/60"
          : "text-gray-600 hover:bg-[#F0EBE4]/60 hover:text-gray-900"
      )}
    >
      <div className="flex items-center">
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-party-red to-party-red/40 rounded-r-full" aria-hidden="true" />
        )}
        <span className={clsx("ml-2 transition-colors", isActive ? "text-party-red" : "text-gray-400 group-hover:text-gray-500")} aria-hidden="true">
          {React.createElement(getCategoryIconComponent(category), { size: 15 })}
        </span>
        <span className="ml-2.5 tracking-wide">{category}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {count !== undefined && (
          <span className={clsx(
            "text-xs px-1.5 py-0.5 rounded-full tabular-nums font-medium",
            isActive
              ? "bg-party-red/10 text-party-red"
              : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
          )}>
            {count}
          </span>
        )}
        {isActive && <ChevronRight size={13} className="text-party-red/50" aria-hidden="true" />}
      </div>
    </button>
  );
};

// 2. SiteCard - "Index Card" Aesthetic (Updated: Icon + Title in one row)
const SiteCard = ({ site, onClick }: { site: Site, onClick: () => void }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`查看 ${site.name} 详情`}
      className="group relative bg-white rounded-xl p-5 cursor-pointer
                 border border-[#EDE8E1] shadow-card hover:shadow-card-hover hover:border-red-100
                 transition-all duration-200 ease-out hover:-translate-y-1.5 overflow-hidden
                 focus-visible:ring-2 focus-visible:ring-party-red focus-visible:ring-offset-2"
    >
      {/* Left edge accent */}
      <div className="absolute left-0 top-4 w-0.5 h-12 rounded-r-full opacity-0
                      group-hover:opacity-100 bg-gradient-to-b from-party-red to-party-red/20
                      transition-all duration-300" aria-hidden="true" />

      <div className="flex items-center mb-3">
        {/* Icon Container */}
        <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-500 group-hover:bg-red-50 group-hover:text-party-red
                        flex items-center justify-center transition-colors duration-200 flex-shrink-0 border border-gray-100 group-hover:border-red-100" aria-hidden="true">
          {React.createElement(getCategoryIconComponent(site.category), { size: 19 })}
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
            className="p-1.5 text-gray-300 group-hover:text-party-red hover:bg-red-50 rounded-lg transition-colors block"
            title="直接访问"
          >
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Description */}
      <div className="">
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed h-11">
          {site.desc || '暂无详细描述'}
        </p>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-party-red/0 to-transparent group-hover:via-party-red/30 transition-all duration-500" aria-hidden="true" />

      {/* Tag badge - show on hover */}
      {site.tags && site.tags.length > 0 && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-[10px] px-1.5 py-0.5 bg-red-50 text-party-red/70 rounded-full font-medium border border-red-100/50">
            {site.tags[0]}
          </span>
        </div>
      )}
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
      {/* Engine Tabs - Segmented Control Style */}
      <div className="absolute -top-11 left-0 flex bg-white/70 backdrop-blur-sm border border-[#EDE8E1] rounded-lg p-1 gap-0.5">
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
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/80"
            )}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="relative flex items-center bg-white rounded-2xl shadow-card hover:shadow-float transition-shadow duration-300 border border-[#EDE8E1] focus-within:border-party-red/25 focus-within:ring-4 focus-within:ring-party-red/[0.07] focus-within:shadow-[0_0_0_1px_rgba(200,25,12,0.15),0_8px_32px_-4px_rgba(200,25,12,0.08)]">
        <div className="pl-5 text-gray-400 group-focus-within:text-party-red transition-colors">
          <Search size={20} />
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
              <X size={15} />
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
        <div className="absolute inset-0 bg-gray-900/25 backdrop-blur-sm transition-opacity" onClick={onClose} />
        <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-float overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">

          {/* Header Gradient Bar */}
          <div className="h-1 w-full bg-gradient-to-r from-party-red via-party-red to-party-red/60" />
          <div className="absolute top-4 right-4 z-10">
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 bg-white/70 hover:bg-gray-100 rounded-full transition-colors backdrop-blur">
              <X size={18} />
            </button>
          </div>

          <div className="p-8 md:p-10 overflow-y-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-18 h-18 bg-gradient-to-br from-red-50 to-red-50/60 text-party-red rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-red-100/60"
                   style={{width: '72px', height: '72px'}}>
                {React.createElement(getCategoryIconComponent(site.category), { size: 36 })}
              </div>

              <h2 className="text-3xl font-bold font-serif text-gray-900 mb-2">{site.name}</h2>
              <div className="flex items-center gap-2 mb-8 flex-wrap justify-center">
                <span className="px-2.5 py-0.5 rounded-full bg-[#F8F5F0] text-gray-500 text-xs font-medium border border-[#EDE8E1]">
                  {site.category}
                </span>
                {site.tags && site.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="px-2.5 py-0.5 rounded-full bg-red-50/60 text-party-red/70 text-xs font-medium border border-red-100/50">
                    {tag}
                  </span>
                ))}
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
                className="group flex items-center justify-center gap-2 px-10 py-3.5 bg-party-red text-white text-base font-medium rounded-xl hover:bg-party-red-hover transition-all duration-200 shadow-lg shadow-party-red/15 hover:-translate-y-0.5 w-full sm:w-auto"
              >
                <span>访问官方网站</span>
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>


          </div>
        </div>
      </div>
    </ModalPortal>
  );
};


// 5. Category Section - Show max 2 rows, expandable
const CategorySection = ({
  id,
  category,
  sites,
  onSelectSite
}: {
  id: string;
  category: string;
  sites: Site[];
  onSelectSite: (site: Site) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const updateVisibleCount = () => {
      const styles = window.getComputedStyle(grid);
      const columns = styles.gridTemplateColumns.split(' ').filter(Boolean).length || 1;
      setVisibleCount(columns * 2);
    };

    updateVisibleCount();

    const resizeObserver = new ResizeObserver(updateVisibleCount);
    resizeObserver.observe(grid);

    return () => resizeObserver.disconnect();
  }, []);

  const shouldShowMore = sites.length > visibleCount;
  const displayedSites = expanded ? sites : sites.slice(0, visibleCount);

  return (
    <div id={id} className="scroll-mt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-7 bg-gradient-to-b from-party-red to-party-red/30 rounded-full" />
        <h2 className="text-xl font-bold text-gray-900 font-serif tracking-tight">{category}</h2>
        <span className="text-xs text-gray-400 bg-[#F0EBE4] px-2 py-0.5 rounded-full font-medium">{sites.length}</span>
        <div className="h-px flex-1 bg-gradient-to-r from-[#EDE8E1] to-transparent" />
        {!expanded && shouldShowMore && (
          <button
            onClick={() => setExpanded(true)}
            className="flex-none inline-flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-party-red transition-colors"
          >
            查看更多
            <ChevronRight size={14} />
          </button>
        )}
      </div>
      <div
        ref={gridRef}
        className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]"
      >
        {displayedSites.map(site => (
          <SiteCard key={site.id} site={site} onClick={() => onSelectSite(site)} />
        ))}
      </div>
    </div>
  );
};

// 6. About Modal - Elegant Typography
const AboutModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-float w-full max-w-lg p-8 animate-fade-in-up border border-[#EDE8E1]">

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-party-red text-white rounded-xl flex items-center justify-center font-serif font-bold text-xl shadow-lg shadow-party-red/20">
                求
              </div>
              <h2 className="text-2xl font-bold font-serif text-gray-900">求知汇</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={22} />
            </button>
          </div>

          <div className="space-y-5 text-gray-600">
            <p className="text-lg leading-relaxed font-serif text-gray-800">
              专注于思想理论领域的垂直导航平台。
            </p>
            <p className="leading-relaxed text-sm">
              在一个信息碎片化的时代，我们将<strong className="text-party-red font-medium">权威</strong>、<strong className="text-party-red font-medium">经典</strong>与<strong className="text-party-red font-medium">深度</strong>重新聚合。为高校师生、研究员及理论爱好者提供一方纯净的学术检索天地。
            </p>

            <div className="grid grid-cols-3 gap-3 py-2">
              {[
                { l: '权威', d: '严选官方信源' },
                { l: '极致', d: '零广告干扰' },
                { l: '高效', d: '一键直达' }
              ].map(i => (
                <div key={i.l} className="text-center p-3 bg-[#F8F5F0] rounded-xl border border-[#EDE8E1]">
                  <div className="text-party-red font-bold mb-1 font-serif text-base">{i.l}</div>
                  <div className="text-xs text-gray-400">{i.d}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 pt-5 border-t border-[#EDE8E1] flex justify-between items-center text-xs text-gray-400">
            <span>Version 1.0.0 (Beta)</span>
            <span className="font-serif italic">Seeking Truth from Facts</span>
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
  const totalCount = sitesData.length;

  // Category site counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const s of sitesData as Site[]) {
      counts[s.category] = (counts[s.category] || 0) + 1;
    }
    return counts;
  }, []);

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
    <div className="h-screen w-full flex flex-col text-gray-900 font-sans selection:bg-red-50 selection:text-party-red overflow-hidden">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-link">
        跳到主内容
      </a>

      {/* 1. Global Header - Glassmorphism */}
      <header className="flex-none h-16 px-6 lg:px-10 flex items-center justify-between border-b border-[#E8E3DC]/80 bg-white/85 backdrop-blur-md z-30" role="banner">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setSearchQuery(''); document.getElementById('main-scroll')?.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className="w-8 h-8 rounded-xl bg-party-red text-white flex items-center justify-center shadow-lg shadow-party-red/25 group-hover:scale-105 transition-transform duration-200">
            <BookOpen size={17} />
          </div>
          <span className="font-serif font-bold text-xl tracking-tight text-gray-900 group-hover:text-party-red transition-colors">
            求知汇 <span className="text-xs font-sans font-normal text-gray-400 ml-1 tracking-normal">Qiuzhi Hui</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F5F0] rounded-full border border-[#EDE8E1] text-xs text-gray-500">
            <span className="font-medium text-gray-700">{totalCount}</span>
            <span>个资源</span>
          </div>
          <button
            onClick={() => setShowAbout(true)}
            className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-[#F0EBE4] transition-colors"
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
        <aside className="w-64 flex-none border-r border-[#E8E3DC] bg-white/60 backdrop-blur-sm hidden lg:flex flex-col h-full z-20">
          <div className="px-5 pt-5 pb-3">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest pl-2 mb-1">资源目录</h3>
            <p className="text-[11px] text-gray-400 pl-2">{categories.length} 个分类 · {totalCount} 个资源</p>
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
          <div className="p-4 border-t border-[#EDE8E1] text-center">
            <span className="text-xs text-gray-300 font-serif italic">Seeking Truth from Facts</span>
          </div>
        </aside>

        {/* Content Area */}
        <main id="main-scroll" className="flex-1 overflow-y-auto scroll-smooth" role="main" style={{background: 'var(--background)'}}>
          <div id="main-content" className="w-full px-4 sm:px-6 lg:px-8 py-10 min-h-full" tabIndex={-1}>

            {/* Search Hero */}
            <div className="mb-16 mt-4 md:mt-6">
              <div className="relative text-center mb-16">
                {/* Decorative background text */}
                <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-[160px] md:text-[200px] font-serif font-bold text-party-red/[0.025] select-none pointer-events-none leading-none overflow-hidden">
                  求知
                </div>
                <h1 className="relative text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-5 tracking-tight">
                  探索思想理论的<span className="text-party-red inline-block relative">
                    海洋
                    <svg className="absolute w-full h-2 bottom-0 left-0 text-party-red/20 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                  </span>
                </h1>
                <p className="relative text-gray-500 max-w-lg mx-auto text-base md:text-lg leading-relaxed mb-5">
                  汇集权威机构、核心期刊、经典著作与前沿数据库
                </p>
                <div className="relative flex items-center justify-center gap-5 text-sm text-gray-400 mb-2">
                  <span><strong className="text-gray-700 font-semibold">{totalCount}</strong> 个精选资源</span>
                  <span className="text-gray-200">·</span>
                  <span><strong className="text-gray-700 font-semibold">{categories.length}</strong> 个专业分类</span>
                </div>
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
                    <CategorySection
                      key={cat}
                      id={`cat-${cat}`}
                      category={cat}
                      sites={catSites}
                      onSelectSite={(site) => setSelectedSite(site)}
                    />
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
