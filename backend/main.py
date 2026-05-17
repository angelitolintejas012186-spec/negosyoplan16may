"""
Negosyo Plan – FastAPI backend
- DeepSeek AI blueprint generation
- Admin authentication (JWT) + site settings CRUD

Run:
    uvicorn main:app --reload --port 8000
"""

import hmac
import json
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Optional

import shutil

import httpx
import jwt as pyjwt
from dotenv import load_dotenv
from fastapi import FastAPI, File, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv()

# ── Config ────────────────────────────────────────────────────────────────────

DEEPSEEK_API_KEY: str = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_URL = "https://api.deepseek.com/chat/completions"
DEEPSEEK_MODEL = "deepseek-chat"

# Admin auth
ADMIN_USERNAME: str = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD: str = os.getenv("ADMIN_PASSWORD", "NegosyoPlan@2026!")
JWT_SECRET: str = os.getenv("JWT_SECRET", "np-jwt-secret-change-in-production-2026")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 10

# Settings file (persisted on disk next to main.py)
SETTINGS_PATH = Path(__file__).parent / "settings.json"
ASSETS_IMAGES = Path(__file__).parent.parent / "assets" / "images"

DEFAULT_SETTINGS: dict[str, Any] = {
    "pricing": {
        "starter": 1900,
        "founder": 2600,
        "complete": 3500,
        "custom": 4600,
    },
    "promo_banner": {
        "enabled": False,
        "text": "🎉 Special launch offer — 20% off all bundles this week!",
        "bg_color": "#E8420A",
        "text_color": "#ffffff",
        "link": "shop.html",
        "link_text": "Shop Now",
    },
    "theme": {
        "primary": "#E8420A",
        "secondary": "#0F1F3D",
        "accent": "#F5A500",
    },
    "hero": {
        "title": "Launch your business with a ready-made blueprint.",
        "subtitle": "Digital business blueprints for OFWs, entrepreneurs, and startup creators.",
        "cta_primary": "Browse Bundles",
        "cta_secondary": "Generate AI Blueprint",
    },
    "products": {
        "1": {
            "name": "Starter Bundle",
            "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            "description": "Perfect for beginners starting their entrepreneurial journey.",
        },
        "2": {
            "name": "Founder Bundle",
            "image": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            "description": "Advanced business strategy and investor-ready templates.",
        },
        "3": {
            "name": "Complete Set Bundle",
            "image": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            "description": "Comprehensive package for planning, launch, and growth.",
        },
        "4": {
            "name": "Custom Bundle",
            "image": "https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            "description": "Tailor-made toolkit for your market, operations, and goals.",
        },
    },
    "contact": {
        "whatsapp": "1234567890",
        "email": "support@negosyoplan.com",
    },
    "branding": {
        "logo_url": "",
        "brand_name": "NEGOSYO PLAN",
    },
}


# ── Settings helpers ──────────────────────────────────────────────────────────

def load_settings() -> dict:
    if SETTINGS_PATH.exists():
        try:
            return json.loads(SETTINGS_PATH.read_text(encoding="utf-8"))
        except Exception:
            pass
    return json.loads(json.dumps(DEFAULT_SETTINGS))   # deep copy


def save_settings(data: dict) -> None:
    SETTINGS_PATH.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")


def deep_merge(base: dict, override: dict) -> dict:
    result = base.copy()
    for k, v in override.items():
        if k in result and isinstance(result[k], dict) and isinstance(v, dict):
            result[k] = deep_merge(result[k], v)
        else:
            result[k] = v
    return result


# ── JWT helpers ───────────────────────────────────────────────────────────────

