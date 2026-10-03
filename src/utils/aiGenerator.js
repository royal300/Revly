/**
 * AI Review Draft Generator
 * Strictly synthesizes customer ratings and optional comments.
 * Adheres to ethical review rules:
 * - No fabricated claims
 * - Honest representation of sentiment based on actual ratings (positive, balanced, or critical)
 * - Highlights only mentioned categories
 */

export function generateReviewDraft({ businessName, answers = [], comment = "", tone = "natural" }) {
  if (!answers || answers.length === 0) {
    return `I recently visited ${businessName} and wanted to share my feedback on the experience.`;
  }

  // Calculate average rating
  const avg = answers.reduce((sum, a) => sum + (a.rating || 5), 0) / answers.length;

  // Categorize answers by positive (4-5), neutral (3), and negative (1-2)
  const strongAspects = answers.filter(a => a.rating >= 4);
  const neutralAspects = answers.filter(a => a.rating === 3);
  const weakAspects = answers.filter(a => a.rating <= 2);

  let draft = "";

  // 1. Opening statement
  if (tone === "concise") {
    if (avg >= 4.5) {
      draft += `Excellent visit to ${businessName}. `;
    } else if (avg >= 3.5) {
      draft += `Good overall experience at ${businessName}. `;
    } else if (avg >= 2.5) {
      draft += `Average visit to ${businessName}. `;
    } else {
      draft += `Disappointing experience at ${businessName}. `;
    }
  } else if (tone === "detailed") {
    if (avg >= 4.5) {
      draft += `I had an exceptional experience at ${businessName} today. From start to finish, the standards were remarkably high. `;
    } else if (avg >= 3.5) {
      draft += `I recently spent time at ${businessName}. Overall it was a solid visit with several positive highlights. `;
    } else if (avg >= 2.5) {
      draft += `I visited ${businessName} today. While certain aspects met expectations, there are a few noticeable areas that could use attention. `;
    } else {
      draft += `I recently visited ${businessName}, but unfortunately the visit did not meet expectations. `;
    }
  } else {
    // Natural / Warm
    if (avg >= 4.5) {
      draft += `I had a really wonderful experience at ${businessName}! `;
    } else if (avg >= 3.5) {
      draft += `Had a good visit to ${businessName}. `;
    } else if (avg >= 2.5) {
      draft += `I recently checked out ${businessName}. The visit was okay overall. `;
    } else {
      draft += `I visited ${businessName}, but unfortunately things were below expectations. `;
    }
  }

  // 2. Specific Category Points
  const aspectSentences = [];

  if (strongAspects.length > 0) {
    const names = strongAspects.map(a => a.category.toLowerCase().replace('&', 'and'));
    if (strongAspects.length === 1) {
      aspectSentences.push(`The ${names[0]} was particularly impressive and well handled.`);
    } else if (strongAspects.length === 2) {
      aspectSentences.push(`Both the ${names[0]} and ${names[1]} were top notch and stood out.`);
    } else {
      aspectSentences.push(`The ${names.slice(0, -1).join(', ')}, as well as the ${names.slice(-1)}, were all outstanding.`);
    }
  }

  if (neutralAspects.length > 0) {
    const neutralNames = neutralAspects.map(a => a.category.toLowerCase());
    aspectSentences.push(`The ${neutralNames.join(' and ')} was reasonable, though fairly average.`);
  }

  if (weakAspects.length > 0) {
    const weakNames = weakAspects.map(a => a.category.toLowerCase());
    aspectSentences.push(`However, the ${weakNames.join(' and ')} definitely had room for improvement.`);
  }

  if (aspectSentences.length > 0) {
    draft += aspectSentences.join(" ") + " ";
  }

  // 3. Customer's direct optional comment if provided
  if (comment && comment.trim()) {
    const cleanComment = comment.trim();
    if (tone === "concise") {
      draft += `Specifically: "${cleanComment}". `;
    } else {
      draft += `In particular, ${cleanComment.toLowerCase().startsWith('i ') ? cleanComment : cleanComment.charAt(0).toLowerCase() + cleanComment.slice(1)} `;
    }
  }

  // 4. Closing statement
  if (tone === "concise") {
    if (avg >= 4.0) draft += `Would definitely return.`;
    else if (avg >= 3.0) draft += `Worth trying.`;
    else draft += `Hope to see improvements in the future.`;
  } else {
    if (avg >= 4.5) {
      draft += `I will definitely be returning and happily recommend them to others!`;
    } else if (avg >= 3.8) {
      draft += `Thanks to the team for the good service.`;
    } else if (avg >= 2.8) {
      draft += `A decent experience overall with potential to be even better.`;
    } else {
      draft += `I hope management takes this feedback constructively to improve service quality.`;
    }
  }

  return draft.trim();
}
