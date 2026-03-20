const createEmptyImage = () => ({
  url: "",
  publicId: "",
  width: null,
  height: null,
  format: "",
  originalFilename: "",
});

export function createNotebookChapter() {
  return {
    localId: crypto.randomUUID(),
    title: "",
    content: "",
    image: createEmptyImage(),
    uploadStatus: "idle",
    uploadError: "",
  };
}

export function createNotebookForm(notebook = null) {
  const chapters = Array.isArray(notebook?.chapters)
    ? notebook.chapters.map((chapter) => ({
        localId: chapter._id || crypto.randomUUID(),
        title: chapter.title || "",
        content: chapter.content || "",
        image: {
          ...createEmptyImage(),
          ...(chapter.image || {}),
        },
        uploadStatus: "idle",
        uploadError: "",
      }))
    : [];

  return {
    title: notebook?.title || "",
    summary: notebook?.summary || "",
    roadmapStepIds: Array.isArray(notebook?.roadmapStepIds)
      ? [...notebook.roadmapStepIds]
      : [],
    chapters: chapters.length > 0 ? chapters : [createNotebookChapter()],
  };
}

export function buildNotebookPayload(form) {
  return {
    title: form.title,
    summary: form.summary,
    roadmapStepIds: Array.isArray(form.roadmapStepIds)
      ? [...form.roadmapStepIds]
      : [],
    chapters: form.chapters.map((chapter) => ({
      title: chapter.title,
      content: chapter.content,
      image: {
        ...createEmptyImage(),
        ...(chapter.image || {}),
      },
    })),
  };
}

function formatMarkdownImage(chapter) {
  if (!chapter.image?.url) {
    return "";
  }

  const altText = chapter.image.originalFilename || chapter.title || "Notebook image";
  return `![${altText}](${chapter.image.url})`;
}

function slugifyFilename(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function exportNotebookAsMarkdown(notebook) {
  const content = buildNotebookMarkdown(notebook);
  const blob = new Blob([content], {
    type: "text/markdown;charset=utf-8",
  });
  const link = document.createElement("a");
  const filename = slugifyFilename(notebook.title || "mechanic-mindset-notebook");

  link.href = URL.createObjectURL(blob);
  link.download = `${filename || "mechanic-mindset-notebook"}.md`;
  link.click();

  window.setTimeout(() => {
    URL.revokeObjectURL(link.href);
  }, 0);
}

export function buildNotebookMarkdown(notebook) {
  const lines = [`# ${notebook.title || "Untitled Notebook"}`];

  if (notebook.summary) {
    lines.push(notebook.summary);
  }

  notebook.chapters.forEach((chapter, index) => {
    lines.push(`## Chapter ${index + 1}: ${chapter.title || "Untitled Chapter"}`);
    lines.push(chapter.content || "");

    const imageLine = formatMarkdownImage(chapter);

    if (imageLine) {
      lines.push(imageLine);
    }
  });

  return `${lines.join("\n\n").trim()}\n`;
}
