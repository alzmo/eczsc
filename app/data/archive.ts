import archiveData from "./archive-records.json";

export type ArchiveRecord = {
  id: number;
  archiveTitle: string;
  archivedPublicationTime: string;
  articleCharacterCount: number;
  articleSha256: string;
  articleImageCount: number;
  commentCount: number;
  authorReplyCount: number;
  savedImages: string[];
  archiveStatus: string;
};

export const archiveRecords = archiveData.records as ArchiveRecord[];

export const archiveSummary = {
  lessonCoverage: archiveData.lessonCoverage,
  comments: archiveRecords.reduce((sum, record) => sum + record.commentCount, 0),
  authorReplies: archiveRecords.reduce((sum, record) => sum + record.authorReplyCount, 0),
  images: archiveRecords.reduce((sum, record) => sum + record.articleImageCount, 0),
  sourceDescription: archiveData.sourceDescription,
};

export function getArchiveRecord(id: number) {
  return archiveRecords.find((record) => record.id === id);
}
