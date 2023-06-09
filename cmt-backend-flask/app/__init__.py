from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from config import Config

db = SQLAlchemy()  # done here so that db is importable
migrate = Migrate()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)

    @app.route('/', methods=['GET'])
    def queues():
        return {
            "queues": [],
            "test": "Testing"
        }

    # so Flask-Migrate picks these up
    from .models import Queue, Review, DecisionTree

    return app