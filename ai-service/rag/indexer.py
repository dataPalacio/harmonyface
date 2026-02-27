from typing import Iterable


def index_documents(documents: Iterable[str]) -> int:
    count = 0
    for _ in documents:
        count += 1
    return count
