import React, { useState, useEffect } from 'react';
import writeGood from 'write-good';

// Component for individual grammar suggestion
function GrammarSuggestion({ suggestion }) {
  const splitSuggestion = suggestion.split('\n');
  const reason = splitSuggestion.pop();
  const endStrong = reason.indexOf('" ') + 1;

  return (
    <div className="grammar_box">
      {splitSuggestion && (
        <pre className="grammar_suggestion">{splitSuggestion.join('\n')}</pre>
      )}
      <p className="grammar_reason">
        <strong>{reason.substr(0, endStrong)}</strong>
        {reason.slice(endStrong)}
      </p>
    </div>
  );
}

// Builds an array of GrammarSuggestion components from writeGood suggestions
function suggestionContents(suggestions) {
  if (suggestions.length === 0) {
    return (
      <div className="grammar_box">
        <p className="grammar_reason">
          <i style={{ color: 'gold' }} className="fa fa-star"></i>&nbsp;Nice! No possible improvements were found!
        </p>
      </div>
    );
  } else {
    return suggestions.map((suggestion, i) => (
      <GrammarSuggestion suggestion={suggestion} key={`suggestion-${i}`} />
    ));
  }
}

// Component that shows grammar suggestions in place of Rendered in the editor
function CheckGrammar({ toggleGrammar, raw }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const annotatedSuggestions = writeGood.annotate(raw, writeGood(raw));
    setSuggestions(suggestionContents(annotatedSuggestions));
  }, [raw]);

  const creditStyle = {
    marginTop: '-24px',
  };

  return (
    <div className="post-content editor_rendered">
      <h2>Writing Suggestions</h2>
      <p style={creditStyle}>
        Brought to you by{' '}
        <a href="https://github.com/btford/write-good" target="_blank" rel="noopener noreferrer">
          write-good
        </a>
        .
      </p>
      {suggestions}
      <button
        onClick={toggleGrammar}
        className="pb-button grammar_backToPreview"
      >
        Back to Preview
      </button>
    </div>
  );
}

export default CheckGrammar;