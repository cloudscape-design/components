// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { KeyCode } from '../../internal/keycode';
import CodeEditor, { CodeEditorProps } from '../../../lib/components/code-editor';
import {
  aceMock,
  editorMock,
  defaultProps,
  renderCodeEditor,
  annotationCallback as emulateAceAnnotationEvent,
} from './util';
import { CodeEditorWrapper, ElementWrapper } from '../../../lib/components/test-utils/dom';
import styles from '../../../lib/components/code-editor/styles.css.js';
import resizableStyles from '../../../lib/components/code-editor/resizable-box/styles.css.js';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import liveRegionStyles from '../../../lib/components/internal/components/live-region/styles.css.js';
import { createWrapper } from '@cloudscape-design/test-utils-core/dom';
import '../../__a11y__/to-validate-a11y';
import TestI18nProvider from '../../../lib/components/internal/i18n/testing';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
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

  it('allows programmatically to be focused', () => {
    const ref = React.createRef<CodeEditorProps.Ref>();
    const { wrapper } = renderCodeEditor({}, ref);
    ref.current!.focus();
    expect(wrapper.findEditor()?.getElement()).toHaveFocus();
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

  it('uses custom language label over the default label', () => {
    const { wrapper } = renderCodeEditor({ languageLabel: 'PartiQL' });
    expect(wrapper.findStatusBar()!.getElement()).toHaveTextContent('PartiQL');
  });

  it('allows providing a custom language', () => {
    renderCodeEditor({ language: 'partiql' });
    expect(editorMock.session.setMode).toHaveBeenCalledWith('ace/mode/partiql');
  });

  it('uses custom language with custom label', () => {
    const { wrapper } = renderCodeEditor({ languageLabel: 'PartiQL', language: 'partiql' });
    expect(editorMock.session.setMode).toHaveBeenCalledWith('ace/mode/partiql');
    expect(wrapper.findStatusBar()!.getElement()).toHaveTextContent('PartiQL');
  });

  it('falls back to language name if a custom language is used without languageLabel', () => {
    const { wrapper } = renderCodeEditor({ language: 'partiql' });
    expect(editorMock.session.setMode).not.toHaveBeenCalledWith('ace/mode/javascript');
    expect(editorMock.session.setMode).toHaveBeenCalledWith('ace/mode/partiql');
    expect(wrapper.findStatusBar()!.getElement()).toHaveTextContent('partiql');
  });

  it("uses custom label even if a language isn't provided", () => {
    const { wrapper } = renderCodeEditor({ language: undefined, languageLabel: 'PartiQL' });
    expect(editorMock.session.setMode).toHaveBeenCalledWith('ace/mode/undefined');
    expect(wrapper.findStatusBar()!.getElement()).toHaveTextContent('PartiQL');
  });

  /**
   * Undefined language should run the component anyway even when bypassing language requirements,
   * When that happens, Ace handles the missing language error
   * renderCodeEditor uses Partial<CodeEditorProps>, no casting needed here
   */
  it('allows unidentified language without breaking', () => {
    const { wrapper } = renderCodeEditor({ language: undefined });
    expect(editorMock.session.setMode).toHaveBeenCalledWith('ace/mode/undefined');
    expect(wrapper.findStatusBar()!.getElement()).not.toHaveTextContent('undefined');
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

  it('provides ariaLabel to the underlying textarea', () => {
    renderCodeEditor({ ariaLabel: 'test aria label' });
    expect(editorMock.renderer.textarea).toHaveAttribute('aria-label', 'test aria label');
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
  function findBox(wrapper: CodeEditorWrapper) {
    return wrapper.findByClassName(resizableStyles['resizable-box'])!;
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

  it('sends annotation text to LiveRegion Component for a11y announcement', () => {
    editorMock.session.getAnnotations.mockReturnValueOnce([{ type: 'error', row: 0, column: 0, text: 'error text' }]);
    const { wrapper } = renderCodeEditor();
    act(() => emulateAceAnnotationEvent!());

    const liveRegion = wrapper.findStatusBar()?.find(`.${liveRegionStyles.root}`)?.getElement().innerHTML;

    expect(liveRegion).toContain(defaultProps.i18nStrings!.errorsTab);
    expect(liveRegion).toContain(defaultProps.i18nStrings!.warningsTab);
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

  it('does not submit a parent `form` when clicking errors', () => {
    editorMock.session.getAnnotations.mockReturnValueOnce([{ type: 'error' }]);

    const onSubmit = jest.fn((e: React.FormEvent<HTMLFormElement>) => {
      // JSDOM doesn't support form submissions, so we need to call preventDefault.
      e.preventDefault();
      // jest.fn accesses the event multiple times to print invocation logs on failure.
      e.persist();
    });

    const { container } = render(
      <form data-testid="form" onSubmit={onSubmit}>
        <CodeEditor {...defaultProps} />
      </form>
    );
    const wrapper = createWrapper(container).findCodeEditor()!;

    act(() => emulateAceAnnotationEvent!());

    wrapper.findErrorsTab()!.click();

    expect(onSubmit).not.toBeCalled();
  });

  it('closes the Pane on ESC', () => {
    editorMock.session.getAnnotations.mockReturnValueOnce([{ type: 'error' }]);
    const { wrapper } = renderCodeEditor();
    act(() => emulateAceAnnotationEvent!());

    wrapper.findErrorsTab()!.click();

    fireEvent.keyDown(wrapper.findPane()!.getElement(), { keyCode: KeyCode.escape });

    expect(wrapper.findPane()).toBeNull();
  });

  it('focuses annotation when clicked in gutter', () => {
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

    const [item] = findPaneItems(wrapper.findPane()!);
    expect(document.activeElement).toBe(item.getElement());

    editorMock.on.mockRestore();
  });

  it('displays settings button', () => {
    const { wrapper } = renderCodeEditor();
    expect(wrapper.findSettingsButton()).not.toBeNull();
  });

  it('set defaults editor size to 480px', () => {
    const { wrapper } = renderCodeEditor();
    const item = findBox(wrapper);
    expect(item.getElement().style.height).toEqual('480px');
  });

  it('sets editor size to the specified editorHeight property', () => {
    const { wrapper } = renderCodeEditor({ editorContentHeight: 240 });
    const item = findBox(wrapper);
    expect(item.getElement().style.height).toEqual('240px');
  });

  it('sets editor size to 20px if a smaller value are specified', () => {
    const { wrapper } = renderCodeEditor({ editorContentHeight: 10 });
    const item = findBox(wrapper);
    expect(item.getElement().style.height).toEqual('20px');
  });

  it('updates size when resize handle is dragged', () => {
    const { wrapper } = renderCodeEditor({ editorContentHeight: 10 });
    editorMock.resize.mockClear();
    fireEvent.mouseDown(wrapper.findByClassName(resizableStyles['resizable-box-handle'])!.getElement());
    fireEvent.mouseMove(document.body, { clientY: 100 });
    expect(editorMock.resize).toBeCalledTimes(1);
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

  test('a11y', async () => {
    const { wrapper } = renderCodeEditor();
    await expect(wrapper.getElement()).toValidateA11y();
  });

  describe('i18n', () => {
    test('supports using i18nStrings.loadingState from i18n provider', () => {
      const { container } = render(
        <TestI18nProvider messages={{ 'code-editor': { 'i18nStrings.loadingState': 'Custom loading' } }}>
          <CodeEditor {...defaultProps} ace={undefined} loading={true} i18nStrings={undefined} />
        </TestI18nProvider>
      );
      const wrapper = createWrapper(container).findCodeEditor()!;
      expect(wrapper.findLoadingScreen()!.getElement()).toHaveTextContent('Custom loading');
    });

    test('supports using i18nStrings.errorState and i18nStrings.errorStateRecovery from i18n provider', () => {
      const { container } = render(
        <TestI18nProvider
          messages={{
            'code-editor': {
              'i18nStrings.errorState': 'Custom error',
              'i18nStrings.errorStateRecovery': 'Custom recovery',
            },
          }}
        >
          <CodeEditor {...defaultProps} ace={undefined} i18nStrings={undefined} />
        </TestI18nProvider>
      );
      const wrapper = createWrapper(container).findCodeEditor()!;
      expect(wrapper.findErrorScreen()!.getElement()).toHaveTextContent('Custom error Custom recovery');
      expect(wrapper.findErrorScreen()!.find('a')!.getElement()).toHaveTextContent('Custom recovery');
    });

    test('supports using group aria label and status bar strings from i18n provider', () => {
      const { container } = render(
        <TestI18nProvider
          messages={{
            'code-editor': {
              'i18nStrings.editorGroupAriaLabel': 'Custom editor',
              'i18nStrings.statusBarGroupAriaLabel': 'Custom status bar',
              'i18nStrings.errorsTab': 'Custom errors',
              'i18nStrings.warningsTab': 'Custom warnings',
              'i18nStrings.preferencesButtonAriaLabel': 'Custom settings',
              'i18nStrings.cursorPosition': 'Custom row {row}, Custom col {column}',
            },
          }}
        >
          <CodeEditor {...defaultProps} i18nStrings={undefined} />
        </TestI18nProvider>
      );
      const wrapper = createWrapper(container).findCodeEditor()!;
      expect(wrapper.findEditor()!.getElement()).toHaveAttribute('aria-label', 'Custom editor');
      expect(wrapper.find('[aria-label="Custom status bar"]')).toBeTruthy();
      expect(wrapper.findStatusBar()!.getElement().textContent).toEqual(
        expect.stringContaining('Custom row 1, Custom col 1')
      );
      expect(wrapper.findErrorsTab()!.getElement()).toHaveTextContent('Custom errors: 0');
      expect(wrapper.findWarningsTab()!.getElement()).toHaveTextContent('Custom warnings: 0');
      expect(wrapper.findSettingsButton()!.getElement()).toHaveAttribute('aria-label', 'Custom settings');
    });
  });

  test('supports using pane props from i18n provider', () => {
    const { container } = render(
      <TestI18nProvider
        messages={{
          'code-editor': {
            'i18nStrings.paneCloseButtonAriaLabel': 'Custom close',
          },
        }}
      >
        <CodeEditor {...defaultProps} i18nStrings={undefined} />
      </TestI18nProvider>
    );
    const wrapper = createWrapper(container).findCodeEditor()!;
    act(() => emulateAceAnnotationEvent!());
    wrapper.findErrorsTab()!.click();
    expect(wrapper.findPane()!.findButton()!.getElement()).toHaveAttribute('aria-label', 'Custom close');
  });

  test('supports using preferences modal strings from i18n provider', () => {
    const { container } = render(
      <TestI18nProvider
        messages={{
          'code-editor': {
            'i18nStrings.preferencesModalHeader': 'Custom modal header',
            'i18nStrings.preferencesModalCancel': 'Custom cancel',
            'i18nStrings.preferencesModalConfirm': 'Custom confirm',
            'i18nStrings.preferencesModalWrapLines': 'Custom wrap lines',
            'i18nStrings.preferencesModalTheme': 'Custom theme',
            'i18nStrings.preferencesModalLightThemes': 'Custom light themes',
            'i18nStrings.preferencesModalDarkThemes': 'Custom dark themes',
          },
        }}
      >
        <CodeEditor {...defaultProps} themes={{ light: ['One'], dark: ['Two'] }} i18nStrings={undefined} />
      </TestI18nProvider>
    );
    const wrapper = createWrapper(container).findCodeEditor()!;
    wrapper.findSettingsButton()!.click();
    const modal = createWrapper().findModal()!;
    expect(modal.findHeader().getElement()).toHaveTextContent('Custom modal header');
    expect(modal.findFooter()!.findSpaceBetween()!.find(':nth-child(1)')!.findButton()!.getElement()).toHaveTextContent(
      'Custom cancel'
    );
    expect(modal.findFooter()!.findSpaceBetween()!.find(':nth-child(2)')!.findButton()!.getElement()).toHaveTextContent(
      'Custom confirm'
    );
    expect(modal.findContent()!.findCheckbox()!.findLabel().getElement()).toHaveTextContent('Custom wrap lines');
    expect(modal.findContent()!.findFormField()!.findLabel()!.getElement()).toHaveTextContent('Custom theme');
    modal.findContent()!.findSelect()!.openDropdown();
    expect(modal.findContent()!.findSelect()!.findDropdown().find('li:nth-child(1)')!.getElement()).toHaveTextContent(
      'Custom light themes'
    );
    expect(modal.findContent()!.findSelect()!.findDropdown().find('li:nth-child(2)')!.getElement()).toHaveTextContent(
      'Custom dark themes'
    );
  });
});
