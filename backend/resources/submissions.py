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

        return result

    def put(self):
        result = { "submissions": [] }
        data = submission_parser.parse_args()

        submissionsDatabase = SubmissionsDatabase()
        for submission in data['submissions']:
            submission = literal_eval(submission)
            result['submissions'].append( submissionsDatabase.put_submission(submission) )

        return result


class SubmissionsByUser(Resource):
    def get(self, user_email=None):
        return SubmissionsDatabase().get_submissions(user_email)


class SubmissionsById(Resource):
    def delete(self, submission_id=None):
        return SubmissionsDatabase().delete_submission(int(submission_id))