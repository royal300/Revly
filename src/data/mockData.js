/**
 * Initial Mock Data for RevioPulse AI
 * Multi-tenant structure ensuring strict business data isolation.
 */

export const INITIAL_DATA = {
  platform: {
    superAdmin: {
      name: "Alex Sterling",
      email: "admin@reviopulse.ai",
      role: "Platform Super Administrator",
      avatar: "AS",
      lastLogin: "2026-10-03 08:30"
    },
    metrics: {
      totalBusinesses: 12,
      activeBusinesses: 10,
      inactiveBusinesses: 2,
      totalQrScans: 14820,
      totalFeedbackSessions: 11450,
      totalAiGenerations: 9890,
      totalGoogleRedirects: 8410
    },
    activityLog: [
      { id: "act-1", event: "Business Created", businessName: "Grandview Boutique Hotel & Spa", timestamp: "2026-10-02 16:45", type: "success" },
      { id: "act-2", event: "Google URL Configured", businessName: "Apex Modern Dental & Orthodontics", timestamp: "2026-10-02 14:12", type: "info" },
      { id: "act-3", event: "Business Status Changed to Inactive", businessName: "Urban Luxe Hair & Wellness Lounge", timestamp: "2026-10-01 11:20", type: "warning" },
      { id: "act-4", event: "Password Reset Triggered", businessName: "The Roasted Bean Cafe", timestamp: "2026-09-29 09:15", type: "info" },
      { id: "act-5", event: "QR Code Regenerated", businessName: "Apex Modern Dental & Orthodontics", timestamp: "2026-09-28 17:30", type: "warning" },
      { id: "act-6", event: "Business Profile Updated", businessName: "The Roasted Bean Cafe", timestamp: "2026-09-27 13:05", type: "success" }
    ]
  },

  businesses: [
    {
      id: "biz-1",
      name: "The Roasted Bean Cafe & Roastery",
      owner: "Elena Rostova",
      category: "Cafe & Restaurant",
      status: "Active",
      address: "742 Evergreen Terrace, Springfield, OR",
      phone: "+1 (555) 234-8901",
      email: "contact@roastedbean.com",
      username: "roastedbean_admin",
      logoText: "RB",
      googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
      createdDate: "2026-08-14",
      defaultLanguage: "English (US)",
      metrics: {
        qrScans: 1284,
        customerInfoCompleted: 1102,
        feedbackCompleted: 982,
        aiReviewsGenerated: 931,
        googleRedirects: 817,
        avgRating: 4.62,
        ratingTrend: "+0.18",
        scansTrend: "+14.2%",
        feedbackTrend: "+11.8%",
        redirectsTrend: "+16.5%"
      },
      categories: [
        { id: "cat-1", name: "Staff & Hospitality", questionCount: 4, status: "Active", avgRating: 4.8, responses: 842 },
        { id: "cat-2", name: "Food & Pastries", questionCount: 3, status: "Active", avgRating: 4.6, responses: 801 },
        { id: "cat-3", name: "Service Speed", questionCount: 3, status: "Active", avgRating: 4.3, responses: 790 },
        { id: "cat-4", name: "Ambience & Music", questionCount: 2, status: "Active", avgRating: 4.7, responses: 735 },
        { id: "cat-5", name: "Coffee & Drinks", questionCount: 4, status: "Active", avgRating: 4.9, responses: 890 },
        { id: "cat-6", name: "Waiting Time", questionCount: 2, status: "Active", avgRating: 3.9, responses: 612 }
      ],
      ratingDistribution: {
        star5: 610,
        star4: 245,
        star3: 82,
        star2: 31,
        star1: 14
      },
      monthlyTrends: [
        { month: "August", staff: 4.65, food: 4.50, service: 4.15, ambience: 4.55, waitingTime: 3.70 },
        { month: "September", staff: 4.72, food: 4.58, service: 4.22, ambience: 4.62, waitingTime: 3.81 },
        { month: "October", staff: 4.80, food: 4.64, service: 4.30, ambience: 4.70, waitingTime: 3.92 }
      ],
      questions: [
        { id: "q-1", text: "How would you rate our staff's friendliness and attentiveness?", category: "Staff & Hospitality", type: "1–5 Rating", status: "Active", createdDate: "2026-08-15" },
        { id: "q-2", text: "How satisfied were you with the quality and freshness of our coffee?", category: "Coffee & Drinks", type: "1–5 Rating", status: "Active", createdDate: "2026-08-15" },
        { id: "q-3", text: "How would you rate the taste and presentation of your food?", category: "Food & Pastries", type: "1–5 Rating", status: "Active", createdDate: "2026-08-15" },
        { id: "q-4", text: "How was the cafe atmosphere, seating comfort, and background music?", category: "Ambience & Music", type: "1–5 Rating", status: "Active", createdDate: "2026-08-16" },
        { id: "q-5", text: "How was your overall waiting time from ordering to receiving your item?", category: "Waiting Time", type: "1–5 Rating", status: "Active", createdDate: "2026-08-16" },
        { id: "q-6", text: "How quick and smooth was the ordering and checkout process?", category: "Service Speed", type: "1–5 Rating", status: "Active", createdDate: "2026-08-20" },
        { id: "q-7", text: "Did our baristas customize your beverage to your preference?", category: "Coffee & Drinks", type: "1–5 Rating", status: "Inactive", createdDate: "2026-09-02" }
      ],
      feedbackList: [
        {
          id: "fb-101",
          customerName: "Rahul Sharma",
          customerMobile: "+1 (555) 789-0123",
          date: "2026-10-02 11:42",
          answers: [
            { category: "Staff & Hospitality", question: "How would you rate our staff?", rating: 5 },
            { category: "Coffee & Drinks", question: "Quality and freshness of coffee?", rating: 5 },
            { category: "Waiting Time", question: "Waiting time from ordering?", rating: 4 }
          ],
          comment: "The hazelnut latte was exceptional and the morning barista was super cheerful!",
          generatedReview: "I had a wonderful experience at The Roasted Bean Cafe! The staff was super cheerful and welcoming, and the hazelnut latte was truly exceptional. Service was prompt and efficient. Highly recommend!",
          editedReview: "I had a wonderful experience at The Roasted Bean Cafe! The staff was super cheerful and welcoming, and the hazelnut latte was truly exceptional. Service was prompt and efficient. Definitely coming back!",
          redirectStatus: "Redirected",
          sessionStatus: "Completed"
        },
        {
          id: "fb-102",
          customerName: "Claire Dupont",
          customerMobile: "+1 (555) 432-8871",
          date: "2026-10-02 09:15",
          answers: [
            { category: "Food & Pastries", question: "Taste and presentation of food?", rating: 5 },
            { category: "Ambience & Music", question: "Cafe atmosphere and music?", rating: 5 },
            { category: "Staff & Hospitality", question: "Staff attentiveness?", rating: 4 }
          ],
          comment: "Fresh almond croissants are out of this world. Lovely cozy jazz playlist.",
          generatedReview: "Fantastic visit to The Roasted Bean Cafe. The almond croissants were freshly baked and delicious, accompanied by a cozy atmosphere with great background music. Staff was very helpful.",
          editedReview: null,
          redirectStatus: "Redirected",
          sessionStatus: "Completed"
        },
        {
          id: "fb-103",
          customerName: "Marcus Brody",
          customerMobile: "+1 (555) 601-9922",
          date: "2026-10-01 16:30",
          answers: [
            { category: "Waiting Time", question: "Waiting time from ordering?", rating: 3 },
            { category: "Coffee & Drinks", question: "Coffee freshness?", rating: 4 },
            { category: "Service Speed", question: "Checkout process?", rating: 3 }
          ],
          comment: "A bit of a line during peak afternoon rush, but the pour-over made up for it.",
          generatedReview: "Good coffee stop at The Roasted Bean Cafe. The pour-over coffee was well crafted and flavorful. The cafe was quite busy with a bit of a wait during peak hours, but overall a decent visit.",
          editedReview: null,
          redirectStatus: "Redirected",
          sessionStatus: "Completed"
        },
        {
          id: "fb-104",
          customerName: "Ananya Patel",
          customerMobile: "+1 (555) 312-7645",
          date: "2026-10-01 12:10",
          answers: [
            { category: "Staff & Hospitality", question: "Staff attentiveness?", rating: 5 },
            { category: "Coffee & Drinks", question: "Coffee freshness?", rating: 5 },
            { category: "Ambience & Music", question: "Atmosphere?", rating: 4 }
          ],
          comment: "Perfect place to get some morning remote work done.",
          generatedReview: "Really enjoyed my time at The Roasted Bean Cafe. The team was warm and welcoming, coffee was top notch, and the work-friendly vibe was ideal. Will visit regularly!",
          editedReview: null,
          redirectStatus: "Pending",
          sessionStatus: "Completed"
        },
        {
          id: "fb-105",
          customerName: "David Kim",
          customerMobile: "+1 (555) 902-3344",
          date: "2026-09-30 15:40",
          answers: [
            { category: "Staff & Hospitality", question: "Staff attentiveness?", rating: 5 },
            { category: "Food & Pastries", question: "Taste of food?", rating: 4 },
            { category: "Coffee & Drinks", question: "Coffee freshness?", rating: 5 }
          ],
          comment: "Loved the sourdough avocado toast and cold brew.",
          generatedReview: "Great experience at The Roasted Bean! Wonderful customer service, delicious avocado toast, and crisp cold brew coffee. Definitely worth stopping by.",
          editedReview: "Great experience at The Roasted Bean! Wonderful customer service, delicious avocado toast, and crisp cold brew coffee.",
          redirectStatus: "Redirected",
          sessionStatus: "Completed"
        }
      ],
      customers: [
        {
          id: "cust-1",
          name: "Rahul Sharma",
          mobile: "+1 (555) 789-0123",
          firstSeen: "2026-08-25",
          lastSeen: "2026-10-02",
          sessionCount: 3,
          avgRating: 4.8,
          history: [
            { date: "2026-10-02", ratings: "Staff 5/5, Coffee 5/5, Wait Time 4/5", comment: "The hazelnut latte was exceptional!" },
            { date: "2026-09-14", ratings: "Staff 5/5, Food 4/5, Ambience 5/5", comment: "Great morning ambiance." },
            { date: "2026-08-25", ratings: "Staff 5/5, Coffee 5/5, Service 5/5", comment: "First time here, loved the brew." }
          ]
        },
        {
          id: "cust-2",
          name: "Claire Dupont",
          mobile: "+1 (555) 432-8871",
          firstSeen: "2026-09-10",
          lastSeen: "2026-10-02",
          sessionCount: 2,
          avgRating: 4.7,
          history: [
            { date: "2026-10-02", ratings: "Food 5/5, Ambience 5/5, Staff 4/5", comment: "Fresh almond croissants are out of this world." },
            { date: "2026-09-10", ratings: "Coffee 5/5, Service 4/5, Ambience 5/5", comment: "Cozy spot." }
          ]
        },
        {
          id: "cust-3",
          name: "Marcus Brody",
          mobile: "+1 (555) 601-9922",
          firstSeen: "2026-10-01",
          lastSeen: "2026-10-01",
          sessionCount: 1,
          avgRating: 3.3,
          history: [
            { date: "2026-10-01", ratings: "Wait Time 3/5, Coffee 4/5, Service 3/5", comment: "Peak rush had some delays." }
          ]
        }
      ]
    },

    {
      id: "biz-2",
      name: "Apex Modern Dental & Orthodontics",
      owner: "Dr. Marcus Vance",
      category: "Healthcare / Dental",
      status: "Active",
      address: "108 Metro Medical Blvd, Suite 400, Chicago, IL",
      phone: "+1 (555) 892-1200",
      email: "care@apexdental.com",
      username: "apexdental_admin",
      logoText: "AD",
      googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJN1t_tApexClinicDentalReview",
      createdDate: "2026-09-01",
      defaultLanguage: "English (US)",
      metrics: {
        qrScans: 640,
        customerInfoCompleted: 580,
        feedbackCompleted: 520,
        aiReviewsGenerated: 495,
        googleRedirects: 432,
        avgRating: 4.88,
        ratingTrend: "+0.25",
        scansTrend: "+18.0%",
        feedbackTrend: "+14.3%",
        redirectsTrend: "+21.1%"
      },
      categories: [
        { id: "cat-201", name: "Doctor & Hygienist Care", questionCount: 3, status: "Active", avgRating: 4.95, responses: 510 },
        { id: "cat-202", name: "Front Desk & Scheduling", questionCount: 2, status: "Active", avgRating: 4.75, responses: 490 },
        { id: "cat-203", name: "Clinic Cleanliness", questionCount: 2, status: "Active", avgRating: 5.0, responses: 480 },
        { id: "cat-204", name: "Painless Procedure", questionCount: 2, status: "Active", avgRating: 4.82, responses: 460 }
      ],
      ratingDistribution: {
        star5: 440,
        star4: 65,
        star3: 12,
        star2: 2,
        star1: 1
      },
      monthlyTrends: [
        { month: "August", staff: 4.80, food: 4.90, service: 4.60, ambience: 4.95, waitingTime: 4.70 },
        { month: "September", staff: 4.90, food: 4.95, service: 4.70, ambience: 4.98, waitingTime: 4.80 },
        { month: "October", staff: 4.95, food: 4.98, service: 4.75, ambience: 5.00, waitingTime: 4.82 }
      ],
      questions: [
        { id: "q-21", text: "How comfortable and cared for did you feel during your dental treatment?", category: "Doctor & Hygienist Care", type: "1–5 Rating", status: "Active", createdDate: "2026-09-01" },
        { id: "q-22", text: "How satisfied were you with the clinic's sanitation and modern equipment?", category: "Clinic Cleanliness", type: "1–5 Rating", status: "Active", createdDate: "2026-09-01" },
        { id: "q-23", text: "How smooth was your check-in and appointment scheduling experience?", category: "Front Desk & Scheduling", type: "1–5 Rating", status: "Active", createdDate: "2026-09-01" }
      ],
      feedbackList: [],
      customers: []
    },

    {
      id: "biz-3",
      name: "Grandview Boutique Hotel & Spa",
      owner: "Sophia Sterling",
      category: "Hospitality & Travel",
      status: "Active",
      address: "500 Oceanfront Way, Miami Beach, FL",
      phone: "+1 (555) 441-9876",
      email: "stay@grandviewmiami.com",
      username: "grandview_admin",
      logoText: "GH",
      googleReviewUrl: "https://search.google.com/local/writereview?placeid=ChIJN1t_tGrandviewSpaMiami",
      createdDate: "2026-09-18",
      defaultLanguage: "English (US)",
      metrics: {
        qrScans: 410,
        customerInfoCompleted: 360,
        feedbackCompleted: 310,
        aiReviewsGenerated: 298,
        googleRedirects: 254,
        avgRating: 4.74,
        ratingTrend: "+0.10",
        scansTrend: "+9.5%",
        feedbackTrend: "+8.2%",
        redirectsTrend: "+11.0%"
      },
      categories: [
        { id: "cat-301", name: "Room Comfort & Views", questionCount: 2, status: "Active", avgRating: 4.8, responses: 290 },
        { id: "cat-302", name: "Concierge & Hospitality", questionCount: 2, status: "Active", avgRating: 4.9, responses: 300 },
        { id: "cat-303", name: "Spa & Amenities", questionCount: 2, status: "Active", avgRating: 4.6, responses: 240 }
      ],
      ratingDistribution: {
        star5: 230,
        star4: 60,
        star3: 15,
        star2: 3,
        star1: 2
      },
      monthlyTrends: [
        { month: "September", staff: 4.70, food: 4.65, service: 4.55, ambience: 4.80, waitingTime: 4.60 },
        { month: "October", staff: 4.90, food: 4.80, service: 4.70, ambience: 4.90, waitingTime: 4.74 }
      ],
      questions: [
        { id: "q-31", text: "How comfortable was your room and bedding during your stay?", category: "Room Comfort & Views", type: "1–5 Rating", status: "Active", createdDate: "2026-09-18" },
        { id: "q-32", text: "How helpful and attentive was our concierge team?", category: "Concierge & Hospitality", type: "1–5 Rating", status: "Active", createdDate: "2026-09-18" },
        { id: "q-33", text: "How would you rate your relaxation experience at the spa pool?", category: "Spa & Amenities", type: "1–5 Rating", status: "Active", createdDate: "2026-09-18" }
      ],
      feedbackList: [],
      customers: []
    },

    {
      id: "biz-4",
      name: "Urban Luxe Hair & Wellness Lounge",
      owner: "Tariq Bennett",
      category: "Salon & Personal Care",
      status: "Inactive",
      address: "220 Design Row, Brooklyn, NY",
      phone: "+1 (555) 303-7711",
      email: "hello@urbanluxe.com",
      username: "urbanluxe_admin",
      logoText: "UL",
      googleReviewUrl: "",
      createdDate: "2026-09-25",
      defaultLanguage: "English (US)",
      metrics: {
        qrScans: 45,
        customerInfoCompleted: 30,
        feedbackCompleted: 22,
        aiReviewsGenerated: 18,
        googleRedirects: 10,
        avgRating: 4.10,
        ratingTrend: "-0.15",
        scansTrend: "-4.0%",
        feedbackTrend: "-2.1%",
        redirectsTrend: "-8.0%"
      },
      categories: [
        { id: "cat-401", name: "Stylist Expertise", questionCount: 2, status: "Active", avgRating: 4.3, responses: 22 },
        { id: "cat-402", name: "Punctuality", questionCount: 1, status: "Active", avgRating: 3.8, responses: 20 }
      ],
      ratingDistribution: {
        star5: 10,
        star4: 8,
        star3: 2,
        star2: 1,
        star1: 1
      },
      monthlyTrends: [
        { month: "September", staff: 4.10, food: 3.90, service: 4.00, ambience: 4.20, waitingTime: 3.80 },
        { month: "October", staff: 4.15, food: 3.85, service: 4.05, ambience: 4.15, waitingTime: 3.80 }
      ],
      questions: [
        { id: "q-41", text: "How satisfied were you with your styling results?", category: "Stylist Expertise", type: "1–5 Rating", status: "Active", createdDate: "2026-09-25" }
      ],
      feedbackList: [],
      customers: []
    }
  ]
};
