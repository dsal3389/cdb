import psycopg2.pool
from typing import AsyncGenerator
from urllib.parse import urlparse
from app.core.settings import settings


_url_parts = urlparse(settings.DATABASE_URL)
_connection_pool = psycopg2.pool.SimpleConnectionPool(
    minconn=5,
    maxconn=15,
    user=_url_parts.username,
    password=_url_parts.password,
    host=_url_parts.hostname,
    port=_url_parts.port,
    database=_url_parts.path[1:],
)


async def database_session() -> AsyncGenerator[psycopg2.extensions.connection, None]:
    connection = None

    try:
        connection = _connection_pool.getconn()
        yield connection
    finally:
        if connection:
            _connection_pool.putconn(connection)
