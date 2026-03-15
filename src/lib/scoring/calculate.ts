export interface AuditAnswers {
  business_name: string;
  business_type: string;
  profile_complete: string;
  photos: string;
  reviews: string;
  review_responses: string;
  posts: string;
  description: string;
  hours: string;
  qna: string;
}

export interface CategoryScore {
  name: string;
  score: number;
  weight: number;
  weightLabel: string;
}

export interface AuditScore {
  overall: number;
  categories: CategoryScore[];
  businessName: string;
  businessType: string;
}

// Maps answer text to a score 0–100 for each question
function scoreAnswer(questionId: string, answer: string): number {
  const maps: Record<string, Record<string, number>> = {
    profile_complete: {
      "Yes, everything is complete": 100,
      "Mostly — missing 1–2 fields": 70,
      "Partially — several fields empty": 35,
      "I'm not sure": 40,
    },
    photos: {
      "50+ photos (with logo and cover)": 100,
      "20–49 photos": 75,
      "5–19 photos": 45,
      "Less than 5 photos": 20,
      "No photos": 0,
    },
    reviews: {
      "100+ reviews, 4.5+ stars": 100,
      "50–99 reviews, 4.0+ stars": 80,
      "20–49 reviews, 3.5+ stars": 55,
      "Less than 20 reviews": 30,
      "No reviews yet": 0,
    },
    review_responses: {
      "Yes, to all reviews (positive & negative)": 100,
      "Yes, mostly to negative ones": 70,
      "Sometimes": 40,
      "Rarely or never": 10,
    },
    posts: {
      "Weekly or more": 100,
      "1–2 times per month": 70,
      "Occasionally (every few months)": 30,
      "Never posted": 0,
    },
    description: {
      "Yes, it's keyword-optimized and detailed (500+ chars)": 100,
      "It's decent but could be better": 60,
      "It's very short or generic": 25,
      "I don't have a description": 0,
    },
    hours: {
      "Yes, including special hours and holidays": 100,
      "Regular hours are set, no special hours": 70,
      "Hours are partially set": 35,
      "No hours set": 0,
    },
    qna: {
      "Yes, with pre-seeded questions and answers": 100,
      "Some questions, all answered": 70,
      "Some questions, not all answered": 40,
      "No Q&A activity": 0,
    },
  };

  return maps[questionId]?.[answer] ?? 50;
}

export function calculateScore(answers: AuditAnswers): AuditScore {
  const completeness = scoreAnswer("profile_complete", answers.profile_complete);
  const photos = scoreAnswer("photos", answers.photos);

  // Reviews = average of review count/rating + response rate
  const reviewBase = scoreAnswer("reviews", answers.reviews);
  const reviewResponses = scoreAnswer("review_responses", answers.review_responses);
  const reviews = Math.round(reviewBase * 0.6 + reviewResponses * 0.4);

  const posts = scoreAnswer("posts", answers.posts);
  const description = scoreAnswer("description", answers.description);
  const hours = scoreAnswer("hours", answers.hours);
  const qna = scoreAnswer("qna", answers.qna);

  const categories: CategoryScore[] = [
    { name: "Completeness", score: completeness, weight: 0.25, weightLabel: "25%" },
    { name: "Photos", score: photos, weight: 0.20, weightLabel: "20%" },
    { name: "Reviews", score: reviews, weight: 0.20, weightLabel: "20%" },
    { name: "Posts & Activity", score: posts, weight: 0.15, weightLabel: "15%" },
    { name: "Keywords", score: description, weight: 0.10, weightLabel: "10%" },
    { name: "Hours", score: hours, weight: 0.05, weightLabel: "5%" },
    { name: "Q&A", score: qna, weight: 0.05, weightLabel: "5%" },
  ];

  const overall = Math.round(
    categories.reduce((sum, cat) => sum + cat.score * cat.weight, 0)
  );

  return {
    overall,
    categories,
    businessName: answers.business_name,
    businessType: answers.business_type,
  };
}
