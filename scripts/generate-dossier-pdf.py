from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "observations-site" / "rugved-naik-dossier.pdf"

INK = colors.HexColor("#1F1B17")
MUTED = colors.HexColor("#6F665D")
BRASS = colors.HexColor("#A86F2E")
BLUE = colors.HexColor("#254C7A")
PAPER = colors.HexColor("#F7F1E6")
LINE = colors.HexColor("#D7CCBD")


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.line(18 * mm, 14 * mm, 192 * mm, 14 * mm)
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 9 * mm, "RUGVED NAIK  |  LE DOSSIER")
    canvas.drawRightString(192 * mm, 9 * mm, f"{doc.page}")
    canvas.restoreState()


doc = BaseDocTemplate(
    str(OUTPUT),
    pagesize=A4,
    leftMargin=18 * mm,
    rightMargin=18 * mm,
    topMargin=18 * mm,
    bottomMargin=19 * mm,
    title="Rugved Naik - Le Dossier",
    author="Rugved Naik",
    subject="Consumer-centric product, marketing and innovation portfolio",
)
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="body")
doc.addPageTemplates([PageTemplate(id="page", frames=[frame], onPage=footer)])

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Kicker", parent=styles["Normal"], fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=BRASS, spaceAfter=5, tracking=1.4))
styles.add(ParagraphStyle(name="TitleLarge", parent=styles["Title"], fontName="Times-Roman", fontSize=31, leading=33, textColor=INK, alignment=TA_LEFT, spaceAfter=9))
styles.add(ParagraphStyle(name="SectionTitle", parent=styles["Title"], fontName="Times-Roman", fontSize=23, leading=26, textColor=INK, alignment=TA_LEFT, spaceAfter=9))
styles.add(ParagraphStyle(name="H2x", parent=styles["Heading2"], fontName="Times-Roman", fontSize=16, leading=19, textColor=INK, spaceBefore=7, spaceAfter=5))
styles.add(ParagraphStyle(name="Bodyx", parent=styles["BodyText"], fontName="Helvetica", fontSize=9.4, leading=13.2, textColor=INK, spaceAfter=6))
styles.add(ParagraphStyle(name="Small", parent=styles["BodyText"], fontName="Helvetica", fontSize=7.8, leading=10.5, textColor=MUTED))
styles.add(ParagraphStyle(name="Metric", parent=styles["BodyText"], fontName="Times-Bold", fontSize=17, leading=19, textColor=BLUE, spaceAfter=2))
styles.add(ParagraphStyle(name="CardTitle", parent=styles["Heading3"], fontName="Times-Bold", fontSize=12, leading=14, textColor=INK, spaceAfter=3))


def p(text, style="Bodyx"):
    return Paragraph(text, styles[style])


def section_label(text):
    return p(text.upper(), "Kicker")


def metric(value, label):
    return [p(value, "Metric"), p(label, "Small")]


