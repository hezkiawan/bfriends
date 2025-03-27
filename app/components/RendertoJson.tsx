type JsonNode = {
  type?: string;
  content?: JsonNode[];
  text?: string;
};

const isValidNode = (node: any): node is JsonNode => {
  return (
    node &&
    (node.type === "doc" ||
      node.type === "paragraph" ||
      node.type === "text" ||
      node.type === undefined)
  );
};

export function RenderToJson({ data }: { data: JsonNode }) {
  if (!data || !isValidNode(data)) return null;

  const renderNode = (node: JsonNode, index: number): JSX.Element | null => {
    if (!node || !isValidNode(node)) return null;

    switch (node.type) {
      case "doc":
        return (
          <div key={index}>
            {node.content?.map((child, i) => renderNode(child, i))}
          </div>
        );
      case "paragraph":
        return (
          <p key={index}>
            {node.content?.map((child, i) => renderNode(child, i))}
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
