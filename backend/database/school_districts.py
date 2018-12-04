from db import Database

class SchoolDistrictsDatabase(Database):
    def __init__(self):
        super().__init__()

    def get_school_districts_list(self):
        self.cur.execute('SELECT district_id, district_name, district_mailbox_number FROM school_districts')
        result = self.cur.fetchall()
        return result
