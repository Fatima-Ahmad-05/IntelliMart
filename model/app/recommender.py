# model/app/recommender.py
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import Optional

class ContentRecommender:
    """
    Content-based recommender using TF-IDF cosine similarity.
    Finds products similar to a given product based on title+description.
    """

    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            stop_words='english',
            ngram_range=(1, 2),   # unigrams + bigrams
            min_df=1,
        )
        self.tfidf_matrix = None
        self.product_ids: list[str] = []
        self.product_texts: list[str] = []
        self.fitted = False

    def fit(self, products: list[dict]) -> None:
        """
        Build TF-IDF matrix from product list.
        Each product dict must have: _id (str), title (str), description (str).
        """
        self.product_ids = [str(p['_id']) for p in products]
        self.product_texts = [
            (p.get('title', '') + ' ' + p.get('description', '')).strip()
            for p in products
        ]
        self.tfidf_matrix = self.vectorizer.fit_transform(self.product_texts)
        self.fitted = True

    def recommend_similar(self, product_id: str, top_k: int = 8) -> list[dict]:
        """
        Return top_k product IDs most similar to product_id.
        Returns list of {product_id, score} dicts.
        """
        if not self.fitted or product_id not in self.product_ids:
            return []

        idx = self.product_ids.index(product_id)
        product_vec = self.tfidf_matrix[idx]

        # Cosine similarity between this product and all others
        sims = cosine_similarity(product_vec, self.tfidf_matrix).flatten()
        sims[idx] = 0  # exclude self

        top_indices = np.argsort(sims)[::-1][:top_k]
        return [
            {'product_id': self.product_ids[i], 'score': float(sims[i])}
            for i in top_indices if sims[i] > 0.01
        ]

    def recommend_by_category(self, categories: list[str],
                               exclude_ids: list[str],
                               products: list[dict],
                               top_k: int = 8) -> list[str]:
        """
        Filter products by preferred categories, exclude purchased IDs.
        Returns list of product IDs sorted by confidence.
        """
        filtered = [
            p for p in products
            if p.get('category') in categories
            and str(p['_id']) not in exclude_ids
        ]
        filtered.sort(key=lambda p: p.get('confidence', 0), reverse=True)
        return [str(p['_id']) for p in filtered[:top_k]]

