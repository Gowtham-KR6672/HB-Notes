import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { connectToDatabase } from "@/lib/db";
import { NoteModel } from "@/models/note";
import { Share2, Copy, Calendar, Tag } from "lucide-react";
import { CreditCardView } from "@/components/workspace/credit-card-view";

type SharePageProps = {
  params: Promise<{
    shareId: string;
  }>;
};

export default async function SharedNotePage({ params }: SharePageProps) {
  const { shareId } = await params;
  await connectToDatabase();

  const note = await NoteModel.findOne({ shareId, isTrashed: false }).lean();

  if (!note) {
    notFound();
  }

  return (
    <main className="gradient-background min-h-screen flex flex-col">
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-border/10 px-4 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
              <Share2 className="h-4 w-4 text-teal-500" />
            </div>
            <span className="text-sm font-medium text-foreground">Shared Note</span>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-medium hover:bg-teal-500/30 transition-colors"
          >
            <Copy className="h-4 w-4" />
            Copy Link
          </button>
        </div>
      </div>

      <div className="flex-1 pt-20 px-4 pb-8 max-w-4xl mx-auto w-full">
        <article className="glass-panel rounded-[2rem] p-6 md:p-10">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground mb-3">Read-only view</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{note.title}</h1>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
              </div>
              {note.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  {note.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-background/50 text-foreground/80">
                      #{tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && <span>+{note.tags.length - 3}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="prose-preview mt-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({node, inline, className, children, ...props}: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  if (!inline && match && match[1] === 'card') {
                    return <CreditCardView data={String(children).replace(/\n$/, '')} />;
                  }
                  return <code className={className} {...props}>{children}</code>;
                }
              }}
            >
              {note.content}
            </ReactMarkdown>
          </div>

          {/* Attachments */}
          {note.attachments.length ? (
            <div className="mt-8 pt-6 border-t border-border/10">
              <h2 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Attachments
              </h2>
              <div className="space-y-2">
                {note.attachments.map((attachment) => (
                  <a
                    key={attachment.url}
                    href={attachment.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block glass-card rounded-xl px-4 py-3 text-sm hover:-translate-y-0.5 transition-all"
                  >
                    {attachment.originalName}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </article>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Shared with you via HB Notes</p>
        </div>
      </div>
    </main>
  );
}
