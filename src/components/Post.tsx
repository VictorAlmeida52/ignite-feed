import { format, formatDistanceToNow } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import { Avatar } from "./Avatar";
import { Comment as PostComment } from "./Comment";

import styles from "./Post.module.css";
import { useState } from "react";

import uuid from "react-uuid";

type PostContent = {
  type: "paragraph" | "link";
  content: string;
};

export type PostProps = {
  id?: number;
  author: {
    name: string;
    avatarUrl: string;
    role: string;
  };
  publishedAt: Date;
  content: PostContent[];
};

export type PostComment = {
  id: string;
  content: string;
};

export function Post({ author, publishedAt, content }: PostProps) {
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newCommentText, setNewCommentText] = useState("");

  const publishedDateFormatted = format(
    publishedAt,
    "d 'de' LLLL 'às' HH:mm'h'",
    {
      locale: ptBR,
    }
  );

  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true,
  });

  function handleCreateNewComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setComments([...comments, { id: uuid(), content: newCommentText }]);
    setNewCommentText("");
  }

  function handleNewCommentChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setNewCommentText(event.currentTarget.value);
  }

  function deleteComment(comment: PostComment) {
    setComments(comments.filter((c) => c.id !== comment.id));
  }

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>

        <time
          title={publishedDateFormatted}
          dateTime={publishedAt.toISOString()}
        >
          {publishedDateRelativeToNow}
        </time>
      </header>

      <div className={styles.content}>
        {content.map((line) => {
          switch (line.type) {
            case "paragraph":
              return <p key={line.content}>{line.content}</p>;
            case "link":
              return (
                <p key={line.content}>
                  <a href="">{line.content}</a>
                </p>
              );
            default:
              return null;
          }
        })}
      </div>

      <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
        <strong>Deixe seu feedback</strong>
        <textarea
          name="comment"
          placeholder="Deixe um comentário"
          value={newCommentText}
          onChange={handleNewCommentChange}
        />

        <footer>
          <button type="submit">Publicar</button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map((comment) => (
          <PostComment
            key={comment.id}
            comment={comment}
            onDeleteComment={deleteComment}
          />
        ))}
      </div>
    </article>
  );
}
