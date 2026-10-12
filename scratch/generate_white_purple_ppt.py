import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_white_purple_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]

    # Clean White & Purple Shade Palette
    BG_COLOR = RGBColor(248, 247, 255)         # #F8F7FF (Soft Lilac White)
    CARD_BG = RGBColor(255, 255, 255)          # #FFFFFF (Crisp Pure White)
    CARD_BORDER = RGBColor(221, 214, 254)      # #DDD6FE (Soft Purple Border)
    CARD_BORDER_STRONG = RGBColor(196, 181, 253) # #C4B5FD

    PRIMARY_PURPLE = RGBColor(109, 40, 217)    # #6D28D9 (Rich Royal Purple)
    ACCENT_PURPLE = RGBColor(124, 58, 237)     # #7C3AED (Electric Violet)
    LIGHT_PURPLE_BG = RGBColor(243, 240, 255)  # #F3F0FF (Pill & Tag BG)
    BANNER_PURPLE = RGBColor(88, 28, 135)      # #581C87 (Deep Purple Banner)

    TEXT_DARK = RGBColor(30, 27, 75)           # #1E1B4B (Deep Purple-Black)
    TEXT_BODY = RGBColor(51, 65, 85)           # #334155 (Slate 700)
    TEXT_MUTED = RGBColor(100, 116, 139)       # #64748B (Slate 500)
    WHITE = RGBColor(255, 255, 255)

    # Accent Colors for Data Points
    ROSE = RGBColor(225, 29, 72)               # #E11D48
    EMERALD = RGBColor(5, 150, 105)            # #059669
    AMBER = RGBColor(217, 119, 6)              # #D97706
    CYAN = RGBColor(2, 132, 199)               # #0284C7

    IMAGE_TABLETOP_STAND = r"e:\ROYAL300\google_reviewer\tabletop_stand.png"

    def set_slide_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()
        return bg

    def make_card(slide, l, t, w, h, bg=CARD_BG, border=CARD_BORDER, border_width=1.5):
        c = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, l, t, w, h)
        c.fill.solid()
        c.fill.fore_color.rgb = bg
        c.line.color.rgb = border
        c.line.width = Pt(border_width)
        return c

    # =========================================================================
    # SLIDE 1: COVER (WHITE & PURPLE + GIVEN TABLETOP STAND IMAGE)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s1)

    # Pill badge
    pill1 = make_card(s1, Inches(0.9), Inches(0.9), Inches(3.6), Inches(0.44), bg=LIGHT_PURPLE_BG, border=ACCENT_PURPLE)
    ptf = pill1.text_frame
    ptf.word_wrap = True
    pp = ptf.paragraphs[0]
    pp.text = "⚡  AI-POWERED LOCAL SEO ENGINE"
    pp.font.size = Pt(11)
    pp.font.bold = True
    pp.font.color.rgb = PRIMARY_PURPLE
    pp.alignment = PP_ALIGN.CENTER

    # Title Box
    tbox = s1.shapes.add_textbox(Inches(0.9), Inches(1.5), Inches(7.4), Inches(3.2))
    ttf = tbox.text_frame
    ttf.word_wrap = True

    p = ttf.paragraphs[0]
    p.text = "Turn Every Walk-In"
    p.font.size = Pt(46)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK

    p2 = ttf.add_paragraph()
    p2.text = "Into a 5-Star"
    p2.font.size = Pt(46)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_DARK

    p3 = ttf.add_paragraph()
    p3.text = "Google Review."
    p3.font.size = Pt(46)
    p3.font.bold = True
    p3.font.color.rgb = ACCENT_PURPLE

    # One-liner Subtitle
    sub_box = s1.shapes.add_textbox(Inches(0.9), Inches(4.8), Inches(7.0), Inches(0.9))
    stf = sub_box.text_frame
    stf.word_wrap = True
    sp = stf.paragraphs[0]
    sp.text = "30-second tabletop QR feedback that ranks your local business #1 on Google Maps — completely automated."
    sp.font.size = Pt(16)
    sp.font.color.rgb = TEXT_BODY

    # Feature Row Pill
    bar = make_card(s1, Inches(0.9), Inches(5.95), Inches(6.8), Inches(0.72), bg=CARD_BG, border=CARD_BORDER_STRONG)
    btf = bar.text_frame
    bp = btf.paragraphs[0]
    bp.text = "⏱️  30 Sec Journey    •    ⚡  100% Automated    •    📱  Zero App Needed"
    bp.font.size = Pt(13)
    bp.font.bold = True
    bp.font.color.rgb = TEXT_DARK
    bp.alignment = PP_ALIGN.CENTER

    # Right Image: GIVEN USER TABLETOP STAND IMAGE
    if os.path.exists(IMAGE_TABLETOP_STAND):
        # We place the stander cleanly on the right
        img_w = Inches(4.2)
        img_h = Inches(6.1)
        img_l = Inches(8.4)
        img_t = Inches(0.7)
        s1.shapes.add_picture(IMAGE_TABLETOP_STAND, img_l, img_t, width=img_w, height=img_h)

    # =========================================================================
    # SLIDE 2: THE PROBLEM (METRICS ONLY, NO CLUTTER)
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s2)

    # Category Pill
    pill2 = make_card(s2, Inches(0.9), Inches(0.65), Inches(2.2), Inches(0.38), bg=RGBColor(255, 241, 242), border=ROSE)
    ptf2 = pill2.text_frame
    pp2 = ptf2.paragraphs[0]
    pp2.text = "THE PROBLEM"
    pp2.font.size = Pt(11)
    pp2.font.bold = True
    pp2.font.color.rgb = ROSE
    pp2.alignment = PP_ALIGN.CENTER

    # Headline
    t_box2 = s2.shapes.add_textbox(Inches(0.9), Inches(1.1), Inches(11.5), Inches(0.8))
    tf2 = t_box2.text_frame
    tp2 = tf2.paragraphs[0]
    tp2.text = "Great Footfall. Zero Google Visibility."
    tp2.font.size = Pt(32)
    tp2.font.bold = True
    tp2.font.color.rgb = TEXT_DARK

    # 4 Stat Cards in 2x2 Grid
    problems = [
        ("88%", "Local Search Dominance", "People search Google Maps before visiting a local shop or cafe.", ROSE),
        ("95%", "The Silent Customer Exit", "Satisfied walk-in customers leave without writing any Google review.", AMBER),
        ("Top 3", "The Winner's Circle", "Only the top 3 spots on Google Maps get 75%+ of customer visits.", PRIMARY_PURPLE),
        ("2 Words", "The Generic Review Trap", "Average review length ('Nice food'). Zero keywords for Google ranking.", CYAN)
    ]

    card_w = Inches(5.6)
    card_h = Inches(2.3)
    coords = [
        (Inches(0.9), Inches(2.1)),
        (Inches(6.8), Inches(2.1)),
        (Inches(0.9), Inches(4.65)),
        (Inches(6.8), Inches(4.65))
    ]

    for i, (stat, tag, oneliner, col) in enumerate(problems):
        gx, gy = coords[i]
        c = make_card(s2, gx, gy, card_w, card_h, bg=CARD_BG, border=CARD_BORDER)
        ctf = c.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.4)
        ctf.margin_right = Inches(0.4)
        ctf.margin_top = Inches(0.25)

        p_num = ctf.paragraphs[0]
        p_num.text = stat
        p_num.font.size = Pt(44)
        p_num.font.bold = True
        p_num.font.color.rgb = col

        p_tag = ctf.add_paragraph()
        p_tag.text = tag
        p_tag.font.size = Pt(14)
        p_tag.font.bold = True
        p_tag.font.color.rgb = TEXT_DARK
        p_tag.space_before = Pt(4)

        p_desc = ctf.add_paragraph()
        p_desc.text = oneliner
        p_desc.font.size = Pt(13)
        p_desc.font.color.rgb = TEXT_MUTED
        p_desc.space_before = Pt(4)

    # =========================================================================
    # SLIDE 3: THE SOLUTION (30-SECOND FLOW)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s3)

    pill3 = make_card(s3, Inches(0.9), Inches(0.65), Inches(2.2), Inches(0.38), bg=RGBColor(236, 253, 245), border=EMERALD)
    ptf3 = pill3.text_frame
    pp3 = ptf3.paragraphs[0]
    pp3.text = "THE SOLUTION"
    pp3.font.size = Pt(11)
    pp3.font.bold = True
    pp3.font.color.rgb = EMERALD
    pp3.alignment = PP_ALIGN.CENTER

    t_box3 = s3.shapes.add_textbox(Inches(0.9), Inches(1.1), Inches(11.5), Inches(0.8))
    tf3 = t_box3.text_frame
    tp3 = tf3.paragraphs[0]
    tp3.text = "30 Seconds. From Table QR to #1 Google Rank."
    tp3.font.size = Pt(32)
    tp3.font.bold = True
    tp3.font.color.rgb = TEXT_DARK

    sol_steps = [
        ("STEP 1", "0 App Download", "📱 Instant Camera Scan", "Customer scans the tabletop stander with their smartphone camera. Loads in under 1 second.", PRIMARY_PURPLE),
        ("STEP 2", "3 Emojis", "⚡ Smart Micro-Feedback", "Customer rates 2-3 quick aspects. AI weaves ratings + targeted SEO keywords into a genuine draft.", CYAN),
        ("STEP 3", "1 Tap Post", "⭐ Google Maps Post", "Review auto-copies & Google Maps opens. Customer pastes and posts in 3 seconds!", EMERALD)
    ]

    c_w3 = Inches(3.68)
    c_h3 = Inches(3.8)
    xs3 = [Inches(0.9), Inches(4.82), Inches(8.74)]

    for i, (step_num, big_title, sub_title, desc, col) in enumerate(sol_steps):
        sx = xs3[i]
        c = make_card(s3, sx, Inches(2.1), c_w3, c_h3, bg=CARD_BG, border=CARD_BORDER)
        ctf = c.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.35)
        ctf.margin_right = Inches(0.35)
        ctf.margin_top = Inches(0.35)

        p_step = ctf.paragraphs[0]
        p_step.text = step_num
        p_step.font.size = Pt(12)
        p_step.font.bold = True
        p_step.font.color.rgb = col

        p_big = ctf.add_paragraph()
        p_big.text = big_title
        p_big.font.size = Pt(28)
        p_big.font.bold = True
        p_big.font.color.rgb = TEXT_DARK
        p_big.space_before = Pt(6)

        p_sub = ctf.add_paragraph()
        p_sub.text = sub_title
        p_sub.font.size = Pt(14)
        p_sub.font.bold = True
        p_sub.font.color.rgb = col
        p_sub.space_before = Pt(8)

        p_d = ctf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(13)
        p_d.font.color.rgb = TEXT_MUTED
        p_d.space_before = Pt(12)

    # Bottom Strip (Light Purple BG)
    bot_s3 = make_card(s3, Inches(0.9), Inches(6.15), Inches(11.52), Inches(0.72), bg=LIGHT_PURPLE_BG, border=ACCENT_PURPLE)
    btf3 = bot_s3.text_frame
    bp3 = btf3.paragraphs[0]
    bp3.text = "👥  100% Leads Captured: Customer name & phone number saved automatically into your private CRM."
    bp3.font.size = Pt(13)
    bp3.font.bold = True
    bp3.font.color.rgb = PRIMARY_PURPLE
    bp3.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 4: THE KEYWORD SEO FACTOR (SIDE-BY-SIDE)
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s4)

    pill4 = make_card(s4, Inches(0.9), Inches(0.65), Inches(3.0), Inches(0.38), bg=LIGHT_PURPLE_BG, border=ACCENT_PURPLE)
    ptf4 = pill4.text_frame
    pp4 = ptf4.paragraphs[0]
    pp4.text = "THE LOCAL SEO SECRET"
    pp4.font.size = Pt(11)
    pp4.font.bold = True
    pp4.font.color.rgb = PRIMARY_PURPLE
    pp4.alignment = PP_ALIGN.CENTER

    t_box4 = s4.shapes.add_textbox(Inches(0.9), Inches(1.1), Inches(11.5), Inches(0.8))
    tf4 = t_box4.text_frame
    tp4 = tf4.paragraphs[0]
    tp4.text = "Why Keywords Make or Break Your Google Rank"
    tp4.font.size = Pt(32)
    tp4.font.bold = True
    tp4.font.color.rgb = TEXT_DARK

    # Left: Bad (Generic)
    c_left = make_card(s4, Inches(0.9), Inches(2.1), Inches(5.6), Inches(4.7), bg=RGBColor(255, 245, 245), border=RGBColor(254, 205, 211))
    ltf = c_left.text_frame
    ltf.word_wrap = True
    ltf.margin_left = Inches(0.4)
    ltf.margin_right = Inches(0.4)
    ltf.margin_top = Inches(0.35)

    lp1 = ltf.paragraphs[0]
    lp1.text = "❌  0 Keywords = 0 Ranking"
    lp1.font.size = Pt(24)
    lp1.font.bold = True
    lp1.font.color.rgb = ROSE

    lp2 = ltf.add_paragraph()
    lp2.text = '“Nice food, super place.”'
    lp2.font.size = Pt(20)
    lp2.font.bold = True
    lp2.font.color.rgb = TEXT_DARK
    lp2.space_before = Pt(16)

    lp3 = ltf.add_paragraph()
    lp3.text = "• Zero dish or service names mentioned\n• Zero search keywords for Google's algorithm\n• Google Maps completely ignores it\n• Business stays invisible for 'near me' searches"
    lp3.font.size = Pt(14)
    lp3.font.color.rgb = TEXT_BODY
    lp3.space_before = Pt(18)

    # Right: Good (Keyword Rich)
    c_right = make_card(s4, Inches(6.8), Inches(2.1), Inches(5.6), Inches(4.7), bg=RGBColor(245, 243, 255), border=ACCENT_PURPLE, border_width=2.0)
    rtf = c_right.text_frame
    rtf.word_wrap = True
    rtf.margin_left = Inches(0.4)
    rtf.margin_right = Inches(0.4)
    rtf.margin_top = Inches(0.35)

    rp1 = rtf.paragraphs[0]
    rp1.text = "✅  Keywords = Top 3 Rank"
    rp1.font.size = Pt(24)
    rp1.font.bold = True
    rp1.font.color.rgb = PRIMARY_PURPLE

    rp2 = rtf.add_paragraph()
    rp2.text = '“Loved the creamy Alfredo pasta and cold brew! Relaxing seating atmosphere.”'
    rp2.font.size = Pt(16)
    rp2.font.bold = True
    rp2.font.color.rgb = TEXT_DARK
    rp2.space_before = Pt(16)

    rp3 = rtf.add_paragraph()
    rp3.text = "• Keywords Indexed: Alfredo pasta, cold brew, relaxing atmosphere\n• Google recognizes your exact offerings\n• Ranks #1 when locals search pasta, coffee, or hangout\n• 100% human, authentic customer voice"
    rp3.font.size = Pt(13.5)
    rp3.font.color.rgb = TEXT_BODY
    rp3.space_before = Pt(18)

    # =========================================================================
    # SLIDE 5: FEATURES (ONE-LINERS IN WHITE & PURPLE)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s5)

    pill5 = make_card(s5, Inches(0.9), Inches(0.65), Inches(2.2), Inches(0.38), bg=LIGHT_PURPLE_BG, border=ACCENT_PURPLE)
    ptf5 = pill5.text_frame
    pp5 = ptf5.paragraphs[0]
    pp5.text = "KEY FEATURES"
    pp5.font.size = Pt(11)
    pp5.font.bold = True
    pp5.font.color.rgb = PRIMARY_PURPLE
    pp5.alignment = PP_ALIGN.CENTER

    t_box5 = s5.shapes.add_textbox(Inches(0.9), Inches(1.1), Inches(11.5), Inches(0.8))
    tf5 = t_box5.text_frame
    tp5 = tf5.paragraphs[0]
    tp5.text = "Built for Store Owners. Zero Tech Skills Needed."
    tp5.font.size = Pt(32)
    tp5.font.bold = True
    tp5.font.color.rgb = TEXT_DARK

    feats_s5 = [
        ("🎯 Custom Question Bank", "Tailored for Cafes, Salons, Clinics, Gyms & Retail. 3 random questions per scan.", PRIMARY_PURPLE),
        ("👥 Customer Contact CRM", "Captures names and mobile numbers to identify repeat loyal visitors automatically.", EMERALD),
        ("📊 Operational Health Scores", "Live ratings for food, staff speed, and cleanliness to catch issues early.", CYAN),
        ("🏷️ Branded Tabletop Standers", "Custom shop colors, logo, and print-ready QR codes for tables and counters.", AMBER)
    ]

    for i, (title, oneliner, col) in enumerate(feats_s5):
        gx, gy = coords[i]
        c = make_card(s5, gx, gy, card_w, card_h, bg=CARD_BG, border=CARD_BORDER)
        ctf = c.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.4)
        ctf.margin_right = Inches(0.4)
        ctf.margin_top = Inches(0.3)

        p_t = ctf.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(20)
        p_t.font.bold = True
        p_t.font.color.rgb = col

        p_d = ctf.add_paragraph()
        p_d.text = oneliner
        p_d.font.size = Pt(14)
        p_d.font.color.rgb = TEXT_BODY
        p_d.space_before = Pt(10)

    # =========================================================================
    # SLIDE 6: ROI & BUSINESS IMPACT (WHITE & PURPLE)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s6)

    pill6 = make_card(s6, Inches(0.9), Inches(0.65), Inches(2.2), Inches(0.38), bg=RGBColor(236, 253, 245), border=EMERALD)
    ptf6 = pill6.text_frame
    pp6 = ptf6.paragraphs[0]
    pp6.text = "BUSINESS ROI"
    pp6.font.size = Pt(11)
    pp6.font.bold = True
    pp6.font.color.rgb = EMERALD
    pp6.alignment = PP_ALIGN.CENTER

    t_box6 = s6.shapes.add_textbox(Inches(0.9), Inches(1.1), Inches(11.5), Inches(0.8))
    tf6 = t_box6.text_frame
    tp6 = tf6.paragraphs[0]
    tp6.text = "Proven Results from Day One"
    tp6.font.size = Pt(32)
    tp6.font.bold = True
    tp6.font.color.rgb = TEXT_DARK

    stats_s6 = [
        ("10x", "Monthly Google Review Velocity", "Turn silent walk-ins into active 5-star brand promoters.", PRIMARY_PURPLE),
        ("#1 Rank", "Top 3 Google Maps Placement", "Outrank competitors without spending on paid ads.", EMERALD),
        ("2,000+", "Phone Leads Captured / Month", "Own your customer database for festival campaigns.", CYAN),
        ("0 Effort", "100% Automated & Staff-Free", "Zero manual follow-ups, zero staff begging.", AMBER)
    ]

    s_w6 = Inches(2.7)
    s_h6 = Inches(3.6)
    xs6 = [Inches(0.9), Inches(3.84), Inches(6.78), Inches(9.72)]

    for i, (big, title, sub, col) in enumerate(stats_s6):
        sx = xs6[i]
        c = make_card(s6, sx, Inches(2.1), s_w6, s_h6, bg=CARD_BG, border=CARD_BORDER)
        ctf = c.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.2)
        ctf.margin_right = Inches(0.2)
        ctf.margin_top = Inches(0.35)

        p1 = ctf.paragraphs[0]
        p1.text = big
        p1.font.size = Pt(40)
        p1.font.bold = True
        p1.font.color.rgb = col
        p1.alignment = PP_ALIGN.CENTER

        p2 = ctf.add_paragraph()
        p2.text = title
        p2.font.size = Pt(15)
        p2.font.bold = True
        p2.font.color.rgb = TEXT_DARK
        p2.alignment = PP_ALIGN.CENTER
        p2.space_before = Pt(8)

        p3 = ctf.add_paragraph()
        p3.text = sub
        p3.font.size = Pt(12)
        p3.font.color.rgb = TEXT_MUTED
        p3.alignment = PP_ALIGN.CENTER
        p3.space_before = Pt(12)

    # Bottom Close Banner (Rich Purple with White Text)
    bot_s6 = make_card(s6, Inches(0.9), Inches(6.05), Inches(11.52), Inches(0.85), bg=BANNER_PURPLE, border=ACCENT_PURPLE)
    btf6 = bot_s6.text_frame
    bp6 = btf6.paragraphs[0]
    bp6.text = "🎯 Every customer who enters your shop is a Google Ranking opportunity."
    bp6.font.size = Pt(13)
    bp6.font.bold = True
    bp6.font.color.rgb = WHITE
    bp6.alignment = PP_ALIGN.CENTER

    bp6_2 = btf6.add_paragraph()
    bp6_2.text = "Revly turns that daily footfall into permanent Google Maps dominance."
    bp6_2.font.size = Pt(12)
    bp6_2.font.color.rgb = RGBColor(233, 213, 255)
    bp6_2.alignment = PP_ALIGN.CENTER

    out_file = r"e:\ROYAL300\google_reviewer\Revly_Pitch_Deck_White_Purple.pptx"
    prs.save(out_file)
    print(f"White & Purple deck saved successfully to {out_file}")

if __name__ == '__main__':
    create_white_purple_deck()
