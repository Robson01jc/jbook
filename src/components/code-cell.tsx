import React, { useEffect } from 'react';
import { useActions } from '../hooks/use-actions';
import { useCumulativeCode } from '../hooks/use-cumulative-code';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { Cell } from '../state';
import './code-cell.css';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell, createBundle } = useActions();
  const bundle = useTypedSelector(({ bundles }) => {
    return bundles[cell.id];
  });
  const isBundleFound = !!bundle;
  const cumulativeCode = useCumulativeCode(cell.id);

  useEffect(() => {
    if (!isBundleFound) {
      createBundle(cell.id, cumulativeCode);

      return;
    }

    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [cumulativeCode, cell.id, createBundle, isBundleFound]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            onChange={(value) => updateCell(cell.id, value)}
          />
        </Resizable>
        <div className="progress-wrapper">
          {!bundle || bundle.loading ? (
            <div className="progress-cover">
              <progress className="progress is-small is-primary" max="100">
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
