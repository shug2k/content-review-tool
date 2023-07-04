# Content Review Tool

This is an open-source content review tool. It can enable you to review content by setting up queues and review objects, and providing a UI to review those objects. It also features the ability to set up custom decision trees for your queues. You can read the full product spec [here](https://docs.google.com/document/d/1GcjrolAkemedJYWHDe9G63NyJ0MOy9ej5mvuh7tyrww/edit).

# Tech Stack

The app is organized into a frontend (cr-frontend) and backend (cr-backend) app. The frontend is written in Typescript using React, on the NextJS 13 framework. The backend is written in Python, on the Django framework. The app sets up postgres for its DB. By default, it assumes a user `admin` can access the database `cr` and create databases (see [setup.sql](https://github.com/shug2k/content-review-tool/blob/main/cr-backend/setup.sql) for the commands to run to set up the database).

## Running Locally

To run locally for development:

1. Install postgresql, Python 3.10 or greater, and NodeJS
2. Ensure postgres is running
3. Run the commands in [setup.sql](https://github.com/shug2k/content-review-tool/blob/main/cr-backend/setup.sql) for postgres
4. Run `npm i` in `cr-frontend`
5. Run `pip install -r requirements.txt` in `cr-backend`
6. Run `npm run dev` in `cr-frontend` in one window
7. In another window, run `python manage.py migrate` to run migrations (if this fails, you probably set up your postgres incorrectly)
8. Run `python manage.py runserver` in `cr-backend`
