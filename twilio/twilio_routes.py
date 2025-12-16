import os
from fastapi import APIRouter, HTTPException, Request, Response
from twilio.request_validator import RequestValidator
from twilio.twiml.messaging_response import MessagingResponse
from src.bot_logic import ask_bot_offline, prepare_resources

router = APIRouter()

df, model, index = prepare_resources()
twilio_auth_token = os.getenv("TWILIO_AUTH_TOKEN")
validator = RequestValidator(twilio_auth_token) if twilio_auth_token else None


@router.post("/twilio/sms")
async def twilio_sms(request: Request):
    if validator is None:
        raise HTTPException(status_code=500, detail="TWILIO_AUTH_TOKEN is not configured.")

    form = await request.form()
    twilio_sig = request.headers.get("X-Twilio-Signature")
    url = str(request.url)

    if not validator.validate(url, form, twilio_sig):
        raise HTTPException(status_code=403, detail="Invalid Twilio signature")

    body = form.get("Body", "")
    answer = ask_bot_offline(body, df, model, index)

    twiml = MessagingResponse()
    twiml.message(answer)
    return Response(content=str(twiml), media_type="application/xml")
