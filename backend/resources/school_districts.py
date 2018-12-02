from flask_restful import Resource, reqparse
from database.school_districts import SchoolDistrictsDatabase


class SchoolDistrictsList(Resource):

    def get(self):
        return SchoolDistrictsDatabase().get_school_districts_list()

# class Users(Resource):

#     def get(self, email=None):
#         return UsersDatabase().get_user(email)