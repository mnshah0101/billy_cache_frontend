import { useState } from "react";

function QueryCell({ sqlQuery }) {
  const [expanded, setExpanded] = useState(false);

  const maxLength = 100; // Adjust the character limit as needed

  // Determine whether to show the truncated or full query
  const displayQuery = expanded
    ? sqlQuery
    : sqlQuery.length > maxLength
    ? sqlQuery.slice(0, maxLength) + "..."
    : sqlQuery;

  return (
    <div>
      <pre className="whitespace-pre-wrap">{displayQuery}</pre>
      {sqlQuery.length > maxLength && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-white underline text-sm mt-1"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

export default QueryCell;
