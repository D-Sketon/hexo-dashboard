import React, { forwardRef } from 'react';

const Rendered = forwardRef(({ text }, ref) => {
  return (
    <div
      className="post-content editor_rendered"
      dangerouslySetInnerHTML={{
        __html: text || '<h1 class="editor_no-content">There doesn\'t seem to be anything here</h1>',
      }}
      ref={ref}
    />
  );
})

export default Rendered;