# File is used for Gunicorn to find

from app import application

if __name__ == "__main__":
    application.run()