def create_token(username: str) -> str:
    exp = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRE_HOURS)
    return pyjwt.encode({"sub": username, "exp": exp}, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> str | None:
    try:
        payload = pyjwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get("sub")
    except pyjwt.PyJWTError:
        return None


def require_admin(authorization: str | None) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(403, "Not authenticated")
    user = decode_token(authorization.split(" ", 1)[1])
    if not user:
        raise HTTPException(401, "Token expired or invalid — please log in again")
    return user

# ── App ───────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Negosyo Plan AI API",
    description="DeepSeek-powered business blueprint generator for Negosyo Plan",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten to your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request / Response models ─────────────────────────────────────────────────

class LocationData(BaseModel):
    country: str = "Philippines"
    region: str = ""
    city: str = ""
    subdivision: str = ""


class SupplierInfo(BaseModel):
    name: str
    type: str = ""
    contact: str = ""
    coverage: str = ""


class BlueprintRequest(BaseModel):
    business_type: str = Field(..., description="Slug e.g. mini_grocery, restaurant")
    business_type_label: str = Field(..., description="Human-readable label")
    bundle_tier: str = Field(
        "starter", description="starter | founder | complete | custom"
    )
    capital: float = Field(..., description="Available capital in PHP")
    location: LocationData = Field(default_factory=LocationData)
    description: Optional[str] = Field("", description="Buyer's own description")
    suppliers: list[SupplierInfo] = Field(default_factory=list)


class QuickAnalysisRequest(BaseModel):
    business_type: str
    business_type_label: str
    bundle_tier: str = "starter"
    capital: float
    location: LocationData = Field(default_factory=LocationData)


# ── Prompt helpers ────────────────────────────────────────────────────────────

TIER_DEPTH = {
    "starter": (
        "foundational / essential level — practical basics, quick-start checklists, "
        "beginner-friendly language. Skip advanced frameworks."
    ),
    "founder": (
        "advanced level — include Porter's Five Forces, investor-ready financial "
        "analysis, competitive positioning and market validation."
    ),
    "complete": (
        "professional / pro level — full depth including PESTEL, ANSOFF matrix, "
        "detailed 12-month financial modelling and executive-grade strategy."
    ),
    "custom": (
        "premium custom level — maximum depth, highly personalised to the exact "
        "business, location, capital, and selected suppliers."
    ),
}

SYSTEM_PROMPT = """You are a senior Filipino business consultant with 20+ years' experience advising
OFW (Overseas Filipino Worker) entrepreneurs and MSMEs across all Philippine regions.

Your expertise covers:
• DTI/BIR/SEC registration, barangay permits, local government licensing
• Regional supplier ecosystems (NCR, Visayas, Mindanao, Luzon provinces)
• SB Finance, LANDBANK, DBP, Pag-IBIG MSME loan programs
• Filipino consumer behaviour, seasonal demand, fiestas, remittance cycles
• Both traditional (tarpaulin, text brigades, barangay events) and digital marketing
  (Facebook Shops, TikTok Live, Shopee, Lazada, GCash QR payments)

IMPORTANT: Respond with valid JSON only. No markdown fences, no prose outside the JSON."""


def _location_str(loc: LocationData) -> str:
    parts = [loc.subdivision, loc.city, loc.region, loc.country]
    return ", ".join(p for p in parts if p)


def _supplier_names(suppliers: list[SupplierInfo]) -> str:
    if not suppliers:
        return "none specified"
    return ", ".join(s.name for s in suppliers)


# ── Full blueprint prompt ─────────────────────────────────────────────────────

def build_blueprint_prompt(req: BlueprintRequest) -> str:
    depth = TIER_DEPTH.get(req.bundle_tier, TIER_DEPTH["starter"])
    loc = _location_str(req.location)
    cap = f"PHP {req.capital:,.0f}"
    sups = _supplier_names(req.suppliers)

    is_founder_plus = req.bundle_tier in ("founder", "complete", "custom")
    is_complete_plus = req.bundle_tier in ("complete", "custom")

    porter = (
        '"porters_five_forces": {'
        '"supplier_power": "string",'
        '"buyer_power": "string",'
        '"competitive_rivalry": "string",'
        '"threat_of_substitutes": "string",'
        '"threat_of_new_entrants": "string",'
        '"overall_assessment": "string"'
        '},'
    ) if is_founder_plus else ""

    pestel_ansoff = (
        '"pestel_analysis": {'
        '"political": "string","economic": "string","social": "string",'
        '"technological": "string","environmental": "string","legal": "string"'
        '},'
        '"ansoff_matrix": {'
        '"market_penetration": "string","market_development": "string",'
        '"product_development": "string","diversification": "string"'
        '},'
    ) if is_complete_plus else ""

    return f"""Analyse this business opportunity and return a comprehensive JSON blueprint at {depth}.

INPUTS
  Business type : {req.business_type_label} ({req.business_type})
  Bundle tier   : {req.bundle_tier.title()}
  Capital       : {cap}
  Location      : {loc}
  Description   : {req.description or "Not provided"}
  Suppliers     : {sups}

Return ONLY the following JSON structure. Fill every "string" with specific,
actionable, location-aware content. Fill every number with a realistic PHP figure.

{{
  "executive_summary": {{
    "business_concept": "string",
    "unique_value_proposition": "string",
    "target_market": "string",
    "revenue_model": "string",
    "growth_potential": "string",
    "key_success_factors": ["string","string","string"]
  }},
  "swot_analysis": {{
    "strengths":    ["string","string","string","string","string"],
    "weaknesses":   ["string","string","string","string"],
    "opportunities":["string","string","string","string","string"],
    "threats":      ["string","string","string","string"],
    "so_strategies":["string","string","string"],
    "wo_strategies":["string","string"],
    "st_strategies":["string","string"],
    "wt_strategies":["string","string"]
  }},
  "financial_analysis": {{
    "startup_cost_breakdown": [
      {{"item":"string","estimated_cost_php":0,"notes":"string"}}
    ],
    "monthly_operating_costs": [
      {{"item":"string","estimated_cost_php":0,"notes":"string"}}
    ],
    "revenue_projections": {{
      "month_1":0,"month_2":0,"month_3":0,
      "month_4":0,"month_5":0,"month_6":0
    }},
    "break_even_months": 0,
    "gross_margin_percent": 0,
    "roi_12_months_percent": 0,
    "financing_options": ["string","string","string"]
  }},
  "management_system": {{
    "daily_operations_checklist": [
      "string","string","string","string","string","string","string","string"
    ],
    "key_performance_indicators": [
      {{"kpi":"string","target":"string","frequency":"string"}}
    ],
    "staffing_plan": [
      {{"role":"string","count":0,"monthly_salary_php":0,"responsibilities":"string"}}
    ],
    "standard_operating_procedures": ["string","string","string","string"]
  }},
  "fifo_inventory": {{
    "applicable": true,
    "product_categories": [
      {{"category":"string","rotation_rule":"string","shelf_life":"string","reorder_point":"string"}}
    ],
    "stock_management_tips": ["string","string","string","string"],
    "abc_classification": {{"a_items":"string","b_items":"string","c_items":"string"}}
  }},
  "risk_analysis": {{
    "top_risks": [
      {{"risk":"string","probability":"High|Medium|Low","impact":"High|Medium|Low","mitigation":"string"}}
    ],
    "contingency_plans": ["string","string","string"],
    "insurance_recommendations": ["string","string"]
  }},
  "business_strategy": {{
    "competitive_advantage": "string",
    "pricing_strategy": "string",
    "value_proposition_canvas": {{
      "customer_jobs":    ["string","string","string"],
      "customer_pains":   ["string","string","string"],
      "customer_gains":   ["string","string","string"],
      "pain_relievers":   ["string","string","string"],
      "gain_creators":    ["string","string","string"],
      "products_services":["string","string","string"]
    }},
    {porter}
    "growth_milestones": [
      {{"month":0,"milestone":"string","action":"string"}}
    ]
  }},
  {pestel_ansoff}
  "traditional_marketing": {{
    "strategies": [
      {{"tactic":"string","description":"string","monthly_budget_php":0,"expected_reach":"string"}}
    ],
    "local_partnerships": ["string","string","string"],
    "offline_channels":   ["string","string","string"]
  }},
  "digital_marketing": {{
    "platforms": [
      {{"platform":"string","strategy":"string","content_type":"string",
        "posting_frequency":"string","monthly_budget_php":0}}
    ],
    "seo_keywords":     ["string","string","string","string","string"],
    "email_sms_strategy":"string",
    "online_marketplaces":["string","string"]
  }},
  "implementation_timeline": [
    {{"phase":0,"title":"string","duration":"string",
      "key_tasks":["string","string","string"],"budget_php":0}}
  ],
  "supplier_recommendations": [
    {{"name":"string","type":"string","contact":"string",
      "coverage":"string","why_recommended":"string"}}
  ],
  "legal_requirements": {{
    "registrations": ["string","string","string","string"],
    "permits":        ["string","string","string"],
    "compliance":     ["string","string"]
  }}
}}"""


# ── Quick analysis prompt ─────────────────────────────────────────────────────

def build_quick_prompt(req: QuickAnalysisRequest) -> str:
    loc = _location_str(req.location)
    cap = f"PHP {req.capital:,.0f}"
    return f"""Quick feasibility check:
  Business: {req.business_type_label} in {loc}
  Capital : {cap}
  Tier    : {req.bundle_tier}

Return ONLY this JSON:
{{
  "feasibility_score": 0,
  "feasibility_label": "Excellent|Good|Moderate|Challenging",
  "quick_summary": "string (2-3 sentences)",
  "top_3_strengths": ["string","string","string"],
  "top_3_risks":     ["string","string","string"],
  "monthly_revenue_estimate_php": 0,
  "break_even_months": 0,
  "recommended_bundle": "starter|founder|complete|custom",
  "bundle_reason": "string",
  "quick_tips": ["string","string","string"],
  "capital_sufficiency": "Sufficient|Tight|Insufficient",
  "capital_note": "string"
}}"""


# ── DeepSeek helper ───────────────────────────────────────────────────────────

async def call_deepseek(
    system: str,
    user: str,
    max_tokens: int = 6000,
    temperature: float = 0.65,
    timeout: float = 90.0,
) -> dict:
    if not DEEPSEEK_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="DEEPSEEK_API_KEY is not set. Add it to backend/.env",
        )

    payload = {
        "model": DEEPSEEK_MODEL,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "response_format": {"type": "json_object"},
        "temperature": temperature,
        "max_tokens": max_tokens,
        "stream": False,
    }
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.post(DEEPSEEK_URL, json=payload, headers=headers)
            resp.raise_for_status()
    except httpx.TimeoutException:
        raise HTTPException(504, "DeepSeek request timed out — please retry.")
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            exc.response.status_code,
            f"DeepSeek API error: {exc.response.text[:300]}",
        )

    raw = resp.json()["choices"][0]["message"]["content"]
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(500, "DeepSeek returned non-JSON content.")


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {
        "service": "Negosyo Plan AI API",
        "version": "1.0.0",
        "endpoints": [
            "POST /api/generate-blueprint",
            "POST /api/quick-analysis",
            "GET  /health",
        ],
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "deepseek_configured": bool(DEEPSEEK_API_KEY),
        "model": DEEPSEEK_MODEL,
    }


@app.post("/api/generate-blueprint")
async def generate_blueprint(req: BlueprintRequest):
    """
    Full comprehensive blueprint extraction via DeepSeek.

    Accepts the business-form customization payload and returns a rich JSON
    object covering SWOT, FIFO, Risk, Financial, Strategy, Marketing,
    Timeline, Suppliers, and Legal requirements — depth scales with bundle tier.
    """
    data = await call_deepseek(
        system=SYSTEM_PROMPT,
        user=build_blueprint_prompt(req),
        max_tokens=6000,
        temperature=0.65,
        timeout=90.0,
    )
    return {
        "success": True,
        "meta": {
            "business_type": req.business_type,
            "business_type_label": req.business_type_label,
            "bundle_tier": req.bundle_tier,
            "capital_php": req.capital,
            "location": req.location.model_dump(),
        },
        "blueprint": data,
    }


@app.post("/api/quick-analysis")
async def quick_analysis(req: QuickAnalysisRequest):
    """
    Lightweight pre-purchase feasibility check (~3-5 s).

    Returns a feasibility score, revenue estimate, bundle recommendation,
    capital sufficiency note, and quick tips for the chosen business type.
    """
    data = await call_deepseek(
        system="You are a Filipino MSME advisor. Respond with valid JSON only.",
        user=build_quick_prompt(req),
        max_tokens=900,
        temperature=0.6,
        timeout=30.0,
    )
    return {"success": True, "analysis": data}


# ═══════════════════════════════════════════════════════════════════════════════
# ADMIN ROUTES
# ═══════════════════════════════════════════════════════════════════════════════

class AdminLoginRequest(BaseModel):
    username: str
    password: str


@app.post("/admin/login")
async def admin_login(creds: AdminLoginRequest):
    """Validate admin credentials and return a JWT token."""
    ok = (
        hmac.compare_digest(creds.username, ADMIN_USERNAME)
        and hmac.compare_digest(creds.password, ADMIN_PASSWORD)
    )
    if not ok:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_token(creds.username)
    return {
        "success": True,
        "access_token": token,
        "username": creds.username,
        "expires_in_hours": JWT_EXPIRE_HOURS,
    }


@app.get("/admin/verify")
async def admin_verify(authorization: str | None = Header(default=None)):
    """Check whether a JWT token is still valid."""
    user = require_admin(authorization)
    return {"valid": True, "username": user}


# ── Site settings (public read, admin write) ──────────────────────────────────

@app.get("/api/settings")
async def get_settings():
    """
    Public endpoint — returns current site settings so the frontend can
    apply admin-configured prices, theme colours, promo banner, etc.
    """
    return load_settings()


@app.put("/admin/settings")
async def update_settings(
    payload: dict,
    authorization: str | None = Header(default=None),
):
    """
    Merge-update site settings.  Requires a valid admin JWT.
    Send only the keys you want to change; unchanged keys are preserved.
    """
    require_admin(authorization)
    current = load_settings()
    merged = deep_merge(current, payload)
    save_settings(merged)
    return {"success": True, "settings": merged}


@app.post("/admin/settings/reset")
async def reset_settings(authorization: str | None = Header(default=None)):
    """Restore all settings to factory defaults."""
    require_admin(authorization)
    save_settings(json.loads(json.dumps(DEFAULT_SETTINGS)))
    return {"success": True, "settings": DEFAULT_SETTINGS}


@app.post("/admin/upload-logo")
async def upload_logo(
    file: UploadFile = File(...),
    authorization: str | None = Header(default=None),
):
    """Upload a new logo image. Saves to assets/images/logo-custom.<ext>."""
    require_admin(authorization)

    allowed = {".png", ".jpg", ".jpeg", ".svg", ".webp", ".ico"}
    suffix = Path(file.filename or "logo.png").suffix.lower()
    if suffix not in allowed:
        raise HTTPException(
            400, f"File type not allowed. Use: {', '.join(sorted(allowed))}"
        )

    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(400, "File too large. Maximum 5 MB.")

    ASSETS_IMAGES.mkdir(parents=True, exist_ok=True)
    save_path = ASSETS_IMAGES / f"logo-custom{suffix}"
    save_path.write_bytes(contents)

    relative_url = f"assets/images/logo-custom{suffix}"
    return {
        "success": True,
        "url": relative_url,
        "filename": file.filename,
        "size_bytes": len(contents),
    }
