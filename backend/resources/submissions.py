from flask_restful import Resource, reqparse
from flask import jsonify
from ast import literal_eval
from database.submissions import SubmissionsDatabase
from datetime import datetime


submission_parser = reqparse.RequestParser()
submission_parser.add_argument('submissions', action='append')


class Submissions(Resource):
    def get(self):
        return SubmissionsDatabase().get_submissions_list()

    def post(self):
        result = { "submissions": [] }
        data = submission_parser.parse_args()

        submissionsDatabase = SubmissionsDatabase()
        for submission in data["submissions"]:
            submission = literal_eval(submission)
            result["submissions"].append( submissionsDatabase.post_submission(submission) )
        submissionsDatabase.close_database_and_server()

        return result

    def put(self):
        result = { "submissions": [] }
        data = submission_parser.parse_args()

        submissionsDatabase = SubmissionsDatabase()
        for submission in data['submissions']:
            submission = literal_eval(submission)
            result['submissions'].append( submissionsDatabase.put_submission(submission) )
        submissionsDatabase.close_database_and_server()

        return result


class SubmissionsByUser(Resource):
    def get(self, user_email=None):
        return SubmissionsDatabase().get_submissions(user_email)


class SubmissionsById(Resource):
    def delete(self, submission_id=None):
        return SubmissionsDatabase().delete_submission(int(submission_id))



# submission_parser.add_argument('submission_id', type = int)
# submission_parser.add_argument('user_id', type = int, required = True)
# submission_parser.add_argument('artist_first_name', type = str, required = True)
# submission_parser.add_argument('artist_last_name', type = str, required = True)
# submission_parser.add_argument('grade', type = str, required = True)
# submission_parser.add_argument('school_name', type = str, required = True)
# submission_parser.add_argument('school_type', type = str, required = True)
# submission_parser.add_argument('school_address', type = str)
# submission_parser.add_argument('district_name', type = str)
# submission_parser.add_argument('artwork_title', type = str, required = True)
# submission_parser.add_argument('artwork_category', type = str)
# submission_parser.add_argument('artwork_medium', type = str)
# submission_parser.add_argument('artwork_votes', type = int)
# submission_parser.add_argument('parent_first_name', type = str)
# submission_parser.add_argument('parent_last_name', type = str)
# submission_parser.add_argument('parent_email', type = str)