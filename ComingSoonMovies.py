from flask_socketio import request
from flask_socketio import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)


class ComingSoonMovie:
    def __init__(self, title, release_date):
        self.title = title
        self.release_date = release_date


@app.route("/")
def index():
    return render_template("index.html")


class ComingSoonMovieCreatedEvent:
    def __init__(self, coming_soon_movie):
        self.coming_soon_movie = coming_soon_movie


@socketio.on("connect")
def handle_connect():
    print("Client connected")


@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")


@socketio.on("coming_soon_movie_created")
def handle_coming_soon_movie_created(data):
    coming_soon_movie = ComingSoonMovie(data["title"], data["release_date"])
    event = ComingSoonMovieCreatedEvent(coming_soon_movie)

    socketio.emit(
        "coming_soon_movie_created",
        {
            "type": "Coming Soon Movie Created",
            "data": {
                "title": event.coming_soon_movie.title,
                "release_date": event.coming_soon_movie.release_date,
            },
        },
        room=request.sid,
    )


if __name__ == "__main__":
    # Use Gunicorn to run the Flask app with SocketIO support
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)

