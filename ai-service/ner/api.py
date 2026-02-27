from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="HarmoniFace NER Service", version="0.1.0")


class NoteRequest(BaseModel):
    text: str


@app.post('/parse')
def parse_note(payload: NoteRequest):
    return {
        "paciente": None,
        "idade": None,
        "procedimentos_realizados": [],
        "retorno": None,
        "procedimentos_sugeridos": [],
        "raw": payload.text
    }
