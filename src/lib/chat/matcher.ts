import { LearnedQA } from "@/models/LearnedQA";

export interface MatchResult {
  question: string;
  answer: string;
  similarity: number;
  timesUsed: number;
  source: "learned";
}

export function normalizeQuestion(question: string): string {
  return question
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:]/g, "")
    .replace(/\s+/g, " ")
    .replace(/['']/g, "")
    .replace(/[""]/g, "");
}

export function calculateSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1;
  
  const words1 = new Set(str1.split(" ").filter(w => w.length > 2));
  const words2 = new Set(str2.split(" ").filter(w => w.length > 2));
  
  if (words1.size === 0 || words2.size === 0) return 0;
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

export function extractKeywords(question: string): string[] {
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could", "should",
    "may", "might", "can", "to", "of", "in", "for", "on", "with", "at", "by",
    "from", "as", "or", "and", "but", "if", "not", "what", "how", "when", "where",
    "why", "who", "which", "this", "that", "these", "those", "i", "me", "my",
    "you", "your", "we", "our", "they", "their", "it", "its", "do", "does"
  ]);
  
  return question
    .toLowerCase()
    .replace(/[.,!?;:]/g, "")
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
}

export async function findLearnedMatch(
  question: string,
  threshold: number = 0.6
): Promise<MatchResult | null> {
  try {
    const normalized = normalizeQuestion(question);
    const keywords = extractKeywords(question);
    
    const exact = await LearnedQA.findOne({
      normalizedQuestion: normalized,
      active: true
    }).lean();
    
    if (exact) {
      await LearnedQA.updateOne(
        { _id: exact._id },
        { $inc: { timesUsed: 1 }, $set: { updatedAt: new Date() } }
      );
      return {
        question: exact.question,
        answer: exact.answer,
        similarity: 1,
        timesUsed: (exact.timesUsed || 0) + 1,
        source: "learned"
      };
    }
    
    if (keywords.length > 0) {
      const keywordQueries = keywords.map(k => ({
        keywords: { $regex: k, $options: "i" }
      }));
      
      const similar = await LearnedQA.findOne({
        $and: [
          { active: true },
          { $or: keywordQueries }
        ]
      })
      .sort({ timesUsed: -1, confidence: -1 })
      .lean();
      
      if (similar) {
        const similarity = calculateSimilarity(normalized, similar.normalizedQuestion || "");
        
        if (similarity >= threshold) {
          await LearnedQA.updateOne(
            { _id: similar._id },
            { $inc: { timesUsed: 1 }, $set: { updatedAt: new Date() } }
          );
          return {
            question: similar.question,
            answer: similar.answer,
            similarity,
            timesUsed: (similar.timesUsed || 0) + 1,
            source: "learned"
          };
        }
      }
    }
    
    const allLearned = await LearnedQA.find({ active: true })
      .sort({ confidence: -1, timesUsed: -1 })
      .limit(50)
      .lean();
    
    let bestMatch: typeof allLearned[0] | null = null;
    let bestSimilarity = 0;
    
    for (const learned of allLearned) {
      const similarity = calculateSimilarity(normalized, learned.normalizedQuestion || "");
      if (similarity > bestSimilarity && similarity >= threshold) {
        bestSimilarity = similarity;
        bestMatch = learned;
      }
    }
    
    if (bestMatch) {
      await LearnedQA.updateOne(
        { _id: bestMatch._id },
        { $inc: { timesUsed: 1 }, $set: { updatedAt: new Date() } }
      );
      return {
        question: bestMatch.question,
        answer: bestMatch.answer,
        similarity: bestSimilarity,
        timesUsed: (bestMatch.timesUsed || 0) + 1,
        source: "learned"
      };
    }
    
    return null;
  } catch (error) {
    console.error("CHAT MATCHER: Learned lookup failed:", error);
    return null;
  }
}

export async function saveLearnedAnswer(
  question: string,
  answer: string,
  source: "openrouter" | "manual" = "openrouter"
): Promise<void> {
  try {
    const normalized = normalizeQuestion(question);
    const keywords = extractKeywords(question);
    
    const existing = await LearnedQA.findOne({ normalizedQuestion: normalized });
    
    if (existing) {
      if (answer !== existing.answer) {
        await LearnedQA.updateOne(
          { _id: existing._id },
          { 
            $set: { 
              answer, 
              timesUsed: 1, 
              confidence: 0.8,
              updatedAt: new Date()
            },
            $inc: { timesUsed: 0 }
          }
        );
      }
      return;
    }
    
    await LearnedQA.create({
      question: question.trim(),
      normalizedQuestion: normalized,
      answer,
      keywords,
      source,
      timesUsed: 1,
      confidence: source === "manual" ? 1 : 0.7,
      active: true,
      approved: source === "manual"
    });
  } catch (error) {
    console.error("CHAT MATCHER: Save failed:", error);
  }
}