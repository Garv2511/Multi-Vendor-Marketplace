import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SearchIcon, BagIcon, CheckIcon } from '../components/ui/Icons';
import type { Product } from '../types/marketplace';

export const CatalogView: React.FC<{ onNavigateToCart: () => void }> = ({ onNavigateToCart }) => {
  const { products, addToCart } = useMarketplace();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<string>('All');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const categories = ['All', 'Living & Objects', 'Ceramics & Clay', 'Architectural Lighting', 'Monographs'];

  const vendorsList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.vendorName));
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchCategory = selectedCategory === 'All' || prod.category === selectedCategory;
      const matchVendor = selectedVendor === 'All' || prod.vendorName === selectedVendor;
      const matchSearch =
        !searchQuery.trim() ||
        prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchVendor && matchSearch && prod.status !== 'draft';
    });
  }, [products, selectedCategory, selectedVendor, searchQuery]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 1800);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Editorial Header */}
      <div className="mb-12 space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] uppercase text-[#9c784e]">
          <span className="w-2 h-2 bg-[#9c784e]" aria-hidden="true" />
          <span>CURATED CROSS-VENDOR REPOSITORY • EST. 2025</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-tight text-neutral-900 leading-tight">
              Archival Catalogue
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-light max-w-xl mt-1">
              Discover bespoke objects, monolithic lighting, and kiln-fired ceramics curated from verified independent ateliers.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH CATALOGUE..."
              className="w-full bg-[#f4f4f2] border border-neutral-300 px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black tracking-wider uppercase rounded-none"
            />
            <SearchIcon className="absolute right-3 top-3 text-neutral-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-y border-neutral-200 py-3 mb-10 gap-4 text-xs">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors cursor-pointer ${
                selectedCategory === cat ? 'text-black underline underline-offset-8' : 'text-neutral-500 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Vendor Selector */}
        <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-semibold tracking-wider uppercase">
          <span>ATELIER:</span>
          <select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            className="bg-transparent border border-neutral-300 px-2 py-1 text-neutral-800 text-xs focus:outline-none focus:border-black rounded-none cursor-pointer"
          >
            {vendorsList.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-neutral-300 bg-[#fafaf8]">
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            No archival specimens matching criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredProducts.map((product) => {
            const isAdded = recentlyAddedId === product.id;

            return (
              <article
                key={product.id}
                className="group flex flex-col justify-between bg-white border border-neutral-200/90 transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              >
                {/* Image Container with Editorial Aspect Ratio */}
                <div className="relative aspect-[4/3] bg-[#ece9e2] overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="bg-white/95 backdrop-blur-sm border border-neutral-200 px-2.5 py-1 text-[9px] font-bold tracking-[0.18em] uppercase text-neutral-800">
                      {product.vendorName}
                    </span>

                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase">
                        ONLY {product.stock} LEFT
                      </span>
                    )}

                    {product.stock === 0 && (
                      <span className="bg-neutral-800 text-white px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase">
                        EXHAUSTED
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-semibold tracking-[0.16em] uppercase text-[#9c784e]">
                      <span>{product.category}</span>
                      <span>INVENTORY: {product.stock}</span>
                    </div>

                    <h2 className="text-base font-normal tracking-tight text-neutral-900 group-hover:text-black">
                      {product.title}
                    </h2>

                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed font-light">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-sm font-semibold tracking-wide text-neutral-900">
                      ${product.price.toLocaleString()}
                    </span>

                    <button
                      type="button"
                      disabled={product.stock === 0}
                      onClick={() => handleAddToCart(product)}
                      className={`px-4 py-2.5 text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors rounded-none cursor-pointer flex items-center gap-1.5 ${
                        isAdded
                          ? 'bg-emerald-700 text-white'
                          : product.stock === 0
                          ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                          : 'bg-black text-white hover:bg-neutral-800'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <CheckIcon />
                          <span>ACQUIRED</span>
                        </>
                      ) : (
                        <>
                          <BagIcon className="w-3.5 h-3.5" />
                          <span>ACQUIRE</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Floating View Cart Banner if items exist */}
      <div className="mt-16 p-6 bg-[#f4f2ee] border border-neutral-300/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-neutral-900">
            MULTI-VENDOR UNIFIED SHOPPING CART
          </p>
          <p className="text-xs text-neutral-600 font-light">
            Acquire pieces across different ateliers in a single transaction with automated split fulfillment.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToCart}
          className="bg-black text-white px-6 py-3 text-[10px] font-semibold tracking-[0.18em] uppercase hover:bg-neutral-800 transition-colors cursor-pointer rounded-none whitespace-nowrap"
        >
          VIEW CART & CHECKOUT →
        </button>
      </div>
    </div>
  );
};

export default CatalogView;

