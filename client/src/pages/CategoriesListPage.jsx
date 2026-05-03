import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './CategoriesListPage.css';

const CATEGORY_IMAGES = {
  Arts_Crafts_and_Sewing:       'https://images.unsplash.com/photo-1561861422-a549073e547a?w=400&q=80',
  Automotive:                   'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80',
  Baby:                         'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80',
  Beauty:                       'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=80',
  Books:                        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80',
  CDs_and_Vinyl:                'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
  Cell_Phones_and_Accessories:  'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400&q=80',
  Electronics:                  'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400&q=80',
  Grocery_and_Gourmet_Food:     'https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=400&q=80',
  Health_and_Personal_Care:     'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&q=80',
  Home_and_Kitchen:             'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
  Industrial_and_Scientific:    'https://images.unsplash.com/photo-1532094349884-543559872700?w=400&q=80',
  Movies_and_TV:                'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80',
  Office_Products:              'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
  Patio_Lawn_and_Garden:        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
  Pet_Supplies:                 'https://images.unsplash.com/photo-1548767797-d8c844163c4a?w=400&q=80',
  Sports_and_Outdoors:          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
  Tools_and_Home_Improvement:   'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80',
  Toys_and_Games:               'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&q=80',
};

const CategoriesListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then(res => { setCategories(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="categories-list-page">
      <div className="container">
        <h1 className="page-title">All Categories</h1>
        <p className="page-subtitle">{categories.length} categories with ML-classified products</p>
        <div className="row g-4">
          {categories.map(cat => (
            <div key={cat._id} className="col-6 col-md-4 col-lg-3">
              <Link to={`/category/${cat.name}`} className="cat-list-card">
                <div className="cat-list-img-wrap">
                  <img
                    src={CATEGORY_IMAGES[cat.name] || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80'}
                    alt={cat.name}
                    className="cat-list-img"
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80';
                    }}
                  />
                </div>
                <h3>{cat.name?.replace(/_/g, ' ')}</h3>
                <p className="cat-list-desc">{cat.description}</p>
                <span className="cat-list-count">{cat.productCount} products</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesListPage;