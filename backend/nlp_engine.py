import re
from typing import Dict, Any

# Common Hindi & Hinglish keywords for civic and safety issues
HINGLISH_KEYWORDS = {
    "pothole": ["gaddha", "gaddhe", "gadda", "khadda", "pothole", "khadde", "road kharab", "sarak tooti"],
    "garbage": ["kachra", "kachda", "kooda", "dustbin", "badboo", "safai nahi", "waste", "garbage", "gandagi"],
    "street_light": ["street light", "streetlight", "batti", "light band", "bulb kharab", "andhera", "darkness"],
    "drains": ["naali", "nali", "gutter", "paani bhara", "waterlogging", "sewer", "drain block", "drainage"],
    "harassment": ["stalker", "chhedkhani", "ladka peechha", "dar lag raha", "unsafe", "manchale", "threat", "badtameezi"]
}

SEVERITY_KEYWORDS = {
    "critical": ["bahut bada", "bahut zyada", "emergency", "danger", "accident ho sakta", "khatra", "jaldi theek karo", "police"],
    "high": ["bada gaddha", "deep", "gehra", "gaadi toot jayegi", "traffic jam", "serious"],
    "medium": ["kharab", "problem", "theek karao", "pareshani", "daily issue"]
}

def parse_hindi_hinglish_complaint(text: str) -> Dict[str, Any]:
    """
    Parses complaints in Hindi or Hinglish text without mandatory LLM cost,
    classifying issue category and urgency score.
    """
    if not text:
        return {"category": "pothole", "severity": "medium", "confidence": 0.5, "language": "en"}

    normalized = text.lower().strip()
    detected_category = "pothole"
    category_matches = 0

    for cat, words in HINGLISH_KEYWORDS.items():
        matches = sum(1 for w in words if re.search(r'\b' + re.escape(w) + r'\b', normalized))
        if matches > category_matches:
            category_matches = matches
            detected_category = cat

    detected_severity = "medium"
    for sev, words in SEVERITY_KEYWORDS.items():
        if any(w in normalized for w in words):
            detected_severity = sev
            break

    # Determine if text contains Hindi/Hinglish words
    is_hinglish = any(any(w in normalized for w in words) for words in HINGLISH_KEYWORDS.values())

    return {
        "text": text,
        "detected_category": detected_category,
        "suggested_severity": detected_severity,
        "is_hinglish": is_hinglish,
        "keywords_matched": category_matches,
        "sentiment_urgency": "high" if detected_severity in ["high", "critical"] else "normal"
    }
