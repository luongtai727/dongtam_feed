import { createContext, useContext, useState, useEffect } from 'react';
import { translations as localTranslations } from './translations';

const LanguageContext = createContext(null);
const API = import.meta.env.VITE_API_URL || '';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(localStorage.getItem('dt_lang') || 'vi');
  const [translations, setTranslations] = useState(localTranslations);

  useEffect(() => {
    localStorage.setItem('dt_lang', language);
  }, [language]);

  useEffect(() => {
    fetch(`${API}/api/translations?_t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        if (d && typeof d === 'object' && Object.keys(d).length > 0) {
          setTranslations(d);
        }
      })
      .catch(() => {});
  }, []);

  // Translate static layout strings
  const t = (keyPath) => {
    const keys = keyPath.split('.');
    let obj = translations;
    for (const key of keys) {
      if (obj && obj[key] !== undefined) {
        obj = obj[key];
      } else {
        return keyPath;
      }
    }
    if (obj && typeof obj === 'object') {
      return obj[language] || obj['vi'] || keyPath;
    }
    return typeof obj === 'string' ? obj : keyPath;
  };

  // Translate dynamic B2B products
  const tProduct = (product, fieldName) => {
    if (!product) return '';
    const slug = product.slug;
    const prodTranslation = translations.productsData[slug];
    if (prodTranslation && prodTranslation[fieldName]) {
      const transValue = prodTranslation[fieldName];
      
      // If it is a sensorySpecs or qualitySpecs array
      if (fieldName === 'sensorySpecs' || fieldName === 'qualitySpecs') {
        return transValue.map(item => {
          const newItem = { ...item };
          if (item.indicator && typeof item.indicator === 'object') {
            newItem.indicator = item.indicator[language] || item.indicator['vi'];
          }
          if (item.requirement && typeof item.requirement === 'object') {
            newItem.requirement = item.requirement[language] || item.requirement['vi'];
          }
          if (item.value && typeof item.value === 'object') {
            newItem.value = item.value[language] || item.value['vi'];
          }
          return newItem;
        });
      }
      
      // If it is an array of objects/strings (like highlights, uses or targets)
      if (Array.isArray(transValue)) {
        return transValue.map(item => {
          if (typeof item === 'object' && item[language] !== undefined) {
            return item[language] || item['vi'];
          }
          return item;
        });
      }
      
      // Regular translation dictionary lookup
      if (typeof transValue === 'object' && transValue[language] !== undefined) {
        return transValue[language] || transValue['vi'];
      }
    }
    
    // Fallback to original database field
    return product[fieldName];
  };

  // Translate dynamic News / Articles
  const tNews = (article, fieldName) => {
    if (!article) return '';
    
    if (fieldName === 'title') {
      if (language === 'en') {
        if (article.title.includes('Bột nội tạng mực')) return 'Deep Sea Squid Viscera Production Line Activated';
        if (article.title.includes('Khai trương')) return 'Grand Opening of Dong Tam Factory in Suoi Dau';
        return `[EN] ${article.title}`;
      }
      if (language === 'zh') {
        if (article.title.includes('Bột nội tạng mực')) return '深海鱿鱼内脏粉生产线正式投产';
        if (article.title.includes('Khai trương')) return '同心绥油厂区落成启用仪式';
        return `[ZH] ${article.title}`;
      }
    }
    if (fieldName === 'summary') {
      if (language === 'en') return `[EN] ${article.summary}`;
      if (language === 'zh') return `[ZH] ${article.summary}`;
    }
    return article[fieldName];
  };

  const tCategory = (catInput) => {
    if (!catInput) return '';
    const str = typeof catInput === 'object' ? (catInput.name || '') : String(catInput);
    if (language === 'vi') return str;
    if (str.includes('Mực')) {
      return language === 'en' ? 'Deep Sea Amino Acid - Squid By-products' : '深海氨基酸 - 鱿鱼副产品';
    }
    if (str.includes('Tôm')) {
      return language === 'en' ? 'Nutrition From Shrimp Farming & Processing' : '源于虾类养殖与加工的优质营养';
    }
    if (str.includes('Mắm')) {
      return language === 'en' ? 'By-products From Fish Sauce Processing' : '源于传统鱼露酿造的优质副产物';
    }
    return str;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tProduct, tNews, tCategory, translations, setTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
