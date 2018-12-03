from db import Database

class SchoolDistrictsDatabase(Database):
    def __init__(self):
        super().__init__()

    def get_school_districts_list(self):
        self.cur.execute('SELECT district_id, district_name, district_mailbox_number FROM school_districts')
        result = self.cur.fetchall()
        return result

    # def get_user(self, district_id: int):
    #     command = """
    #     SELECT user_id, user_first_name, user_last_name, user_title, email FROM users
    #     WHERE email='{}'
    #     """.format(district_id)
    #     self.cur.execute(command)
    #     result = self.cur.fetchall()
    #     self.close_database_and_server()
    #     return result