def dossier_card(kind, title, description):
    content = [p(kind.upper(), "Kicker"), p(title, "CardTitle"), p(description, "Small")]
    table = Table([[content]], colWidths=[82 * mm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FBF7EF")),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return table


story = []
story += [section_label("Application dossier"), p("Rugved Naik", "TitleLarge")]
story += [p("Consumer understanding for product, marketing and innovation decisions.", "SectionTitle")]
story += [p("Engineer by training, growth practitioner, and Innovation & Productivity PM Intern at Danone. I use consumer evidence to clarify what a team should build, say or prioritize.")]

facts = Table([
    [metric("MAR 2027", "Internships from March 2027"), metric("SEP 2027", "Apprenticeships from September 2027")],
    [metric("APR 2028", "Expected ESCP graduation"), metric("PARIS", "ESCP Business School")],
], colWidths=[87 * mm, 87 * mm])
facts.setStyle(TableStyle([
    ("BOX", (0, 0), (-1, -1), 0.7, LINE),
    ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
    ("BACKGROUND", (0, 0), (-1, -1), PAPER),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ("TOPPADDING", (0, 0), (-1, -1), 8),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
]))
story += [Spacer(1, 4 * mm), facts, Spacer(1, 6 * mm)]

story += [section_label("Target roles"), p("Product Management, Product Marketing, Innovation PMO, Consumer Strategy, Consumer Insights and Market Intelligence.")]
story += [section_label("Evidence at a glance")]
metrics = Table([[
    metric("4,700+", "Ratings and reviews analyzed"),
    metric("EUR 68K", "Monthly portfolio budget"),
    metric("5 to 25", "BAJA team growth"),
    metric("4 months", "BAJA delivery window"),
]], colWidths=[43.5 * mm] * 4)
metrics.setStyle(TableStyle([
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("BOX", (0, 0), (-1, -1), 0.6, LINE),
    ("INNERGRID", (0, 0), (-1, -1), 0.4, LINE),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ("TOPPADDING", (0, 0), (-1, -1), 7),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
]))
story += [metrics, Spacer(1, 5 * mm), section_label("Availability and format"), p("ESCP internship agreement required. Flexible 4 to 6 month duration. Day-to-day working language: English. French A2, actively improving through regular coursework.")]

story.append(PageBreak())
story += [section_label("Proof to inspect"), p("Three evidence types, shown according to what actually exists.", "SectionTitle")]

proof_rows = [
    ("DATED RESEARCH", "Collectibility Over Loyalty", "Academic project submitted in March 2026. I led the quantitative netnography and social-listening analysis across 4,700+ ratings and reviews. Later public Miu Miu Beauty activity aligned with the framework; no influence is claimed."),
    ("DELIVERY UNDER CONSTRAINT", "Building the Team Before Building the Vehicle", "Captain and Head of Engineering Design. Grew a five-person group into a 25-person agile organization, managed an INR 17.5 lakh budget and INR 8 lakh in sponsorships, and delivered in four months. Top 10 in India and 1 of 3 teams selected for BAJA SAE Oregon 2023."),
    ("PRESENTED ARTIFACT", "Face Architecture", "Winner of the ESCP x LVMH Case Challenge in a 100-student cohort. The team submission translated couture heritage into a Gen Z beauty venture, with deck excerpts available in the online dossier."),
]
for kind, title, body in proof_rows:
    story += [KeepTogether([section_label(kind), p(title, "H2x"), p(body)]), Spacer(1, 3 * mm)]

story += [section_label("Method"), p("Observe. Separate signal from noise. Name the tension. Translate it into product or go-to-market logic. Make the result usable for the next decision.")]
story += [section_label("Current role"), p("Danone, Innovation & Productivity PM Intern, September 2026 to February 2027. Supporting European dairy innovation and productivity projects across milestones, cross-functional coordination, data quality, Power BI, governance and portfolio health.")]

story.append(PageBreak())
story += [section_label("Dossier index"), p("Six real projects and two independent thinking exercises.", "SectionTitle")]

cards = [
    dossier_card("Academic project", "Collectibility Over Loyalty", "Consumer research, market reading and a dated evidence trail."),
    dossier_card("Team leadership", "Building the Team Before Building the Vehicle", "Product delivery, organization design and technical trade-offs under constraint."),
    dossier_card("Freelance client work", "Availability Is a Ranking Signal", "Inventory, organic rank, advertising dependency and commercial response."),
    dossier_card("Freelance client work", "Listing Conversion Systems", "Customer doubt, marketplace proof and conversion infrastructure."),
    dossier_card("Founder venture", "Foldable Electric Mobility Product", "Patent-linked research and a 2024 peer-reviewed paper, DOI 10.4273/ijvss.16.1.08."),
    dossier_card("Case competition", "Face Architecture", "A Gen Z beauty venture grounded in Givenchy couture heritage."),
    dossier_card("Independent analysis", "Premium Health Devices Need to Sell Interpretation", "A 100-listing Amazon category read on Withings, premium value and trust."),
    dossier_card("Independent analysis", "What AI Can't Personalize", "Adaptive discovery, brand memory and protected cues inside personalization."),
]
for index in range(0, len(cards), 2):
    row = Table([[cards[index], cards[index + 1]]], colWidths=[87 * mm, 87 * mm])
    row.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 4), ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4)]))
    story.append(row)

story += [Spacer(1, 5 * mm), section_label("Contact"), p("rugved.naik@edu.escp.eu  |  linkedin.com/in/rugvednaik  |  rugvedxnaik.github.io/rugved-naik-portfolio/")]
story += [p("References available on request. I usually reply within 24 to 48 hours.", "Small")]

doc.build(story)
print(OUTPUT)
