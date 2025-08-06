import { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { products } from '../data/products';

import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import MobileFilterBar from '../components/MobileFilterBar';
import FilterModal from '../components/FilterModal';
import QuickViewModal from '../components/QuickViewModal';

export default function Home() {
  // Global state'ten (Context) arama terimini alıyoruz
  const { searchTerm } = useShop();
  
  // Sadece bu sayfaya özgü state'ler
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Arama fonksiyonu için filtrelenmiş ürün listesini oluşturan kısım
  // useMemo kullanarak gereksiz yeniden hesaplamaların önüne geçiyoruz.
  // Bu fonksiyon sadece 'searchTerm' veya 'products' değiştiğinde yeniden çalışır.
  const filteredProducts = useMemo(() => {
    // Arama çubuğu boşsa, tüm ürünleri döndür
    if (!searchTerm.trim()) {
      return products;
    }
    
    // Arama terimini küçük harfe çevirerek büyük/küçük harf duyarsız arama yap
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    // Ürün adı veya marka adı arama terimini içeriyorsa ürünü listeye dahil et
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercasedSearchTerm) ||
      product.brand.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [searchTerm]); // Bağımlılık dizisi: Sadece searchTerm değiştiğinde bu bloğu yeniden çalıştır

  // Sıralama ikonu
  const SortIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18" />
    </svg>
  );

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sol Filtreleme Menüsü (Sadece Desktop) */}
          <div className="hidden md:block md:w-1/4">
            <Sidebar />
          </div>

          {/* Sağ İçerik Alanı (Ürünler) */}
          <div className="w-full md:w-3/4">
            
            <MobileFilterBar 
              onFilterClick={() => setIsFilterMenuOpen(true)} 
              onSortClick={() => alert('Sıralama özelliği eklenecek!')}
            />

            {/* Üst Başlık ve Hızlı Filtreler */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <h1 className="text-xl font-semibold text-gray-800">
                {searchTerm ? `"${searchTerm}" araması için ` : '"Sepette Ürünler" için '} 
                {filteredProducts.length} sonuç listeleniyor
              </h1>
              
              <div className="hidden md:flex items-center justify-between mt-4 flex-wrap gap-2">
                <div className="flex space-x-2">
                  <button className="bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-md hover:bg-orange-200">⚡ Flaş Ürünler</button>
                  <button className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-md hover:bg-yellow-200">⭐ Yüksek Puanlı Ürünler</button>
                </div>
                <div className="relative">
                  <button className="border rounded-md px-4 py-2 text-sm flex items-center">
                    Önerilen Sıralama
                    <SortIcon />
                  </button>
                </div>
              </div>
            </div>

            {/* Ürün Kartları Grid'i */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    onQuickViewClick={setQuickViewProduct}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <h2 className="text-2xl font-semibold text-gray-600">Aradığınız kriterlere uygun ürün bulunamadı.</h2>
                  <p className="text-gray-500 mt-2">Farklı bir arama yapmayı deneyebilirsiniz.</p>
                </div>
              )}
            </div>
            
            {/* Sayfalama Butonu */}
            <div className="text-center mt-8">
                <button className="border border-gray-300 bg-white px-16 py-3 rounded-lg hover:border-orange-500 hover:text-orange-500 transition">
                    DAHA FAZLA ÜRÜN GÖSTER
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modallar (Sayfa içeriğinin dışında, en üst seviyede duruyorlar) */}
      <FilterModal isOpen={isFilterMenuOpen} onClose={() => setIsFilterMenuOpen(false)}>
        <Sidebar />
      </FilterModal>

      <QuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />
    </>
  );
}