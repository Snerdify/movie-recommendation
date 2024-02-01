from django.db import models

class Genre(models.Model):
    # Define Genre model fields here
    pass

class Author(models.Model):
    # Define Author model fields here
    pass

class Director(models.Model):
    # Define Director model fields here
    pass

class Movie(models.Model):
    title = models.CharField(max_length=255)
    plot = models.TextField()
    year_of_release = models.IntegerField()
    date_of_release = models.DateField()
    duration_in_minutes = models.IntegerField()
    age_restriction = models.CharField(max_length=10)
    country = models.CharField(max_length=255)
    language = models.CharField(max_length=255)
    casts = models.ManyToManyField('Cast', related_name='movies')
    genres = models.ManyToManyField(Genre, related_name='movies')
    directors = models.ManyToManyField(Director, related_name='movies')
    authors = models.ManyToManyField(Author, related_name='movies')
    poster_path = models.CharField(max_length=255)
    wallpaper_path = models.CharField(max_length=255)
    video_path = models.CharField(max_length=255)
    video_preview_path = models.CharField(max_length=255)
    title_logo_path = models.CharField(max_length=255)
    video_size_in_mb = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        is_new = not self.pk
        super(Movie, self).save(*args, **kwargs)
        if is_new:
            # Movie created logic
            MovieNotification.objects.create(movie_id=self.id, type='New Arrival')

    def similar_movies(self):
        return SimilarMovie.objects.filter(model_id=self.id, model_type='App.Models.Movie')

    def user_ratings(self):
        return UserRating.objects.filter(movie=self)

    def trailer(self):
        return ComingSoonMovie.objects.get(title=self.title)

class MovieNotification(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    type = models.CharField(max_length=255)

class Rating(models.Model):
    movie = models.OneToOneField(Movie, on_delete=models.CASCADE, related_name='rating')
    # Define Rating model fields here
    pass

class MovieReport(models.Model):
    movie = models.OneToOneField(Movie, on_delete=models.CASCADE, related_name='report')
    # Define MovieReport model fields here
    pass

class SimilarMovie(models.Model):
    model_id = models.IntegerField()
    model_type = models.CharField(max_length=255)
    # Define SimilarMovie model fields here
    pass

class UserRating(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='user_ratings')
    # Define UserRating model fields here
    pass

class ComingSoonMovie(models.Model):
    title = models.CharField(max_length=255)
    # Define ComingSoonMovie model fields here
    pass
