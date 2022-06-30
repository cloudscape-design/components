// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { KeyCode } from '../../internal/keycode';
import CodeEditor from '../../../lib/components/code-editor';
import {
  aceMock,
  editorMock,
  defaultProps,
  renderCodeEditor,
  annotationCallback as emulateAceAnnotationEvent,
} from './util';
import { ElementWrapper } from '../../../lib/components/test-utils/dom';
import styles from '../../../lib/components/code-editor/styles.css.js';
import { warnOnce } from '../../../lib/components/internal/logging';

jest.mock('../../../lib/components/internal/logging', () => ({
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

describe('Code editor component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays loading screen', () => {
    const { wrapper } = renderCodeEditor({ loading: true });
    expect(wrapper.findLoadingScreen()).toBeDefined();
    expect(wrapper.findLoadingScreen()!.getElement()).toHaveTextContent('Loading code editor');
  });

  it('displays error screen', () => {
    const { wrapper } = renderCodeEditor({ ace: null, loading: false });
    expect(wrapper.findErrorScreen()).toBeDefined();
    expect(wrapper.findErrorScreen()!.getElement()).toHaveTextContent(
      'There was an error loading the code editor. Retry'
    );
  });

  it('bootstraps editor', () => {
    renderCodeEditor();

    expect(aceMock.edit).toHaveBeenCalled();
    expect(editorMock.setValue).toHaveBeenCalledWith('const pi = 3.14;', -1); // -1 is hardcoded
    expect(editorMock.session.setMode).toHaveBeenLastCalledWith('ace/mode/javascript');
    expect(editorMock.setTheme).toHaveBeenLastCalledWith('ace/theme/dawn');
  });

  it('detects the dark mode if present', () => {
    render(
      <div className="awsui-polaris-dark-mode">
        <CodeEditor {...defaultProps} />
      </div>
    );
    expect(editorMock.setTheme).toHaveBeenLastCalledWith('ace/theme/tomorrow_night_bright');
  });

  it('detects alternative dark mode class', () => {
    render(
      <div className="awsui-dark-mode">
        <CodeEditor {...defaultProps} />
      </div>
    );
    expect(editorMock.setTheme).toHaveBeenLastCalledWith('ace/theme/tomorrow_night_bright');
  });

  it('does not detect dark mode on non-parent elements', () => {
    render(
      <div>
        <div className="awsui-polaris-dark-mode"></div>
        <CodeEditor {...defaultProps} />
      </div>
    );
    expect(editorMock.setTheme).toHaveBeenLastCalledWith('ace/theme/dawn');
  });

  it('cleans up', () => {
    const { unmount } = renderCodeEditor();
    unmount();
    expect(editorMock.destroy).toHaveBeenCalled();
  });

  it('changes language', () => {
    const { rerender } = renderCodeEditor({ language: 'ruby' });

    expect(editorMock.session.setMode).toHaveBeenCalledWith('ace/mode/ruby');

    rerender(<CodeEditor {...defaultProps} language="python" />);

    expect(editorMock.session.setMode).toHaveBeenCalledWith('ace/mode/python');
  });

  it('uses language label', () => {
    const { wrapper } = renderCodeEditor();
    expect(wrapper.findStatusBar()!.getElement()).toHaveTextContent('JavaScript');
  });

  it('changes value', () => {
    const { rerender } = renderCodeEditor({ value: 'value-initial' });

    expect(editorMock.setValue).toHaveBeenCalledWith('value-initial', -1);

    rerender(<CodeEditor {...defaultProps} value="value-final" />);

    expect(editorMock.setValue).toHaveBeenCalledWith('value-final', -1);
  });

  it('sets value with test-util', () => {
    const ace = jest.requireActual('ace-builds');
    const { wrapper } = renderCodeEditor({ ace, value: 'value-initial' });
    expect(defaultProps.onChange).not.toHaveBeenCalled();
    act(() => wrapper.setValue('value-final'));
    expect(defaultProps.onChange).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: 'value-final' } }));
  });

  it('fails silently while setting value on loading or error state', () => {
    const { wrapper } = renderCodeEditor({ ace: null, value: 'value-initial' }); // load in error state
    act(() => wrapper.setValue('value-final'));
    expect(defaultProps.onChange).not.toHaveBeenCalled();
  });

  it('changes preferences', () => {
    const { rerender } = renderCodeEditor({ preferences: { theme: 'monokai', wrapLines: false } });

    expect(editorMock.setTheme).toHaveBeenCalledWith('ace/theme/monokai');
    expect(editorMock.session.setUseWrapMode).toHaveBeenCalledWith(false);

    rerender(<CodeEditor {...defaultProps} preferences={{ theme: 'dracula', wrapLines: true }} />);

    expect(editorMock.setTheme).toHaveBeenCalledWith('ace/theme/dracula');
    expect(editorMock.session.setUseWrapMode).toHaveBeenCalledWith(true);
  });

  it('fires onChange', () => {
    let callback: () => void;
    editorMock.on = jest.fn((name: string, _callback: () => void) => {
      if (name === 'change') {
        callback = _callback;
      }
    });

    editorMock.getValue.mockReturnValue('some new value');

    renderCodeEditor();

    act(() => callback!()); // emulate change trigger

    expect((defaultProps.onChange as any).mock.calls[0][0].detail).toEqual(
      expect.objectContaining({ value: 'some new value' })
    );

    editorMock.on.mockRestore();
  });

  describe('onDelayedChange', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());
    it('fires asynchronously when the value is changed', () => {
      const handleDelayedChange = jest.fn();
      let callback: () => void;
      editorMock.on = jest.fn((name: string, _callback: () => void) => {
        if (name === 'change') {
          callback = _callback;
        }
      });
      editorMock.getValue.mockReturnValue('some new value');
      renderCodeEditor({ onDelayedChange: handleDelayedChange });
      act(() => callback!()); // emulate change trigger
      jest.runOnlyPendingTimers();
      expect(handleDelayedChange.mock.calls[0][0].detail).toEqual(expect.objectContaining({ value: 'some new value' }));
      editorMock.on.mockRestore();
    });
  });

  it('fires onValidate', () => {
    const annotation = {};

    renderCodeEditor();

    (defaultProps.onValidate as any).mockClear();

    editorMock.session.getAnnotations.mockReturnValue([annotation]);
    act(() => emulateAceAnnotationEvent!());
    expect((defaultProps.onValidate as any).mock.calls[0][0].detail.annotations).toEqual(
      expect.arrayContaining([annotation])
    );
  });

  it('fires onValidate when there are no annotations', () => {
    renderCodeEditor();

    (defaultProps.onValidate as any).mockClear();

    // also fire when there are no longer annotations
    editorMock.session.getAnnotations.mockReturnValueOnce([]);
    act(() => emulateAceAnnotationEvent!());
    expect((defaultProps.onValidate as any).mock.calls[0][0].detail.annotations).toEqual([]);
  });

  it('clears annotations on change when value is empty', () => {
    const changeCallbacks: (() => void)[] = [];
    editorMock.on = jest.fn((name: string, _callback: () => void) => {
      if (name === 'change') {
        changeCallbacks.push(_callback);
      }
    });

    renderCodeEditor();

    editorMock.getValue.mockReturnValueOnce('some value');
    act(() => changeCallbacks.forEach(c => c()));
    expect(editorMock.session.clearAnnotations).not.toHaveBeenCalled();

    editorMock.getValue.mockReturnValueOnce('');
    act(() => changeCallbacks.forEach(c => c()));
    expect(editorMock.session.clearAnnotations).toHaveBeenCalledTimes(1);

    editorMock.on.mockRestore();
  });

  it('disables errors and warnings tab when no annotations', () => {
    const { wrapper } = renderCodeEditor();
    expect(wrapper.findErrorsTab()!.getElement().getAttribute('disabled')).not.toBeNull();
    expect(wrapper.findWarningsTab()!.getElement().getAttribute('disabled')).not.toBeNull();
  });

  it('enables error tab when annotations', () => {
    editorMock.session.getAnnotations.mockReturnValueOnce([{ type: 'error' }]);

    const { wrapper } = renderCodeEditor();

    act(() => emulateAceAnnotationEvent!());

    expect(wrapper.findErrorsTab()!.getElement().getAttribute('disabled')).toBeNull();
  });

  it('displays pane when valid and clicking', () => {
    editorMock.session.getAnnotations.mockReturnValueOnce([{ type: 'error' }]);
    const { wrapper } = renderCodeEditor();
    act(() => emulateAceAnnotationEvent!());

    wrapper.findErrorsTab()!.click();

    expect(wrapper.findPane()).not.toBeNull();
  });

  function findPaneItems(wrapper: ElementWrapper) {
    return wrapper.findAll(`.${styles.pane__item}`);
  }
  function findBox(wrapper: ElementWrapper) {
    return wrapper.findAll(`.react-resizable`);
  }

  it('displays annotation content', () => {
    editorMock.session.getAnnotations.mockReturnValueOnce([{ type: 'error', row: 0, column: 0, text: 'error text' }]);
    const { wrapper } = renderCodeEditor();
    act(() => emulateAceAnnotationEvent!());

    wrapper.findErrorsTab()!.click();

    const [item] = findPaneItems(wrapper.findPane()!);

    expect(item.getElement().textContent).toEqual(expect.stringContaining('error text'));
    expect(item.getElement().textContent).toEqual(expect.stringContaining('Ln 1, Col 1'));
  });

  it('moves cursor to annotation when clicked', () => {
    editorMock.session.getAnnotations.mockReturnValueOnce([{ type: 'error', row: 1, column: 1 }]);
    const { wrapper } = renderCodeEditor();
    act(() => emulateAceAnnotationEvent!());

    wrapper.findErrorsTab()!.click();
    const [item] = findPaneItems(wrapper.findPane()!);
    item.click();

    expect(editorMock.focus).toHaveBeenCalledTimes(1);
    expect(editorMock.gotoLine).toHaveBeenCalledWith(2, 1, false);
  });

  it('moves cursor to annotation when Enter', () => {
    editorMock.session.getAnnotations.mockReturnValueOnce([{ type: 'error', row: 1, column: 1 }]);
    const { wrapper } = renderCodeEditor();
    act(() => emulateAceAnnotationEvent!());

    wrapper.findErrorsTab()!.click();
    const [item] = findPaneItems(wrapper.findPane()!);

    fireEvent.keyDown(item.getElement(), { keyCode: KeyCode.enter });

    expect(editorMock.focus).toHaveBeenCalledTimes(1);
    expect(editorMock.gotoLine).toHaveBeenCalledWith(2, 1, false);
  });

  it('closes the Pane on ESC', () => {
    editorMock.session.getAnnotations.mockReturnValueOnce([{ type: 'error' }]);
    const { wrapper } = renderCodeEditor();
    act(() => emulateAceAnnotationEvent!());

    wrapper.findErrorsTab()!.click();

    fireEvent.keyDown(wrapper.findPane()!.getElement(), { keyCode: KeyCode.escape });

    expect(wrapper.findPane()).toBeNull();
  });

  it('highlights annotation when clicked in gutter', () => {
    let gutterClickCallback: (event: any) => void;
    editorMock.on = jest.fn((name: string, _callback: (event: any) => void) => {
      if (name === 'gutterclick') {
        gutterClickCallback = _callback;
      }
    });
    editorMock.session.getAnnotations.mockReturnValue([{ type: 'error', row: 1, column: 1 }]);
    const { wrapper } = renderCodeEditor();

    act(() => {
      emulateAceAnnotationEvent!();
      gutterClickCallback!({ getDocumentPosition: () => ({ row: 1 }) }); // emulate gutter click
    });

    expect(wrapper.findPane()).not.toBeNull(); // Pane should open

    const [item] = findPaneItems(wrapper as any);
    expect(item.getElement().classList).toContain(styles['pane__item--highlighted']);

    editorMock.on.mockRestore();
  });

  it('displays settings button', () => {
    const { wrapper } = renderCodeEditor();
    expect(wrapper.findSettingsButton()).not.toBeNull();
  });

  it('set defaults editor size to 480px', () => {
    const { wrapper } = renderCodeEditor();
    const [item] = findBox(wrapper as any);
    expect(item.getElement().style.height).toEqual('480px');
  });

  it('sets editor size to the specified editorHeight property', () => {
    const { wrapper } = renderCodeEditor({ editorContentHeight: 240 });
    const [item] = findBox(wrapper as any);
    expect(item.getElement().style.height).toEqual('240px');
  });

  it('sets editor size to 20px if a smaller value are specified', () => {
    const { wrapper } = renderCodeEditor({ editorContentHeight: 10 });
    const [item] = findBox(wrapper as any);
    expect(item.getElement().style.height).toEqual('20px');
  });

  it('calls resize on initial render', () => {
    renderCodeEditor();
    expect(editorMock.resize).toBeCalledTimes(1);
  });
  it('calls resize on initial render when editorHeight is set', () => {
    renderCodeEditor({ editorContentHeight: 240 });
    expect(editorMock.resize).toBeCalledTimes(1);
  });
  it('should log a warning when no onEditorContentResize is undefined', () => {
    render(<CodeEditor {...defaultProps} editorContentHeight={240} />);
    expect(warnOnce).toHaveBeenCalledTimes(1);
    expect(warnOnce).toHaveBeenCalledWith(
      'code-editor',
      'You provided a `editorContentHeight` prop without an `onEditorContentResize` handler. This will render a non-interactive component.'
    );
  });
  it('should not log a warning when onEditorContentResize is passed', () => {
    render(<CodeEditor {...defaultProps} editorContentHeight={240} onEditorContentResize={() => {}} />);
    expect(warnOnce).not.toHaveBeenCalled();
  });
});
