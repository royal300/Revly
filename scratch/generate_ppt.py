import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 widescreen layout
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]

    # Brand Colors (Minimalist Premium Dark Theme)
    BG_COLOR = RGBColor(11, 15, 25)          # Deep Obsidian #0B0F19
    CARD_BG = RGBColor(23, 30, 48)           # Slate Card #171E30
    CARD_BORDER = RGBColor(40, 50, 75)       # Border #28324B
    PRIMARY_PURPLE = RGBColor(129, 110, 255) # Electric Violet #816EFF
    ACCENT_CYAN = RGBColor(6, 182, 212)      # Cyan #06B6D4
    ACCENT_GREEN = RGBColor(16, 185, 129)    # Emerald #10B981
    ACCENT_AMBER = RGBColor(245, 158, 11)    # Amber #F59E0B
    TEXT_WHITE = RGBColor(248, 250, 252)     # Off-white #F8FAFC
    TEXT_MUTED = RGBColor(148, 163, 184)     # Muted Slate #94A3B8

    IMAGE_QR_STAND = r"C:\Users\AMIT\.gemini\antigravity-ide\brain\57426d26-9a80-48d1-bde5-6d3eaa15d5ee\revly_qr_stand_mockup_1791808615898.png"
    IMAGE_RANKING = r"C:\Users\AMIT\.gemini\antigravity-ide\brain\57426d26-9a80-48d1-bde5-6d3eaa15d5ee\google_maps_ranking_boost_1791808634948.png"

    def apply_bg(slide):
        bg_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg_shape.fill.solid()
        bg_shape.fill.fore_color.rgb = BG_COLOR
        bg_shape.line.fill.background() # no border
        return bg_shape

    def add_card(slide, left, top, width, height, bg=CARD_BG, border=CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg
        card.line.color.rgb = border
        card.line.width = Pt(1.2)
        return card

    # =========================================================================
    # SLIDE 1: COVER / INTRO
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    apply_bg(slide1)

    # Category Pill
    pill = add_card(slide1, Inches(0.8), Inches(1.0), Inches(4.2), Inches(0.45), bg=RGBColor(30, 27, 75), border=PRIMARY_PURPLE)
    p_tf = pill.text_frame
    p_tf.word_wrap = True
    p_para = p_tf.paragraphs[0]
    p_para.text = "✨  AI-POWERED GOOGLE MAPS ENGINE"
    p_para.font.size = Pt(11)
    p_para.font.bold = True
    p_para.font.color.rgb = PRIMARY_PURPLE
    p_para.alignment = PP_ALIGN.CENTER

    # Main Title Box
    title_box = slide1.shapes.add_textbox(Inches(0.8), Inches(1.65), Inches(6.8), Inches(2.8))
    tf = title_box.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "Turn Every Walk-In"
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = TEXT_WHITE

    p2 = tf.add_paragraph()
    p2.text = "Into a 5-Star"
    p2.font.size = Pt(40)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_WHITE

    p3 = tf.add_paragraph()
    p3.text = "Google Review."
    p3.font.size = Pt(40)
    p3.font.bold = True
    p3.font.color.rgb = PRIMARY_PURPLE

    # Subtitle Box
    sub_box = slide1.shapes.add_textbox(Inches(0.8), Inches(4.7), Inches(6.5), Inches(1.2))
    stf = sub_box.text_frame
    stf.word_wrap = True
    sp = stf.paragraphs[0]
    sp.text = "Revly turns tabletop QR feedback into authentic, keyword-rich Google reviews in 30 seconds — boosting your Google Maps #1 rank automatically."
    sp.font.size = Pt(14)
    sp.font.color.rgb = TEXT_MUTED

    # Highlights Row
    hl_card = add_card(slide1, Inches(0.8), Inches(6.1), Inches(6.5), Inches(0.65), bg=RGBColor(17, 24, 39), border=RGBColor(55, 65, 81))
    htf = hl_card.text_frame
    hp = htf.paragraphs[0]
    hp.text = "⏱️  30 Sec Journey   •   ⚡ 100% Staff-Free   •   📱 Zero App Needed"
    hp.font.size = Pt(12)
    hp.font.bold = True
    hp.font.color.rgb = TEXT_WHITE
    hp.alignment = PP_ALIGN.CENTER

    # Right Image (Acrylic QR Stand Mockup)
    if os.path.exists(IMAGE_QR_STAND):
        img_left = Inches(7.8)
        img_top = Inches(1.0)
        img_width = Inches(4.8)
        img_height = Inches(5.6)
        # Background frame for image
        add_card(slide1, img_left - Inches(0.1), img_top - Inches(0.1), img_width + Inches(0.2), img_height + Inches(0.2), bg=CARD_BG, border=PRIMARY_PURPLE)
        slide1.shapes.add_picture(IMAGE_QR_STAND, img_left, img_top, width=img_width, height=img_height)

    # =========================================================================
    # SLIDE 2: THE PROBLEM (THE 4 BOTTLENECKS)
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    apply_bg(slide2)

    # Header
    hdr = slide2.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(1.2))
    htf = hdr.text_frame
    p = htf.paragraphs[0]
    p.text = "THE PROBLEM"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = RGBColor(239, 68, 68)

    p2 = htf.add_paragraph()
    p2.text = "Why Great Businesses Stay Invisible on Google Maps"
    p2.font.size = Pt(28)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_WHITE

    # 4 Cards Grid
    problems = [
        ("1. Hidden on Google Maps", "88% of shoppers search on Google before visiting, but competitors with more reviews take the top 3 spots. If you're not in the top 3, you are invisible.", ACCENT_AMBER),
        ("2. The Friction Barrier", "95% of happy customers walk out without reviewing. Asking in person is awkward for staff, and customers forget the second they leave the store.", PRIMARY_PURPLE),
        ("3. The 'Nice & Good' Trap", "When customers do post, they write: 'Nice food' or 'Good salon'. These 2 words contain zero keywords. Google's algorithm gives your shop zero ranking credit.", RGBColor(239, 68, 68)),
        ("4. Zero Customer Data", "Customers pay via cash or UPI and walk away. The owner has no contact number, no visit history, and no way to invite them back for slow days.", ACCENT_CYAN)
    ]

    card_w = Inches(5.6)
    card_h = Inches(2.1)
    coords = [
        (Inches(0.8), Inches(2.2)),
        (Inches(6.8), Inches(2.2)),
        (Inches(0.8), Inches(4.7)),
        (Inches(6.8), Inches(4.7))
    ]

    for i, (title, desc, accent) in enumerate(problems):
        cx, cy = coords[i]
        c = add_card(slide2, cx, cy, card_w, card_h)
        ctf = c.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.3)
        ctf.margin_right = Inches(0.3)
        ctf.margin_top = Inches(0.25)
        
        cp1 = ctf.paragraphs[0]
        cp1.text = title
        cp1.font.size = Pt(17)
        cp1.font.bold = True
        cp1.font.color.rgb = accent
        
        cp2 = ctf.add_paragraph()
        cp2.text = desc
        cp2.font.size = Pt(12.5)
        cp2.font.color.rgb = TEXT_MUTED
        cp2.space_before = Pt(8)

    # =========================================================================
    # SLIDE 3: THE SOLUTION (30-SECOND GROWTH LOOP)
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    apply_bg(slide3)

    hdr3 = slide3.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(1.2))
    htf3 = hdr3.text_frame
    p = htf3.paragraphs[0]
    p.text = "THE SOLUTION"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_GREEN

    p2 = htf3.add_paragraph()
    p2.text = "The Revly 30-Second Growth Engine"
    p2.font.size = Pt(28)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_WHITE

    steps = [
        ("STEP 1", "Scan Tabletop QR", "Customer scans branded stander with their mobile camera.\n\n• Zero app download\n• Instant web load (<1s)\n• Zero login barrier", PRIMARY_PURPLE),
        ("STEP 2", "3-Tap Micro-Feedback", "Customer rates 2-3 quick emoji questions about their visit.\n\n• AI weaves experience\n• Automatically inserts high-value SEO keywords\n• 100% human tone", ACCENT_CYAN),
        ("STEP 3", "1-Tap Google Post", "Customer clicks 'Post to Google'. Review is copied & Maps opens.\n\n• Customer simply pastes\n• Submitted in 3 seconds\n• Name & mobile saved to CRM", ACCENT_GREEN)
    ]

    step_w = Inches(3.65)
    step_h = Inches(3.9)
    step_xs = [Inches(0.8), Inches(4.8), Inches(8.8)]

    for i, (badge, title, desc, acc) in enumerate(steps):
        sx = step_xs[i]
        sc = add_card(slide3, sx, Inches(2.2), step_w, step_h)
        stf = sc.text_frame
        stf.word_wrap = True
        stf.margin_left = Inches(0.3)
        stf.margin_right = Inches(0.3)
        stf.margin_top = Inches(0.3)

        sp1 = stf.paragraphs[0]
        sp1.text = badge
        sp1.font.size = Pt(11)
        sp1.font.bold = True
        sp1.font.color.rgb = acc

        sp2 = stf.add_paragraph()
        sp2.text = title
        sp2.font.size = Pt(18)
        sp2.font.bold = True
        sp2.font.color.rgb = TEXT_WHITE
        sp2.space_before = Pt(4)

        sp3 = stf.add_paragraph()
        sp3.text = desc
        sp3.font.size = Pt(12.5)
        sp3.font.color.rgb = TEXT_MUTED
        sp3.space_before = Pt(12)

    # Bottom Callout Bar
    bot_card = add_card(slide3, Inches(0.8), Inches(6.35), Inches(11.65), Inches(0.65), bg=RGBColor(17, 24, 39), border=PRIMARY_PURPLE)
    btf = bot_card.text_frame
    bp = btf.paragraphs[0]
    bp.text = "🚀  Result: Customer completes the review effortlessly • Business gains Google SEO ranking power + Verified Customer Lead."
    bp.font.size = Pt(12)
    bp.font.bold = True
    bp.font.color.rgb = TEXT_WHITE
    bp.alignment = PP_ALIGN.CENTER

    # =========================================================================
    # SLIDE 4: WHY KEYWORDS WIN (BEFORE VS AFTER)
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    apply_bg(slide4)

    hdr4 = slide4.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(1.2))
    htf4 = hdr4.text_frame
    p = htf4.paragraphs[0]
    p.text = "THE LOCAL SEO SECRET"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = PRIMARY_PURPLE

    p2 = htf4.add_paragraph()
    p2.text = "Why Keyword-Rich Reviews Drive #1 Google Rankings"
    p2.font.size = Pt(28)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_WHITE

    # Left: Old Way
    left_c = add_card(slide4, Inches(0.8), Inches(2.2), Inches(5.6), Inches(4.6), bg=RGBColor(24, 20, 25), border=RGBColor(239, 68, 68))
    ltf = left_c.text_frame
    ltf.word_wrap = True
    ltf.margin_left = Inches(0.4)
    ltf.margin_right = Inches(0.4)
    ltf.margin_top = Inches(0.35)

    lp1 = ltf.paragraphs[0]
    lp1.text = "❌  WITHOUT REVLY (Generic Review)"
    lp1.font.size = Pt(15)
    lp1.font.bold = True
    lp1.font.color.rgb = RGBColor(239, 68, 68)

    lp2 = ltf.add_paragraph()
    lp2.text = '“Nice food, super place.”'
    lp2.font.size = Pt(18)
    lp2.font.bold = True
    lp2.font.color.rgb = TEXT_WHITE
    lp2.space_before = Pt(16)

    lp3 = ltf.add_paragraph()
    lp3.text = "• Zero dish names or service mentions\n• Zero local area search signals\n• Google's algorithm ignores it\n• Completely invisible for 'near me' discovery searches"
    lp3.font.size = Pt(13)
    lp3.font.color.rgb = TEXT_MUTED
    lp3.space_before = Pt(16)

    # Right: With Revly
    right_c = add_card(slide4, Inches(6.8), Inches(2.2), Inches(5.6), Inches(4.6), bg=RGBColor(20, 28, 45), border=ACCENT_GREEN)
    rtf = right_c.text_frame
    rtf.word_wrap = True
    rtf.margin_left = Inches(0.4)
    rtf.margin_right = Inches(0.4)
    rtf.margin_top = Inches(0.35)

    rp1 = rtf.paragraphs[0]
    rp1.text = "✅  WITH REVLY (AI Keyword-Rich Review)"
    rp1.font.size = Pt(15)
    rp1.font.bold = True
    rp1.font.color.rgb = ACCENT_GREEN

    rp2 = rtf.add_paragraph()
    rp2.text = '“Loved the creamy Alfredo pasta and hazelnut cold brew! The seating atmosphere was so relaxing. Top cafe spot in the area.”'
    rp2.font.size = Pt(15)
    rp2.font.bold = True
    rp2.font.color.rgb = TEXT_WHITE
    rp2.space_before = Pt(16)

    rp3 = rtf.add_paragraph()
    rp3.text = "• Keywords Indexed: Alfredo pasta, hazelnut cold brew, seating atmosphere\n• Signals relevance to Google's ranking algorithm\n• Ranks at the Top when locals search for pasta or cold brew\n• 100% human, authentic, customer-verified"
    rp3.font.size = Pt(12.5)
    rp3.font.color.rgb = TEXT_MUTED
    rp3.space_before = Pt(16)

    # =========================================================================
    # SLIDE 5: CORE BUSINESS FEATURES
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    apply_bg(slide5)

    hdr5 = slide5.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(1.2))
    htf5 = hdr5.text_frame
    p = htf5.paragraphs[0]
    p.text = "POWERFUL PLATFORM"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_CYAN

    p2 = htf5.add_paragraph()
    p2.text = "Core Features Built for Store Owners"
    p2.font.size = Pt(28)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_WHITE

    feats = [
        ("🎯 Custom Question Builder", "Configure specific questions for Cafes, Salons, Clinics, Gyms & Retail. 3 random questions served per scan so reviews cover all aspects.", PRIMARY_PURPLE),
        ("👥 Customer Directory (CRM)", "Captures customer names and phone numbers automatically. Identify loyal repeat guests and build an owned SMS/WhatsApp marketing database.", ACCENT_GREEN),
        ("📊 Operational Health Analytics", "Track scan counts, review conversion rates, and department ratings (Food Taste, Service Speed, Cleanliness) to fix operational flaws fast.", ACCENT_CYAN),
        ("🏷️ Custom Branded Standers", "Customized with your shop's official colors, logo badge, and high-resolution print-ready QR codes for tables, counters, and bill folders.", ACCENT_AMBER)
    ]

    for i, (title, desc, acc) in enumerate(feats):
        cx, cy = coords[i]
        c = add_card(slide5, cx, cy, card_w, card_h)
        ctf = c.text_frame
        ctf.word_wrap = True
        ctf.margin_left = Inches(0.3)
        ctf.margin_right = Inches(0.3)
        ctf.margin_top = Inches(0.25)
        
        cp1 = ctf.paragraphs[0]
        cp1.text = title
        cp1.font.size = Pt(17)
        cp1.font.bold = True
        cp1.font.color.rgb = acc
        
        cp2 = ctf.add_paragraph()
        cp2.text = desc
        cp2.font.size = Pt(12.5)
        cp2.font.color.rgb = TEXT_MUTED
        cp2.space_before = Pt(8)

    # =========================================================================
    # SLIDE 6: BUSINESS ROI & SUMMARY
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    apply_bg(slide6)

    hdr6 = slide6.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(1.2))
    htf6 = hdr6.text_frame
    p = htf6.paragraphs[0]
    p.text = "PROVEN BUSINESS IMPACT"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_GREEN

    p2 = htf6.add_paragraph()
    p2.text = "Measurable ROI from Day One"
    p2.font.size = Pt(28)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_WHITE

    stats = [
        ("5x – 10x", "Monthly Google Review Velocity", "Turn silent walk-in visitors into active 5-star brand promoters.", PRIMARY_PURPLE),
        ("#1 Rank", "Top 3 Google Maps Placement", "Outrank competitors for high-intent searches without spending on ads.", ACCENT_GREEN),
        ("500–2,000", "Verified Phone Leads / Month", "Own your customer database instead of relying on third-party aggregators.", ACCENT_CYAN),
        ("100%", "Automated & Staff-Free", "Zero manual follow-ups, zero awkward staff begging at billing desks.", ACCENT_AMBER)
    ]

    stat_w = Inches(2.7)
    stat_h = Inches(3.7)
    stat_xs = [Inches(0.8), Inches(3.75), Inches(6.7), Inches(9.65)]

    for i, (big, title, sub, acc) in enumerate(stats):
        sx = stat_xs[i]
        sc = add_card(slide6, sx, Inches(2.2), stat_w, stat_h)
        stf = sc.text_frame
        stf.word_wrap = True
        stf.margin_left = Inches(0.2)
        stf.margin_right = Inches(0.2)
        stf.margin_top = Inches(0.35)

        sp1 = stf.paragraphs[0]
        sp1.text = big
        sp1.font.size = Pt(32)
        sp1.font.bold = True
        sp1.font.color.rgb = acc
        sp1.alignment = PP_ALIGN.CENTER

        sp2 = stf.add_paragraph()
        sp2.text = title
        sp2.font.size = Pt(14)
        sp2.font.bold = True
        sp2.font.color.rgb = TEXT_WHITE
        sp2.alignment = PP_ALIGN.CENTER
        sp2.space_before = Pt(8)

        sp3 = stf.add_paragraph()
        sp3.text = sub
        sp3.font.size = Pt(11.5)
        sp3.font.color.rgb = TEXT_MUTED
        sp3.alignment = PP_ALIGN.CENTER
        sp3.space_before = Pt(12)

    # Bottom Final CTA
    fin_card = add_card(slide6, Inches(0.8), Inches(6.2), Inches(11.65), Inches(0.8), bg=RGBColor(30, 27, 75), border=PRIMARY_PURPLE)
    ftf = fin_card.text_frame
    fp = ftf.paragraphs[0]
    fp.text = "🎯 Every customer who visits your store is a Google Ranking opportunity."
    fp.font.size = Pt(13)
    fp.font.bold = True
    fp.font.color.rgb = TEXT_WHITE
    fp.alignment = PP_ALIGN.CENTER

    fp2 = ftf.add_paragraph()
    fp2.text = "Revly turns that daily footfall into permanent Google Maps dominance and customer loyalty."
    fp2.font.size = Pt(12)
    fp2.font.color.rgb = PRIMARY_PURPLE
    fp2.alignment = PP_ALIGN.CENTER

    # Save PPTX
    out_path = r"e:\ROYAL300\google_reviewer\Revly_Pitch_Deck.pptx"
    prs.save(out_path)
    print(f"Presentation saved successfully to {out_path}")

if __name__ == '__main__':
    create_deck()
