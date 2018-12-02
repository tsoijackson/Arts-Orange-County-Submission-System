from flask_restful import Resource, reqparse
from database.schools import SchoolsDatabase


class Schools(Resource):
    def get(self):
        return SchoolsDatabase().get_schools_list()

class SchoolsByDistrict(Resource):
    def get(self, district_id: int):
        return SchoolsDatabase().get_schools(district_id)