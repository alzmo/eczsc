import replyData from "./author-replies.json";

export type AuthorReply = {
  id: string;
  lessonId: number;
  sequence: number;
  publishedAt: string;
  questionExcerpt: string;
  answerExcerpt: string;
  replyCharacterCount: number;
  replySha256: string;
  isTechnical: boolean;
  verification: string;
};

export const authorReplies = replyData.records as AuthorReply[];

export const replySummary = {
  total: authorReplies.length,
  technical: authorReplies.filter((reply) => reply.isTechnical).length,
  lessons: new Set(authorReplies.map((reply) => reply.lessonId)).size,
  verificationRule: replyData.verificationRule,
};

export function getRepliesForLesson(lessonId: number) {
  return authorReplies.filter((reply) => reply.lessonId === lessonId);
}
