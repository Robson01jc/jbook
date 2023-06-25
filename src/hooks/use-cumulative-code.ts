import { useTypedSelector } from './use-typed-selector';

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((cellId) => data[cellId]);

    const showFunc = `
      import _React from 'react';
      import _ReactDOM from 'react-dom';

      var show = (value) => {
        const root = document.querySelector('#root');

        if (typeof value === 'object') {
          if (value.$$typeof && value.props) {
            _ReactDOM.render(value, root);
          } else {
            root.innerHTML = JSON.stringify(value);
          }
        } else {
          root.innerHTML = value;
        }
      };
    `;
    const showFuncNoop = 'var show = () => {};';

    const cumulativeCode = orderedCells
      .slice(0, order.indexOf(cellId) + 1)
      .filter((cell) => cell.type === 'code')
      .flatMap((cell) => {
        if (cell.id !== cellId) {
          return [showFuncNoop, cell.content];
        }

        return [showFunc, cell.content];
      });

    return cumulativeCode;
  }).join('\n');
};
