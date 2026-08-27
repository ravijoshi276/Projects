#!/usr/bin/env bash
# Exit immediately if a command exits with a non-zero status
set -e

# Install python dependencies using the requirements.txt generated from pipenv
pip install -r requirements.txt

# Compile static assets and run database migrations
python manage.py collectstatic --no-input
python manage.py migrate
