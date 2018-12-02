from flask_restful import Resource, reqparse
from flask_restful import fields, marshal_with, marshal
from database.users import UsersDatabase


user_parser = reqparse.RequestParser()
user_parser.add_argument('user_id', type = int)
user_parser.add_argument('user_first_name', type = str, required = True)
user_parser.add_argument('user_last_name', type = str, required = True)
user_parser.add_argument('user_title', type = str, required = True)
user_parser.add_argument('user_email', type = str, required = True)

class Users(Resource):
    def get(self):
        return UsersDatabase().get_user_list()

    def post(self):
        data = user_parser.parse_args()
        return UsersDatabase().post_user(data)

class UsersByEmail(Resource):
    def get(self, email=None):
        return UsersDatabase().get_user(email)
