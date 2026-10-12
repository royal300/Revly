import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]

    # Ultra-Premium Dark Theme Colors
    BG_COLOR = RGBColor(8, 12, 21)             # #080C15 deep obsidian
    CARD_BG = RGBColor(18, 24, 39)             # #121827 sleek dark surface
    CARD_BORDER = RGBColor(31, 41, 61)         # #1F293D subtle stroke
    CARD_ACCENT_BG = RGBColor(22, 28, 48)

    VIOLET = RGBColor(139, 92, 246)            # #8B5CF6
    CYAN = RGBColor(6, 182, 212)               # #06B6D4
    EMERALD = RGBColor(16, 185, 129)           # #10B981
    AMBER = RGBColor(245, 158, 11)             # #F59E0B
    ROSE = RGBColor(244, 63, 94)               # #F43F5E
    WHITE = RGBColor(255, 255, 255)
    OFF_WHITE = RGBColor(241, 245, 249)        # #F1F5F9
    SLATE_MUTED = RGBColor(148, 163, 184)      # #94A3B8

    IMAGE_QR_STAND = r"C:\Users\AMIT\.gemini\antigravity-ide\brain\57426d26-9a80-48d1-bde5-6d3eaa15d5ee\revly_qr_stand_mockup_1791808615898.png"

    def set_slide_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()
        return bg

    def make_card(slide, l, t, w, h, bg=CARD_BG, border=CARD_BORDER):
        c = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, l, t, w, h)
        c.fill.solid()
        c.fill.fore_color.rgb = bg
        c.line.color.rgb = border
        c.line.width = Pt(1.5)
        return c

    # =========================================================================
    # SLIDE 1: INTRO (Clean, Punchy, High Impact)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s1)

    # Pill badge
    pill1 = make_card(s1, Inches(0.9), Inches(1.0), Inches(3.4), Inches(0.42), bg=RGBColor(26, 20, 54), border=VIOLET)
    ptf = pill1.text_frame
    ptf.word_wrap = True
    pp = ptf.paragraphs[0]
    pp.text = "⚡  GOOGLE MAPS GROWTH ENGINE"
    pp.font.size = Pt(11)
    pp.font.bold = True
    pp.font.color.rgb = VIOLET
    pp.alignment = PP_ALIGN.CENTER

    # Bold Headline
    tbox = s1.shapes.add_textbox(Inches(0.9), Inches(1.6), Inches(7.0), Inches(3.2))
    ttf = tbox.text_frame
    ttf.word_wrap = True

    p = ttf.paragraphs[0]
    p.text = "Turn Every Walk-In"
    p.font.size = Pt(46)
    p.font.bold = True
    p.font.color.rgb = WHITE

    p2 = ttf.add_paragraph()
    p2.text = "Into a 5-Star"
    p2.font.size = Pt(46)
    p2.font.bold = True
    p2.font.color.rgb = WHITE

    p3 = ttf.add_paragraph()
    p3.text = "Google Review."
    p3.font.size = Pt(46)
    p3.font.bold = True
    p3.font.color.rgb = VIOLET

    # Single punchy one-liner
    sub_box = s1.shapes.add_textbox(Inches(0.9), Inches(4.9), Inches(6.8), Inches(0.9))
    stf = sub_box.text_frame
    stf.word_wrap = True
    sp = stf.paragraphs[0]
    sp.text = "30-second tabletop QR feedback that ranks your local business #1 on Google Maps — automatically."
    sp.font.size = Pt(16)
    sp.font.color.rgb = SLATE_MUTED

    # Metrics Bar
    bar = make_card(s1, Inches(0.9), Inches(6.0), Inches(6.8), Inches(0.7), bg=CARD_BG, border=CARD_BORDER)
    btf = bar.text_frame
    bp = btf.paragraphs[0]
    bp.text = "⏱️  30 Sec Journey    •    ⚡  100% Automated    •    📱  Zero App Needed"
    bp.font.size = Pt(13)
    bp.font.bold = True
    bp.font.color.rgb = OFF_WHITE
    bp.alignment = PP_ALIGN.CENTER

    # Right Image
    if os.path.exists(IMAGE_QR_STAND):
        img_l = Inches(8.1)
        img_t = Inches(1.0)
        img_w = Inches(4.4)
        img_h = Inches(5.5)
        make_card(s1, img_l - Inches(0.12), img_t - Inches(0.12), img_w + Inches(0.24), img_h + Inches(0.24), bg=CARD_BG, border=VIOLET)
        s1.shapes.add_picture(IMAGE_QR_STAND, img_l, img_t, width=img_w, height=img_h)

    # =========================================================================
    # SLIDE 2: THE PROBLEM (METRICS ONLY, NO VERBOSE HEADERS)
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s2)

    # Punchy Top Question
    t_box2 = s2.shapes.add_textbox(Inches(0.9), Inches(0.8), Inches(11.5), Inches(1.1))
    tf2 = t_box2.text_frame
    tf2.word_wrap = True
    tp1 = tf2.paragraphs[0]
    tp1.text = "THE PROBLEM"
    tp1.font.size = Pt(12)
    tp1.font.bold = True
    tp1.font.color.rgb = ROSE

    tp2 = tf2.add_paragraph()
    tp2.text = "Great Footfall. Zero Google Visibility."
    tp2.font.size = Pt(32)
    tp2.font.bold = True
    tp2.font.color.rgb = WHITE

    # 4 Massive Metric Stat Cards
    metrics_s2 = [
        ("88%", "People search Google Maps before visiting a local shop.", ROSE),
        ("95%", "Satisfied walk-in customers leave without writing any review.", AMBER),
        ("Top 3", "Only the top 3 spots on Google Maps get 75%+ of customer visits.", VIOLET),
        ("2 Words", "Average review length ('Nice food'). Zero keywords for Google ranking.", CYAN)
    ]

    card_w = Inches(5.6)
    card_h = Inches(2.2)
    grid_coords = [
        (Inches(0.9), Inches(2.2)),
        (Inches(6.8), Inches(2.2)),
        (Inches(0.9), Inches(4.7)),
        (Inches(6.8), Inches(4.7))
    ]

    for i, (stat, oneliner, col) in enumerate(metrics_s2):
        gx, gy = grid_coords[i]
        c = make_card(s2, gx, gy, card_w, card_h)
        ctf = c.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.4)
        ctf.margin_right = Inches(0.4)
        ctf.margin_top = Inches(0.3)

        p_num = ctf.paragraphs[0]
        p_num.text = stat
        p_num.font.size = Pt(44)
        p_num.font.bold = True
        p_num.font.color.rgb = col

        p_desc = ctf.add_paragraph()
        p_desc.text = oneliner
        p_desc.font.size = Pt(15)
        p_desc.font.color.rgb = OFF_WHITE
        p_desc.space_before = Pt(8)

    # =========================================================================
    # SLIDE 3: THE SOLUTION (30-SECOND METRIC-DRIVEN FLOW)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s3)

    t_box3 = s3.shapes.add_textbox(Inches(0.9), Inches(0.8), Inches(11.5), Inches(1.1))
    tf3 = t_box3.text_frame
    tf3.word_wrap = True
    tp1 = tf3.paragraphs[0]
    tp1.text = "THE SOLUTION"
    tp1.font.size = Pt(12)
    tp1.font.bold = True
    tp1.font.color.rgb = EMERALD

    tp2 = tf3.add_paragraph()
    tp2.text = "30 Seconds. From Table QR to #1 Google Rank."
    tp2.font.size = Pt(32)
    tp2.font.bold = True
    tp2.font.color.rgb = WHITE

    sol_steps = [
        ("0 App Download", "Scan tabletop QR stander with mobile camera.", VIOLET),
        ("3 Emojis", "Customer rates visit; AI drafts keyword-rich review instantly.", CYAN),
        ("1 Tap Post", "Review auto-copies & Google Maps opens. Done in 3 seconds.", EMERALD)
    ]

    c_w3 = Inches(3.68)
    c_h3 = Inches(3.8)
    xs3 = [Inches(0.9), Inches(4.82), Inches(8.74)]

    for i, (big_line, sub_line, col) in enumerate(sol_steps):
        sx = xs3[i]
        c = make_card(s3, sx, Inches(2.2), c_w3, c_h3)
        ctf = c.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.35)
        ctf.margin_right = Inches(0.35)
        ctf.margin_top = Inches(0.4)

        p_step = ctf.paragraphs[0]
        p_step.text = f"STEP {i+1}"
        p_step.font.size = Pt(12)
        p_step.font.bold = True
        p_step.font.color.rgb = col

        p_big = ctf.add_paragraph()
        p_big.text = big_line
        p_big.font.size = Pt(28)
        p_big.font.bold = True
        p_big.font.color.rgb = WHITE
        p_big.space_before = Pt(8)

        p_sub = ctf.add_paragraph()
        p_sub.text = sub_line
        p_sub.font.size = Pt(14)
        p_sub.font.color.rgb = SLATE_MUTED
        p_sub.space_before = Pt(14)

    # Bottom metric strip
    bot_s3 = make_card(s3, Inches(0.9), Inches(6.3), Inches(11.52), Inches(0.7), bg=RGBColor(26, 20, 54), border=VIOLET)
    btf3 = bot_s3.text_frame
    bp3 = btf3.paragraphs[0]
    bp3.text = "👥  100% Leads Captured: Customer name & phone number saved automatically."
    bp3.font.size = Pt(13)
    bp3.font.bold = True
    bp3.font.color.rgb = OFF_WHITE
    bp3.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 4: THE KEYWORD SEO FACTOR (BEFORE VS AFTER)
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s4)

    t_box4 = s4.shapes.add_textbox(Inches(0.9), Inches(0.8), Inches(11.5), Inches(1.1))
    tf4 = t_box4.text_frame
    tf4.word_wrap = True
    tp1 = tf4.paragraphs[0]
    tp1.text = "THE SECRET TO RANKING"
    tp1.font.size = Pt(12)
    tp1.font.bold = True
    tp1.font.color.rgb = VIOLET

    tp2 = tf4.add_paragraph()
    tp2.text = "Why Keywords Make or Break Your Google Rank"
    tp2.font.size = Pt(32)
    tp2.font.bold = True
    tp2.font.color.rgb = WHITE

    # Left: Bad (Generic)
    c_left = make_card(s4, Inches(0.9), Inches(2.2), Inches(5.6), Inches(4.7), bg=RGBColor(28, 18, 24), border=ROSE)
    ltf = c_left.text_frame
    ltf.word_wrap = True
    ltf.margin_left = Inches(0.4)
    ltf.margin_right = Inches(0.4)
    ltf.margin_top = Inches(0.35)

    lp1 = ltf.paragraphs[0]
    lp1.text = "0 Keywords = 0 Ranking"
    lp1.font.size = Pt(26)
    lp1.font.bold = True
    lp1.font.color.rgb = ROSE

    lp2 = ltf.add_paragraph()
    lp2.text = '“Nice food, super place.”'
    lp2.font.size = Pt(20)
    lp2.font.bold = True
    lp2.font.color.rgb = WHITE
    lp2.space_before = Pt(16)

    lp3 = ltf.add_paragraph()
    lp3.text = "• Zero dish or service names\n• Zero search keywords\n• Google Maps completely ignores it\n• Business stays invisible for 'near me' searches"
    lp3.font.size = Pt(14)
    lp3.font.color.rgb = SLATE_MUTED
    lp3.space_before = Pt(16)

    # Right: Good (Keyword Rich)
    c_right = make_card(s4, Inches(6.8), Inches(2.2), Inches(5.6), Inches(4.7), bg=RGBColor(16, 30, 36), border=EMERALD)
    rtf = c_right.text_frame
    rtf.word_wrap = True
    rtf.margin_left = Inches(0.4)
    rtf.margin_right = Inches(0.4)
    rtf.margin_top = Inches(0.35)

    rp1 = rtf.paragraphs[0]
    rp1.text = "Keywords = Top 3 Rank"
    rp1.font.size = Pt(26)
    rp1.font.bold = True
    rp1.font.color.rgb = EMERALD

    rp2 = rtf.add_paragraph()
    rp2.text = '“Loved the creamy Alfredo pasta and cold brew! Relaxing seating atmosphere.”'
    rp2.font.size = Pt(16)
    rp2.font.bold = True
    rp2.font.color.rgb = WHITE
    rp2.space_before = Pt(16)

    rp3 = rtf.add_paragraph()
    rp3.text = "• Keywords Indexed: Alfredo pasta, cold brew, relaxing atmosphere\n• Google recognizes your exact offerings\n• Ranks #1 when locals search pasta, coffee, or hangout\n• 100% human, authentic customer voice"
    rp3.font.size = Pt(13.5)
    rp3.font.color.rgb = SLATE_MUTED
    rp3.space_before = Pt(16)

    # =========================================================================
    # SLIDE 5: FEATURES (ONE-LINERS ONLY)
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s5)

    t_box5 = s5.shapes.add_textbox(Inches(0.9), Inches(0.8), Inches(11.5), Inches(1.1))
    tf5 = t_box5.text_frame
    tf5.word_wrap = True
    tp1 = tf5.paragraphs[0]
    tp1.text = "KEY FEATURES"
    tp1.font.size = Pt(12)
    tp1.font.bold = True
    tp1.font.color.rgb = CYAN

    tp2 = tf5.add_paragraph()
    tp2.text = "Built for Store Owners. Zero Tech Skills."
    tp2.font.size = Pt(32)
    tp2.font.bold = True
    tp2.font.color.rgb = WHITE

    feats_s5 = [
        ("Custom Question Bank", "Tailored for Cafes, Salons, Clinics, Gyms & Retail. 3 random questions per scan.", VIOLET),
        ("Customer Contact CRM", "Captures names and phone numbers to identify repeat loyal visitors.", EMERALD),
        ("Operational Health Scores", "Live ratings for food, staff speed, and cleanliness to catch issues early.", CYAN),
        ("Branded Tabletop Standers", "Custom shop colors, logo, and print-ready QR codes for tables and counters.", AMBER)
    ]

    for i, (title, oneliner, col) in enumerate(feats_s5):
        gx, gy = grid_coords[i]
        c = make_card(s5, gx, gy, card_w, card_h)
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
        p_d.font.color.rgb = OFF_WHITE
        p_d.space_before = Pt(8)

    # =========================================================================
    # SLIDE 6: ROI & BUSINESS IMPACT (BIG NUMBERS ONLY)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_bg(s6)

    t_box6 = s6.shapes.add_textbox(Inches(0.9), Inches(0.8), Inches(11.5), Inches(1.1))
    tf6 = t_box6.text_frame
    tf6.word_wrap = True
    tp1 = tf6.paragraphs[0]
    tp1.text = "BUSINESS ROI"
    tp1.font.size = Pt(12)
    tp1.font.bold = True
    tp1.font.color.rgb = EMERALD

    tp2 = tf6.add_paragraph()
    tp2.text = "Proven Results from Day One"
    tp2.font.size = Pt(32)
    tp2.font.bold = True
    tp2.font.color.rgb = WHITE

    stats_s6 = [
        ("10x", "Monthly Google Review Velocity", "Turn silent walk-ins into 5-star brand promoters.", VIOLET),
        ("#1 Rank", "Top 3 Google Maps Placement", "Outrank competitors without spending on paid ads.", EMERALD),
        ("2,000+", "Phone Leads Captured / Month", "Own your customer database for festival campaigns.", CYAN),
        ("0 Effort", "100% Automated & Staff-Free", "Zero manual follow-ups, zero awkward staff begging.", AMBER)
    ]

    s_w6 = Inches(2.7)
    s_h6 = Inches(3.6)
    xs6 = [Inches(0.9), Inches(3.84), Inches(6.78), Inches(9.72)]

    for i, (big, title, sub, col) in enumerate(stats_s6):
        sx = xs6[i]
        c = make_card(s6, sx, Inches(2.2), s_w6, s_h6)
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
        p2.font.color.rgb = WHITE
        p2.alignment = PP_ALIGN.CENTER
        p2.space_before = Pt(8)

        p3 = ctf.add_paragraph()
        p3.text = sub
        p3.font.size = Pt(12)
        p3.font.color.rgb = SLATE_MUTED
        p3.alignment = PP_ALIGN.CENTER
        p3.space_before = Pt(12)

    # Bottom Close Bar
    bot_s6 = make_card(s6, Inches(0.9), Inches(6.15), Inches(11.52), Inches(0.75), bg=RGBColor(26, 20, 54), border=VIOLET)
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
    bp6_2.font.color.rgb = VIOLET
    bp6_2.alignment = PP_ALIGN.CENTER

    out_file = r"e:\ROYAL300\google_reviewer\Revly_Pitch_Deck.pptx"
    try:
        prs.save(out_file)
        print(f"Updated deck saved to {out_file}")
    except PermissionError:
        fallback_file = r"e:\ROYAL300\google_reviewer\Revly_Pitch_Deck_v2.pptx"
        prs.save(fallback_file)
        print(f"Original file was open in PowerPoint. Saved updated deck to {fallback_file}")

if __name__ == '__main__':
    create_deck()
