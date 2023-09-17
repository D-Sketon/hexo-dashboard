import React, { useEffect, useRef } from 'react';
import api from './api';
import 'codemirror/mode/markdown/markdown';
const CM = require('codemirror/lib/codemirror');

function CodeMirror({ initialValue, onScroll, forceLineNumbers, adminSettings, onChange }) {
  const cmRef = useRef(null);
  const domRef = useRef(null);

  useEffect(() => {
    const editorSettings = {
      value: initialValue || '',
      theme: 'default',
      mode: 'markdown',
      lineWrapping: true,
    };

    for (const key in adminSettings.editor) {
      editorSettings[key] = adminSettings.editor[key];
    }
    cmRef.current = CM(domRef.current, editorSettings);

    cmRef.current.on('change', (cm) => {
      onChange(cm.getValue());
    });

    cmRef.current.on('scroll', (cm) => {
      const node = cm.getScrollerElement();
      const max = node.scrollHeight - node.getBoundingClientRect().height;
      onScroll(node.scrollTop / max);
    });

    const box = domRef.current.parentNode.getBoundingClientRect();
    cmRef.current.setSize(box.width, box.height - 32);

    window.addEventListener('resize', handleResize);
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
      window.removeEventListener('resize', handleResize);
    };
  }, [])

  useEffect(() => {
    cmRef.current.setValue(initialValue)
  }, [initialValue]);

  useEffect(() => {
    if (!(adminSettings.editor || {}).lineNumbers) {
      cmRef.current.setOption('lineNumbers', forceLineNumbers);
    }
  }, [forceLineNumbers])

  const handleResize = () => {
    const box = domRef.current.parentNode.getBoundingClientRect();
    cmRef.current.setSize(box.width, box.height - 32);
  };

  const handlePaste = (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    if (!items.length) return;
    let blob;
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].kind === 'file') {
        blob = items[i].getAsFile();
        break;
      }
    }
    if (!blob) return;

    const settings = adminSettings;
    const reader = new FileReader();
    reader.onload = (event) => {
      let filename = null;
      if (settings.options) {
        if (!!settings.options.askImageFilename) {
          const filePath = !!settings.options.imagePath ? settings.options.imagePath : '/images';
          filename = prompt(`What would you like to name the photo? All files saved as pngs. Name will be relative to ${filePath}.`, 'image.png');
        }
      }
      console.log(filename);
      api.uploadImage(event.target.result, filename).then((res) =>
        cmRef.current.replaceSelection(`\n![${res.msg}](${res.src})`)
      );
    };
    reader.readAsDataURL(blob);
  };

  return <div ref={domRef} />;
}

export default CodeMirror;