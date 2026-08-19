"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { chapters, formatLessonNumber, getChapter, getLessonTags, lessons } from "../data/lessons";

export function CourseExplorer() {
  const [query, setQuery] = useState("");
  const [chapterId, setChapterId] = useState("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return lessons.filter((lesson) => {
      const chapter = getChapter(lesson.id);
      const inChapter = chapterId === "all" || chapter.id === chapterId;
      const haystack = `${lesson.id} ${lesson.title} ${lesson.date} ${getLessonTags(lesson).join(" ")}`.toLowerCase();
      return inChapter && (!normalized || haystack.includes(normalized));
    });
  }, [chapterId, query]);

  return (
    <>
      <section className="course-tools" aria-label="课程检索">
        <label>
          <span>搜索课程</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入课号、标题或概念，例如：分型" />
        </label>
        <div className="chapter-filters" aria-label="课程分组">
          <button className={chapterId === "all" ? "active" : ""} onClick={() => setChapterId("all")}>全部 108 篇</button>
          {chapters.map((chapter) => (
            <button className={chapterId === chapter.id ? "active" : ""} key={chapter.id} onClick={() => setChapterId(chapter.id)}>{chapter.title}</button>
          ))}
        </div>
        <p className="result-count">当前显示 {filtered.length} 篇</p>
      </section>
      <section className="lesson-list" aria-live="polite">
        {filtered.map((lesson) => {
          const chapter = getChapter(lesson.id);
          return (
            <Link className="lesson-row" href={`/courses/${lesson.id}`} key={lesson.id}>
              <span className="lesson-no">{formatLessonNumber(lesson.id)}</span>
              <div><h2>{lesson.title}</h2><p>{getLessonTags(lesson).join(" · ")}</p></div>
              <time dateTime={lesson.date}>{lesson.date}</time>
              <span className="chapter-name">{chapter.title}</span>
              <b aria-hidden="true">→</b>
            </Link>
          );
        })}
        {!filtered.length && <div className="empty-state"><strong>没有找到匹配课程</strong><p>换一个关键词，或切回“全部108篇”。</p></div>}
      </section>
    </>
  );
}
