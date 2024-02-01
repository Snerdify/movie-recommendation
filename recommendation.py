# recommendation.py
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix

class MovieRecommendation:
    def __init__(self, user_movie_ratings):
        self.user_movie_ratings = user_movie_ratings
        self.movie_similarity_matrix = self._build_similarity_matrix()

    def _build_similarity_matrix(self):
        pivot_table = self.user_movie_ratings.pivot_table(
            index='userId', columns='movieId', values='rating', fill_value=0
        )
        sparse_matrix = csr_matrix(pivot_table.values)
        similarity_matrix = cosine_similarity(sparse_matrix, dense_output=False)
        return similarity_matrix

    def recommend_movies(self, user_id, num_recommendations=5):
        user_ratings = self.user_movie_ratings[self.user_movie_ratings['userId'] == user_id]
        user_ratings = user_ratings.pivot_table(
            index='userId', columns='movieId', values='rating', fill_value=0
        )

        user_similarity = self.movie_similarity_matrix.getrow(user_id - 1)
        weighted_sum = user_similarity.dot(sparse.csr_matrix(user_ratings.values).T)
        normalized_ratings = weighted_sum / (user_similarity.sum() + 1e-10)

        movie_ratings = pd.Series(normalized_ratings.toarray().flatten(), index=user_ratings.columns)
        recommended_movies = movie_ratings.sort_values(ascending=False).head(num_recommendations).index.tolist()

        return recommended_movies



