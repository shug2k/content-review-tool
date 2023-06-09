FLASK_APP=main.py

service postgresql start 
sudo -u postgres psql -f setup.sql

flask db init
flask db migrate
flask db upgrade

#flask run

gunicorn -b 0.0.0.0:6200 'main:app'