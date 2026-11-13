import React from 'react';
import katex from 'katex';

interface MathMarkdownRendererProps {
  content: string;
}

export const MathMarkdownRenderer: React.FC<MathMarkdownRendererProps> = ({ content }) => {
  const lines = content.split('\n');

  const renderMathString = (text: string) => {
    const parts = text.split(/(\$[^\$]+\$)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
        const mathExpr = part.slice(1, -1);
        try {
          const html = katex.renderToString(mathExpr, { throwOnError: false, displayMode: false });
          return (
            <span
              key={idx}
              dangerouslySetInnerHTML={{ __html: html }}
              className="inline-block mx-0.5 text-slate-900"
            />
          );
        } catch {
          return (
            <span key={idx} className="font-mono text-blue-700">
              {part}
            </span>
          );
        }
      }

      const boldParts = part.split(/(\*\*[^\*]+\*\*)/g);
      return boldParts.map((bPart, bIdx) => {
        if (bPart.startsWith('**') && bPart.endsWith('**')) {
          return (
            <strong key={`${idx}-${bIdx}`} className="font-bold text-slate-900">
              {bPart.slice(2, -2)}
            </strong>
          );
        }
        return bPart;
      });
    });
  };

  const elements: React.ReactNode[] = [];
  let inBlockMath = false;
  let blockMathBuffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('$$') && line.endsWith('$$') && line.length > 4) {
      const mathExpr = line.slice(2, -2);
      try {
        const html = katex.renderToString(mathExpr, { throwOnError: false, displayMode: true });
        elements.push(
          <div
            key={i}
            className="my-4 py-3 px-4 bg-slate-50 rounded-xl text-center overflow-x-auto text-slate-900 border border-slate-200"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch {
        elements.push(
          <div key={i} className="my-2 font-mono text-blue-700">
            {mathExpr}
          </div>
        );
      }
      continue;
    }

    if (line.startsWith('$$')) {
      inBlockMath = true;
      blockMathBuffer = [line.slice(2)];
      continue;
    }

    if (inBlockMath) {
      if (line.endsWith('$$')) {
        blockMathBuffer.push(line.slice(0, -2));
        const fullExpr = blockMathBuffer.join('\n');
        try {
          const html = katex.renderToString(fullExpr, { throwOnError: false, displayMode: true });
          elements.push(
            <div
              key={i}
              className="my-4 py-3 px-4 bg-slate-50 rounded-xl text-center overflow-x-auto text-slate-900 border border-slate-200"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          elements.push(
            <div key={i} className="my-2 font-mono text-blue-700">
              {fullExpr}
            </div>
          );
        }
        inBlockMath = false;
        blockMathBuffer = [];
      } else {
        blockMathBuffer.push(line);
      }
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h3
          key={i}
          className="text-base font-bold text-slate-900 mt-5 mb-2.5 pb-1.5 border-b border-slate-200"
        >
          {renderMathString(line.slice(4))}
        </h3>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-lg font-bold text-slate-900 mt-6 mb-2.5">
          {renderMathString(line.slice(3))}
        </h2>
      );
    } else if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} className="text-xl font-extrabold text-slate-900 mt-6 mb-3">
          {renderMathString(line.slice(2))}
        </h1>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <li key={i} className="ml-5 list-disc text-slate-700 text-base my-1.5 leading-relaxed">
          {renderMathString(line.slice(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(line)) {
      const content = line.replace(/^\d+\.\s/, '');
      elements.push(
        <div
          key={i}
          className="flex items-start gap-2.5 text-slate-700 text-base my-1.5 leading-relaxed"
        >
          <span className="font-semibold text-blue-600 font-mono tabular-nums min-w-[22px]">
            {line.match(/^\d+\./)![0]}
          </span>
          <div className="flex-1">{renderMathString(content)}</div>
        </div>
      );
    } else if (line === '') {
      elements.push(<div key={i} className="h-2" />);
    } else {
      elements.push(
        <p key={i} className="text-slate-700 text-base my-1.5 leading-relaxed">
          {renderMathString(line)}
        </p>
      );
    }
  }

  return <div className="space-y-1">{elements}</div>;
};
