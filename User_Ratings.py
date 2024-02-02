from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from sqlalchemy import Column, Integer, String, Boolean

app = Flask(__name__)
app.config[
    "SQLALCHEMY_DATABASE_URI"
] = "sqlite:///ratings.db"  # Change the database URI accordingly
db = SQLAlchemy(app)


class UserRating(db.Model):
    __tablename__ = "user_ratings"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    user_profile_id = Column(Integer)
    movie_id = Column(Integer)
    model_type = Column(String)
    like = Column(Boolean)
    dislike = Column(Boolean)
    rate = Column(String)

    def __init__(
        self, movie_id, user_id, user_profile_id, model_type, like, dislike, rate
    ):
        self.movie_id = movie_id
        self.user_id = user_id
        self.user_profile_id = user_profile_id
        self.model_type = model_type
        self.like = like
        self.dislike = dislike
        self.rate = rate

    @staticmethod
    def disliked(movie_id, user_profile_id, user_id, model_type):
        rating = UserRating(
            movie_id=movie_id,
            user_id=user_id,
            user_profile_id=user_profile_id,
            like=False,
            dislike=True,
            rate="dislike",
        )
        db.session.add(rating)
        db.session.commit()
        return rating

    @staticmethod
    def unrate(movie_id, user_profile_id, model_type):
        user_rated_movie = UserRating.query.filter_by(
            movie_id=movie_id, model_type=model_type, user_profile_id=user_profile_id
        ).first()

        if user_rated_movie:
            db.session.delete(user_rated_movie)
            db.session.commit()

        return user_rated_movie.rate if user_rated_movie else None


if __name__ == "__main__":
    app.run(debug=True)
