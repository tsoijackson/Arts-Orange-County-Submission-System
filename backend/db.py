import pymysql, settings
from sshtunnel import SSHTunnelForwarder

class Database:
    def __init__(self):
        self.connecting_through_ssh = True

        self.server_host = settings.SSH_HOST
        self.server_port = settings.SSH_PORT
        self.server_user = settings.SSH_USER
        self.server_pass = settings.SSH_PASS

        self.db_host = settings.DB_HOST
        self.db_port = settings.DB_PORT
        self.db_user = settings.DB_USER
        self.db_pass = settings.DB_PASS
        self.db_name = settings.DB_NAME


        if self.connecting_through_ssh:
            self.server = SSHTunnelForwarder(
                (self.server_host, self.server_port),
                ssh_username = self.server_user,
                ssh_password = self.server_pass,
                remote_bind_address = (self.db_host, self.db_port))

            self.server.start()

        self.conn = pymysql.connect(
            host = self.db_host,
            port = self.server.local_bind_port,
            user = self.db_user,
            password = self.db_pass,
            db = self.db_name,
            cursorclass = pymysql.cursors.DictCursor)

        self.cur = self.conn.cursor()

    def close_database(self):
        self.conn.close()

    def close_server(self):
        self.server.close()

    # def close_database_and_server(self):
    #     self.conn.close()
    #     self.server.close()
