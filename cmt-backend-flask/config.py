class Config:
    TESTING = False
    SQLALCHEMY_DATABASE_URI = 'postgresql+psycopg2://admin:admin@localhost:5432/cmt'
    SQLALCHEMY_TRACK_MODIFICATIONS = False