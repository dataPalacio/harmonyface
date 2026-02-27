from typing import Any


def retrieve_context(query: str) -> dict[str, Any]:
    return {"query": query, "chunks": []}
