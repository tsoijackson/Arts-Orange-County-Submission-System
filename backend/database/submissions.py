from db import Database
from datetime import datetime

class SubmissionModel():
    def __init__(self, data):
        self.submission_id = data['submission_id']
        self.user_id = data['user_id']
        self.artist_first_name = data['artist_first_name']
        self.artist_last_name = data['artist_last_name']
        self.grade = data['grade']
        self.school_name = data['school_name']
        self.school_type = data['school_type']
        self.school_address = data['school_address']
        self.district_name = data['district_name']
        self.artwork_title = data['artwork_title']
        self.artwork_category = data['artwork_category']
        self.artwork_medium = data['artwork_medium']
        self.artwork_votes = data['artwork_votes']
        self.parent_first_name = data['parent_first_name']
        self.parent_last_name = data['parent_last_name']
        self.parent_email = data['parent_email']
        self.last_updated = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

class SubmissionsDatabase(Database):
    def __init__(self):
        super().__init__()

    def get_submissions_list(self):
        command = """
        SELECT
            submission_id,
            users.user_id,
            user_first_name,
            user_last_name,
            user_title,
            user_email,
            artist_first_name,
            artist_last_name,
            grade,
            school_name,
            school_type,
            school_address,
            district_name,
            artwork_title,
            artwork_category,
            artwork_medium,
            artwork_votes,
            parent_first_name,
            parent_last_name,
            parent_email,
            CAST(last_updated AS CHAR) AS last_updated
        FROM submissions
        LEFT JOIN users on submissions.user_id = users.user_id
        """
        self.cur.execute(command)
        result = self.cur.fetchall()
        return result

    def get_submissions(self, user_email: str):
        command = """
        SELECT
            submission_id,
            users.user_id,
            user_first_name,
            user_last_name,
            user_title,
            user_email,
            artist_first_name,
            artist_last_name,
            grade,
            school_name,
            school_type,
            school_address,
            district_name,
            artwork_title,
            artwork_category,
            artwork_medium,
            artwork_votes,
            parent_first_name,
            parent_last_name,
            parent_email,
            CAST(last_updated AS CHAR) AS last_updated
        FROM submissions
        LEFT JOIN users on submissions.user_id = users.user_id
        WHERE user_email = '{}'
        """.format(user_email)
        self.cur.execute(command)
        result = self.cur.fetchall()
        return result

    def post_submission(self, data):
        submission = SubmissionModel(data)
        command = """
        INSERT INTO submissions
            (user_id,
            artist_first_name,
            artist_last_name,
            grade,
            school_name,
            school_type,
            school_address,
            district_name,
            artwork_title,
            artwork_category,
            artwork_medium,
            artwork_votes,
            parent_first_name,
            parent_last_name,
            parent_email,
            last_updated)
        VALUES 
            (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """
        values = (
            submission.user_id, 
            submission.artist_first_name,
            submission.artist_last_name,
            submission.grade,
            submission.school_name,
            submission.school_type,
            submission.school_address,
            submission.district_name,
            submission.artwork_title,
            submission.artwork_category,
            submission.artwork_medium,
            submission.artwork_votes,
            submission.parent_first_name,
            submission.parent_last_name,
            submission.parent_email,
            submission.last_updated
        )

        self.cur.execute(command, values)
        self.conn.commit()
        data['submission_id'] = self.cur.lastrowid
        data['last_updated'] = submission.last_updated
        return data

    def put_submission(self, data):
        submission = SubmissionModel(data)
        command = """
        UPDATE submissions
        SET
            artist_first_name = %s,
            artist_last_name = %s,
            grade = %s,
            school_name = %s,
            school_type = %s,
            school_address = %s,
            district_name = %s,
            artwork_title = %s,
            artwork_category = %s,
            artwork_medium = %s,
            artwork_votes = %s,
            parent_first_name = %s,
            parent_last_name = %s,
            parent_email = %s,
            last_updated = %s
        WHERE
            submission_id = {}
        """.format(submission.submission_id)
        values = (
            submission.artist_first_name,
            submission.artist_last_name,
            submission.grade,
            submission.school_name,
            submission.school_type,
            submission.school_address,
            submission.district_name,
            submission.artwork_title,
            submission.artwork_category,
            submission.artwork_medium,
            submission.artwork_votes,
            submission.parent_first_name,
            submission.parent_last_name,
            submission.parent_email,
            submission.last_updated
        )
        
        self.cur.execute(command, values)
        self.conn.commit()
        data['last_updated'] = submission.last_updated
        return data

    def delete_submission(self, submission_id: int):
        command = """
        SELECT
            submission_id,
            users.user_id,
            user_first_name,
            user_last_name,
            user_title,
            user_email,
            artist_first_name,
            artist_last_name,
            grade,
            school_name,
            school_type,
            school_address,
            district_name,
            artwork_title,
            artwork_category,
            artwork_medium,
            artwork_votes,
            parent_first_name,
            parent_last_name,
            parent_email,
            CAST(last_updated AS CHAR) AS last_updated
        FROM submissions
        LEFT JOIN users on submissions.user_id = users.user_id
        WHERE submission_id = '{}'
        """.format(submission_id)
        self.cur.execute(command)
        result = self.cur.fetchall()

        command = """
        DELETE FROM submissions
        WHERE submission_id = '{}'
        """.format(submission_id)
        self.cur.execute(command)
        self.conn.commit()

        return result