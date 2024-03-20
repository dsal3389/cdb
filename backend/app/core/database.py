import contextlib
import psycopg2.pool
from typing import Iterable
from urllib.parse import urlparse
from app.core.settings import settings


url_parts = urlparse(settings.DATABASE_URL)


connection_pool = psycopg2.pool.SimpleConnectionPool(
    minconn=5,
    maxconn=15,
    user=url_parts.username,
    password=url_parts.password,
    host=url_parts.hostname,
    port=url_parts.port,
    database=url_parts.path[1:],
)


async def database_session() -> Iterable[psycopg2.extensions.connection]:
    connection = None

    try:
        connection = connection_pool.getconn()
        yield connection
    finally:
        if connection:
            connection_pool.putconn(connection)
