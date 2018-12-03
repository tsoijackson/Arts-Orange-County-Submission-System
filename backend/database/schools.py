from db import Database

class SchoolsDatabase(Database):
    def __init__(self):
        super().__init__()

    def get_schools_list(self):
        command = """
        SELECT 
            school_id, 
            school_name, 
            school_type, 
            schools.district_id, 
            district_name, 
            district_mailbox_number, 
            school_lat, 
            school_long
        FROM schools
        LEFT JOIN school_districts on schools.district_id = school_districts.district_id
        """
        self.cur.execute(command)
        result = self.cur.fetchall()
        return result

    def get_schools(self, district_id: int):
        command = """
        SELECT 
            school_id, 
            school_name, 
            school_type, 
            schools.district_id, 
            district_name, 
            district_mailbox_number, 
            school_lat, 
            school_long
        FROM schools
        LEFT JOIN school_districts on schools.district_id = school_districts.district_id
        WHERE school_districts.district_id = {}
        """.format(district_id)
        self.cur.execute(command)
        result = self.cur.fetchall()
        return result