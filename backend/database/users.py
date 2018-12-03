from db import Database

class UserModel():
    def __init__(self, data):
        self.user_id = data['user_id']
        self.user_first_name = data['user_first_name']
        self.user_last_name = data['user_last_name']
        self.user_title = data['user_title']
        self.user_email = data['user_email']


class UsersDatabase(Database):
    def __init__(self):
        super().__init__()

    def get_user_list(self):
        self.cur.execute('SELECT user_id, user_first_name, user_last_name, user_title, user_email FROM users')
        result = self.cur.fetchall()
        return result

    def get_user(self, email: str):
        command = """
        SELECT user_id, user_first_name, user_last_name, user_title, user_email FROM users
        WHERE user_email='{}'
        """.format(email)
        self.cur.execute(command)
        result = self.cur.fetchall()
        return result

    def post_user(self, data):
        user = UserModel(data)
        command = """
        INSERT INTO users
        (user_first_name, user_last_name, user_title, user_email)
        VALUES ('{}', '{}', '{}', '{}') """.format(user.user_first_name, user.user_last_name, user.user_title, user.user_email)
        self.cur.execute(command)
        self.conn.commit()
        data['user_id'] = self.cur.lastrowid
        return data
