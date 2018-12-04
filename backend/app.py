from flask import Flask, jsonify
from flask_restful import Api
from flask_cors import CORS, cross_origin
import pymysql

from resources.users import Users, UsersByEmail
from resources.school_districts import SchoolDistrictsList
from resources.schools import Schools, SchoolsByDistrict
from resources.submissions import Submissions, SubmissionsByUser, SubmissionsById


application = Flask(__name__)
api = Api(application)
api.prefix = '/api'
CORS(application, 
    origins="*", 
    allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],
    supports_credentials=True, intercept_exceptions=False)
    

api.add_resource(Users, '/users')
api.add_resource(UsersByEmail, '/users/<string:email>')

api.add_resource(SchoolDistrictsList, '/school-districts')

api.add_resource(Schools, '/schools')
api.add_resource(SchoolsByDistrict, '/schools/<int:district_id>')

api.add_resource(Submissions, '/submissions')
api.add_resource(SubmissionsByUser, '/submissions/<string:user_email>')
api.add_resource(SubmissionsById,   '/submissions/<int:submission_id>')

@application.route("/api")

def main():
    return "Arts OC Backend Restful Web Api Up and Running!"

if __name__ == "__main__":
    # Visit to Test http://localhost:5000/api
    application.run(debug=True)
