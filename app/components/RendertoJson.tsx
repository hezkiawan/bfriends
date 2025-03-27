export function RenderToJson({ data }: { data: any }) {
  if (!data) return null;

  const renderNode = (node: any, index: number) => {
    if (!node) return null;

    switch (node.type) {
      case "doc":
        return (
          <div key={index}>
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </div>
        );
      case "paragraph":
        return (
          <p key={index}>
            {node.content?.map((child: any, i: number) => renderNode(child, i))}
          </p>
        );
      case "text":
        return <span key={index}>{node.text}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="px-2 prose dark:prose-invert break-words">
      {renderNode(data, 0)}
    </div>
  );
}
