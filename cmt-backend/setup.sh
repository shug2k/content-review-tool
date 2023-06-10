service postgresql start 
sudo -u postgres psql -f setup.sql

python manage.py migrate

gunicorn -b 0.0.0.0:4000 cmt.wsgi